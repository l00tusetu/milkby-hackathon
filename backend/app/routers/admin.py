import os
import uuid
from datetime import date
from pathlib import Path
from fastapi import APIRouter, Depends, File, Header, HTTPException, UploadFile, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import settings
from app.database import get_db
from app.models import (
    B2BInquiry,
    Category,
    NewsArticle,
    Product,
    ProductVariant,
    Redirect301,
    UITranslation,
)
from app.schemas import (
    B2BInquiryResponse,
    BulkImportResult,
    CategorySchema,
    LocalizedText,
    NewsArticleSchema,
    ProductSchema,
    RedirectRuleSchema,
    SeoAuditResponse,
    TranslationUpdateRequest,
    orm_category_to_schema,
    orm_news_to_schema,
    orm_product_to_schema,
    orm_redirect_to_schema,
)
from app.seed import build_product_search_text, seed_all
from app.services.importer import (
    bulk_import_news,
    bulk_import_products,
    bulk_import_redirects,
)


def verify_admin(x_admin_key: str | None = Header(default=None)):
    if settings.admin_api_key and x_admin_key != settings.admin_api_key:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid X-Admin-Key")


router = APIRouter(prefix="/api/v1", tags=["Admin CMS & Migration"], dependencies=[Depends(verify_admin)])


# --- Products CRUD ---
@router.post("/admin/products", response_model=ProductSchema, status_code=201)
async def create_product(payload: ProductSchema, db: AsyncSession = Depends(get_db)):
    if await db.get(Product, payload.id):
        raise HTTPException(status_code=409, detail="Product ID already exists")

    cat = await db.get(Category, payload.category)
    if not cat:
        raise HTTPException(status_code=400, detail="Invalid category ID")

    prod_dict = payload.model_dump(by_alias=True)
    prod = Product(
        id=payload.id,
        slug=payload.slug,
        category_id=payload.category,
        subcategory_id=payload.subcategory,
        name=prod_dict["name"],
        description=prod_dict["description"],
        image=payload.image,
        fat_content=payload.fat_content,
        protein_content=payload.protein_content,
        lactose_free=payload.lactose_free,
        export_ready=payload.export_ready,
        featured=payload.featured,
        visible=payload.visible,
        characteristics=prod_dict["characteristics"],
        use_cases=payload.use_cases,
        related_ids=payload.related_ids,
        seo=prod_dict["seo"],
        search_text=build_product_search_text(prod_dict, cat.name),
    )
    for idx, pk in enumerate(prod_dict["packages"]):
        prod.variants.append(
            ProductVariant(
                id=pk["id"],
                weight=pk["weight"],
                weight_grams=pk["weightGrams"],
                shelf_life=pk["shelfLife"],
                storage=pk["storage"],
                packaging_type=pk["packagingType"],
                units_per_box=pk["unitsPerBox"],
                gtin=pk["gtin"],
                sort_order=idx,
            )
        )
    db.add(prod)
    await db.commit()
    await db.refresh(prod)
    return orm_product_to_schema(prod)


@router.put("/admin/products/{product_id}", response_model=ProductSchema)
async def update_product(product_id: str, payload: ProductSchema, db: AsyncSession = Depends(get_db)):
    prod = await db.get(Product, product_id)
    if not prod:
        raise HTTPException(status_code=404, detail="Product not found")

    cat = await db.get(Category, payload.category)
    prod_dict = payload.model_dump(by_alias=True)
    prod.slug = payload.slug
    prod.category_id = payload.category
    prod.subcategory_id = payload.subcategory
    prod.name = prod_dict["name"]
    prod.description = prod_dict["description"]
    prod.image = payload.image
    prod.fat_content = payload.fat_content
    prod.protein_content = payload.protein_content
    prod.lactose_free = payload.lactose_free
    prod.export_ready = payload.export_ready
    prod.featured = payload.featured
    prod.visible = payload.visible
    prod.characteristics = prod_dict["characteristics"]
    prod.use_cases = payload.use_cases
    prod.related_ids = payload.related_ids
    prod.seo = prod_dict["seo"]
    prod.search_text = build_product_search_text(prod_dict, cat.name if cat else None)

    prod.variants.clear()
    await db.flush()
    for idx, pk in enumerate(prod_dict["packages"]):
        prod.variants.append(
            ProductVariant(
                id=pk["id"],
                weight=pk["weight"],
                weight_grams=pk["weightGrams"],
                shelf_life=pk["shelfLife"],
                storage=pk["storage"],
                packaging_type=pk["packagingType"],
                units_per_box=pk["unitsPerBox"],
                gtin=pk["gtin"],
                sort_order=idx,
            )
        )

    await db.commit()
    await db.refresh(prod)
    return orm_product_to_schema(prod)


