import argparse
import csv
import hashlib
import json
import re
import threading
import time
from collections import deque
from concurrent.futures import FIRST_COMPLETED, Future, ThreadPoolExecutor, wait
from pathlib import Path
from typing import Optional
from urllib.parse import parse_qs, urlencode, urljoin, urlparse, urlunparse

import requests
from bs4 import BeautifulSoup
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry

BASE_URL = "https://milk.by"
START_URLS = [
    "https://milk.by/katalog/",
    "https://milk.by/",
]

# Настройки по умолчанию (можно переопределить флагами CLI)
DEFAULT_MAX_PRODUCTS: Optional[int] = None  # None или 0 — без ограничений; например, 20 — собрать 20 товаров
DEFAULT_WORKERS = 5                         # количество параллельных потоков
DEFAULT_DELAY = 0.2                         # пауза на поток между запросами (сек)

OUTPUT_DIR = Path("output")
IMAGES_DIR = OUTPUT_DIR / "images"

SKIP_EXTENSIONS = {
    ".pdf", ".xls", ".xlsx", ".doc", ".docx", ".zip", ".rar",
    ".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg",
}

BAD_IMAGE_PATTERNS = (
    "/bitrix/templates/",
    "assetslogo",
    "logo",
    "icon",
    "novinka",
    "новинка",
    "favicon",
)

thread_local = threading.local()
sessions_lock = threading.Lock()
created_sessions: list[requests.Session] = []
print_lock = threading.Lock()


def log(msg: str) -> None:
    with print_lock:
        print(msg)


def create_session() -> requests.Session:
    session = requests.Session()
    session.headers.update({
        "User-Agent": (
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
            "AppleWebKit/537.36 (KHTML, like Gecko) "
            "Chrome/128.0.0.0 Safari/537.36"
        ),
        "Accept-Language": "ru-RU,ru;q=0.9,en;q=0.8",
    })
    retry = Retry(
        total=3,
        backoff_factor=1.0,
        status_forcelist=(429, 500, 502, 503, 504),
    )
    adapter = HTTPAdapter(max_retries=retry)
    session.mount("http://", adapter)
    session.mount("https://", adapter)
    return session


def get_thread_session() -> requests.Session:
    session = getattr(thread_local, "session", None)
    if session is None:
        session = create_session()
        thread_local.session = session
        with sessions_lock:
            created_sessions.append(session)
    return session


def normalize_url(url: str) -> str:
    """Оставляет схему, домен, путь и параметры пагинации Bitrix (PAGEN_*)."""
    parsed = urlparse(url)
    path = parsed.path or "/"
    if path != "/" and not path.endswith("/") and "." not in Path(path).name:
        path += "/"

    qs = parse_qs(parsed.query)
    pagen_qs = {k: v[0] for k, v in qs.items() if k.startswith("PAGEN_")}
    query = urlencode(sorted(pagen_qs.items())) if pagen_qs else ""

    return urlunparse((parsed.scheme, parsed.netloc, path, "", query, ""))


def is_catalog_url(url: str) -> bool:
    parsed = urlparse(url)
    if parsed.netloc and parsed.netloc != urlparse(BASE_URL).netloc:
        return False
    path_lower = parsed.path.lower()
    if any(path_lower.endswith(ext) for ext in SKIP_EXTENSIONS):
        return False
    return path_lower.startswith("/katalog/")


def get_main_content(soup: BeautifulSoup) -> BeautifulSoup:
    soup_copy = BeautifulSoup(str(soup), "html.parser")
    for tag in soup_copy.select("header, footer, nav, script, style, noscript"):
        tag.decompose()

    for selector in ("main", ".content", "#content", ".catalog-detail", ".catalog-section"):
        block = soup_copy.select_one(selector)
        if block:
            return block
    return soup_copy.body or soup_copy


