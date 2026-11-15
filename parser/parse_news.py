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
from bs4 import BeautifulSoup, Tag
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry

BASE_URL = "https://milk.by"

SECTIONS = {
    "novosti": ("Новости Молочного Мира", "https://milk.by/novosti/"),
    "respublikanskie": ("Республиканские новости", "https://milk.by/respublikanskie-novosti/"),
}

SECTION_TITLES = {"Новости Молочного Мира", "Республиканские новости", "Новости"}

# Настройки по умолчанию (можно менять здесь или через аргументы CLI)
DEFAULT_MAX_NEWS: Optional[int] = None  # None или 0 = без ограничений
DEFAULT_WORKERS = 5
DEFAULT_DELAY = 0.2

OUTPUT_DIR = Path("output_news")
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
    "favicon",
)

MONTH_YEAR_RE = re.compile(
    r"\b(?:Январь|Февраль|Март|Апрель|Май|Июнь|Июль|Август|Сентябрь|Октябрь|Ноябрь|Декабрь)\s+\d{4}\b",
    re.IGNORECASE,
)

SOURCE_RE = re.compile(r"Источник:\s*(.+)", re.IGNORECASE)

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
    parsed = urlparse(url)
    path = parsed.path or "/"
    if path != "/" and not path.endswith("/") and "." not in Path(path).name:
        path += "/"

    qs = parse_qs(parsed.query)
    pagen_qs = {k: v[0] for k, v in qs.items() if k.startswith("PAGEN_")}
    query = urlencode(sorted(pagen_qs.items())) if pagen_qs else ""

    return urlunparse((parsed.scheme, parsed.netloc, path, "", query, ""))


def is_ignored_raw_href(raw_url: str) -> bool:
    low = raw_url.strip().lower()
    if not low or low.startswith("#"):
        return True
    if any(proto in low for proto in ("tel:", "mailto:", "javascript:", "viber:", "tg:")):
        return True
    if "print=y" in low or "print=yes" in low:
        return True
    return False


def get_allowed_prefixes(section_choice: str) -> tuple[str, ...]:
    if section_choice == "novosti":
        return ("/novosti/",)
    if section_choice == "respublikanskie":
        return ("/respublikanskie-novosti/",)
    return ("/novosti/", "/respublikanskie-novosti/")


def is_news_url(url: str, allowed_prefixes: tuple[str, ...]) -> bool:
    parsed = urlparse(url)
    if parsed.scheme not in {"http", "https"}:
        return False
    if parsed.netloc and parsed.netloc != urlparse(BASE_URL).netloc:
        return False
    if ":" in parsed.path:
        return False
    path_lower = parsed.path.lower()
    if any(path_lower.endswith(ext) for ext in SKIP_EXTENSIONS):
        return False
    return any(path_lower.startswith(prefix) for prefix in allowed_prefixes)


def is_listing_page(url: str) -> bool:
    parsed = urlparse(url)
    path = parsed.path.rstrip("/")
    if path in {"/novosti", "/respublikanskie-novosti"}:
        return True
    return "PAGEN_" in parsed.query


def detect_section_name(url: str) -> str:
    if urlparse(url).path.lower().startswith("/respublikanskie-novosti/"):
        return SECTIONS["respublikanskie"][0]
    return SECTIONS["novosti"][0]


def get_listing_container(soup: BeautifulSoup) -> Tag:
    soup_copy = BeautifulSoup(str(soup), "html.parser")
    for tag in soup_copy.select("header, footer, nav, script, style, noscript"):
        tag.decompose()
    for selector in ("main", ".content", "#content", ".news-list"):
        block = soup_copy.select_one(selector)
        if block:
            return block
    return soup_copy.body or soup_copy


