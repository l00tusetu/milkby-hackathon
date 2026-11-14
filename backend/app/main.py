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
