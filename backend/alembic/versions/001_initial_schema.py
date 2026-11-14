"""Initial PostgreSQL schema for Molochny Mir digital platform

Revision ID: 001_initial
Revises:
Create Date: 2026-11-14
"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision: str = "001_initial"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute("CREATE EXTENSION IF NOT EXISTS pg_trgm;")

    op.create_table(
        "categories",
        sa.Column("id", sa.String(length=64), primary_key=True),
        sa.Column("slug", sa.String(length=128), nullable=False, unique=True),
        sa.Column("name", postgresql.JSONB(astext_type=sa.Text()), nullable=False),
        sa.Column("description", postgresql.JSONB(astext_type=sa.Text()), nullable=False),
        sa.Column("subcategories", postgresql.JSONB(astext_type=sa.Text()), nullable=False, server_default="[]"),
        sa.Column("filter_keys", postgresql.JSONB(astext_type=sa.Text()), nullable=False, server_default="[]"),
        sa.Column("characteristic_schema", postgresql.JSONB(astext_type=sa.Text()), nullable=False, server_default="[]"),
        sa.Column("seo", postgresql.JSONB(astext_type=sa.Text()), nullable=False),
        sa.Column("sort_order", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
    )
    op.create_index("ix_categories_slug", "categories", ["slug"])

    op.create_table(
        "products",
        sa.Column("id", sa.String(length=64), primary_key=True),
        sa.Column("slug", sa.String(length=160), nullable=False, unique=True),
        sa.Column("category_id", sa.String(length=64), sa.ForeignKey("categories.id", onupdate="CASCADE", ondelete="RESTRICT"), nullable=False),
        sa.Column("subcategory_id", sa.String(length=64), nullable=False, server_default="default"),
        sa.Column("name", postgresql.JSONB(astext_type=sa.Text()), nullable=False),
        sa.Column("description", postgresql.JSONB(astext_type=sa.Text()), nullable=False),
        sa.Column("image", sa.Text(), nullable=False),
        sa.Column("fat_content", sa.Float(), nullable=True),
        sa.Column("protein_content", sa.Float(), nullable=True),
        sa.Column("lactose_free", sa.Boolean(), nullable=False, server_default=sa.text("false")),
        sa.Column("export_ready", sa.Boolean(), nullable=False, server_default=sa.text("true")),
        sa.Column("featured", sa.Boolean(), nullable=False, server_default=sa.text("false")),
        sa.Column("visible", sa.Boolean(), nullable=False, server_default=sa.text("true")),
        sa.Column("characteristics", postgresql.JSONB(astext_type=sa.Text()), nullable=False, server_default="{}"),
        sa.Column("use_cases", postgresql.JSONB(astext_type=sa.Text()), nullable=False, server_default="[]"),
        sa.Column("related_ids", postgresql.JSONB(astext_type=sa.Text()), nullable=False, server_default="[]"),
        sa.Column("seo", postgresql.JSONB(astext_type=sa.Text()), nullable=False),
        sa.Column("search_text", sa.Text(), nullable=False, server_default=""),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
    )
    op.create_index("ix_products_slug", "products", ["slug"])
    op.create_index("ix_products_category_id", "products", ["category_id"])
    op.create_index("ix_products_visible", "products", ["visible"])
    op.create_index("ix_products_fat_content", "products", ["fat_content"])
    op.create_index("ix_products_protein_content", "products", ["protein_content"])
    op.create_index("ix_products_characteristics_gin", "products", ["characteristics"], postgresql_using="gin")
    op.create_index(
        "ix_products_search_trgm",
        "products",
        ["search_text"],
        postgresql_using="gin",
        postgresql_ops={"search_text": "gin_trgm_ops"},
    )

    op.create_table(
        "product_variants",
        sa.Column("id", sa.String(length=64), primary_key=True),
        sa.Column("product_id", sa.String(length=64), sa.ForeignKey("products.id", ondelete="CASCADE"), nullable=False),
        sa.Column("weight", sa.String(length=64), nullable=False),
        sa.Column("weight_grams", sa.Integer(), nullable=False),
        sa.Column("shelf_life", postgresql.JSONB(astext_type=sa.Text()), nullable=False),
        sa.Column("storage", postgresql.JSONB(astext_type=sa.Text()), nullable=False),
        sa.Column("packaging_type", postgresql.JSONB(astext_type=sa.Text()), nullable=False),
        sa.Column("units_per_box", sa.Integer(), nullable=False, server_default="1"),
        sa.Column("gtin", sa.String(length=32), nullable=False, server_default=""),
        sa.Column("sort_order", sa.Integer(), nullable=False, server_default="0"),
    )
    op.create_index("ix_product_variants_product_id", "product_variants", ["product_id"])
    op.create_index("ix_product_variants_weight_grams", "product_variants", ["weight_grams"])

    op.create_table(
        "news_articles",
        sa.Column("id", sa.String(length=64), primary_key=True),
        sa.Column("slug", sa.String(length=160), nullable=False, unique=True),
        sa.Column("published_date", sa.Date(), nullable=False),
        sa.Column("year", sa.Integer(), nullable=False),
        sa.Column("category_id", sa.String(length=32), nullable=False),
        sa.Column("title", postgresql.JSONB(astext_type=sa.Text()), nullable=False),
        sa.Column("excerpt", postgresql.JSONB(astext_type=sa.Text()), nullable=False),
        sa.Column("content", postgresql.JSONB(astext_type=sa.Text()), nullable=False),
        sa.Column("image", sa.Text(), nullable=False),
        sa.Column("published", sa.Boolean(), nullable=False, server_default=sa.text("true")),
        sa.Column("related_ids", postgresql.JSONB(astext_type=sa.Text()), nullable=False, server_default="[]"),
        sa.Column("seo", postgresql.JSONB(astext_type=sa.Text()), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
    )
    op.create_index("ix_news_articles_slug", "news_articles", ["slug"])
    op.create_index("ix_news_articles_year", "news_articles", ["year"])
    op.create_index("ix_news_articles_category_id", "news_articles", ["category_id"])

    op.create_table(
        "ui_translations",
        sa.Column("key", sa.String(length=128), primary_key=True),
        sa.Column("values", postgresql.JSONB(astext_type=sa.Text()), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
    )

    op.create_table(
        "redirects_301",
        sa.Column("id", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column("source_path", sa.String(length=512), nullable=False, unique=True),
        sa.Column("target_path", sa.String(length=512), nullable=False),
        sa.Column("status_code", sa.Integer(), nullable=False, server_default="301"),
        sa.Column("note", sa.Text(), nullable=False, server_default=""),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default=sa.text("true")),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
    )
    op.create_index("ix_redirects_301_source_path", "redirects_301", ["source_path"])

    op.create_table(
        "b2b_inquiries",
        sa.Column("id", sa.String(length=36), primary_key=True),
        sa.Column("company", sa.String(length=255), nullable=False),
        sa.Column("contact_name", sa.String(length=255), nullable=False),
        sa.Column("email", sa.String(length=255), nullable=False),
        sa.Column("phone", sa.String(length=64), nullable=False, server_default=""),
        sa.Column("country", sa.String(length=128), nullable=False, server_default=""),
        sa.Column("product_id", sa.String(length=64), sa.ForeignKey("products.id", ondelete="SET NULL"), nullable=True),
        sa.Column("package_id", sa.String(length=64), nullable=True),
        sa.Column("volume", sa.String(length=128), nullable=False, server_default=""),
        sa.Column("message", sa.Text(), nullable=False, server_default=""),
        sa.Column("channel", sa.String(length=32), nullable=False, server_default="wholesale"),
        sa.Column("language", sa.String(length=8), nullable=False, server_default="ru"),
        sa.Column("status", sa.String(length=32), nullable=False, server_default="new"),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
    )
    op.create_index("ix_b2b_inquiries_created_at", "b2b_inquiries", ["created_at"])


def downgrade() -> None:
    op.drop_table("b2b_inquiries")
    op.drop_table("redirects_301")
    op.drop_table("ui_translations")
    op.drop_table("news_articles")
    op.drop_table("product_variants")
    op.drop_table("products")
    op.drop_table("categories")