def extract_article_title(soup: BeautifulSoup, container: Tag) -> str:
    # 1. Если h1 — не название раздела, берём его
    h1 = soup.find("h1")
    if h1:
        h1_text = h1.get_text(" ", strip=True)
        if h1_text and h1_text not in SECTION_TITLES:
            return h1_text

    # 2. Последний элемент хлебных крошек на странице новости
    for sel in (".breadcrumb", ".breadcrumbs", ".bx-breadcrumb", "[itemtype*='BreadcrumbList']"):
        bc = soup.select_one(sel)
        if bc:
            items = [
                el.get_text(" ", strip=True)
                for el in bc.select("a, span, li")
                if el.get_text(" ", strip=True)
            ]
            items = [x for x in dict.fromkeys(items) if x not in {"/", ">", "»", "·", "-"}]
            if items:
                last_item = items[-1]
                if last_item not in SECTION_TITLES and last_item != "Главная":
                    return last_item

    # 3. Заголовок h2 внутри контейнера самой статьи
    h2 = container.find("h2")
    if h2:
        h2_text = h2.get_text(" ", strip=True)
        if h2_text and h2_text not in SECTION_TITLES:
            return h2_text

    # 4. Тег <title> без суффикса сайта
    if soup.title and soup.title.string:
        raw_title = soup.title.string.strip()
        cleaned = re.split(r"\s*[|—-]\s*Молочный Мир.*$", raw_title, flags=re.IGNORECASE)[0].strip()
        if cleaned and cleaned not in SECTION_TITLES:
            return cleaned

    return ""


def get_article_container(soup: BeautifulSoup) -> Tag:
    """
    Выделяет контейнер самой статьи без шапки, меню, подвала и нижнего блока "Другие новости".
    """
    soup_copy = BeautifulSoup(str(soup), "html.parser")
    for tag in soup_copy.select("header, footer, nav, script, style, noscript, iframe"):
        tag.decompose()

    for bc in soup_copy.select(".breadcrumb, .breadcrumbs, .bx-breadcrumb, [itemtype*='BreadcrumbList']"):
        bc.decompose()

    for selector in (".news-detail", ".news_detail", "article"):
        block = soup_copy.select_one(selector)
        if block:
            return block

    container = None
    for selector in ("main", ".content", "#content"):
        container = soup_copy.select_one(selector)
        if container:
            break
    if container is None:
        container = soup_copy.body or soup_copy

    # Убираем <h1>, если это баннерный заголовок раздела
    for h1 in container.find_all("h1"):
        if h1.get_text(" ", strip=True) in SECTION_TITLES:
            h1.decompose()

    # Отсекаем всё начиная с "Версия для печати" (ниже идут 5 последних новостей)
    print_el = container.find(
        lambda t: t.name in ("a", "button", "div", "span")
        and "версия для печати" in t.get_text(" ", strip=True).lower()
    )
    if print_el:
        target = print_el
        while target.parent and target.parent is not container and len(list(target.parent.find_all("p"))) <= 1:
            target = target.parent
        for sib in list(target.find_next_siblings()):
            sib.decompose()
        target.decompose()

    # Убираем карточки со ссылкой "Подробнее" (блок других новостей)
    for a in list(container.find_all("a")):
        if a.get_text(strip=True).lower() == "подробнее":
            card = a.parent
            if card and card is not container:
                card.decompose()

    return container


def is_valid_news_image(img_url: str) -> bool:
    low = img_url.lower()
    if any(bad in low for bad in BAD_IMAGE_PATTERNS):
        return False
    if low.endswith(".svg"):
        return False
    return "/upload/" in low


def extract_article_images(soup: BeautifulSoup, container: Tag, page_url: str) -> list[str]:
    urls: list[str] = []
    seen: set[str] = set()

    def add_url(raw: str) -> None:
        if is_ignored_raw_href(raw):
            return
        full = urljoin(page_url, raw.strip())
        if is_valid_news_image(full) and full not in seen:
            seen.add(full)
            urls.append(full)

    for a in container.find_all("a", href=True):
        href = a["href"].strip()
        if any(href.lower().endswith(ext) for ext in (".jpg", ".jpeg", ".png", ".webp")):
            add_url(href)

    for img in container.find_all("img"):
        src = img.get("data-src") or img.get("src")
        if src:
            add_url(src)

    if not urls:
        og_img = soup.find("meta", property="og:image")
        if og_img and og_img.get("content"):
            add_url(og_img["content"])

    return urls


def extract_date_and_source(container: Tag, raw_text: str) -> tuple[str, str]:
    date_str = ""
    source_str = ""

    for sel in ("time", ".news-date-time", ".date", "[itemprop='datePublished']"):
        el = container.select_one(sel)
        if el:
            val = el.get_text(" ", strip=True)
            if val:
                date_str = val
                break

    source_match = SOURCE_RE.search(raw_text)
    if source_match:
        source_str = source_match.group(1).strip()

    if not date_str:
        m = MONTH_YEAR_RE.search(raw_text)
        if m:
            date_str = m.group(0)

    return date_str, source_str