@router.patch("/admin/products/{product_id}/visibility", response_model=ProductSchema)
async def toggle_product_visibility(product_id: str, db: AsyncSession = Depends(get_db)):
    prod = await db.get(Product, product_id)
    if not prod:
        raise HTTPException(status_code=404, detail="Product not found")
    prod.visible = not prod.visible
    await db.commit()
    await db.refresh(prod)
    return orm_product_to_schema(prod)


@router.delete("/admin/products/{product_id}", status_code=204)
async def delete_product(product_id: str, db: AsyncSession = Depends(get_db)):
    prod = await db.get(Product, product_id)
    if not prod:
        raise HTTPException(status_code=404, detail="Product not found")
    await db.delete(prod)
    await db.commit()


# --- Categories CRUD ---
@router.post("/admin/categories", response_model=CategorySchema, status_code=201)
async def create_category(payload: CategorySchema, db: AsyncSession = Depends(get_db)):
    if await db.get(Category, payload.id):
        raise HTTPException(status_code=409, detail="Category ID already exists")
    d = payload.model_dump(by_alias=True)
    cat = Category(
        id=payload.id,
        slug=payload.slug,
        name=d["name"],
        description=d["description"],
        subcategories=d["subcategories"],
        filter_keys=d["filterKeys"],
        characteristic_schema=d["characteristicSchema"],
        seo=d["seo"],
        sort_order=99,
    )
    db.add(cat)
    await db.commit()
    await db.refresh(cat)
    return orm_category_to_schema(cat)


@router.put("/admin/categories/{category_id}", response_model=CategorySchema)
async def update_category(category_id: str, payload: CategorySchema, db: AsyncSession = Depends(get_db)):
    cat = await db.get(Category, category_id)
    if not cat:
        raise HTTPException(status_code=404, detail="Category not found")
    d = payload.model_dump(by_alias=True)
    cat.slug = payload.slug
    cat.name = d["name"]
    cat.description = d["description"]
    cat.subcategories = d["subcategories"]
    cat.filter_keys = d["filterKeys"]
    cat.characteristic_schema = d["characteristicSchema"]
    cat.seo = d["seo"]
    await db.commit()
    await db.refresh(cat)
    return orm_category_to_schema(cat)


@router.delete("/admin/categories/{category_id}", status_code=204)
async def delete_category(category_id: str, db: AsyncSession = Depends(get_db)):
    cat = await db.get(Category, category_id)
    if not cat:
        raise HTTPException(status_code=404, detail="Category not found")
    has_products = (await db.execute(select(Product.id).where(Product.category_id == category_id).limit(1))).first()
    if has_products:
        raise HTTPException(status_code=400, detail="Cannot delete category with assigned products")
    await db.delete(cat)
    await db.commit()


