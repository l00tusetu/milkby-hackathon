import asyncio
from datetime import date
from sqlalchemy import func, select, delete
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import async_session_factory
from app.models import (
    Category,
    NewsArticle,
    Product,
    ProductVariant,
    Redirect301,
    UITranslation,
)
from app.seed_data import (
    CATEGORIES_SEED,
    NEWS_SEED,
    PRODUCTS_SEED,
    REDIRECTS_SEED,
    UI_TRANSLATIONS_SEED,
)


def build_product_search_text(prod: dict, category_name: dict | None = None) -> str:
    parts: list[str] = [prod.get("id", ""), prod.get("slug", ""), prod.get("category", "")]
    for field in ("name", "description"):
        val = prod.get(field) or {}
        if isinstance(val, dict):
            parts.extend(str(v) for v in val.values() if v)
    if category_name:
        parts.extend(str(v) for v in category_name.values() if v)
    for char_val in (prod.get("characteristics") or {}).values():
        if isinstance(char_val, dict):
            parts.extend(str(v) for v in char_val.values() if v)
    for pkg in prod.get("packages") or []:
        parts.append(str(pkg.get("weight", "")))
        parts.append(str(pkg.get("gtin", "")))
        pt = pkg.get("packagingType") or {}
        if isinstance(pt, dict):
            parts.extend(str(v) for v in pt.values() if v)
    parts.extend(str(u) for u in (prod.get("useCases") or []))
    return " ".join(parts).lower()


async def seed_all(session: AsyncSession, force_reset: bool = False) -> None:
    if force_reset:
        await session.execute(delete(ProductVariant))
        await session.execute(delete(Product))
        await session.execute(delete(Category))
        await session.execute(delete(NewsArticle))
        await session.execute(delete(UITranslation))
        await session.execute(delete(Redirect301))
        await session.flush()

    cat_names: dict[str, dict] = {}
    for c_data in CATEGORIES_SEED:
        cat_names[c_data["id"]] = c_data["name"]
        existing = await session.get(Category, c_data["id"])
        if existing is None:
            session.add(
                Category(
                    id=c_data["id"],
                    slug=c_data["slug"],
                    name=c_data["name"],
                    description=c_data["description"],
                    subcategories=c_data["subcategories"],
                    filter_keys=c_data["filterKeys"],
                    characteristic_schema=c_data["characteristicSchema"],
                    seo=c_data["seo"],
                    sort_order=c_data.get("sort_order", 0),
                )
            )

    await session.flush()

    for p_data in PRODUCTS_SEED:
        existing_prod = await session.get(Product, p_data["id"])
        if existing_prod is None:
            search_text = build_product_search_text(p_data, cat_names.get(p_data["category"]))
            prod = Product(
                id=p_data["id"],
                slug=p_data["slug"],
                category_id=p_data["category"],
                subcategory_id=p_data.get("subcategory", "default"),
                name=p_data["name"],
                description=p_data["description"],
                image=p_data["image"],
                fat_content=p_data.get("fatContent"),
                protein_content=p_data.get("proteinContent"),
                lactose_free=p_data.get("lactoseFree", False),
                export_ready=p_data.get("exportReady", True),
                featured=p_data.get("featured", False),
                visible=p_data.get("visible", True),
                characteristics=p_data.get("characteristics", {}),
                use_cases=p_data.get("useCases", []),
                related_ids=p_data.get("relatedIds", []),
                seo=p_data["seo"],
                search_text=search_text,
            )
            for idx, pkg in enumerate(p_data.get("packages", [])):
                prod.variants.append(
                    ProductVariant(
                        id=pkg["id"],
                        weight=pkg["weight"],
                        weight_grams=pkg["weightGrams"],
                        shelf_life=pkg["shelfLife"],
                        storage=pkg["storage"],
                        packaging_type=pkg["packagingType"],
                        units_per_box=pkg.get("unitsPerBox", 1),
                        gtin=pkg.get("gtin", ""),
                        sort_order=idx,
                    )
                )
            session.add(prod)

    for n_data in NEWS_SEED:
        existing_news = await session.get(NewsArticle, n_data["id"])
        if existing_news is None:
            session.add(
                NewsArticle(
                    id=n_data["id"],
                    slug=n_data["slug"],
                    published_date=date.fromisoformat(n_data["date"]),
                    year=n_data["year"],
                    category_id=n_data["categoryId"],
                    title=n_data["title"],
                    excerpt=n_data["excerpt"],
                    content=n_data["content"],
                    image=n_data["image"],
                    published=n_data.get("published", True),
                    related_ids=n_data.get("relatedIds", []),
                    seo=n_data["seo"],
                )
            )

    for key, values in UI_TRANSLATIONS_SEED.items():
        existing_tr = await session.get(UITranslation, key)
        if existing_tr is None:
            session.add(UITranslation(key=key, values=values))

    for r_data in REDIRECTS_SEED:
        stmt = select(Redirect301).where(Redirect301.source_path == r_data["from"])
        res = await session.execute(stmt)
        if res.scalar_one_or_none() is None:
            session.add(
                Redirect301(
                    source_path=r_data["from"],
                    target_path=r_data["to"],
                    status_code=301,
                    note=r_data.get("note", ""),
                    is_active=True,
                )
            )

    await session.commit()


async def ensure_seeded() -> None:
    async with async_session_factory() as session:
        count = await session.scalar(select(func.count(Category.id)))
        if (count or 0) == 0:
            await seed_all(session, force_reset=False)


async def main() -> None:
    async with async_session_factory() as session:
        await seed_all(session, force_reset=False)
        prod_count = await session.scalar(select(func.count(Product.id)))
        news_count = await session.scalar(select(func.count(NewsArticle.id)))
        redir_count = await session.scalar(select(func.count(Redirect301.id)))
        print(f"Seed complete: {prod_count} products, {news_count} news articles, {redir_count} 301 redirects.")


if __name__ == "__main__":
    asyncio.run(main())
