from datetime import date, datetime
from sqlalchemy import (
    Boolean,
    Date,
    DateTime,
    Float,
    ForeignKey,
    Integer,
    String,
    Text,
    func,
)
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base


class Category(Base):
    __tablename__ = "categories"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    slug: Mapped[str] = mapped_column(String(128), unique=True, nullable=False, index=True)
    name: Mapped[dict] = mapped_column(JSONB, nullable=False)
    description: Mapped[dict] = mapped_column(JSONB, nullable=False)
    subcategories: Mapped[list] = mapped_column(JSONB, nullable=False, default=list)
    filter_keys: Mapped[list] = mapped_column(JSONB, nullable=False, default=list)
    characteristic_schema: Mapped[list] = mapped_column(JSONB, nullable=False, default=list)
    seo: Mapped[dict] = mapped_column(JSONB, nullable=False)
    sort_order: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    products: Mapped[list["Product"]] = relationship("Product", back_populates="category_rel")


class Product(Base):
    __tablename__ = "products"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    slug: Mapped[str] = mapped_column(String(160), unique=True, nullable=False, index=True)
    category_id: Mapped[str] = mapped_column(
        String(64),
        ForeignKey("categories.id", onupdate="CASCADE", ondelete="RESTRICT"),
        nullable=False,
        index=True,
    )
    subcategory_id: Mapped[str] = mapped_column(String(64), nullable=False, default="default")
    name: Mapped[dict] = mapped_column(JSONB, nullable=False)
    description: Mapped[dict] = mapped_column(JSONB, nullable=False)
    image: Mapped[str] = mapped_column(Text, nullable=False)
    fat_content: Mapped[float | None] = mapped_column(Float, nullable=True, index=True)
    protein_content: Mapped[float | None] = mapped_column(Float, nullable=True, index=True)
    lactose_free: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    export_ready: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    featured: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    visible: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True, index=True)
    characteristics: Mapped[dict] = mapped_column(JSONB, nullable=False, default=dict)
    use_cases: Mapped[list] = mapped_column(JSONB, nullable=False, default=list)
    related_ids: Mapped[list] = mapped_column(JSONB, nullable=False, default=list)
    seo: Mapped[dict] = mapped_column(JSONB, nullable=False)
    search_text: Mapped[str] = mapped_column(Text, nullable=False, default="")
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    category_rel: Mapped["Category"] = relationship("Category", back_populates="products")
    variants: Mapped[list["ProductVariant"]] = relationship(
        "ProductVariant",
        back_populates="product",
        cascade="all, delete-orphan",
        order_by="ProductVariant.sort_order",
        lazy="selectin",
    )


class ProductVariant(Base):
    __tablename__ = "product_variants"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    product_id: Mapped[str] = mapped_column(
        String(64),
        ForeignKey("products.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    weight: Mapped[str] = mapped_column(String(64), nullable=False)
    weight_grams: Mapped[int] = mapped_column(Integer, nullable=False, index=True)
    shelf_life: Mapped[dict] = mapped_column(JSONB, nullable=False)
    storage: Mapped[dict] = mapped_column(JSONB, nullable=False)
    packaging_type: Mapped[dict] = mapped_column(JSONB, nullable=False)
    units_per_box: Mapped[int] = mapped_column(Integer, nullable=False, default=1)
    gtin: Mapped[str] = mapped_column(String(32), nullable=False, default="")
    sort_order: Mapped[int] = mapped_column(Integer, nullable=False, default=0)

    product: Mapped["Product"] = relationship("Product", back_populates="variants")


class NewsArticle(Base):
    __tablename__ = "news_articles"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    slug: Mapped[str] = mapped_column(String(160), unique=True, nullable=False, index=True)
    published_date: Mapped[date] = mapped_column(Date, nullable=False)
    year: Mapped[int] = mapped_column(Integer, nullable=False, index=True)
    category_id: Mapped[str] = mapped_column(String(32), nullable=False, index=True)
    title: Mapped[dict] = mapped_column(JSONB, nullable=False)
    excerpt: Mapped[dict] = mapped_column(JSONB, nullable=False)
    content: Mapped[dict] = mapped_column(JSONB, nullable=False)
    image: Mapped[str] = mapped_column(Text, nullable=False)
    published: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    related_ids: Mapped[list] = mapped_column(JSONB, nullable=False, default=list)
    seo: Mapped[dict] = mapped_column(JSONB, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())


class UITranslation(Base):
    __tablename__ = "ui_translations"

    key: Mapped[str] = mapped_column(String(128), primary_key=True)
    values: Mapped[dict] = mapped_column(JSONB, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())


class Redirect301(Base):
    __tablename__ = "redirects_301"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    source_path: Mapped[str] = mapped_column(String(512), unique=True, nullable=False, index=True)
    target_path: Mapped[str] = mapped_column(String(512), nullable=False)
    status_code: Mapped[int] = mapped_column(Integer, nullable=False, default=301)
    note: Mapped[str] = mapped_column(Text, nullable=False, default="")
    is_active: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())


class B2BInquiry(Base):
    __tablename__ = "b2b_inquiries"

    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    company: Mapped[str] = mapped_column(String(255), nullable=False)
    contact_name: Mapped[str] = mapped_column(String(255), nullable=False)
    email: Mapped[str] = mapped_column(String(255), nullable=False)
    phone: Mapped[str] = mapped_column(String(64), nullable=False, default="")
    country: Mapped[str] = mapped_column(String(128), nullable=False, default="")
    product_id: Mapped[str | None] = mapped_column(
        String(64),
        ForeignKey("products.id", ondelete="SET NULL"),
        nullable=True,
    )
    package_id: Mapped[str | None] = mapped_column(String(64), nullable=True)
    volume: Mapped[str] = mapped_column(String(128), nullable=False, default="")
    message: Mapped[str] = mapped_column(Text, nullable=False, default="")
    channel: Mapped[str] = mapped_column(String(32), nullable=False, default="wholesale")
    language: Mapped[str] = mapped_column(String(8), nullable=False, default="ru")
    status: Mapped[str] = mapped_column(String(32), nullable=False, default="new")
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), index=True)