# --- News CRUD ---
@router.post("/admin/news", response_model=NewsArticleSchema, status_code=201)
async def create_news(payload: NewsArticleSchema, db: AsyncSession = Depends(get_db)):
    if await db.get(NewsArticle, payload.id):
        raise HTTPException(status_code=409, detail="News ID already exists")
    d = payload.model_dump(by_alias=True)
    art = NewsArticle(
        id=payload.id,
        slug=payload.slug,
        published_date=date.fromisoformat(payload.date),
        year=payload.year,
        category_id=payload.category_id,
        title=d["title"],
        excerpt=d["excerpt"],
        content=d["content"],
        image=payload.image,
        published=payload.published,
        related_ids=payload.related_ids,
        seo=d["seo"],
    )
    db.add(art)
    await db.commit()
    await db.refresh(art)
    return orm_news_to_schema(art)


@router.put("/admin/news/{news_id}", response_model=NewsArticleSchema)
async def update_news(news_id: str, payload: NewsArticleSchema, db: AsyncSession = Depends(get_db)):
    art = await db.get(NewsArticle, news_id)
    if not art:
        raise HTTPException(status_code=404, detail="Article not found")
    d = payload.model_dump(by_alias=True)
    art.slug = payload.slug
    art.published_date = date.fromisoformat(payload.date)
    art.year = payload.year
    art.category_id = payload.category_id
    art.title = d["title"]
    art.excerpt = d["excerpt"]
    art.content = d["content"]
    art.image = payload.image
    art.published = payload.published
    art.related_ids = payload.related_ids
    art.seo = d["seo"]
    await db.commit()
    await db.refresh(art)
    return orm_news_to_schema(art)


@router.patch("/admin/news/{news_id}/publish", response_model=NewsArticleSchema)
async def toggle_news_publish(news_id: str, db: AsyncSession = Depends(get_db)):
    art = await db.get(NewsArticle, news_id)
    if not art:
        raise HTTPException(status_code=404, detail="Article not found")
    art.published = not art.published
    await db.commit()
    await db.refresh(art)
    return orm_news_to_schema(art)


@router.delete("/admin/news/{news_id}", status_code=204)
async def delete_news(news_id: str, db: AsyncSession = Depends(get_db)):
    art = await db.get(NewsArticle, news_id)
    if not art:
        raise HTTPException(status_code=404, detail="Article not found")
    await db.delete(art)
    await db.commit()


# --- UI Translations ---
@router.put("/admin/translations", response_model=dict[str, LocalizedText])
async def update_ui_translation(payload: TranslationUpdateRequest, db: AsyncSession = Depends(get_db)):
    tr = await db.get(UITranslation, payload.key)
    if tr is None:
        values = {"ru": "", "be": "", "en": "", "zh": ""}
        values[payload.language] = payload.value
        tr = UITranslation(key=payload.key, values=values)
        db.add(tr)
    else:
        values = dict(tr.values)
        values[payload.language] = payload.value
        tr.values = values
    await db.commit()
    rows = (await db.execute(select(UITranslation))).scalars().all()
    return {r.key: LocalizedText(**r.values) for r in rows}


# --- 301 Redirects CRUD ---
@router.get("/admin/redirects", response_model=list[RedirectRuleSchema])
async def list_redirects(db: AsyncSession = Depends(get_db)):
    rows = (await db.execute(select(Redirect301).order_by(Redirect301.id.desc()))).scalars().all()
    return [orm_redirect_to_schema(r) for r in rows]


@router.post("/admin/redirects", response_model=RedirectRuleSchema, status_code=201)
async def create_redirect(payload: RedirectRuleSchema, db: AsyncSession = Depends(get_db)):
    src = payload.source if payload.source.startswith("/") else f"/{payload.source}"
    existing = (await db.execute(select(Redirect301).where(Redirect301.source_path == src))).scalar_one_or_none()
    if existing:
        existing.target_path = payload.target
        existing.note = payload.note
        await db.commit()
        await db.refresh(existing)
        return orm_redirect_to_schema(existing)

    rule = Redirect301(
        source_path=src,
        target_path=payload.target,
        status_code=301,
        note=payload.note,
        is_active=True,
    )
    db.add(rule)
    await db.commit()
    await db.refresh(rule)
    return orm_redirect_to_schema(rule)