def extract_article_text(container: Tag, title: str, date_str: str) -> str:
    for el in container.find_all(["a", "button", "span", "div"]):
        txt = el.get_text(" ", strip=True).lower()
        if txt == "версия для печати":
            el.decompose()

    paragraphs = []
    for block in container.find_all(["p", "li", "h2", "h3", "h4"]):
        if block.name == "li" and block.find_parent("p"):
            continue
        text = block.get_text(" ", strip=True)
        if not text:
            continue
        if text in SECTION_TITLES or text == title or text == date_str:
            continue
        if re.fullmatch(r"[\w\s().-]+\.(?:jpg|jpeg|png|webp)", text, re.IGNORECASE):
            continue
        paragraphs.append(text)

    if not paragraphs:
        fallback = container.get_text("\n", strip=True)
        lines = []
        for line in fallback.splitlines():
            line = line.strip()
            if not line or line in SECTION_TITLES or line in {title, date_str, "Версия для печати"}:
                continue
            if re.fullmatch(r"[\w\s().-]+\.(?:jpg|jpeg|png|webp)", line, re.IGNORECASE):
                continue
            lines.append(line)
        return "\n".join(lines)

    return "\n".join(paragraphs)


def sanitize_filename(name: str) -> str:
    cleaned = re.sub(r"[^\w\s-]", "", name, flags=re.UNICODE).strip()
    cleaned = re.sub(r"[-\s]+", "_", cleaned)
    return cleaned[:70] or "news"


def download_image(session: requests.Session, img_url: str, title: str, idx: int) -> Optional[str]:
    try:
        resp = session.get(img_url, timeout=20, stream=True)
        resp.raise_for_status()

        ext = Path(urlparse(img_url).path).suffix.lower()
        if ext not in {".jpg", ".jpeg", ".png", ".webp", ".gif"}:
            ext = ".jpg"

        short_hash = hashlib.md5(img_url.encode("utf-8")).hexdigest()[:8]
        filename = f"{sanitize_filename(title)}_{idx}_{short_hash}{ext}"
        filepath = IMAGES_DIR / filename

        with open(filepath, "wb") as f:
            for chunk in resp.iter_content(chunk_size=8192):
                if chunk:
                    f.write(chunk)

        return str(filepath)
    except Exception as exc:
        log(f"  [!] Не удалось скачать картинку {img_url}: {exc}")
        return None


