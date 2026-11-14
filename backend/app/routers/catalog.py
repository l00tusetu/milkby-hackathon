import json
import math
from urllib.parse import quote
from fastapi import APIRouter, Depends, HTTPException, Query, Response
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models import (
    Category,
    NewsArticle,
    Product,
    Redirect301,
    UITranslation,
)
from app.schemas import (
    AutocompleteResponse,
    AutocompleteSuggestionSchema,
    BootstrapResponse,
    CategorySchema,
    Language,
    LocalizedText,
    ProductListResponse,
    ProductSchema,
    orm_category_to_schema,
    orm_news_to_schema,
    orm_product_to_schema,
    orm_redirect_to_schema,
)
from app.services.pdf_generator import generate_product_spec_pdf
from app.services.smart_match import parse_shelf_life_days, run_smart_select

router = APIRouter(prefix="/api/v1", tags=["Catalog & Search"])


@router.get("/health")
async def health_check(db: AsyncSession = Depends(get_db)):
    prod_count = await db.scalar(select(func.count(Product.id)))
    cat_count = await db.scalar(select(func.count(Category.id)))
    news_count = await db.scalar(select(func.count(NewsArticle.id)))
    redir_count = await db.scalar(select(func.count(Redirect301.id)))
    return {
        "status": "ok",
        "database": "postgresql",
        "counts": {
            "categories": cat_count or 0,
            "products": prod_count or 0,
            "news": news_count or 0,
            "redirects": redir_count or 0,
        },
    }


@router.get("/bootstrap", response_model=BootstrapResponse)
async def get_bootstrap(db: AsyncSession = Depends(get_db)):
    cats = (await db.execute(select(Category).order_by(Category.sort_order, Category.id))).scalars().all()
    prods = (await db.execute(select(Product).order_by(Product.featured.desc(), Product.id))).scalars().all()
    news = (await db.execute(select(NewsArticle).order_by(NewsArticle.published_date.desc()))).scalars().all()
    redirs = (await db.execute(select(Redirect301).order_by(Redirect301.id.desc()))).scalars().all()
    trans = (await db.execute(select(UITranslation))).scalars().all()

    return BootstrapResponse(
        categories=[orm_category_to_schema(c) for c in cats],
        products=[orm_product_to_schema(p) for p in prods],
        news=[orm_news_to_schema(n) for n in news],
        redirects=[orm_redirect_to_schema(r) for r in redirs],
        translations={t.key: LocalizedText(**t.values) for t in trans},
    )


@router.get("/categories", response_model=list[CategorySchema])
async def list_categories(db: AsyncSession = Depends(get_db)):
    rows = (await db.execute(select(Category).order_by(Category.sort_order, Category.id))).scalars().all()
    return [orm_category_to_schema(c) for c in rows]


@router.get("/categories/{slug}", response_model=CategorySchema)
async def get_category(slug: str, db: AsyncSession = Depends(get_db)):
    stmt = select(Category).where((Category.slug == slug) | (Category.id == slug))
    cat = (await db.execute(stmt)).scalar_one_or_none()
    if cat is None:
        raise HTTPException(status_code=404, detail="Category not found")
    return orm_category_to_schema(cat)