@router.delete("/admin/redirects/{redirect_id}", status_code=204)
async def delete_redirect(redirect_id: int, db: AsyncSession = Depends(get_db)):
    rule = await db.get(Redirect301, redirect_id)
    if not rule:
        raise HTTPException(status_code=404, detail="Redirect rule not found")
    await db.delete(rule)
    await db.commit()


# --- B2B Inquiries Viewer ---
@router.get("/admin/inquiries", response_model=list[B2BInquiryResponse])
async def list_b2b_inquiries(db: AsyncSession = Depends(get_db)):
    rows = (await db.execute(select(B2BInquiry).order_by(B2BInquiry.created_at.desc()))).scalars().all()
    return [B2BInquiryResponse.model_validate(r) for r in rows]


# --- Media Upload ---
@router.post("/admin/upload")
async def upload_media(file: UploadFile = File(...)):
    ext = Path(file.filename or "upload.jpg").suffix.lower()
    if ext not in {".jpg", ".jpeg", ".png", ".webp", ".avif", ".svg"}:
        raise HTTPException(status_code=400, detail="Unsupported image format")
    os.makedirs(settings.media_dir, exist_ok=True)
    name = f"{uuid.uuid4().hex}{ext}"
    dest = Path(settings.media_dir) / name
    content = await file.read()
    dest.write_bytes(content)
    return {"url": f"/api/v1/media/{name}"}


# --- Bulk Migration Importers ---
@router.post("/admin/import/products", response_model=BulkImportResult)
async def import_products_endpoint(file: UploadFile = File(...), db: AsyncSession = Depends(get_db)):
    raw = await file.read()
    return await bulk_import_products(db, raw, file.filename or "import.json")


@router.post("/admin/import/redirects", response_model=BulkImportResult)
async def import_redirects_endpoint(file: UploadFile = File(...), db: AsyncSession = Depends(get_db)):
    raw = await file.read()
    return await bulk_import_redirects(db, raw, file.filename or "redirects.csv")


@router.post("/admin/import/news", response_model=BulkImportResult)
async def import_news_endpoint(file: UploadFile = File(...), db: AsyncSession = Depends(get_db)):
    raw = await file.read()
    return await bulk_import_news(db, raw)


# --- Reset Demo Seed ---
@router.post("/admin/reset-demo")
async def reset_demo_endpoint(db: AsyncSession = Depends(get_db)):
    await seed_all(db, force_reset=True)
    return {"status": "reset_complete"}


# --- SEO Audit ---
@router.get("/seo/audit", response_model=SeoAuditResponse)
async def seo_audit(db: AsyncSession = Depends(get_db)):
    prods = (await db.execute(select(Product).where(Product.visible.is_(True)))).scalars().all()
    cats = (await db.execute(select(Category))).scalars().all()
    news = (await db.execute(select(NewsArticle).where(NewsArticle.published.is_(True)))).scalars().all()
    redirs = (await db.execute(select(Redirect301))).scalars().all()

    unique_titles: dict[str, int] = {}
    dup_titles: dict[str, list[str]] = {}
    for lang in ("ru", "be", "en", "zh"):
        seen: set[str] = set()
        dups: list[str] = []
        for p in prods:
            t = (p.seo or {}).get("title", {}).get(lang) or (p.name or {}).get(lang, "")
            if t in seen:
                dups.append(t)
            else:
                seen.add(t)
        unique_titles[lang] = len(seen)
        dup_titles[lang] = dups

    static_count = 7
    sitemap_url_count = (static_count + len(cats) + len(prods) + len(news)) * 4
    return SeoAuditResponse(
        total_products=len(prods),
        unique_titles_by_lang=unique_titles,
        duplicate_titles_by_lang=dup_titles,
        total_news=len(news),
        total_redirects=len(redirs),
        sitemap_url_count=sitemap_url_count,
    )