def extract_breadcrumbs(soup: BeautifulSoup, current_url: str) -> list[str]:
    for selector in (".breadcrumb", ".breadcrumbs", "[itemtype*='BreadcrumbList']", ".bx-breadcrumb"):
        bc = soup.select_one(selector)
        if bc:
            items = [
                el.get_text(" ", strip=True)
                for el in bc.select("a, span, li")
                if el.get_text(" ", strip=True)
            ]
            deduped = list(dict.fromkeys(x for x in items if x not in {"/", ">", "»", "·"}))
            if deduped:
                return deduped

    return [p for p in urlparse(current_url).path.strip("/").split("/") if p]


def extract_specs_tables(content: BeautifulSoup) -> list[dict]:
    """Парсит таблицы характеристик в список словарей."""
    specs = []
    for table in content.find_all("table"):
        rows = table.find_all("tr")
        if not rows:
            continue

        header_cells = rows[0].find_all(["th", "td"])
        headers = [c.get_text(" ", strip=True) for c in header_cells]
        is_thead = bool(rows[0].find_parent("thead"))
        all_th = len(rows[0].find_all("th")) == len(header_cells) and len(header_cells) > 0

        if len(headers) == 2 and not is_thead and not all_th and len(rows) > 1:
            kv = {}
            for row in rows:
                cols = [c.get_text(" ", strip=True) for c in row.find_all(["th", "td"])]
                if len(cols) == 2 and cols[0]:
                    kv[cols[0]] = cols[1]
            if kv:
                specs.append(kv)
            continue

        for row in rows[1:]:
            cols = [c.get_text(" ", strip=True) for c in row.find_all(["th", "td"])]
            if not any(cols):
                continue
            item = {}
            for idx, val in enumerate(cols):
                key = headers[idx] if idx < len(headers) and headers[idx] else f"col_{idx + 1}"
                item[key] = val
            specs.append(item)
    return specs


def extract_description(content: BeautifulSoup, title: str) -> str:
    for heading in content.find_all(["h2", "h3", "h4", "div", "p", "strong"]):
        if heading.get_text(strip=True).lower() == "описание":
            parts = []
            for sib in heading.find_next_siblings():
                if sib.name == "table":
                    break
                text = sib.get_text(" ", strip=True)
                if text:
                    parts.append(text)
            if parts:
                return "\n".join(parts)

    paragraphs = []
    for p in content.find_all("p"):
        if p.find_parent("table"):
            continue
        text = p.get_text(" ", strip=True)
        if text and text != title:
            paragraphs.append(text)
    return "\n".join(paragraphs)


def is_valid_product_image(img_url: str) -> bool:
    low = img_url.lower()
    if any(bad in low for bad in BAD_IMAGE_PATTERNS):
        return False
    if low.endswith(".svg"):
        return False
    return "/upload/" in low


def extract_image_url(soup: BeautifulSoup, content: BeautifulSoup, page_url: str) -> Optional[str]:
    candidates = []

    for a in content.find_all("a", href=True):
        href = a["href"].strip()
        if any(href.lower().endswith(ext) for ext in (".jpg", ".jpeg", ".png", ".webp")):
            full_url = urljoin(page_url, href)
            if is_valid_product_image(full_url):
                candidates.append(full_url)

    for img in content.find_all("img"):
        src = img.get("data-src") or img.get("src")
        if not src:
            continue
        full_url = urljoin(page_url, src.strip())
        if is_valid_product_image(full_url):
            candidates.append(full_url)

    if candidates:
        return candidates[0]

    og_img = soup.find("meta", property="og:image")
    if og_img and og_img.get("content"):
        full_url = urljoin(page_url, og_img["content"].strip())
        if is_valid_product_image(full_url):
            return full_url

    return None


def is_product_page(url: str, soup: BeautifulSoup, content: BeautifulSoup, child_links: list[str]) -> bool:
    parsed = urlparse(url)
    if parsed.path.rstrip("/") == "/katalog":
        return False
    if "PAGEN_" in parsed.query:
        return False

    current_path = parsed.path.rstrip("/") + "/"
    deeper_links = [
        link for link in child_links
        if urlparse(link).path.startswith(current_path)
        and urlparse(link).path != current_path
    ]
    if deeper_links:
        return False

    has_table = bool(content.find("table"))
    has_description_heading = any(
        el.get_text(strip=True).lower() == "описание"
        for el in content.find_all(["h2", "h3", "h4", "div", "p", "strong"])
    )
    has_h1 = bool(soup.find("h1"))

    if has_h1 and (has_table or has_description_heading):
        return True

    depth = len([p for p in parsed.path.strip("/").split("/") if p])
    return has_h1 and depth >= 3 and len(child_links) <= 3


