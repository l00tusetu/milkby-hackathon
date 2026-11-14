#!/usr/bin/env bash
set -euo pipefail

echo "==> [1/6] Creating directory structure..."
mkdir -p \
  backend/alembic/versions \
  backend/app/routers \
  backend/app/services \
  backend/media \
  nginx \
  src/types \
  src/utils \
  src/hooks \
  src/data \
  src/components/home \
  src/pages

echo "==> [2/6] Patching index.html and vite.config.ts for BrowserRouter + API proxy..."
python3 - <<'PY'
from pathlib import Path
import re

# 1. Ensure absolute /favicon.svg in index.html
index_path = Path("index.html")
if index_path.exists():
    html = index_path.read_text(encoding="utf-8")
    html = html.replace('href="./favicon.svg"', 'href="/favicon.svg"')
    html = html.replace("href='./favicon.svg'", "href='/favicon.svg'")
    index_path.write_text(html, encoding="utf-8")

# 2. Ensure base: '/' and /api, /sitemap.xml, /robots.txt dev proxy in vite.config.ts
vite_path = Path("vite.config.ts")
if vite_path.exists():
    vcfg = vite_path.read_text(encoding="utf-8")
    # Fix relative base if set
    vcfg = re.sub(r"base\s*:\s*['\"]\./['\"]", "base: '/'", vcfg)
    if "proxy:" not in vcfg:
        proxy_block = """  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: process.env.VITE_API_PROXY_TARGET || 'http://localhost:8000',
        changeOrigin: true,
      },
      '/sitemap.xml': {
        target: process.env.VITE_API_PROXY_TARGET || 'http://localhost:8000',
        changeOrigin: true,
      },
      '/robots.txt': {
        target: process.env.VITE_API_PROXY_TARGET || 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },"""
        if re.search(r"server\s*:\s*\{", vcfg):
            vcfg = re.sub(
                r"server\s*:\s*\{",
                "server: {\n    proxy: {\n      '/api': { target: process.env.VITE_API_PROXY_TARGET || 'http://localhost:8000', changeOrigin: true },\n      '/sitemap.xml': { target: process.env.VITE_API_PROXY_TARGET || 'http://localhost:8000', changeOrigin: true },\n      '/robots.txt': { target: process.env.VITE_API_PROXY_TARGET || 'http://localhost:8000', changeOrigin: true },\n    },",
                vcfg,
                count=1,
            )
        else:
            vcfg = re.sub(
                r"return\s*\{",
                "return {\n    base: '/',\n" + proxy_block,
                vcfg,
                count=1,
            )
            if "return {" not in vcfg:
                vcfg = re.sub(
                    r"defineConfig\s*\(\s*\{",
                    "defineConfig({\n  base: '/',\n" + proxy_block,
                    vcfg,
                    count=1,
                )
    vite_path.write_text(vcfg, encoding="utf-8")
else:
    vite_path.write_text(
        """import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  base: '/',
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: process.env.VITE_API_PROXY_TARGET || 'http://localhost:8000',
        changeOrigin: true,
      },
      '/sitemap.xml': {
        target: process.env.VITE_API_PROXY_TARGET || 'http://localhost:8000',
        changeOrigin: true,
      },
      '/robots.txt': {
        target: process.env.VITE_API_PROXY_TARGET || 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
});
""",
        encoding="utf-8",
    )
PY

echo "==> [3/6] Writing Docker, Nginx, env, and README files..."

cat <<'EOF' > .env.example
# PostgreSQL
POSTGRES_DB=milkby
POSTGRES_USER=milkby
POSTGRES_PASSWORD=milkby_secret
DATABASE_URL=postgresql+asyncpg://milkby:milkby_secret@postgres:5432/milkby

# Optional AI Intent Extraction (falls back to deterministic NLP + PostgreSQL if omitted)
GEMINI_API_KEY=

# App & SEO
PUBLIC_BASE_URL=https://milk.by
ADMIN_API_KEY=
WEB_PORT=8080
EOF

cat <<'EOF' > docker-compose.yml
services:
  postgres:
    image: postgres:16-alpine
    container_name: milkby_postgres
    restart: unless-stopped
    environment:
      POSTGRES_DB: ${POSTGRES_DB:-milkby}
      POSTGRES_USER: ${POSTGRES_USER:-milkby}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:-milkby_secret}
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER:-milkby} -d ${POSTGRES_DB:-milkby}"]
      interval: 5s
      timeout: 5s
      retries: 12

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: milkby_backend
    restart: unless-stopped
    environment:
      DATABASE_URL: postgresql+asyncpg://${POSTGRES_USER:-milkby}:${POSTGRES_PASSWORD:-milkby_secret}@postgres:5432/${POSTGRES_DB:-milkby}
      GEMINI_API_KEY: ${GEMINI_API_KEY:-}
      PUBLIC_BASE_URL: ${PUBLIC_BASE_URL:-https://milk.by}
      FRONTEND_INDEX_URL: http://frontend/__spa_template.html
      MEDIA_DIR: /app/media
      ADMIN_API_KEY: ${ADMIN_API_KEY:-}
    ports:
      - "8000:8000"
    volumes:
      - media_data:/app/media
    depends_on:
      postgres:
        condition: service_healthy
    command: >
      sh -c "alembic upgrade head && python -m app.seed && uvicorn app.main:app --host 0.0.0.0 --port 8000"

  frontend:
    build:
      context: .
      dockerfile: Dockerfile.frontend
    container_name: milkby_frontend
    restart: unless-stopped
    ports:
      - "${WEB_PORT:-8080}:80"
    depends_on:
      - backend

volumes:
  postgres_data:
  media_data:
EOF

cat <<'EOF' > Dockerfile.frontend
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi
COPY . .
RUN npm run build

FROM nginx:1.27-alpine
COPY nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
EOF

cat <<'EOF' > nginx/default.conf
server {
    listen 80;
    server_name _;

    root /usr/share/nginx/html;
    client_max_body_size 15M;

    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml text/javascript image/svg+xml;

    # Internal template endpoint fetched by FastAPI SSR meta injector
    location = /__spa_template.html {
        alias /usr/share/nginx/html/index.html;
        add_header Cache-Control "no-store";
    }

    # Static Vite assets served directly by Nginx
    location /assets/ {
        try_files $uri =404;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    location = /favicon.svg {
        try_files $uri =404;
        expires 30d;
    }

    # Proxy API, sitemap.xml, robots.txt, 301 redirects, and HTML pages (with SSR SEO meta tags & HTTP 200/301/404)
    location / {
        proxy_pass http://backend:8000;
        proxy_http_version 1.1;
        proxy_set_header Host $http_host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF

cat <<'EOF' > README.md
# Run and deploy your app

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

---

## Run Full Stack with Docker Compose (PostgreSQL + FastAPI + Nginx SSR/SPA)

**Prerequisites:** Docker & Docker Compose

1. Optionally copy `.env.example` to `.env` and add `GEMINI_API_KEY` (if omitted, the Smart Product Matcher automatically falls back to deterministic multilingual NLP + PostgreSQL trigram search):
   ```bash
   cp .env.example .env
   ```
2. Build and launch PostgreSQL 16, Alembic migrations, 4-language seed data (30 products across 12 categories + 16 news articles + 24 legacy 301 redirects), FastAPI, and Nginx:
   ```bash
   docker compose up --build
   ```
3. Open:
   - **Web Platform (SSR SEO + React SPA):** http://localhost:8080/ru/
   - **OpenAPI / Swagger UI:** http://localhost:8080/api/docs
   - **Dynamic XML Sitemap:** http://localhost:8080/sitemap.xml
   - **Robots.txt:** http://localhost:8080/robots.txt
   - **CMS Admin Panel:** http://localhost:8080/ru/admin

---

## Run Back-end Locally Without Docker (Dev Mode)

**Prerequisites:** Python 3.12+ & PostgreSQL 16

1. Start PostgreSQL and create database `milkby` (`pg_trgm` extension enabled).
2. Install Python dependencies:
   ```bash
   cd backend
   python -m venv .venv && source .venv/bin/activate
   pip install -r requirements.txt
   ```
3. Run migrations & seed database:
   ```bash
   export DATABASE_URL="postgresql+asyncpg://milkby:milkby_secret@localhost:5432/milkby"
   alembic upgrade head
   python -m app.seed
   ```
4. Start FastAPI:
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```
5. In another terminal, run `npm run dev` from the repository root (Vite automatically proxies `/api`, `/sitemap.xml`, and `/robots.txt` to `http://localhost:8000`).
EOF

echo "==> [4/6] Writing FastAPI + PostgreSQL + Alembic backend..."

cat <<'EOF' > backend/requirements.txt
fastapi>=0.115.0
uvicorn[standard]>=0.30.0
sqlalchemy[asyncio]>=2.0.35
asyncpg>=0.29.0
psycopg[binary]>=3.2.0
alembic>=1.13.3
pydantic>=2.9.0
pydantic-settings>=2.5.2
python-multipart>=0.0.12
httpx>=0.27.2
fpdf2>=2.8.1
EOF

cat <<'EOF' > backend/Dockerfile
FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    fonts-dejavu-core \
    fonts-wqy-zenhei \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Extract standalone TTF from wqy-zenhei.ttc for Unicode CJK PDF generation in fpdf2
RUN python -c "from pathlib import Path; from fontTools.ttLib import TTCollection; p = Path('/usr/share/fonts/truetype/wqy/wqy-zenhei.ttc'); p.exists() and TTCollection(str(p))[0].save('/usr/share/fonts/truetype/wqy/wqy-zenhei.ttf')"

COPY . .
RUN mkdir -p /app/media

EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
EOF

cat <<'EOF' > backend/alembic.ini
[alembic]
script_location = alembic
prepend_sys_path = .
sqlalchemy.url = postgresql+psycopg://milkby:milkby_secret@localhost:5432/milkby

[loggers]
keys = root,sqlalchemy,alembic

[handlers]
keys = console

[formatters]
keys = generic

[logger_root]
level = WARN
handlers = console
qualname =

[logger_sqlalchemy]
level = WARN
handlers =
qualname = sqlalchemy.engine

[logger_alembic]
level = INFO
handlers =
qualname = alembic

[handler_console]
class = StreamHandler
args = (sys.stderr,)
level = NOTSET
formatter = generic

[formatter_generic]
format = %(levelname)-5.5s [%(name)s] %(message)s
datefmt = %H:%M:%S
EOF

cat <<'EOF' > backend/alembic/env.py
import os
from logging.config import fileConfig
from sqlalchemy import engine_from_config, pool
from alembic import context

from app.database import Base
from app import models  # noqa: F401

config = context.config
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

target_metadata = Base.metadata


def get_sync_url() -> str:
    raw_url = os.getenv("DATABASE_URL") or config.get_main_option("sqlalchemy.url")
    if "+asyncpg" in raw_url:
        return raw_url.replace("+asyncpg", "+psycopg")
    if raw_url.startswith("postgresql://"):
        return raw_url.replace("postgresql://", "postgresql+psycopg://", 1)
    return raw_url


def run_migrations_offline() -> None:
    url = get_sync_url()
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )
    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    cfg_section = config.get_section(config.config_ini_section) or {}
    cfg_section["sqlalchemy.url"] = get_sync_url()
    connectable = engine_from_config(
        cfg_section,
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )
    with connectable.connect() as connection:
        context.configure(connection=connection, target_metadata=target_metadata)
        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
EOF

cat <<'EOF' > backend/alembic/versions/001_initial_schema.py
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
EOF

touch backend/app/__init__.py backend/app/routers/__init__.py backend/app/services/__init__.py

cat <<'EOF' > backend/app/config.py
from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    database_url: str = "postgresql+asyncpg://milkby:milkby_secret@localhost:5432/milkby"
    gemini_api_key: str = ""
    public_base_url: str = "https://milk.by"
    frontend_index_url: str = ""
    media_dir: str = str(Path(__file__).resolve().parent.parent / "media")
    admin_api_key: str = ""

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")


settings = Settings()
EOF

cat <<'EOF' > backend/app/database.py
from collections.abc import AsyncGenerator
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.orm import DeclarativeBase
from app.config import settings


class Base(DeclarativeBase):
    pass


engine = create_async_engine(
    settings.database_url,
    echo=False,
    pool_pre_ping=True,
    pool_size=10,
    max_overflow=20,
)

async_session_factory = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
)


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with async_session_factory() as session:
        yield session
EOF

cat <<'EOF' > backend/app/models.py
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
EOF

cat <<'EOF' > backend/app/schemas.py
from datetime import datetime
from typing import Any, Literal
from pydantic import BaseModel, ConfigDict, Field
from pydantic.alias_generators import to_camel

Language = Literal["ru", "be", "en", "zh"]
FilterKey = Literal["fat", "lactoseFree", "highProtein", "exportReady"]
NewsCategoryId = Literal["company", "export", "products", "awards"]
InquiryChannel = Literal["export", "wholesale", "general"]


class CamelModel(BaseModel):
    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True,
        from_attributes=True,
    )


class LocalizedText(CamelModel):
    ru: str = ""
    be: str = ""
    en: str = ""
    zh: str = ""


class PackageVariantSchema(CamelModel):
    id: str
    weight: str
    weight_grams: int
    shelf_life: LocalizedText
    storage: LocalizedText
    packaging_type: LocalizedText
    units_per_box: int = 1
    gtin: str = ""


class ProductSeoSchema(CamelModel):
    title: LocalizedText
    description: LocalizedText
    h1: LocalizedText


class ProductSchema(CamelModel):
    id: str
    slug: str
    category: str
    subcategory: str = "default"
    name: LocalizedText
    description: LocalizedText
    image: str
    fat_content: float | None = None
    protein_content: float | None = None
    lactose_free: bool = False
    export_ready: bool = True
    featured: bool = False
    visible: bool = True
    packages: list[PackageVariantSchema] = Field(default_factory=list)
    characteristics: dict[str, LocalizedText] = Field(default_factory=dict)
    use_cases: list[str] = Field(default_factory=list)
    related_ids: list[str] = Field(default_factory=list)
    seo: ProductSeoSchema


class CategorySubcategorySchema(CamelModel):
    id: str
    name: LocalizedText


class CharacteristicFieldSchema(CamelModel):
    key: str
    label: LocalizedText


class CategorySeoSchema(CamelModel):
    title: LocalizedText
    description: LocalizedText


class CategorySchema(CamelModel):
    id: str
    slug: str
    name: LocalizedText
    description: LocalizedText
    subcategories: list[CategorySubcategorySchema] = Field(default_factory=list)
    filter_keys: list[FilterKey] = Field(default_factory=list)
    characteristic_schema: list[CharacteristicFieldSchema] = Field(default_factory=list)
    seo: CategorySeoSchema


class NewsArticleSchema(CamelModel):
    id: str
    slug: str
    date: str
    year: int
    category_id: NewsCategoryId
    title: LocalizedText
    excerpt: LocalizedText
    content: LocalizedText
    image: str
    published: bool = True
    related_ids: list[str] = Field(default_factory=list)
    seo: CategorySeoSchema


class RedirectRuleSchema(CamelModel):
    id: int | None = None
    source: str = Field(alias="from")
    target: str = Field(alias="to")
    code: Literal[301] = 301
    note: str = ""


class B2BInquiryCreate(CamelModel):
    company: str = Field(min_length=1, max_length=255)
    contact_name: str = Field(min_length=1, max_length=255)
    email: str = Field(min_length=3, max_length=255)
    phone: str = ""
    country: str = ""
    product_id: str | None = None
    package_id: str | None = None
    volume: str = ""
    message: str = ""
    channel: InquiryChannel = "wholesale"
    language: Language = "ru"


class B2BInquiryResponse(B2BInquiryCreate):
    id: str
    status: str = "new"
    created_at: datetime


class ProductListResponse(CamelModel):
    items: list[ProductSchema]
    total: int
    page: int
    page_size: int
    total_pages: int


class NewsListResponse(CamelModel):
    items: list[NewsArticleSchema]
    total: int
    page: int
    page_size: int
    total_pages: int


class SmartCriterionSchema(CamelModel):
    id: str
    label: str


class SmartMatchResultSchema(CamelModel):
    product: ProductSchema
    score: float
    reasons: list[str]
    recommended_package: PackageVariantSchema | None = None


class AutocompleteSuggestionSchema(CamelModel):
    id: str
    slug: str
    name: LocalizedText
    category: str
    category_name: LocalizedText
    image: str
    fat_content: float | None = None
    recommended_package: PackageVariantSchema | None = None


class AutocompleteResponse(CamelModel):
    query: str
    corrected_query: str | None = None
    criteria: list[SmartCriterionSchema] = Field(default_factory=list)
    suggestions: list[AutocompleteSuggestionSchema] = Field(default_factory=list)
    total_matches: int = 0


class SmartSelectRequest(CamelModel):
    query: str = Field(min_length=1, max_length=500)
    language: Language = "ru"
    limit: int = Field(default=6, ge=1, le=20)


class SmartSelectResponse(CamelModel):
    query: str
    corrected_query: str | None = None
    mode: Literal["llm+db", "nlp+db"] = "nlp+db"
    criteria: list[SmartCriterionSchema] = Field(default_factory=list)
    results: list[SmartMatchResultSchema] = Field(default_factory=list)


class TranslationUpdateRequest(CamelModel):
    key: str
    language: Language
    value: str


class BulkImportResult(CamelModel):
    created: int
    updated: int
    skipped: int
    errors: list[str] = Field(default_factory=list)


class SeoAuditResponse(CamelModel):
    total_products: int
    unique_titles_by_lang: dict[str, int]
    duplicate_titles_by_lang: dict[str, list[str]]
    total_news: int
    total_redirects: int
    sitemap_url_count: int


class BootstrapResponse(CamelModel):
    categories: list[CategorySchema]
    products: list[ProductSchema]
    news: list[NewsArticleSchema]
    redirects: list[RedirectRuleSchema]
    translations: dict[str, LocalizedText]


def orm_product_to_schema(p: Any) -> ProductSchema:
    return ProductSchema(
        id=p.id,
        slug=p.slug,
        category=p.category_id,
        subcategory=p.subcategory_id,
        name=LocalizedText(**p.name),
        description=LocalizedText(**p.description),
        image=p.image,
        fat_content=p.fat_content,
        protein_content=p.protein_content,
        lactose_free=p.lactose_free,
        export_ready=p.export_ready,
        featured=p.featured,
        visible=p.visible,
        packages=[
            PackageVariantSchema(
                id=v.id,
                weight=v.weight,
                weight_grams=v.weight_grams,
                shelf_life=LocalizedText(**v.shelf_life),
                storage=LocalizedText(**v.storage),
                packaging_type=LocalizedText(**v.packaging_type),
                units_per_box=v.units_per_box,
                gtin=v.gtin,
            )
            for v in sorted(p.variants, key=lambda x: x.sort_order)
        ],
        characteristics={k: LocalizedText(**v) for k, v in (p.characteristics or {}).items()},
        use_cases=list(p.use_cases or []),
        related_ids=list(p.related_ids or []),
        seo=ProductSeoSchema(
            title=LocalizedText(**p.seo["title"]),
            description=LocalizedText(**p.seo["description"]),
            h1=LocalizedText(**p.seo.get("h1", p.name)),
        ),
    )


def orm_category_to_schema(c: Any) -> CategorySchema:
    return CategorySchema(
        id=c.id,
        slug=c.slug,
        name=LocalizedText(**c.name),
        description=LocalizedText(**c.description),
        subcategories=[CategorySubcategorySchema(**s) for s in (c.subcategories or [])],
        filter_keys=list(c.filter_keys or []),
        characteristic_schema=[CharacteristicFieldSchema(**f) for f in (c.characteristic_schema or [])],
        seo=CategorySeoSchema(
            title=LocalizedText(**c.seo["title"]),
            description=LocalizedText(**c.seo["description"]),
        ),
    )


def orm_news_to_schema(n: Any) -> NewsArticleSchema:
    return NewsArticleSchema(
        id=n.id,
        slug=n.slug,
        date=n.published_date.isoformat(),
        year=n.year,
        category_id=n.category_id,
        title=LocalizedText(**n.title),
        excerpt=LocalizedText(**n.excerpt),
        content=LocalizedText(**n.content),
        image=n.image,
        published=n.published,
        related_ids=list(n.related_ids or []),
        seo=CategorySeoSchema(
            title=LocalizedText(**n.seo["title"]),
            description=LocalizedText(**n.seo["description"]),
        ),
    )


def orm_redirect_to_schema(r: Any) -> RedirectRuleSchema:
    return RedirectRuleSchema.model_validate(
        {
            "id": r.id,
            "from": r.source_path,
            "to": r.target_path,
            "code": 301,
            "note": r.note,
        }
    )
EOF

cat <<'EOF' > backend/app/seed_data.py
"""
Canonical 4-language seed dataset for Molochny Mir (milk.by):
- 12 categories with dynamic characteristic schemas
- 30 products across all 12 categories (with multi-pack variants & unique 4-lang SEO)
- 16 news articles across 2023–2026
- 24 legacy 301 redirect rules
- Full UI translations dictionary
"""

CATEGORIES_SEED = [
    {
        "id": "cheese",
        "slug": "cheese",
        "sort_order": 1,
        "name": {"ru": "Сыры", "be": "Сыры", "en": "Cheeses", "zh": "奶酪系列"},
        "description": {
            "ru": "Полутвёрдые, выдержанные и рассольные сыры, включая линейку для пиццы и HoReCa.",
            "be": "Паўцвёрдыя, вытрыманыя і расольныя сыры, уключаючы лінейку для піцы і HoReCa.",
            "en": "Semi-hard, aged, and pasta filata cheeses including professional pizza and HoReCa formats.",
            "zh": "半硬质奶酪、陈年奶酪及新鲜马苏里拉奶酪，适用于餐饮与零售。",
        },
        "subcategories": [
            {"id": "pasta-filata", "name": {"ru": "Сыры группы Паста Филата", "be": "Сыры групы Паста Філата", "en": "Pasta Filata", "zh": "拉伸凝乳奶酪"}},
            {"id": "aged-semi-hard", "name": {"ru": "Полутвёрдые и выдержанные", "be": "Паўцвёрдыя і вытрыманыя", "en": "Semi-Hard & Aged", "zh": "半硬质与陈年奶酪"}},
            {"id": "soft-mold", "name": {"ru": "Мягкие и деликатесные", "be": "Мяккія і дэлікатэсныя", "en": "Soft & Gourmet", "zh": "软质风味奶酪"}},
        ],
        "filterKeys": ["fat", "highProtein", "exportReady"],
        "characteristicSchema": [
            {"key": "cheeseType", "label": {"ru": "Вид сыра", "be": "Від сыру", "en": "Cheese Type", "zh": "奶酪类型"}},
            {"key": "aging", "label": {"ru": "Выдержка", "be": "Вытрымка", "en": "Maturation", "zh": "成熟期"}},
            {"key": "shape", "label": {"ru": "Форма", "be": "Форма", "en": "Format / Shape", "zh": "形状"}},
            {"key": "milkBase", "label": {"ru": "Сырьё", "be": "Сыравіна", "en": "Milk Base", "zh": "原料奶"}},
        ],
        "seo": {
            "title": {
                "ru": "Сыры ОАО «Молочный Мир» — Моцарелла, выдержанные и полутвёрдые сыры",
                "be": "Сыры ААТ «Малочны Мір» — Мацарэла, вытрыманыя і паўцвёрдыя сыры",
                "en": "Cheeses by Molochny Mir — Mozzarella, Aged & Semi-Hard Varieties",
                "zh": "Molochny Mir 奶酪系列 — 马苏里拉与陈年奶酪",
            },
            "description": {
                "ru": "Каталог сыров ОАО «Молочный Мир»: фасовка для розницы и HoReCa, точные характеристики и экспортные спецификации.",
                "be": "Каталог сыроў ААТ «Малочны Мір»: фасоўка для розніцы і HoReCa, дакладныя характарыстыкі.",
                "en": "Full catalog of Molochny Mir cheeses with retail and HoReCa packaging variants and export specs.",
                "zh": "白俄罗斯 Molochny Mir 奶酪完整目录，涵盖零售与餐饮大包装及出口规格。",
            },
        },
    },
    {
        "id": "milk",
        "slug": "milk",
        "sort_order": 2,
        "name": {"ru": "Молоко", "be": "Малако", "en": "Milk", "zh": "鲜奶与纯牛奶"},
        "description": {
            "ru": "Пастеризованное, ультрапастеризованное и безлактозное молоко высших сортов.",
            "be": "Пастэрызаванае, ультрапастэрызаванае і безлактознае малако вышэйшых гатункаў.",
            "en": "Pasteurized, UHT, and lactose-free cow milk sourced from certified farms.",
            "zh": "巴氏杀菌乳、超高温灭菌乳及无乳糖牛奶。",
        },
        "subcategories": [
            {"id": "pasteurized", "name": {"ru": "Пастеризованное", "be": "Пастэрызаванае", "en": "Pasteurized", "zh": "巴氏杀菌"}},
            {"id": "uht", "name": {"ru": "Ультрапастеризованное (UHT)", "be": "Ультрапастэрызаванае (UHT)", "en": "UHT Milk", "zh": "超高温灭菌 (UHT)"}},
            {"id": "lactose-free", "name": {"ru": "Безлактозное", "be": "Безлактознае", "en": "Lactose-Free", "zh": "无乳糖"}},
        ],
        "filterKeys": ["fat", "lactoseFree", "exportReady"],
        "characteristicSchema": [
            {"key": "processing", "label": {"ru": "Термообработка", "be": "Тэрмаапрацоўка", "en": "Heat Treatment", "zh": "杀菌工艺"}},
            {"key": "milkBase", "label": {"ru": "Сырьё", "be": "Сыравіна", "en": "Milk Source", "zh": "奶源"}},
            {"key": "lactose", "label": {"ru": "Лактоза", "be": "Лактоза", "en": "Lactose Content", "zh": "乳糖含量"}},
        ],
        "seo": {
            "title": {
                "ru": "Молоко ОАО «Молочный Мир» — классическое, UHT и безлактозное",
                "be": "Малако ААТ «Малочны Мір» — класічнае, UHT і безлактознае",
                "en": "Milk Products — Pasteurized, UHT & Lactose-Free | Molochny Mir",
                "zh": "Molochny Mir 纯牛奶与无乳糖牛奶系列",
            },
            "description": {
                "ru": "Ассортимент питьевого молока ОАО «Молочный Мир» в ПЭТ-бутылках и асептической упаковке Tetra Pak.",
                "be": "Асартымент пітнога малака ААТ «Малочны Мір» у ПЭТ-бутэльках і ўпакоўцы Tetra Pak.",
                "en": "Pasteurized and UHT milk in PET bottles and Tetra Pak aseptic cartons.",
                "zh": "PET瓶装与利乐无菌包装鲜牛奶及常温奶。",
            },
        },
    },
    {
        "id": "fermented",
        "slug": "fermented",
        "sort_order": 3,
        "name": {"ru": "Кисломолочная продукция", "be": "Кісламалочная прадукцыя", "en": "Fermented Dairy", "zh": "发酵乳制品"},
        "description": {
            "ru": "Кефир, ряженка и бифитат на живых заквасках собственного производства.",
            "be": "Кефір, ражанка і біфітат на жывых заквасках уласнай вытворчасці.",
            "en": "Traditional kefir, baked fermented milk, and probiotic beverages brewed with live cultures.",
            "zh": "采用活性益生菌发酵的传统开菲尔及发酵乳饮品。",
        },
        "subcategories": [
            {"id": "kefir", "name": {"ru": "Кефир", "be": "Кефір", "en": "Kefir", "zh": "开菲尔"}},
            {"id": "ryazhenka", "name": {"ru": "Ряженка и бифитат", "be": "Ражанка і біфітат", "en": "Ryazhenka & Probiotics", "zh": "发酵烤乳与益生菌乳"}},
        ],
        "filterKeys": ["fat", "highProtein"],
        "characteristicSchema": [
            {"key": "cultures", "label": {"ru": "Закваска", "be": "Закваска", "en": "Cultures", "zh": "发酵菌种"}},
            {"key": "probiotics", "label": {"ru": "Пробиотики (КОЕ/г)", "be": "Прабіётыкі (КАЕ/г)", "en": "Probiotic Count", "zh": "益生菌活菌数"}},
        ],
        "seo": {
            "title": {
                "ru": "Кисломолочная продукция — Кефир, ряженка и бифитат | Молочный Мир",
                "be": "Кісламалочная прадукцыя — Кефір, ражанка і біфітат | Малочны Мір",
                "en": "Fermented Dairy — Kefir, Ryazhenka & Probiotics | Molochny Mir",
                "zh": "发酵乳、开菲尔与益生菌饮品 | Molochny Mir",
            },
            "description": {
                "ru": "Традиционный кефир, томлёная ряженка и пробиотические напитки ОАО «Молочный Мир» с контролем живых культур.",
                "be": "Традыцыйны кефір, ражанка і прабіятычныя напоі ААТ «Малочны Мір».",
                "en": "Traditional Belarusian kefir, ryazhenka, and live probiotic fermented beverages.",
                "zh": "白俄罗斯传统开菲尔、烤乳及活性益生菌发酵乳饮品。",
            },
        },
    },
    {
        "id": "yogurt",
        "slug": "yogurt",
        "sort_order": 4,
        "name": {"ru": "Йогурты", "be": "Ёгурты", "en": "Yogurts", "zh": "酸奶系列"},
        "description": {
            "ru": "Греческие высокобелковые, безлактозные и питьевые йогурты без искусственных стабилизаторов.",
            "be": "Грэчаскія высокабялковыя, безлактозныя і пітныя ёгурты без штучных стабілізатараў.",
            "en": "Strained high-protein Greek yogurts, lactose-free yogurts, and smooth drinkable yogurts.",
            "zh": "高蛋白希腊酸奶、无乳糖酸奶与天然风味饮用型酸奶。",
        },
        "subcategories": [
            {"id": "greek", "name": {"ru": "Греческие и высокобелковые", "be": "Грэчаскія і высокабялковыя", "en": "Greek & High-Protein", "zh": "希腊高蛋白酸奶"}},
            {"id": "drinkable", "name": {"ru": "Питьевые йогурты", "be": "Пітныя ёгурты", "en": "Drinkable Yogurts", "zh": "饮用型酸奶"}},
        ],
        "filterKeys": ["fat", "highProtein", "lactoseFree"],
        "characteristicSchema": [
            {"key": "flavor", "label": {"ru": "Вкус", "be": "Смак", "en": "Flavor", "zh": "口味"}},
            {"key": "proteinNote", "label": {"ru": "Содержание белка", "be": "Утрыманне бялку", "en": "Protein Profile", "zh": "蛋白质含量"}},
            {"key": "sugar", "label": {"ru": "Добавленный сахар", "be": "Дададзены цукар", "en": "Added Sugar", "zh": "添加糖"}},
        ],
        "seo": {
            "title": {
                "ru": "Йогурты ОАО «Молочный Мир» — греческие, высокобелковые и питьевые",
                "be": "Ёгурты ААТ «Малочны Мір» — грэчаскія, высокабялковыя і пітныя",
                "en": "Greek, Lactose-Free & Drinkable Yogurts | Molochny Mir",
                "zh": "高蛋白希腊酸奶与饮用酸奶系列 | Molochny Mir",
            },
            "description": {
                "ru": "Йогурты с повышенным содержанием белка, без лактозы и с натуральными ягодными наполнителями.",
                "be": "Ёгурты з павышаным утрыманнем бялку, без лактозы і з натуральнымі напаўняльнікамі.",
                "en": "High-protein strained yogurts, lactose-free cups, and berry drinkable yogurts.",
                "zh": "富含天然乳蛋白的无乳糖希腊酸奶与天然水果饮用酸奶。",
            },
        },
    },
    {
        "id": "sour-cream",
        "slug": "sour-cream",
        "sort_order": 5,
        "name": {"ru": "Сметана", "be": "Смятана", "en": "Sour Cream", "zh": "酸奶油"},
        "description": {
            "ru": "Густая натуральная сметана из свежих сливок жирностью от 15% до 25% для дома и HoReCa.",
            "be": "Густая натуральная смятана са свежых вяршкоў тлустасцю ад 15% да 25%.",
            "en": "Thick cultured sour cream crafted from pure pasteurized dairy cream in retail and HoReCa tubs.",
            "zh": "纯鲜奶油发酵制成的浓稠天然酸奶油，覆盖零售与餐饮规格。",
        },
        "subcategories": [
            {"id": "classic-sour-cream", "name": {"ru": "Классическая 15%–25%", "be": "Класічная 15%–25%", "en": "Classic 15%–25%", "zh": "经典 15%–25%"}},
        ],
        "filterKeys": ["fat"],
        "characteristicSchema": [
            {"key": "consistency", "label": {"ru": "Консистенция", "be": "Кансістэнцыя", "en": "Texture", "zh": "质地"}},
            {"key": "cultures", "label": {"ru": "Закваска", "be": "Закваска", "en": "Culture", "zh": "发酵菌"}},
        ],
        "seo": {
            "title": {
                "ru": "Сметана ОАО «Молочный Мир» — натуральные сливки 15% и 20%",
                "be": "Смятана ААТ «Малочны Мір» — натуральныя вяршкі 15% і 20%",
                "en": "Natural Cultured Sour Cream 15% & 20% | Molochny Mir",
                "zh": "天然发酵酸奶油 15% / 20% | Molochny Mir",
            },
            "description": {
                "ru": "Густая сметана без растительных жиров в стаканах и вёдрах для HoReCa.",
                "be": "Густая смятана без раслінных тлушчаў у шклянках і вёдрах для HoReCa.",
                "en": "Pure dairy sour cream in retail cups and 3kg foodservice tubs.",
                "zh": "无植物油脂添加的纯正酸奶油，提供杯装及餐饮桶装。",
            },
        },
    },
    {
        "id": "tvorog",
        "slug": "tvorog",
        "sort_order": 6,
        "name": {"ru": "Творог", "be": "Тварог", "en": "Cottage Cheese & Tvorog", "zh": "农夫凝乳干酪 (Tvorog)"},
        "description": {
            "ru": "Рассыпчатый и зернёный творог, богатый природным молочным белком и кальцием.",
            "be": "Рассыпісты і зярністы тварог, багаты прыродным малочным бялком і кальцыем.",
            "en": "Traditional crumbly and grained tvorog rich in natural dairy protein.",
            "zh": "富含天然乳蛋白与钙质的传统颗粒凝乳干酪。",
        },
        "subcategories": [
            {"id": "crumbly", "name": {"ru": "Рассыпчатый", "be": "Рассыпісты", "en": "Crumbly Tvorog", "zh": "松散型凝乳"}},
            {"id": "grained", "name": {"ru": "Зернёный в сливках", "be": "Зярністы ў вяршках", "en": "Cottage Cheese in Cream", "zh": "奶油颗粒干酪"}},
        ],
        "filterKeys": ["fat", "highProtein"],
        "characteristicSchema": [
            {"key": "grain", "label": {"ru": "Структура зерна", "be": "Структура зярна", "en": "Curd Structure", "zh": "凝乳颗粒"}},
            {"key": "proteinNote", "label": {"ru": "Белок на 100 г", "be": "Бялок на 100 г", "en": "Protein per 100g", "zh": "每100克蛋白质"}},
        ],
        "seo": {
            "title": {
                "ru": "Творог ОАО «Молочный Мир» — рассыпчатый и зернёный",
                "be": "Тварог ААТ «Малочны Мір» — рассыпісты і зярністы",
                "en": "Traditional Tvorog & Cottage Cheese | Molochny Mir",
                "zh": "传统凝乳干酪系列 | Molochny Mir",
            },
            "description": {
                "ru": "Свежий творог с высоким содержанием белка в удобной герметичной упаковке.",
                "be": "Свежы тварог з высокім утрыманнем бялку ў зручнай герметычнай упакоўцы.",
                "en": "High-protein tvorog in sealed retail pouches and cream cottage cheese cups.",
                "zh": "密封保鲜包装的高蛋白凝乳干酪与奶油颗粒干酪。",
            },
        },
    },
    {
        "id": "butter",
        "slug": "butter",
        "sort_order": 7,
        "name": {"ru": "Масло сливочное", "be": "Масла сметанковае", "en": "Butter", "zh": "天然黄油"},
        "description": {
            "ru": "Сладкосливочное несолёное масло жирностью 72,5% и 82,5% по ГОСТ, в том числе для экспорта.",
            "be": "Салодкасметанковае несалёнае масла тлустасцю 72,5% і 82,5% па ДАСТ.",
            "en": "Sweet cream unsalted butter (72.5% and 82.5% fat) in retail foil and 20 kg export blocks.",
            "zh": "72.5%与82.5%乳脂含量的天然甜奶油无盐黄油，支持20公斤出口大包装。",
        },
        "subcategories": [
            {"id": "sweet-cream", "name": {"ru": "Сладкосливочное", "be": "Салодкасметанковае", "en": "Sweet Cream Butter", "zh": "甜奶油黄油"}},
        ],
        "filterKeys": ["fat", "exportReady"],
        "characteristicSchema": [
            {"key": "standard", "label": {"ru": "Стандарт", "be": "Стандарт", "en": "Standard", "zh": "执行标准"}},
            {"key": "method", "label": {"ru": "Способ сбивания", "be": "Спосаб збівання", "en": "Churning Method", "zh": "制作工艺"}},
        ],
        "seo": {
            "title": {
                "ru": "Масло сливочное 82,5% и 72,5% — ОАО «Молочный Мир»",
                "be": "Масла сметанковае 82,5% і 72,5% — ААТ «Малочны Мір»",
                "en": "Sweet Cream Butter 82.5% & 72.5% | Molochny Mir",
                "zh": "82.5% 与 72.5% 天然黄油 | Molochny Mir",
            },
            "description": {
                "ru": "Натуральное сливочное масло из пастеризованных сливок: розничная фасовка и монолит 20 кг для экспорта.",
                "be": "Натуральнае сметанковае масла з пастэрызаваных вяршкоў: розніца і маналіт 20 кг.",
                "en": "Natural sweet cream butter in retail foil packs and 20 kg industrial blocks.",
                "zh": "巴氏杀菌稀奶油制成的零售与工业大块出口黄油。",
            },
        },
    },
    {
        "id": "ice-cream",
        "slug": "ice-cream",
        "sort_order": 8,
        "name": {"ru": "Мороженое", "be": "Марозіва", "en": "Ice Cream", "zh": "冰淇淋系列"},
        "description": {
            "ru": "Натуральный пломбир на свежих сливках и цельном молоке без заменителей молочного жира.",
            "be": "Натуральны пламбір на свежых вяршках і цэльным малацэ без заменнікаў малочнага тлушчу.",
            "en": "Authentic Belarusian plombir ice cream made with fresh cream and whole milk.",
            "zh": "采用鲜奶油与全脂牛奶制作的经典白俄罗斯冰淇淋。",
        },
        "subcategories": [
            {"id": "plombir", "name": {"ru": "Пломбир", "be": "Пламбір", "en": "Plombir", "zh": "经典高脂冰淇淋"}},
        ],
        "filterKeys": ["fat", "exportReady"],
        "characteristicSchema": [
            {"key": "iceType", "label": {"ru": "Вид мороженого", "be": "Від марозіва", "en": "Type", "zh": "品类"}},
            {"key": "flavor", "label": {"ru": "Вкус", "be": "Смак", "en": "Flavor", "zh": "口味"}},
        ],
        "seo": {
            "title": {
                "ru": "Мороженое пломбир ОАО «Молочный Мир» — ванильное и шоколадное",
                "be": "Марозіва пламбір ААТ «Малочны Мір» — ванільнае і шакаладнае",
                "en": "Plombir Ice Cream — Vanilla & Chocolate | Molochny Mir",
                "zh": "经典白俄罗斯冰淇淋系列 | Molochny Mir",
            },
            "description": {
                "ru": "Пломбир ванильный и шоколадный в стаканчиках, эскимо и семейных контейнерах.",
                "be": "Пламбір ванільны і шакаладны ў шкляначках, эскімо і сямейных кантэйнерах.",
                "en": "Vanilla and chocolate plombir ice cream in cups, bars, and family tubs.",
                "zh": "蛋筒、脆皮雪糕及家庭装纯正香草与巧克力冰淇淋。",
            },
        },
    },
    {
        "id": "cream",
        "slug": "cream",
        "sort_order": 9,
        "name": {"ru": "Сливки", "be": "Вяршкі", "en": "Dairy Cream", "zh": "稀奶油"},
        "description": {
            "ru": "Питьевые и кондитерские сливки жирностью 10% и 33% для кофе, соусов и взбивания.",
            "be": "Пітныя і кандытарскія вяршкі тлустасцю 10% і 33% для кавы і ўзбівання.",
            "en": "Coffee cream 10% and 33% whipping cream for pastry, HoReCa, and retail.",
            "zh": "适用于咖啡调配与烘焙打发的10%–33%天然稀奶油。",
        },
        "subcategories": [
            {"id": "whipping", "name": {"ru": "Для взбивания 33% и кофе 10%", "be": "Для ўзбівання 33% і кавы 10%", "en": "Whipping 33% & Coffee 10%", "zh": "33%淡奶油与10%咖啡奶油"}},
        ],
        "filterKeys": ["fat", "exportReady"],
        "characteristicSchema": [
            {"key": "purpose", "label": {"ru": "Назначение", "be": "Прызначэнне", "en": "Application", "zh": "用途"}},
            {"key": "processing", "label": {"ru": "Термообработка", "be": "Тэрмаапрацоўка", "en": "Treatment", "zh": "热处理"}},
        ],
        "seo": {
            "title": {
                "ru": "Сливки для взбивания 33% и для кофе 10% | Молочный Мир",
                "be": "Вяршкі для ўзбівання 33% і для кавы 10% | Малочны Мір",
                "en": "Whipping 33% & Barista Coffee Cream 10% | Molochny Mir",
                "zh": "烘焙淡奶油与咖啡奶油 | Molochny Mir",
            },
            "description": {
                "ru": "Ультрапастеризованные натуральные сливки для бариста, кондитеров и HoReCa.",
                "be": "Ультрапастэрызаваныя натуральныя вяршкі для барыста, кандытараў і HoReCa.",
                "en": "UHT natural cream for baristas, pastry chefs, and HoReCa.",
                "zh": "超高温灭菌天然动物稀奶油，适合咖啡与烘焙。",
            },
        },
    },
    {
        "id": "desserts",
        "slug": "desserts",
        "sort_order": 10,
        "name": {"ru": "Десертная продукция", "be": "Дэсертная прадукцыя", "en": "Dairy Desserts", "zh": "乳制甜品"},
        "description": {
            "ru": "Творожные сырки, муссы и сладкие молочные десерты с натуральным шоколадом.",
            "be": "Тварожныя сыркі, мусы і салодкія малочныя дэсерты з натуральным шакаладам.",
            "en": "Glazed curd bars, creamy mousses, and dairy desserts.",
            "zh": "纯正巧克力涂层凝乳甜品棒与奶酪慕斯。",
        },
        "subcategories": [
            {"id": "curd-bars", "name": {"ru": "Глазированные сырки и муссы", "be": "Глазураваныя сыркі і мусы", "en": "Glazed Curd Bars & Mousses", "zh": "涂层凝乳棒与慕斯"}},
        ],
        "filterKeys": ["fat"],
        "characteristicSchema": [
            {"key": "glaze", "label": {"ru": "Глазурь / Основа", "be": "Глазура / Аснова", "en": "Coating / Base", "zh": "涂层/基底"}},
            {"key": "flavor", "label": {"ru": "Вкус", "be": "Смак", "en": "Flavor", "zh": "口味"}},
        ],
        "seo": {
            "title": {
                "ru": "Десертная продукция — глазированные сырки и муссы | Молочный Мир",
                "be": "Дэсертная прадукцыя — глазураваныя сыркі і мусы | Малочны Мір",
                "en": "Dairy Desserts, Curd Bars & Mousses | Molochny Mir",
                "zh": "乳制甜品、凝乳棒与可可慕斯 | Molochny Mir",
            },
            "description": {
                "ru": "Нежные творожные десерты, муссы и глазированные сырки из натурального творога.",
                "be": "Далікатныя тварожныя дэсерты, мусы і глазураваныя сыркі з натуральнага тварагу.",
                "en": "Delicate dairy desserts crafted with real tvorog and natural chocolate.",
                "zh": "选用天然凝乳制作的精致乳制甜品与可可慕斯。",
            },
        },
    },
    {
        "id": "dry-dairy",
        "slug": "dry-dairy",
        "sort_order": 11,
        "name": {"ru": "Сухие молочные продукты", "be": "Сухія малочныя прадукты", "en": "Dry Dairy Ingredients (B2B)", "zh": "干乳制品与原料 (B2B)"},
        "description": {
            "ru": "Сухое обезжиренное молоко (СОМ) и цельное сухое молоко (СЦМ) для пищевой промышленности и экспорта.",
            "be": "Сухое абястлушчанае малако (САМ) і цэльнае сухое малако (СЦМ) для экспарту.",
            "en": "Skimmed milk powder (SMP) and whole milk powder (WMP) for global B2B export.",
            "zh": "脱脂奶粉 (SMP) 与全脂奶粉 (WMP)，面向全球工业与出口合作伙伴。",
        },
        "subcategories": [
            {"id": "smp", "name": {"ru": "СОМ и СЦМ экспортные", "be": "САМ і СЦМ экспартныя", "en": "SMP & WMP Export", "zh": "出口级脱脂/全脂奶粉"}},
        ],
        "filterKeys": ["fat", "highProtein", "exportReady"],
        "characteristicSchema": [
            {"key": "grade", "label": {"ru": "Категория / Сорт", "be": "Катэгорыя / Гатунак", "en": "Grade / Standard", "zh": "等级标准"}},
            {"key": "moisture", "label": {"ru": "Массовая доля влаги", "be": "Масавая доля вільгаці", "en": "Moisture Max", "zh": "最大水分含量"}},
            {"key": "certifications", "label": {"ru": "Сертификация", "be": "Сертыфікацыя", "en": "Certifications", "zh": "认证体系"}},
        ],
        "seo": {
            "title": {
                "ru": "Сухие молочные продукты для экспорта и B2B — СОМ, СЦМ | Молочный Мир",
                "be": "Сухія малочныя прадукты для экспарту і B2B — САМ, СЦМ | Малочны Мір",
                "en": "Export Dry Dairy — SMP & WMP 25kg | Molochny Mir",
                "zh": "出口级干乳制品原料 — 脱脂与全脂奶粉 | Molochny Mir",
            },
            "description": {
                "ru": "Экспортные поставки сухого обезжиренного и цельного молока в мешках по 25 кг с полным пакетом ветеринарных и ISO сертификатов.",
                "be": "Экспартныя пастаўкі сухога абястлушчанага і цэльнага малака ў мяшках па 25 кг.",
                "en": "Export-grade SMP and WMP in 25 kg multi-wall kraft bags with full FSSC 22000/ISO/GACC documentation.",
                "zh": "25公斤牛皮纸袋装出口级脱脂及全脂奶粉，提供完整FSSC 22000、ISO及GACC认证。",
            },
        },
    },
    {
        "id": "other",
        "slug": "other",
        "sort_order": 12,
        "name": {"ru": "Прочая продукция", "be": "Іншая прадукцыя", "en": "Other Dairy Products", "zh": "其他乳制品"},
        "description": {
            "ru": "Сывороточные освежающие напитки, сгущённое молоко и специализированные молочные позиции.",
            "be": "Сыроватачныя напоі, згушчанае малако і спецыялізаваныя малочныя пазіцыі.",
            "en": "Whey-based refreshing drinks, sweetened condensed milk, and specialty dairy items.",
            "zh": "乳清风味饮品、甜炼乳及特色乳制品。",
        },
        "subcategories": [
            {"id": "whey-drinks", "name": {"ru": "Сывороточные напитки", "be": "Сыроватачныя напоі", "en": "Whey Beverages", "zh": "乳清饮品"}},
            {"id": "condensed", "name": {"ru": "Сгущённое молоко", "be": "Згушчанае малако", "en": "Condensed Milk", "zh": "甜炼乳"}},
        ],
        "filterKeys": ["fat", "exportReady"],
        "characteristicSchema": [
            {"key": "base", "label": {"ru": "Основа", "be": "Аснова", "en": "Base", "zh": "基底原料"}},
            {"key": "flavor", "label": {"ru": "Вкус", "be": "Смак", "en": "Flavor", "zh": "口味"}},
        ],
        "seo": {
            "title": {
                "ru": "Прочая молочная продукция — напитки и сгущённое молоко | Молочный Мир",
                "be": "Іншая малочная прадукцыя — напоі і згушчанае малако | Малочны Мір",
                "en": "Other Dairy Products — Whey Drinks & Condensed Milk | Molochny Mir",
                "zh": "其他乳制品 — 乳清饮品与炼乳 | Molochny Mir",
            },
            "description": {
                "ru": "Сывороточные напитки с соком, цельное сгущённое молоко и прочая продукция ОАО «Молочный Мир».",
                "be": "Сыроватачныя напоі, згушчанае малако і іншая прадукцыя ААТ «Малочны Мір».",
                "en": "Specialty dairy beverages, sweetened condensed milk, and other products by Molochny Mir.",
                "zh": "Molochny Mir 特色乳清饮品与高品质甜炼乳目录。",
            },
        },
    },
]


def _p(
    id_, category, subcategory, image, fat, protein, lactose_free, export_ready, featured,
    name_ru, name_be, name_en, name_zh,
    desc_ru, desc_be, desc_en, desc_zh,
    packages, characteristics, use_cases, related_ids,
):
    return {
        "id": id_,
        "slug": id_,
        "category": category,
        "subcategory": subcategory,
        "name": {"ru": name_ru, "be": name_be, "en": name_en, "zh": name_zh},
        "description": {"ru": desc_ru, "be": desc_be, "en": desc_en, "zh": desc_zh},
        "image": image,
        "fatContent": fat,
        "proteinContent": protein,
        "lactoseFree": lactose_free,
        "exportReady": export_ready,
        "featured": featured,
        "visible": True,
        "packages": packages,
        "characteristics": characteristics,
        "useCases": use_cases,
        "relatedIds": related_ids,
        "seo": {
            "title": {
                "ru": f"{name_ru} ({fat}%) — характеристики и фасовка | Молочный Мир",
                "be": f"{name_be} ({fat}%) — характарыстыкі і фасоўка | Малочны Мір",
                "en": f"{name_en} ({fat}% Fat) — Specs & Packaging | Molochny Mir",
                "zh": f"{name_zh} ({fat}% 乳脂) — 规格与包装 | Molochny Mir",
            },
            "description": {
                "ru": f"{name_ru}: {desc_ru[:120]} Фасовки: {', '.join(pk['weight'] for pk in packages)}.",
                "be": f"{name_be}: {desc_be[:120]} Фасоўкі: {', '.join(pk['weight'] for pk in packages)}.",
                "en": f"{name_en}: {desc_en[:120]} Formats: {', '.join(pk['weight'] for pk in packages)}.",
                "zh": f"{name_zh}：{desc_zh[:70]} 规格：{', '.join(pk['weight'] for pk in packages)}。",
            },
            "h1": {"ru": name_ru, "be": name_be, "en": name_en, "zh": name_zh},
        },
    }


def _pkg(pid, w, wg, sl_ru, sl_be, sl_en, sl_zh, st, pt_ru, pt_be, pt_en, pt_zh, box, gtin):
    return {
        "id": pid,
        "weight": w,
        "weightGrams": wg,
        "shelfLife": {"ru": sl_ru, "be": sl_be, "en": sl_en, "zh": sl_zh},
        "storage": {"ru": st, "be": st, "en": st, "zh": st},
        "packagingType": {"ru": pt_ru, "be": pt_be, "en": pt_en, "zh": pt_zh},
        "unitsPerBox": box,
        "gtin": gtin,
    }


PRODUCTS_SEED = [
    # 1–5: CHEESE
    _p(
        "mozzarella", "cheese", "pasta-filata", "asset:productMozzarella", 45.0, 19.0, False, True, True,
        "Моцарелла классическая", "Мацарэла класічная", "Classic Mozzarella", "经典马苏里拉奶酪",
        "Нежный рассольный сыр группы Паста Филата из свежего коровьего молока. Идеален для салатов капрезе, брускетт и повседневной кухни.",
        "Далікатны расольны сыр групы Паста Філата са свежага каровінага малака. Ідэальны для салатаў капрызе і брускет.",
        "Delicate pasta filata brine cheese made from fresh cow milk. Balanced milky flavor for caprese, bruschetta, and fresh dishes.",
        "采用鲜牛奶制成的柔嫩拉伸凝乳盐水奶酪，奶香醇正，适合制作卡普雷塞沙拉与意式轻食。",
        [
            _pkg("moz-125", "125 г", 125, "30 суток", "30 сутак", "30 days", "30天", "+2…+6 °C", "Герметичный флоу-пак с рассолом", "Герметычны флоў-пак з расолам", "Sealed brine flow-pack", "充液密封保鲜袋", 16, "4810268041011"),
            _pkg("moz-250", "250 г", 250, "30 суток", "30 сутак", "30 days", "30天", "+2…+6 °C", "Вакуумный пакет / термоформовка", "Вакуумны пакет / тэрмафармоўка", "Vacuum thermoform pouch", "真空热塑膜包装", 12, "4810268041028"),
            _pkg("moz-500", "500 г", 500, "45 суток", "45 сутак", "45 days", "45天", "+2…+6 °C", "Многослойная барьерная плёнка", "Шматслойная бар’ерная плёнка", "Barrier film pack", "多层阻隔膜包装", 10, "4810268041035"),
            _pkg("moz-1000", "1 кг", 1000, "45 суток", "45 сутак", "45 days", "45天", "+2…+6 °C", "Блок HoReCa (вакуум)", "Блок HoReCa (вакуум)", "HoReCa vacuum block", "餐饮渠道真空大块装", 6, "4810268041042"),
        ],
        {
            "cheeseType": {"ru": "Мягкий рассольный сыр", "be": "Мяккі расольны сыр", "en": "Soft pasta filata cheese", "zh": "软质拉伸凝乳奶酪"},
            "aging": {"ru": "Без созревания", "be": "Без паспявання", "en": "Fresh / unripened", "zh": "新鲜免成熟"},
            "shape": {"ru": "Шарики / батон", "be": "Шарыкі / батон", "en": "Bocconcini spheres / loaf", "zh": "球形 / 砖形"},
            "milkBase": {"ru": "Пастеризованное коровье молоко", "be": "Пастэрызаванае каровіна малако", "en": "Pasteurized cow milk", "zh": "巴氏杀菌牛奶"},
        },
        ["caprese", "salad", "pizza", "daily", "high-protein"],
        ["mozzarella-pizza", "goroden-aged", "suluguni-grodno"],
    ),
    _p(
        "mozzarella-pizza", "cheese", "pasta-filata", "asset:productMozzarella", 45.0, 24.0, False, True, True,
        "Моцарелла для пиццы HoReCa", "Мацарэла для піцы HoReCa", "Mozzarella for Pizza (HoReCa)", "披萨专用马苏里拉奶酪 (HoReCa)",
        "Полутвёрдый термостабильный сыр с пониженной влажностью. Равномерно плавится, образует эластичную тягучую нить и золотистую корочку без пригорания.",
        "Паўцвёрды тэрмастабільны сыр з паніжанай вільготнасцю. Раўнамерна плавіцца і ўтварае эластычную нітку.",
        "Low-moisture pasta filata mozzarella engineered for high-temperature pizza ovens. Delivers uniform melt, clean stretch, and golden blistering without oil separation.",
        "低水分热稳定型马苏里拉奶酪，专为高温披萨烤炉研发，拉丝绵长、融化均匀且不析油。",
        [
            _pkg("mozp-500", "500 г", 500, "60 суток", "60 сутак", "60 days", "60天", "0…+6 °C", "Термоусадочная вакуум-плёнка", "Тэрмаўсадачная вакуум-плёнка", "Shrink vacuum film", "热收缩真空膜", 12, "4810268041110"),
            _pkg("mozp-1000", "1 кг", 1000, "90 суток", "90 сутак", "90 days", "90天", "0…+6 °C", "Блок для пиццерий (вакуум)", "Блок для піцэрый (вакуум)", "Pizzeria vacuum block", "披萨店专用真空块", 8, "4810268041127"),
            _pkg("mozp-2500", "2.5 кг", 2500, "90 суток", "90 сутак", "90 days", "90天", "0…+6 °C", "Евробатон HoReCa (вакуум)", "Еўрабатон HoReCa (вакуум)", "HoReCa Euro-loaf vacuum", "商用欧式大条装", 4, "4810268041134"),
        ],
        {
            "cheeseType": {"ru": "Полутвёрдый для запекания", "be": "Паўцвёрды для запякання", "en": "Low-moisture pasta filata", "zh": "低水分半硬质马苏里拉"},
            "aging": {"ru": "14 суток", "be": "14 сутак", "en": "14 days stabilization", "zh": "14天稳态熟化"},
            "shape": {"ru": "Брус прямоугольный (удобен для тёрки)", "be": "Брус прамавугольны", "en": "Rectangular shredding loaf", "zh": "长方砖形（易擦丝）"},
            "milkBase": {"ru": "Нормализованное коровье молоко", "be": "Нармалізаванае каровіна малако", "en": "Standardized cow milk", "zh": "标准化鲜牛奶"},
        },
        ["pizza", "baking", "horeca", "high-protein"],
        ["mozzarella", "goroden-aged", "butter-825"],
    ),
    _p(
        "goroden-aged", "cheese", "aged-semi-hard", "asset:productAgedCheese", 50.0, 26.0, True, True, True,
        "Сыр «ГороденЪ» выдержанный", "Сыр «ГорадзенЪ» вытрыманы", "Goroden Aged Reserve Cheese", "Goroden 陈年窖藏奶酪",
        "Флагманский выдержанный сыр с насыщенным орехово-сливочным букетом и пикантным послевкусием. Созревает не менее 90 суток. Создан для сырных тарелок и дегустации с вином.",
        "Флагманскі вытрыманы сыр з насычаным арэхава-сметанковым букетам. Паспявае не менш за 90 сутак. Ідэальны для дэгустацыі з віном.",
        "Flagship aged cheese matured for 90+ days, featuring complex nutty-butter aromas and subtle crystalline notes. Designed for cheese boards and wine pairing.",
        "旗舰级陈年奶酪，历经90天以上窖藏成熟，风味浓郁并带有坚果与奶油芳香，专为奶酪拼盘与葡萄酒品鉴打造。",
        [
            _pkg("gor-200", "200 г", 200, "120 суток", "120 сутак", "120 days", "120天", "0…+6 °C", "Слайсерный сегмент (МГС)", "Слайсерны сегмент (МГС)", "MAP retail wedge", "气调零售三角切块", 14, "4810268042018"),
            _pkg("gor-4000", "4 кг", 4000, "180 суток", "180 сутак", "180 days", "180天", "0…+6 °C", "Цельная головка в защитном покрытии", "Цэльная галоўка ў ахоўным пакрыцці", "Whole wheel in protective wax", "整轮护膜包装", 2, "4810268042025"),
        ],
        {
            "cheeseType": {"ru": "Твёрдый / выдержанный сыр", "be": "Цвёрды / вытрыманы сыр", "en": "Hard aged cheese", "zh": "硬质陈年奶酪"},
            "aging": {"ru": "90–120 суток", "be": "90–120 сутак", "en": "90–120 days", "zh": "90–120天成熟期"},
            "shape": {"ru": "Цилиндрическая головка / сегмент", "be": "Цыліндрычная галоўка / сегмент", "en": "Cylindrical wheel / wedge", "zh": "圆柱整轮 / 三角切块"},
            "milkBase": {"ru": "Отборное коровье молоко (натурально без лактозы)", "be": "Адборнае каровіна малако (натуральна без лактозы)", "en": "Selected cow milk (naturally lactose-free)", "zh": "精选牛奶（天然无乳糖）"},
        },
        ["wine", "tasting", "high-protein", "lactose-free", "export"],
        ["brie-bellavista", "mozzarella", "butter-825"],
    ),
    _p(
        "brie-bellavista", "cheese", "soft-mold", "asset:productAgedCheese", 55.0, 18.0, False, True, False,
        "Сыр мягкий «Беллависта» с белой плесенью", "Сыр мяккі «Белавіста» з белай цвіллю", "Bellavista Soft White-Mold Cheese", "Bellavista 白霉软质奶酪",
        "Изысканный мягкий сыр с бархатистой корочкой благородной белой плесени и нежной сливочной сердцевиной. Превосходно сочетается с белым вином, фруктами и мёдом.",
        "Вытанчаны мяккі сыр з аксамітнай скарыначкай белай цвілі і далікатнай сметанковай сярэдзінай.",
        "Artisanal soft-ripened cheese with a bloomy white rind and velvety creamy core. Pairs effortlessly with sparkling wine, pears, and honey.",
        "精选白霉菌发酵而成的风味软质奶酪，表皮绒白、内芯绵密奶油感十足，搭配干白葡萄酒与水果风味绝佳。",
        [
            _pkg("brie-125", "125 г", 125, "40 суток", "40 сутак", "40 days", "40天", "+2…+6 °C", "Дышащая кашированная бумага + картон", "Дыхаючая папера + кардон", "Breathable wrap + carton box", "透气专纸与礼盒装", 10, "4810268042513"),
        ],
        {
            "cheeseType": {"ru": "Мягкий с белой плесенью", "be": "Мяккі з белай цвіллю", "en": "Bloomy-rind soft cheese", "zh": "白霉软质奶酪"},
            "aging": {"ru": "21 день", "be": "21 дзень", "en": "21 days", "zh": "21天熟化"},
            "shape": {"ru": "Шайба 125 г", "be": "Шайба 125 г", "en": "125g round wheel", "zh": "125克圆饼"},
            "milkBase": {"ru": "Высший сорт коровьего молока", "be": "Вышэйшы гатунак каровінага малака", "en": "Grade-A cow milk", "zh": "特级鲜牛奶"},
        },
        ["wine", "tasting"],
        ["goroden-aged", "mozzarella"],
    ),
    _p(
        "suluguni-grodno", "cheese", "pasta-filata", "asset:productMozzarella", 45.0, 20.5, False, True, False,
        "Сыр «Сулугуни Гродненский»", "Сыр «Сулугуні Гродзенскі»", "Grodno Suluguni Brine Cheese", "格罗德诺风味苏鲁古尼奶酪",
        "Слоистый рассольный сыр с чистым умеренно солёным вкусом. Идеален для хачапури, выпечки, блюд на гриле и сырных закусок.",
        "Слаісты расольны сыр з чыстым умерана салёным густам. Ідэальны для хачапуры, выпечкі і грылю.",
        "Layered pasta filata cheese with a clean mildly savory flavor. Ideal for khachapuri, baking, grilling, and savory snacks.",
        "分层质地盐水奶酪，咸香适口，非常适合制作格鲁吉亚芝士饼、热烤或餐饮佐餐。",
        [
            _pkg("sul-280", "280 г", 280, "45 суток", "45 сутак", "45 days", "45天", "+2…+6 °C", "Вакуумная термоусадочная плёнка", "Вакуумная тэрмаўсадачная плёнка", "Shrink vacuum pack", "真空热缩包装", 12, "4810268043015"),
            _pkg("sul-1000", "1 кг", 1000, "60 суток", "60 сутак", "60 days", "60天", "+2…+6 °C", "Головка HoReCa (вакуум)", "Галоўка HoReCa (вакуум)", "HoReCa vacuum wheel", "餐饮渠道真空装", 6, "4810268043022"),
        ],
        {
            "cheeseType": {"ru": "Рассольный слоистый сыр", "be": "Расольны слаісты сыр", "en": "Layered pasta filata cheese", "zh": "分层拉伸盐水奶酪"},
            "aging": {"ru": "7 суток", "be": "7 сутак", "en": "7 days", "zh": "7天"},
            "shape": {"ru": "Низкий цилиндр", "be": "Нізкі цыліндр", "en": "Flat cylinder", "zh": "扁圆柱形"},
            "milkBase": {"ru": "Пастеризованное коровье молоко", "be": "Пастэрызаванае каровіна малако", "en": "Pasteurized cow milk", "zh": "巴氏杀菌牛奶"},
        },
        ["baking", "horeca", "high-protein"],
        ["mozzarella-pizza", "mozzarella"],
    ),

    # 6–8: MILK
    _p(
        "milk-classic", "milk", "pasteurized", "asset:productMilkKefir", 3.2, 3.0, False, True, True,
        "Молоко питьевое цельное 3,2%", "Малако пітное цэльнае 3,2%", "Fresh Whole Milk 3.2%", "经典全脂鲜牛奶 3.2%",
        "Натуральное пастеризованное молоко из фермерских хозяйств Гродненской области. Сохраняет природный вкус и витаминный комплекс.",
        "Натуральнае пастэрызаванае малако з фермерскіх гаспадарак Гродзенскай вобласці.",
        "Pure pasteurized whole milk sourced daily from Grodno region dairy farms, preserving natural flavor and nutrients.",
        "每日直采格罗德诺州优质牧场奶源，温和巴氏杀菌工艺锁住鲜醇乳香与营养。",
        [
            _pkg("milk-900", "900 мл", 900, "12 суток", "12 сутак", "12 days", "12天", "+2…+6 °C", "ПЭТ-бутылка с широким горлом", "ПЭТ-бутэлька", "Recyclable PET bottle", "环保PET瓶装", 12, "4810268011014"),
            _pkg("milk-1000-uht", "1 л (UHT)", 1000, "180 суток", "180 сутак", "180 days", "180天", "+2…+25 °C", "Асептический пакет Tetra Pak (экспорт)", "Асептычны пакет Tetra Pak", "Tetra Pak aseptic carton (export)", "利乐无菌常温包装（出口装）", 12, "4810268011021"),
        ],
        {
            "processing": {"ru": "Пастеризация / Ультрапастеризация", "be": "Пастэрызацыя / UHT", "en": "Pasteurized / UHT", "zh": "巴氏杀菌 / UHT超高温"},
            "milkBase": {"ru": "Коровье молоко сорта «Экстра»", "be": "Каровіна малако гатунку «Экстра»", "en": "Extra-grade cow milk", "zh": "特级生牛乳"},
            "lactose": {"ru": "Содержит природную лактозу", "be": "Змяшчае прыродную лактозу", "en": "Contains natural lactose", "zh": "含天然乳糖"},
        },
        ["daily", "baking", "coffee", "export"],
        ["milk-lactose-free", "milk-uht-15", "kefir-classic"],
    ),
    _p(
        "milk-lactose-free", "milk", "lactose-free", "asset:productMilkKefir", 2.5, 3.1, True, True, True,
        "Молоко безлактозное 2,5% Active Life", "Малако безлактознае 2,5% Active Life", "Active Life Lactose-Free Milk 2.5%", "Active Life 零乳糖纯牛奶 2.5%",
        "Натуральное коровье молоко, в котором лактоза бережно расщеплена ферментом лактазой. Лёгкое усвоение и приятный слегка сладковатый вкус без добавления сахара.",
        "Натуральнае каровіна малако з расшчэпленай лактозай. Лёгкае засваенне без дадання цукру.",
        "Real cow milk with lactose gently hydrolyzed into easily digestible simple sugars. Zero added sugar, full calcium and protein profile.",
        "采用乳糖酶精准分解乳糖的纯正牛奶，不额外添加蔗糖，呵护乳糖不耐受人群的肠胃吸收。",
        [
            _pkg("mlf-950", "950 мл", 950, "150 суток", "150 сутак", "150 days", "150天", "+2…+25 °C", "Tetra Brik Aseptic с крышкой", "Tetra Brik Aseptic з вечкам", "Tetra Brik Aseptic with cap", "带盖利乐砖无菌包装", 12, "4810268011519"),
        ],
        {
            "processing": {"ru": "Ферментативное расщепление + UHT", "be": "Ферментатыўнае расшчапленне + UHT", "en": "Enzymatic hydrolysis + UHT", "zh": "酶解脱乳糖 + UHT灭菌"},
            "milkBase": {"ru": "Коровье молоко сорта «Экстра»", "be": "Каровіна малако гатунку «Экстра»", "en": "Extra-grade cow milk", "zh": "特级生牛乳"},
            "lactose": {"ru": "Менее 0,01% (без лактозы)", "be": "Менш за 0,01% (без лактозы)", "en": "< 0.01% (Lactose-Free)", "zh": "< 0.01%（无乳糖）"},
        },
        ["lactose-free", "daily", "coffee", "export"],
        ["greek-yogurt-lactose-free", "milk-classic", "goroden-aged"],
    ),
    _p(
        "milk-uht-15", "milk", "uht", "asset:productMilkKefir", 1.5, 3.0, False, True, False,
        "Молоко ультрапастеризованное 1,5% лёгкое", "Малако ультрапастэрызаванае 1,5% лёгкае", "Light UHT Skimmed Milk 1.5%", "1.5% 超高温灭菌轻脂牛奶",
        "Лёгкое питьевое молоко в асептической упаковке со сроком хранения 6 месяцев при комнатной температуре. Оптимально для дальних экспортных маршрутов и кофеен.",
        "Лёгкае пітное малако ў асептычнай упакоўцы з тэрмінам захоўвання 6 месяцаў.",
        "Light 1.5% UHT milk with a 180-day ambient shelf life, ideal for long-haul export, institutional catering, and specialty coffee bars.",
        "1.5%轻脂常温牛奶，无菌包装保质期长达180天，专为长途海运出口及连锁餐饮供应打造。",
        [
            _pkg("muht-1000", "1 л", 1000, "180 суток", "180 сутак", "180 days", "180天", "+2…+25 °C", "Tetra Pak Aseptic 1 л", "Tetra Pak Aseptic 1 л", "Tetra Pak Aseptic 1L", "1升利乐无菌盒", 12, "4810268011809"),
        ],
        {
            "processing": {"ru": "Ультрапастеризация (UHT 137 °C)", "be": "Ультрапастэрызацыя (UHT 137 °C)", "en": "UHT 137 °C", "zh": "UHT 137 °C 超高温瞬时灭菌"},
            "milkBase": {"ru": "Нормализованное молоко сорта «Экстра»", "be": "Нармалізаванае малако «Экстра»", "en": "Standardized Extra-grade milk", "zh": "特级标准化鲜牛乳"},
            "lactose": {"ru": "Содержит природную лактозу", "be": "Змяшчае прыродную лактозу", "en": "Natural lactose", "zh": "含天然乳糖"},
        },
        ["export", "coffee", "daily"],
        ["milk-classic", "cream-10-barista"],
    ),

    # 9–11: FERMENTED
    _p(
        "kefir-classic", "fermented", "kefir", "asset:productMilkKefir", 2.5, 3.0, False, False, False,
        "Кефир традиционный 2,5%", "Кефір традыцыйны 2,5%", "Traditional Kefir 2.5%", "经典发酵开菲尔 2.5%",
        "Классический кисломолочный напиток на натуральной закваске из живых кефирных грибков. Поддерживает микрофлору и обладает мягким освежающим вкусом.",
        "Класічны кісламалочны напой на натуральнай заквасцы з жывых кефірных грыбкоў.",
        "Authentic fermented dairy beverage cultured with live kefir grains for smooth texture and digestive balance.",
        "选用天然活性开菲尔菌粒发酵而成的传统乳饮品，口感柔和清爽，有益肠道健康。",
        [
            _pkg("kef-900", "900 г", 900, "14 суток", "14 сутак", "14 days", "14天", "+2…+6 °C", "ПЭТ-бутылка", "ПЭТ-бутэлька", "PET bottle", "PET瓶装", 12, "4810268021013"),
            _pkg("kef-500", "500 г", 500, "14 суток", "14 сутак", "14 days", "14天", "+2…+6 °C", "Пакет Пюр-Пак", "Пакет Пюр-Пак", "Pure-Pak gable-top carton", "屋顶盒包装", 16, "4810268021020"),
        ],
        {
            "cultures": {"ru": "Симбиотическая закваска на кефирных грибках", "be": "Закваска на кефірных грыбках", "en": "Live kefir grain starter", "zh": "天然活性开菲尔菌粒"},
            "probiotics": {"ru": "Не менее 1×10⁷ КОЕ/г", "be": "Не менш за 1×10⁷ КАЕ/г", "en": "Min 1×10⁷ CFU/g", "zh": "≥ 1×10⁷ CFU/g 活菌"},
        },
        ["daily", "probiotic"],
        ["ryazhenka-4", "bifitat-probiotic", "tvorog-grain"],
    ),
    _p(
        "ryazhenka-4", "fermented", "ryazhenka", "asset:productMilkKefir", 4.0, 2.9, False, False, False,
        "Ряженка томлёная 4,0%", "Ражанка томленая 4,0%", "Traditional Baked Ryazhenka 4.0%", "传统低温慢熬发酵烤乳 (Ryazhenka) 4.0%",
        "Нежный кисломолочный напиток кремового оттенка с карамельной ноткой, приготовленный из топлёного молока на термофильных заквасках.",
        "Далікатны кісламалочны напой крэмавага адцення з карамельнай ноткай з топленага малака.",
        "Velvety caramel-hued fermented milk cultured from slowly baked whole milk for rich roasted cream notes.",
        "采用低温长时间慢熬熟牛乳发酵而成的风味乳饮品，色泽呈暖焦糖色，带有醇厚烤奶香气。",
        [
            _pkg("ryazh-450", "450 г", 450, "14 суток", "14 сутак", "14 days", "14天", "+2…+6 °C", "ПЭТ-бутылка", "ПЭТ-бутэлька", "PET bottle", "PET瓶装", 12, "4810268022010"),
            _pkg("ryazh-900", "900 г", 900, "14 суток", "14 сутак", "14 days", "14天", "+2…+6 °C", "Семейная ПЭТ-бутылка", "Сямейная ПЭТ-бутэлька", "Family PET bottle", "家庭装PET瓶", 12, "4810268022027"),
        ],
        {
            "cultures": {"ru": "Термофильный стрептококк", "be": "Тэрмафільны стрэптакок", "en": "Thermophilic lactic starter", "zh": "嗜热链球菌发酵剂"},
            "probiotics": {"ru": "Не менее 1×10⁷ КОЕ/г", "be": "Не менш за 1×10⁷ КАЕ/г", "en": "Min 1×10⁷ CFU/g", "zh": "≥ 1×10⁷ CFU/g 活菌"},
        },
        ["daily", "probiotic"],
        ["kefir-classic", "bifitat-probiotic"],
    ),
    _p(
        "bifitat-probiotic", "fermented", "ryazhenka", "asset:productMilkKefir", 2.5, 3.2, False, True, False,
        "Бифитат пробиотический 2,5%", "Біфітат прабіятычны 2,5%", "Bifitat Probiotic Fermented Drink 2.5%", "Bifitat 双歧杆菌益生菌发酵乳 2.5%",
        "Функциональный кисломолочный напиток, обогащённый живыми бифидобактериями Bifidobacterium lactis для комфортного пищеварения и иммунитета.",
        "Функцыянальны кісламалочны напой, узбагачаны жывымі біфідабактэрыямі.",
        "Functional probiotic fermented milk enriched with live Bifidobacterium lactis cultures for gut health and immunity.",
        "富含活性双歧杆菌 Bifidobacterium lactis 的功能性益生菌发酵乳饮品，温和呵护肠道微生态。",
        [
            _pkg("bif-500", "500 г", 500, "18 суток", "18 сутак", "18 days", "18天", "+2…+6 °C", "Картон Пюр-Пак с крышкой", "Кардон Пюр-Пак з вечкам", "Pure-Pak carton with cap", "带盖屋顶盒包装", 16, "4810268023017"),
        ],
        {
            "cultures": {"ru": "Бифидобактерии B. lactis + ацидофильная палочка", "be": "Біфідабактэрыі B. lactis", "en": "Bifidobacterium lactis + L. acidophilus", "zh": "乳双歧杆菌与嗜酸乳杆菌"},
            "probiotics": {"ru": "Не менее 1×10⁸ КОЕ/г", "be": "Не менш за 1×10⁸ КАЕ/г", "en": "Min 1×10⁸ CFU/g", "zh": "≥ 1×10⁸ CFU/g 高活性益生菌"},
        },
        ["probiotic", "daily"],
        ["kefir-classic", "greek-yogurt-protein"],
    ),

    # 12–14: YOGURT
    _p(
        "greek-yogurt-protein", "yogurt", "greek", "asset:productGreekYogurt", 2.0, 8.0, False, True, True,
        "Йогурт греческий Active Life High Protein", "Ёгурт грэчаскі Active Life High Protein", "Active Life High-Protein Greek Yogurt", "Active Life 高蛋白希腊酸奶",
        "Густой натуральный греческий йогурт с удвоенным содержанием молочного белка (8 г на 100 г). Без добавления сахара, крахмала и консервантов.",
        "Густы натуральны грэчаскі ёгурт з падвоеным утрыманнем малочнага бялку (8 г на 100 г). Без цукру і крухмалу.",
        "Thick strained Greek yogurt delivering 8g natural dairy protein per 100g. Zero added sugar, zero starch, ideal for athletes and healthy nutrition.",
        "浓稠滤乳清希腊酸奶，每100克含8克天然乳蛋白，零添加蔗糖与增稠淀粉，适合运动健身与轻食代餐。",
        [
            _pkg("gy-140", "140 г", 140, "21 сутки", "21 суткі", "21 days", "21天", "+2…+6 °C", "Стакан с платинкой", "Шклянка з плацінкай", "Sealed thermoformed cup", "密封杯装", 12, "4810268051010"),
            _pkg("gy-350", "350 г", 350, "21 сутки", "21 суткі", "21 days", "21天", "+2…+6 °C", "Семейный контейнер с крышкой", "Сямейны кантэйнер з вечкам", "Reclosable family tub", "可重复密封家庭桶", 8, "4810268051027"),
        ],
        {
            "flavor": {"ru": "Натуральный без наполнителей", "be": "Натуральны без напаўняльнікаў", "en": "Plain natural", "zh": "原味无添加"},
            "proteinNote": {"ru": "8,0 г / 100 г (высокий белок)", "be": "8,0 г / 100 г (высокі бялок)", "en": "8.0 g / 100g (High Protein)", "zh": "8.0克 / 100克（高蛋白）"},
            "sugar": {"ru": "Без добавленного сахара", "be": "Без дададзенага цукру", "en": "No added sugar", "zh": "零添加蔗糖"},
        },
        ["high-protein", "fitness", "salad", "daily"],
        ["greek-yogurt-lactose-free", "tvorog-grain", "milk-lactose-free"],
    ),
    _p(
        "yogurt-drink-blueberry", "yogurt", "drinkable", "asset:productGreekYogurt", 1.5, 3.1, False, True, False,
        "Йогурт питьевой с черникой и злаками 1,5%", "Ёгурт пітны з чарніцай і злакамі 1,5%", "Drinkable Yogurt Blueberry & Grains 1.5%", "蓝莓谷物风味饮用酸奶 1.5%",
        "Лёгкий питьевой йогурт с натуральным пюре лесной черники и цельнозерновыми хлопьями. Без искусственных красителей.",
        "Лёгкі пітны ёгурт з натуральным пюрэ лясной чарніцы і цэльназерневымі шматкі.",
        "Smooth drinkable yogurt blended with wild forest blueberry puree and whole-grain oat flakes. No artificial colors.",
        "清爽顺滑的饮用型酸奶，融入天然野生蓝莓果泥与全谷物燕麦片，营养饱腹。",
        [
            _pkg("yd-290", "290 г", 290, "21 сутки", "21 суткі", "21 days", "21天", "+2…+6 °C", "Порционная ПЭТ-бутылка", "Парцыйная ПЭТ-бутэлька", "On-the-go PET bottle", "便携PET瓶装", 12, "4810268052017"),
            _pkg("yd-750", "750 г", 750, "21 сутки", "21 суткі", "21 days", "21天", "+2…+6 °C", "Семейная ПЭТ-бутылка", "Сямейная ПЭТ-бутэлька", "Family PET bottle", "家庭装PET瓶", 8, "4810268052024"),
        ],
        {
            "flavor": {"ru": "Черника — овсяные злаки", "be": "Чарніца — аўсяныя злакі", "en": "Blueberry & oats", "zh": "野生蓝莓燕麦"},
            "proteinNote": {"ru": "3,1 г / 100 г", "be": "3,1 г / 100 г", "en": "3.1 g / 100g", "zh": "3.1克 / 100克"},
            "sugar": {"ru": "Пониженное содержание сахара", "be": "Паніжанае ўтрыманне цукру", "en": "Reduced sugar", "zh": "低糖配方"},
        },
        ["daily", "fitness"],
        ["greek-yogurt-protein", "kefir-classic"],
    ),
    _p(
        "greek-yogurt-lactose-free", "yogurt", "greek", "asset:productGreekYogurt", 2.0, 8.2, True, True, False,
        "Йогурт греческий безлактозный Active Life 2%", "Ёгурт грэчаскі безлактозны Active Life 2%", "Active Life Lactose-Free Greek Yogurt 2%", "Active Life 零乳糖高蛋白希腊酸奶 2%",
        "Сочетает два ключевых преимущества: высокое содержание белка (8,2 г) и полное отсутствие лактозы (< 0,01%) для комфортного питания без ограничений.",
        "Спалучае высокае ўтрыманне бялку (8,2 г) і поўную адсутнасць лактозы (< 0,01%).",
        "Combines 8.2g natural dairy protein per 100g with zero lactose (< 0.01%) and zero added sugar for sensitive digestion.",
        "兼具每100克8.2克高蛋白与零乳糖（<0.01%）双重优势，无添加蔗糖，适合健身与乳糖不耐受人群。",
        [
            _pkg("gylf-140", "140 г", 140, "21 сутки", "21 суткі", "21 days", "21天", "+2…+6 °C", "Герметичный стакан 140 г", "Герметычны кубак 140 г", "Sealed 140g cup", "140克密封杯装", 12, "4810268053014"),
        ],
        {
            "flavor": {"ru": "Натуральный без лактозы", "be": "Натуральны без лактозы", "en": "Plain lactose-free", "zh": "原味无乳糖"},
            "proteinNote": {"ru": "8,2 г / 100 г (высокий белок)", "be": "8,2 г / 100 г (высокі бялок)", "en": "8.2 g / 100g (High Protein)", "zh": "8.2克 / 100克（高蛋白）"},
            "sugar": {"ru": "Без добавленного сахара", "be": "Без дададзенага цукру", "en": "No added sugar", "zh": "零添加蔗糖"},
        },
        ["lactose-free", "high-protein", "fitness", "daily"],
        ["milk-lactose-free", "greek-yogurt-protein"],
    ),

    # 15–16: SOUR CREAM
    _p(
        "sour-cream-20", "sour-cream", "classic-sour-cream", "asset:productButterCream", 20.0, 2.8, False, True, False,
        "Сметана 20% традиционная", "Смятана 20% традыцыйная", "Traditional Sour Cream 20%", "经典发酵酸奶油 20%",
        "Плотная, глянцевая сметана из нормализованных сливок и чистой культуры молочнокислых бактерий. Отлично подходит к горячим блюдам и выпечке.",
        "Шчыльная смятана з нармалізаваных вяршкоў і чыстай культуры малочнакіслых бактэрый.",
        "Rich, spoonable cultured sour cream crafted exclusively from pure dairy cream and lactic starter cultures.",
        "纯正鲜奶油与乳酸菌发酵制成的浓稠酸奶油，质地丝滑，适合烹饪佐餐与烘焙。",
        [
            _pkg("sc-200", "200 г", 200, "21 сутки", "21 суткі", "21 days", "21天", "+2…+6 °C", "Пластиковый стакан + крышка", "Пластыкавы кубак + вечка", "Cup with snap lid", "带盖塑料杯", 12, "4810268031012"),
            _pkg("sc-400", "400 г", 400, "21 сутки", "21 суткі", "21 days", "21天", "+2…+6 °C", "Большой стакан + крышка", "Вялікі кубак + вечка", "Family cup with lid", "家庭装大杯", 8, "4810268031029"),
        ],
        {
            "consistency": {"ru": "Однородная, густая, с глянцевым срезом", "be": "Аднародная, густая", "en": "Thick, glossy, homogeneous", "zh": "质地浓稠均匀有光泽"},
            "cultures": {"ru": "Мезофильные лактококки", "be": "Мезафільныя лактакокі", "en": "Mesophilic lactic cultures", "zh": "嗜温乳酸菌"},
        },
        ["daily", "baking"],
        ["sour-cream-15-horeca", "butter-825", "tvorog-grain"],
    ),
    _p(
        "sour-cream-15-horeca", "sour-cream", "classic-sour-cream", "asset:productButterCream", 15.0, 2.9, False, True, False,
        "Сметана 15% классическая и HoReCa", "Смятана 15% класічная і HoReCa", "Cultured Sour Cream 15% (Retail & HoReCa)", "经典与餐饮专供酸奶油 15%",
        "Нежная сметана пониженной жирности для соусов, салатов, борща и ресторанных кухонь. Поставляется в стаканах 200 г и вёдрах 3 кг.",
        "Далікатная смятана 15% для соўсаў, салатаў і рэстаранных кухняў у шклянках 200 г і вёдрах 3 кг.",
        "Light 15% cultured sour cream ideal for salads, sauces, and commercial kitchens, available in 200g retail cups and 3kg HoReCa pails.",
        "15%轻脂酸奶油，适合搭配沙拉、调制酱汁与餐厅商用厨房，提供200克杯装与3公斤商用桶装。",
        [
            _pkg("sc15-200", "200 г", 200, "21 сутки", "21 суткі", "21 days", "21天", "+2…+6 °C", "Пластиковый стакан", "Пластыкавы кубак", "Retail plastic cup", "零售塑料杯", 12, "4810268032019"),
            _pkg("sc15-3000", "3 кг (HoReCa)", 3000, "21 сутки", "21 суткі", "21 days", "21天", "+2…+6 °C", "Пищевое ведро с контролем вскрытия", "Харчовае вядро з кантролем ускрыцця", "Tamper-evident 3kg HoReCa pail", "3公斤商用密封桶", 2, "4810268032026"),
        ],
        {
            "consistency": {"ru": "Нежная, однородная, без отсечения сыворотки", "be": "Далікатная, аднародная", "en": "Smooth, stable texture", "zh": "细腻顺滑无乳清析出"},
            "cultures": {"ru": "Чистые молочнокислые культуры", "be": "Чыстыя малочнакіслыя культуры", "en": "Pure lactic cultures", "zh": "纯正乳酸菌发酵"},
        },
        ["horeca", "daily", "salad"],
        ["sour-cream-20", "cream-33"],
    ),

    # 17–18: TVOROG
    _p(
        "tvorog-grain", "tvorog", "crumbly", "asset:productGreekYogurt", 5.0, 17.0, False, True, False,
        "Творог рассыпчатый 5% (высокий белок)", "Тварог рассыпісты 5% (высокі бялок)", "High-Protein Crumbly Tvorog 5%", "高蛋白颗粒凝乳干酪 5%",
        "Натуральный рассыпчатый творог с крупным мягким зерном и высоким содержанием казеинового белка (17 г на 100 г). Бережно упакован в защитную газовую среду.",
        "Натуральны рассыпісты тварог з высокім утрыманнем казеінавага бялку (17 г на 100 г).",
        "Clean-label crumbly tvorog rich in slow-digesting casein protein (17g per 100g), packed in modified atmosphere for freshness.",
        "富含17克优质酪蛋白的传统颗粒凝乳干酪，采用气调锁鲜包装，适合健身营养餐与烘焙。",
        [
            _pkg("tv-220", "220 г", 220, "20 суток", "20 сутак", "20 days", "20天", "+2…+6 °C", "Пакет стабило-бэг (МГС)", "Пакет стабіла-бэг (МГС)", "MAP stabilo pouch", "气调自立袋", 12, "4810268061019"),
            _pkg("tv-450", "450 г", 450, "20 суток", "20 сутак", "20 days", "20天", "+2…+6 °C", "Пакет с zip-lock", "Пакет з zip-lock", "Resealable zip-lock pouch", "自封拉链袋", 8, "4810268061026"),
        ],
        {
            "grain": {"ru": "Рассыпчатое мягкое зерно", "be": "Рассыпістае мяккае зярня", "en": "Soft crumbly curds", "zh": "松散柔润凝乳粒"},
            "proteinNote": {"ru": "17,0 г / 100 г", "be": "17,0 г / 100 г", "en": "17.0 g / 100g", "zh": "17.0克 / 100克"},
        },
        ["high-protein", "fitness", "baking", "daily"],
        ["cottage-cheese-cream-5", "greek-yogurt-protein", "sour-cream-20"],
    ),
    _p(
        "cottage-cheese-cream-5", "tvorog", "grained", "asset:productGreekYogurt", 5.0, 12.5, False, True, False,
        "Творог зернёный в сливках 5%", "Тварог зярністы ў вяршках 5%", "Grained Cottage Cheese in Cream 5%", "鲜奶油颗粒干酪 5%",
        "Нежное творожное зерно, залитое слегка подсоленными пастеризованными сливками. Готовый белковый завтрак и основа для свежих салатов.",
        "Далікатнае тварожнае зярня ў злёгку падсоленых пастэрызаваных вяршках.",
        "Delicate dairy curd pearls bathed in lightly salted pasteurized cream. Ready-to-eat high-protein breakfast.",
        "鲜嫩干酪凝乳颗粒配以微咸巴氏杀菌淡奶油，开盖即食的高蛋白营养早餐。",
        [
            _pkg("cc-150", "150 г", 150, "18 суток", "18 сутак", "18 days", "18天", "+2…+6 °C", "Стаканчик с фольгой", "Кубачак з фальгой", "Foil-sealed retail cup", "铝箔封口杯装", 12, "4810268062016"),
            _pkg("cc-300", "300 г", 300, "18 суток", "18 сутак", "18 days", "18天", "+2…+6 °C", "Контейнер с крышкой", "Кантэйнер з вечкам", "Tub with snap lid", "带盖盒装", 8, "4810268062023"),
        ],
        {
            "grain": {"ru": "Калиброванное зерно в свежих сливках", "be": "Калібраванае зярня ў вяршках", "en": "Uniform curd pearls in cream", "zh": "均匀凝乳粒配鲜奶油"},
            "proteinNote": {"ru": "12,5 г / 100 г", "be": "12,5 г / 100 г", "en": "12.5 g / 100g", "zh": "12.5克 / 100克"},
        },
        ["high-protein", "fitness", "salad", "daily"],
        ["tvorog-grain", "greek-yogurt-protein"],
    ),

    # 19–20: BUTTER
    _p(
        "butter-825", "butter", "sweet-cream", "asset:productButterCream", 82.5, 0.6, False, True, True,
        "Масло сливочное несолёное 82,5%", "Масла сметанковае несалёнае 82,5%", "Unsalted Sweet Cream Butter 82.5%", "82.5% 天然甜奶油无盐黄油",
        "Классическое сладкосливочное масло высшего качества из отборных пастеризованных сливок. Чистый сливочный аромат, идеальная пластичность для кондитерских изделий и экспорта.",
        "Класічнае салодкасметанковае масла вышэйшай якасці са свежых вяршкоў.",
        "Premium 82.5% milkfat unsalted butter churned from fresh pasteurized sweet cream. Ideal for French pastry lamination, retail, and global export.",
        "采用巴氏杀菌鲜奶油搅打而成的82.5%高乳脂无盐黄油，奶香纯粹、延展性佳，适用于起酥烘焙及国际出口。",
        [
            _pkg("but-180", "180 г", 180, "60 суток (+2…+6 °C) / 120 суток (-16 °C)", "60 / 120 сутак", "60 days (+2…+6 °C) / 120 days (-16 °C)", "60天冷藏 / 120天冷冻", "+2…+6 °C или -16 °C", "Кашированная фольга", "Кашыраваная фальга", "Laminated foil wrap", "复合铝箔包装", 24, "4810268071018"),
            _pkg("but-20000", "20 кг (Монолит B2B)", 20000, "24 месяца при -18 °C", "24 месяцы пры -18 °C", "24 months at -18 °C", "24个月 (-18 °C)", "-18 °C", "Гофрокороб с пергаментным вкладышем", "Гофракаробка з пергаментам", "20kg export carton with parchment liner", "20公斤出口防潮纸箱", 1, "4810268071094"),
        ],
        {
            "standard": {"ru": "ГОСТ 32261-2013 / Высший сорт", "be": "ДАСТ 32261-2013 / Вышэйшы гатунак", "en": "GOST 32261 / Grade A", "zh": "GOST 32261 最高等级"},
            "method": {"ru": "Непрерывное сбивание свежих сливок", "be": "Бесперапыннае збіванне вяршкоў", "en": "Continuous sweet-cream churning", "zh": "鲜奶油连续搅打工艺"},
        },
        ["baking", "export", "daily", "horeca"],
        ["butter-725", "cream-33", "skim-milk-powder-b2b"],
    ),
    _p(
        "butter-725", "butter", "sweet-cream", "asset:productButterCream", 72.5, 0.8, False, True, False,
        "Масло сливочное крестьянское 72,5%", "Масла сметанковае сялянскае 72,5%", "Sweet Cream Butter 72.5%", "72.5% 经典乡村甜奶油黄油",
        "Натуральное крестьянское сладкосливочное масло для бутербродов, каш и домашней выпечки в потребительской и весовой фасовке.",
        "Натуральнае сялянскае салодкасметанковае масла 72,5% для штодзённага рацыёну і выпечкі.",
        "Traditional 72.5% milkfat sweet cream butter crafted for everyday spreads, breakfast dishes, and home baking.",
        "72.5%乳脂含量天然甜奶油黄油，奶香柔和，适合日常佐餐抹酱及家庭烘焙。",
        [
            _pkg("but72-180", "180 г", 180, "60 суток (+2…+6 °C)", "60 сутак (+2…+6 °C)", "60 days (+2…+6 °C)", "60天冷藏", "+2…+6 °C", "Кашированная фольга", "Кашыраваная фальга", "Foil wrap 180g", "180克铝箔包装", 24, "4810268072015"),
            _pkg("but72-5000", "5 кг (HoReCa)", 5000, "120 суток (-18 °C)", "120 сутак (-18 °C)", "120 days (-18 °C)", "120天冷冻", "-18 °C", "Короб с пергаментом 5 кг", "Каробка 5 кг", "5kg HoReCa carton", "5公斤餐饮纸箱", 1, "4810268072022"),
        ],
        {
            "standard": {"ru": "ГОСТ 32261-2013 / Крестьянское", "be": "ДАСТ 32261-2013 / Сялянскае", "en": "GOST 32261 / 72.5%", "zh": "GOST 32261 标准"},
            "method": {"ru": "Сбивание пастеризованных сливок", "be": "Збіванне пастэрызаваных вяршкоў", "en": "Pasteurized sweet-cream churning", "zh": "巴氏杀菌稀奶油搅打"},
        },
        ["daily", "baking", "horeca"],
        ["butter-825", "sour-cream-20"],
    ),

    # 21–22: ICE CREAM
    _p(
        "ice-cream-plombir", "ice-cream", "plombir", "asset:productIceCream", 15.0, 3.5, False, True, False,
        "Мороженое «Пломбир ГороденЪ» ванильный 15%", "Марозіва «Пламбір ГорадзенЪ» ванільны 15%", "Goroden Vanilla Plombir Ice Cream 15%", "Goroden 15% 香草经典冰淇淋",
        "Настоящий сливочный пломбир на цельном молоке и свежих сливках с натуральным экстрактом бурбонской ванили. Нежная тающая текстура без растительных жиров.",
        "Сапраўдны сметанковы пламбір на цэльным малацэ і свежых вяршках з натуральнай ваніллю.",
        "Rich 15% dairy-fat plombir ice cream crafted with fresh cream, whole milk, and natural Bourbon vanilla extract.",
        "采用全脂鲜奶、稀奶油与天然波旁香草精制成的15%高乳脂经典白俄罗斯冰淇淋，口感绵密无植物油。",
        [
            _pkg("ice-80", "80 г (стаканчик)", 80, "12 месяцев", "12 месяцаў", "12 months", "12个月", "-18 °C", "Вафельный стаканчик во флоу-паке", "Вафельны стаканчык у флоў-паку", "Wafer cup in flow-pack", "脆筒杯密封袋装", 30, "4810268081017"),
            _pkg("ice-500", "500 г (ванночка)", 500, "12 месяцев", "12 месяцаў", "12 months", "12个月", "-18 °C", "Контейнер с контролем вскрытия", "Кантэйнер з кантролем ускрыцця", "Tamper-evident family tub", "防拆家庭装盒", 8, "4810268081024"),
        ],
        {
            "iceType": {"ru": "Пломбир сливочный 15%", "be": "Пламбір сметанковы 15%", "en": "15% dairy-fat plombir", "zh": "15%乳脂经典冰淇淋"},
            "flavor": {"ru": "Натуральная ваниль", "be": "Натуральная ваніль", "en": "Natural vanilla", "zh": "天然香草味"},
        },
        ["dessert", "export"],
        ["ice-cream-chocolate-15", "cream-33", "curd-bar-vanilla"],
    ),
    _p(
        "ice-cream-chocolate-15", "ice-cream", "plombir", "asset:productIceCream", 15.0, 3.6, False, True, False,
        "Мороженое пломбир шоколадный в глазури 15%", "Марозіва пламбір шакаладны ў глазуры 15%", "Chocolate Plombir Eskimo 15%", "15% 脆皮巧克力经典雪糕",
        "Шоколадный сливочный пломбир с какао-маслом в хрустящей шоколадной глазури. Выпускается на палочке (эскимо) и в семейном брикете.",
        "Шакаладны сметанковы пламбір у хрумсткай шакаладнай глазуры на палачцы і ў брыкеце.",
        "Rich cocoa plombir ice cream enrobed in real crisp chocolate glaze, offered as single eskimo bars and 450g family packs.",
        "浓郁可可奶油冰淇淋外裹酥脆黑巧克力脆皮，提供单支雪糕与450克家庭盒装。",
        [
            _pkg("icec-75", "75 г (эскимо)", 75, "12 месяцев", "12 месяцаў", "12 months", "12个月", "-18 °C", "Флоу-пак эскимо на палочке", "Флоў-пак эскімо", "Eskimo stick flow-pack", "木棒雪糕独立密封袋", 30, "4810268082014"),
            _pkg("icec-450", "450 г (контейнер)", 450, "12 месяцев", "12 месяцаў", "12 months", "12个月", "-18 °C", "Пластиковый контейнер 450 г", "Пластыкавы кантэйнер 450 г", "450g plastic tub", "450克塑料家庭桶", 8, "4810268082021"),
        ],
        {
            "iceType": {"ru": "Пломбир шоколадный 15%", "be": "Пламбір шакаладны 15%", "en": "15% chocolate plombir", "zh": "15%巧克力经典冰淇淋"},
            "flavor": {"ru": "Бельгийский какао и тёмный шоколад", "be": "Бельгійскі какава і цёмны шакалад", "en": "Rich cocoa & dark chocolate", "zh": "浓郁可可与黑巧克力"},
        },
        ["dessert", "export"],
        ["ice-cream-plombir", "curd-mousse-cocoa"],
    ),

    # 23–24: CREAM
    _p(
        "cream-33", "cream", "whipping", "asset:productButterCream", 33.0, 2.2, False, True, False,
        "Сливки питьевые для взбивания 33%", "Вяршкі пітныя для ўзбівання 33%", "UHT Whipping Cream 33%", "33% 超高温灭菌稀奶油（打发专用）",
        "Ультрапастеризованные натуральные сливки без растительных жиров и стабилизаторов. Быстро взбиваются в устойчивый глянцевый крем для кондитерского производства и кофеен.",
        "Ультрапастэрызаваныя натуральныя вяршкі 33% без раслінных тлушчаў для кандытараў і HoReCa.",
        "Pure 33% UHT dairy whipping cream with zero vegetable fats. Whips to stable peaks for pastry kitchens, bakeries, and specialty coffee shops.",
        "纯天然动物稀奶油，无植物脂肪添加，打发率高且稳定性极佳，适合高端烘焙及咖啡餐饮。",
        [
            _pkg("cr-500", "500 мл", 500, "120 суток", "120 сутак", "120 days", "120天", "+2…+25 °C", "Tetra Brik Aseptic 500 мл", "Tetra Brik Aseptic 500 мл", "Tetra Brik Aseptic 500ml", "500毫升利乐无菌盒", 12, "4810268091016"),
            _pkg("cr-1000", "1 л (HoReCa)", 1000, "120 суток", "120 сутак", "120 days", "120天", "+2…+25 °C", "Tetra Brik Aseptic 1 л", "Tetra Brik Aseptic 1 л", "Tetra Brik Aseptic 1L", "1升利乐无菌盒", 12, "4810268091023"),
        ],
        {
            "purpose": {"ru": "Взбивание, ганаш, соусы, бариста", "be": "Узбіванне, ганаш, соусы", "en": "Whipping, ganache, culinary sauces", "zh": "裱花打发、甘纳许、餐饮酱汁"},
            "processing": {"ru": "Ультрапастеризация (UHT)", "be": "Ультрапастэрызацыя (UHT)", "en": "UHT aseptic processing", "zh": "UHT超高温灭菌"},
        },
        ["baking", "horeca", "export", "coffee"],
        ["cream-10-barista", "butter-825", "mozzarella-pizza"],
    ),
    _p(
        "cream-10-barista", "cream", "whipping", "asset:productButterCream", 10.0, 2.8, False, True, False,
        "Сливки питьевые стерилизованные для кофе 10%", "Вяршкі пітныя для кавы 10%", "Barista Dairy Cream 10% (UHT)", "10% 咖啡调配专用稀奶油",
        "Стерилизованные натуральные сливки 10% с мягкой сладостью для эспрессо, фильтр-кофе, крем-супов и пасты. Удобный формат для кофеен и офисов.",
        "Натуральныя вяршкі 10% для эспрэса, крэм-супоў і кавярняў у зручнай упакоўцы.",
        "Smooth 10% sterilized dairy cream tailored for coffee bars, espresso, creamy soups, and pasta sauces.",
        "10%天然稀奶油，口感顺滑柔和，专为浓缩咖啡、浓汤及意式酱汁研发，适合咖啡门店使用。",
        [
            _pkg("cr10-200", "200 мл", 200, "150 суток", "150 сутак", "150 days", "150天", "+2…+25 °C", "Tetra Brik Aseptic 200 мл", "Tetra Brik Aseptic 200 мл", "Tetra Brik 200ml", "200毫升利乐盒", 24, "4810268092013"),
            _pkg("cr10-500", "500 мл", 500, "150 суток", "150 сутак", "150 days", "150天", "+2…+25 °C", "Tetra Brik Aseptic 500 мл с крышкой", "Tetra Brik Aseptic 500 мл", "Tetra Brik 500ml with cap", "500毫升带盖利乐盒", 12, "4810268092020"),
        ],
        {
            "purpose": {"ru": "Кофе, бариста, кулинарные соусы", "be": "Кава, барыста, кулінарныя соусы", "en": "Coffee, barista, culinary sauces", "zh": "咖啡调配、吧台、烹饪酱汁"},
            "processing": {"ru": "Стерилизация / UHT", "be": "Стэрылізацыя / UHT", "en": "Sterilized UHT", "zh": "UHT超高温灭菌"},
        },
        ["coffee", "horeca", "export", "daily"],
        ["cream-33", "milk-uht-15"],
    ),

    # 25–26: DESSERTS
    _p(
        "curd-bar-vanilla", "desserts", "curd-bars", "asset:productIceCream", 20.0, 8.5, False, True, False,
        "Сырок творожный глазированный с ванилью 20%", "Сырок тварожны глазураваны з ваніллю 20%", "Vanilla Glazed Curd Bar 20%", "香草巧克力涂层凝乳棒 20%",
        "Классический творожный десерт на основе нежного протёртого творога и сливочного масла, покрытый настоящей тёмной шоколадной глазурью.",
        "Класічны тварожны дэсерт на аснове далікатнага тварагу ў сапраўднай шакаладнай глазуры.",
        "Velvety sweet tvorog dessert coated in real dark chocolate glaze.",
        "细腻甜味凝乳配以纯正黑巧克力脆皮，带来浓郁的传统白俄罗斯乳品甜点体验。",
        [
            _pkg("cb-45", "45 г", 45, "30 суток", "30 сутак", "30 days", "30天", "+2…+6 °C", "Фольгированный флоу-пак", "Фальгіраваны флоў-пак", "Foil-lined flow-pack", "铝箔密封袋", 20, "4810268101017"),
        ],
        {
            "glaze": {"ru": "Натуральная тёмная шоколадная глазурь", "be": "Натуральная цёмная шакаладная глазура", "en": "Real dark chocolate coating", "zh": "纯正黑巧克力涂层"},
            "flavor": {"ru": "Сливочная ваниль", "be": "Сметанковая ваніль", "en": "Creamy vanilla", "zh": "奶油香草"},
        },
        ["dessert", "daily"],
        ["curd-mousse-cocoa", "ice-cream-plombir"],
    ),
    _p(
        "curd-mousse-cocoa", "desserts", "curd-bars", "asset:productIceCream", 5.0, 7.2, False, True, False,
        "Десерт творожный взбитый «Сливочный с какао» 5%", "Дэсерт тварожны ўзбіты «Сметанковы з какава» 5%", "Whipped Cocoa Tvorog Mousse 5%", "轻盈可可打发凝乳慕斯 5%",
        "Воздушный взбитый творожный мусс с натуральным какао-порошком. Лёгкий молочный десерт с пониженным содержанием жира (5%) и повышенным содержанием белка.",
        "Паветраны ўзбіты тварожны мус з натуральным какава і зніжанай тлустасцю 5%.",
        "Airy whipped dairy tvorog mousse blended with natural cocoa, offering a light 5%-fat treat with 7.2g protein.",
        "绵密轻盈的打发凝乳可可慕斯，乳脂仅5%却富含7.2克蛋白质，轻负担乳制甜品。",
        [
            _pkg("cm-130", "130 г", 130, "21 сутки", "21 суткі", "21 days", "21天", "+2…+6 °C", "Прозрачный стаканчик с платинкой", "Празрысты кубачак з плацінкай", "Sealed transparent cup", "透明密封杯装", 12, "4810268102014"),
        ],
        {
            "glaze": {"ru": "Взбитая творожно-сливочная основа", "be": "Узбітая тварожна-сметанковая аснова", "en": "Aerated tvorog & cream base", "zh": "轻盈凝乳鲜奶油基底"},
            "flavor": {"ru": "Натуральное какао", "be": "Натуральнае какава", "en": "Natural cocoa", "zh": "天然可可风味"},
        },
        ["dessert", "daily", "low-fat"],
        ["curd-bar-vanilla", "greek-yogurt-protein"],
    ),

    # 27–28: DRY DAIRY
    _p(
        "skim-milk-powder-b2b", "dry-dairy", "smp", "asset:newsDairyFacility", 1.5, 34.0, False, True, False,
        "Молоко сухое обезжиренное (СОМ) экспортное", "Малако сухое абястлушчанае (САМ) экспартнае", "Skimmed Milk Powder (SMP) Export Grade", "出口级脱脂奶粉 (SMP) 工业原料",
        "Распылительной сушки, категория Medium Heat / Low Heat. Высокая растворимость, содержание белка не менее 34%. Поставляется в 4-слойных крафт-мешках с полиэтиленовым вкладышем для международного экспорта.",
        "Распыляльнай сушкі, утрыманне бялку не менш за 34%. Пастаўляецца ў крафт-мяшках па 25 кг для міжнароднага экспарту.",
        "Spray-dried Skimmed Milk Powder (Medium/Low Heat) with >=34% dairy protein. Packed in 25 kg multi-wall kraft bags for international food manufacturing and B2B export.",
        "喷雾干燥工艺脱脂奶粉（中热/低热型），乳蛋白含量 ≥34%，25公斤多层牛皮纸袋包装，符合国际食品工业及出口质量标准。",
        [
            _pkg("smp-25000", "25 кг (Крафт-мешок B2B)", 25000, "24 месяца", "24 месяцы", "24 months", "24个月", "0…+20 °C (влажность ≤ 75%)", "4-слойный бумажный мешок с ПЭ-вкладышем", "4-слойны папяровы мяшок з ПЭ-ўкладышам", "25kg 4-ply kraft bag with PE liner", "25公斤四层牛皮纸袋内衬PE膜", 1, "4810268111016"),
        ],
        {
            "grade": {"ru": "ГОСТ 33629-2015 / ADPI Extra Grade", "be": "ДАСТ 33629-2015 / Extra Grade", "en": "ADPI Extra Grade / GOST 33629", "zh": "ADPI 特级 / GOST 33629"},
            "moisture": {"ru": "Не более 4,0%", "be": "Не больш за 4,0%", "en": "Max 4.0%", "zh": "≤ 4.0%"},
            "certifications": {"ru": "FSSC 22000, ISO 9001, Китай (GACC)", "be": "FSSC 22000, ISO 9001, GACC", "en": "FSSC 22000, ISO 9001, China GACC", "zh": "FSSC 22000, ISO 9001, 中国海关GACC注册"},
        },
        ["export", "b2b", "high-protein"],
        ["whole-milk-powder-26", "butter-825"],
    ),
    _p(
        "whole-milk-powder-26", "dry-dairy", "smp", "asset:newsDairyFacility", 26.0, 25.0, False, True, False,
        "Молоко сухое цельное (СЦМ) 26% экспортное", "Малако сухое цэльнае (СЦМ) 26% экспартнае", "Whole Milk Powder (WMP) 26% Export Grade", "出口级全脂奶粉 (WMP 26%) 工业原料",
        "Натуральное цельное сухое молоко жирностью 26% для кондитерских фабрик, шоколадного производства, хлебопечения и экспортных контрактов.",
        "Натуральнае цэльнае сухое малако 26% для кандытарскіх фабрык і экспарту.",
        "Instant-soluble spray-dried Whole Milk Powder (26% fat, 25% protein) tailored for confectionery, chocolate manufacturing, and export.",
        "26%乳脂含量喷雾干燥全脂奶粉，溶解迅速、乳香浓郁，适用于巧克力制作、烘焙食品及出口供应。",
        [
            _pkg("wmp-25000", "25 кг (Крафт-мешок B2B)", 25000, "18 месяцев", "18 месяцаў", "18 months", "18个月", "0…+20 °C (влажность ≤ 75%)", "4-слойный бумажный мешок с ПЭ-вкладышем", "4-слойны папяровы мяшок з ПЭ-ўкладышам", "25kg 4-ply kraft bag with PE liner", "25公斤四层牛皮纸袋内衬PE膜", 1, "4810268112013"),
        ],
        {
            "grade": {"ru": "ГОСТ 33629-2015 / Экспортный стандарт", "be": "ДАСТ 33629-2015 / Экспартны стандарт", "en": "GOST 33629 / Export Grade", "zh": "GOST 33629 出口标准"},
            "moisture": {"ru": "Не более 4,0%", "be": "Не больш за 4,0%", "en": "Max 4.0%", "zh": "≤ 4.0%"},
            "certifications": {"ru": "FSSC 22000, ISO 9001, GACC", "be": "FSSC 22000, ISO 9001, GACC", "en": "FSSC 22000, ISO 9001, China GACC", "zh": "FSSC 22000, ISO 9001, 中国GACC"},
        },
        ["export", "b2b", "baking", "high-protein"],
        ["skim-milk-powder-b2b", "butter-825"],
    ),

    # 29–30: OTHER
    _p(
        "whey-mango-drink", "other", "whey-drinks", "asset:productMilkKefir", 0.1, 0.6, False, True, False,
        "Напиток сывороточный «Active» с соком манго", "Напой сыроватачны «Active» з сокам манга", "Active Whey Fruit Drink (Mango)", "Active 芒果味乳清果汁饮品",
        "Освежающий напиток на основе натуральной молочной сыворотки и концентрированного сока манго. Источник витаминов и лёгких аминокислот.",
        "Асвяжальны напой на аснове натуральнай малочнай сыроваткі і соку манга.",
        "Refreshing beverage crafted from natural dairy whey and mango juice concentrate.",
        "采用天然乳清与浓缩芒果汁调制的清爽饮品，富含维生素与乳清氨基酸。",
        [
            _pkg("whey-930", "930 г", 930, "30 суток", "30 сутак", "30 days", "30天", "+2…+6 °C", "ПЭТ-бутылка", "ПЭТ-бутэлька", "PET bottle", "PET瓶装", 12, "4810268121015"),
        ],
        {
            "base": {"ru": "Осветлённая молочная сыворотка", "be": "Асветленая малочная сыроватка", "en": "Clarified dairy whey", "zh": "澄清乳清"},
            "flavor": {"ru": "Манго — маракуйя", "be": "Манга — маракуя", "en": "Mango & passionfruit", "zh": "芒果百香果"},
        },
        ["daily", "fitness", "export", "low-fat"],
        ["kefir-classic", "condensed-milk-85"],
    ),
    _p(
        "condensed-milk-85", "other", "condensed", "asset:productButterCream", 8.5, 7.2, False, True, False,
        "Молоко цельное сгущённое с сахаром 8,5%", "Малако цэльнае згушчанае з цукрам 8,5%", "Sweetened Condensed Whole Milk 8.5%", "8.5% 经典全脂加糖炼乳",
        "Традиционное сгущённое молоко из цельного коровьего молока и свекловичного сахара без растительных жиров. Выпускается в жестяных банках 380 г и HoReCa-формате 3,8 кг.",
        "Традыцыйнае згушчанае малако з цэльнага малака і цукру без раслінных тлушчаў.",
        "Traditional Belarusian sweetened condensed whole milk crafted without vegetable fats in 380g cans and 3.8kg bakery pails.",
        "纯正鲜牛奶与甜菜糖浓缩而成的经典全脂甜炼乳，无植物脂肪添加，提供380克罐装及3.8公斤烘焙商用装。",
        [
            _pkg("cm-380", "380 г (жестяная банка)", 380, "12 месяцев", "12 месяцаў", "12 months", "12个月", "0…+10 °C", "Жестяная банка с ключом easy-open", "Бляшаная банка easy-open", "Easy-open tin can 380g", "380克易拉铁罐", 24, "4810268122012"),
            _pkg("cm-3800", "3.8 кг (HoReCa)", 3800, "12 месяцев", "12 месяцаў", "12 months", "12个月", "0…+10 °C", "Пластиковое ведро HoReCa", "Пластыкавае вядро HoReCa", "3.8kg bakery pail", "3.8公斤烘焙桶装", 2, "4810268122029"),
        ],
        {
            "base": {"ru": "Цельное коровье молоко + сахар (ГОСТ 31688)", "be": "Цэльнае малако + цукар (ДАСТ 31688)", "en": "Whole cow milk + sucrose (GOST 31688)", "zh": "全脂生牛乳 + 白砂糖"},
            "flavor": {"ru": "Классическая сливочно-молочная сладость", "be": "Класічны сметанкова-малочны густ", "en": "Classic sweet creamy taste", "zh": "经典浓醇甜奶香"},
        },
        ["baking", "dessert", "export", "horeca"],
        ["cream-33", "butter-825"],
    ),
]


def _n(nid, date_str, cat, img, title_ru, title_be, title_en, title_zh, exc_ru, exc_be, exc_en, exc_zh, body_ru, body_be, body_en, body_zh, rel):
    year = int(date_str[:4])
    return {
        "id": nid,
        "slug": nid,
        "date": date_str,
        "year": year,
        "categoryId": cat,
        "title": {"ru": title_ru, "be": title_be, "en": title_en, "zh": title_zh},
        "excerpt": {"ru": exc_ru, "be": exc_be, "en": exc_en, "zh": exc_zh},
        "content": {"ru": body_ru, "be": body_be, "en": body_en, "zh": body_zh},
        "image": img,
        "published": True,
        "relatedIds": rel,
        "seo": {
            "title": {
                "ru": f"{title_ru} | Новости Молочный Мир",
                "be": f"{title_be} | Навіны Малочны Мір",
                "en": f"{title_en} | Molochny Mir News",
                "zh": f"{title_zh} | Molochny Mir 新闻",
            },
            "description": {"ru": exc_ru, "be": exc_be, "en": exc_en, "zh": exc_zh},
        },
    }


NEWS_SEED = [
    _n(
        "cheese-export-china-2026", "2026-10-18", "export", "asset:newsDairyFacility",
        "ОАО «Молочный Мир» расширило поставки выдержанных сыров и сухого молока в страны Азии",
        "ААТ «Малочны Мір» пашырыла пастаўкі вытрыманых сыроў і сухога малака ў краіны Азіі",
        "Molochny Mir Expands Aged Cheese and Dry Dairy Shipments to Asia",
        "Molochny Mir 进一步扩大陈年奶酪与干乳制品对亚洲市场出口",
        "Подтверждена аккредитация новой линии распылительной сушки и отгружены первые контейнерные партии сыра «ГороденЪ» и СОМ в Китай и Вьетнам.",
        "Пацверджана акрэдытацыя новай лініі і адгружаны першыя кантэйнерныя партыі сыру і САМ у Кітай і В’етнам.",
        "Following renewed GACC accreditation, the enterprise dispatched container shipments of Goroden aged cheese and SMP to China and Vietnam.",
        "随着GACC资质更新完成，公司已向中国及越南发运首批Goroden陈年奶酪与脱脂奶粉集装箱货柜。",
        "По итогам международного аудита систем безопасности пищевых продуктов FSSC 22000 и подтверждения экспортных сертификатов ISO 9001 и GACC ОАО «Молочный Мир» увеличило экспортные отгрузки в страны Юго-Восточной Азии и Китай на 28% по сравнению с аналогичным периодом прошлого года. Основной драйвер роста — сухое обезжиренное молоко (СОМ) в крафт-мешках по 25 кг, масло сливочное 82,5% в монолитах и выдержанные полутвёрдые сыры с длительным сроком хранения.",
        "Па выніках міжнароднага аўдыту FSSC 22000 і пацвярджэння сертыфікатаў ISO 9001 і GACC ААТ «Малочны Мір» павялічыла экспартныя адгрузкі ў краіны Паўднёва-Усходняй Азіі і Кітай на 28%.",
        "Following a successful international FSSC 22000 food safety audit alongside ISO 9001 and China GACC confirmations, Molochny Mir increased export volume to Southeast Asia and China by 28% year-over-year. Growth was led by 25kg Skimmed Milk Powder bags, 20kg 82.5% butter blocks, and long-shelf-life aged cheeses.",
        "在顺利通过FSSC 22000食品安全体系国际审核并更新ISO 9001与GACC出口认证后，Molochny Mir 对东南亚及中国市场的出口量同比增长28%。",
        ["new-mozzarella-horeca-line", "gacc-smp-renewal-2026"],
    ),
    _n(
        "new-mozzarella-horeca-line", "2026-08-05", "products", "asset:productMozzarella",
        "Запущена новая автоматизированная линия сыров Паста Филата для сегмента HoReCa",
        "Запушчана новая аўтаматызаваная лінія сыроў Паста Філата для сегмента HoReCa",
        "New Automated Pasta Filata Mozzarella Line Launched for HoReCa",
        "全新全自动 HoReCa 餐饮专用马苏里拉奶酪生产线正式投产",
        "Производственная мощность увеличена на 15 тонн в сутки; в ассортименте появились форматы 1 кг и 2,5 кг для сетей пиццерий.",
        "Вытворчая магутнасць павялічана на 15 тон у суткі; з’явіліся фарматы 1 кг і 2,5 кг для піцэрый.",
        "Daily capacity rises by 15 metric tons with dedicated 1kg and 2.5kg vacuum blocks tailored for pizzeria chains.",
        "日产能提升15吨，并新增专为连锁披萨店研发的1公斤与2.5公斤真空包装规格。",
        "Модернизация сыродельного цеха в Гродно позволила внедрить закрытую европейскую линию вытяжения сырного теста с точным контролем влажности и pH. Это гарантирует стабильное плавление и отсутствие подгорания Моцареллы для пиццы в печах с температурой до 400 °C.",
        "Мадэрнізацыя сыраробнага цэха ў Гродне дазволіла ўкараніць закрытую еўрапейскую лінію выцяжэння сырнага цеста з дакладным кантролем вільготнасці.",
        "The modernization of the Grodno cheese plant introduced a closed European pasta filata stretching line with precision moisture and pH control, guaranteeing consistent melt at 400°C oven temperatures.",
        "格罗德诺奶酪车间的现代化改造引入了全封闭欧洲拉伸凝乳生产线，确保披萨奶酪在400°C高温烤炉中稳定拉丝不焦糊。",
        ["cheese-export-china-2026", "grodno-cold-chain-2025"],
    ),
    _n(
        "gacc-smp-renewal-2026", "2026-06-12", "export", "asset:newsDairyFacility",
        "Продлена регистрация GACC для экспорта СОМ, СЦМ и сливочного масла в Китай",
        "Працягнута рэгістрацыя GACC для экспарту САМ, СЦМ і масла ў Кітай",
        "China GACC Export Registration Renewed for Milk Powders & Butter",
        "输华乳制品 GACC 注册资质顺利续期（涵盖奶粉与黄油）",
        "Таможенная администрация КНР подтвердила соответствие производственных площадок в Гродно и Щучине требованиям экспортного контроля.",
        "Мытная адміністрацыя КНР пацвердзіла адпаведнасць пляцовак у Гродне і Шчучыне патрабаванням экспартнага кантролю.",
        "General Administration of Customs of China confirmed compliance across Grodno and Shchuchin dairy plants.",
        "中国海关总署顺利确认格罗德诺与休钦两座生产基地的输华乳制品生产合规资质。",
        "Подтверждение регистрации GACC позволяет бесперебойно отгружать сухое обезжиренное молоко (СОМ), цельное сухое молоко (СЦМ) и сладкосливочное масло 82,5% в адрес китайских пищевых концернов и торговых дистрибьюторов.",
        "Пацвярджэнне рэгістрацыі GACC дазваляе бесперабойна адгружаць САМ, СЦМ і масла 82,5% кітайскім партнёрам.",
        "The renewed GACC registration secures uninterrupted container dispatches of 25kg Skimmed Milk Powder, 26% Whole Milk Powder, and 20kg 82.5% butter blocks into China.",
        "GACC资质续期保障了25公斤脱脂奶粉、全脂奶粉及20公斤装82.5%黄油向中国食品企业的常态化供应。",
        ["cheese-export-china-2026", "gcc-butter-export-contracts-2025"],
    ),
    _n(
        "lactose-free-greek-yogurt-launch", "2026-04-20", "products", "asset:productGreekYogurt",
        "Новинка Active Life: запущен греческий безлактозный йогурт с 8,2 г белка",
        "Навінка Active Life: запушчаны грэчаскі безлактозны ёгурт з 8,2 г бялку",
        "Active Life Launches Lactose-Free High-Protein Greek Yogurt (8.2g Protein)",
        "Active Life 新品发布：零乳糖高蛋白希腊酸奶上市",
        "Функциональная линейка без лактозы дополнена густым греческим йогуртом без добавленного сахара в стакане 140 г.",
        "Функцыянальная лінейка без лактозы дапоўнена густым грэчаскім ёгуртам без цукру ў шклянцы 140 г.",
        "The functional nutrition line adds a strained zero-sugar, zero-lactose Greek yogurt delivering 8.2g protein per 100g.",
        "功能营养系列新增零蔗糖、零乳糖希腊酸奶，每100克提供8.2克天然乳蛋白。",
        "Новая рецептура объединяет технологию ультрафильтрации и ферментативное расщепление лактозы до уровня менее 0,01%, сохраняя плотную кремовую текстуру.",
        "Новая рэцэптура аб’ядноўвае ультрафільтрацыю і ферментатыўнае расшчапленне лактозы да ўзроўню менш за 0,01%.",
        "The recipe combines membrane ultrafiltration with gentle lactase hydrolysis below 0.01% residual lactose while maintaining rich spoonable thickness.",
        "新配方结合超滤浓缩与酶解去乳糖技术，乳糖含量低于0.01%，同时保留顺滑醇厚的希腊酸奶质地。",
        ["active-life-protein-award", "barista-cream-uht-series-2025"],
    ),
    _n(
        "prodexpo-gold-medal-2026", "2026-02-19", "awards", "asset:productAgedCheese",
        "Сыр «ГороденЪ» и масло 82,5% завоевали золотые медали на международной выставке «Продэкспо-2026»",
        "Сыр «ГорадзенЪ» і масла 82,5% заваявалі залатыя медалі на «Прадэкспа-2026»",
        "Goroden Aged Cheese & 82.5% Butter Win Gold Medals at Prodexpo 2026",
        "Goroden 陈年奶酪与 82.5% 黄油斩获 2026 国际食品展金奖",
        "Экспертная дегустационная комиссия отметила выдержанный сыр со сроком созревания 90+ суток и сладкосливочное масло высшего сорта.",
        "Дэгустацыйная камісія адзначыла вытрыманы сыр 90+ сутак і масла вышэйшага гатунку.",
        "Blind sensory panels awarded top gold honors to the 90-day aged Goroden cheese and 82.5% unsalted sweet cream butter.",
        "专业盲测评委团向90天窖藏奶酪及82.5%天然甜奶油黄油颁发最高质量金奖。",
        "В конкурсе «Лучший продукт — 2026» обе позиции получили максимальные оценки за стабильность органолептических свойств, чистый состав и удобную экспортную упаковку.",
        "У конкурсе «Лепшы прадукт — 2026» абедзве пазіцыі атрымалі максімальныя ацэнкі за чысты склад і якасць.",
        "Both flagship SKUs earned top scores for clean-label formulation, sensory consistency, and export-grade barrier packaging.",
        "在年度最佳产品评选中，两款旗舰产品凭借纯净配方与出色的出口包装设计获得了评委满分认可。",
        ["active-life-protein-award", "belagro-grand-prix-goroden-2024"],
    ),
    _n(
        "active-life-protein-award", "2025-11-22", "awards", "asset:productGreekYogurt",
        "Линейка Active Life удостоена Гран-при международного дегустационного конкурса",
        "Лінейка Active Life атрымала Гран-пры міжнароднага дэгустацыйнага конкурсу",
        "Active Life High-Protein & Lactose-Free Range Wins International Grand Prix",
        "Active Life 高蛋白及无乳糖系列荣获国际乳品品鉴大奖",
        "Экспертное жюри отметило греческий йогурт High Protein и безлактозное молоко 2,5% за чистый состав и сбалансированный вкус.",
        "Экспертнае журы адзначыла грэчаскі ёгурт High Protein і безлактознае малако 2,5%.",
        "International sensory judges awarded gold medals to Active Life High-Protein Greek Yogurt and 2.5% Lactose-Free Milk.",
        "国际评委团授予 Active Life 高蛋白希腊酸奶及2.5%无乳糖牛奶纯正配方金奖。",
        "На ежегодном международном конкурсе качества молочной продукции линейка функционального питания Active Life получила высшие баллы по органолептическим и микробиологическим показателям.",
        "На штогадовым міжнародным конкурсе якасці малочнай прадукцыі лінейка Active Life атрымала вышэйшыя балы.",
        "At the annual international dairy quality competition, the Active Life functional nutrition range achieved top scores in sensory and microbiological benchmarks.",
        "在年度国际乳制品质量大赛中，Active Life 功能营养系列凭借洁净配方与卓越口感获评最高分。",
        ["lactose-free-greek-yogurt-launch", "prodexpo-gold-medal-2026"],
    ),
    _n(
        "gcc-butter-export-contracts-2025", "2025-09-10", "export", "asset:productButterCream",
        "Подписаны долгосрочные контракты на поставку сливочного масла 82,5% в страны Персидского залива",
        "Падпісаны доўгатэрміновыя кантракты на пастаўку масла 82,5% у краіны Персідскага заліва",
        "Long-Term 82.5% Butter Export Contracts Signed for GCC Markets",
        "签署面向海湾合作委员会 (GCC) 市场的 82.5% 黄油长期出口协议",
        "Ежемесячные рефрижераторные отправки монолитов 20 кг стартовали со склада в Скиделе с полным ветеринарным досье.",
        "Штомесячныя рэфрыжэратарныя адпраўкі маналітаў 20 кг стартавалі са склада ў Скідзелі.",
        "Monthly reefer shipments of 20kg sweet cream butter blocks launched from the Skidel hub with full veterinary dossiers.",
        "20公斤出口规格天然黄油冷链专柜已从斯基德尔物流中心启动常态化按月发运。",
        "Поставки осуществляются на условиях CIF в 40-футовых рефрижераторных контейнерах при постоянном температурном контроле -18 °C для пекарен и кондитерских фабрик региона.",
        "Пастаўкі ажыццяўляюцца ў 40-футавых рэфрыжэратарных кантэйнерах пры тэмпературы -18 °C.",
        "Shipments move under CIF terms in 40ft reefers at -18 °C serving industrial bakeries and pastry manufacturers across the Gulf region.",
        "货物采用40英尺-18°C恒温冷藏集装箱按CIF条款直供海湾地区大型烘焙及食品企业。",
        ["gacc-smp-renewal-2026", "middle-east-food-expo-2023"],
    ),
    _n(
        "berestovitsa-aging-cellar-2025", "2025-07-03", "company", "asset:productAgedCheese",
        "В Берестовицком цехе введена новая камера созревания выдержанных сыров на 350 тонн",
        "У Бераставіцкім цэху ўведзена новая камера паспявання сыроў на 350 тон",
        "350-Ton Automated Cheese Aging Cellar Opened in Berestovitsa",
        "别列斯托维察奶酪分厂 350 吨级全自动陈年熟化库正式投用",
        "Автоматизированный микроклимат позволяет одновременно выдерживать сыры элитной серии сроком от 90 до 180 суток.",
        "Аўтаматызаваны мікраклімат дазваляе вытрымліваць сыры тэрмінам ад 90 да 180 сутак.",
        "Precision humidity and climate control expands capacity for 90-to-180-day reserve cheeses.",
        "精准温湿度自控发酵库显著提升90至180天高端陈年奶酪的年产能。",
        "Камера оборудована роботами-переворачивателями головок и системой санитарной очистки воздуха, что обеспечивает ровную корку и глубокий ореховый вкус сыра «ГороденЪ».",
        "Камера абсталявана робатамі для догляду за галоўкамі сыру і сістэмай ачысткі паветра.",
        "Equipped with robotic wheel-turning racks and laminar air filtration, the cellar delivers consistent rind development for Goroden reserve cheese.",
        "熟化库配备自动翻面机器人与洁净空气过滤系统，确保Goroden陈年奶酪风味均匀醇正。",
        ["prodexpo-gold-medal-2026", "belagro-grand-prix-goroden-2024"],
    ),
    _n(
        "barista-cream-uht-series-2025", "2025-05-14", "products", "asset:productButterCream",
        "Обновлённая линейка сливок UHT 10% и 33% для кофеен и профессиональных кондитеров",
        "Абноўленая лінейка вяршкоў UHT 10% і 33% для кавярняў і кандытараў",
        "Refreshed UHT Barista 10% & Whipping Cream 33% Series Released",
        "升级版咖啡专用 10% 奶油与 33% 烘焙淡奶油 UHT 系列上市",
        "Асептическая упаковка с крышкой Tetra Brik обеспечивает 120–150 суток хранения и стабильную работу на кофейной станции.",
        "Асептычная ўпакоўка з вечкам забяспечвае 120–150 сутак захоўвання і зручнасць на кухні.",
        "Reclosable Tetra Brik cartons deliver 120–150 day ambient shelf life and clean whipping stability.",
        "带盖利乐砖无菌包装提供120至150天常温保质期，兼具优异打发稳定性与咖啡融合度。",
        "Сливки для взбивания 33% протестированы шеф-кондитерами: время взбивания не превышает 3 минут, а крем сохраняет чёткий рельеф декора в течение 48 часов.",
        "Вяршкі 33% пратэставаны кандытарамі: крэм захоўвае форму на працягу 48 гадзін.",
        "Tested by commercial pastry chefs, the 33% cream reaches firm peaks in under 3 minutes and holds piped definition for 48 hours.",
        "经专业西点师测试，33%动物淡奶油3分钟内即可快速打发，裱花造型可稳定保持48小时以上。",
        ["new-mozzarella-horeca-line", "lactose-free-greek-yogurt-launch"],
    ),
    _n(
        "iso-fssc-surveillance-audit-2025", "2025-03-08", "company", "asset:newsDairyFacility",
        "Предприятие успешно прошло международный инспекционный аудит FSSC 22000 и ISO 9001",
        "Прадпрыемства паспяхова прайшло міжнародны аўдыт FSSC 22000 і ISO 9001",
        "Successful Surveillance Audit of FSSC 22000 & ISO 9001 Quality Systems",
        "顺利通过 FSSC 22000 与 ISO 9001 国际食品安全质量体系年度监督审核",
        "Независимые аудиторы подтвердили 100% прослеживаемость сырья и соответствие стандартам HACCP на всех четырёх площадках.",
        "Незалежныя аўдытары пацвердзілі 100% прасочвальнасць сыравіны на ўсіх чатырох пляцоўках.",
        "Independent auditors confirmed full raw-milk traceability and HACCP compliance across all four dairy facilities.",
        "独立评审专家组确认四座加工基地全面符合生牛乳全程可追溯与HACCP最高规范。",
        "Проверка охватила входную приёмку молока сорта «Экстра», цеха пастеризации, сыроделия, распылительной сушки и отгрузочный контроль холодовой цепи.",
        "Праверка ахапіла прыёмку малака гатунку «Экстра», цэхі сыраробства і халадовы ланцуг.",
        "The audit covered Extra-grade raw milk intake, pasteurization, cheesemaking, spray drying, and automated cold-chain dispatch.",
        "本次审核覆盖特级生牛乳入厂检测、巴氏杀菌、奶酪发酵、喷雾干燥及冷链发运全流程。",
        ["gacc-smp-renewal-2026", "grodno-cold-chain-2025"],
    ),
    _n(
        "grodno-cold-chain-2025", "2024-09-14", "company", "asset:heroDairyShowcase",
        "Введён в эксплуатацию роботизированный распределительный центр с контролем холодовой цепи",
        "Уведзены ў эксплуатацыю рабатызаваны размеркавальны цэнтр з кантролем халадовага ланцуга",
        "Automated Cold-Chain Distribution Hub Commissioned in Grodno",
        "格罗德诺全自动冷链物流分拨中心正式启用",
        "Новый логистический терминал вмещает 4 200 паллетомест и сокращает время комплектации экспортных и оптовых отгрузок на 40%.",
        "Новы лагістычны тэрмінал змяшчае 4 200 палетамесцаў і паскарае адгрузку на 40%.",
        "The 4,200-pallet automated cold warehouse cuts wholesale and export dispatch lead times by 40%.",
        "拥有4,200个托盘位的智能冷链中心将大宗批发及出口备货周期缩短了40%。",
        "Новый логистический хаб оснащён многозональными камерами (+2…+6 °C и -18 °C) с круглосуточным телеметрическим мониторингом температуры и автоматизированной системой WMS.",
        "Новы лагістычны хаб аснашчаны шматзанальнымі камерамі (+2…+6 °C і -18 °C) і сістэмай WMS.",
        "Equipped with dual-zone climate chambers (+2…+6 °C and -18 °C) and automated WMS tracking, the hub ensures uninterrupted cold-chain integrity.",
        "该中心配备+2至+6°C冷藏库与-18°C冷冻库及全自动WMS仓储系统，保障乳制品从工厂到全球客户端的全程新鲜。",
        ["new-mozzarella-horeca-line", "iso-fssc-surveillance-audit-2025"],
    ),
    _n(
        "belagro-grand-prix-goroden-2024", "2024-06-07", "awards", "asset:productAgedCheese",
        "Сыры «ГороденЪ» и Моцарелла получили диплом Гран-при на выставке «Белагро-2024»",
        "Сыры «ГорадзенЪ» і Мацарэла атрымалі дыплом Гран-пры на выставе «Белагра-2024»",
        "Goroden Cheese & Classic Mozzarella Win Grand Prix at Belagro 2024",
        "Goroden 奶酪与经典马苏里拉奶酪荣获 2024 白俄罗斯农业展特等奖",
        "Высокую оценку профессионального сообщества получила широкая линейка сыров и форматов фасовки от 125 г до 4 кг.",
        "Высокую ацэнку прафесійнай супольнасці атрымала лінейка сыроў у фасоўках ад 125 г да 4 кг.",
        "Industry experts recognized the full cheese portfolio spanning 125g retail pouches to 4kg wheels.",
        "从125克零售装到4公斤整轮的专业奶酪包装矩阵获得行业专家高度评价。",
        "На главной аграрной выставке страны стенд ОАО «Молочный Мир» посетили более 40 зарубежных делегаций и представителей торговых сетей.",
        "Стэнд ААТ «Малочны Мір» наведалі больш за 40 замежных дэлегацый і гандлёвых сетак.",
        "Over 40 international buyer delegations and retail procurement teams visited the Molochny Mir pavilion during the exhibition.",
        "展会期间共有来自40余个国际采购代表团与商超买手莅临公司展位洽谈合作。",
        ["prodexpo-gold-medal-2026", "berestovitsa-aging-cellar-2025"],
    ),
    _n(
        "shchuchin-spray-dryer-upgrade-2024", "2024-04-02", "company", "asset:newsDairyFacility",
        "Модернизация сушильного комплекса в Щучине увеличила выпуск экспортного СОМ на 30%",
        "Мадэрнізацыя сушыльнага комплексу ў Шчучыне павялічыла выпуск САМ на 30%",
        "Shchuchin Spray-Drying Upgrade Increases Export SMP Capacity by 30%",
        "休钦奶粉干燥中心升级改造使出口级脱脂奶粉产能提升 30%",
        "Новая башня распылительной сушки снижает влажность порошка ниже 3,8% и повышает индекс растворимости.",
        "Новая вежа распыляльнай сушкі зніжае вільготнасць парашку ніжэй за 3,8%.",
        "Upgraded spray-drying tower brings moisture below 3.8% and improves instant solubility for industrial B2B buyers.",
        "全新升级的喷雾干燥塔将奶粉水分控制在3.8%以下，大幅提升工业冲调溶解度。",
        "Модернизация позволяет выпускать сухое обезжиренное молоко (СОМ) классов Low Heat и Medium Heat в соответствии со стандартами ADPI Extra Grade.",
        "Мадэрнізацыя дазваляе выпускаць САМ класаў Low Heat і Medium Heat па стандартах ADPI Extra Grade.",
        "The upgraded line produces Low Heat and Medium Heat Skimmed Milk Powder conforming to ADPI Extra Grade specifications.",
        "改造后的产线可稳定供应符合ADPI特级标准的低热与中热型脱脂奶粉。",
        ["gacc-smp-renewal-2026", "cheese-export-china-2026"],
    ),
    _n(
        "plombir-export-packaging-2024", "2024-02-15", "products", "asset:productIceCream",
        "Мороженое «Пломбир ГороденЪ» вышло на экспортные рынки в обновлённой барьерной упаковке",
        "Марозіва «Пламбір ГорадзенЪ» выйшла на экспарт у абноўленай упакоўцы",
        "Goroden Plombir Ice Cream Enters New Export Markets in Barrier Packaging",
        "Goroden 冰淇淋采用升级阻隔锁鲜包装全面拓展国际出口",
        "Многоязычная маркировка (RU / EN / ZH) и усиленный термокороб обеспечивают сохранность пломбира при контейнерных перевозках.",
        "Шматмоўная маркіроўка (RU / EN / ZH) забяспечвае захаванасць пламбіру пры экспарце.",
        "Multilingual packaging (RU / EN / ZH) and reinforced master cartons preserve plombir structure across long-haul reefer transit.",
        "多语言包装标识（俄/英/中）与加强型冷链外箱确保冰淇淋在跨国冷链运输中保持完美质地。",
        "Экспортная линейка включает классический ванильный и шоколадный пломбир 15% жирности на натуральных сливках без заменителей молочного жира.",
        "Экспартная лінейка ўключае ванільны і шакаладны пламбір 15% на натуральных вяршках.",
        "The export range features 15% dairy-fat vanilla and chocolate plombir formulated strictly without vegetable oils.",
        "出口系列涵盖15%纯乳脂香草与巧克力冰淇淋，100%不含植物油脂替代成分。",
        ["ice-cream-plombir", "grodno-cold-chain-2025"],
    ),
    _n(
        "digital-edi-traceability-2023", "2023-11-18", "company", "asset:heroDairyShowcase",
        "Внедрён цифровой электронный документооборот (EDI / ЭТТН) и сквозная маркировка GTIN",
        "Укаранёны электронны дакументаабарот (EDI / ЭТТН) і маркіроўка GTIN",
        "Full EDI Invoicing & GS1 GTIN Traceability Rolled Out for B2B Partners",
        "全面上线 B2B 电子单据 (EDI) 与 GS1 GTIN 国际溯源条码体系",
        "Оптовые покупатели и розничные сети переведены на автоматический обмен электронными накладными и паспортами качества.",
        "Аптовыя пакупнікі і сеткі пераведзены на аўтаматычны абмен электроннымі накладнымі.",
        "Wholesale partners and retail chains now receive automated electronic invoices, batch COAs, and GTIN pallet tracking.",
        "所有批发商与商超合作伙伴均可直接对接电子发票、批次质检报告及托盘GTIN追踪信息。",
        "Интеграция с системами прослеживаемости ускорила приёмку грузов на распределительных центрах торговых сетей в 2,5 раза.",
        "Інтэграцыя з сістэмамі прасочвальнасці паскорыла прыёмку грузаў на РЦ у 2,5 разы.",
        "Integration with automated warehouse traceability cut retail distribution center receiving times by 2.5x.",
        "数字化溯源体系上线后，商超分拨中心的收货验收效率提升了2.5倍。",
        ["grodno-cold-chain-2025", "iso-fssc-surveillance-audit-2025"],
    ),
    _n(
        "middle-east-food-expo-2023", "2023-09-25", "export", "asset:newsDairyFacility",
        "Итоги деловой миссии на Ближнем Востоке: презентация экспортной матрицы молочных ингредиентов",
        "Вынікі дзелавой місіі на Блізкім Усходзе: прэзентацыя экспартнай матрыцы",
        "Middle East Trade Mission: Presenting Dairy Ingredients & Butter Matrix",
        "中东国际食品展圆满收官：全面展示出口级乳脂与奶粉原料矩阵",
        "Проведены переговоры с 25 импортёрами из ОАЭ, Саудовской Аравии и Катара о поставках масла 82,5%, СОМ и сыров.",
        "Праведзены перамовы з 25 імпарцёрамі з ААЭ, Саудаўскай Аравіі і Катара.",
        "Meetings held with 25 regional importers from UAE, Saudi Arabia, and Qatar covering butter, SMP, and aged cheese.",
        "与阿联酋、沙特及卡塔尔25家进口商就82.5%黄油、脱脂奶粉及陈年奶酪供应链展开深度洽谈。",
        "Наибольший интерес зарубежных байеров вызвали промышленные блоки сливочного масла по 20 кг и сухое молоко в 25-килограммовой экспортной таре.",
        "Найбольшую цікавасць выклікалі прамысловыя блокі масла па 20 кг і сухое малако 25 кг.",
        "Regional buyers focused primarily on 20kg industrial unsalted butter blocks and 25kg multi-wall kraft bags of SMP.",
        "中东采购商重点关注20公斤出口块状无盐黄油及25公斤装喷雾干燥脱脂奶粉。",
        ["gcc-butter-export-contracts-2025", "cheese-export-china-2026"],
    ),
]


REDIRECTS_SEED = [
    {"from": "/catalog/syry/motsarella-45.html", "to": "/ru/product/mozzarella", "code": 301, "note": "Legacy PHP/HTML Mozzarella product page"},
    {"from": "/catalog/syry/motsarella-pizza.html", "to": "/ru/product/mozzarella-pizza", "code": 301, "note": "HoReCa pizza mozzarella legacy URL"},
    {"from": "/catalog/syry/goroden-50.html", "to": "/ru/product/goroden-aged", "code": 301, "note": "Aged cheese Goroden legacy URL"},
    {"from": "/catalog/syry/bellavista.html", "to": "/ru/product/brie-bellavista", "code": 301, "note": "Soft white-mold cheese legacy URL"},
    {"from": "/catalog/syry/suluguni.html", "to": "/ru/product/suluguni-grodno", "code": 301, "note": "Suluguni legacy URL"},
    {"from": "/products/moloko-bezlaktoznoe", "to": "/ru/product/milk-lactose-free", "code": 301, "note": "Unified lactose-free milk path"},
    {"from": "/catalog/moloko/moloko-32.html", "to": "/ru/product/milk-classic", "code": 301, "note": "Classic whole milk legacy HTML"},
    {"from": "/catalog/moloko/uht-15.html", "to": "/ru/product/milk-uht-15", "code": 301, "note": "UHT 1.5% milk legacy URL"},
    {"from": "/catalog/kislomolochnye/kefir-25.html", "to": "/ru/product/kefir-classic", "code": 301, "note": "Classic kefir legacy URL"},
    {"from": "/catalog/yogurty/active-life-greek.html", "to": "/ru/product/greek-yogurt-protein", "code": 301, "note": "High-protein Greek yogurt legacy URL"},
    {"from": "/catalog/maslo/maslo-825.html", "to": "/ru/product/butter-825", "code": 301, "note": "Butter 82.5% legacy URL"},
    {"from": "/catalog/suhie/som-export.html", "to": "/ru/product/skim-milk-powder-b2b", "code": 301, "note": "SMP export legacy URL"},
    {"from": "/catalog/syry/", "to": "/ru/catalog/cheese", "code": 301, "note": "Cheese category normalization"},
    {"from": "/catalog/moloko/", "to": "/ru/catalog/milk", "code": 301, "note": "Milk category normalization"},
    {"from": "/catalog/yogurty/", "to": "/ru/catalog/yogurt", "code": 301, "note": "Yogurt category normalization"},
    {"from": "/catalog/maslo/", "to": "/ru/catalog/butter", "code": 301, "note": "Butter category normalization"},
    {"from": "/catalog/morozhenoe/", "to": "/ru/catalog/ice-cream", "code": 301, "note": "Ice cream category normalization"},
    {"from": "/export-info.php", "to": "/ru/export", "code": 301, "note": "Legacy PHP export page"},
    {"from": "/en/export-portal.html", "to": "/en/export", "code": 301, "note": "English export legacy URL"},
    {"from": "/novosti/", "to": "/ru/news", "code": 301, "note": "News archive root normalization"},
    {"from": "/novosti/eksport-kitay-2026.html", "to": "/ru/news/cheese-export-china-2026", "code": 301, "note": "China export news legacy URL"},
    {"from": "/partneram/", "to": "/ru/partners", "code": 301, "note": "B2B partner portal route"},
    {"from": "/o-kompanii.php", "to": "/ru/about", "code": 301, "note": "Legacy company profile PHP page"},
    {"from": "/kontakty.php", "to": "/ru/contacts", "code": 301, "note": "Legacy contacts PHP page"},
]


UI_TRANSLATIONS_SEED = {
    "brandName": {"ru": "Молочный Мир", "be": "Малочны Мір", "en": "Molochny Mir", "zh": "Molochny Mir"},
    "navCatalog": {"ru": "Продукция", "be": "Прадукцыя", "en": "Products", "zh": "产品目录"},
    "navBusiness": {"ru": "B2B и Экспорт", "be": "B2B і Экспарт", "en": "B2B & Export", "zh": "商业与出口"},
    "navExport": {"ru": "Экспорт", "be": "Экспарт", "en": "Export", "zh": "国际出口"},
    "navPartners": {"ru": "Партнёрам", "be": "Партнёрам", "en": "B2B Partners", "zh": "商业合作"},
    "navNews": {"ru": "Новости", "be": "Навіны", "en": "News", "zh": "新闻动态"},
    "navAbout": {"ru": "О компании", "be": "Пра кампанію", "en": "About", "zh": "关于我们"},
    "navContacts": {"ru": "Контакты", "be": "Кантакты", "en": "Contacts", "zh": "联系我们"},
    "ctaContact": {"ru": "Связаться", "be": "Звязацца", "en": "Contact Sales", "zh": "联系销售"},
    "heroTitle": {
        "ru": "Не просто молоко. Главный ингредиент вашего вкуса.",
        "be": "Не проста малако. Галоўны інгрэдыент вашага смаку.",
        "en": "Beyond ordinary dairy. Bold flavor in every drop.",
        "zh": "不止于纯鲜牛奶，更定义每一口醇正风味",
    },
    "heroSubtitle": {
        "ru": "Тягучая моцарелла для идеальной пиццы, выдержанные сыры с характером, нежный пломбир и свежайшее молоко с гродненских ферм — для вашего дома, кухни шеф-повара и поставок в 25+ стран.",
        "be": "Цягучая мацарэла для ідэальнай піцы, вытрыманыя сыры з характарам, далікатны пламбір і свежае малако з гродзенскіх ферм — для вашага дома, кухні шэфа і паставак у 25+ краін.",
        "en": "Stretchy pizzeria mozzarella, 90-day reserve cheeses, creamy plombir, and farm-fresh milk from Grodno — crafted for home tables, top chefs, and partners in 25+ countries.",
        "zh": "高温拉丝的披萨马苏里拉奶酪、90天窖藏陈年干酪、丝滑冰淇淋与牧场直采鲜乳——为您家庭餐桌、专业星厨与全球25+国家供应链注入纯粹美味。",
    },
    "heroPrimaryCta": {"ru": "Выбрать продукцию", "be": "Абраць прадукцыю", "en": "Explore Products", "zh": "探索全部产品"},
    "heroSecondaryCta": {"ru": "Бизнесу и экспорту", "be": "Бізнэсу і экспарту", "en": "B2B & Global Export", "zh": "B2B 与国际出口"},
    "roleConsumerTitle": {"ru": "Потребителю", "be": "Спажыўцу", "en": "For Consumers", "zh": "终端消费者"},
    "roleConsumerDesc": {"ru": "Свежие сыры, молоко, йогурты и мороженое", "be": "Свежыя сыры, малако, ёгурты і марозіва", "en": "Fresh cheeses, milk, yogurts, and ice cream", "zh": "新鲜奶酪、纯牛奶、酸奶与冰淇淋"},
    "roleB2BTitle": {"ru": "Оптовому покупателю", "be": "Аптоваму пакупніку", "en": "Wholesale & HoReCa", "zh": "批发与餐饮客户"},
    "roleB2BDesc": {"ru": "Фасовки HoReCa, логистика и отдел продаж", "be": "Фасоўкі HoReCa, лагістыка і аддзел продажаў", "en": "HoReCa packs, cold-chain terms, direct sales", "zh": "餐饮大包装、冷链物流与销售对接"},
    "roleExportTitle": {"ru": "Зарубежному партнёру", "be": "Замежнаму партнёру", "en": "Global Export", "zh": "海外进口商"},
    "roleExportDesc": {"ru": "СОМ, масло, сыры, сертификаты и спецификации", "be": "САМ, масла, сыры, сертыфікаты і спецыфікацыі", "en": "SMP, butter, aged cheese, export specs", "zh": "脱脂奶粉、黄油、奶酪与出口认证"},
    "roleMediaTitle": {"ru": "СМИ и партнёрам", "be": "СМІ і партнёрам", "en": "Press & Corporate", "zh": "媒体与企业动态"},
    "roleMediaDesc": {"ru": "Новости производства, награды и история", "be": "Навіны вытворчасці, узнагароды і гісторыя", "en": "Production news, awards, and company facts", "zh": "工厂新闻、行业奖项与企业简介"},
    "featuredHeading": {"ru": "Вкусы, которые выбирают каждый день", "be": "Смакі, якія выбіраюць кожны дзень", "en": "Signature Dairy Selection", "zh": "核心精选乳品矩阵"},
    "allProductsLink": {"ru": "Весь каталог", "be": "Увесь каталог", "en": "Full catalog", "zh": "查看全部产品"},
    "searchPlaceholder": {
        "ru": "Умный поиск: «молоко», «сыр для пиццы», «без лактозы», «масло 82.5»…",
        "be": "Разумны пошук: «малако», «сыр для піцы», «без лактозы», «масла 82.5»…",
        "en": "Smart search: \"milk\", \"pizza cheese\", \"lactose-free\", \"butter 82.5\"…",
        "zh": "智能搜索：“鲜牛奶”、“披萨奶酪”、“无乳糖”、“黄油 82.5”…",
    },
    "smartFinderTitle": {"ru": "Умный подбор продукции", "be": "Разумны падбор прадукцыі", "en": "Smart Product Matcher", "zh": "智能选品助手"},
    "smartFinderSubtitle": {
        "ru": "Опишите задачу своими словами — например, для пиццы, высокой белковой диеты, выпечки, экспорта или без лактозы",
        "be": "Апішыце задачу сваімі словамі — для піцы, высокабялковага рацыёну, выпечкі, экспарту ці без лактозы",
        "en": "Describe your culinary, dietary, or B2B goal in plain language to match real products and pack sizes",
        "zh": "用自然语言描述您的烹饪、营养或出口需求，系统将精准匹配目录产品与推荐规格",
    },
    "smartFinderPlaceholder": {
        "ru": "Например: «сыр для пиццы 1 кг», «без лактозы», «много белка до 5% жира»…",
        "be": "Напрыклад: «сыр для піцы 1 кг», «без лактозы», «шмат бялку да 5% тлушчу»…",
        "en": "Try: \"pizza cheese 1kg\", \"lactose-free\", \"high protein under 5% fat\"…",
        "zh": "例如：“1公斤披萨奶酪”、“无乳糖”、“高蛋白低脂”…",
    },
    "requestSalesBtn": {
        "ru": "Запросить информацию / Связаться с отделом продаж",
        "be": "Запытаць інфармацыю / Звязацца з аддзелам продажаў",
        "en": "Request Info / Contact Sales Department",
        "zh": "咨询产品信息 / 联系销售部门",
    },
    "downloadSpecBtn": {
        "ru": "Скачать B2B-спецификацию (PDF)",
        "be": "Спампаваць B2B-спецыфікацыю (PDF)",
        "en": "Download B2B Spec Sheet (PDF)",
        "zh": "下载 B2B 产品规格书 (PDF)",
    },
    "adminTitle": {
        "ru": "CMS-панель управления контентом",
        "be": "CMS-панэль кіравання кантэнтам",
        "en": "Content & Catalog CMS",
        "zh": "内容与目录管理后台 (CMS)",
    },
    "footerLegal": {
        "ru": "ОАО «Молочный Мир» · УНП 500040357 · 230005, г. Гродно, ул. Гаспадарчая, 28",
        "be": "ААТ «Малочны Мір» · УНП 500040357 · 230005, г. Гродна, вул. Гаспадарчая, 28",
        "en": "Molochny Mir JSC · 28 Gaspadarchaya St, Grodno 230005, Belarus",
        "zh": "Molochny Mir 股份公司 · 白俄罗斯格罗德诺市 Gaspadarchaya 街28号",
    },
}
EOF

cat <<'EOF' > backend/app/seed.py
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
EOF

cat <<'EOF' > backend/app/services/smart_match.py
import json
import re
from dataclasses import dataclass
from typing import Iterable
import httpx

from app.config import settings
from app.schemas import (
    CategorySchema,
    Language,
    PackageVariantSchema,
    ProductSchema,
    SmartCriterionSchema,
    SmartMatchResultSchema,
)

INTENT_REASONS: dict[str, dict[str, str]] = {
    "pizza": {
        "ru": "Термостабильность и эластичное плавление для пиццы",
        "be": "Тэрмастабільнасць і эластычнае плаўленне для піцы",
        "en": "Heat-stable stretch and uniform melt for pizza ovens",
        "zh": "耐高温、融化均匀且拉丝绵长，适合披萨烤制",
    },
    "lactoseFree": {
        "ru": "Без лактозы (< 0,01% или естественное отсутствие при выдержке)",
        "be": "Без лактозы (< 0,01% або натуральная адсутнасць пры вытрымцы)",
        "en": "Lactose-free (< 0.01% or naturally eliminated during aging)",
        "zh": "无乳糖（<0.01% 或陈年发酵天然去乳糖）",
    },
    "highProtein": {
        "ru": "Высокое содержание натурального молочного белка",
        "be": "Высокае ўтрыманне натуральнага малочнага бялку",
        "en": "High natural dairy protein content",
        "zh": "高天然乳蛋白含量",
    },
    "noSugar": {
        "ru": "Чистый состав без добавленного сахара",
        "be": "Чысты склад без дададзенага цукру",
        "en": "Clean label with zero added sugar",
        "zh": "零添加蔗糖，配方纯净",
    },
    "wine": {
        "ru": "Богатый букет и текстура для дегустации с вином",
        "be": "Багаты букет і тэкстура для дэгустацыі з віном",
        "en": "Complex aged aroma & texture tailored for wine pairing",
        "zh": "风味层次丰富，适合搭配葡萄酒品鉴",
    },
    "baking": {
        "ru": "Идеально для выпечки, кремов, десертов и ганаша",
        "be": "Ідэальна для выпечкі, крэмаў і кандытаркі",
        "en": "Reliable milkfat structure for pastry, creams, and baking",
        "zh": "乳脂稳定，适合烘焙、打发奶油与甜点制作",
    },
    "coffee": {
        "ru": "Подходит для кофе, капучино, латте и бариста",
        "be": "Падыходзіць для кавы, капучына і барыста",
        "en": "Formulated for coffee, latte foam, and barista use",
        "zh": "适用于咖啡调配、拿铁拉花与专业咖啡吧台",
    },
    "export": {
        "ru": "Экспортная упаковка B2B, сертификаты FSSC 22000 / ISO / GACC",
        "be": "Экспартная ўпакоўка B2B, сертыфікаты FSSC 22000 / ISO / GACC",
        "en": "B2B export-ready packaging with FSSC 22000 / ISO / GACC docs",
        "zh": "B2B 出口专供包装，具备 FSSC 22000 / ISO / GACC 认证",
    },
    "longShelf": {
        "ru": "Увеличенный срок годности для логистики и хранения",
        "be": "Павялічаны тэрмін прыдатнасці для лагістыкі і захоўвання",
        "en": "Extended shelf life for ambient or long-haul storage",
        "zh": "超长保质期，方便仓储与长途冷链/常温物流",
    },
    "dessert": {
        "ru": "Натуральный сливочный десерт или сладкий перекус",
        "be": "Натуральны сметанковы дэсерт або салодкі перакус",
        "en": "Natural dairy dessert made from fresh cream or tvorog",
        "zh": "天然奶油与凝乳制作的美味乳制甜品",
    },
    "lowFat": {
        "ru": "Лёгкий продукт с пониженной жирностью",
        "be": "Лёгкі прадукт з паніжанай тлустасцю",
        "en": "Light dairy option with low milkfat content",
        "zh": "低乳脂轻负担选择",
    },
}

INTENT_CRITERIA_LABELS: dict[str, dict[str, str]] = {
    "pizza": {"ru": "Для пиццы / HoReCa", "be": "Для піцы / HoReCa", "en": "Pizza / HoReCa", "zh": "披萨 / 餐饮"},
    "lactoseFree": {"ru": "Без лактозы", "be": "Без лактозы", "en": "Lactose-Free", "zh": "无乳糖"},
    "highProtein": {"ru": "Высокий белок", "be": "Высокі бялок", "en": "High Protein", "zh": "高蛋白"},
    "noSugar": {"ru": "Без сахара", "be": "Без цукру", "en": "No Added Sugar", "zh": "无糖"},
    "wine": {"ru": "К вину / дегустация", "be": "Да віна / дэгустацыя", "en": "Wine Pairing", "zh": "葡萄酒品鉴"},
    "baking": {"ru": "Для выпечки и крема", "be": "Для выпечкі і крэму", "en": "Baking & Pastry", "zh": "烘焙甜点"},
    "coffee": {"ru": "Для кофе", "be": "Для кавы", "en": "Coffee & Barista", "zh": "咖啡搭配"},
    "export": {"ru": "Экспорт / B2B", "be": "Экспарт / B2B", "en": "Export / B2B", "zh": "出口 / B2B"},
    "longShelf": {"ru": "Длительное хранение", "be": "Працяглае захоўванне", "en": "Long Shelf Life", "zh": "长保质期"},
    "dessert": {"ru": "Десерты", "be": "Дэсерты", "en": "Desserts", "zh": "甜品"},
    "lowFat": {"ru": "Низкая жирность", "be": "Нізкая тлустасць", "en": "Low Fat", "zh": "低脂"},
}

WORD_CHARS = r"a-zа-яіў"
CATEGORY_KEYWORDS: list[tuple[str, re.Pattern[str], dict[str, str]]] = [
    ("cheese", re.compile(rf"(?:^|\s)(сыр[{WORD_CHARS}]*|моцарел[{WORD_CHARS}]*|мацарэл[{WORD_CHARS}]*|moz+arel+a|городен[{WORD_CHARS}]*|горадзен[{WORD_CHARS}]*|goroden|беллавист[{WORD_CHARS}]*|белавіст[{WORD_CHARS}]*|сулугун[{WORD_CHARS}]*|suluguni|бри|brie|cheese[{WORD_CHARS}]*|пармезан|чеддер|гауда|奶酪|芝士|干酪)", re.I), {"ru": "Сыры", "be": "Сыры", "en": "Cheeses", "zh": "奶酪"}),
    ("milk", re.compile(rf"(?:^|\s)(молок[{WORD_CHARS}]*|малак[{WORD_CHARS}]*|milk|uht|тетрапак|tetra\s*pak|пастериз[{WORD_CHARS}]*|ультрапастериз[{WORD_CHARS}]*|牛奶|鲜奶|纯奶)", re.I), {"ru": "Молоко", "be": "Малако", "en": "Milk", "zh": "牛奶"}),
    ("fermented", re.compile(rf"(?:^|\s)(кефир[{WORD_CHARS}]*|кефір[{WORD_CHARS}]*|кефер[{WORD_CHARS}]*|kefir|ряженк[{WORD_CHARS}]*|ражанк[{WORD_CHARS}]*|бифитат[{WORD_CHARS}]*|біфітат[{WORD_CHARS}]*|bifitat|кисломолоч[{WORD_CHARS}]*|кісламалоч[{WORD_CHARS}]*|пробиотик[{WORD_CHARS}]*|开菲尔|发酵乳)", re.I), {"ru": "Кисломолочное", "be": "Кісламалочнае", "en": "Fermented Dairy", "zh": "发酵乳"}),
    ("yogurt", re.compile(rf"(?:^|\s)(йогурт[{WORD_CHARS}]*|ёгурт[{WORD_CHARS}]*|егурт[{WORD_CHARS}]*|yog[hu]?urt[{WORD_CHARS}]*|греческ[{WORD_CHARS}]*|грэчаск[{WORD_CHARS}]*|greek|酸奶)", re.I), {"ru": "Йогурты", "be": "Ёгурты", "en": "Yogurts", "zh": "酸奶"}),
    ("sour-cream", re.compile(rf"(?:^|\s)(сметан[{WORD_CHARS}]*|смятан[{WORD_CHARS}]*|sour\s*cream|酸奶油)", re.I), {"ru": "Сметана", "be": "Смятана", "en": "Sour Cream", "zh": "酸奶油"}),
    ("tvorog", re.compile(rf"(?:^|\s)(творог[{WORD_CHARS}]*|тварог[{WORD_CHARS}]*|творож[{WORD_CHARS}]*|твараж[{WORD_CHARS}]*|tvorog|cottage|зерн[её]н[{WORD_CHARS}]*|рассыпчат[{WORD_CHARS}]*|凝乳)", re.I), {"ru": "Творог", "be": "Тварог", "en": "Tvorog", "zh": "凝乳干酪"}),
    ("butter", re.compile(rf"(?:^|\s)(масл[{WORD_CHARS}]*|butter|сладкосливоч[{WORD_CHARS}]*|монолит|黄油)", re.I), {"ru": "Масло", "be": "Масла", "en": "Butter", "zh": "黄油"}),
    ("ice-cream", re.compile(rf"(?:^|\s)(морожен+[{WORD_CHARS}]*|марозі[{WORD_CHARS}]*|пломбир[{WORD_CHARS}]*|пламбір[{WORD_CHARS}]*|ice\s*cream|plombir|эскимо|вафельн[{WORD_CHARS}]*|стаканчик|冰淇淋|雪糕)", re.I), {"ru": "Мороженое", "be": "Марозіва", "en": "Ice Cream", "zh": "冰淇淋"}),
    ("cream", re.compile(rf"(?:^|\s)(сливк[{WORD_CHARS}]*|сливок|вяршк[{WORD_CHARS}]*|cream|whipping|взбиван[{WORD_CHARS}]*|ўзбіван[{WORD_CHARS}]*|33%|稀奶油|淡奶油)", re.I), {"ru": "Сливки", "be": "Вяршкі", "en": "Cream", "zh": "稀奶油"}),
    ("desserts", re.compile(rf"(?:^|\s)(сырок|сырки|сырк[{WORD_CHARS}]*|глазир[{WORD_CHARS}]*|глазур[{WORD_CHARS}]*|curd\s*bar|десерт[{WORD_CHARS}]*|дэсерт[{WORD_CHARS}]*|мусс[{WORD_CHARS}]*|mousse|甜品|凝乳棒|慕斯)", re.I), {"ru": "Десерты", "be": "Дэсерты", "en": "Desserts", "zh": "乳制甜品"}),
    ("dry-dairy", re.compile(rf"(?:^|\s)(сом|сам|сцм|smp|wmp|сух[{WORD_CHARS}]*\s+молок[{WORD_CHARS}]*|сухое|milk\s*powder|powder|мешок|мешк[{WORD_CHARS}]*|крафт|25\s*кг|奶粉)", re.I), {"ru": "Сухие молочные продукты", "be": "Сухія прадукты", "en": "Dry Dairy (SMP/WMP)", "zh": "干乳制品"}),
    ("other", re.compile(rf"(?:^|\s)(сыворот[{WORD_CHARS}]*|сыроват[{WORD_CHARS}]*|whey|манго|mango|сгущ[{WORD_CHARS}]*|згушч[{WORD_CHARS}]*|condensed|напиток|напой|乳清|炼乳)", re.I), {"ru": "Напитки и прочее", "be": "Напоі і іншае", "en": "Whey & Other", "zh": "乳清与炼乳"}),
]

STOPWORDS = {
    "мне", "нужен", "нужна", "нужно", "нужны", "хочу", "ищу", "посоветуй", "посоветуйте",
    "подбери", "подберите", "найти", "найди", "покажи", "для", "или", "без", "под", "про",
    "при", "над", "как", "что", "какой", "какая", "какое", "какие", "есть", "продукт",
    "продукты", "продукта", "продуктов", "продукция", "продукции", "товар", "товары",
    "содержанием", "уровнем", "высоким", "хороший", "лучший", "самый", "очень", "на", "со",
    "от", "до", "по", "из", "за", "патрэбен", "патрэбна", "трэба", "шукаю", "прадукт",
    "прадукты", "i", "need", "want", "looking", "for", "with", "and", "or", "the", "a", "an",
    "product", "products", "dairy", "best", "good", "some", "any", "find", "show", "me",
}

EN_TO_RU_MAP = {
    "q": "й", "w": "ц", "e": "у", "r": "к", "t": "е", "y": "н", "u": "г", "i": "ш", "o": "щ", "p": "з",
    "[": "х", "]": "ъ", "a": "ф", "s": "ы", "d": "в", "f": "а", "g": "п", "h": "р", "j": "о", "k": "л",
    "l": "д", ";": "ж", "'": "э", "z": "я", "x": "ч", "c": "с", "v": "м", "b": "и", "n": "т", "m": "ь",
    ",": "б", ".": "ю",
}

SYNONYM_GROUPS = [
    ["моцарелл", "моцарел", "мацарэл", "mozzarell", "mozarell"],
    ["городен", "горадзен", "goroden", "пармезан", "выдержан"],
    ["беллавист", "белавіст", "bellavist", "бри", "brie", "камамбер"],
    ["сулугун", "sulugun"],
    ["молок", "малак", "milk"],
    ["сом", "сам", "сцм", "smp", "wmp", "порошок", "powder", "сухое"],
    ["йогурт", "егурт", "yogurt", "yoghurt"],
    ["творог", "тварог", "творож", "твараж", "tvorog", "cottage"],
    ["сырок", "сырк", "глазир", "глазур", "curd"],
    ["масл", "butter"],
    ["сливк", "сливок", "вяршк", "cream"],
    ["сметан", "смятан", "sour"],
    ["кефир", "кефір", "кефер", "kefir"],
    ["ряженк", "ражанк", "ryazhenk"],
    ["бифитат", "біфітат", "bifitat"],
    ["морожен", "марозі", "пломбир", "пламбір", "plombir", "ice", "эскимо"],
    ["сыворот", "сыроват", "whey"],
    ["сгущ", "згушч", "condensed"],
    ["белок", "белк", "бялок", "бялк", "протеин", "protein"],
    ["лактоз", "lactose"],
    ["пицц", "піц", "pizza"],
    ["выпечк", "кандытар", "кондитер", "pastry", "baking"],
    ["экспорт", "экспарт", "export", "horeca", "опт", "b2b"],
]


def normalize_text(text: str) -> str:
    t = text.lower().replace("ё", "е")
    t = re.sub(r"(\d),(\d)", r"\1.\2", t)
    t = re.sub(r'[«»"\'`()\[\]]', " ", t)
    return re.sub(r"\s+", " ", t).strip()


def decode_keyboard_layout(raw: str) -> str | None:
    trimmed = raw.strip().lower()
    if not trimmed or not re.match(r"^[a-z\[\];',.\s]+$", trimmed):
        return None
    if re.search(r"(milk|cheese|pizza|yogurt|butter|cream|kefir|ice|wine|protein|lactose|export|powder|sugar|baking|coffee|brie|goroden|mozzarella|condensed|whey|tvorog|suluguni)", trimmed, re.I):
        return None
    converted = "".join(EN_TO_RU_MAP.get(ch, ch) for ch in trimmed)
    if not re.search(r"[аеиоуыэюя]", converted):
        return None
    return converted


def stem_token(token: str) -> str:
    if len(token) <= 3:
        return token
    t = token.replace("ё", "е")
    if re.match(r"^бело?к", t):
        return "белк"
    if re.match(r"^сливо?к", t):
        return "сливк"
    if re.match(r"^сыро?к", t):
        return "сырк"
    if re.search(r"[а-яіў]", t) and len(t) >= 5:
        stripped = re.sub(
            r"(ами|ями|ого|его|ому|ему|ыми|ими|ах|ях|ов|ев|ей|ом|ем|ую|юю|ое|ее|ые|ие|ой|ий|ый|ая|яя|ы|и|а|я|у|ю|о|е|ь)$",
            "",
            t,
        )
        if len(stripped) >= 3:
            t = stripped
    elif re.match(r"^[a-z]+$", t) and len(t) >= 5:
        stripped = re.sub(r"(ies|es|s|ing|ed)$", "", t)
        if len(stripped) >= 4:
            t = stripped
    return t


def levenshtein_bounded(a: str, b: str, max_dist: int) -> int:
    if abs(len(a) - len(b)) > max_dist:
        return max_dist + 1
    if a == b:
        return 0
    prev = list(range(len(b) + 1))
    for i, ch_a in enumerate(a, start=1):
        curr = [i]
        row_min = i
        for j, ch_b in enumerate(b, start=1):
            cost = 0 if ch_a == ch_b else 1
            val = min(prev[j] + 1, curr[j - 1] + 1, prev[j - 1] + cost)
            curr.append(val)
            if val < row_min:
                row_min = val
        if row_min > max_dist:
            return max_dist + 1
        prev = curr
    return prev[-1]


def expand_synonyms(stem: str) -> list[str]:
    expanded = {stem}
    for group in SYNONYM_GROUPS:
        if any(stem.startswith(alias) or alias.startswith(stem) for alias in group):
            expanded.update(group)
    return list(expanded)


def extract_tokens(norm_query: str) -> list[str]:
    tokens: list[str] = []
    seen: set[str] = set()
    for raw in re.findall(r"[a-zа-яіў0-9%.-]+", norm_query, re.I):
        w = raw.strip(".-")
        if not w or len(w) < 2 or w in STOPWORDS:
            continue
        if w not in seen:
            seen.add(w)
            tokens.append(w)
    for run in re.findall(r"[\u4e00-\u9fff]+", norm_query):
        if len(run) <= 2:
            if run not in seen:
                seen.add(run)
                tokens.append(run)
        else:
            if run not in seen:
                seen.add(run)
                tokens.append(run)
            for i in range(len(run) - 1):
                bi = run[i : i + 2]
                if bi not in seen:
                    seen.add(bi)
                    tokens.append(bi)
    return tokens


def parse_shelf_life_days(text: str) -> int:
    nums = re.findall(r"\d+", text or "")
    if not nums:
        return 0
    val = int(nums[0])
    if re.search(r"месяц|month|月", text or "", re.I):
        return val * 30
    return val


@dataclass
class ParsedQuery:
    norm_query: str
    tokens: list[str]
    intents: set[str]
    category_boosts: dict[str, str]
    fat_max: float | None = None
    fat_min: float | None = None
    fat_exact: float | None = None
    protein_min: float | None = None
    target_weight_grams: int | None = None
    prefer_bulk: bool = False


def parse_user_query(raw_query: str, language: Language) -> ParsedQuery:
    norm_query = normalize_text(raw_query)
    intents: set[str] = set()
    category_boosts: dict[str, str] = {}

    if re.search(r"(пицц|pizza|піц|披萨|плав|запек|растяг|тягуч|пиццери)", norm_query, re.I):
        intents.add("pizza")
    if re.search(r"(без\s*лактоз|безлактоз|lactose|непереносим|零乳糖|无乳糖|нет\s*лактоз)", norm_query, re.I):
        intents.add("lactoseFree")
    if re.search(r"(белок|белк|бялок|бялк|протеин|protein|спорт|фитнес|мышц|高蛋白|蛋白)", norm_query, re.I):
        intents.add("highProtein")
    if re.search(r"(без\s*сахар|без\s*цукр|no\s*sugar|sugar\s*free|zero\s*sugar|无糖|零蔗糖)", norm_query, re.I):
        intents.add("noSugar")
    if re.search(rf"(вин[{WORD_CHARS}]*|він[{WORD_CHARS}]*|wine|дегустац|сырн[{WORD_CHARS}]*\s+тарел|葡萄酒|红酒|品鉴)", norm_query, re.I):
        intents.add("wine")
    if re.search(r"(выпеч|кондитер|кандытар|торт|чизкейк|тирамису|взбиван|ўзбіван|крем|ганаш|pastry|bak|whipping|круассан|烘焙|甜点)", norm_query, re.I):
        intents.add("baking")
    if re.search(r"(кофе|капучино|латте|бариста|coffee|latte|barista|咖啡)", norm_query, re.I):
        intents.add("coffee")
    if re.search(r"(экспорт|экспарт|опт|аптов|horeca|export|b2b|мешк|мяшк|монолит|gacc|китай|ази|контейнер|出口|大宗)", norm_query, re.I):
        intents.add("export")
    if re.search(r"(длительн|долго|без\s*холодильник|uht|ультрапастериз|180\s*сут|24\s*мес|long\s*shelf|ambient|常温|长保)", norm_query, re.I):
        intents.add("longShelf")
    if re.search(r"(десерт|сладк|перекус|ребен|детям|dessert|sweet|snack|甜品)", norm_query, re.I):
        intents.add("dessert")
    if re.search(rf"(низк[{WORD_CHARS}]*\s+жир|маложир|обезжир|легк|лёгк|диет|похуд|low\s*fat|skim|低脂)", norm_query, re.I):
        intents.add("lowFat")

    for cat_id, pat, labels in CATEGORY_KEYWORDS:
        if pat.search(norm_query):
            category_boosts[cat_id] = labels[language]

    fat_max: float | None = None
    fat_min: float | None = None
    fat_exact: float | None = None

    m_max = re.search(r"(?:до|меньше|ниже|max|under|below|<=?)\s*(\d+(?:\.\d+)?)\s*%", norm_query, re.I)
    if m_max:
        fat_max = float(m_max.group(1))
    elif "lowFat" in intents:
        fat_max = 5.0

    m_min = re.search(r"(?:от|более|выше|min|over|above|>=?)\s*(\d+(?:\.\d+)?)\s*%", norm_query, re.I)
    if m_min:
        fat_min = float(m_min.group(1))

    if fat_max is None and fat_min is None:
        m_exact = re.search(r"(\d+(?:\.\d+)?)\s*%|\b(82\.5|72\.5|3\.2|2\.5|1\.5|0\.1)\b", norm_query)
        if m_exact:
            fat_exact = float(m_exact.group(1) or m_exact.group(2))

    protein_min: float | None = None
    m_prot = re.search(
        rf"(?:бел[{WORD_CHARS}]*|protein)\s*(?:от|более|>=?|min)?\s*(\d+(?:\.\d+)?)|(?:от|>=?)\s*(\d+(?:\.\d+)?)\s*(?:г|g)?\s*(?:бел[{WORD_CHARS}]*|protein)",
        norm_query,
        re.I,
    )
    if m_prot:
        val = float(m_prot.group(1) or m_prot.group(2))
        if val > 0:
            protein_min = val

    target_weight_grams: int | None = None
    m_weight = re.search(r"(\d+(?:\.\d+)?)\s*(кг|kg|г|g|мл|ml|л|l)(?:\b|$)", norm_query, re.I)
    if m_weight:
        num = float(m_weight.group(1))
        unit = m_weight.group(2).lower()
        if num > 0:
            target_weight_grams = int(round(num * 1000)) if unit in {"кг", "kg", "л", "l"} else int(round(num))

    prefer_bulk = bool(
        re.search(rf"(horeca|опт|мешк|монолит|больш[{WORD_CHARS}]*\s+упаков|2\.5\s*кг|20\s*кг|25\s*кг|1\s*кг|bulk)", norm_query, re.I)
    )

    return ParsedQuery(
        norm_query=norm_query,
        tokens=extract_tokens(norm_query),
        intents=intents,
        category_boosts=category_boosts,
        fat_max=fat_max,
        fat_min=fat_min,
        fat_exact=fat_exact,
        protein_min=protein_min,
        target_weight_grams=target_weight_grams,
        prefer_bulk=prefer_bulk,
    )


def pick_recommended_package(product: ProductSchema, parsed: ParsedQuery) -> PackageVariantSchema | None:
    if not product.packages:
        return None
    if parsed.target_weight_grams is not None:
        return min(product.packages, key=lambda p: abs(p.weight_grams - parsed.target_weight_grams))
    if "pizza" in parsed.intents or "export" in parsed.intents or parsed.prefer_bulk:
        return max(product.packages, key=lambda p: p.weight_grams)
    if "longShelf" in parsed.intents:
        return max(product.packages, key=lambda p: parse_shelf_life_days(p.shelf_life.ru or p.shelf_life.en))
    return product.packages[0]


async def extract_llm_intents(query: str, language: Language) -> dict | None:
    """Optional Gemini structured intent extraction (never invents products; enriches DB search signals)."""
    if not settings.gemini_api_key:
        return None
    prompt = (
        "You are a dairy catalog query parser for OJSC Molochny Mir. "
        "Extract structured search filters from the user query as strict JSON ONLY with keys: "
        'category_ids (array from ["cheese","milk","fermented","yogurt","sour-cream","tvorog","butter","ice-cream","cream","desserts","dry-dairy","other"]), '
        'intents (array from ["pizza","lactoseFree","highProtein","noSugar","wine","baking","coffee","export","longShelf","dessert","lowFat"]), '
        "fat_max (number or null), protein_min (number or null), target_weight_grams (integer or null). "
        f"Language={language}. User query: {query}"
    )
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={settings.gemini_api_key}"
    payload = {
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {"temperature": 0.0, "responseMimeType": "application/json"},
    }
    try:
        async with httpx.AsyncClient(timeout=3.5) as client:
            resp = await client.post(url, json=payload)
            if resp.status_code != 200:
                return None
            data = resp.json()
            text = data["candidates"][0]["content"]["parts"][0]["text"]
            parsed = json.loads(text)
            if isinstance(parsed, dict):
                return parsed
    except Exception:
        return None
    return None


def evaluate_products(
    raw_query: str,
    products: Iterable[ProductSchema],
    categories: Iterable[CategorySchema],
    language: Language,
    llm_hints: dict | None = None,
) -> tuple[list[SmartMatchResultSchema], list[SmartCriterionSchema]]:
    parsed = parse_user_query(raw_query, language)

    # Merge optional LLM hints cleanly
    if llm_hints:
        cat_label_map = {c.id: getattr(c.name, language) or c.name.ru for c in categories}
        for cid in llm_hints.get("category_ids") or []:
            if cid in cat_label_map and cid not in parsed.category_boosts:
                parsed.category_boosts[cid] = cat_label_map[cid]
        for intent in llm_hints.get("intents") or []:
            if intent in INTENT_REASONS:
                parsed.intents.add(intent)
        if parsed.fat_max is None and isinstance(llm_hints.get("fat_max"), (int, float)):
            parsed.fat_max = float(llm_hints["fat_max"])
        if parsed.protein_min is None and isinstance(llm_hints.get("protein_min"), (int, float)):
            parsed.protein_min = float(llm_hints["protein_min"])
        if parsed.target_weight_grams is None and isinstance(llm_hints.get("target_weight_grams"), int):
            parsed.target_weight_grams = int(llm_hints["target_weight_grams"])

    cat_map = {c.id: c for c in categories}
    g_unit = "г" if language in ("ru", "be") else ("克" if language == "zh" else "g")

    criteria: list[SmartCriterionSchema] = []
    for cid, label in parsed.category_boosts.items():
        criteria.append(SmartCriterionSchema(id=f"cat-{cid}", label=label))
    for intent in parsed.intents:
        criteria.append(SmartCriterionSchema(id=f"intent-{intent}", label=INTENT_CRITERIA_LABELS[intent][language]))
    if parsed.fat_max is not None:
        lbl = f"Жирность ≤ {parsed.fat_max}%" if language == "ru" else (f"Тлустасць ≤ {parsed.fat_max}%" if language == "be" else (f"脂肪 ≤ {parsed.fat_max}%" if language == "zh" else f"Fat ≤ {parsed.fat_max}%"))
        criteria.append(SmartCriterionSchema(id="fat-max", label=lbl))
    if parsed.protein_min is not None:
        lbl = f"Белок ≥ {parsed.protein_min} {g_unit}" if language in ("ru", "zh") else (f"Бялок ≥ {parsed.protein_min} г" if language == "be" else f"Protein ≥ {parsed.protein_min}g")
        criteria.append(SmartCriterionSchema(id="prot-min", label=lbl))
    if parsed.target_weight_grams is not None:
        w_lbl = f"{parsed.target_weight_grams / 1000:g} {'кг' if language in ('ru','be') else 'kg'}" if parsed.target_weight_grams >= 1000 else f"{parsed.target_weight_grams} {g_unit}"
        criteria.append(SmartCriterionSchema(id="weight", label=w_lbl))

    scored: list[SmartMatchResultSchema] = []
    for product in products:
        if not product.visible:
            continue
        score = 0.0
        reasons: list[str] = []

        name_all = normalize_text(" ".join([product.name.ru, product.name.be, product.name.en, product.name.zh]))
        current_name = normalize_text(getattr(product.name, language) or product.name.ru)
        cat = cat_map.get(product.category)
        cat_name_all = normalize_text(
            " ".join([cat.name.ru, cat.name.be, cat.name.en, cat.name.zh]) if cat else product.category
        )
        desc_all = normalize_text(" ".join([product.description.ru, product.description.be, product.description.en, product.description.zh]))
        char_all = normalize_text(
            " ".join(v for cval in product.characteristics.values() for v in (cval.ru, cval.be, cval.en, cval.zh) if v)
        )
        pack_all = normalize_text(
            " ".join(f"{p.weight} {p.packaging_type.ru} {p.packaging_type.en} {p.shelf_life.ru}" for p in product.packages)
        )

        name_words = extract_tokens(name_all)
        cat_words = extract_tokens(cat_name_all)

        if current_name == parsed.norm_query or name_all == parsed.norm_query:
            score += 160
        elif current_name.startswith(parsed.norm_query):
            score += 130
        elif len(parsed.norm_query) >= 2 and parsed.norm_query in name_all:
            score += 95

        if product.category in parsed.category_boosts:
            score += 80

        if "pizza" in parsed.intents and "pizza" in product.use_cases:
            score += 85 if product.id == "mozzarella-pizza" else 50
            reasons.append(INTENT_REASONS["pizza"][language])
        if "lactoseFree" in parsed.intents and (product.lactose_free or "lactose-free" in product.use_cases):
            score += 90 if product.id == "milk-lactose-free" else 70
            reasons.append(INTENT_REASONS["lactoseFree"][language])
        if "highProtein" in parsed.intents and ((product.protein_content or 0) >= 8 or "high-protein" in product.use_cases):
            score += 70 if (product.protein_content or 0) >= 15 else 55
            if product.id in ("greek-yogurt-protein", "tvorog-grain", "greek-yogurt-lactose-free"):
                score += 15
            reasons.append(f"{INTENT_REASONS['highProtein'][language]} ({product.protein_content or 0} {g_unit} / 100{g_unit})")
        if "noSugar" in parsed.intents and product.id in ("greek-yogurt-protein", "greek-yogurt-lactose-free", "milk-lactose-free", "goroden-aged", "tvorog-grain"):
            score += 60 if "greek-yogurt" in product.id else 25
            if "greek-yogurt" in product.id:
                reasons.append(INTENT_REASONS["noSugar"][language])
        if "wine" in parsed.intents and "wine" in product.use_cases:
            score += 80
            reasons.append(INTENT_REASONS["wine"][language])
        if "baking" in parsed.intents and "baking" in product.use_cases:
            score += 65
            reasons.append(INTENT_REASONS["baking"][language])
        if "coffee" in parsed.intents and ("coffee" in product.use_cases or product.id in ("cream-33", "cream-10-barista", "milk-classic")):
            score += 70 if ("coffee" in product.use_cases or product.category == "cream") else 45
            reasons.append(INTENT_REASONS["coffee"][language])
        if "export" in parsed.intents and product.export_ready:
            score += 60 if (product.category == "dry-dairy" or product.id == "butter-825") else 40
            reasons.append(INTENT_REASONS["export"][language])
        if "longShelf" in parsed.intents:
            max_days = max([0] + [parse_shelf_life_days(p.shelf_life.ru or p.shelf_life.en) for p in product.packages])
            if max_days >= 90:
                score += 65
                reasons.append(INTENT_REASONS["longShelf"][language])
        if "dessert" in parsed.intents and "dessert" in product.use_cases:
            score += 65
            reasons.append(INTENT_REASONS["dessert"][language])

        if parsed.fat_max is not None:
            if (product.fat_content if product.fat_content is not None else 99.0) <= parsed.fat_max:
                score += 55
                reasons.append(f"{INTENT_REASONS['lowFat'][language]} ({product.fat_content}%)")
            elif not parsed.intents and not parsed.category_boosts:
                score -= 40
        if parsed.fat_min is not None:
            if (product.fat_content or 0.0) >= parsed.fat_min:
                score += 55
            else:
                score -= 40
        if parsed.fat_exact is not None and product.fat_content is not None:
            if abs(product.fat_content - parsed.fat_exact) < 0.05:
                score += 85
        if parsed.protein_min is not None:
            if (product.protein_content or 0.0) >= parsed.protein_min:
                score += 60
                reasons.append(f"{INTENT_REASONS['highProtein'][language]} ({product.protein_content} {g_unit})")
            else:
                score -= 45
        if parsed.target_weight_grams is not None:
            if any(abs(pk.weight_grams - parsed.target_weight_grams) <= parsed.target_weight_grams * 0.15 for pk in product.packages):
                score += 50

        name_stem_hits = 0
        cat_stem_hits = 0
        pack_hits = 0
        char_hits = 0
        desc_hits = 0

        for raw_tok in parsed.tokens:
            stem = stem_token(raw_tok)
            aliases = expand_synonyms(stem)

            if any(a in name_all for a in aliases):
                name_stem_hits += 1
                if any(nw.startswith(stem) or nw.startswith(raw_tok) for nw in name_words):
                    score += 20
            elif len(raw_tok) >= 4:
                max_dist = 2 if len(raw_tok) >= 7 else 1
                if any(levenshtein_bounded(raw_tok, nw, max_dist) <= max_dist for nw in name_words):
                    score += 38

            if any(a in cat_name_all for a in aliases):
                cat_stem_hits += 1
            elif len(raw_tok) >= 4:
                max_dist = 2 if len(raw_tok) >= 7 else 1
                if any(levenshtein_bounded(raw_tok, cw, max_dist) <= max_dist for cw in cat_words):
                    score += 30

            if any(a in pack_all for a in aliases):
                pack_hits += 1
            if any(a in char_all for a in aliases):
                char_hits += 1
            if any(a in desc_all for a in aliases):
                desc_hits += 1

        score += name_stem_hits * 55 + cat_stem_hits * 45 + pack_hits * 25 + char_hits * 10 + desc_hits * 8
        if len(parsed.tokens) >= 2 and (name_stem_hits + cat_stem_hits) >= len(parsed.tokens):
            score += 35

        if score > 0:
            if not reasons:
                if name_stem_hits > 0 or cat_stem_hits > 0:
                    fallback_reason = {
                        "ru": "Точное совпадение по названию и категории",
                        "be": "Дакладнае супадзенне па назве і катэгорыі",
                        "en": "Matches product name and category",
                        "zh": "匹配产品名称与分类",
                    }[language]
                else:
                    fallback_reason = {
                        "ru": "Подходит по характеристикам и составу",
                        "be": "Падыходзіць па характарыстыках і складзе",
                        "en": "Matches specifications and packaging",
                        "zh": "符合产品特性与规格",
                    }[language]
                reasons.append(fallback_reason)

            scored.append(
                SmartMatchResultSchema(
                    product=product,
                    score=score,
                    reasons=reasons,
                    recommended_package=pick_recommended_package(product, parsed),
                )
            )

    scored.sort(key=lambda item: (-item.score, -int(bool(item.product.featured))))
    top_score = scored[0].score if scored else 0.0
    threshold = 30.0 if top_score >= 85.0 else 15.0
    filtered = [item for item in scored if item.score >= threshold]
    return filtered, criteria


async def run_smart_select(
    raw_query: str,
    products: list[ProductSchema],
    categories: list[CategorySchema],
    language: Language,
    allow_llm: bool = True,
) -> tuple[list[SmartMatchResultSchema], list[SmartCriterionSchema], str | None, str]:
    trimmed = raw_query.strip()
    if not trimmed:
        return [], [], None, "nlp+db"

    llm_hints = await extract_llm_intents(trimmed, language) if allow_llm else None
    mode = "llm+db" if llm_hints else "nlp+db"

    results, criteria = evaluate_products(trimmed, products, categories, language, llm_hints=llm_hints)
    if results:
        return results, criteria, None, mode

    layout_fixed = decode_keyboard_layout(trimmed)
    if layout_fixed:
        rec_results, rec_criteria = evaluate_products(layout_fixed, products, categories, language)
        if rec_results:
            fix_lbl = {
                "ru": f"Исправлена раскладка: «{layout_fixed}»",
                "be": f"Выпраўлена раскладка: «{layout_fixed}»",
                "en": f'Auto-corrected: "{layout_fixed}"',
                "zh": f'已自动纠正输入: "{layout_fixed}"',
            }[language]
            return (
                rec_results,
                [SmartCriterionSchema(id="layout-fix", label=fix_lbl)] + rec_criteria,
                layout_fixed,
                mode,
            )

    return [], criteria, None, mode
EOF

cat <<'EOF' > backend/app/services/pdf_generator.py
from datetime import datetime
from pathlib import Path
from fpdf import FPDF

from app.config import settings
from app.schemas import CategorySchema, Language, ProductSchema

DEJAVU_REGULAR = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
DEJAVU_BOLD = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
WQY_TTF = "/usr/share/fonts/truetype/wqy/wqy-zenhei.ttf"


def _loc(obj, lang: Language) -> str:
    return getattr(obj, lang, "") or obj.ru or obj.en or obj.be or obj.zh or ""


def _safe_ascii(text: str) -> str:
    return text.encode("latin-1", "replace").decode("latin-1")


def generate_product_spec_pdf(
    product: ProductSchema,
    category: CategorySchema | None,
    language: Language,
) -> bytes:
    pdf = FPDF(orientation="P", unit="mm", format="A4")
    pdf.set_auto_page_break(auto=True, margin=15)
    pdf.add_page()

    use_cjk = language == "zh" and Path(WQY_TTF).exists()
    use_dejavu = Path(DEJAVU_REGULAR).exists() and Path(DEJAVU_BOLD).exists()

    if use_cjk:
        pdf.add_font("AppFont", style="", fname=WQY_TTF)
        pdf.add_font("AppFont", style="B", fname=WQY_TTF)
        font_family = "AppFont"
        sanitize = lambda s: s
    elif use_dejavu:
        pdf.add_font("AppFont", style="", fname=DEJAVU_REGULAR)
        pdf.add_font("AppFont", style="B", fname=DEJAVU_BOLD)
        font_family = "AppFont"
        sanitize = lambda s: s
    else:
        font_family = "Helvetica"
        sanitize = _safe_ascii

    labels = {
        "ru": {
            "header": "ОАО «МОЛОЧНЫЙ МИР» (milk.by) — B2B / ЭКСПОРТНАЯ СПЕЦИФИКАЦИЯ",
            "sub": "230005, Республика Беларусь, г. Гродно, ул. Гаспадарчая, 28 | FSSC 22000 · ISO 9001 · HACCP",
            "cat": "Категория",
            "fat": "Массовая доля жира",
            "prot": "Белок на 100 г",
            "lactose": "Лактоза",
            "lactose_free": "Без лактозы (< 0,01%)",
            "lactose_nat": "Природная молочная",
            "export": "Экспортный статус",
            "export_yes": "Сертифицирован для экспорта (B2B)",
            "export_no": "Внутренний / региональный рынок",
            "desc": "Описание продукта",
            "specs": "Технические характеристики",
            "packs": "Матрица фасовок и логистики короба",
            "col_w": "Масса/объём",
            "col_pkg": "Упаковка",
            "col_shelf": "Срок годности",
            "col_stor": "Хранение",
            "col_box": "Шт/кор",
            "col_gtin": "GTIN",
            "contacts": "Отдел экспорта: export@milk.by · +375 (152) 44-55-12 | Оптовые продажи: sales@milk.by · +375 (152) 44-55-01",
        },
        "be": {
            "header": "ААТ «МАЛОЧНЫ МІР» (milk.by) — B2B / ЭКСПАРТНАЯ СПЕЦЫФІКАЦЫЯ",
            "sub": "230005, Рэспубліка Беларусь, г. Гродна, вул. Гаспадарчая, 28 | FSSC 22000 · ISO 9001 · HACCP",
            "cat": "Катэгорыя",
            "fat": "Масавая доля тлушчу",
            "prot": "Бялок на 100 г",
            "lactose": "Лактоза",
            "lactose_free": "Без лактозы (< 0,01%)",
            "lactose_nat": "Прыродная малочная",
            "export": "Экспартны статус",
            "export_yes": "Сертыфікаваны для экспарту (B2B)",
            "export_no": "Унутраны / рэгіянальны рынак",
            "desc": "Апісанне прадукту",
            "specs": "Тэхнічныя характарыстыкі",
            "packs": "Матрыца фасовак і лагістыкі каробкі",
            "col_w": "Маса/аб’ём",
            "col_pkg": "Упакоўка",
            "col_shelf": "Тэрмін",
            "col_stor": "Захоўванне",
            "col_box": "Шт/кар",
            "col_gtin": "GTIN",
            "contacts": "Аддзел экспарту: export@milk.by · +375 (152) 44-55-12 | Аптовыя продажы: sales@milk.by · +375 (152) 44-55-01",
        },
        "en": {
            "header": 'OJSC "MOLOCHNY MIR" (milk.by) — B2B / EXPORT PRODUCT SPECIFICATION',
            "sub": "28 Gaspadarchaya St, Grodno 230005, Republic of Belarus | FSSC 22000 · ISO 9001 · HACCP",
            "cat": "Category",
            "fat": "Fat Content",
            "prot": "Protein / 100g",
            "lactose": "Lactose",
            "lactose_free": "Lactose-Free (< 0.01%)",
            "lactose_nat": "Natural dairy lactose",
            "export": "Export Readiness",
            "export_yes": "Export Certified (B2B)",
            "export_no": "Domestic / Regional",
            "desc": "Product Overview",
            "specs": "Technical Specifications",
            "packs": "Packaging Variants & Box Logistics",
            "col_w": "Weight/Vol",
            "col_pkg": "Packaging Type",
            "col_shelf": "Shelf Life",
            "col_stor": "Storage",
            "col_box": "Pcs/Box",
            "col_gtin": "GTIN",
            "contacts": "Export Dept: export@milk.by · +375 (152) 44-55-12 | Wholesale Sales: sales@milk.by · +375 (152) 44-55-01",
        },
        "zh": {
            "header": "MOLOCHNY MIR 股份公司 (milk.by) — B2B / 国际出口产品技术规格书",
            "sub": "白俄罗斯格罗德诺市 Gaspadarchaya 街28号 (230005) | FSSC 22000 · ISO 9001 · HACCP",
            "cat": "产品分类",
            "fat": "乳脂含量",
            "prot": "蛋白质 / 100克",
            "lactose": "乳糖含量",
            "lactose_free": "无乳糖 (< 0.01%)",
            "lactose_nat": "含天然乳糖",
            "export": "出口资质",
            "export_yes": "具备国际出口认证 (B2B)",
            "export_no": "国内及区域供应",
            "desc": "产品概述",
            "specs": "产品技术参数",
            "packs": "包装规格与装箱物流矩阵",
            "col_w": "规格",
            "col_pkg": "包装形式",
            "col_shelf": "保质期",
            "col_stor": "储存温度",
            "col_box": "件/箱",
            "col_gtin": "GTIN 条码",
            "contacts": "出口部门: export@milk.by · +375 (152) 44-55-12 | 批发部: sales@milk.by · +375 (152) 44-55-01",
        },
    }[language]

    # Top brand banner
    pdf.set_fill_color(0, 87, 184)
    pdf.rect(0, 0, 210, 26, style="F")
    pdf.set_text_color(255, 255, 255)
    pdf.set_font(font_family, "B", 11)
    pdf.set_xy(14, 7)
    pdf.cell(182, 6, sanitize(labels["header"]), new_x="LMARGIN", new_y="NEXT")
    pdf.set_font(font_family, "", 8)
    pdf.set_x(14)
    pdf.cell(182, 5, sanitize(labels["sub"]), new_x="LMARGIN", new_y="NEXT")

    pdf.set_text_color(15, 23, 42)
    pdf.set_xy(14, 34)
    pdf.set_font(font_family, "B", 16)
    pdf.multi_cell(182, 8, sanitize(_loc(product.name, language)))

    cat_name = _loc(category.name, language) if category else product.category
    canonical_url = f"{settings.public_base_url.rstrip('/')}/{language}/product/{product.slug}"
    pdf.set_font(font_family, "", 9)
    pdf.set_text_color(71, 85, 105)
    pdf.set_x(14)
    pdf.cell(182, 5, sanitize(f"{labels['cat']}: {cat_name}  |  SKU: {product.id}  |  {canonical_url}"), new_x="LMARGIN", new_y="NEXT")
    pdf.ln(3)

    # Key summary grid
    pdf.set_fill_color(248, 250, 252)
    pdf.set_draw_color(226, 232, 240)
    summary_rows = [
        (labels["fat"], f"{product.fat_content}%" if product.fat_content is not None else "—"),
        (labels["prot"], f"{product.protein_content} g / 100g" if product.protein_content is not None else "—"),
        (labels["lactose"], labels["lactose_free"] if product.lactose_free else labels["lactose_nat"]),
        (labels["export"], labels["export_yes"] if product.export_ready else labels["export_no"]),
    ]
    for k, v in summary_rows:
        pdf.set_font(font_family, "B", 9)
        pdf.set_text_color(71, 85, 105)
        pdf.cell(58, 7, sanitize(k), border=1, fill=True)
        pdf.set_font(font_family, "", 9)
        pdf.set_text_color(15, 23, 42)
        pdf.cell(124, 7, sanitize(v), border=1, new_x="LMARGIN", new_y="NEXT")

    pdf.ln(4)

    # Description
    pdf.set_font(font_family, "B", 11)
    pdf.set_text_color(0, 87, 184)
    pdf.cell(182, 6, sanitize(labels["desc"]), new_x="LMARGIN", new_y="NEXT")
    pdf.set_font(font_family, "", 9.5)
    pdf.set_text_color(30, 41, 59)
    pdf.multi_cell(182, 5.2, sanitize(_loc(product.description, language)))
    pdf.ln(4)

    # Technical Characteristics
    if product.characteristics:
        pdf.set_font(font_family, "B", 11)
        pdf.set_text_color(0, 87, 184)
        pdf.cell(182, 6, sanitize(labels["specs"]), new_x="LMARGIN", new_y="NEXT")
        pdf.ln(1)

        schema_map = {f.key: _loc(f.label, language) for f in (category.characteristic_schema if category else [])}
        for key, val in product.characteristics.items():
            lbl = schema_map.get(key, key)
            pdf.set_font(font_family, "B", 9)
            pdf.set_text_color(71, 85, 105)
            pdf.cell(58, 6.5, sanitize(lbl), border=1, fill=True)
            pdf.set_font(font_family, "", 9)
            pdf.set_text_color(15, 23, 42)
            pdf.cell(124, 6.5, sanitize(_loc(val, language)), border=1, new_x="LMARGIN", new_y="NEXT")
        pdf.ln(4)

    # Packaging Variants & Box Logistics
    if product.packages:
        pdf.set_font(font_family, "B", 11)
        pdf.set_text_color(0, 87, 184)
        pdf.cell(182, 6, sanitize(labels["packs"]), new_x="LMARGIN", new_y="NEXT")
        pdf.ln(1)

        widths = [24, 56, 32, 26, 16, 28]
        headers = [labels["col_w"], labels["col_pkg"], labels["col_shelf"], labels["col_stor"], labels["col_box"], labels["col_gtin"]]
        pdf.set_fill_color(0, 87, 184)
        pdf.set_text_color(255, 255, 255)
        pdf.set_font(font_family, "B", 8)
        for w, h in zip(widths, headers):
            pdf.cell(w, 7, sanitize(h), border=1, fill=True)
        pdf.ln()

        pdf.set_text_color(15, 23, 42)
        pdf.set_font(font_family, "", 8)
        for idx, pkg in enumerate(product.packages):
            fill = idx % 2 == 1
            pdf.set_fill_color(248, 250, 252)
            row = [
                pkg.weight,
                _loc(pkg.packaging_type, language)[:32],
                _loc(pkg.shelf_life, language)[:22],
                _loc(pkg.storage, language)[:16],
                str(pkg.units_per_box),
                pkg.gtin or "—",
            ]
            for w, cell_val in zip(widths, row):
                pdf.cell(w, 6.5, sanitize(cell_val), border=1, fill=fill)
            pdf.ln()

    # Footer
    pdf.ln(8)
    pdf.set_draw_color(203, 213, 225)
    pdf.line(14, pdf.get_y(), 196, pdf.get_y())
    pdf.ln(3)
    pdf.set_font(font_family, "", 8)
    pdf.set_text_color(100, 116, 139)
    pdf.multi_cell(182, 4.5, sanitize(f"{labels['contacts']}\nGenerated: {datetime.utcnow().strftime('%Y-%m-%d %H:%M UTC')}"))

    return bytes(pdf.output())
EOF

cat <<'EOF' > backend/app/services/importer.py
import csv
import io
import json
import re
from datetime import date
from typing import Any
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models import Category, NewsArticle, Product, ProductVariant, Redirect301
from app.schemas import BulkImportResult
from app.seed import build_product_search_text


def _parse_weight_grams(label: str) -> int:
    m = re.search(r"(\d+(?:[.,]\d+)?)", label or "")
    if not m:
        return 250
    num = float(m.group(1).replace(",", "."))
    if re.search(r"(кг|kg|л|l)", label, re.I) and not re.search(r"(мг|мл|ml)", label, re.I):
        return int(round(num * 1000))
    return int(round(num))


def _slugify(value: str, prefix: str = "item") -> str:
    cleaned = re.sub(r"[^a-z0-9-]+", "-", value.lower()).strip("-")
    return cleaned or f"{prefix}-{abs(hash(value)) % 100000}"


async def bulk_import_products(
    session: AsyncSession,
    raw_bytes: bytes,
    filename: str,
) -> BulkImportResult:
    created = 0
    updated = 0
    skipped = 0
    errors: list[str] = []

    text = raw_bytes.decode("utf-8-sig", errors="replace").strip()
    cat_ids = {row[0] for row in (await session.execute(select(Category.id))).all()}

    items: list[dict[str, Any]] = []
    if filename.lower().endswith(".json") or text.startswith("[") or text.startswith("{"):
        parsed = json.loads(text)
        items = parsed if isinstance(parsed, list) else parsed.get("items", [])
    else:
        dialect = ";" if text.splitlines()[0].count(";") >= text.splitlines()[0].count(",") else ","
        reader = csv.DictReader(io.StringIO(text), delimiter=dialect)
        for idx, row in enumerate(reader, start=1):
            name_ru = (row.get("name_ru") or row.get("name") or "").strip()
            if not name_ru:
                skipped += 1
                continue
            pid = (row.get("id") or _slugify(name_ru, f"csv-{idx}")).strip()
            cat_id = (row.get("category") or "other").strip()
            if cat_id not in cat_ids:
                cat_id = "other"
            w_label = (row.get("weight") or "250 г").strip()
            shelf = (row.get("shelfLife") or row.get("shelf_life") or "30 суток").strip()
            items.append(
                {
                    "id": pid,
                    "slug": (row.get("slug") or pid).strip(),
                    "category": cat_id,
                    "subcategory": (row.get("subcategory") or "default").strip(),
                    "name": {
                        "ru": name_ru,
                        "be": (row.get("name_be") or "").strip(),
                        "en": (row.get("name_en") or "").strip(),
                        "zh": (row.get("name_zh") or "").strip(),
                    },
                    "description": {
                        "ru": (row.get("description_ru") or name_ru).strip(),
                        "be": (row.get("description_be") or "").strip(),
                        "en": (row.get("description_en") or "").strip(),
                        "zh": (row.get("description_zh") or "").strip(),
                    },
                    "image": (row.get("image") or "asset:productAgedCheese").strip(),
                    "fatContent": float(row["fat"]) if row.get("fat") else None,
                    "proteinContent": float(row["protein"]) if row.get("protein") else None,
                    "lactoseFree": str(row.get("lactoseFree", "")).lower() in {"1", "true", "yes"},
                    "exportReady": str(row.get("exportReady", "true")).lower() not in {"0", "false", "no"},
                    "featured": False,
                    "visible": True,
                    "packages": [
                        {
                            "id": f"{pid}-pkg-1",
                            "weight": w_label,
                            "weightGrams": _parse_weight_grams(w_label),
                            "shelfLife": {"ru": shelf, "be": shelf, "en": shelf, "zh": shelf},
                            "storage": {"ru": "+2…+6 °C", "be": "+2…+6 °C", "en": "+2…+6 °C", "zh": "+2…+6 °C"},
                            "packagingType": {"ru": "Стандартная упаковка", "be": "", "en": "Standard pack", "zh": ""},
                            "unitsPerBox": int(row["unitsPerBox"]) if row.get("unitsPerBox") else 12,
                            "gtin": (row.get("gtin") or "4810268000001").strip(),
                        }
                    ],
                    "characteristics": {},
                    "useCases": ["daily"],
                    "relatedIds": [],
                    "seo": {
                        "title": {
                            "ru": (row.get("seo_title_ru") or f"{name_ru} — Молочный Мир").strip(),
                            "be": "",
                            "en": (row.get("seo_title_en") or "").strip(),
                            "zh": "",
                        },
                        "description": {"ru": (row.get("seo_desc_ru") or name_ru).strip(), "be": "", "en": "", "zh": ""},
                        "h1": {"ru": name_ru, "be": "", "en": (row.get("name_en") or "").strip(), "zh": ""},
                    },
                }
            )

    for idx, item in enumerate(items, start=1):
        try:
            pid = str(item.get("id") or _slugify(str(item.get("name", {}).get("ru", "")), f"imp-{idx}"))
            cat_id = str(item.get("category") or "other")
            if cat_id not in cat_ids:
                cat_id = "other"

            existing = await session.get(Product, pid)
            search_text = build_product_search_text(item)
            if existing is None:
                prod = Product(
                    id=pid,
                    slug=str(item.get("slug") or pid),
                    category_id=cat_id,
                    subcategory_id=str(item.get("subcategory") or "default"),
                    name=item.get("name") or {"ru": pid, "be": "", "en": "", "zh": ""},
                    description=item.get("description") or {"ru": "", "be": "", "en": "", "zh": ""},
                    image=str(item.get("image") or "asset:productAgedCheese"),
                    fat_content=item.get("fatContent"),
                    protein_content=item.get("proteinContent"),
                    lactose_free=bool(item.get("lactoseFree", False)),
                    export_ready=bool(item.get("exportReady", True)),
                    featured=bool(item.get("featured", False)),
                    visible=bool(item.get("visible", True)),
                    characteristics=item.get("characteristics") or {},
                    use_cases=item.get("useCases") or [],
                    related_ids=item.get("relatedIds") or [],
                    seo=item.get("seo") or {"title": item.get("name"), "description": item.get("description"), "h1": item.get("name")},
                    search_text=search_text,
                )
                for p_idx, pkg in enumerate(item.get("packages") or []):
                    prod.variants.append(
                        ProductVariant(
                            id=str(pkg.get("id") or f"{pid}-v{p_idx}"),
                            weight=str(pkg.get("weight") or "250 г"),
                            weight_grams=int(pkg.get("weightGrams") or _parse_weight_grams(str(pkg.get("weight") or "250 г"))),
                            shelf_life=pkg.get("shelfLife") or {"ru": "30 суток", "be": "", "en": "", "zh": ""},
                            storage=pkg.get("storage") or {"ru": "+2…+6 °C", "be": "+2…+6 °C", "en": "+2…+6 °C", "zh": "+2…+6 °C"},
                            packaging_type=pkg.get("packagingType") or {"ru": "", "be": "", "en": "", "zh": ""},
                            units_per_box=int(pkg.get("unitsPerBox") or 12),
                            gtin=str(pkg.get("gtin") or ""),
                            sort_order=p_idx,
                        )
                    )
                session.add(prod)
                created += 1
            else:
                existing.slug = str(item.get("slug") or existing.slug)
                existing.category_id = cat_id
                existing.name = item.get("name") or existing.name
                existing.description = item.get("description") or existing.description
                existing.fat_content = item.get("fatContent", existing.fat_content)
                existing.protein_content = item.get("proteinContent", existing.protein_content)
                existing.seo = item.get("seo") or existing.seo
                existing.search_text = search_text
                updated += 1
        except Exception as exc:
            errors.append(f"Row {idx}: {exc}")
            skipped += 1

    await session.commit()
    return BulkImportResult(created=created, updated=updated, skipped=skipped, errors=errors)


async def bulk_import_redirects(
    session: AsyncSession,
    raw_bytes: bytes,
    filename: str,
) -> BulkImportResult:
    created = 0
    updated = 0
    skipped = 0
    errors: list[str] = []

    text = raw_bytes.decode("utf-8-sig", errors="replace").strip()
    rows: list[dict[str, str]] = []
    if filename.lower().endswith(".json") or text.startswith("["):
        parsed = json.loads(text)
        rows = parsed if isinstance(parsed, list) else []
    else:
        lines = [ln.strip() for ln in text.splitlines() if ln.strip()]
        if lines and any(h in lines[0].lower() for h in ("from", "source")):
            dialect = ";" if lines[0].count(";") >= lines[0].count(",") else ","
            for r in csv.DictReader(io.StringIO(text), delimiter=dialect):
                rows.append(
                    {
                        "from": (r.get("from") or r.get("source") or "").strip(),
                        "to": (r.get("to") or r.get("target") or "").strip(),
                        "note": (r.get("note") or "").strip(),
                    }
                )
        else:
            for ln in lines:
                cols = [c.strip() for c in re.split(r"[;,]", ln)]
                if len(cols) >= 2:
                    rows.append({"from": cols[0], "to": cols[1], "note": cols[2] if len(cols) > 2 else ""})

    for idx, r in enumerate(rows, start=1):
        src = (r.get("from") or "").strip()
        dst = (r.get("to") or "").strip()
        if not src or not dst:
            skipped += 1
            continue
        if not src.startswith("/"):
            src = f"/{src}"
        try:
            res = await session.execute(select(Redirect301).where(Redirect301.source_path == src))
            existing = res.scalar_one_or_none()
            if existing is None:
                session.add(
                    Redirect301(
                        source_path=src,
                        target_path=dst,
                        status_code=301,
                        note=r.get("note", "Bulk import"),
                        is_active=True,
                    )
                )
                created += 1
            else:
                existing.target_path = dst
                existing.note = r.get("note") or existing.note
                updated += 1
        except Exception as exc:
            errors.append(f"Row {idx}: {exc}")
            skipped += 1

    await session.commit()
    return BulkImportResult(created=created, updated=updated, skipped=skipped, errors=errors)


async def bulk_import_news(
    session: AsyncSession,
    raw_bytes: bytes,
) -> BulkImportResult:
    created = 0
    updated = 0
    skipped = 0
    errors: list[str] = []

    parsed = json.loads(raw_bytes.decode("utf-8-sig", errors="replace").strip())
    items = parsed if isinstance(parsed, list) else parsed.get("items", [])

    for idx, item in enumerate(items, start=1):
        try:
            nid = str(item.get("id") or f"news-imp-{idx}")
            pub_date = date.fromisoformat(str(item.get("date") or date.today().isoformat()))
            existing = await session.get(NewsArticle, nid)
            if existing is None:
                session.add(
                    NewsArticle(
                        id=nid,
                        slug=str(item.get("slug") or nid),
                        published_date=pub_date,
                        year=int(item.get("year") or pub_date.year),
                        category_id=str(item.get("categoryId") or "company"),
                        title=item.get("title") or {"ru": nid, "be": "", "en": "", "zh": ""},
                        excerpt=item.get("excerpt") or {"ru": "", "be": "", "en": "", "zh": ""},
                        content=item.get("content") or {"ru": "", "be": "", "en": "", "zh": ""},
                        image=str(item.get("image") or "asset:newsDairyFacility"),
                        published=bool(item.get("published", True)),
                        related_ids=item.get("relatedIds") or [],
                        seo=item.get("seo") or {"title": item.get("title"), "description": item.get("excerpt")},
                    )
                )
                created += 1
            else:
                existing.title = item.get("title") or existing.title
                existing.excerpt = item.get("excerpt") or existing.excerpt
                existing.content = item.get("content") or existing.content
                updated += 1
        except Exception as exc:
            errors.append(f"Row {idx}: {exc}")
            skipped += 1

    await session.commit()
    return BulkImportResult(created=created, updated=updated, skipped=skipped, errors=errors)
EOF

cat <<'EOF' > backend/app/routers/catalog.py
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
EOF

cat <<'EOF' > backend/app/routers/news.py
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
EOF

cat <<'EOF' > backend/app/routers/ai.py
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
EOF

cat <<'EOF' > backend/app/routers/b2b.py
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
EOF

cat <<'EOF' > backend/app/routers/admin.py
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
EOF

cat <<'EOF' > backend/app/routers/seo.py
import html as html_lib
import re
from pathlib import Path
from xml.sax.saxutils import escape as xml_escape

import httpx
from fastapi import APIRouter, Depends, HTTPException, Request, Response
from fastapi.responses import HTMLResponse, PlainTextResponse, RedirectResponse
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import settings
from app.database import get_db
from app.models import Category, NewsArticle, Product, Redirect301

router = APIRouter(tags=["SEO, Sitemap, 301 Redirects & SSR Meta"])

SUPPORTED_LANGS = ("ru", "be", "en", "zh")
UNPREFIXED_STATIC = ("catalog", "export", "partners", "news", "about", "contacts", "admin", "sitemap", "product")

_cached_spa_template: str | None = None

DEFAULT_FALLBACK_HTML = """<!doctype html>
<html lang="ru">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>ОАО «Молочный Мир» (milk.by)</title>
    <meta name="description" content="Цифровая витрина ОАО «Молочный Мир»" />
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>"""


async def get_spa_template() -> str:
    global _cached_spa_template
    if _cached_spa_template:
        return _cached_spa_template

    if settings.frontend_index_url:
        try:
            async with httpx.AsyncClient(timeout=2.0) as client:
                resp = await client.get(settings.frontend_index_url)
                if resp.status_code == 200 and "<div id=\"root\"" in resp.text:
                    _cached_spa_template = resp.text
                    return _cached_spa_template
        except Exception:
            pass

    local_dist = Path(__file__).resolve().parent.parent.parent.parent / "dist" / "index.html"
    if local_dist.exists():
        _cached_spa_template = local_dist.read_text(encoding="utf-8")
        return _cached_spa_template

    return DEFAULT_FALLBACK_HTML


def _public_url(request: Request) -> str:
    if settings.public_base_url:
        return settings.public_base_url.rstrip("/")
    proto = request.headers.get("x-forwarded-proto", request.url.scheme)
    host = request.headers.get("host", request.url.netloc)
    return f"{proto}://{host}"


def _inject_head_meta(
    template: str,
    lang: str,
    title: str,
    description: str,
    canonical_url: str,
    alternates: list[tuple[str, str]],
    noindex: bool = False,
) -> str:
    safe_title = html_lib.escape(title)
    safe_desc = html_lib.escape(description, quote=True)
    safe_canon = html_lib.escape(canonical_url, quote=True)

    html = re.sub(r"<html\b[^>]*>", f'<html lang="{lang}">', template, count=1, flags=re.I)
    if re.search(r"<title>.*?</title>", html, flags=re.I | re.S):
        html = re.sub(r"<title>.*?</title>", f"<title>{safe_title}</title>", html, count=1, flags=re.I | re.S)
    else:
        html = html.replace("</head>", f"  <title>{safe_title}</title>\n  </head>")

    html = re.sub(r'<meta\s+name=["\']description["\'][^>]*>\s*', "", html, flags=re.I)
    html = re.sub(r'<link\s+rel=["\']canonical["\'][^>]*>\s*', "", html, flags=re.I)
    html = re.sub(r'<link\s+rel=["\']alternate["\'][^>]*>\s*', "", html, flags=re.I)
    html = re.sub(r'<meta\s+property=["\']og:(?:title|description|url)["\'][^>]*>\s*', "", html, flags=re.I)
    html = re.sub(r'<meta\s+name=["\']robots["\'][^>]*>\s*', "", html, flags=re.I)

    alt_tags = "\n    ".join(
        f'<link rel="alternate" hreflang="{hl}" href="{html_lib.escape(href, quote=True)}" />'
        for hl, href in alternates
    )
    robots_tag = '<meta name="robots" content="noindex, nofollow" />\n    ' if noindex else ""
    injected = (
        f'    <meta name="description" content="{safe_desc}" />\n'
        f'    {robots_tag}<link rel="canonical" href="{safe_canon}" />\n'
        f"    {alt_tags}\n"
        f'    <meta property="og:title" content="{safe_title}" />\n'
        f'    <meta property="og:description" content="{safe_desc}" />\n'
        f'    <meta property="og:url" content="{safe_canon}" />\n'
    )
    return html.replace("</head>", f"{injected}  </head>", 1)


@router.get("/robots.txt", response_class=PlainTextResponse)
async def robots_txt(request: Request):
    base = _public_url(request)
    content = (
        "User-agent: *\n"
        "Allow: /\n"
        "Disallow: /api/\n"
        "Disallow: /*/admin\n"
        "Disallow: /*/sitemap\n\n"
        f"Sitemap: {base}/sitemap.xml\n"
    )
    return PlainTextResponse(content=content, media_type="text/plain; charset=utf-8")


@router.get("/sitemap.xml")
async def sitemap_xml(request: Request, db: AsyncSession = Depends(get_db)):
    base = _public_url(request)
    cats = (await db.execute(select(Category).order_by(Category.sort_order))).scalars().all()
    prods = (await db.execute(select(Product).where(Product.visible.is_(True)).order_by(Product.id))).scalars().all()
    news = (await db.execute(select(NewsArticle).where(NewsArticle.published.is_(True)).order_by(NewsArticle.published_date.desc()))).scalars().all()

    static_paths = ["/", "/catalog", "/export", "/partners", "/news", "/about", "/contacts"]

    url_blocks: list[str] = []

    def add_multilang_url(subpath: str, priority: str, changefreq: str, lastmod: str | None = None):
        norm = "/" if subpath == "/" else subpath
        alt_lines = [
            f'    <xhtml:link rel="alternate" hreflang="{l}" href="{xml_escape(base)}/{l}{norm}" />'
            for l in SUPPORTED_LANGS
        ]
        alt_lines.append(
            f'    <xhtml:link rel="alternate" hreflang="x-default" href="{xml_escape(base)}/ru{norm}" />'
        )
        alt_str = "\n".join(alt_lines)
        lm_str = f"\n    <lastmod>{lastmod}</lastmod>" if lastmod else ""
        for lang in SUPPORTED_LANGS:
            loc = f"{base}/{lang}{norm}"
            url_blocks.append(
                f"  <url>\n    <loc>{xml_escape(loc)}</loc>{lm_str}\n    <changefreq>{changefreq}</changefreq>\n    <priority>{priority}</priority>\n{alt_str}\n  </url>"
            )

    for sp in static_paths:
        add_multilang_url(sp, "1.0" if sp == "/" else "0.8", "weekly")
    for c in cats:
        add_multilang_url(f"/catalog/{c.slug}", "0.85", "weekly")
    for p in prods:
        add_multilang_url(f"/product/{p.slug}", "0.9", "weekly")
    for n in news:
        add_multilang_url(f"/news/{n.slug}", "0.7", "monthly", lastmod=n.published_date.isoformat())

    xml_doc = (
        '<?xml version="1.0" encoding="UTF-8"?>\n'
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n'
        '        xmlns:xhtml="http://www.w3.org/1999/xhtml">\n'
        + "\n".join(url_blocks)
        + "\n</urlset>\n"
    )
    return Response(content=xml_doc, media_type="application/xml; charset=utf-8")


@router.get("/{full_path:path}")
async def serve_spa_with_seo(full_path: str, request: Request, db: AsyncSession = Depends(get_db)):
    if full_path.startswith("api/") or full_path == "api":
        raise HTTPException(status_code=404, detail="API endpoint not found")

    raw_path = f"/{full_path}" if full_path else "/"

    # 1. Check 301 redirect rules first (matches exact path or trimmed trailing slash)
    candidates = {raw_path}
    if len(raw_path) > 1:
        candidates.add(raw_path.rstrip("/"))
        candidates.add(f"{raw_path.rstrip('/')}/")
    redir = (
        await db.execute(
            select(Redirect301).where(
                Redirect301.is_active.is_(True),
                Redirect301.source_path.in_(list(candidates)),
            )
        )
    ).scalar_one_or_none()
    if redir is not None:
        return RedirectResponse(url=redir.target_path, status_code=301)

    # 2. Root redirect / -> /ru/
    if raw_path == "/":
        return RedirectResponse(url="/ru/", status_code=302)

    # 3. Unprefixed legacy path normalization (/catalog -> /ru/catalog)
    first_seg = full_path.split("/", 1)[0]
    if first_seg not in SUPPORTED_LANGS:
        if first_seg in UNPREFIXED_STATIC:
            return RedirectResponse(url=f"/ru/{full_path}", status_code=301)
        # Unknown path -> HTTP 404 with SPA 404 shell
        template = await get_spa_template()
        base = _public_url(request)
        html = _inject_head_meta(
            template,
            "ru",
            "404 — Страница не найдена | ОАО «Молочный Мир»",
            "Запрошенная страница не найдена на сайте milk.by.",
            f"{base}{raw_path}",
            [],
            noindex=True,
        )
        return HTMLResponse(content=html, status_code=404)

    # 4. Language-prefixed route /:lang/...
    lang = first_seg
    sub_path = full_path[len(lang):].strip("/")  # "" for /:lang/
    base = _public_url(request)

    static_seo = {
        "": {
            "ru": ("ОАО «Молочный Мир» (milk.by) — Натуральные сыры, молоко и экспорт", "Официальная витрина ОАО «Молочный Мир»: каталог, характеристики, фасовки и экспорт."),
            "be": ("ААТ «Малочны Мір» (milk.by) — Натуральныя сыры, малако і экспарт", "Афіцыйная вітрына ААТ «Малочны Мір»: каталог, характарыстыкі і экспарт."),
            "en": ("Molochny Mir (milk.by) — Dairy Catalog, Export & B2B Portal", "Official digital showcase of Molochny Mir JSC: dairy catalog, specs, and export."),
            "zh": ("Molochny Mir (milk.by) — 乳制品目录、国际出口与B2B合作", "Molochny Mir 股份公司官方数字门户：产品目录、规格与全球出口。"),
        },
        "catalog": {
            "ru": ("Продукция — Молочный Мир (milk.by)", "Полный ассортимент молочной продукции ОАО «Молочный Мир»."),
            "be": ("Прадукцыя — Малочны Мір (milk.by)", "Поўны асартымент малочнай прадукцыі ААТ «Малочны Мір»."),
            "en": ("Products — Molochny Mir (milk.by)", "Complete dairy catalog with dynamic filtering and pack specs."),
            "zh": ("产品目录 — Molochny Mir (milk.by)", "Molochny Mir 乳制品完整目录与动态筛选。"),
        },
        "news": {
            "ru": ("Новости — Молочный Мир (milk.by)", "Новости производства, экспортные контракты и награды."),
            "be": ("Навіны — Малочны Мір (milk.by)", "Навіны вытворчасці, экспартныя кантракты і ўзнагароды."),
            "en": ("News — Molochny Mir (milk.by)", "Corporate announcements, export news, and product launches."),
            "zh": ("新闻动态 — Molochny Mir (milk.by)", "企业新闻、国际出口合约与新品发布。"),
        },
        "export": {
            "ru": ("Экспорт и международное партнёрство — Молочный Мир", "Экспортные поставки сухого молока, масла и сыров в 25+ стран."),
            "be": ("Экспарт і міжнароднае партнёрства — Малочны Мір", "Экспартныя пастаўкі сухога малака, масла і сыроў у 25+ краін."),
            "en": ("Global Export & International B2B — Molochny Mir", "Direct manufacturer dairy exports to 25+ countries."),
            "zh": ("国际出口与全球合作伙伴 — Molochny Mir", "面向全球25+国家的乳制品直供出口。"),
        },
        "partners": {
            "ru": ("Партнёрам (B2B и HoReCa) — Молочный Мир", "Оптовые поставки для сетей, пиццерий и производств."),
            "be": ("Партнёрам (B2B і HoReCa) — Малочны Мір", "Аптовыя пастаўкі для гандлёвых сетак і HoReCa."),
            "en": ("B2B Partners & HoReCa — Molochny Mir", "Wholesale supply terms for retail chains and HoReCa."),
            "zh": ("商业合作 (B2B 与餐饮) — Molochny Mir", "面向大宗批发、商超及餐饮渠道的合作方案。"),
        },
        "about": {
            "ru": ("О компании — Молочный Мир (milk.by)", "История с 1938 года, производственные площадки и качество."),
            "be": ("Пра кампанію — Малочны Мір (milk.by)", "Гісторыя з 1938 года, вытворчыя пляцоўкі і якасць."),
            "en": ("About — Molochny Mir (milk.by)", "Heritage since 1938, modern plants, and FSSC 22000 quality."),
            "zh": ("关于我们 — Molochny Mir (milk.by)", "始创于1938年，现代化工厂与国际质控体系。"),
        },
        "contacts": {
            "ru": ("Контакты — Молочный Мир (milk.by)", "Отдел продаж, отдел экспорта и приёмная ОАО «Молочный Мир»."),
            "be": ("Кантакты — Малочны Мір (milk.by)", "Аддзел продажаў, экспарт і прыёмная ААТ «Малочны Мір»."),
            "en": ("Contacts — Molochny Mir (milk.by)", "Direct contacts for wholesale sales, export, and press."),
            "zh": ("联系我们 — Molochny Mir (milk.by)", "大宗销售、国际出口与企业办公室联系方式。"),
        },
        "admin": {
            "ru": ("CMS-панель — Молочный Мир", "Панель управления каталогом, новостями и SEO."),
            "be": ("CMS-панэль — Малочны Мір", "Панэль кіравання каталогам, навінамі і SEO."),
            "en": ("CMS Admin — Molochny Mir", "Catalog, news, and SEO management panel."),
            "zh": ("CMS 后台 — Molochny Mir", "产品目录与多语言管理后台。"),
        },
        "sitemap": {
            "ru": ("XML-карта сайта и SEO-аудит — Молочный Мир", "Карта сайта, hreflang и 301-редиректы."),
            "be": ("XML-карта сайта і SEO-аўдыт — Малочны Мір", "Карта сайта, hreflang і 301-рэдырэкты."),
            "en": ("XML Sitemap & SEO Audit — Molochny Mir", "Dynamic sitemap.xml, hreflang audit, and 301 redirects."),
            "zh": ("XML 站点地图与 SEO 审计 — Molochny Mir", "站点地图与 301 重定向配置。"),
        },
    }

    status_code = 200
    noindex = sub_path in ("admin", "sitemap")
    title = ""
    desc = ""

    if sub_path in static_seo:
        title, desc = static_seo[sub_path][lang]
    elif sub_path.startswith("catalog/"):
        cat_slug = sub_path.split("/", 1)[1]
        cat = (await db.execute(select(Category).where((Category.slug == cat_slug) | (Category.id == cat_slug)))).scalar_one_or_none()
        if cat:
            title = (cat.seo or {}).get("title", {}).get(lang) or cat.name.get(lang, cat.slug)
            desc = (cat.seo or {}).get("description", {}).get(lang) or cat.description.get(lang, "")
        else:
            status_code = 404
    elif sub_path.startswith("product/"):
        prod_slug = sub_path.split("/", 1)[1]
        prod = (await db.execute(select(Product).where((Product.slug == prod_slug) | (Product.id == prod_slug)))).scalar_one_or_none()
        if prod and prod.visible:
            title = (prod.seo or {}).get("title", {}).get(lang) or prod.name.get(lang, prod.slug)
            desc = (prod.seo or {}).get("description", {}).get(lang) or prod.description.get(lang, "")
        else:
            status_code = 404
    elif sub_path.startswith("news/"):
        news_slug = sub_path.split("/", 1)[1]
        art = (await db.execute(select(NewsArticle).where((NewsArticle.slug == news_slug) | (NewsArticle.id == news_slug)))).scalar_one_or_none()
        if art and art.published:
            title = (art.seo or {}).get("title", {}).get(lang) or art.title.get(lang, art.slug)
            desc = (art.seo or {}).get("description", {}).get(lang) or art.excerpt.get(lang, "")
        else:
            status_code = 404
    else:
        status_code = 404

    if status_code == 404:
        noindex = True
        title = {
            "ru": "404 — Страница не найдена | Молочный Мир",
            "be": "404 — Старонка не знойдзена | Малочны Мір",
            "en": "404 — Page Not Found | Molochny Mir",
            "zh": "404 — 页面未找到 | Molochny Mir",
        }[lang]
        desc = "Requested page was not found."

    norm_sub = f"/{sub_path}" if sub_path else "/"
    canonical = f"{base}/{lang}{norm_sub}"
    alternates = [(hl, f"{base}/{hl}{norm_sub}") for hl in SUPPORTED_LANGS]
    alternates.append(("x-default", f"{base}/ru{norm_sub}"))

    template = await get_spa_template()
    html = _inject_head_meta(template, lang, title, desc, canonical, alternates, noindex=noindex)
    return HTMLResponse(content=html, status_code=status_code)
EOF

cat <<'EOF' > backend/app/main.py
import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.config import settings
from app.routers import admin, ai, b2b, catalog, news, seo
from app.seed import ensure_seeded


@asynccontextmanager
async def lifespan(_app: FastAPI):
    os.makedirs(settings.media_dir, exist_ok=True)
    try:
        await ensure_seeded()
    except Exception:
        # Tables may not exist yet before alembic upgrade
        pass
    yield


app = FastAPI(
    title="OJSC Molochny Mir (milk.by) Digital Showcase API",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

os.makedirs(settings.media_dir, exist_ok=True)
app.mount("/api/v1/media", StaticFiles(directory=settings.media_dir), name="media")

# Register REST API routers BEFORE SEO catch-all router
app.include_router(catalog.router)
app.include_router(news.router)
app.include_router(ai.router)
app.include_router(b2b.router)
app.include_router(admin.router)
app.include_router(seo.router)
EOF

echo "==> [5/6] Writing synchronized TypeScript contracts, routing helpers, API client, and seed data..."

cat <<'EOF' > src/types/index.ts
export type Language = 'ru' | 'be' | 'en' | 'zh';

export type LocalizedText = Record<Language, string>;

export interface PackageVariant {
  id: string;
  weight: string;
  weightGrams: number;
  shelfLife: LocalizedText;
  storage: LocalizedText;
  packagingType: LocalizedText;
  unitsPerBox: number;
  gtin: string;
}

export interface ProductSeo {
  title: LocalizedText;
  description: LocalizedText;
  h1: LocalizedText;
}

export interface Product {
  id: string;
  slug: string;
  category: string;
  subcategory: string;
  name: LocalizedText;
  description: LocalizedText;
  image: string;
  fatContent?: number | null;
  proteinContent?: number | null;
  lactoseFree?: boolean;
  exportReady?: boolean;
  featured?: boolean;
  visible: boolean;
  packages: PackageVariant[];
  characteristics: Record<string, LocalizedText>;
  useCases: string[];
  relatedIds: string[];
  seo: ProductSeo;
}

export interface CategorySubcategory {
  id: string;
  name: LocalizedText;
}

export interface CharacteristicField {
  key: string;
  label: LocalizedText;
}

export interface Category {
  id: string;
  slug: string;
  name: LocalizedText;
  description: LocalizedText;
  subcategories: CategorySubcategory[];
  filterKeys: ('fat' | 'lactoseFree' | 'highProtein' | 'exportReady')[];
  characteristicSchema: CharacteristicField[];
  seo: {
    title: LocalizedText;
    description: LocalizedText;
  };
}

export type NewsCategoryId = 'company' | 'export' | 'products' | 'awards';

export interface NewsArticle {
  id: string;
  slug: string;
  date: string;
  year: number;
  categoryId: NewsCategoryId;
  title: LocalizedText;
  excerpt: LocalizedText;
  content: LocalizedText;
  image: string;
  published: boolean;
  relatedIds: string[];
  seo: {
    title: LocalizedText;
    description: LocalizedText;
  };
}

export interface RedirectRule {
  id?: number;
  from: string;
  to: string;
  code: 301;
  note: string;
}

export interface B2BInquiry {
  id?: string;
  company: string;
  contactName: string;
  email: string;
  phone: string;
  country: string;
  productId?: string | null;
  packageId?: string | null;
  volume: string;
  message: string;
  channel: 'export' | 'wholesale' | 'general';
  language?: Language;
  status?: string;
  createdAt?: string;
}

export interface ProductListResponse {
  items: Product[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface SmartCriterion {
  id: string;
  label: string;
}

export interface SmartMatchResult {
  product: Product;
  score: number;
  reasons: string[];
  recommendedPackage?: PackageVariant | null;
}

export interface SmartSelectResponse {
  query: string;
  correctedQuery?: string | null;
  mode: 'llm+db' | 'nlp+db';
  criteria: SmartCriterion[];
  results: SmartMatchResult[];
}

export interface AutocompleteSuggestion {
  id: string;
  slug: string;
  name: LocalizedText;
  category: string;
  categoryName: LocalizedText;
  image: string;
  fatContent?: number | null;
  recommendedPackage?: PackageVariant | null;
}

export interface AutocompleteResponse {
  query: string;
  correctedQuery?: string | null;
  criteria: SmartCriterion[];
  suggestions: AutocompleteSuggestion[];
  totalMatches: number;
}

export interface BulkImportResult {
  created: number;
  updated: number;
  skipped: number;
  errors: string[];
}

export interface SeoAudit {
  totalProducts: number;
  uniqueTitlesByLang: Record<string, number>;
  duplicateTitlesByLang: Record<string, string[]>;
  totalNews: number;
  totalRedirects: number;
  sitemapUrlCount: number;
}

export interface BootstrapPayload {
  categories: Category[];
  products: Product[];
  news: NewsArticle[];
  redirects: RedirectRule[];
  translations: Record<string, LocalizedText>;
}
EOF

cat <<'EOF' > src/utils/paths.ts
import { Language } from '../types';

export const SUPPORTED_LANGUAGES: Language[] = ['ru', 'be', 'en', 'zh'];

export function extractLangFromPath(pathname: string): Language | null {
  const match = pathname.match(/^\/(ru|be|en|zh)(?=\/|$)/);
  return match ? (match[1] as Language) : null;
}

export function stripLangPrefix(pathname: string): string {
  const cleaned = pathname.replace(/^\/?#?\/?(ru|be|en|zh)(?=\/|$)/, '');
  if (!cleaned) return '/';
  return cleaned.startsWith('/') ? cleaned : `/${cleaned}`;
}

export function buildLocalizedPath(path: string, lang: Language): string {
  const clean = path.replace(/^\/?#/, '').trim();
  const withSlash = clean.startsWith('/') ? clean : `/${clean}`;
  const stripped = stripLangPrefix(withSlash);
  return stripped === '/' ? `/${lang}/` : `/${lang}${stripped}`;
}
EOF

cat <<'EOF' > src/data/assets.ts
import heroDairyShowcase from '../assets/images/hero_dairy_showcase_1794512230445.jpg';
import productMozzarella from '../assets/images/product_mozzarella_1794512230168.jpg';
import productAgedCheese from '../assets/images/product_aged_cheese_1794512231265.jpg';
import productMilkKefir from '../assets/images/product_milk_kefir_1794512231074.jpg';
import productButterCream from '../assets/images/product_butter_cream_1794512231387.jpg';
import productGreekYogurt from '../assets/images/product_greek_yogurt_1794512231400.jpg';
import productIceCream from '../assets/images/product_ice_cream_1794512232213.jpg';
import newsDairyFacility from '../assets/images/news_dairy_facility_1794512233019.jpg';

export const ASSETS = {
  heroDairyShowcase,
  productMozzarella,
  productAgedCheese,
  productMilkKefir,
  productButterCream,
  productGreekYogurt,
  productIceCream,
  newsDairyFacility,
} as const;

const ASSET_KEY_MAP: Record<string, string> = {
  'asset:heroDairyShowcase': heroDairyShowcase,
  'asset:productMozzarella': productMozzarella,
  'asset:productAgedCheese': productAgedCheese,
  'asset:productMilkKefir': productMilkKefir,
  'asset:productButterCream': productButterCream,
  'asset:productGreekYogurt': productGreekYogurt,
  'asset:productIceCream': productIceCream,
  'asset:newsDairyFacility': newsDairyFacility,
};

export function resolveAssetUrl(src: string | undefined | null): string {
  if (!src) return '';
  if (src in ASSET_KEY_MAP) {
    return ASSET_KEY_MAP[src];
  }
  return src;
}
EOF

cat <<'EOF' > src/utils/apiClient.ts
import {
  AutocompleteResponse,
  B2BInquiry,
  BootstrapPayload,
  BulkImportResult,
  Category,
  Language,
  LocalizedText,
  NewsArticle,
  Product,
  RedirectRule,
  SeoAudit,
  SmartSelectResponse,
} from '../types';

const API_BASE = '/api/v1';

async function requestJson<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: {
      ...(options?.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
      ...(options?.headers || {}),
    },
    ...options,
  });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }
  if (res.status === 204) {
    return undefined as unknown as T;
  }
  return (await res.json()) as T;
}

export const apiClient = {
  getBootstrap: () => requestJson<BootstrapPayload>(`${API_BASE}/bootstrap`),

  autocomplete: (q: string, lang: Language, limit = 6) =>
    requestJson<AutocompleteResponse>(
      `${API_BASE}/search/autocomplete?q=${encodeURIComponent(q)}&lang=${lang}&limit=${limit}`
    ),

  smartSelect: (query: string, language: Language, limit = 6) =>
    requestJson<SmartSelectResponse>(`${API_BASE}/ai/smart-select`, {
      method: 'POST',
      body: JSON.stringify({ query, language, limit }),
    }),

  submitB2BInquiry: (payload: B2BInquiry) =>
    requestJson<B2BInquiry>(`${API_BASE}/b2b-inquiries`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  getSeoAudit: () => requestJson<SeoAudit>(`${API_BASE}/seo/audit`),

  // Admin CRUD
  createProduct: (product: Product) =>
    requestJson<Product>(`${API_BASE}/admin/products`, {
      method: 'POST',
      body: JSON.stringify(product),
    }),

  updateProduct: (product: Product) =>
    requestJson<Product>(`${API_BASE}/admin/products/${encodeURIComponent(product.id)}`, {
      method: 'PUT',
      body: JSON.stringify(product),
    }),

  toggleProductVisibility: (id: string) =>
    requestJson<Product>(`${API_BASE}/admin/products/${encodeURIComponent(id)}/visibility`, {
      method: 'PATCH',
    }),

  deleteProduct: (id: string) =>
    requestJson<void>(`${API_BASE}/admin/products/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    }),

  createCategory: (category: Category) =>
    requestJson<Category>(`${API_BASE}/admin/categories`, {
      method: 'POST',
      body: JSON.stringify(category),
    }),

  updateCategory: (category: Category) =>
    requestJson<Category>(`${API_BASE}/admin/categories/${encodeURIComponent(category.id)}`, {
      method: 'PUT',
      body: JSON.stringify(category),
    }),

  deleteCategory: (id: string) =>
    requestJson<void>(`${API_BASE}/admin/categories/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    }),

  createNews: (article: NewsArticle) =>
    requestJson<NewsArticle>(`${API_BASE}/admin/news`, {
      method: 'POST',
      body: JSON.stringify(article),
    }),

  updateNews: (article: NewsArticle) =>
    requestJson<NewsArticle>(`${API_BASE}/admin/news/${encodeURIComponent(article.id)}`, {
      method: 'PUT',
      body: JSON.stringify(article),
    }),

  toggleNewsPublished: (id: string) =>
    requestJson<NewsArticle>(`${API_BASE}/admin/news/${encodeURIComponent(id)}/publish`, {
      method: 'PATCH',
    }),

  deleteNews: (id: string) =>
    requestJson<void>(`${API_BASE}/admin/news/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    }),

  updateTranslation: (key: string, language: Language, value: string) =>
    requestJson<Record<string, LocalizedText>>(`${API_BASE}/admin/translations`, {
      method: 'PUT',
      body: JSON.stringify({ key, language, value }),
    }),

  createRedirect: (rule: RedirectRule) =>
    requestJson<RedirectRule>(`${API_BASE}/admin/redirects`, {
      method: 'POST',
      body: JSON.stringify(rule),
    }),

  deleteRedirect: (id: number) =>
    requestJson<void>(`${API_BASE}/admin/redirects/${id}`, {
      method: 'DELETE',
    }),

  listInquiries: () => requestJson<B2BInquiry[]>(`${API_BASE}/admin/inquiries`),

  uploadMedia: (file: File) => {
    const fd = new FormData();
    fd.append('file', file);
    return requestJson<{ url: string }>(`${API_BASE}/admin/upload`, {
      method: 'POST',
      body: fd,
    });
  },

  importProductsFile: (file: File) => {
    const fd = new FormData();
    fd.append('file', file);
    return requestJson<BulkImportResult>(`${API_BASE}/admin/import/products`, {
      method: 'POST',
      body: fd,
    });
  },

  importRedirectsFile: (file: File) => {
    const fd = new FormData();
    fd.append('file', file);
    return requestJson<BulkImportResult>(`${API_BASE}/admin/import/redirects`, {
      method: 'POST',
      body: fd,
    });
  },

  resetDemo: () =>
    requestJson<{ status: string }>(`${API_BASE}/admin/reset-demo`, {
      method: 'POST',
    }),
};
EOF

cat <<'EOF' > src/utils/specExport.ts
import { Category, Language, NewsArticle, Product } from '../types';

export async function downloadProductB2BSpec(
  product: Product,
  category: Category | undefined,
  language: Language
): Promise<void> {
  const pdfUrl = `/api/v1/products/${encodeURIComponent(product.slug)}/spec.pdf?lang=${language}`;
  try {
    const res = await fetch(pdfUrl);
    if (res.ok && res.headers.get('content-type')?.includes('application/pdf')) {
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `molochny-mir-${product.slug}-spec-${language}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      return;
    }
  } catch {
    // Fallback when running pure static frontend without backend
  }

  const name = product.name[language] || product.name.ru;
  const desc = product.description[language] || product.description.ru;
  const catName = category ? category.name[language] || category.name.ru : product.category;

  const lines: string[] = [
    '============================================================',
    'OAO "MOLOCHNY MIR" (milk.by) — B2B / EXPORT PRODUCT SPEC SHEET',
    '28 Gaspadarchaya St, Grodno 230005, Republic of Belarus',
    'Quality Systems: FSSC 22000 | ISO 9001 | HACCP',
    '============================================================',
    '',
    `PRODUCT: ${name}`,
    `CATEGORY: ${catName}`,
    `PRODUCT ID / SLUG: ${product.id} (/${language}/product/${product.slug})`,
    `FAT CONTENT: ${product.fatContent !== undefined && product.fatContent !== null ? `${product.fatContent}%` : 'N/A'}`,
    `PROTEIN CONTENT: ${product.proteinContent !== undefined && product.proteinContent !== null ? `${product.proteinContent} g / 100g` : 'N/A'}`,
    `LACTOSE FREE: ${product.lactoseFree ? 'Yes (<0.01%)' : 'No (Natural dairy lactose)'}`,
    `EXPORT READY: ${product.exportReady ? 'Yes (Certified)' : 'Domestic / Regional'}`,
    '',
    'DESCRIPTION:',
    desc,
    '',
    'TECHNICAL CHARACTERISTICS:',
    ...Object.entries(product.characteristics).map(([key, val]) => {
      const schemaField = category?.characteristicSchema.find((f) => f.key === key);
      const label = schemaField ? schemaField.label[language] || schemaField.label.ru : key;
      return `  - ${label}: ${val[language] || val.ru}`;
    }),
    '',
    'AVAILABLE PACKAGING & LOGISTICS VARIANTS:',
    ...product.packages.map(
      (pkg, idx) =>
        `  ${idx + 1}. Weight: ${pkg.weight} | Shelf Life: ${pkg.shelfLife[language] || pkg.shelfLife.ru} | Storage: ${
          pkg.storage[language] || pkg.storage.ru
        } | Packaging: ${pkg.packagingType[language] || pkg.packagingType.ru} | Units/Box: ${
          pkg.unitsPerBox
        } | GTIN: ${pkg.gtin}`
    ),
    '',
    'EXPORT & WHOLESALE CONTACT:',
    '  Export Dept: export@milk.by | +375 (152) 44-55-12',
    '  Domestic Sales: sales@milk.by | +375 (152) 44-55-01',
    `  Generated: ${new Date().toISOString().slice(0, 10)}`,
  ];

  const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `molochny-mir-${product.slug}-spec-${language}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function generateXmlSitemap(
  products: Product[],
  categories: Category[],
  news: NewsArticle[],
  baseUrl = 'https://milk.by'
): string {
  const langs: Language[] = ['ru', 'be', 'en', 'zh'];
  const staticPaths = ['/', '/catalog', '/export', '/partners', '/news', '/about', '/contacts'];
  const urls: string[] = [];

  const pushMultilang = (subPath: string, priority: string, changefreq: string, lastmod?: string) => {
    const altLines = [
      ...langs.map((l) => `    <xhtml:link rel="alternate" hreflang="${l}" href="${baseUrl}/${l}${subPath}" />`),
      `    <xhtml:link rel="alternate" hreflang="x-default" href="${baseUrl}/ru${subPath}" />`,
    ].join('\n');
    const lm = lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : '';
    for (const lang of langs) {
      urls.push(
        `  <url>\n    <loc>${baseUrl}/${lang}${subPath}</loc>${lm}\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n${altLines}\n  </url>`
      );
    }
  };

  for (const path of staticPaths) {
    pushMultilang(path, path === '/' ? '1.0' : '0.8', 'weekly');
  }
  for (const cat of categories) {
    pushMultilang(`/catalog/${cat.slug}`, '0.85', 'weekly');
  }
  for (const prod of products.filter((p) => p.visible)) {
    pushMultilang(`/product/${prod.slug}`, '0.9', 'weekly');
  }
  for (const item of news.filter((n) => n.published)) {
    pushMultilang(`/news/${item.slug}`, '0.7', 'monthly', item.date);
  }

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n        xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls.join(
    '\n'
  )}\n</urlset>`;
}
EOF

# Synchronize frontend seed data with backend canonical seed_data.py (30 products, 16 news, 24 clean 301 redirects)
python3 - <<'PY'
import json
import sys
from pathlib import Path

sys.path.insert(0, "backend")
from app.seed_data import PRODUCTS_SEED, NEWS_SEED, REDIRECTS_SEED, UI_TRANSLATIONS_SEED

ASSET_EXPR = {
    "asset:heroDairyShowcase": "ASSETS.heroDairyShowcase",
    "asset:productMozzarella": "ASSETS.productMozzarella",
    "asset:productAgedCheese": "ASSETS.productAgedCheese",
    "asset:productMilkKefir": "ASSETS.productMilkKefir",
    "asset:productButterCream": "ASSETS.productButterCream",
    "asset:productGreekYogurt": "ASSETS.productGreekYogurt",
    "asset:productIceCream": "ASSETS.productIceCream",
    "asset:newsDairyFacility": "ASSETS.newsDairyFacility",
}

def dump_with_assets(obj):
    s = json.dumps(obj, ensure_ascii=False, indent=2)
    for k, expr in ASSET_EXPR.items():
        s = s.replace(f'"{k}"', expr)
    return s

products_ts = (
    "import { Product, RedirectRule } from '../types';\n"
    "import { ASSETS } from './assets';\n\n"
    f"export const products: Product[] = {dump_with_assets(PRODUCTS_SEED)};\n\n"
    f"export const legacyRedirects: RedirectRule[] = {json.dumps(REDIRECTS_SEED, ensure_ascii=False, indent=2)};\n"
)
Path("src/data/products.ts").write_text(products_ts, encoding="utf-8")

news_ts = (
    "import { LocalizedText, NewsArticle, NewsCategoryId } from '../types';\n"
    "import { ASSETS } from './assets';\n\n"
    "export const NEWS_CATEGORY_LABELS: Record<NewsCategoryId, LocalizedText> = {\n"
    "  export: { ru: 'Экспорт', be: 'Экспарт', en: 'Export', zh: '国际出口' },\n"
    "  products: { ru: 'Продукция', be: 'Прадукцыя', en: 'Products', zh: '新品发布' },\n"
    "  company: { ru: 'Компания', be: 'Кампанія', en: 'Company', zh: '企业动态' },\n"
    "  awards: { ru: 'Награды', be: 'Узнагароды', en: 'Awards', zh: '荣誉奖项' },\n"
    "};\n\n"
    f"export const newsArticles: NewsArticle[] = {dump_with_assets(NEWS_SEED)};\n"
)
Path("src/data/news.ts").write_text(news_ts, encoding="utf-8")

trans_ts = (
    "import { Language, LocalizedText } from '../types';\n\n"
    "export const LANGUAGES: { code: Language; label: string; nativeName: string }[] = [\n"
    "  { code: 'ru', label: 'RU', nativeName: 'Русский' },\n"
    "  { code: 'be', label: 'BE', nativeName: 'Беларуская' },\n"
    "  { code: 'en', label: 'EN', nativeName: 'English' },\n"
    "  { code: 'zh', label: 'ZH', nativeName: '中文' },\n"
    "];\n\n"
    f"export const defaultTranslations: Record<string, LocalizedText> = {json.dumps(UI_TRANSLATIONS_SEED, ensure_ascii=False, indent=2)};\n"
)
Path("src/data/translations.ts").write_text(trans_ts, encoding="utf-8")
PY

echo "==> [6/6] Updating hooks, components, pages, and App.tsx for BrowserRouter + /:lang/ + API persistence..."

cat <<'EOF' > src/hooks/useLanguage.tsx
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Language, LocalizedText } from '../types';
import { defaultTranslations } from '../data/translations';
import { buildLocalizedPath, extractLangFromPath } from '../utils/paths';
import { apiClient } from '../utils/apiClient';

interface LanguageContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  localize: (text?: Partial<LocalizedText> | null) => string;
  translations: Record<string, LocalizedText>;
  updateTranslation: (key: string, lang: Language, value: string) => void;
  hydrateTranslations: (serverTranslations: Record<string, LocalizedText>) => void;
  resetTranslations: () => void;
}

const STORAGE_LANG_KEY = 'milk_world_lang';
const STORAGE_TRANS_KEY = 'milk_world_translations_v3';

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const fromUrl = extractLangFromPath(window.location.pathname);
      if (fromUrl) return fromUrl;
    }
    try {
      const saved = localStorage.getItem(STORAGE_LANG_KEY) as Language | null;
      if (saved && ['ru', 'be', 'en', 'zh'].includes(saved)) {
        return saved;
      }
    } catch {
      // ignore storage errors
    }
    return 'ru';
  });

  const [translations, setTranslations] = useState<Record<string, LocalizedText>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_TRANS_KEY);
      if (saved) {
        return { ...defaultTranslations, ...JSON.parse(saved) };
      }
    } catch {
      // ignore storage errors
    }
    return defaultTranslations;
  });

  useEffect(() => {
    document.documentElement.lang = language;
    try {
      localStorage.setItem(STORAGE_LANG_KEY, language);
    } catch {
      // ignore
    }
  }, [language]);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
  }, []);

  const t = useCallback(
    (key: string): string => {
      const entry = translations[key];
      if (!entry) return key;
      return entry[language] || entry.ru || entry.en || key;
    },
    [language, translations]
  );

  const localize = useCallback(
    (text?: Partial<LocalizedText> | null): string => {
      if (!text) return '';
      return text[language] || text.ru || text.en || text.be || text.zh || '';
    },
    [language]
  );

  const hydrateTranslations = useCallback((serverTranslations: Record<string, LocalizedText>) => {
    if (!serverTranslations || Object.keys(serverTranslations).length === 0) return;
    setTranslations((prev) => ({ ...prev, ...serverTranslations }));
  }, []);

  const updateTranslation = useCallback((key: string, lang: Language, value: string) => {
    setTranslations((prev) => {
      const updated = {
        ...prev,
        [key]: {
          ...(prev[key] || { ru: '', be: '', en: '', zh: '' }),
          [lang]: value,
        },
      };
      try {
        localStorage.setItem(STORAGE_TRANS_KEY, JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
    apiClient.updateTranslation(key, lang, value).catch(() => {
      // Fallback safely in offline mode
    });
  }, []);

  const resetTranslations = useCallback(() => {
    setTranslations(defaultTranslations);
    try {
      localStorage.removeItem(STORAGE_TRANS_KEY);
    } catch {
      // ignore
    }
  }, []);

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        localize,
        translations,
        updateTranslation,
        hydrateTranslations,
        resetTranslations,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return ctx;
}

export function useLocalizedPath() {
  const { language } = useLanguage();
  return useCallback(
    (path: string, targetLang?: Language) => buildLocalizedPath(path, targetLang ?? language),
    [language]
  );
}
EOF

cat <<'EOF' > src/hooks/useCatalogStore.tsx
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { B2BInquiry, Category, NewsArticle, Product, RedirectRule } from '../types';
import { products as initialProducts, legacyRedirects as initialRedirects } from '../data/products';
import { categories as initialCategories } from '../data/categories';
import { newsArticles as initialNews } from '../data/news';
import { apiClient } from '../utils/apiClient';
import { useLanguage } from './useLanguage';

interface CatalogStoreContextValue {
  products: Product[];
  categories: Category[];
  news: NewsArticle[];
  redirects: RedirectRule[];
  inquiries: B2BInquiry[];
  apiConnected: boolean;
  loading: boolean;
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  importProducts: (items: Product[]) => void;
  toggleProductVisibility: (id: string) => void;
  deleteProduct: (id: string) => void;
  addCategory: (category: Category) => void;
  updateCategory: (category: Category) => void;
  deleteCategory: (id: string) => void;
  addNews: (article: NewsArticle) => void;
  updateNews: (article: NewsArticle) => void;
  toggleNewsPublished: (id: string) => void;
  deleteNews: (id: string) => void;
  addRedirect: (rule: RedirectRule) => void;
  updateRedirect: (index: number, rule: RedirectRule) => void;
  deleteRedirect: (index: number) => void;
  refreshFromServer: () => Promise<void>;
  refreshInquiries: () => Promise<void>;
  resetDemoData: () => void;
}

const STORAGE_PRODUCTS_KEY = 'milk_world_products_v2';
const STORAGE_CATEGORIES_KEY = 'milk_world_categories_v2';
const STORAGE_NEWS_KEY = 'milk_world_news_v2';
const STORAGE_REDIRECTS_KEY = 'milk_world_redirects_v2';

const CatalogStoreContext = createContext<CatalogStoreContextValue | undefined>(undefined);

function loadStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw) as T;
  } catch {
    // ignore storage errors
  }
  return fallback;
}

function saveStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore storage errors
  }
}

export const CatalogStoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { hydrateTranslations } = useLanguage();
  const [apiConnected, setApiConnected] = useState(false);
  const [loading, setLoading] = useState(true);

  const [products, setProducts] = useState<Product[]>(() =>
    loadStorage(STORAGE_PRODUCTS_KEY, initialProducts)
  );
  const [categories, setCategories] = useState<Category[]>(() =>
    loadStorage(STORAGE_CATEGORIES_KEY, initialCategories)
  );
  const [news, setNews] = useState<NewsArticle[]>(() =>
    loadStorage(STORAGE_NEWS_KEY, initialNews)
  );
  const [redirects, setRedirects] = useState<RedirectRule[]>(() =>
    loadStorage(STORAGE_REDIRECTS_KEY, initialRedirects)
  );
  const [inquiries, setInquiries] = useState<B2BInquiry[]>([]);

  const refreshFromServer = useCallback(async () => {
    try {
      const data = await apiClient.getBootstrap();
      setCategories(data.categories);
      setProducts(data.products);
      setNews(data.news);
      setRedirects(data.redirects);
      hydrateTranslations(data.translations);
      setApiConnected(true);
    } catch {
      setApiConnected(false);
    } finally {
      setLoading(false);
    }
  }, [hydrateTranslations]);

  useEffect(() => {
    refreshFromServer();
  }, [refreshFromServer]);

  useEffect(() => {
    saveStorage(STORAGE_PRODUCTS_KEY, products);
  }, [products]);

  useEffect(() => {
    saveStorage(STORAGE_CATEGORIES_KEY, categories);
  }, [categories]);

  useEffect(() => {
    saveStorage(STORAGE_NEWS_KEY, news);
  }, [news]);

  useEffect(() => {
    saveStorage(STORAGE_REDIRECTS_KEY, redirects);
  }, [redirects]);

  const refreshInquiries = useCallback(async () => {
    try {
      const list = await apiClient.listInquiries();
      setInquiries(list);
    } catch {
      // ignore offline
    }
  }, []);

  const addProduct = useCallback((product: Product) => {
    setProducts((prev) => [product, ...prev]);
    apiClient.createProduct(product).then((saved) => {
      setProducts((prev) => prev.map((p) => (p.id === saved.id ? saved : p)));
    }).catch(() => {});
  }, []);

  const updateProduct = useCallback((updated: Product) => {
    setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    apiClient.updateProduct(updated).then((saved) => {
      setProducts((prev) => prev.map((p) => (p.id === saved.id ? saved : p)));
    }).catch(() => {});
  }, []);

  const importProducts = useCallback((items: Product[]) => {
    setProducts((prev) => {
      const map = new Map(prev.map((p) => [p.id, p]));
      for (const item of items) {
        map.set(item.id, item);
      }
      return Array.from(map.values());
    });
  }, []);

  const toggleProductVisibility = useCallback((id: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, visible: !p.visible } : p))
    );
    apiClient.toggleProductVisibility(id).catch(() => {});
  }, []);

  const deleteProduct = useCallback((id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    apiClient.deleteProduct(id).catch(() => {});
  }, []);

  const addCategory = useCallback((category: Category) => {
    setCategories((prev) => [...prev, category]);
    apiClient.createCategory(category).catch(() => {});
  }, []);

  const updateCategory = useCallback((updated: Category) => {
    setCategories((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
    apiClient.updateCategory(updated).catch(() => {});
  }, []);

  const deleteCategory = useCallback((id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
    apiClient.deleteCategory(id).catch(() => {});
  }, []);

  const addNews = useCallback((article: NewsArticle) => {
    setNews((prev) => [article, ...prev]);
    apiClient.createNews(article).catch(() => {});
  }, []);

  const updateNews = useCallback((updated: NewsArticle) => {
    setNews((prev) => prev.map((n) => (n.id === updated.id ? updated : n)));
    apiClient.updateNews(updated).catch(() => {});
  }, []);

  const toggleNewsPublished = useCallback((id: string) => {
    setNews((prev) =>
      prev.map((n) => (n.id === id ? { ...n, published: !n.published } : n))
    );
    apiClient.toggleNewsPublished(id).catch(() => {});
  }, []);

  const deleteNews = useCallback((id: string) => {
    setNews((prev) => prev.filter((n) => n.id !== id));
    apiClient.deleteNews(id).catch(() => {});
  }, []);

  const addRedirect = useCallback((rule: RedirectRule) => {
    setRedirects((prev) => [rule, ...prev]);
    apiClient.createRedirect(rule).then((saved) => {
      setRedirects((prev) => [saved, ...prev.filter((r) => r.from !== saved.from)]);
    }).catch(() => {});
  }, []);

  const updateRedirect = useCallback((index: number, rule: RedirectRule) => {
    setRedirects((prev) => prev.map((r, i) => (i === index ? rule : r)));
  }, []);

  const deleteRedirect = useCallback((index: number) => {
    setRedirects((prev) => {
      const target = prev[index];
      if (target?.id !== undefined) {
        apiClient.deleteRedirect(target.id).catch(() => {});
      }
      return prev.filter((_, i) => i !== index);
    });
  }, []);

  const resetDemoData = useCallback(() => {
    setProducts(initialProducts);
    setCategories(initialCategories);
    setNews(initialNews);
    setRedirects(initialRedirects);
    apiClient.resetDemo().then(() => refreshFromServer()).catch(() => {});
  }, [refreshFromServer]);

  return (
    <CatalogStoreContext.Provider
      value={{
        products,
        categories,
        news,
        redirects,
        inquiries,
        apiConnected,
        loading,
        addProduct,
        updateProduct,
        importProducts,
        toggleProductVisibility,
        deleteProduct,
        addCategory,
        updateCategory,
        deleteCategory,
        addNews,
        updateNews,
        toggleNewsPublished,
        deleteNews,
        addRedirect,
        updateRedirect,
        deleteRedirect,
        refreshFromServer,
        refreshInquiries,
        resetDemoData,
      }}
    >
      {children}
    </CatalogStoreContext.Provider>
  );
};

export function useCatalogStore(): CatalogStoreContextValue {
  const ctx = useContext(CatalogStoreContext);
  if (!ctx) {
    throw new Error('useCatalogStore must be used within a CatalogStoreProvider');
  }
  return ctx;
}
EOF

cat <<'EOF' > src/components/ImageWithFallback.tsx
import React, { useState, useEffect } from 'react';
import { Milk } from 'lucide-react';
import { resolveAssetUrl } from '../data/assets';

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  className?: string;
  fallbackTitle?: string;
}

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt,
  className = '',
  fallbackTitle,
}) => {
  const resolvedSrc = resolveAssetUrl(src);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [resolvedSrc]);

  if (failed || !resolvedSrc) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-slate-100 via-slate-50 to-blue-50/50 text-slate-400 p-4 text-center ${className}`}
        role="img"
        aria-label={alt}
      >
        <Milk className="w-8 h-8 text-[#0057B8]/40 mb-2" strokeWidth={1.5} />
        {fallbackTitle && (
          <span className="text-xs font-medium text-slate-500 max-w-[18ch] truncate">
            {fallbackTitle}
          </span>
        )}
      </div>
    );
  }

  return (
    <img
      src={resolvedSrc}
      alt={alt}
      referrerPolicy="no-referrer"
      loading="lazy"
      onError={() => setFailed(true)}
      className={className}
    />
  );
};
EOF

cat <<'EOF' > src/components/SeoHead.tsx
import React, { useEffect } from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { Language } from '../types';

interface SeoHeadProps {
  title: string;
  description: string;
  canonicalHash?: string;
  canonicalPath?: string;
  noIndex?: boolean;
}

const HREFLANG_LANGS: Language[] = ['ru', 'be', 'en', 'zh'];

export const SeoHead: React.FC<SeoHeadProps> = ({
  title,
  description,
  canonicalHash,
  canonicalPath,
  noIndex = false,
}) => {
  const { language } = useLanguage();

  useEffect(() => {
    document.title = title;
    document.documentElement.lang = language;

    const setMeta = (selector: string, attr: string, value: string) => {
      let el = document.querySelector(selector);
      if (!el) {
        el = document.createElement('meta');
        if (selector.includes('property=')) {
          el.setAttribute('property', selector.match(/property="([^"]+)"/)?.[1] || '');
        } else {
          el.setAttribute('name', selector.match(/name="([^"]+)"/)?.[1] || '');
        }
        document.head.appendChild(el);
      }
      el.setAttribute(attr, value);
    };

    setMeta('meta[name="description"]', 'content', description);
    setMeta('meta[property="og:title"]', 'content', title);
    setMeta('meta[property="og:description"]', 'content', description);

    if (noIndex) {
      setMeta('meta[name="robots"]', 'content', 'noindex, nofollow');
    } else {
      document.querySelector('meta[name="robots"]')?.remove();
    }

    const rawPath = canonicalPath ?? canonicalHash;
    if (rawPath !== undefined) {
      const normalizedPath = rawPath.startsWith('/') ? rawPath : `/${rawPath}`;
      const suffix = normalizedPath === '/' ? '/' : normalizedPath;
      const canonicalHref = `https://milk.by/${language}${suffix}`;

      setMeta('meta[property="og:url"]', 'content', canonicalHref);

      let canonicalLink = document.querySelector('link[rel="canonical"]');
      if (!canonicalLink) {
        canonicalLink = document.createElement('link');
        canonicalLink.setAttribute('rel', 'canonical');
        document.head.appendChild(canonicalLink);
      }
      canonicalLink.setAttribute('href', canonicalHref);

      const upsertAlternate = (hreflang: string, href: string) => {
        let alt = document.querySelector(`link[rel="alternate"][hreflang="${hreflang}"]`);
        if (!alt) {
          alt = document.createElement('link');
          alt.setAttribute('rel', 'alternate');
          alt.setAttribute('hreflang', hreflang);
          document.head.appendChild(alt);
        }
        alt.setAttribute('href', href);
      };

      HREFLANG_LANGS.forEach((langCode) => {
        upsertAlternate(langCode, `https://milk.by/${langCode}${suffix}`);
      });
      upsertAlternate('x-default', `https://milk.by/ru${suffix}`);
    }
  }, [title, description, canonicalHash, canonicalPath, noIndex, language]);

  return null;
};
EOF

cat <<'EOF' > src/components/LanguageSwitcher.tsx
import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { LANGUAGES } from '../data/translations';
import { useLanguage } from '../hooks/useLanguage';
import { Language } from '../types';
import { buildLocalizedPath } from '../utils/paths';

interface LanguageSwitcherProps {
  compact?: boolean;
  dark?: boolean;
  variant?: 'pills' | 'dropdown';
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  compact = false,
  dark = false,
  variant = 'pills',
}) => {
  const { language, setLanguage } = useLanguage();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();

  const currentLang = LANGUAGES.find((item) => item.code === language) || LANGUAGES[0];

  const handleSelectLanguage = (nextLang: Language) => {
    setLanguage(nextLang);
    const nextPath = buildLocalizedPath(location.pathname, nextLang);
    navigate(`${nextPath}${location.search}${location.hash}`);
    setOpen(false);
  };

  useEffect(() => {
    if (!open) return;
    const handleOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', handleOutside);
    window.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('mousedown', handleOutside);
      window.removeEventListener('keydown', handleEsc);
    };
  }, [open]);

  if (variant === 'dropdown') {
    return (
      <div ref={containerRef} className="relative">
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          aria-expanded={open}
          aria-haspopup="listbox"
          aria-label="Select language"
          className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-full border text-sm font-medium transition-all duration-150 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0057B8] ${
            dark
              ? 'bg-white/12 hover:bg-white/20 border-white/25 text-white backdrop-blur-sm'
              : 'bg-slate-100/80 hover:bg-slate-200/80 border-slate-200 text-slate-800'
          }`}
        >
          <Globe className="w-4 h-4 shrink-0 opacity-85" />
          <span>{currentLang.label}</span>
          <ChevronDown
            className={`w-3.5 h-3.5 shrink-0 opacity-75 transition-transform duration-150 ${
              open ? 'rotate-180' : ''
            }`}
          />
        </button>

        {open && (
          <div
            role="listbox"
            aria-label="Language options"
            className="absolute right-0 top-full mt-2 w-48 rounded-xl bg-white/95 backdrop-blur-xl border border-slate-200/90 shadow-xl p-1.5 z-50"
          >
            {LANGUAGES.map((item) => {
              const active = language === item.code;
              return (
                <button
                  key={item.code}
                  type="button"
                  role="option"
                  aria-selected={active}
                  onClick={() => handleSelectLanguage(item.code)}
                  className={`w-full px-3 py-2 rounded-lg text-left flex items-center justify-between gap-3 text-sm transition-colors ${
                    active
                      ? 'bg-slate-100 text-slate-900 font-semibold'
                      : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <span className="flex items-center gap-2.5 min-w-0">
                    <span className="text-xs font-mono uppercase text-slate-400 w-5 shrink-0">
                      {item.label}
                    </span>
                    <span className="truncate">{item.nativeName}</span>
                  </span>
                  {active && <Check className="w-4 h-4 text-[#0057B8] shrink-0" />}
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className={`inline-flex items-center gap-0.5 p-0.5 rounded-lg border transition-colors ${
        dark
          ? 'bg-white/10 border-white/20 backdrop-blur-xs'
          : 'bg-slate-100 border-slate-200/80'
      }`}
      role="group"
      aria-label="Language selector"
    >
      {LANGUAGES.map((item) => {
        const active = language === item.code;
        return (
          <button
            key={item.code}
            type="button"
            onClick={() => handleSelectLanguage(item.code)}
            title={item.nativeName}
            className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#0057B8] ${
              active
                ? dark
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'bg-white text-[#0057B8] shadow-xs'
                : dark
                ? 'text-white/80 hover:text-white'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {compact ? item.label : item.label}
          </button>
        );
      })}
    </div>
  );
};
EOF

cat <<'EOF' > src/components/Header.tsx
import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, ArrowRight } from 'lucide-react';
import { useLanguage, useLocalizedPath } from '../hooks/useLanguage';
import { useCatalogStore } from '../hooks/useCatalogStore';
import { LanguageSwitcher } from './LanguageSwitcher';
import { stripLangPrefix } from '../utils/paths';
import logoUrl from '../assets/logo.webp';

export const Header: React.FC = () => {
  const { t, localize, language } = useLanguage();
  const lp = useLocalizedPath();
  const { categories } = useCatalogStore();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<'catalog' | 'business' | null>(null);
  const [pastHero, setPastHero] = useState(false);

  const strippedPath = stripLangPrefix(location.pathname);
  const isHomePage = strippedPath === '/';

  useEffect(() => {
    const handleScroll = () => {
      setPastHero(window.scrollY > 440);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  useEffect(() => {
    setMobileOpen(false);
    setOpenMenu(null);
  }, [location.pathname]);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [mobileOpen]);

  const isOverHero = isHomePage && !pastHero;

  const isActive = (path: string) =>
    strippedPath === path || strippedPath.startsWith(`${path}/`);

  const isBusinessActive = isActive('/partners') || isActive('/export');

  const copy = {
    ru: {
      allCatalog: 'Весь каталог продукции',
      wholesale: 'Оптовым покупателям и HoReCa',
      wholesaleSub: 'Поставки для сетей, пиццерий и пекарен',
      exportTitle: 'Международный экспорт',
      exportSub: 'СОМ, масло, сыры и сертификаты GACC / ISO',
    },
    be: {
      allCatalog: 'Увесь каталог прадукцыі',
      wholesale: 'Аптовым пакупнікам і HoReCa',
      wholesaleSub: 'Пастаўкі для сетак, піцэрый і пякарняў',
      exportTitle: 'Міжнародны экспарт',
      exportSub: 'САМ, масла, сыры і сертыфікаты GACC / ISO',
    },
    en: {
      allCatalog: 'View All Products',
      wholesale: 'Wholesale & HoReCa Partners',
      wholesaleSub: 'Supply for retail chains, pizzerias, and bakeries',
      exportTitle: 'Global Export Portal',
      exportSub: 'SMP, butter, aged cheese, GACC & ISO docs',
    },
    zh: {
      allCatalog: '浏览全部产品目录',
      wholesale: '大宗批发与 HoReCa 餐饮合作',
      wholesaleSub: '面向连锁商超、披萨门店与工业烘焙直供',
      exportTitle: '国际出口专区',
      exportSub: '脱脂奶粉、黄油、奶酪及 GACC / ISO 认证',
    },
  }[language];

  const linkClass = (active: boolean) =>
    `nav-underline-link inline-flex items-center gap-1 whitespace-nowrap shrink-0 py-2 transition-colors duration-200 ${
      isOverHero
        ? active
          ? 'text-white'
          : 'text-white/90 hover:text-white'
        : active
        ? 'text-[#0057B8]'
        : 'text-slate-700 hover:text-[#0057B8]'
    }`;

  return (
    <header
      className={`${
        isHomePage ? 'fixed top-0 left-0 right-0' : 'sticky top-0'
      } z-40 transition-colors duration-200 backdrop-blur-md ${
        isOverHero
          ? mobileOpen
            ? 'bg-slate-950/60 border-b border-white/15'
            : 'bg-black/25 border-b border-white/15'
          : mobileOpen
          ? 'bg-white/80 border-b border-slate-200/80'
          : 'bg-white/90 border-b border-slate-200/80'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[72px] flex items-center justify-between gap-6">
        {/* Zone 1: Brand Logo */}
        <Link
          to={lp('/')}
          onClick={() => setMobileOpen(false)}
          aria-label={t('brandName')}
          className="inline-flex items-center shrink-0 rounded-lg transition-transform duration-200 hover:scale-[1.02] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0057B8]"
        >
          <img
            src={logoUrl}
            alt={t('brandName')}
            className="h-11 sm:h-12 w-auto object-contain"
          />
        </Link>

        {/* Zone 2: Clean 5-Item Navigation with Dropdowns & Animated Underlines */}
        <nav
          className="hidden lg:flex items-center gap-7 text-[15px] font-medium"
          aria-label="Main navigation"
        >
          {/* 1. Products + Category Dropdown */}
          <div
            className="relative group/nav"
            onMouseEnter={() => setOpenMenu('catalog')}
            onMouseLeave={() => setOpenMenu(null)}
          >
            <Link
              to={lp('/catalog')}
              data-active={isActive('/catalog')}
              className={linkClass(isActive('/catalog'))}
            >
              <span>{t('navCatalog')}</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  openMenu === 'catalog' ? 'rotate-180' : ''
                }`}
              />
            </Link>

            {openMenu === 'catalog' && (
              <div className="absolute left-0 top-full pt-2 z-50">
                <div className="w-[460px] rounded-2xl bg-white/98 backdrop-blur-xl border border-slate-200/90 shadow-xl p-3 space-y-2">
                  <div className="grid grid-cols-2 gap-1">
                    {categories.map((cat) => (
                      <Link
                        key={cat.id}
                        to={lp(`/catalog/${cat.slug}`)}
                        onClick={() => setOpenMenu(null)}
                        className="group/item px-3 py-2 rounded-lg text-sm text-slate-700 hover:bg-blue-50/70 hover:text-[#0057B8] transition-colors flex items-center justify-between gap-2"
                      >
                        <span className="truncate">{localize(cat.name)}</span>
                        <ArrowRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-all duration-200 shrink-0" />
                      </Link>
                    ))}
                  </div>
                  <div className="pt-2 border-t border-slate-100">
                    <Link
                      to={lp('/catalog')}
                      onClick={() => setOpenMenu(null)}
                      className="group/all flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold text-[#0057B8] hover:bg-blue-50 transition-colors"
                    >
                      <span>{copy.allCatalog}</span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover/all:translate-x-0.5" />
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 2. B2B & Export Dropdown */}
          <div
            className="relative group/nav"
            onMouseEnter={() => setOpenMenu('business')}
            onMouseLeave={() => setOpenMenu(null)}
          >
            <Link
              to={lp('/export')}
              data-active={isBusinessActive}
              className={linkClass(isBusinessActive)}
            >
              <span>{t('navBusiness')}</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  openMenu === 'business' ? 'rotate-180' : ''
                }`}
              />
            </Link>

            {openMenu === 'business' && (
              <div className="absolute left-0 top-full pt-2 z-50">
                <div className="w-80 rounded-2xl bg-white/98 backdrop-blur-xl border border-slate-200/90 shadow-xl p-2 space-y-1">
                  <Link
                    to={lp('/partners')}
                    onClick={() => setOpenMenu(null)}
                    className="block px-3.5 py-2.5 rounded-xl hover:bg-blue-50/70 transition-colors group/item"
                  >
                    <div className="text-sm font-semibold text-slate-900 group-hover/item:text-[#0057B8] transition-colors">
                      {copy.wholesale}
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">{copy.wholesaleSub}</div>
                  </Link>
                  <Link
                    to={lp('/export')}
                    onClick={() => setOpenMenu(null)}
                    className="block px-3.5 py-2.5 rounded-xl hover:bg-blue-50/70 transition-colors group/item"
                  >
                    <div className="text-sm font-semibold text-slate-900 group-hover/item:text-[#0057B8] transition-colors">
                      {copy.exportTitle}
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">{copy.exportSub}</div>
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* 3. News */}
          <Link to={lp('/news')} data-active={isActive('/news')} className={linkClass(isActive('/news'))}>
            {t('navNews')}
          </Link>

          {/* 4. About */}
          <Link to={lp('/about')} data-active={isActive('/about')} className={linkClass(isActive('/about'))}>
            {t('navAbout')}
          </Link>

          {/* 5. Contacts */}
          <Link
            to={lp('/contacts')}
            data-active={isActive('/contacts')}
            className={linkClass(isActive('/contacts'))}
          >
            {t('navContacts')}
          </Link>
        </nav>

        {/* Zone 3: Language Switcher + Mobile Toggle */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="hidden sm:inline-flex">
            <LanguageSwitcher variant="dropdown" dark={isOverHero} />
          </div>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            className={`lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg border transition-colors ${
              isOverHero
                ? 'border-white/25 text-white hover:bg-white/10'
                : 'border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
            aria-expanded={mobileOpen}
            aria-label="Toggle navigation menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div
          className={`lg:hidden border-t max-h-[calc(100dvh-72px)] overflow-y-auto overscroll-contain px-4 py-4 space-y-4 ${
            isOverHero
              ? 'border-white/15 text-white'
              : 'border-slate-200/70 text-slate-900'
          }`}
        >
          <nav className="flex flex-col space-y-1" aria-label="Mobile navigation">
            {[
              { to: '/catalog', label: t('navCatalog') },
              { to: '/partners', label: t('navPartners') },
              { to: '/export', label: t('navExport') },
              { to: '/news', label: t('navNews') },
              { to: '/about', label: t('navAbout') },
              { to: '/contacts', label: t('navContacts') },
            ].map((item) => (
              <Link
                key={item.to}
                to={lp(item.to)}
                onClick={() => setMobileOpen(false)}
                className={`px-3 py-2.5 rounded-lg text-base font-medium transition-colors ${
                  isOverHero
                    ? isActive(item.to)
                      ? 'bg-white/15 text-white'
                      : 'text-white/90 hover:bg-white/10 hover:text-white'
                    : isActive(item.to)
                    ? 'bg-[#0057B8]/10 text-[#0057B8]'
                    : 'text-slate-700 hover:bg-slate-900/5 hover:text-[#0057B8]'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div
            className={`pt-3 border-t flex items-center justify-between gap-3 ${
              isOverHero ? 'border-white/15' : 'border-slate-200/70'
            }`}
          >
            <span className={`text-xs ${isOverHero ? 'text-white/75' : 'text-slate-500'}`}>
              Language / Язык
            </span>
            <LanguageSwitcher compact dark={isOverHero} />
          </div>
        </div>
      )}
    </header>
  );
};
EOF

cat <<'EOF' > src/components/Footer.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useLanguage, useLocalizedPath } from '../hooks/useLanguage';
import { LanguageSwitcher } from './LanguageSwitcher';

export const Footer: React.FC = () => {
  const { t, language } = useLanguage();
  const lp = useLocalizedPath();

  const labels = {
    sections:
      language === 'ru'
        ? 'Разделы'
        : language === 'be'
        ? 'Раздзелы'
        : language === 'zh'
        ? '网站导航'
        : 'Sections',
    scenarios:
      language === 'ru'
        ? 'Сценарии'
        : language === 'be'
        ? 'Сцэнарыі'
        : language === 'zh'
        ? '业务通道'
        : 'Audience Paths',
    tools:
      language === 'ru'
        ? 'Управление и SEO'
        : language === 'be'
        ? 'Кіраванне і SEO'
        : language === 'zh'
        ? '系统管理与SEO'
        : 'Management & SEO',
    cms:
      language === 'ru'
        ? 'CMS-панель маркетолога'
        : language === 'be'
        ? 'CMS-панэль маркетолага'
        : language === 'zh'
        ? 'CMS 内容管理后台'
        : 'Marketing CMS Panel',
    sitemap:
      language === 'ru'
        ? 'XML-карта сайта и 301-редиректы'
        : language === 'be'
        ? 'XML-карта сайта і 301-рэдырэкты'
        : language === 'zh'
        ? 'XML 站点地图与301重定向'
        : 'XML Sitemap & 301 Audit',
  };

  return (
    <footer className="bg-slate-50 border-t border-slate-200 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-10 border-b border-slate-200">
          <div className="space-y-4">
            <Link to={lp('/')} className="font-display text-lg font-bold text-slate-900 inline-block">
              {t('brandName')}
            </Link>
            <p className="text-sm text-slate-600 leading-relaxed">{t('footerLegal')}</p>
            <div>
              <LanguageSwitcher />
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-slate-900 mb-3">{labels.sections}</h3>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>
                <Link to={lp('/catalog')} className="hover:text-[#0057B8] transition-colors">
                  {t('navCatalog')}
                </Link>
              </li>
              <li>
                <Link to={lp('/news')} className="hover:text-[#0057B8] transition-colors">
                  {t('navNews')}
                </Link>
              </li>
              <li>
                <Link to={lp('/about')} className="hover:text-[#0057B8] transition-colors">
                  {t('navAbout')}
                </Link>
              </li>
              <li>
                <Link to={lp('/contacts')} className="hover:text-[#0057B8] transition-colors">
                  {t('ctaContact')}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-slate-900 mb-3">{labels.scenarios}</h3>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>
                <Link to={lp('/catalog/cheese')} className="hover:text-[#0057B8] transition-colors">
                  {t('roleConsumerTitle')}
                </Link>
              </li>
              <li>
                <Link to={lp('/partners')} className="hover:text-[#0057B8] transition-colors">
                  {t('roleB2BTitle')}
                </Link>
              </li>
              <li>
                <Link to={lp('/export')} className="hover:text-[#0057B8] transition-colors">
                  {t('roleExportTitle')}
                </Link>
              </li>
              <li>
                <Link to={lp('/news')} className="hover:text-[#0057B8] transition-colors">
                  {t('roleMediaTitle')}
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-xs font-semibold text-slate-900 mb-3">{labels.tools}</h3>
              <ul className="space-y-2 text-sm text-slate-600">
                <li>
                  <Link to={lp('/admin')} className="hover:text-[#0057B8] transition-colors">
                    {labels.cms}
                  </Link>
                </li>
                <li>
                  <Link to={lp('/sitemap')} className="hover:text-[#0057B8] transition-colors">
                    {labels.sitemap}
                  </Link>
                </li>
                <li className="font-mono text-xs text-slate-500 pt-1 tabular-nums">
                  export@milk.by · +375 (152) 44-55-12
                </li>
              </ul>
            </div>

            <Link
              to={lp('/contacts')}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#0057B8] rounded-lg hover:bg-[#004494] transition-colors"
            >
              <span>{t('ctaContact')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-slate-500">
          <span>
            {language === 'ru'
              ? '© 2026 ОАО «Молочный Мир» (milk.by)'
              : language === 'be'
              ? '© 2026 ААТ «Малочны Мір» (milk.by)'
              : language === 'zh'
              ? '© 2026 Molochny Mir 股份公司 (milk.by)'
              : '© 2026 Molochny Mir JSC (milk.by)'}
          </span>
          <span>FSSC 22000 · ISO 9001 · HACCP</span>
        </div>
      </div>
    </footer>
  );
};
EOF

cat <<'EOF' > src/components/ProductCard.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { Product } from '../types';
import { useLanguage, useLocalizedPath } from '../hooks/useLanguage';
import { useCatalogStore } from '../hooks/useCatalogStore';
import { ImageWithFallback } from './ImageWithFallback';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { language, localize } = useLanguage();
  const lp = useLocalizedPath();
  const { categories } = useCatalogStore();

  const category = categories.find((c) => c.id === product.category);
  const categoryName = category ? localize(category.name) : product.category;
  const productName = localize(product.name);
  const productDesc = localize(product.description);

  const packCountLabel =
    language === 'ru'
      ? `${product.packages.length} фас.`
      : language === 'be'
      ? `${product.packages.length} фас.`
      : language === 'zh'
      ? `${product.packages.length} 种包装`
      : `${product.packages.length} packs`;

  const viewLabel =
    language === 'ru'
      ? 'Подробнее'
      : language === 'be'
      ? 'Падрабязней'
      : language === 'zh'
      ? '查看详情'
      : 'Details';

  return (
    <Link
      to={lp(`/product/${product.slug}`)}
      className="group h-full flex flex-col bg-white border border-slate-200 rounded-xl overflow-hidden hover:border-[#0057B8]/40 hover:-translate-y-1 hover:shadow-lg transition-all duration-200 ease-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0057B8]"
    >
      <div className="aspect-[4/3] w-full bg-slate-50 overflow-hidden border-b border-slate-100 shrink-0">
        <ImageWithFallback
          src={product.image}
          alt={productName}
          fallbackTitle={productName}
          className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-300 ease-out"
        />
      </div>

      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between gap-3 sm:gap-4">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500 tabular-nums">
            <span className="font-medium text-[#0057B8]">{categoryName}</span>
            {product.fatContent !== undefined && product.fatContent !== null && (
              <>
                <span aria-hidden="true">·</span>
                <span>{product.fatContent}%</span>
              </>
            )}
            {product.lactoseFree && (
              <>
                <span aria-hidden="true">·</span>
                <span>
                  {language === 'ru'
                    ? 'Без лактозы'
                    : language === 'be'
                    ? 'Без лактозы'
                    : language === 'zh'
                    ? '无乳糖'
                    : 'Lactose-Free'}
                </span>
              </>
            )}
          </div>

          <h3 className="font-display text-base font-semibold text-slate-900 group-hover:text-[#0057B8] transition-colors duration-200 leading-snug">
            {productName}
          </h3>

          <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed">
            {productDesc}
          </p>
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 text-xs text-slate-500 tabular-nums">
          <span className="truncate">
            {product.packages.map((p) => p.weight).slice(0, 3).join(' / ')}
            {product.packages.length > 3 ? ` · ${packCountLabel}` : ''}
          </span>
          <span className="inline-flex items-center gap-1 font-medium text-slate-700 group-hover:text-[#0057B8] transition-colors duration-200 whitespace-nowrap shrink-0">
            {viewLabel}
            <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        </div>
      </div>
    </Link>
  );
};
EOF

cat <<'EOF' > src/components/SearchBar.tsx
import React, { useMemo, useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, ArrowRight, Sparkles } from 'lucide-react';
import { useLanguage, useLocalizedPath } from '../hooks/useLanguage';
import { useCatalogStore } from '../hooks/useCatalogStore';
import { runSmartSearch } from '../utils/smartMatch';
import { ImageWithFallback } from './ImageWithFallback';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSubmitSearch?: (value: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ value, onChange, onSubmitSearch }) => {
  const { t, localize, language } = useLanguage();
  const lp = useLocalizedPath();
  const { products, categories } = useCatalogStore();
  const [focused, setFocused] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState(value);
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedQuery(value);
    }, 140);
    return () => window.clearTimeout(timer);
  }, [value]);

  useEffect(() => {
    setActiveIndex(-1);
  }, [debouncedQuery]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const searchResponse = useMemo(
    () => runSmartSearch(debouncedQuery, products, categories, language),
    [debouncedQuery, products, categories, language]
  );

  const suggestions = searchResponse.results.slice(0, 6);
  const showDropdown = focused && debouncedQuery.trim().length > 0;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setFocused(false);
      setActiveIndex(-1);
      return;
    }
    if (e.key === 'ArrowDown' && suggestions.length > 0) {
      e.preventDefault();
      setFocused(true);
      setActiveIndex((prev) => (prev + 1) % suggestions.length);
      return;
    }
    if (e.key === 'ArrowUp' && suggestions.length > 0) {
      e.preventDefault();
      setFocused(true);
      setActiveIndex((prev) => (prev <= 0 ? suggestions.length - 1 : prev - 1));
      return;
    }
    if (e.key === 'Enter') {
      if (activeIndex >= 0 && suggestions[activeIndex]) {
        e.preventDefault();
        setFocused(false);
        navigate(lp(`/product/${suggestions[activeIndex].product.slug}`));
        return;
      }
      setFocused(false);
      if (onSubmitSearch) {
        onSubmitSearch(value.trim());
      }
    }
  };

  const copy = {
    ru: {
      empty: 'Прямых совпадений не найдено — попробуйте указать вкус, жирность или задачу (например, «для пиццы»).',
      allResults: 'Показать все результаты в каталоге',
      smartHint: 'Умный подбор:',
    },
    be: {
      empty: 'Прамых супадзенняў не знойдзена — паспрабуйце задаць густ, тлустасць або задачу (напрыклад, «для піцы»).',
      allResults: 'Паказаць усе вынікі ў каталогу',
      smartHint: 'Разумны падбор:',
    },
    en: {
      empty: 'No direct matches — try describing your need (e.g., "pizza cheese", "lactose-free", "butter 82.5").',
      allResults: 'View all matching results in catalog',
      smartHint: 'Smart match:',
    },
    zh: {
      empty: '未找到直接匹配 — 请尝试输入用途或特征（如“披萨奶酪”、“无乳糖”、“黄油 82.5”）。',
      allResults: '在目录中查看全部结果',
      smartHint: '智能匹配:',
    },
  }[language];

  return (
    <div ref={containerRef} className="relative w-full min-w-0">
      <div className="relative flex items-center">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
        <input
          type="text"
          role="combobox"
          aria-expanded={showDropdown}
          aria-controls="search-suggestions-listbox"
          aria-activedescendant={
            activeIndex >= 0 && suggestions[activeIndex]
              ? `search-option-${suggestions[activeIndex].product.id}`
              : undefined
          }
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setFocused(true);
          }}
          onFocus={() => setFocused(true)}
          onKeyDown={handleKeyDown}
          placeholder={t('searchPlaceholder')}
          aria-label={t('searchPlaceholder')}
          className="w-full h-12 pl-10 pr-10 text-base sm:text-sm bg-white border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 shadow-sm focus:outline-none focus:border-[#0057B8] focus:ring-2 focus:ring-[#0057B8]/20 transition-all duration-200"
        />
        {value && (
          <button
            type="button"
            onClick={() => {
              onChange('');
              setDebouncedQuery('');
              setActiveIndex(-1);
              setFocused(false);
            }}
            aria-label="Clear search"
            className="absolute right-2.5 w-7 h-7 flex items-center justify-center rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {showDropdown && (
        <div className="absolute left-0 right-0 top-full mt-2 z-30 bg-white border border-slate-200 rounded-xl shadow-xl max-h-[60vh] overflow-y-auto overscroll-contain">
          {searchResponse.criteria.length > 0 && suggestions.length > 0 && (
            <div className="px-4 py-2 bg-blue-50/70 border-b border-blue-100 flex flex-wrap items-center gap-1.5 text-xs">
              <span className="inline-flex items-center gap-1 font-semibold text-[#0057B8]">
                <Sparkles className="w-3.5 h-3.5 shrink-0" />
                {copy.smartHint}
              </span>
              {searchResponse.criteria.map((c) => (
                <span
                  key={c.id}
                  className="px-2 py-0.5 rounded-md bg-white border border-blue-200/80 text-slate-700 font-medium"
                >
                  {c.label}
                </span>
              ))}
            </div>
          )}

          {suggestions.length > 0 ? (
            <>
              <ul id="search-suggestions-listbox" className="divide-y divide-slate-100" role="listbox">
                {suggestions.map(({ product: item, recommendedPackage }, idx) => {
                  const cat = categories.find((c) => c.id === item.category);
                  const isActive = idx === activeIndex;
                  return (
                    <li
                      key={item.id}
                      id={`search-option-${item.id}`}
                      role="option"
                      aria-selected={isActive}
                    >
                      <button
                        type="button"
                        onMouseEnter={() => setActiveIndex(idx)}
                        onClick={() => {
                          setFocused(false);
                          navigate(lp(`/product/${item.slug}`));
                        }}
                        className={`w-full px-4 py-2.5 text-left flex items-center justify-between gap-3 transition-colors duration-150 ${
                          isActive ? 'bg-blue-50/80' : 'hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-100 border border-slate-200/80 shrink-0">
                            <ImageWithFallback
                              src={item.image}
                              alt={localize(item.name)}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="min-w-0">
                            <div className="text-sm font-medium text-slate-900 truncate">
                              {localize(item.name)}
                            </div>
                            <div className="text-xs text-slate-500 flex flex-wrap items-center gap-1.5 tabular-nums">
                              <span className="text-[#0057B8] font-medium">
                                {cat ? localize(cat.name) : item.category}
                              </span>
                              {item.fatContent !== undefined && item.fatContent !== null && (
                                <>
                                  <span aria-hidden="true">·</span>
                                  <span>{item.fatContent}%</span>
                                </>
                              )}
                              <span aria-hidden="true">·</span>
                              <span>
                                {recommendedPackage
                                  ? recommendedPackage.weight
                                  : item.packages.map((p) => p.weight).join(', ')}
                              </span>
                            </div>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />
                      </button>
                    </li>
                  );
                })}
              </ul>

              {onSubmitSearch && (
                <button
                  type="button"
                  onClick={() => {
                    setFocused(false);
                    onSubmitSearch(value.trim());
                  }}
                  className="w-full px-4 py-2.5 text-xs font-semibold text-[#0057B8] bg-slate-50 hover:bg-blue-50/70 border-t border-slate-100 flex items-center justify-between transition-colors"
                >
                  <span>
                    {copy.allResults} ({searchResponse.results.length})
                  </span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </>
          ) : (
            <div className="px-4 py-3.5 text-xs text-slate-500">{copy.empty}</div>
          )}
        </div>
      )}
    </div>
  );
};
EOF

cat <<'EOF' > src/components/SmartFinder.tsx
import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Check, Package, X } from 'lucide-react';
import { useLanguage, useLocalizedPath } from '../hooks/useLanguage';
import { useCatalogStore } from '../hooks/useCatalogStore';
import { runSmartSearch } from '../utils/smartMatch';
import { apiClient } from '../utils/apiClient';
import { SmartCriterion, SmartMatchResult } from '../types';
import { ImageWithFallback } from './ImageWithFallback';

const SAMPLE_PROMPTS = {
  ru: [
    'Сыр для пиццы 1 кг',
    'Продукт без лактозы',
    'Высокий белок до 5% жира',
    'Выдержанный сыр к вину',
    'Для выпечки и кондитерки',
    'На экспорт с долгим хранением',
  ],
  be: [
    'Сыр для піцы 1 кг',
    'Прадукт без лактозы',
    'Высокі бялок да 5% тлушчу',
    'Вытрыманы сыр да віна',
    'Для выпечкі і кандытаркі',
    'На экспарт з доўгім захоўваннем',
  ],
  en: [
    'Pizza cheese 1kg',
    'Lactose-free dairy',
    'High protein under 5% fat',
    'Aged cheese for wine tasting',
    'Butter or cream for baking',
    'Long-shelf export products',
  ],
  zh: [
    '1公斤披萨专用奶酪',
    '无乳糖乳制品',
    '高蛋白低脂',
    '配葡萄酒的陈年奶酪',
    '烘焙用黄油与淡奶油',
    '出口长保质期产品',
  ],
};

export const SmartFinder: React.FC = () => {
  const { t, language, localize } = useLanguage();
  const lp = useLocalizedPath();
  const { products, categories, apiConnected } = useCatalogStore();
  const [query, setQuery] = useState('');
  const [remoteState, setRemoteState] = useState<{
    query: string;
    results: SmartMatchResult[];
    criteria: SmartCriterion[];
    mode: string;
  } | null>(null);

  const localMatch = useMemo(
    () => runSmartSearch(query, products, categories, language),
    [query, products, categories, language]
  );

  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed || !apiConnected) {
      setRemoteState(null);
      return;
    }
    let cancelled = false;
    const timer = window.setTimeout(async () => {
      try {
        const res = await apiClient.smartSelect(trimmed, language, 6);
        if (!cancelled) {
          setRemoteState({
            query: trimmed,
            results: res.results,
            criteria: res.criteria,
            mode: res.mode,
          });
        }
      } catch {
        // Ignore error and keep deterministic local results
      }
    }, 240);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [query, language, apiConnected]);

  const activeRemote = remoteState && remoteState.query === query.trim() ? remoteState : null;
  const results = activeRemote ? activeRemote.results : localMatch.results;
  const criteria = activeRemote ? activeRemote.criteria : localMatch.criteria;
  const matches = results.slice(0, 6);
  const prompts = SAMPLE_PROMPTS[language] || SAMPLE_PROMPTS.ru;

  const copy = {
    ru: {
      submit: 'Подобрать',
      clearAria: 'Очистить запрос',
      criteriaLabel: 'Распознанные параметры:',
      packLabel: 'Фасовка:',
      openCatalog: 'Открыть подборку в каталоге',
      empty: 'Подходящих позиций по этому запросу не найдено. Попробуйте «сыр для пиццы», «без лактозы», «высокий белок» или «масло 82.5».',
    },
    be: {
      submit: 'Падабраць',
      clearAria: 'Ачысціць запыт',
      criteriaLabel: 'Распазнаныя параметры:',
      packLabel: 'Фасоўка:',
      openCatalog: 'Адкрыць падборку ў каталогу',
      empty: 'Падыходзячых пазіцый не знойдзена. Паспрабуйце «сыр для піцы», «без лактозы» ці «масла 82.5».',
    },
    en: {
      submit: 'Match',
      clearAria: 'Clear query',
      criteriaLabel: 'Understood criteria:',
      packLabel: 'Pack:',
      openCatalog: 'Open results in catalog',
      empty: 'No exact match found. Try "pizza cheese", "lactose-free", "high protein", or "butter 82.5".',
    },
    zh: {
      submit: '智能匹配',
      clearAria: '清空输入',
      criteriaLabel: '识别条件:',
      packLabel: '推荐规格:',
      openCatalog: '在目录中查看全部结果',
      empty: '未找到匹配产品，请尝试“披萨奶酪”、“无乳糖”、“高蛋白”或“黄油 82.5”。',
    },
  }[language];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) {
      setQuery(prompts[0]);
    }
  };

  return (
    <section className="border border-slate-200 rounded-2xl bg-slate-50/80 p-4 sm:p-8 space-y-4 sm:space-y-5 min-w-0">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#0057B8]">
            <Sparkles className="w-4 h-4 shrink-0" />
            <span>{t('smartFinderTitle')}</span>
          </div>
          <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">
            {t('smartFinderSubtitle')}
          </p>
        </div>
        {activeRemote && (
          <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-white border border-slate-200 text-slate-500">
            {activeRemote.mode.toUpperCase()}
          </span>
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2.5 sm:gap-3">
        <div className="relative w-full sm:flex-1 sm:min-w-0">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('smartFinderPlaceholder')}
            aria-label={t('smartFinderTitle')}
            className="w-full h-11 pl-3.5 pr-10 text-base sm:text-sm bg-white border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0057B8] focus:ring-2 focus:ring-[#0057B8]/15 transition-all"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              aria-label={copy.clearAria}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <button
          type="submit"
          className="w-full sm:w-auto h-11 px-5 text-sm sm:text-xs font-semibold text-white bg-[#0057B8] rounded-xl hover:bg-[#004494] transition-colors whitespace-nowrap shrink-0"
        >
          {copy.submit}
        </button>
      </form>

      <div className="flex flex-nowrap sm:flex-wrap gap-2 overflow-x-auto no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 pb-1 sm:pb-0">
        {prompts.map((sample) => (
          <button
            key={sample}
            type="button"
            onClick={() => setQuery(sample)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all duration-200 whitespace-nowrap shrink-0 ${
              query === sample
                ? 'bg-[#0057B8] text-white border-[#0057B8] shadow-xs'
                : 'bg-white text-slate-700 border-slate-200 hover:border-[#0057B8]/50 hover:text-[#0057B8]'
            }`}
          >
            {sample}
          </button>
        ))}
      </div>

      {query.trim().length > 0 && (
        <div className="pt-1 sm:pt-2 space-y-4">
          {criteria.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs">
              <span className="text-slate-500 font-medium">{copy.criteriaLabel}</span>
              {criteria.map((c) => (
                <span
                  key={c.id}
                  className="px-2.5 py-0.5 rounded-md bg-blue-50 text-[#0057B8] border border-blue-200/70 font-medium"
                >
                  {c.label}
                </span>
              ))}
            </div>
          )}

          {matches.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {matches.map(({ product, reasons, recommendedPackage }) => (
                  <Link
                    key={product.id}
                    to={lp(`/product/${product.slug}`)}
                    className="group bg-white border border-slate-200 rounded-xl p-3.5 sm:p-4 flex items-start gap-3 sm:gap-4 hover:border-[#0057B8]/50 hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 min-w-0"
                  >
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg bg-slate-50 overflow-hidden shrink-0 border border-slate-100">
                      <ImageWithFallback
                        src={product.image}
                        alt={localize(product.name)}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="min-w-0 flex-1 space-y-1.5">
                      <div className="text-sm font-semibold text-slate-900 group-hover:text-[#0057B8] transition-colors leading-snug line-clamp-2">
                        {localize(product.name)}
                      </div>
                      <ul className="space-y-0.5">
                        {reasons.slice(0, 2).map((reason, idx) => (
                          <li
                            key={idx}
                            className="text-xs text-slate-600 flex items-start gap-1.5 leading-snug"
                          >
                            <Check className="w-3.5 h-3.5 text-[#0057B8] shrink-0 mt-0.5" />
                            <span className="min-w-0 break-words">{reason}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="pt-1 text-xs font-medium text-[#0057B8] flex items-center gap-1.5 flex-wrap tabular-nums">
                        {recommendedPackage ? (
                          <span className="inline-flex items-center gap-1 bg-blue-50 px-2 py-0.5 rounded text-[11px] max-w-full break-words">
                            <Package className="w-3 h-3 shrink-0" />
                            <span>
                              {copy.packLabel} {recommendedPackage.weight}
                            </span>
                          </span>
                        ) : (
                          <span>
                            {product.packages.map((p) => p.weight).slice(0, 2).join(' · ')}
                          </span>
                        )}
                        <ArrowRight className="w-3 h-3 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              <div className="flex justify-end">
                <Link
                  to={lp(`/catalog?q=${encodeURIComponent(query.trim())}`)}
                  className="group inline-flex items-center gap-1.5 py-1 text-xs font-semibold text-[#0057B8] hover:text-[#004494] transition-colors"
                >
                  <span>
                    {copy.openCatalog} ({results.length})
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
                </Link>
              </div>
            </>
          ) : (
            <p className="text-sm text-slate-600 bg-white border border-slate-200 rounded-lg p-4">
              {copy.empty}
            </p>
          )}
        </div>
      )}
    </section>
  );
};
EOF

cat <<'EOF' > src/components/B2BInquiryModal.tsx
import React, { useState, useEffect } from 'react';
import { X, CheckCircle2 } from 'lucide-react';
import { Product } from '../types';
import { useLanguage } from '../hooks/useLanguage';
import { apiClient } from '../utils/apiClient';

interface B2BInquiryModalProps {
  open: boolean;
  onClose: () => void;
  product?: Product;
  selectedPackageId?: string;
  defaultChannel?: 'export' | 'wholesale' | 'general';
}

export const B2BInquiryModal: React.FC<B2BInquiryModalProps> = ({
  open,
  onClose,
  product,
  selectedPackageId,
  defaultChannel = 'wholesale',
}) => {
  const { language, localize } = useLanguage();
  const [mounted, setMounted] = useState(open);
  const [closing, setClosing] = useState(false);

  const [company, setCompany] = useState('');
  const [contactName, setContactName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('');
  const [volume, setVolume] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [referenceId, setReferenceId] = useState<string | null>(null);

  const copy = {
    ru: {
      defaultCountry: 'Беларусь',
      defaultVolume: '1–5 тонн / партия',
      prefix: 'Запрос спецификации и коммерческого предложения:',
      err: 'Укажите название компании, контактное лицо и корректный e-mail.',
      titleExport: 'Запрос в отдел экспорта',
      titleSales: 'Связаться с отделом продаж B2B',
      sentTitle: 'Заявка зарегистрирована',
      sentDesc: (c: string, e: string) =>
        `Специалист отдела продаж свяжется с ${c} (${e}) в течение 1 рабочего дня.`,
      close: 'Закрыть',
      company: 'Компания *',
      companyPlaceholder: 'ООО «Партнёр Трейд»',
      contact: 'Контактное лицо *',
      phone: 'Телефон',
      country: 'Страна поставки',
      volume: 'Плановый объём',
      message: 'Комментарий к запросу',
      cancel: 'Отмена',
      submit: 'Отправить запрос',
      sending: 'Отправка…',
    },
    be: {
      defaultCountry: 'Беларусь',
      defaultVolume: '1–5 тон / партыя',
      prefix: 'Запыт спецыфікацыі і камерцыйнай прапановы:',
      err: 'Укажыце назву кампаніі, кантактную асобу і карэктны e-mail.',
      titleExport: 'Запыт у аддзел экспарту',
      titleSales: 'Звязацца з аддзелам продажаў B2B',
      sentTitle: 'Заяўка зарэгістравана',
      sentDesc: (c: string, e: string) =>
        `Спецыяліст аддзела продажаў звяжацца з ${c} (${e}) на працягу 1 працоўнага дня.`,
      close: 'Закрыць',
      company: 'Кампанія *',
      companyPlaceholder: 'ТАА «Партнёр Трэйд»',
      contact: 'Кантактная асоба *',
      phone: 'Тэлефон',
      country: 'Краіна пастаўкі',
      volume: 'Планавы аб’ём',
      message: 'Каментарый да запыту',
      cancel: 'Адмена',
      submit: 'Адправіць запыт',
      sending: 'Адпраўка…',
    },
    en: {
      defaultCountry: 'Belarus / Export',
      defaultVolume: '1–5 tons / shipment',
      prefix: 'Commercial quote & spec request:',
      err: 'Please provide company name, contact person, and a valid email.',
      titleExport: 'Export Department Inquiry',
      titleSales: 'B2B Sales Department Inquiry',
      sentTitle: 'Inquiry Submitted',
      sentDesc: (c: string, e: string) =>
        `Our sales specialist will reply to ${c} (${e}) within 1 business day.`,
      close: 'Close',
      company: 'Company *',
      companyPlaceholder: 'Partner Trade LLC',
      contact: 'Contact Person *',
      phone: 'Phone',
      country: 'Destination Country',
      volume: 'Estimated Volume',
      message: 'Message',
      cancel: 'Cancel',
      submit: 'Submit Inquiry',
      sending: 'Sending…',
    },
    zh: {
      defaultCountry: '中国 / 出口目的地',
      defaultVolume: '1–5 吨 / 批次',
      prefix: '产品规格与商业报价咨询:',
      err: '请填写公司名称、联系人及有效的电子邮箱。',
      titleExport: '国际出口部门咨询',
      titleSales: '联系 B2B 销售部门',
      sentTitle: '您的询盘已成功提交',
      sentDesc: (c: string, e: string) =>
        `我们的外贸及销售专员将在 1 个工作日内联系 ${c} (${e})。`,
      close: '关闭',
      company: '公司名称 *',
      companyPlaceholder: '某某国际贸易有限公司',
      contact: '联系人 *',
      phone: '联系电话',
      country: '目的国/地区',
      volume: '预计采购量',
      message: '咨询详情',
      cancel: '取消',
      submit: '提交咨询',
      sending: '提交中…',
    },
  }[language];

  useEffect(() => {
    if (open) {
      setMounted(true);
      setClosing(false);
      return;
    }

    if (mounted) {
      setClosing(true);
      const timer = window.setTimeout(() => {
        setMounted(false);
        setClosing(false);
      }, 180);
      return () => window.clearTimeout(timer);
    }
  }, [open, mounted]);

  useEffect(() => {
    if (!open) return;
    setSubmitted(false);
    setReferenceId(null);
    setError('');
    setCountry((prev) => prev || copy.defaultCountry);
    setVolume((prev) => prev || copy.defaultVolume);

    if (product) {
      const pkg = product.packages.find((p) => p.id === selectedPackageId) || product.packages[0];
      setMessage(`${copy.prefix} ${localize(product.name)} (${pkg?.weight || ''})`);
    } else {
      setMessage('');
    }
  }, [open, product, selectedPackageId, language, localize, copy.defaultCountry, copy.defaultVolume, copy.prefix]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  if (!mounted) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!company.trim() || !contactName.trim() || !email.includes('@')) {
      setError(copy.err);
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      const saved = await apiClient.submitB2BInquiry({
        company: company.trim(),
        contactName: contactName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        country: country.trim(),
        productId: product?.id ?? null,
        packageId: selectedPackageId ?? product?.packages[0]?.id ?? null,
        volume: volume.trim(),
        message: message.trim(),
        channel: defaultChannel,
        language,
      });
      setReferenceId(saved.id || null);
    } catch {
      // Allow UI confirmation even in standalone static mode
    } finally {
      setSubmitting(false);
      setSubmitted(true);
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/55 backdrop-blur-xs ${
        closing ? 'modal-backdrop-out pointer-events-none' : 'modal-backdrop-in'
      }`}
      role="dialog"
      aria-modal="true"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className={`bg-white border border-slate-200 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl ${
          closing ? 'modal-panel-out' : 'modal-panel-in'
        }`}
      >
        <div className="px-5 sm:px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="font-display text-lg font-semibold text-slate-900">
              {defaultChannel === 'export' ? copy.titleExport : copy.titleSales}
            </h2>
            <p className="text-xs text-slate-500">export@milk.by · sales@milk.by</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 sm:p-6">
          {submitted ? (
            <div className="py-6 text-center space-y-4">
              <CheckCircle2 className="w-12 h-12 text-[#0057B8] mx-auto" strokeWidth={1.5} />
              <div className="space-y-1">
                <h3 className="font-display text-lg font-semibold text-slate-900">
                  {copy.sentTitle}
                </h3>
                <p className="text-sm text-slate-600">{copy.sentDesc(company, email)}</p>
                {referenceId && (
                  <p className="text-xs font-mono text-slate-400 pt-1">ID: {referenceId.slice(0, 8)}</p>
                )}
              </div>
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 text-sm font-semibold text-white bg-[#0057B8] rounded-lg hover:bg-[#004494] transition-colors"
              >
                {copy.close}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 text-xs font-medium text-red-700 bg-red-50 border border-red-200 rounded-lg">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    {copy.company}
                  </label>
                  <input
                    type="text"
                    required
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder={copy.companyPlaceholder}
                    className="w-full h-10 px-3 text-base sm:text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-[#0057B8]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    {copy.contact}
                  </label>
                  <input
                    type="text"
                    required
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    className="w-full h-10 px-3 text-base sm:text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-[#0057B8]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">E-mail *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="buyer@company.com"
                    className="w-full h-10 px-3 text-base sm:text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-[#0057B8]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    {copy.phone}
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+375 ..."
                    className="w-full h-10 px-3 text-base sm:text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-[#0057B8]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    {copy.country}
                  </label>
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full h-10 px-3 text-base sm:text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-[#0057B8]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    {copy.volume}
                  </label>
                  <input
                    type="text"
                    value={volume}
                    onChange={(e) => setVolume(e.target.value)}
                    className="w-full h-10 px-3 text-base sm:text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-[#0057B8]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  {copy.message}
                </label>
                <textarea
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full p-3 text-base sm:text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-[#0057B8]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
                >
                  {copy.cancel}
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 text-sm font-semibold text-white bg-[#0057B8] rounded-lg hover:bg-[#004494] disabled:opacity-60 transition-colors"
                >
                  {submitting ? copy.sending : copy.submit}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
EOF

cat <<'EOF' > src/components/home/HomeHeroSection.tsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useLanguage, useLocalizedPath } from '../../hooks/useLanguage';
import { ASSETS } from '../../data/assets';
import { ImageWithFallback } from '../ImageWithFallback';
import { SearchBar } from '../SearchBar';

export const HomeHeroSection: React.FC = () => {
  const { t } = useLanguage();
  const lp = useLocalizedPath();
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  return (
    <section className="relative z-20">
      <div className="relative min-h-[470px] sm:min-h-[540px] lg:min-h-[600px] flex items-center justify-center bg-neutral-900">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <ImageWithFallback
            src={ASSETS.heroDairyShowcase}
            alt={t('brandName')}
            className="w-full h-full object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-neutral-950/65" />

          <div
            aria-hidden="true"
            className="absolute inset-0 backdrop-blur-[12px]"
            style={{
              maskImage:
                'radial-gradient(ellipse clamp(230px, 40%, 540px) clamp(170px, 44%, 250px) at 50% 45%, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0.78) 50%, rgba(0, 0, 0, 0) 100%)',
              WebkitMaskImage:
                'radial-gradient(ellipse clamp(230px, 40%, 540px) clamp(170px, 44%, 250px) at 50% 45%, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0.78) 50%, rgba(0, 0, 0, 0) 100%)',
            }}
          />

          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse clamp(220px, 38%, 520px) clamp(160px, 42%, 240px) at 50% 45%, rgba(10, 15, 28, 0.38) 0%, rgba(10, 15, 28, 0.18) 50%, rgba(10, 15, 28, 0) 100%)',
            }}
          />
        </div>

        <div className="relative z-20 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12 sm:pt-32 sm:pb-20 lg:pt-36 lg:pb-24 text-center space-y-6 sm:space-y-7">
          <div className="space-y-3 sm:space-y-4">
            <h1 className="font-display text-3xl sm:text-5xl lg:text-[3.25rem] font-bold text-white tracking-tight leading-[1.12] drop-shadow-[0_2px_14px_rgba(0,0,0,0.35)]">
              {t('heroTitle')}
            </h1>
            <p className="text-sm sm:text-lg text-white/95 max-w-2xl mx-auto leading-relaxed drop-shadow-[0_1px_10px_rgba(0,0,0,0.45)]">
              {t('heroSubtitle')}
            </p>
          </div>

          <div className="max-w-xl mx-auto text-left">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              onSubmitSearch={(q) =>
                navigate(q ? lp(`/catalog?q=${encodeURIComponent(q)}`) : lp('/catalog'))
              }
            />
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-3.5 pt-1">
            <Link
              to={lp('/catalog')}
              className="group inline-flex items-center gap-2 px-5 sm:px-6 py-3 text-sm font-semibold text-white bg-[#0057B8] rounded-xl hover:bg-[#004494] hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200 whitespace-nowrap shrink-0"
            >
              <span>{t('heroPrimaryCta')}</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
            <Link
              to={lp('/export')}
              className="inline-flex items-center gap-2 px-5 sm:px-6 py-3 text-sm font-semibold text-slate-900 bg-white/95 rounded-xl hover:bg-white hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200 whitespace-nowrap shrink-0"
            >
              <span>{t('heroSecondaryCta')}</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
EOF

cat <<'EOF' > src/components/home/HomeAboutSection.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import { useLanguage, useLocalizedPath } from '../../hooks/useLanguage';
import { ImageWithFallback } from '../ImageWithFallback';

interface HomeAboutSectionProps {
  imageSrc: string;
}

export const HomeAboutSection: React.FC<HomeAboutSectionProps> = ({ imageSrc }) => {
  const { language, t } = useLanguage();
  const lp = useLocalizedPath();

  const copy = {
    ru: {
      eyebrow: 'О предприятии',
      title: 'ОАО «Молочный Мир» — эталон белорусского молочного качества',
      p1: 'С 1938 года предприятие объединяет традиции сыроделия, строгий лабораторный контроль сырого молока и автоматизированные линии переработки. Ежедневно на производственных площадках выпускаются цельномолочная продукция, сыры, масло, йогурты, творог и мороженое для розницы и сегмента HoReCa.',
      p2: 'Собственный логистический комплекс на 4 200 паллетомест с непрерывным контролем холодовой цепи и международная сертификация FSSC 22000 / ISO 9001 позволяют гарантировать стабильные экспортные отгрузки более чем в 25 стран мира.',
      ctaAbout: 'Подробнее о компании',
      ctaExport: 'Экспортные возможности',
      badge: 'FSSC 22000 · ISO 9001 · HACCP',
      stats: [
        { value: '142+', label: 'Позиций в каталоге' },
        { value: '25+', label: 'Стран экспорта' },
        { value: '4 200', label: 'Паллетомест холодовой цепи' },
      ],
    },
    be: {
      eyebrow: 'Пра прадпрыемства',
      title: 'ААТ «Малочны Мір» — эталон беларускай малочнай якасці',
      p1: 'З 1938 года прадпрыемства аб’ядноўвае традыцыі сыраробства, строгі лабараторны кантроль сыравіны і аўтаматызаваныя лініі перапрацоўкі. Штодня выпускаецца прадукцыя для розніцы, гандлёвых сетак і сегмента HoReCa.',
      p2: 'Уласны лагістычны комплекс на 4 200 палетамесцаў з кантролем халадовага ланцуга і міжнародная сертыфікацыя FSSC 22000 / ISO 9001 забяспечваюць стабільныя экспартныя пастаўкі больш чым у 25 краін свету.',
      ctaAbout: 'Падрабязней пра кампанію',
      ctaExport: 'Экспартныя магчымасці',
      badge: 'FSSC 22000 · ISO 9001 · HACCP',
      stats: [
        { value: '142+', label: 'Пазіцый у каталогу' },
        { value: '25+', label: 'Краін экспарту' },
        { value: '4 200', label: 'Палетамесцаў халадовага ланцуга' },
      ],
    },
    en: {
      eyebrow: 'Enterprise Profile',
      title: 'OJSC "Molochny Mir" — Benchmark of Belarusian Dairy Craft',
      p1: 'Operating since 1938, the enterprise combines artisan cheesemaking heritage with accredited in-house laboratories and automated processing lines. Our daily output serves national retail chains, foodservice operators, and industrial B2B buyers.',
      p2: 'An automated 4,200-pallet cold-chain hub together with FSSC 22000 and ISO 9001 certifications ensures traceable raw milk quality and reliable export deliveries across more than 25 countries.',
      ctaAbout: 'About the Company',
      ctaExport: 'Export Capabilities',
      badge: 'FSSC 22000 · ISO 9001 · HACCP',
      stats: [
        { value: '142+', label: 'Catalog SKUs' },
        { value: '25+', label: 'Export countries' },
        { value: '4 200', label: 'Cold-chain pallet slots' },
      ],
    },
    zh: {
      eyebrow: '企业概况',
      title: 'Molochny Mir 股份公司 — 白俄罗斯乳制品品质标杆',
      p1: '企业始建于 1938 年，将传统奶酪制作工艺与现代化全自动加工生产线及实验室质控体系相结合，每日为零售商超、餐饮渠道 (HoReCa) 及工业客户提供多元化乳制品。',
      p2: '配备 4,200 个温控托盘位的自动化冷链物流中心，以及 FSSC 22000 与 ISO 9001 国际认证体系，确保产品稳定出口至全球 25 个以上国家和地区。',
      ctaAbout: '了解企业详情',
      ctaExport: '国际出口业务',
      badge: 'FSSC 22000 · ISO 9001 · HACCP',
      stats: [
        { value: '142+', label: '目录产品规格' },
        { value: '25+', label: '出口合作国家' },
        { value: '4 200', label: '冷链托盘库位' },
      ],
    },
  }[language];

  return (
    <section id="about" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-16 items-center">
        <div className="lg:col-span-6 space-y-5 sm:space-y-6 min-w-0">
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#0057B8]">
              {copy.eyebrow}
            </p>
            <h2 className="font-display text-2xl sm:text-4xl font-bold text-slate-900 tracking-tight leading-tight">
              {copy.title}
            </h2>
          </div>

          <div className="space-y-4 text-sm sm:text-base text-slate-600 leading-relaxed">
            <p>{copy.p1}</p>
            <p>{copy.p2}</p>
          </div>

          <div className="grid grid-cols-3 gap-2.5 sm:gap-4 pt-3 border-t border-slate-200">
            {copy.stats.map((stat) => (
              <div key={stat.value} className="space-y-1 min-w-0">
                <div className="font-display text-lg sm:text-2xl font-bold text-slate-900 tabular-nums">
                  {stat.value}
                </div>
                <div className="text-[11px] sm:text-xs text-slate-500 leading-snug">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <Link
              to={lp('/about')}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-[#0057B8] rounded-lg hover:bg-[#004494] transition-colors"
            >
              <span>{copy.ctaAbout}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to={lp('/export')}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-slate-800 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
            >
              <span>{copy.ctaExport}</span>
            </Link>
          </div>
        </div>

        <div className="lg:col-span-6">
          <div className="relative h-[240px] sm:h-[440px] lg:h-[560px] rounded-2xl overflow-hidden border border-slate-200 bg-slate-50">
            <ImageWithFallback
              src={imageSrc}
              alt={t('brandName')}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-auto inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-white/95 backdrop-blur-xs border border-slate-200 text-xs font-semibold text-slate-800 shadow-xs">
              <ShieldCheck className="w-4 h-4 text-[#0057B8] shrink-0" />
              <span className="truncate">{copy.badge}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
EOF

# Patch HomeTeamSlider.tsx and HomeLocationsSection.tsx to use useLocalizedPath() for /contacts links
python3 - <<'PY'
from pathlib import Path

for file_path in ("src/components/home/HomeTeamSlider.tsx", "src/components/home/HomeLocationsSection.tsx"):
    p = Path(file_path)
    text = p.read_text(encoding="utf-8")
    text = text.replace(
        "import { useLanguage } from '../../hooks/useLanguage';",
        "import { useLanguage, useLocalizedPath } from '../../hooks/useLanguage';",
    )
    text = text.replace(
        "const { language",
        "const lp = useLocalizedPath();\n  const { language",
        1,
    )
    text = text.replace('to="/contacts"', 'to={lp("/contacts")}')
    p.write_text(text, encoding="utf-8")
PY

cat <<'EOF' > src/pages/Home.tsx
import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShoppingBag, Store, Globe2, Newspaper } from 'lucide-react';
import { useLanguage, useLocalizedPath } from '../hooks/useLanguage';
import { useCatalogStore } from '../hooks/useCatalogStore';
import { ASSETS } from '../data/assets';
import { NEWS_CATEGORY_LABELS } from '../data/news';
import { SeoHead } from '../components/SeoHead';
import { ImageWithFallback } from '../components/ImageWithFallback';
import { ProductGrid } from '../components/ProductGrid';
import { SmartFinder } from '../components/SmartFinder';
import { B2BInquiryModal } from '../components/B2BInquiryModal';
import { HomeHeroSection } from '../components/home/HomeHeroSection';
import { HomeAboutSection } from '../components/home/HomeAboutSection';
import { HomeTeamSlider } from '../components/home/HomeTeamSlider';
import { HomeLocationsSection } from '../components/home/HomeLocationsSection';

export const Home: React.FC = () => {
  const { t, language, localize } = useLanguage();
  const lp = useLocalizedPath();
  const { products, categories, news } = useCatalogStore();
  const [activeCategoryId, setActiveCategoryId] = useState<string>('all');
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const [inquiryChannel, setInquiryChannel] = useState<'export' | 'wholesale' | 'general'>(
    'wholesale'
  );

  const visibleProducts = useMemo(
    () => products.filter((p) => p.visible),
    [products]
  );

  const displayedProducts = useMemo(() => {
    if (activeCategoryId === 'all') {
      return visibleProducts.filter((p) => p.featured).slice(0, 6);
    }
    return visibleProducts.filter((p) => p.category === activeCategoryId).slice(0, 6);
  }, [visibleProducts, activeCategoryId]);

  const activeCategory = categories.find((c) => c.id === activeCategoryId);
  const latestNews = news.filter((n) => n.published).slice(0, 3);
  const aboutImageSrc = latestNews[0]?.image || ASSETS.heroDairyShowcase;

  const seoTitle =
    language === 'ru'
      ? 'ОАО «Молочный Мир» (milk.by) — Натуральные сыры, молоко и экспорт'
      : language === 'be'
      ? 'ААТ «Малочны Мір» (milk.by) — Натуральныя сыры, малако і экспарт'
      : language === 'zh'
      ? 'Molochny Mir (milk.by) — 乳制品目录、国际出口与B2B合作'
      : 'Molochny Mir (milk.by) — Dairy Catalog, Export & B2B Portal';

  const seoDesc = t('heroSubtitle');

  const allTabLabel =
    language === 'ru'
      ? 'Хиты ассортимента'
      : language === 'be'
      ? 'Хіты асартыменту'
      : language === 'zh'
      ? '精选热销'
      : 'Top Highlights';

  const openCategoryText = activeCategory
    ? `${t('allProductsLink')}: ${localize(activeCategory.name)}`
    : t('allProductsLink');

  const handleOpenInquiry = (channel: 'export' | 'wholesale' | 'general') => {
    setInquiryChannel(channel);
    setInquiryOpen(true);
  };

  const audienceRoutes = [
    {
      to: '/catalog',
      icon: ShoppingBag,
      title: t('roleConsumerTitle'),
      desc: t('roleConsumerDesc'),
    },
    {
      to: '/partners',
      icon: Store,
      title: t('roleB2BTitle'),
      desc: t('roleB2BDesc'),
    },
    {
      to: '/export',
      icon: Globe2,
      title: t('roleExportTitle'),
      desc: t('roleExportDesc'),
    },
    {
      to: '/news',
      icon: Newspaper,
      title: t('roleMediaTitle'),
      desc: t('roleMediaDesc'),
    },
  ];

  return (
    <div className="space-y-12 sm:space-y-20">
      <SeoHead title={seoTitle} description={seoDesc} canonicalPath="/" />

      {/* 1. Full-bleed Hero + Live Smart Search */}
      <HomeHeroSection />

      {/* Mandatory Quick-Entry Routing for 4 Key Audiences */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-4 sm:-mt-10 relative z-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {audienceRoutes.map((route) => {
            const Icon = route.icon;
            return (
              <Link
                key={route.to}
                to={lp(route.to)}
                className="group bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-sm hover:border-[#0057B8]/50 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex items-start gap-3.5"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0057B8] flex items-center justify-center shrink-0 group-hover:bg-[#0057B8] group-hover:text-white transition-colors">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-display text-sm font-bold text-slate-900 group-hover:text-[#0057B8] transition-colors flex items-center justify-between gap-2">
                    <span className="truncate">{route.title}</span>
                    <ArrowRight className="w-3.5 h-3.5 shrink-0 opacity-60 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                  <p className="text-xs text-slate-500 mt-1 leading-snug line-clamp-2">
                    {route.desc}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 2. Immediate Product Showcase + Interactive Category Filter Tabs + Smart Finder */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5 sm:space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-4 border-b border-slate-200 pb-4">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900">
            {t('featuredHeading')}
          </h2>
          <Link
            to={activeCategory ? lp(`/catalog/${activeCategory.slug}`) : lp('/catalog')}
            className="group inline-flex items-center gap-1.5 text-sm font-semibold text-[#0057B8] hover:text-[#004494] transition-colors whitespace-nowrap shrink-0 self-start sm:self-auto"
          >
            <span>{openCategoryText}</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="flex flex-nowrap sm:flex-wrap gap-2 overflow-x-auto no-scrollbar -mx-4 px-4 scroll-px-4 sm:mx-0 sm:px-0 sm:scroll-px-0 pb-1 sm:pb-0">
          <button
            type="button"
            onClick={() => setActiveCategoryId('all')}
            className={`px-3.5 py-2 text-xs font-medium rounded-lg border transition-all duration-200 whitespace-nowrap shrink-0 ${
              activeCategoryId === 'all'
                ? 'bg-[#0057B8] text-white border-[#0057B8] shadow-xs'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-[#0057B8]/50 hover:text-[#0057B8]'
            }`}
          >
            {allTabLabel}
          </button>
          {categories.map((cat) => {
            const active = activeCategoryId === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategoryId(cat.id)}
                className={`px-3.5 py-2 text-xs font-medium rounded-lg border transition-all duration-200 whitespace-nowrap shrink-0 ${
                  active
                    ? 'bg-[#0057B8] text-white border-[#0057B8] shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-[#0057B8]/50 hover:text-[#0057B8]'
                }`}
              >
                {localize(cat.name)}
              </button>
            );
          })}
        </div>

        <ProductGrid
          products={displayedProducts}
          mobileCarousel
          scrollResetKey={activeCategoryId}
        />

        <SmartFinder />
      </section>

      {/* 3. Enterprise Story & Production Metrics */}
      <HomeAboutSection imageSrc={aboutImageSrc} />

      {/* 4. Interactive B2B, Quality & Export Specialists Slider */}
      <HomeTeamSlider onRequestContact={handleOpenInquiry} />

      {/* 5. Interactive Production Sites & Cold-Chain Map Tabs */}
      <HomeLocationsSection />

      {/* 6. Latest Newsroom */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-end justify-between border-b border-slate-200 pb-4">
          <h2 className="font-display text-2xl font-bold text-slate-900">{t('navNews')}</h2>
          <Link
            to={lp('/news')}
            className="group inline-flex items-center gap-1.5 text-sm font-semibold text-[#0057B8] hover:text-[#004494] transition-colors whitespace-nowrap shrink-0"
          >
            <span>
              {language === 'ru'
                ? 'Все новости'
                : language === 'be'
                ? 'Усе навіны'
                : language === 'zh'
                ? '全部新闻'
                : 'All news'}
            </span>
            <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {latestNews.map((item) => (
            <Link
              key={item.id}
              to={lp(`/news/${item.slug}`)}
              className="group bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col hover:border-[#0057B8]/40 hover:-translate-y-1 hover:shadow-lg transition-all duration-200 ease-out"
            >
              <div className="aspect-[16/10] bg-slate-50 overflow-hidden border-b border-slate-100">
                <ImageWithFallback
                  src={item.image}
                  alt={localize(item.title)}
                  className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-300 ease-out"
                />
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs text-slate-500 tabular-nums">
                    <span className="font-mono">{item.date}</span>
                    <span className="px-2 py-0.5 rounded-md bg-blue-50 text-[#0057B8] font-medium">
                      {localize(NEWS_CATEGORY_LABELS[item.categoryId])}
                    </span>
                  </div>
                  <h3 className="font-display text-base font-semibold text-slate-900 group-hover:text-[#0057B8] transition-colors leading-snug">
                    {localize(item.title)}
                  </h3>
                  <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed">
                    {localize(item.excerpt)}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <B2BInquiryModal
        open={inquiryOpen}
        onClose={() => setInquiryOpen(false)}
        defaultChannel={inquiryChannel}
      />
    </div>
  );
};
EOF

cat <<'EOF' > src/pages/Catalog.tsx
import React, { useMemo, useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { useLanguage, useLocalizedPath } from '../hooks/useLanguage';
import { useCatalogStore } from '../hooks/useCatalogStore';
import { SeoHead } from '../components/SeoHead';
import { SearchBar } from '../components/SearchBar';
import { Filters, CatalogFilterState } from '../components/Filters';
import { ProductGrid } from '../components/ProductGrid';
import { SmartFinder } from '../components/SmartFinder';
import { runSmartSearch } from '../utils/smartMatch';

interface CatalogProps {
  initialCategorySlug?: string;
}

const DEFAULT_FILTERS: CatalogFilterState = {
  categoryId: 'all',
  subcategoryId: 'all',
  fatRange: 'all',
  weightRange: 'all',
  shelfLifeRange: 'all',
  proteinMin: 'all',
  lactoseFreeOnly: false,
  highProteinOnly: false,
  exportReadyOnly: false,
  characteristics: {},
  sortBy: 'featured',
};

function parseShelfLifeDays(text: string): number {
  const nums = text.match(/\d+/g);
  if (!nums || nums.length === 0) return 0;
  const val = parseInt(nums[0], 10);
  if (!Number.isFinite(val)) return 0;
  if (/месяц|month|月/i.test(text)) return val * 30;
  return val;
}

export const Catalog: React.FC<CatalogProps> = ({ initialCategorySlug }) => {
  const { language, localize, t } = useLanguage();
  const lp = useLocalizedPath();
  const { products, categories } = useCatalogStore();
  const [searchParams, setSearchParams] = useSearchParams();

  const resolvedCategoryId = useMemo(() => {
    if (!initialCategorySlug) return 'all';
    const found = categories.find(
      (c) => c.slug === initialCategorySlug || c.id === initialCategorySlug
    );
    return found ? found.id : initialCategorySlug;
  }, [categories, initialCategorySlug]);

  const [query, setQuery] = useState(() => searchParams.get('q') || '');
  const [filterState, setFilterState] = useState<CatalogFilterState>(() => ({
    ...DEFAULT_FILTERS,
    categoryId: resolvedCategoryId,
  }));

  useEffect(() => {
    setQuery(searchParams.get('q') || '');
  }, [searchParams]);

  useEffect(() => {
    setFilterState((prev) => ({
      ...prev,
      categoryId: resolvedCategoryId,
      subcategoryId: 'all',
      characteristics: {},
    }));
  }, [resolvedCategoryId]);

  const activeCategory = categories.find((c) => c.id === filterState.categoryId);

  const smartSearch = useMemo(() => {
    const trimmed = query.trim();
    if (!trimmed) return null;
    return runSmartSearch(trimmed, products, categories, language);
  }, [query, products, categories, language]);

  const filteredProducts = useMemo(() => {
    const scoreMap = smartSearch
      ? new Map(smartSearch.results.map((r) => [r.product.id, r.score]))
      : null;

    const list = products
      .filter((p) => p.visible)
      .filter((p) => {
        if (scoreMap && !scoreMap.has(p.id)) return false;

        if (filterState.categoryId !== 'all' && p.category !== filterState.categoryId) {
          return false;
        }
        if (filterState.subcategoryId !== 'all' && p.subcategory !== filterState.subcategoryId) {
          return false;
        }
        if (filterState.fatRange !== 'all') {
          const fat = p.fatContent ?? 0;
          if (filterState.fatRange === 'low' && fat > 5) return false;
          if (filterState.fatRange === 'medium' && (fat < 15 || fat > 35)) return false;
          if (filterState.fatRange === 'high' && fat < 45) return false;
        }
        if (filterState.weightRange !== 'all') {
          const matchesWeight = p.packages.some((pkg) => {
            if (filterState.weightRange === 'retail') return pkg.weightGrams <= 250;
            if (filterState.weightRange === 'medium')
              return pkg.weightGrams > 250 && pkg.weightGrams <= 1000;
            return pkg.weightGrams > 1000;
          });
          if (!matchesWeight) return false;
        }
        if (filterState.shelfLifeRange !== 'all') {
          const matchesShelf = p.packages.some((pkg) => {
            const days = parseShelfLifeDays(pkg.shelfLife.ru || pkg.shelfLife.en || '');
            if (filterState.shelfLifeRange === 'fresh') return days > 0 && days <= 21;
            if (filterState.shelfLifeRange === 'medium') return days > 21 && days <= 90;
            return days > 90;
          });
          if (!matchesShelf) return false;
        }
        if (filterState.proteinMin !== 'all') {
          const min = Number(filterState.proteinMin);
          if ((p.proteinContent ?? 0) < min) return false;
        }
        if (filterState.lactoseFreeOnly && !p.lactoseFree) return false;
        if (filterState.highProteinOnly && (p.proteinContent ?? 0) < 8) return false;
        if (filterState.exportReadyOnly && !p.exportReady) return false;

        for (const [charKey, selectedVal] of Object.entries(filterState.characteristics)) {
          if (!selectedVal || selectedVal === 'all') continue;
          const prodVal = localize(p.characteristics[charKey]);
          if (prodVal !== selectedVal) return false;
        }

        return true;
      });

    const sorted = [...list];
    sorted.sort((a, b) => {
      if (scoreMap && filterState.sortBy === 'featured') {
        return (scoreMap.get(b.id) ?? 0) - (scoreMap.get(a.id) ?? 0);
      }
      if (filterState.sortBy === 'fat-asc') return (a.fatContent ?? 0) - (b.fatContent ?? 0);
      if (filterState.sortBy === 'fat-desc') return (b.fatContent ?? 0) - (a.fatContent ?? 0);
      if (filterState.sortBy === 'protein-desc')
        return (b.proteinContent ?? 0) - (a.proteinContent ?? 0);
      if (filterState.sortBy === 'name')
        return localize(a.name).localeCompare(localize(b.name), language);
      return Number(Boolean(b.featured)) - Number(Boolean(a.featured));
    });

    return sorted;
  }, [products, smartSearch, filterState, localize, language]);

  const handleReset = () => {
    setQuery('');
    if (searchParams.has('q')) {
      setSearchParams({}, { replace: true });
    }
    setFilterState({
      ...DEFAULT_FILTERS,
      categoryId: resolvedCategoryId,
    });
  };

  const pageH1 = activeCategory ? localize(activeCategory.name) : t('navCatalog');

  const pageDesc = activeCategory
    ? localize(activeCategory.description)
    : {
        ru: 'Полный ассортимент молочной продукции ОАО «Молочный Мир»: фильтрация по категориям, жирности, фасовке, сроку годности, белку и характеристикам.',
        be: 'Поўны асартымент малочнай прадукцыі ААТ «Малочны Мір»: фільтрацыя па катэгорыях, тлустасці, фасоўцы, тэрміну прыдатнасці і бялку.',
        en: 'Complete dairy catalog with dynamic filtering by category, fat content, pack weight, shelf life, protein, and technical attributes.',
        zh: 'Molochny Mir 乳制品完整目录：按品类、乳脂含量、包装规格、保质期、蛋白质与技术参数精准筛选。',
      }[language];

  const seoTitle = activeCategory
    ? localize(activeCategory.seo.title)
    : `${t('navCatalog')} — ${t('brandName')} (milk.by)`;

  const seoDesc = activeCategory ? localize(activeCategory.seo.description) : pageDesc;

  const smartBannerLabel = {
    ru: 'Умный поиск распознал:',
    be: 'Разумны пошук распазнаў:',
    en: 'Smart search matched:',
    zh: '智能搜索已识别:',
  }[language];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
      <SeoHead
        title={seoTitle}
        description={seoDesc}
        canonicalPath={activeCategory ? `/catalog/${activeCategory.slug}` : '/catalog'}
      />

      <div className="space-y-3">
        <nav className="text-xs text-slate-500 flex items-center gap-2" aria-label="Breadcrumb">
          <Link to={lp('/')} className="hover:text-[#0057B8]">
            {language === 'ru'
              ? 'Главная'
              : language === 'be'
              ? 'Галоўная'
              : language === 'zh'
              ? '首页'
              : 'Home'}
          </Link>
          <span aria-hidden="true">/</span>
          {activeCategory ? (
            <>
              <Link to={lp('/catalog')} className="hover:text-[#0057B8]">
                {t('navCatalog')}
              </Link>
              <span aria-hidden="true">/</span>
              <span className="text-slate-900 font-medium">{localize(activeCategory.name)}</span>
            </>
          ) : (
            <span className="text-slate-900 font-medium">{t('navCatalog')}</span>
          )}
        </nav>

        <h1 className="font-display text-3xl sm:text-4xl font-bold text-slate-900">{pageH1}</h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-3xl">{pageDesc}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        <Link
          to={lp('/catalog')}
          className={`px-3.5 py-2 text-xs font-medium rounded-lg border transition-all duration-200 ${
            !activeCategory
              ? 'bg-[#0057B8] text-white border-[#0057B8]'
              : 'bg-white text-slate-700 border-slate-200 hover:border-[#0057B8]/50 hover:text-[#0057B8]'
          }`}
        >
          {language === 'ru'
            ? 'Все'
            : language === 'be'
            ? 'Усе'
            : language === 'zh'
            ? '全部'
            : 'All'}
        </Link>
        {categories.map((cat) => {
          const active = activeCategory?.id === cat.id;
          return (
            <Link
              key={cat.id}
              to={lp(`/catalog/${cat.slug}`)}
              className={`px-3.5 py-2 text-xs font-medium rounded-lg border transition-all duration-200 ${
                active
                  ? 'bg-[#0057B8] text-white border-[#0057B8]'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-[#0057B8]/50 hover:text-[#0057B8]'
              }`}
            >
              {localize(cat.name)}
            </Link>
          );
        })}
      </div>

      <SearchBar
        value={query}
        onChange={setQuery}
        onSubmitSearch={(val) => {
          setQuery(val);
          if (val) {
            setSearchParams({ q: val }, { replace: true });
          } else {
            setSearchParams({}, { replace: true });
          }
        }}
      />

      {smartSearch && smartSearch.criteria.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 text-xs bg-blue-50/70 border border-blue-200/70 rounded-xl px-4 py-2.5">
          <span className="inline-flex items-center gap-1.5 font-semibold text-[#0057B8]">
            <Sparkles className="w-3.5 h-3.5 shrink-0" />
            {smartBannerLabel}
          </span>
          {smartSearch.criteria.map((c) => (
            <span
              key={c.id}
              className="px-2.5 py-0.5 rounded-md bg-white border border-blue-200 text-slate-800 font-medium"
            >
              {c.label}
            </span>
          ))}
        </div>
      )}

      <Filters
        categories={categories}
        products={products}
        state={filterState}
        onChange={setFilterState}
        onReset={handleReset}
        totalCount={filteredProducts.length}
      />

      <ProductGrid products={filteredProducts} onResetFilters={handleReset} />

      <div className="pt-4">
        <SmartFinder />
      </div>
    </div>
  );
};
EOF

cat <<'EOF' > src/pages/Product.tsx
import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Download, MessageSquare, Package, Thermometer, Clock, Layers } from 'lucide-react';
import { useLanguage, useLocalizedPath } from '../hooks/useLanguage';
import { useCatalogStore } from '../hooks/useCatalogStore';
import { SeoHead } from '../components/SeoHead';
import { ImageWithFallback } from '../components/ImageWithFallback';
import { ProductGrid } from '../components/ProductGrid';
import { B2BInquiryModal } from '../components/B2BInquiryModal';
import { downloadProductB2BSpec } from '../utils/specExport';

export const Product: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { language, localize, t } = useLanguage();
  const lp = useLocalizedPath();
  const { products, categories } = useCatalogStore();

  const product = products.find((p) => p.slug === id || p.id === id);
  const [selectedPkgId, setSelectedPkgId] = useState<string>('');
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (product && product.packages.length > 0) {
      setSelectedPkgId((prev) =>
        product.packages.some((pkg) => pkg.id === prev) ? prev : product.packages[0].id
      );
    }
  }, [product]);

  if (!product) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-4">
        <SeoHead
          noIndex
          title={`${
            language === 'ru'
              ? 'Товар не найден'
              : language === 'be'
              ? 'Тавар не знойдзены'
              : language === 'zh'
              ? '未找到产品'
              : 'Product not found'
          } — ${t('brandName')}`}
          description={
            language === 'ru'
              ? 'Запрошенный продукт не найден в каталоге.'
              : language === 'be'
              ? 'Запытаны прадукт не знойдзены ў каталогу.'
              : language === 'zh'
              ? '未在目录中找到所请求的产品。'
              : 'Requested product was not found in the catalog.'
          }
        />
        <h1 className="font-display text-2xl font-bold text-slate-900">
          {language === 'ru'
            ? 'Продукт не найден'
            : language === 'be'
            ? 'Прадукт не знойдзены'
            : language === 'zh'
            ? '未找到该产品'
            : 'Product not found'}
        </h1>
        <Link
          to={lp('/catalog')}
          className="inline-flex px-4 py-2 text-sm font-semibold text-white bg-[#0057B8] rounded-lg"
        >
          {t('heroPrimaryCta')}
        </Link>
      </div>
    );
  }

  const category = categories.find((c) => c.id === product.category);
  const activePackage =
    product.packages.find((pkg) => pkg.id === selectedPkgId) || product.packages[0];

  const relatedProducts = products.filter(
    (p) => p.visible && product.relatedIds.includes(p.id)
  );

  const gramUnit = language === 'ru' || language === 'be' ? 'г' : 'g';

  const labels = {
    home: language === 'ru' ? 'Главная' : language === 'be' ? 'Галоўная' : language === 'zh' ? '首页' : 'Home',
    packagesTitle:
      language === 'ru'
        ? 'Выберите вариант фасовки'
        : language === 'be'
        ? 'Выберыце варыянт фасоўкі'
        : language === 'zh'
        ? '选择包装规格'
        : 'Select Packaging Variant',
    weight: language === 'ru' ? 'Масса / объём' : language === 'be' ? 'Маса / аб’ём' : language === 'zh' ? '净重 / 容量' : 'Net Weight / Volume',
    shelfLife: language === 'ru' ? 'Срок годности' : language === 'be' ? 'Тэрмін прыдатнасці' : language === 'zh' ? '保质期' : 'Shelf Life',
    storage: language === 'ru' ? 'Условия хранения' : language === 'be' ? 'Умовы захоўвання' : language === 'zh' ? '储存条件' : 'Storage',
    packagingType: language === 'ru' ? 'Тип упаковки' : language === 'be' ? 'Тып упакоўкі' : language === 'zh' ? '包装形式' : 'Packaging',
    unitsPerBox: language === 'ru' ? 'Единиц в тарном месте' : language === 'be' ? 'Адзінак у тарным месцы' : language === 'zh' ? '每箱数量' : 'Units per Box',
    specsTitle:
      language === 'ru'
        ? 'Характеристики продукта'
        : language === 'be'
        ? 'Характарыстыкі прадукту'
        : language === 'zh'
        ? '产品技术参数'
        : 'Product Specifications',
    fat: language === 'ru' ? 'Массовая доля жира' : language === 'be' ? 'Масавая доля тлушчу' : language === 'zh' ? '乳脂含量' : 'Fat Content',
    protein: language === 'ru' ? 'Белок на 100 г' : language === 'be' ? 'Бялок на 100 г' : language === 'zh' ? '蛋白质 / 100克' : 'Protein / 100g',
    lactose: language === 'ru' ? 'Лактоза' : language === 'be' ? 'Лактоза' : language === 'zh' ? '乳糖' : 'Lactose',
    related:
      language === 'ru'
        ? 'Связанные позиции каталога'
        : language === 'be'
        ? 'Звязаныя пазіцыі каталога'
        : language === 'zh'
        ? '相关推荐产品'
        : 'Related Products',
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-12 sm:space-y-14">
      <SeoHead
        title={localize(product.seo.title)}
        description={localize(product.seo.description)}
        canonicalPath={`/product/${product.slug}`}
      />

      {/* Breadcrumbs */}
      <nav className="text-xs text-slate-500 flex flex-wrap items-center gap-2" aria-label="Breadcrumb">
        <Link to={lp('/')} className="hover:text-[#0057B8]">
          {labels.home}
        </Link>
        <span aria-hidden="true">/</span>
        <Link to={lp('/catalog')} className="hover:text-[#0057B8]">
          {t('navCatalog')}
        </Link>
        {category && (
          <>
            <span aria-hidden="true">/</span>
            <Link to={lp(`/catalog/${category.slug}`)} className="hover:text-[#0057B8]">
              {localize(category.name)}
            </Link>
          </>
        )}
        <span aria-hidden="true">/</span>
        <span className="text-slate-900 font-medium">{localize(product.name)}</span>
      </nav>

      {/* Contiguous Product Module */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        <div className="lg:col-span-6 lg:sticky lg:top-24">
          <div className="aspect-[4/3] w-full rounded-2xl overflow-hidden border border-slate-200 bg-slate-50">
            <ImageWithFallback
              src={product.image}
              alt={localize(product.name)}
              fallbackTitle={localize(product.name)}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="lg:col-span-6 space-y-6 min-w-0">
          <div className="space-y-3">
            <div className="text-xs text-slate-500 flex flex-wrap items-center gap-2 tabular-nums">
              {category && (
                <Link to={lp(`/catalog/${category.slug}`)} className="font-semibold text-[#0057B8] hover:underline">
                  {localize(category.name)}
                </Link>
              )}
              {product.fatContent !== undefined && product.fatContent !== null && (
                <>
                  <span aria-hidden="true">·</span>
                  <span>{product.fatContent}%</span>
                </>
              )}
              {product.exportReady && (
                <>
                  <span aria-hidden="true">·</span>
                  <span>Export B2B</span>
                </>
              )}
            </div>

            <h1 className="font-display text-2xl sm:text-4xl font-bold text-slate-900">
              {localize(product.seo.h1) || localize(product.name)}
            </h1>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              {localize(product.description)}
            </p>
          </div>

          {/* Multi-Packaging Variant Selector */}
          {product.packages.length > 0 && (
            <div className="space-y-3 pt-2 border-t border-slate-200">
              <div className="text-xs font-semibold text-slate-900">
                {labels.packagesTitle}
              </div>
              <div className="flex flex-wrap gap-2">
                {product.packages.map((pkg) => {
                  const isSelected = activePackage?.id === pkg.id;
                  return (
                    <button
                      key={pkg.id}
                      type="button"
                      onClick={() => setSelectedPkgId(pkg.id)}
                      className={`px-4 py-2 text-sm font-medium rounded-lg border transition-colors tabular-nums whitespace-nowrap ${
                        isSelected
                          ? 'bg-[#0057B8] text-white border-[#0057B8]'
                          : 'bg-white text-slate-800 border-slate-200 hover:border-[#0057B8]/50'
                      }`}
                    >
                      {pkg.weight}
                    </button>
                  );
                })}
              </div>

              {activePackage && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm tabular-nums">
                  <div className="flex items-start gap-2.5">
                    <Package className="w-4 h-4 text-[#0057B8] shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs text-slate-500">{labels.weight}</div>
                      <div className="font-semibold text-slate-900">{activePackage.weight}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Clock className="w-4 h-4 text-[#0057B8] shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs text-slate-500">{labels.shelfLife}</div>
                      <div className="font-semibold text-slate-900">{localize(activePackage.shelfLife)}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Thermometer className="w-4 h-4 text-[#0057B8] shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs text-slate-500">{labels.storage}</div>
                      <div className="font-semibold text-slate-900">{localize(activePackage.storage)}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Layers className="w-4 h-4 text-[#0057B8] shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs text-slate-500">{labels.unitsPerBox}</div>
                      <div className="font-semibold text-slate-900 break-all">
                        {activePackage.unitsPerBox} · GTIN {activePackage.gtin}
                      </div>
                    </div>
                  </div>
                  <div className="sm:col-span-2 pt-2 border-t border-slate-200/80 text-xs text-slate-600">
                    <span className="text-slate-500">{labels.packagingType}: </span>
                    <span className="font-medium text-slate-800">{localize(activePackage.packagingType)}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* B2B Actions */}
          <div className="flex flex-col sm:flex-row flex-wrap gap-3 pt-1">
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-white bg-[#0057B8] rounded-lg hover:bg-[#004494] transition-colors text-center"
            >
              <MessageSquare className="w-4 h-4 shrink-0" />
              <span>{t('requestSalesBtn')}</span>
            </button>
            <button
              type="button"
              onClick={() => downloadProductB2BSpec(product, category, language)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-slate-800 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors text-center"
            >
              <Download className="w-4 h-4 shrink-0" />
              <span>{t('downloadSpecBtn')}</span>
            </button>
          </div>

          {/* Dynamic Category-Specific Characteristics Table */}
          <div className="space-y-3 pt-4 border-t border-slate-200">
            <h2 className="font-display text-lg font-semibold text-slate-900">
              {labels.specsTitle}
            </h2>
            <dl className="divide-y divide-slate-200 border border-slate-200 rounded-xl overflow-hidden text-sm tabular-nums">
              {product.fatContent !== undefined && product.fatContent !== null && (
                <div className="px-4 py-3 flex justify-between gap-4 bg-white">
                  <dt className="text-slate-500">{labels.fat}</dt>
                  <dd className="font-medium text-slate-900 min-w-0 break-words text-right">{product.fatContent}%</dd>
                </div>
              )}
              {product.proteinContent !== undefined && product.proteinContent !== null && (
                <div className="px-4 py-3 flex justify-between gap-4 bg-slate-50/50">
                  <dt className="text-slate-500">{labels.protein}</dt>
                  <dd className="font-medium text-slate-900 min-w-0 break-words text-right">{product.proteinContent} {gramUnit}</dd>
                </div>
              )}
              <div className="px-4 py-3 flex justify-between gap-4 bg-white">
                <dt className="text-slate-500">{labels.lactose}</dt>
                <dd className="font-medium text-slate-900 min-w-0 break-words text-right">
                  {product.lactoseFree
                    ? language === 'ru'
                      ? 'Без лактозы (< 0,01%)'
                      : language === 'be'
                      ? 'Без лактозы (< 0,01%)'
                      : language === 'zh'
                      ? '无乳糖 (< 0.01%)'
                      : 'Lactose-Free (< 0.01%)'
                    : language === 'ru'
                    ? 'Природная молочная'
                    : language === 'be'
                    ? 'Прыродная малочная'
                    : language === 'zh'
                    ? '含天然乳糖'
                    : 'Natural dairy lactose'}
                </dd>
              </div>

              {Object.entries(product.characteristics).map(([key, value], idx) => {
                const schemaItem = category?.characteristicSchema.find((f) => f.key === key);
                const label = schemaItem ? localize(schemaItem.label) : key;
                return (
                  <div
                    key={key}
                    className={`px-4 py-3 flex justify-between gap-4 ${
                      idx % 2 === 0 ? 'bg-slate-50/50' : 'bg-white'
                    }`}
                  >
                    <dt className="text-slate-500">{label}</dt>
                    <dd className="font-medium text-slate-900 min-w-0 break-words text-right">{localize(value)}</dd>
                  </div>
                );
              })}
            </dl>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="space-y-6 pt-6 border-t border-slate-200">
          <h2 className="font-display text-2xl font-bold text-slate-900">
            {labels.related}
          </h2>
          <ProductGrid products={relatedProducts} />
        </section>
      )}

      <B2BInquiryModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        product={product}
        selectedPackageId={activePackage?.id}
        defaultChannel={product.exportReady ? 'export' : 'wholesale'}
      />
    </div>
  );
};
EOF

cat <<'EOF' > src/pages/Contacts.tsx
import React, { useState } from 'react';
import { Phone, Mail, MapPin, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { SeoHead } from '../components/SeoHead';
import { apiClient } from '../utils/apiClient';

export const Contacts: React.FC = () => {
  const { language, t } = useLanguage();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState('sales');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const copy = {
    ru: {
      seoDesc: 'Контакты ОАО «Молочный Мир»: приёмная, отдел оптовых продаж, отдел экспорта и пресс-служба.',
      depts: [
        { title: 'Отдел оптовых продаж (РБ / HoReCa)', phone: '+375 (152) 44-55-01', email: 'sales@milk.by' },
        { title: 'Отдел внешнеэкономической деятельности (Экспорт)', phone: '+375 (152) 44-55-12', email: 'export@milk.by' },
        { title: 'Приёмная и пресс-служба', phone: '+375 (152) 44-55-00', email: 'info@milk.by' },
      ],
      hq: 'Адрес головного предприятия',
      sentTitle: 'Сообщение отправлено',
      sentDesc: 'Благодарим за обращение. Специалист свяжется с вами в рабочее время.',
      sendAnother: 'Отправить ещё одно сообщение',
      formTitle: 'Обратная связь',
      nameLabel: 'Имя / Организация *',
      deptLabel: 'Подразделение',
      deptOptions: {
        sales: 'Отдел оптовых продаж',
        export: 'Отдел экспорта (ВЭД)',
        quality: 'Служба качества',
        press: 'Пресс-служба',
      },
      msgLabel: 'Сообщение *',
      submit: 'Отправить сообщение',
    },
    be: {
      seoDesc: 'Кантакты ААТ «Малочны Мір»: прыёмная, аддзел аптовых продажаў, аддзел экспарту і прэс-служба.',
      depts: [
        { title: 'Аддзел аптовых продажаў (РБ / HoReCa)', phone: '+375 (152) 44-55-01', email: 'sales@milk.by' },
        { title: 'Аддзел знешнеэканамічнай дзейнасці (Экспарт)', phone: '+375 (152) 44-55-12', email: 'export@milk.by' },
        { title: 'Прыёмная і прэс-служба', phone: '+375 (152) 44-55-00', email: 'info@milk.by' },
      ],
      hq: 'Адрас галаўнога прадпрыемства',
      sentTitle: 'Паведамленне адпраўлена',
      sentDesc: 'Дзякуй за зварот. Спецыяліст звяжацца з вамі ў працоўны час.',
      sendAnother: 'Адправіць яшчэ адно паведамленне',
      formTitle: 'Зваротная сувязь',
      nameLabel: 'Імя / Арганізацыя *',
      deptLabel: 'Падраздзяленне',
      deptOptions: {
        sales: 'Аддзел аптовых продажаў',
        export: 'Аддзел экспарту (ЗЭД)',
        quality: 'Служба якасці',
        press: 'Прэс-служба',
      },
      msgLabel: 'Паведамленне *',
      submit: 'Адправіць паведамленне',
    },
    en: {
      seoDesc: 'Contacts of Molochny Mir JSC: reception, wholesale sales, international export department, and press office.',
      depts: [
        { title: 'Domestic Wholesale & HoReCa', phone: '+375 (152) 44-55-01', email: 'sales@milk.by' },
        { title: 'International Export Department', phone: '+375 (152) 44-55-12', email: 'export@milk.by' },
        { title: 'Corporate Office & Press', phone: '+375 (152) 44-55-00', email: 'info@milk.by' },
      ],
      hq: 'Headquarters',
      sentTitle: 'Message Sent',
      sentDesc: 'Thank you for reaching out. Our team will respond shortly.',
      sendAnother: 'Send another message',
      formTitle: 'Direct Inquiry Form',
      nameLabel: 'Name / Company *',
      deptLabel: 'Department',
      deptOptions: {
        sales: 'Wholesale Sales',
        export: 'International Export',
        quality: 'Quality Control',
        press: 'Press & Media',
      },
      msgLabel: 'Message *',
      submit: 'Send Message',
    },
    zh: {
      seoDesc: '联系 Molochny Mir 股份公司：总机、大宗批发部、国际出口外贸部及新闻媒体部门。',
      depts: [
        { title: '国内批发与餐饮销售部 (HoReCa)', phone: '+375 (152) 44-55-01', email: 'sales@milk.by' },
        { title: '国际外贸出口部门', phone: '+375 (152) 44-55-12', email: 'export@milk.by' },
        { title: '总部办公室与媒体公关', phone: '+375 (152) 44-55-00', email: 'info@milk.by' },
      ],
      hq: '企业总部地址',
      sentTitle: '信息已发送',
      sentDesc: '感谢您的留言，我们的工作人员将在工作时间内尽快与您联系。',
      sendAnother: '再发送一条消息',
      formTitle: '在线联系表单',
      nameLabel: '姓名 / 公司名称 *',
      deptLabel: '联系部门',
      deptOptions: {
        sales: '大宗批发销售部',
        export: '国际出口贸易部',
        quality: '质量控制中心',
        press: '新闻与媒体部',
      },
      msgLabel: '留言内容 *',
      submit: '提交信息',
    },
  }[language];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.includes('@') || !message.trim()) return;
    setSubmitting(true);
    try {
      await apiClient.submitB2BInquiry({
        company: name.trim(),
        contactName: name.trim(),
        email: email.trim(),
        phone: '',
        country: '',
        volume: '',
        message: `[${department}] ${message.trim()}`,
        channel: department === 'export' ? 'export' : department === 'sales' ? 'wholesale' : 'general',
        language,
      });
    } catch {
      // Allow UI confirmation even in standalone static mode
    } finally {
      setSubmitting(false);
      setSent(true);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      <SeoHead
        title={`${t('ctaContact')} — ${t('brandName')}`}
        description={copy.seoDesc}
        canonicalPath="/contacts"
      />

      <div className="space-y-3">
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-slate-900">
          {t('ctaContact')}
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-2xl">{t('footerLegal')}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 space-y-4">
          {copy.depts.map((dept) => (
            <div key={dept.email} className="border border-slate-200 rounded-xl p-5 space-y-2 bg-slate-50/60">
              <h2 className="font-display text-base font-semibold text-slate-900">{dept.title}</h2>
              <div className="text-sm text-slate-600 space-y-1 font-mono tabular-nums">
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-[#0057B8]" />
                  <span>{dept.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-[#0057B8]" />
                  <span>{dept.email}</span>
                </div>
              </div>
            </div>
          ))}

          <div className="border border-slate-200 rounded-xl p-5 space-y-1.5 text-sm text-slate-600">
            <div className="flex items-center gap-2 font-semibold text-slate-900">
              <MapPin className="w-4 h-4 text-[#0057B8]" />
              <span>{copy.hq}</span>
            </div>
            <p>{t('footerLegal')}</p>
          </div>
        </div>

        <div className="lg:col-span-7 border border-slate-200 rounded-2xl p-5 sm:p-8 bg-white">
          {sent ? (
            <div className="py-10 text-center space-y-3">
              <CheckCircle2 className="w-10 h-10 text-[#0057B8] mx-auto" />
              <h2 className="font-display text-xl font-semibold text-slate-900">{copy.sentTitle}</h2>
              <p className="text-sm text-slate-600">{copy.sentDesc}</p>
              <button
                type="button"
                onClick={() => {
                  setSent(false);
                  setMessage('');
                }}
                className="px-4 py-2 text-xs font-semibold text-[#0057B8] bg-blue-50 rounded-lg"
              >
                {copy.sendAnother}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h2 className="font-display text-xl font-semibold text-slate-900">{copy.formTitle}</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    {copy.nameLabel}
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full h-10 px-3 text-base sm:text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-[#0057B8]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">E-mail *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-10 px-3 text-base sm:text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-[#0057B8]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  {copy.deptLabel}
                </label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full h-10 px-3 text-base sm:text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-[#0057B8]"
                >
                  <option value="sales">{copy.deptOptions.sales}</option>
                  <option value="export">{copy.deptOptions.export}</option>
                  <option value="quality">{copy.deptOptions.quality}</option>
                  <option value="press">{copy.deptOptions.press}</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  {copy.msgLabel}
                </label>
                <textarea
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full p-3 text-base sm:text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-[#0057B8]"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full sm:w-auto px-5 py-2.5 text-sm font-semibold text-white bg-[#0057B8] rounded-lg hover:bg-[#004494] disabled:opacity-60 transition-colors"
              >
                {copy.submit}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
EOF

cat <<'EOF' > src/pages/SitemapPage.tsx
import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Download, CheckCircle2 } from 'lucide-react';
import { useLanguage, useLocalizedPath } from '../hooks/useLanguage';
import { useCatalogStore } from '../hooks/useCatalogStore';
import { generateXmlSitemap } from '../utils/specExport';
import { SeoHead } from '../components/SeoHead';

export const SitemapPage: React.FC = () => {
  const { language, t } = useLanguage();
  const lp = useLocalizedPath();
  const { products, categories, news, redirects } = useCatalogStore();

  const copy = {
    ru: {
      seoDesc: 'Автоматически обновляемый sitemap.xml, hreflang-связи 4 языковых версий и таблица 301-редиректов со старых URL milk.by.',
      h1: 'XML-карта сайта, SEO-аудит и 301-редиректы',
      lead: 'Автоматическая генерация ЧПУ-структуры с поддержкой hreflang (RU / BE / EN / ZH) и отсутствием дублей.',
      downloadXml: 'Скачать sitemap.xml',
      uniqTitle: 'Уникальность SEO Title (все 4 языка)',
      noDupes: '(Без дублей)',
      langVersions: 'Языковые версии (hreflang)',
      redirectsCount: 'Настроено 301-редиректов',
      rulesUnit: 'правил',
      redirectsHeading: 'Карта 301-редиректов со старых URL milk.by',
      colOld: 'Старый URL (milk.by)',
      colCode: 'Код',
      colNew: 'Новый канонический URL',
      colNote: 'Примечание',
    },
    be: {
      seoDesc: 'Аўтаматычна абнаўляемы sitemap.xml, hreflang-сувязі 4 моўных версій і табліца 301-рэдырэктаў са старых URL milk.by.',
      h1: 'XML-карта сайта, SEO-аўдыт і 301-рэдырэкты',
      lead: 'Аўтаматычная генерацыя ЧПУ-структуры з падтрымкай hreflang (RU / BE / EN / ZH) і адсутнасцю дубляў.',
      downloadXml: 'Спампаваць sitemap.xml',
      uniqTitle: 'Унікальнасць SEO Title (усе 4 мовы)',
      noDupes: '(Без дубляў)',
      langVersions: 'Моўныя версіі (hreflang)',
      redirectsCount: 'Наладжана 301-рэдырэктаў',
      rulesUnit: 'правілаў',
      redirectsHeading: 'Карта 301-рэдырэктаў са старых URL milk.by',
      colOld: 'Стары URL (milk.by)',
      colCode: 'Код',
      colNew: 'Новы кананічны URL',
      colNote: 'Заўвага',
    },
    en: {
      seoDesc: 'Auto-generated sitemap.xml, 4-language hreflang links, and 301 redirect rules from legacy milk.by URLs.',
      h1: 'XML Sitemap, SEO Audit & 301 Redirects',
      lead: 'Auto-generated clean URL sitemap with 4-language hreflang links and legacy 301 redirects.',
      downloadXml: 'Download sitemap.xml',
      uniqTitle: 'Unique SEO Titles (4 languages)',
      noDupes: '(No duplicates)',
      langVersions: 'Language Versions (hreflang)',
      redirectsCount: 'Configured 301 Redirects',
      rulesUnit: 'rules',
      redirectsHeading: 'Legacy URL 301 Redirect Mapping',
      colOld: 'Legacy URL (milk.by)',
      colCode: 'Code',
      colNew: 'Canonical Target URL',
      colNote: 'Note',
    },
    zh: {
      seoDesc: '自动更新的 sitemap.xml、四种语言 hreflang 关联及 milk.by 旧版链接 301 重定向映射表。',
      h1: 'XML 站点地图、SEO 审计与 301 重定向',
      lead: '自动生成支持四种语言 hreflang (RU / BE / EN / ZH) 且无重复标题的规范化 URL 站点地图。',
      downloadXml: '下载 sitemap.xml',
      uniqTitle: 'SEO 标题唯一性（四语）',
      noDupes: '（无重复）',
      langVersions: '语言版本 (hreflang)',
      redirectsCount: '已配置 301 重定向',
      rulesUnit: '条规则',
      redirectsHeading: 'milk.by 旧版链接 301 重定向映射表',
      colOld: '旧版 URL (milk.by)',
      colCode: '状态码',
      colNew: '新版规范 URL',
      colNote: '说明',
    },
  }[language];

  const xmlContent = useMemo(
    () => generateXmlSitemap(products, categories, news),
    [products, categories, news]
  );

  const seoAudit = useMemo(() => {
    const visibleProducts = products.filter((p) => p.visible);
    const titles = visibleProducts.map((p) => p.seo.title[language] || p.seo.title.ru);
    const uniqueTitles = new Set(titles);
    const allLangsClean = (['ru', 'be', 'en', 'zh'] as const).every((l) => {
      const list = visibleProducts.map((p) => p.seo.title[l] || p.name[l] || '');
      return new Set(list).size === list.length;
    });
    return {
      totalProducts: visibleProducts.length,
      uniqueTitlesCount: uniqueTitles.size,
      noDuplicates: titles.length === uniqueTitles.size && allLangsClean,
    };
  }, [products, language]);

  const handleDownloadXml = () => {
    const blob = new Blob([xmlContent], { type: 'application/xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sitemap.xml';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-10">
      <SeoHead
        noIndex
        title={`XML Sitemap & SEO Audit — ${t('brandName')}`}
        description={copy.seoDesc}
        canonicalPath="/sitemap"
      />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-900">{copy.h1}</h1>
          <p className="text-sm text-slate-600 mt-1">{copy.lead}</p>
        </div>

        <button
          type="button"
          onClick={handleDownloadXml}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-[#0057B8] rounded-lg hover:bg-[#004494] transition-colors whitespace-nowrap shrink-0 self-start sm:self-auto"
        >
          <Download className="w-4 h-4" />
          <span>{copy.downloadXml}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 tabular-nums">
        <div className="border border-slate-200 rounded-xl p-4 bg-white">
          <div className="text-xs text-slate-500">{copy.uniqTitle}</div>
          <div className="mt-1 flex items-center gap-2 font-display text-lg font-bold text-slate-900">
            <CheckCircle2 className="w-4 h-4 text-[#0057B8] shrink-0" />
            <span>
              {seoAudit.uniqueTitlesCount} / {seoAudit.totalProducts}{' '}
              {seoAudit.noDuplicates ? copy.noDupes : ''}
            </span>
          </div>
        </div>
        <div className="border border-slate-200 rounded-xl p-4 bg-white">
          <div className="text-xs text-slate-500">{copy.langVersions}</div>
          <div className="mt-1 font-display text-lg font-bold text-slate-900">
            4 (RU · BE · EN · ZH)
          </div>
        </div>
        <div className="border border-slate-200 rounded-xl p-4 bg-white">
          <div className="text-xs text-slate-500">{copy.redirectsCount}</div>
          <div className="mt-1 font-display text-lg font-bold text-slate-900">
            {redirects.length} {copy.rulesUnit}
          </div>
        </div>
      </div>

      <section className="space-y-3">
        <h2 className="font-display text-lg font-semibold text-slate-900">
          {copy.redirectsHeading}
        </h2>
        <div className="border border-slate-200 rounded-xl overflow-x-auto bg-white">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 font-semibold text-slate-600">
                <th className="py-3 px-4">{copy.colOld}</th>
                <th className="py-3 px-4">{copy.colCode}</th>
                <th className="py-3 px-4">{copy.colNew}</th>
                <th className="py-3 px-4">{copy.colNote}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {redirects.map((rule) => {
                const targetPath = rule.to.startsWith('/') ? rule.to : lp(rule.to);
                return (
                  <tr key={rule.from}>
                    <td className="py-2.5 px-4 font-mono text-slate-600">{rule.from}</td>
                    <td className="py-2.5 px-4 font-mono font-semibold text-[#0057B8]">{rule.code}</td>
                    <td className="py-2.5 px-4 font-mono">
                      <Link to={targetPath} className="text-[#0057B8] hover:underline">
                        {rule.to}
                      </Link>
                    </td>
                    <td className="py-2.5 px-4 text-slate-600">{rule.note}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-lg font-semibold text-slate-900">
          sitemap.xml (Live Preview)
        </h2>
        <pre className="p-4 bg-slate-950 text-slate-100 rounded-xl overflow-x-auto text-xs font-mono leading-relaxed max-h-[420px]">
          {xmlContent}
        </pre>
      </section>
    </div>
  );
};
EOF

# Update About.tsx, News.tsx, NewsArticle.tsx, Export.tsx, Partners.tsx cleanly for useLocalizedPath & canonicalPath
python3 - <<'PY'
from pathlib import Path

updates = {
    "src/pages/About.tsx": [
        ("import { useLanguage } from '../hooks/useLanguage';", "import { useLanguage, useLocalizedPath } from '../hooks/useLanguage';"),
        ("const { language, t } = useLanguage();", "const { language, t } = useLanguage();\n  const lp = useLocalizedPath();"),
        ('to="/catalog"', 'to={lp("/catalog")}'),
        ('to="/contacts"', 'to={lp("/contacts")}'),
        ('canonicalHash="/about"', 'canonicalPath="/about"'),
    ],
    "src/pages/News.tsx": [
        ("import { useLanguage } from '../hooks/useLanguage';", "import { useLanguage, useLocalizedPath } from '../hooks/useLanguage';"),
        ("const { language, localize, t } = useLanguage();", "const { language, localize, t } = useLanguage();\n  const lp = useLocalizedPath();"),
        ("to={`/news/${featuredArticle.slug}`}", "to={lp(`/news/${featuredArticle.slug}`)}"),
        ("to={`/news/${article.slug}`}", "to={lp(`/news/${article.slug}`)}"),
        ('canonicalHash="/news"', 'canonicalPath="/news"'),
    ],
    "src/pages/NewsArticle.tsx": [
        ("import { useLanguage } from '../hooks/useLanguage';", "import { useLanguage, useLocalizedPath } from '../hooks/useLanguage';"),
        ("const { language, localize, t } = useLanguage();", "const { language, localize, t } = useLanguage();\n  const lp = useLocalizedPath();"),
        ('to="/news"', 'to={lp("/news")}'),
        ("to={`/news/${item.slug}`}", "to={lp(`/news/${item.slug}`)}"),
        ("canonicalHash={`/news/${article.slug}`}", "canonicalPath={`/news/${article.slug}`}"),
    ],
    "src/pages/Export.tsx": [
        ("import { useLanguage } from '../hooks/useLanguage';", "import { useLanguage, useLocalizedPath } from '../hooks/useLanguage';"),
        ("const { language, localize, t } = useLanguage();", "const { language, localize, t } = useLanguage();\n  const lp = useLocalizedPath();"),
        ('to="/catalog"', 'to={lp("/catalog")}'),
        ('to="/partners"', 'to={lp("/partners")}'),
        ("to={`/product/${prod.slug}`}", "to={lp(`/product/${prod.slug}`)}"),
        ('canonicalHash="/export"', 'canonicalPath="/export"'),
    ],
    "src/pages/Partners.tsx": [
        ("import { useLanguage } from '../hooks/useLanguage';", "import { useLanguage, useLocalizedPath } from '../hooks/useLanguage';"),
        ("const { language, localize, t } = useLanguage();", "const { language, localize, t } = useLanguage();\n  const lp = useLocalizedPath();"),
        ('to="/catalog"', 'to={lp("/catalog")}'),
        ('to="/export"', 'to={lp("/export")}'),
        ("to={`/product/${prod.slug}`}", "to={lp(`/product/${prod.slug}`)}"),
        ('canonicalHash="/partners"', 'canonicalPath="/partners"'),
    ],
}

for path_str, replacements in updates.items():
    p = Path(path_str)
    txt = p.read_text(encoding="utf-8")
    for old, new in replacements:
        txt = txt.replace(old, new)
    p.write_text(txt, encoding="utf-8")
PY

# Upgrade Admin.tsx: backend API status badge, B2B Inquiries tab, real file upload, bulk CSV/JSON import for products & redirects
python3 - <<'PY'
from pathlib import Path

admin_path = Path("src/pages/Admin.tsx")
txt = admin_path.read_text(encoding="utf-8")

txt = txt.replace(
    "import { ASSETS } from '../data/assets';",
    "import { ASSETS } from '../data/assets';\nimport { apiClient } from '../utils/apiClient';",
)

txt = txt.replace(
    "    resetDemoData,\n  } = useCatalogStore();",
    "    inquiries,\n    apiConnected,\n    refreshFromServer,\n    refreshInquiries,\n    resetDemoData,\n  } = useCatalogStore();",
)

txt = txt.replace(
    "'products' | 'categories' | 'news' | 'redirects' | 'translations'",
    "'products' | 'categories' | 'news' | 'redirects' | 'translations' | 'inquiries'",
)

txt = txt.replace(
    "const [redirTo, setRedirTo] = useState('#/catalog');",
    "const [redirTo, setRedirTo] = useState('/ru/catalog');",
)

txt = txt.replace(
    'canonicalHash="/admin"',
    'noIndex\n        canonicalPath="/admin"',
)

txt = txt.replace(
    "  const handleImageUpload = (file: File | undefined, onLoaded: (dataUrl: string) => void) => {\n    if (!file) return;\n    const reader = new FileReader();\n    reader.onload = () => {\n      if (typeof reader.result === 'string') {\n        onLoaded(reader.result);\n      }\n    };\n    reader.readAsDataURL(file);\n  };",
    """  const handleImageUpload = async (file: File | undefined, onLoaded: (dataUrl: string) => void) => {
    if (!file) return;
    if (apiConnected) {
      try {
        const res = await apiClient.uploadMedia(file);
        onLoaded(res.url);
        return;
      } catch {
        // fallback to base64 if upload fails
      }
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        onLoaded(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };""",
)

# Make CSV/JSON import hit backend bulk importer when connected
txt = txt.replace(
    "  const handleImportCatalogFile = (e: React.ChangeEvent<HTMLInputElement>) => {\n    const file = e.target.files?.[0];\n    if (!file) return;",
    """  const handleImportCatalogFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (apiConnected) {
      try {
        const res = await apiClient.importProductsFile(file);
        await refreshFromServer();
        setImportStatus(`DB: +${res.created} / upd ${res.updated}`);
        e.target.value = '';
        return;
      } catch {
        // fallback to local parse
      }
    }""",
)

# Add Inquiries tab button + DB connection pill + Inquiries table
txt = txt.replace(
    "      ['translations', copy.tabTranslations],\n      ] as const",
    "      ['translations', copy.tabTranslations],\n      ['inquiries', `B2B (${inquiries.length})`],\n      ] as const",
)

txt = txt.replace(
    "onClick={() => setActiveTab(tabKey)}",
    "onClick={() => { setActiveTab(tabKey); if (tabKey === 'inquiries') refreshInquiries(); }}",
)

txt = txt.replace(
    "<h1 className=\"font-display text-2xl sm:text-3xl font-bold text-slate-900\">{t('adminTitle')}</h1>",
    """<div className="flex flex-wrap items-center gap-2.5">
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-900">{t('adminTitle')}</h1>
            <span className={`px-2.5 py-0.5 text-[11px] font-mono rounded-full border ${apiConnected ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
              {apiConnected ? 'PostgreSQL API' : 'Offline Mode'}
            </span>
          </div>""",
)

inquiries_panel = """
    {/* TAB 6: B2B INQUIRIES */}
    {activeTab === 'inquiries' && (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-slate-900">B2B & Export Inquiries ({inquiries.length})</h2>
          <button
            type="button"
            onClick={() => refreshInquiries()}
            className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200"
          >
            Refresh
          </button>
        </div>
        <div className="border border-slate-200 rounded-xl overflow-x-auto bg-white">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 font-semibold text-slate-600">
                <th className="py-3 px-4">Company / Contact</th>
                <th className="py-3 px-4">Channel</th>
                <th className="py-3 px-4">Country / Volume</th>
                <th className="py-3 px-4">Message</th>
                <th className="py-3 px-4">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {inquiries.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-500">
                    No submitted B2B inquiries yet. Submit one via product card, Export, or Contacts form.
                  </td>
                </tr>
              ) : (
                inquiries.map((inq, idx) => (
                  <tr key={inq.id || idx}>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900">{inq.company}</div>
                      <div className="text-slate-600">{inq.contactName} · {inq.email}</div>
                    </td>
                    <td className="py-3 px-4 font-mono text-[#0057B8] uppercase">{inq.channel}</td>
                    <td className="py-3 px-4 text-slate-700">
                      <div>{inq.country || '—'}</div>
                      <div className="text-slate-500">{inq.volume || '—'}</div>
                    </td>
                    <td className="py-3 px-4 text-slate-700 max-w-xs">{inq.message}</td>
                    <td className="py-3 px-4 font-mono text-slate-500">
                      {inq.createdAt ? inq.createdAt.slice(0, 16).replace('T', ' ') : '—'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    )}
  </div>
  );
};"""

txt = txt.replace("  </div>\n  );\n};", inquiries_panel)
admin_path.write_text(txt, encoding="utf-8")
PY

cat <<'EOF' > src/App.tsx
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  Navigate,
  useLocation,
  useParams,
} from 'react-router-dom';
import { LanguageProvider, useLanguage, useLocalizedPath } from './hooks/useLanguage';
import { CatalogStoreProvider } from './hooks/useCatalogStore';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Catalog } from './pages/Catalog';
import { Category } from './pages/Category';
import { Product } from './pages/Product';
import { News } from './pages/News';
import { NewsArticle } from './pages/NewsArticle';
import { Export } from './pages/Export';
import { Partners } from './pages/Partners';
import { About } from './pages/About';
import { Contacts } from './pages/Contacts';
import { Admin } from './pages/Admin';
import { SitemapPage } from './pages/SitemapPage';
import { Language } from './types';

const SUPPORTED_LANGS: Language[] = ['ru', 'be', 'en', 'zh'];

const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const NotFound: React.FC = () => {
  const { language } = useLanguage();
  const lp = useLocalizedPath();

  const copy = {
    ru: {
      title: '404 — Страница не найдена',
      desc: 'Запрошенный адрес не существует. Воспользуйтесь каталогом продукции или вернитесь на главную.',
      home: 'На главную',
      catalog: 'Каталог продукции',
    },
    be: {
      title: '404 — Старонка не знойдзена',
      desc: 'Запытаны адрас не існуе. Скарыстайцеся каталогам прадукцыі або вярніцеся на галоўную.',
      home: 'На галоўную',
      catalog: 'Каталог прадукцыі',
    },
    en: {
      title: '404 — Page Not Found',
      desc: 'The requested page does not exist. Browse our dairy catalog or return to the homepage.',
      home: 'Homepage',
      catalog: 'Product Catalog',
    },
    zh: {
      title: '404 — 页面未找到',
      desc: '您访问的地址不存在。请浏览产品目录或返回首页。',
      home: '返回首页',
      catalog: '产品目录',
    },
  }[language];

  return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
      <h1 className="font-display text-3xl font-bold text-slate-900">{copy.title}</h1>
      <p className="text-sm text-slate-600">{copy.desc}</p>
      <div className="flex flex-wrap justify-center gap-3 pt-2">
        <Link
          to={lp('/')}
          className="px-4 py-2 text-sm font-semibold text-white bg-[#0057B8] rounded-lg hover:bg-[#004494]"
        >
          {copy.home}
        </Link>
        <Link
          to={lp('/catalog')}
          className="px-4 py-2 text-sm font-semibold text-slate-800 bg-slate-100 rounded-lg hover:bg-slate-200"
        >
          {copy.catalog}
        </Link>
      </div>
    </div>
  );
};

const UnprefixedRedirect: React.FC = () => {
  const location = useLocation();
  return <Navigate to={`/ru${location.pathname}${location.search}${location.hash}`} replace />;
};

const LanguageScopedRoutes: React.FC = () => {
  const { lang } = useParams<{ lang: string }>();
  const { setLanguage } = useLanguage();
  const lastSyncedParam = useRef<string | undefined>(undefined);

  const isSupported = Boolean(lang && SUPPORTED_LANGS.includes(lang as Language));

  useEffect(() => {
    if (isSupported && lang && lastSyncedParam.current !== lang) {
      lastSyncedParam.current = lang;
      setLanguage(lang as Language);
    }
  }, [isSupported, lang, setLanguage]);

  if (!isSupported) {
    return <NotFound />;
  }

  return (
    <Routes>
      <Route index element={<Home />} />
      <Route path="catalog" element={<Catalog />} />
      <Route path="catalog/:category" element={<Category />} />
      <Route path="product/:id" element={<Product />} />
      <Route path="news" element={<News />} />
      <Route path="news/:id" element={<NewsArticle />} />
      <Route path="export" element={<Export />} />
      <Route path="partners" element={<Partners />} />
      <Route path="about" element={<About />} />
      <Route path="contacts" element={<Contacts />} />
      <Route path="admin" element={<Admin />} />
      <Route path="sitemap" element={<SitemapPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default function App() {
  return (
    <LanguageProvider>
      <CatalogStoreProvider>
        <BrowserRouter>
          <ScrollToTop />
          <div className="min-h-screen flex flex-col bg-white text-slate-900">
            <Header />
            <main className="flex-1 min-w-0">
              <Routes>
                <Route path="/" element={<Navigate to="/ru/" replace />} />
                <Route path="/catalog/*" element={<UnprefixedRedirect />} />
                <Route path="/product/*" element={<UnprefixedRedirect />} />
                <Route path="/news/*" element={<UnprefixedRedirect />} />
                <Route path="/export" element={<UnprefixedRedirect />} />
                <Route path="/partners" element={<UnprefixedRedirect />} />
                <Route path="/about" element={<UnprefixedRedirect />} />
                <Route path="/contacts" element={<UnprefixedRedirect />} />
                <Route path="/admin" element={<UnprefixedRedirect />} />
                <Route path="/sitemap" element={<UnprefixedRedirect />} />
                <Route path="/:lang/*" element={<LanguageScopedRoutes />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </BrowserRouter>
      </CatalogStoreProvider>
    </LanguageProvider>
  );
}
EOF

echo ""
echo "================================================================="
echo " Setup complete!"
echo " Next steps:"
echo " 1) Verify frontend build:  npm run build"
echo " 2) Start full stack:       docker compose up --build"
echo " 3) Open platform:          http://localhost:8080/ru/"
echo " 4) Open Swagger API docs:  http://localhost:8080/api/docs"
echo " 5) Test SEO endpoints:"
echo "      curl -I http://localhost:8080/catalog/syry/motsarella-45.html   # 301"
echo "      curl -s http://localhost:8080/en/product/mozzarella | grep -i '<title>'"
echo "      curl -s http://localhost:8080/sitemap.xml | head -n 20"
echo "================================================================="
