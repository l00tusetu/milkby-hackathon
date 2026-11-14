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