def sanitize_filename(name: str) -> str:
    cleaned = re.sub(r"[^\w\s-]", "", name, flags=re.UNICODE).strip()
    cleaned = re.sub(r"[-\s]+", "_", cleaned)
    return cleaned[:80] or "product"


def download_image(session: requests.Session, img_url: str, product_name: str) -> Optional[str]:
    try:
        resp = session.get(img_url, timeout=20, stream=True)
        resp.raise_for_status()

        ext = Path(urlparse(img_url).path).suffix.lower()
        if ext not in {".jpg", ".jpeg", ".png", ".webp", ".gif"}:
            ext = ".jpg"

        short_hash = hashlib.md5(img_url.encode("utf-8")).hexdigest()[:8]
        filename = f"{sanitize_filename(product_name)}_{short_hash}{ext}"
        filepath = IMAGES_DIR / filename

        with open(filepath, "wb") as f:
            for chunk in resp.iter_content(chunk_size=8192):
                if chunk:
                    f.write(chunk)

        return str(filepath)
    except Exception as exc:
        log(f"  [!] Не удалось скачать картинку {img_url}: {exc}")
        return None


def crawl_catalog(
    max_products: Optional[int] = DEFAULT_MAX_PRODUCTS,
    max_workers: int = DEFAULT_WORKERS,
    request_delay: float = DEFAULT_DELAY,
) -> list[dict]:
    if max_products is not None and max_products <= 0:
        max_products = None
    max_workers = max(1, max_workers)

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    IMAGES_DIR.mkdir(parents=True, exist_ok=True)

    queue = deque(normalize_url(u) for u in START_URLS)
    visited: set[str] = set()
    seen_product_urls: set[str] = set()
    products: list[dict] = []

    state_lock = threading.Lock()
    stop_event = threading.Event()
    reserved_count = 0

    def process_url(url: str) -> tuple[list[str], Optional[dict]]:
        nonlocal reserved_count

        if stop_event.is_set():
            return [], None

        if request_delay > 0:
            time.sleep(request_delay)

        log(f"[GET] {url}")
        session = get_thread_session()
        try:
            resp = session.get(url, timeout=20)
            resp.raise_for_status()
            if resp.encoding and resp.encoding.lower() == "iso-8859-1":
                resp.encoding = "utf-8"
        except Exception as exc:
            log(f"  [!] Ошибка загрузки {url}: {exc}")
            return [], None

        soup = BeautifulSoup(resp.text, "html.parser")
        content = get_main_content(soup)

        content_catalog_links = []
        all_catalog_links = []
        seen_on_page = set()

        for a in content.find_all("a", href=True):
            abs_url = normalize_url(urljoin(url, a["href"]))
            if is_catalog_url(abs_url):
                content_catalog_links.append(abs_url)
                if abs_url not in seen_on_page:
                    seen_on_page.add(abs_url)
                    all_catalog_links.append(abs_url)

        for a in soup.find_all("a", href=True):
            abs_url = normalize_url(urljoin(url, a["href"]))
            if is_catalog_url(abs_url) and abs_url not in seen_on_page:
                seen_on_page.add(abs_url)
                all_catalog_links.append(abs_url)

        if not (is_catalog_url(url) and is_product_page(url, soup, content, content_catalog_links)):
            return all_catalog_links, None

        # Резервируем слот под товар до скачивания картинки, чтобы не превысить max_products
        with state_lock:
            if url in seen_product_urls:
                return all_catalog_links, None
            if max_products is not None and reserved_count >= max_products:
                stop_event.set()
                return all_catalog_links, None

            seen_product_urls.add(url)
            reserved_count += 1
            current_num = reserved_count
            if max_products is not None and reserved_count >= max_products:
                stop_event.set()

        h1 = soup.find("h1")
        name = h1.get_text(" ", strip=True) if h1 else "Без названия"
        breadcrumbs = extract_breadcrumbs(soup, url)
        category = " / ".join(breadcrumbs[2:-1]) if len(breadcrumbs) > 3 else (
            breadcrumbs[-2] if len(breadcrumbs) >= 2 else ""
        )
        description = extract_description(content, name)
        specs = extract_specs_tables(content)
        image_url = extract_image_url(soup, content, url)
        image_path = download_image(session, image_url, name) if image_url else None

        product = {
            "name": name,
            "category": category,
            "url": url,
            "description": description,
            "specs": specs,
            "image_url": image_url,
            "image_path": image_path,
        }
        limit_str = f"/{max_products}" if max_products else ""
        log(f"  [+] Товар #{current_num}{limit_str}: {name} | Характеристик: {len(specs)} | Картинка: {'да' if image_path else 'нет'}")
        return all_catalog_links, product

    try:
        with ThreadPoolExecutor(max_workers=max_workers) as executor:
            in_flight: set[Future] = set()

            while (queue or in_flight) and not stop_event.is_set():
                # Держим в пуле небольшой запас задач (max_workers * 2)
                while queue and len(in_flight) < max_workers * 2 and not stop_event.is_set():
                    url = queue.popleft()
                    if url in visited:
                        continue
                    visited.add(url)
                    in_flight.add(executor.submit(process_url, url))

                if not in_flight:
                    break

                done, in_flight = wait(in_flight, return_when=FIRST_COMPLETED)
                for future in done:
                    try:
                        new_links, product = future.result()
                    except Exception as exc:
                        log(f"  [!] Ошибка в потоке: {exc}")
                        continue

                    if product is not None:
                        products.append(product)

                    if not stop_event.is_set():
                        for link in new_links:
                            if link not in visited:
                                queue.append(link)

            # Если достигли лимита — отменяем не начатые задачи и дожидаемся текущих
            if in_flight:
                for future in list(in_flight):
                    future.cancel()
                done, _ = wait(in_flight)
                for future in done:
                    if future.cancelled():
                        continue
                    try:
                        _, product = future.result()
                        if product is not None:
                            products.append(product)
                    except Exception as exc:
                        log(f"  [!] Ошибка в завершающем потоке: {exc}")
    finally:
        with sessions_lock:
            for sess in created_sessions:
                sess.close()
            created_sessions.clear()

    return products


