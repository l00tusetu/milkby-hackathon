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
