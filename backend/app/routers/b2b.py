import uuid
from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models import B2BInquiry, Product
from app.schemas import B2BInquiryCreate, B2BInquiryResponse

router = APIRouter(prefix="/api/v1", tags=["B2B & Export Inquiries"])


@router.post("/b2b-inquiries", response_model=B2BInquiryResponse, status_code=status.HTTP_201_CREATED)
async def create_b2b_inquiry(
    payload: B2BInquiryCreate,
    db: AsyncSession = Depends(get_db),
):
    product_id = payload.product_id
    if product_id:
        existing_prod = await db.get(Product, product_id)
        if existing_prod is None:
            product_id = None

    inquiry = B2BInquiry(
        id=str(uuid.uuid4()),
        company=payload.company.strip(),
        contact_name=payload.contact_name.strip(),
        email=payload.email.strip(),
        phone=payload.phone.strip(),
        country=payload.country.strip(),
        product_id=product_id,
        package_id=payload.package_id,
        volume=payload.volume.strip(),
        message=payload.message.strip(),
        channel=payload.channel,
        language=payload.language,
        status="new",
    )
    db.add(inquiry)
    await db.commit()
    await db.refresh(inquiry)
    return B2BInquiryResponse.model_validate(inquiry)
