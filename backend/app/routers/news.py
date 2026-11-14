import math
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models import NewsArticle
from app.schemas import NewsArticleSchema, NewsListResponse, orm_news_to_schema

router = APIRouter(prefix="/api/v1/news", tags=["Newsroom"])


@router.get("", response_model=NewsListResponse)
async def list_news(
    category: str = Query("all"),
    year: int | None = Query(None),
    q: str = Query("", max_length=200),
    include_unpublished: bool = Query(False),
    page: int = Query(1, ge=1),
    page_size: int = Query(50, ge=1, le=200),
    db: AsyncSession = Depends(get_db),
):
    stmt = select(NewsArticle).order_by(NewsArticle.published_date.desc())
    if not include_unpublished:
        stmt = stmt.where(NewsArticle.published.is_(True))
    if category != "all":
        stmt = stmt.where(NewsArticle.category_id == category)
    if year is not None:
        stmt = stmt.where(NewsArticle.year == year)

    rows = (await db.execute(stmt)).scalars().all()
    items = [orm_news_to_schema(n) for n in rows]

    if q.strip():
        needle = q.strip().lower()
        def _matches(n: NewsArticleSchema) -> bool:
            haystack = " ".join([
                n.title.ru, n.title.be, n.title.en, n.title.zh,
                n.excerpt.ru, n.excerpt.be, n.excerpt.en, n.excerpt.zh,
                n.content.ru, n.content.be, n.content.en, n.content.zh,
            ]).lower()
            return needle in haystack
        items = [n for n in items if _matches(n)]

    total = len(items)
    total_pages = max(1, math.ceil(total / page_size))
    start = (page - 1) * page_size
    return NewsListResponse(
        items=items[start : start + page_size],
        total=total,
        page=page,
        page_size=page_size,
        total_pages=total_pages,
    )


@router.get("/{slug}", response_model=NewsArticleSchema)
async def get_news_article(slug: str, db: AsyncSession = Depends(get_db)):
    stmt = select(NewsArticle).where((NewsArticle.slug == slug) | (NewsArticle.id == slug))
    art = (await db.execute(stmt)).scalar_one_or_none()
    if art is None:
        raise HTTPException(status_code=404, detail="News article not found")
    return orm_news_to_schema(art)