@router.get("/products", response_model=ProductListResponse)
async def list_products(
    lang: Language = Query("ru"),
    q: str = Query("", max_length=300),
    category: str = Query("all"),
    subcategory: str = Query("all"),
    fat_range: str = Query("all"),
    fat_min: float | None = Query(None),
    fat_max: float | None = Query(None),
    weight_range: str = Query("all"),
    shelf_life_range: str = Query("all"),
    protein_min: float | None = Query(None),
    lactose_free: bool = Query(False),
    high_protein: bool = Query(False),
    export_ready: bool = Query(False),
    featured: bool | None = Query(None),
    include_hidden: bool = Query(False),
    characteristics: str = Query(""),
    sort_by: str = Query("featured"),
    page: int = Query(1, ge=1),
    page_size: int = Query(50, ge=1, le=200),
    db: AsyncSession = Depends(get_db),
):
    stmt = select(Product)
    if not include_hidden:
        stmt = stmt.where(Product.visible.is_(True))
    if category != "all":
        stmt = stmt.where(Product.category_id == category)
    if subcategory != "all":
        stmt = stmt.where(Product.subcategory_id == subcategory)
    if fat_min is not None:
        stmt = stmt.where(Product.fat_content >= fat_min)
    if fat_max is not None:
        stmt = stmt.where(Product.fat_content <= fat_max)
    if fat_range == "low":
        stmt = stmt.where(Product.fat_content <= 5.0)
    elif fat_range == "medium":
        stmt = stmt.where(Product.fat_content >= 15.0, Product.fat_content <= 35.0)
    elif fat_range == "high":
        stmt = stmt.where(Product.fat_content >= 45.0)
    if protein_min is not None:
        stmt = stmt.where(Product.protein_content >= protein_min)
    if lactose_free:
        stmt = stmt.where(Product.lactose_free.is_(True))
    if high_protein:
        stmt = stmt.where(Product.protein_content >= 8.0)
    if export_ready:
        stmt = stmt.where(Product.export_ready.is_(True))
    if featured is not None:
        stmt = stmt.where(Product.featured.is_(featured))

    orm_products = (await db.execute(stmt)).scalars().all()
    schemas = [orm_product_to_schema(p) for p in orm_products]

    # Weight & shelf-life variant filters
    if weight_range != "all":
        if weight_range == "retail":
            schemas = [p for p in schemas if any(pk.weight_grams <= 250 for pk in p.packages)]
        elif weight_range == "medium":
            schemas = [p for p in schemas if any(250 < pk.weight_grams <= 1000 for pk in p.packages)]
        elif weight_range == "bulk":
            schemas = [p for p in schemas if any(pk.weight_grams > 1000 for pk in p.packages)]

    if shelf_life_range != "all":
        def _matches_shelf(p: ProductSchema) -> bool:
            for pk in p.packages:
                days = parse_shelf_life_days(pk.shelf_life.ru or pk.shelf_life.en)
                if shelf_life_range == "fresh" and 0 < days <= 21:
                    return True
                if shelf_life_range == "medium" and 21 < days <= 90:
                    return True
                if shelf_life_range == "long" and days > 90:
                    return True
            return False
        schemas = [p for p in schemas if _matches_shelf(p)]

    # Dynamic JSONB characteristic filters
    if characteristics.strip():
        try:
            char_filters: dict[str, str] = json.loads(characteristics)
            for ck, cv in char_filters.items():
                if not cv or cv == "all":
                    continue
                schemas = [
                    p
                    for p in schemas
                    if ck in p.characteristics
                    and (getattr(p.characteristics[ck], lang) or p.characteristics[ck].ru) == cv
                ]
        except Exception:
            pass

    # Smart text query ranking if q provided
    score_map: dict[str, float] = {}
    if q.strip():
        cats = [orm_category_to_schema(c) for c in (await db.execute(select(Category))).scalars().all()]
        matched, _, _, _ = await run_smart_select(q.strip(), schemas, cats, lang, allow_llm=False)
        score_map = {m.product.id: m.score for m in matched}
        schemas = [m.product for m in matched]

    if sort_by == "featured":
        if score_map:
            schemas.sort(key=lambda p: (-score_map.get(p.id, 0.0), -int(p.featured)))
        else:
            schemas.sort(key=lambda p: (-int(p.featured), p.id))
    elif sort_by == "fat-asc":
        schemas.sort(key=lambda p: p.fat_content if p.fat_content is not None else 0.0)
    elif sort_by == "fat-desc":
        schemas.sort(key=lambda p: -(p.fat_content if p.fat_content is not None else 0.0))
    elif sort_by == "protein-desc":
        schemas.sort(key=lambda p: -(p.protein_content if p.protein_content is not None else 0.0))
    elif sort_by == "name":
        schemas.sort(key=lambda p: (getattr(p.name, lang) or p.name.ru).lower())

    total = len(schemas)
    total_pages = max(1, math.ceil(total / page_size))
    start = (page - 1) * page_size
    page_items = schemas[start : start + page_size]

    return ProductListResponse(
        items=page_items,
        total=total,
        page=page,
        page_size=page_size,
        total_pages=total_pages,
    )


@router.get("/products/{slug}", response_model=ProductSchema)
async def get_product(slug: str, db: AsyncSession = Depends(get_db)):
    stmt = select(Product).where((Product.slug == slug) | (Product.id == slug))
    prod = (await db.execute(stmt)).scalar_one_or_none()
    if prod is None:
        raise HTTPException(status_code=404, detail="Product not found")
    return orm_product_to_schema(prod)


@router.get("/products/{slug}/spec.pdf")
async def download_product_spec_pdf(
    slug: str,
    lang: Language = Query("ru"),
    db: AsyncSession = Depends(get_db),
):
    stmt = select(Product).where((Product.slug == slug) | (Product.id == slug))
    prod = (await db.execute(stmt)).scalar_one_or_none()
    if prod is None:
        raise HTTPException(status_code=404, detail="Product not found")

    cat = await db.get(Category, prod.category_id)
    prod_schema = orm_product_to_schema(prod)
    cat_schema = orm_category_to_schema(cat) if cat else None

    pdf_bytes = generate_product_spec_pdf(prod_schema, cat_schema, lang)
    filename = f"molochny-mir-{prod.slug}-spec-{lang}.pdf"
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f"attachment; filename*=UTF-8''{quote(filename)}",
            "Cache-Control": "no-store",
        },
    )


@router.get("/search/autocomplete", response_model=AutocompleteResponse)
async def search_autocomplete(
    q: str = Query("", max_length=200),
    lang: Language = Query("ru"),
    limit: int = Query(6, ge=1, le=20),
    db: AsyncSession = Depends(get_db),
):
    trimmed = q.strip()
    if not trimmed:
        return AutocompleteResponse(query="", suggestions=[], total_matches=0)

    prods = [orm_product_to_schema(p) for p in (await db.execute(select(Product).where(Product.visible.is_(True)))).scalars().all()]
    cats = [orm_category_to_schema(c) for c in (await db.execute(select(Category))).scalars().all()]
    cat_map = {c.id: c for c in cats}

    results, criteria, corrected, _ = await run_smart_select(trimmed, prods, cats, lang, allow_llm=False)
    suggestions = []
    for item in results[:limit]:
        c = cat_map.get(item.product.category)
        suggestions.append(
            AutocompleteSuggestionSchema(
                id=item.product.id,
                slug=item.product.slug,
                name=item.product.name,
                category=item.product.category,
                category_name=c.name if c else LocalizedText(ru=item.product.category, be=item.product.category, en=item.product.category, zh=item.product.category),
                image=item.product.image,
                fat_content=item.product.fat_content,
                recommended_package=item.recommended_package,
            )
        )

    return AutocompleteResponse(
        query=trimmed,
        corrected_query=corrected,
        criteria=criteria,
        suggestions=suggestions,
        total_matches=len(results),
    )


@router.get("/translations", response_model=dict[str, LocalizedText])
async def get_translations(db: AsyncSession = Depends(get_db)):
    rows = (await db.execute(select(UITranslation))).scalars().all()
    return {r.key: LocalizedText(**r.values) for r in rows}