def crawl_news(
    section_choice: str = "all",
    max_news: Optional[int] = DEFAULT_MAX_NEWS,
    max_workers: int = DEFAULT_WORKERS,
    request_delay: float = DEFAULT_DELAY,
    download_images: bool = True,
) -> list[dict]:
    if max_news is not None and max_news <= 0:
        max_news = None
    max_workers = max(1, max_workers)

    allowed_prefixes = get_allowed_prefixes(section_choice)
    start_urls = (
        [SECTIONS[section_choice][1]]
        if section_choice in SECTIONS
        else [SECTIONS["novosti"][1], SECTIONS["respublikanskie"][1]]
    )

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    if download_images:
        IMAGES_DIR.mkdir(parents=True, exist_ok=True)

    queue: deque[str] = deque(normalize_url(u) for u in start_urls)
    visited: set[str] = set()
    seen_article_urls: set[str] = set()
    articles: list[dict] = []

    state_lock = threading.Lock()
    stop_event = threading.Event()
    reserved_count = 0

    def process_url(url: str) -> tuple[list[str], list[str], Optional[dict]]:
        nonlocal reserved_count

        if stop_event.is_set():
            return [], [], None

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
            return [], [], None

        soup = BeautifulSoup(resp.text, "html.parser")

        article_links: list[str] = []
        pagination_links: list[str] = []
        seen_local: set[str] = set()

        if is_listing_page(url):
            listing_box = get_listing_container(soup)
            for a in listing_box.find_all("a", href=True):
                raw_href = a["href"]
                if is_ignored_raw_href(raw_href):
                    continue
                abs_url = normalize_url(urljoin(url, raw_href))
                if not is_news_url(abs_url, allowed_prefixes) or abs_url in seen_local:
                    continue
                seen_local.add(abs_url)

                if is_listing_page(abs_url):
                    pagination_links.append(abs_url)
                else:
                    article_links.append(abs_url)

            return article_links, pagination_links, None

        container = get_article_container(soup)
        title = extract_article_title(soup, container)
        if not title:
            log(f"  [!] Пропуск (не найден заголовок): {url}")
            return [], [], None

        with state_lock:
            if url in seen_article_urls:
                return [], [], None
            if max_news is not None and reserved_count >= max_news:
                stop_event.set()
                return [], [], None

            seen_article_urls.add(url)
            reserved_count += 1
            current_num = reserved_count
            if max_news is not None and reserved_count >= max_news:
                stop_event.set()

        raw_text = container.get_text("\n", strip=True)
        date_str, source_str = extract_date_and_source(container, raw_text)
        text = extract_article_text(container, title, date_str)
        image_urls = extract_article_images(soup, container, url)

        image_paths: list[str] = []
        if download_images and image_urls:
            for idx, img_url in enumerate(image_urls, start=1):
                saved = download_image(session, img_url, title, idx)
                if saved:
                    image_paths.append(saved)

        article = {
            "section": detect_section_name(url),
            "title": title,
            "date": date_str,
            "source": source_str,
            "url": url,
            "text": text,
            "images": image_urls,
            "image_paths": image_paths,
        }
        limit_str = f"/{max_news}" if max_news else ""
        log(
            f"  [+] Новость #{current_num}{limit_str}: {title[:65]} "
            f"| Дата: {date_str or '-'} | Фото: {len(image_urls)}"
        )
        return [], [], article

    try:
        with ThreadPoolExecutor(max_workers=max_workers) as executor:
            in_flight: set[Future] = set()

            while (queue or in_flight) and not stop_event.is_set():
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
                        article_links, pagination_links, article = future.result()
                    except Exception as exc:
                        log(f"  [!] Ошибка в потоке: {exc}")
                        continue

                    if article is not None:
                        articles.append(article)

                    if not stop_event.is_set():
                        for link in reversed(article_links):
                            if link not in visited:
                                queue.appendleft(link)
                        for link in pagination_links:
                            if link not in visited:
                                queue.append(link)

            if in_flight:
                for future in list(in_flight):
                    future.cancel()
                done, _ = wait(in_flight)
                for future in done:
                    if future.cancelled():
                        continue
                    try:
                        _, _, article = future.result()
                        if article is not None:
                            articles.append(article)
                    except Exception as exc:
                        log(f"  [!] Ошибка в завершающем потоке: {exc}")
    finally:
        with sessions_lock:
            for sess in created_sessions:
                sess.close()
            created_sessions.clear()

    return articles


def save_results(articles: list[dict]) -> None:
    json_path = OUTPUT_DIR / "news.json"
    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(articles, f, ensure_ascii=False, indent=2)

    csv_path = OUTPUT_DIR / "news.csv"
    fieldnames = ["section", "title", "date", "source", "url", "text", "images", "image_paths"]
    with open(csv_path, "w", encoding="utf-8-sig", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        for item in articles:
            row = item.copy()
            row["images"] = json.dumps(item["images"], ensure_ascii=False)
            row["image_paths"] = json.dumps(item["image_paths"], ensure_ascii=False)
            writer.writerow(row)

    print(f"\nГотово! Собрано новостей: {len(articles)}")
    print(f"JSON: {json_path}")
    print(f"CSV:  {csv_path}")
    print(f"Фото: {IMAGES_DIR}")


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Парсер новостей milk.by")
    parser.add_argument(
        "-s", "--section",
        choices=("all", "novosti", "respublikanskie"),
        default="all",
        help="Какой раздел парсить (по умолчанию: all)",
    )
    parser.add_argument(
        "-l", "--limit",
        type=int,
        default=DEFAULT_MAX_NEWS or 0,
        help="Максимум новостей для сбора (0 = без ограничений, по умолчанию: %(default)s)",
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
    parser.add_argument(
        "--no-images",
        action="store_true",
        help="Не скачивать файлы изображений (сохранить только ссылки в JSON/CSV)",
    )
    return parser.parse_args()


if __name__ == "__main__":
    args = parse_args()
    max_items = args.limit if args.limit > 0 else None
    data = crawl_news(
        section_choice=args.section,
        max_news=max_items,
        max_workers=args.workers,
        request_delay=args.delay,
        download_images=not args.no_images,
    )
    save_results(data)
