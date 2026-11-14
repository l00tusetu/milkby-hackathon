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
