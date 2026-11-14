from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models import Category, Product
from app.schemas import (
    SmartSelectRequest,
    SmartSelectResponse,
    orm_category_to_schema,
    orm_product_to_schema,
)
from app.services.smart_match import run_smart_select

router = APIRouter(prefix="/api/v1/ai", tags=["AI Smart Product Selection"])


@router.post("/smart-select", response_model=SmartSelectResponse)
async def smart_select(
    payload: SmartSelectRequest,
    db: AsyncSession = Depends(get_db),
):
    prods = [
        orm_product_to_schema(p)
        for p in (await db.execute(select(Product).where(Product.visible.is_(True)))).scalars().all()
    ]
    cats = [orm_category_to_schema(c) for c in (await db.execute(select(Category))).scalars().all()]

    results, criteria, corrected, mode = await run_smart_select(
        payload.query,
        prods,
        cats,
        payload.language,
        allow_llm=True,
    )
    return SmartSelectResponse(
        query=payload.query,
        corrected_query=corrected,
        mode=mode,  # "llm+db" if Gemini extracted intents, else "nlp+db"
        criteria=criteria,
        results=results[: payload.limit],
    )