def save_results(products: list[dict]) -> None:
    json_path = OUTPUT_DIR / "products.json"
    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(products, f, ensure_ascii=False, indent=2)

    csv_path = OUTPUT_DIR / "products.csv"
    fieldnames = ["name", "category", "url", "description", "specs", "image_url", "image_path"]
    with open(csv_path, "w", encoding="utf-8-sig", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        for item in products:
            row = item.copy()
            row["specs"] = json.dumps(item["specs"], ensure_ascii=False)
            writer.writerow(row)

    print(f"\nГотово! Собрано товаров: {len(products)}")
    print(f"JSON: {json_path}")
    print(f"CSV:  {csv_path}")
    print(f"Фото: {IMAGES_DIR}")


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Парсер каталога milk.by")
    parser.add_argument(
        "-l", "--limit",
        type=int,
        default=DEFAULT_MAX_PRODUCTS or 0,
        help="Максимум товаров для сбора (0 = без ограничений, по умолчанию: %(default)s)",
    )
    parser.add_argument(
        "-w", "--workers",
        type=int,
        default=DEFAULT_WORKERS,
        help="Количество параллельных потоков (по умолчанию: %(default)s)",
    )
    parser.add_argument(
        "-d", "--delay",
        type=float,
        default=DEFAULT_DELAY,
        help="Пауза в секундах на поток между запросами (по умолчанию: %(default)s)",
    )
    return parser.parse_args()


if __name__ == "__main__":
    args = parse_args()
    max_items = args.limit if args.limit > 0 else None
    data = crawl_catalog(
        max_products=max_items,
        max_workers=args.workers,
        request_delay=args.delay,
    )
    save_results(data)
