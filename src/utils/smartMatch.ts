import { Category, Language, PackageVariant, Product } from '../types';

export interface SmartCriterion {
  id: string;
  label: string;
}

export interface SmartMatchResult {
  product: Product;
  score: number;
  reasons: string[];
  recommendedPackage?: PackageVariant;
}

export interface SmartSearchResponse {
  results: SmartMatchResult[];
  criteria: SmartCriterion[];
  correctedQuery?: string;
}

type IntentKey =
| 'pizza'
| 'lactoseFree'
| 'highProtein'
| 'noSugar'
| 'wine'
| 'baking'
| 'coffee'
| 'export'
| 'longShelf'
| 'dessert'
| 'lowFat';

const INTENT_REASONS: Record<IntentKey, Record<Language, string>> = {
  pizza: {
    ru: 'Отлично плавится и подходит для пиццы, пасты и запекания',
    be: 'Выдатна плавіцца і падыходзіць для піцы, пасты і запякання',
    en: 'Ideal melting texture for pizza, pasta, and baking',
    zh: '适合披萨烤制、意大利面及高温焗烤',
  },
  lactoseFree: {
    ru: 'Без лактозы или низколактозный состав',
    be: 'Без лактозы або нізкалактозны склад',
    en: 'Lactose-free or reduced-lactose formula',
    zh: '无乳糖或低乳糖配方',
  },
  highProtein: {
    ru: 'Высокое содержание натурального молочного белка',
    be: 'Высокае ўтрыманне натуральнага малочнага бялку',
    en: 'High natural dairy protein content',
    zh: '高天然乳蛋白含量',
  },
  noSugar: {
    ru: 'Чистый состав без добавленного сахара',
    be: 'Чысты склад без дададзенага цукру',
    en: 'Clean label with zero added sugar',
    zh: '零添加蔗糖，配方纯净',
  },
  wine: {
    ru: 'Богатый букет и текстура для сырной тарелки и вина',
    be: 'Багаты букет і тэкстура для сырнай талеркі і віна',
    en: 'Complex aged aroma & texture tailored for wine pairing',
    zh: '风味层次丰富，适合搭配葡萄酒品鉴',
  },
  baking: {
    ru: 'Идеально для выпечки, кремов, десертов и ганаша',
    be: 'Ідэальна для выпечкі, крэмаў і кандытаркі',
    en: 'Reliable milkfat structure for pastry, creams, and baking',
    zh: '乳脂稳定，适合烘焙、打发奶油与甜点制作',
  },
  coffee: {
    ru: 'Подходит для кофе, капучино, латте и бариста',
    be: 'Падыходзіць для кавы, капучына і барыста',
    en: 'Formulated for coffee, latte foam, and barista use',
    zh: '适用于咖啡调配、拿铁拉花与专业咖啡吧台',
  },
  export: {
    ru: 'Экспортная упаковка B2B, сертификаты FSSC 22000 / ISO / GACC',
    be: 'Экспартная ўпакоўка B2B, сертыфікаты FSSC 22000 / ISO / GACC',
    en: 'B2B export-ready packaging with FSSC 22000 / ISO / GACC docs',
    zh: 'B2B 出口专供包装，具备 FSSC 22000 / ISO / GACC 认证',
  },
  longShelf: {
    ru: 'Увеличенный срок годности для логистики и хранения',
    be: 'Павялічаны тэрмін прыдатнасці для лагістыкі і захоўвання',
    en: 'Extended shelf life for ambient or long-haul storage',
    zh: '超长保质期，方便仓储与长途冷链/常温物流',
  },
  dessert: {
    ru: 'Натуральный сливочный десерт или сладкий перекус',
    be: 'Натуральны сметанковы дэсерт або салодкі перакус',
    en: 'Natural dairy dessert made from fresh cream or tvorog',
    zh: '天然奶油与凝乳制作的美味乳制甜品',
  },
  lowFat: {
    ru: 'Лёгкий продукт с пониженной жирностью',
    be: 'Лёгкі прадукт з паніжанай тлустасцю',
    en: 'Light dairy option with low milkfat content',
    zh: '低乳脂轻负担选择',
  },
};

const INTENT_CRITERIA_LABELS: Record<IntentKey, Record<Language, string>> = {
  pizza: { ru: 'Для пиццы / HoReCa', be: 'Для піцы / HoReCa', en: 'Pizza / HoReCa', zh: '披萨 / 餐饮' },
  lactoseFree: { ru: 'Без лактозы', be: 'Без лактозы', en: 'Lactose-Free', zh: '无乳糖' },
  highProtein: { ru: 'Высокий белок', be: 'Высокі бялок', en: 'High Protein', zh: '高蛋白' },
  noSugar: { ru: 'Без сахара', be: 'Без цукру', en: 'No Added Sugar', zh: '无糖' },
  wine: { ru: 'К вину / дегустация', be: 'Да віна / дэгустацыя', en: 'Wine Pairing', zh: '葡萄酒品鉴' },
  baking: { ru: 'Для выпечки и крема', be: 'Для выпечкі і крэму', en: 'Baking & Pastry', zh: '烘焙甜点' },
  coffee: { ru: 'Для кофе', be: 'Для кавы', en: 'Coffee & Barista', zh: '咖啡搭配' },
  export: { ru: 'Экспорт / B2B', be: 'Экспарт / B2B', en: 'Export / B2B', zh: '出口 / B2B' },
  longShelf: { ru: 'Длительное хранение', be: 'Працяглае захоўванне', en: 'Long Shelf Life', zh: '长保质期' },
  dessert: { ru: 'Десерты', be: 'Дэсерты', en: 'Desserts', zh: '甜品' },
  lowFat: { ru: 'Низкая жирность', be: 'Нізкая тлустасць', en: 'Low Fat', zh: '低脂' },
};

const CATEGORY_KEYWORDS: { categoryId: string; pattern: RegExp; labels: Record<Language, string> }[] = [
  {
    categoryId: 'cheese',
    pattern: /(?:^|\s)(сыр\p{L}*|моцарел\p{L}*|мацарэл\p{L}*|городен\p{L}*|горадзен\p{L}*|кронес\p{L}*|губерт|вежа|рочестер|таллер|гауда|тильзитер|пармезан|российск\p{L}*|голландск\p{L}*|сметанков\p{L}*|пошехонск\p{L}*|костромск\p{L}*|плавлен\p{L}*|колбасн\p{L}*|cream\s*cheese|cheese\p{L}*|奶酪|芝士|干酪)/iu,
    labels: { ru: 'Сыры', be: 'Сыры', en: 'Cheeses', zh: '奶酪' },
  },
{
  categoryId: 'milk',
  pattern: /(?:^|\s)(молок\p{L}*|малак\p{L}*|milk|uht|тетрапак|tetra\s*pak|пастериз\p{L}*|ультрапастериз\p{L}*|стерилиз\p{L}*|топлен\p{L}*|牛奶|鲜奶|纯奶)/iu,
  labels: { ru: 'Молоко', be: 'Малако', en: 'Milk', zh: '牛奶' },
},
{
  categoryId: 'fermented',
  pattern: /(?:^|\s)(кефир\p{L}*|кефір\p{L}*|кефер\p{L}*|kefir|ряженк\p{L}*|ражанк\p{L}*|бифитат|біфітат|простокваш\p{L}*|прастакваш\p{L}*|айран|дарайран|кисломолоч\p{L}*|кісламалоч\p{L}*|пробиотик\p{L}*|开菲尔|发酵乳)/iu,
  labels: { ru: 'Кисломолочное', be: 'Кісламалочнае', en: 'Fermented Dairy', zh: '发酵乳' },
},
{
  categoryId: 'yogurt',
  pattern: /(?:^|\s)(йогурт\p{L}*|ёгурт\p{L}*|егурт\p{L}*|yog[hu]?urt\p{L}*|греческ\p{L}*|грэчаск\p{L}*|greek|diavita|bubble|його|фрут|фит|酸奶)/iu,
  labels: { ru: 'Йогурты', be: 'Ёгурты', en: 'Yogurts', zh: '酸奶' },
},
{
  categoryId: 'sour-cream',
  pattern: /(?:^|\s)(сметан\p{L}*|смятан\p{L}*|sour\s*cream|酸奶油)/iu,
  labels: { ru: 'Сметана', be: 'Смятана', en: 'Sour Cream', zh: '酸奶油' },
},
{
  categoryId: 'tvorog',
  pattern: /(?:^|\s)(творог\p{L}*|тварог\p{L}*|творож\p{L}*|твараж\p{L}*|tvorog|cottage|формован\p{L}*|рассыпчат\p{L}*|клинок|凝乳)/iu,
  labels: { ru: 'Творог', be: 'Тварог', en: 'Tvorog', zh: '凝乳干酪' },
},
{
  categoryId: 'butter',
  pattern: /(?:^|\s)(масл\p{L}*|butter|сладкосливоч\p{L}*|кислосливоч\p{L}*|монолит|黄油)/iu,
  labels: { ru: 'Масло', be: 'Масла', en: 'Butter', zh: '黄油' },
},
{
  categoryId: 'ice-cream',
  pattern: /(?:^|\s)(морожен+\p{L}*|марозі\p{L}*|пломбир\p{L}*|пламбір\p{L}*|ice\s*cream|plombir|эскимо|рожок|рожк\p{L}*|пушок|шайба|tropic|ice\s*time|bela\s*bovino|сорбит|туб\p{L}*|冰淇淋)/iu,
  labels: { ru: 'Мороженое', be: 'Марозіва', en: 'Ice Cream', zh: '冰淇淋' },
},
{
  categoryId: 'cream',
  pattern: /(?:^|\s)(сливк\p{L}*|сливок|вяршк\p{L}*|cream|whipping|сливочн\p{L}*\s+крем|взбиван\p{L}*|ўзбіван\p{L}*|33%|稀奶油|淡奶油)/iu,
  labels: { ru: 'Сливки', be: 'Вяршкі', en: 'Cream', zh: '稀奶油' },
},
{
  categoryId: 'desserts',
  pattern: /(?:^|\s)(сырок|сырки|сырк\p{L}*|глазир\p{L}*|глазур\p{L}*|картошк\p{L}*|симфони\p{L}*|крем\s+творож\p{L}*|curd\s*bar|десерт\p{L}*|дэсерт\p{L}*|甜品|凝乳棒)/iu,
  labels: { ru: 'Десерты', be: 'Дэсерты', en: 'Desserts', zh: '乳制甜品' },
},
{
  categoryId: 'dry-dairy',
  pattern: /(?:^|\s)(сом|сам|пмс|зцм|сд-40|smp|сух\p{L}*\s+молок\p{L}*|сухое|сыворот\p{L}*\s+сух\p{L}*|деминерализ\p{L}*|milk\s*powder|powder|мешок|мешк\p{L}*|крафт|25\s*кг|奶粉)/iu,
  labels: { ru: 'Сухие молочные продукты', be: 'Сухія прадукты', en: 'Dry Dairy (SMP)', zh: '干乳制品' },
},
{
  categoryId: 'water',
  pattern: /(?:^|\s)(вод\p{L}*|aqua|аква|коложск\p{L}*|родная|питьев\p{L}*|минеральн\p{L}*|бутыл\p{L}*\s+19|доставк\p{L}*\s+вод\p{L}*|water|矿泉水|饮用水)/iu,
  labels: { ru: 'Вода', be: 'Вада', en: 'Water', zh: '饮用水' },
},
{
  categoryId: 'other',
  pattern: /(?:^|\s)(био-ритм|биор[иі]тм|coffee\s*break|напиток|напой|сывороточн\p{L}*|whey|коктейл\p{L}*|乳清)/iu,
  labels: { ru: 'Напитки', be: 'Напоі', en: 'Milk & Whey Drinks', zh: '乳清饮品' },
},
];

const STOPWORDS = new Set([
  'мне', 'нужен', 'нужна', 'нужно', 'нужны', 'хочу', 'ищу', 'посоветуй', 'посоветуйте',
  'подбери', 'подберите', 'найти', 'найди', 'покажи', 'для', 'или', 'без', 'под', 'про',
  'при', 'над', 'как', 'что', 'какой', 'какая', 'какое', 'какие', 'есть', 'продукт',
  'продукты', 'продукта', 'продуктов', 'продукция', 'продукции', 'товар', 'товары',
  'содержанием', 'уровнем', 'высоким', 'хороший', 'лучший', 'самый', 'очень', 'на', 'со',
  'от', 'до', 'по', 'из', 'за', 'патрэбен', 'патрэбна', 'трэба', 'шукаю', 'прадукт',
  'прадукты', 'i', 'need', 'want', 'looking', 'for', 'with', 'and', 'or', 'the', 'a', 'an',
  'product', 'products', 'dairy', 'best', 'good', 'some', 'any', 'find', 'show', 'me',
]);

const EN_TO_RU_MAP: Record<string, string> = {
  q: 'й', w: 'ц', e: 'у', r: 'к', t: 'е', y: 'н', u: 'г', i: 'ш', o: 'щ', p: 'з',
  '[': 'х', ']': 'ъ', a: 'ф', s: 'ы', d: 'в', f: 'а', g: 'п', h: 'р', j: 'о', k: 'л',
  l: 'д', ';': 'ж', "'": 'э', z: 'я', x: 'ч', c: 'с', v: 'м', b: 'и', n: 'т', m: 'ь',
  ',': 'б', '.': 'ю',
};

const SYNONYM_GROUPS: string[][] = [
  ['моцарелл', 'моцарел', 'мацарэл', 'mozzarell', 'mozarell'],
['городен', 'горадзен', 'goroden', 'пармезан', 'выдержан'],
['молок', 'малак', 'milk'],
['сом', 'сам', 'smp', 'порошок', 'powder', 'сухое'],
['йогурт', 'егурт', 'yogurt', 'yoghurt'],
['творог', 'тварог', 'творож', 'твараж', 'tvorog', 'cottage'],
['сырок', 'сырк', 'глазир', 'глазур', 'curd'],
['масл', 'butter'],
['сливк', 'сливок', 'вяршк', 'cream'],
['сметан', 'смятан', 'sour'],
['кефир', 'кефір', 'кефер', 'kefir'],
['морожен', 'марозі', 'пломбир', 'пламбір', 'plombir', 'ice'],
['сыворот', 'сыроват', 'whey'],
['белок', 'белк', 'бялок', 'бялк', 'протеин', 'protein'],
['лактоз', 'lactose'],
['пицц', 'піц', 'pizza'],
['выпечк', 'кандытар', 'кондитер', 'pastry', 'baking'],
['экспорт', 'экспарт', 'export', 'horeca', 'опт', 'b2b'],
['вод', 'aqua', 'аква', 'water'],
];

function normalizeText(input: string): string {
  return input
  .toLowerCase()
  .replace(/ё/g, 'е')
  .replace(/(\d),(\d)/g, '$1.$2')
  .replace(/[«»"'`()[\]]/g, ' ')
  .replace(/\s+/g, ' ')
  .trim();
}

function decodeKeyboardLayout(raw: string): string | null {
  const trimmed = raw.trim().toLowerCase();
  if (!trimmed || !/^[a-z[\];',.\s]+$/.test(trimmed)) return null;
  if (/(milk|cheese|pizza|yogurt|butter|cream|kefir|ice|wine|protein|lactose|export|powder|sugar|baking|coffee|water|aqua|goroden)/i.test(trimmed)) {
    return null;
  }
  const converted = trimmed
  .split('')
  .map((ch) => EN_TO_RU_MAP[ch] ?? ch)
  .join('');
  if (!/[аеиоуыэюя]/.test(converted)) return null;
  return converted;
}

function stemToken(token: string): string {
  if (token.length <= 3) return token;
  let t = token.replace(/ё/g, 'е');
  if (/^бело?к/.test(t)) return 'белк';
  if (/^сливо?к/.test(t)) return 'сливк';
  if (/^сыро?к/.test(t)) return 'сырк';

  if (/[а-яіў]/.test(t) && t.length >= 5) {
    const stripped = t.replace(
      /(ами|ями|ого|его|ому|ему|ыми|ими|ах|ях|ов|ев|ей|ом|ем|ую|юю|ое|ее|ые|ие|ой|ий|ый|ая|яя|ы|и|а|я|у|ю|о|е|ь)$/,
                               ''
    );
    if (stripped.length >= 3) t = stripped;
  } else if (/^[a-z]+$/.test(t) && t.length >= 5) {
    const stripped = t.replace(/(ies|es|s|ing|ed)$/, '');
    if (stripped.length >= 4) t = stripped;
  }
  return t;
}

function levenshteinBounded(a: string, b: string, maxDist: number): number {
  if (Math.abs(a.length - b.length) > maxDist) return maxDist + 1;
  if (a === b) return 0;
  const lenA = a.length;
  const lenB = b.length;
  let prev = Array.from({ length: lenB + 1 }, (_, j) => j);

  for (let i = 1; i <= lenA; i++) {
    const curr = [i];
    let rowMin = curr[0];
    for (let j = 1; j <= lenB; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      const val = Math.min(prev[j] + 1, curr[j - 1] + 1, prev[j - 1] + cost);
      curr.push(val);
      if (val < rowMin) rowMin = val;
    }
    if (rowMin > maxDist) return maxDist + 1;
    prev = curr;
  }
  return prev[lenB];
}

function expandSynonyms(stem: string): string[] {
  const expanded = new Set<string>([stem]);
  for (const group of SYNONYM_GROUPS) {
    if (group.some((alias) => stem.startsWith(alias) || alias.startsWith(stem))) {
      for (const alias of group) expanded.add(alias);
    }
  }
  return Array.from(expanded);
}

function extractTokens(normQuery: string): string[] {
  const tokens = new Set<string>();
  const words = normQuery.match(/[a-zа-яіў0-9%.-]+/gi) || [];
  for (const raw of words) {
    const w = raw.replace(/^[.-]+|[.-]+$/g, '');
    if (!w || w.length < 2) continue;
    if (STOPWORDS.has(w)) continue;
    tokens.add(w);
  }

  const cjkRuns = normQuery.match(/[\u4e00-\u9fff]+/g) || [];
  for (const run of cjkRuns) {
    if (run.length <= 2) {
      tokens.add(run);
    } else {
      tokens.add(run);
      for (let i = 0; i <= run.length - 2; i++) {
        tokens.add(run.slice(i, i + 2));
      }
    }
  }
  return Array.from(tokens);
}

function parseShelfLifeDays(text: string): number {
  const nums = text.match(/\d+/g);
  if (!nums || nums.length === 0) return 0;
  const val = parseInt(nums[0], 10);
  if (!Number.isFinite(val)) return 0;
  if (/год|года|лет|year|年/i.test(text)) return val * 365;
  if (/месяц|мес|month|月/i.test(text)) return val * 30;
  return val;
}

interface ParsedQuery {
  normQuery: string;
  tokens: string[];
  stems: string[];
  intents: Set<IntentKey>;
  categoryBoosts: Map<string, string>;
  fatMax?: number;
  fatMin?: number;
  fatExact?: number;
  proteinMin?: number;
  targetWeightGrams?: number;
  preferBulk?: boolean;
  preferRetail?: boolean;
}

function parseUserQuery(rawQuery: string, language: Language): ParsedQuery {
  const normQuery = normalizeText(rawQuery);
  const intents = new Set<IntentKey>();
  const categoryBoosts = new Map<string, string>();

  if (/(пицц|pizza|піц|披萨|плав|запек|растяг|тягуч|пиццери)/iu.test(normQuery)) {
    intents.add('pizza');
  }
  if (/(без\s*лактоз|безлактоз|низколактоз|lactose|непереносим|零乳糖|无乳糖|нет\s*лактоз)/iu.test(normQuery)) {
    intents.add('lactoseFree');
  }
  if (/(белок|белк|бялок|бялк|протеин|protein|спорт|фитнес|мышц|пп\b|高蛋白|蛋白)/iu.test(normQuery)) {
    intents.add('highProtein');
  }
  if (/(без\s*сахар|без\s*цукр|сорбит|no\s*sugar|sugar\s*free|zero\s*sugar|无糖|零蔗糖)/iu.test(normQuery)) {
    intents.add('noSugar');
  }
  if (/(вин\p{L}*|він\p{L}*|wine|дегустац|сырн\p{L}*\s+тарел|葡萄酒|红酒|品鉴)/iu.test(normQuery)) {
    intents.add('wine');
  }
  if (/(выпеч|кондитер|кандытар|торт|чизкейк|тирамису|взбиван|ўзбіван|крем|ганаш|pastry|bak|whipping|круассан|烘焙|甜点)/iu.test(normQuery)) {
    intents.add('baking');
  }
  if (/(кофе|капучино|латте|бариста|coffee|latte|barista|咖啡)/iu.test(normQuery)) {
    intents.add('coffee');
  }
  if (/(экспорт|экспарт|опт|аптов|horeca|export|b2b|мешк|мяшк|монолит|gacc|китай|ази|контейнер|出口|大宗)/iu.test(normQuery)) {
    intents.add('export');
  }
  if (/(длительн|долго|без\s*холодильник|uht|ультрапастериз|стерилиз|180\s*сут|24\s*мес|long\s*shelf|ambient|常温|长保)/iu.test(normQuery)) {
    intents.add('longShelf');
  }
  if (/(десерт|сладк|перекус|ребен|детям|dessert|sweet|snack|甜品)/iu.test(normQuery)) {
    intents.add('dessert');
  }
  if (/(низк\p{L}*\s+жир|маложир|обезжир|легк|лёгк|диет|похуд|low\s*fat|skim|低脂)/iu.test(normQuery)) {
    intents.add('lowFat');
  }

  for (const catRule of CATEGORY_KEYWORDS) {
    if (catRule.pattern.test(normQuery)) {
      categoryBoosts.set(catRule.categoryId, catRule.labels[language]);
    }
  }

  let fatMax: number | undefined;
  let fatMin: number | undefined;
  let fatExact: number | undefined;

  const fatMaxMatch = normQuery.match(/(?:до|меньше|ниже|max|under|below|<=?)\s*(\d+(?:\.\d+)?)\s*%/i);
  if (fatMaxMatch) {
    fatMax = parseFloat(fatMaxMatch[1]);
  } else if (intents.has('lowFat')) {
    fatMax = 5;
  }

  const fatMinMatch = normQuery.match(/(?:от|более|выше|min|over|above|>=?)\s*(\d+(?:\.\d+)?)\s*%/i);
  if (fatMinMatch) {
    fatMin = parseFloat(fatMinMatch[1]);
  }

  if (fatMax === undefined && fatMin === undefined) {
    const exactFatMatch = normQuery.match(/(\d+(?:\.\d+)?)\s*%|\b(82\.5|72\.5|3\.2|2\.5|1\.5|0\.1)\b/);
    if (exactFatMatch) {
      fatExact = parseFloat(exactFatMatch[1] || exactFatMatch[2]);
    }
  }

  let proteinMin: number | undefined;
  const proteinMatch = normQuery.match(/(?:бел\p{L}*|protein)\s*(?:от|более|>=?|min)?\s*(\d+(?:\.\d+)?)|(?:от|>=?)\s*(\d+(?:\.\d+)?)\s*(?:г|g)?\s*(?:бел\p{L}*|protein)/iu);
  if (proteinMatch) {
    const val = parseFloat(proteinMatch[1] || proteinMatch[2]);
    if (Number.isFinite(val) && val > 0) proteinMin = val;
  }

  let targetWeightGrams: number | undefined;
  const weightMatch = normQuery.match(/(\d+(?:\.\d+)?)\s*(кг|kg|г|g|мл|ml|л|l)(?:\b|$)/i);
  if (weightMatch) {
    const num = parseFloat(weightMatch[1]);
    const unit = weightMatch[2].toLowerCase();
    if (Number.isFinite(num) && num > 0) {
      targetWeightGrams = unit === 'кг' || unit === 'kg' || unit === 'л' || unit === 'l'
      ? Math.round(num * 1000)
      : Math.round(num);
    }
  }

  const preferBulk = /(horeca|опт|мешк|монолит|больш\p{L}*\s+упаков|2\.5\s*кг|20\s*кг|25\s*кг|1\s*кг|11\s*кг|bulk)/iu.test(normQuery);
  const preferRetail = /(порцион|маленьк|в\s*стакан|розниц|retail|small)/iu.test(normQuery);

  const tokens = extractTokens(normQuery);
  const stems = Array.from(new Set(tokens.map(stemToken)));

  return {
    normQuery,
    tokens,
    stems,
    intents,
    categoryBoosts,
    fatMax,
    fatMin,
    fatExact,
    proteinMin,
    targetWeightGrams,
    preferBulk,
    preferRetail,
  };
}

function pickRecommendedPackage(product: Product, parsed: ParsedQuery): PackageVariant | undefined {
  if (product.packages.length === 0) return undefined;
  if (parsed.targetWeightGrams !== undefined) {
    let best = product.packages[0];
    let minDiff = Math.abs(best.weightGrams - parsed.targetWeightGrams);
    for (const pkg of product.packages) {
      const diff = Math.abs(pkg.weightGrams - parsed.targetWeightGrams);
      if (diff < minDiff) {
        minDiff = diff;
        best = pkg;
      }
    }
    return best;
  }
  if (parsed.intents.has('pizza') || parsed.intents.has('export') || parsed.preferBulk) {
    return [...product.packages].sort((a, b) => b.weightGrams - a.weightGrams)[0];
  }
  if (parsed.intents.has('longShelf')) {
    return [...product.packages].sort(
      (a, b) =>
      parseShelfLifeDays(b.shelfLife.ru || b.shelfLife.en || '') -
      parseShelfLifeDays(a.shelfLife.ru || a.shelfLife.en || '')
    )[0];
  }
  return product.packages[0];
}

function evaluateQuery(
  rawQuery: string,
  products: Product[],
  categories: Category[],
  language: Language
): { results: SmartMatchResult[]; criteria: SmartCriterion[] } {
  const parsed = parseUserQuery(rawQuery, language);
  const visibleProducts = products.filter((p) => p.visible);
  const catMap = new Map(categories.map((c) => [c.id, c]));
  const gUnit = language === 'ru' || language === 'be' ? 'г' : language === 'zh' ? '克' : 'g';

  const criteria: SmartCriterion[] = [];
  for (const [catId, label] of parsed.categoryBoosts.entries()) {
    criteria.push({ id: `cat-${catId}`, label });
  }
  for (const intent of parsed.intents) {
    criteria.push({ id: `intent-${intent}`, label: INTENT_CRITERIA_LABELS[intent][language] });
  }
  if (parsed.fatMax !== undefined) {
    criteria.push({
      id: 'fat-max',
      label:
      language === 'ru'
    ? `Жирность ≤ ${parsed.fatMax}%`
    : language === 'be'
    ? `Тлустасць ≤ ${parsed.fatMax}%`
    : language === 'zh'
    ? `脂肪 ≤ ${parsed.fatMax}%`
    : `Fat ≤ ${parsed.fatMax}%`,
    });
  }
  if (parsed.fatMin !== undefined) {
    criteria.push({
      id: 'fat-min',
      label:
      language === 'ru'
    ? `Жирность ≥ ${parsed.fatMin}%`
    : language === 'be'
    ? `Тлустасць ≥ ${parsed.fatMin}%`
    : language === 'zh'
    ? `脂肪 ≥ ${parsed.fatMin}%`
    : `Fat ≥ ${parsed.fatMin}%`,
    });
  }
  if (parsed.proteinMin !== undefined) {
    criteria.push({
      id: 'prot-min',
      label:
      language === 'ru'
    ? `Белок ≥ ${parsed.proteinMin} г`
    : language === 'be'
    ? `Бялок ≥ ${parsed.proteinMin} г`
    : language === 'zh'
    ? `蛋白 ≥ ${parsed.proteinMin} 克`
    : `Protein ≥ ${parsed.proteinMin}g`,
    });
  }
  if (parsed.targetWeightGrams !== undefined) {
    const label =
    parsed.targetWeightGrams >= 1000
    ? `${parsed.targetWeightGrams / 1000} ${language === 'ru' || language === 'be' ? 'кг' : 'kg'}`
    : `${parsed.targetWeightGrams} ${gUnit}`;
    criteria.push({ id: 'weight', label });
  }

  const scored: SmartMatchResult[] = [];

  for (const product of visibleProducts) {
    let score = 0;
    const reasons: string[] = [];

    const nameAll = normalizeText(
      [product.name.ru, product.name.be, product.name.en, product.name.zh].filter(Boolean).join(' ')
    );
    const currentName = normalizeText(product.name[language] || product.name.ru || '');
    const cat = catMap.get(product.category);
    const catNameAll = normalizeText(
      cat ? [cat.name.ru, cat.name.be, cat.name.en, cat.name.zh].filter(Boolean).join(' ') : product.category
    );
    const descAll = normalizeText(
      [product.description.ru, product.description.be, product.description.en, product.description.zh]
      .filter(Boolean)
      .join(' ')
    );
    const charAll = normalizeText(
      Object.values(product.characteristics)
      .flatMap((c) => [c.ru, c.be, c.en, c.zh])
      .filter(Boolean)
      .join(' ')
    );
    const packAll = normalizeText(
      product.packages
      .map((p) => `${p.weight} ${p.packagingType.ru} ${p.packagingType.en} ${p.shelfLife.ru}`)
      .join(' ')
    );

    const nameWords = extractTokens(nameAll);
    const catWords = extractTokens(catNameAll);

    // 1. Exact / prefix / phrase match on Product Name
    if (currentName === parsed.normQuery || nameAll === parsed.normQuery) {
      score += 160;
    } else if (currentName.startsWith(parsed.normQuery)) {
      score += 130;
    } else if (parsed.normQuery.length >= 2 && nameAll.includes(parsed.normQuery)) {
      score += 95;
    }

    // 2. Category boost from detected category intent
    if (parsed.categoryBoosts.has(product.category)) {
      score += 80;
    }

    // 3. Semantic Intent matching
    if (parsed.intents.has('pizza') && product.useCases.includes('pizza')) {
      score += product.category === 'cheese' ? 80 : 50;
      reasons.push(INTENT_REASONS.pizza[language]);
    }
    if (parsed.intents.has('lactoseFree') && (product.lactoseFree || product.useCases.includes('lactose-free'))) {
      score += 85;
      reasons.push(INTENT_REASONS.lactoseFree[language]);
    }
    if (
      parsed.intents.has('highProtein') &&
      ((product.proteinContent ?? 0) >= 8 || product.useCases.includes('high-protein'))
    ) {
      score += (product.proteinContent ?? 0) >= 15 ? 75 : 55;
      reasons.push(`${INTENT_REASONS.highProtein[language]} (${product.proteinContent ?? 0} ${gUnit} / 100${gUnit})`);
    }
    if (
      parsed.intents.has('noSugar') &&
      (product.useCases.includes('no-sugar') ||
      /(без добавленного сахара|без сахара|не содержит сахара|сорбит)/i.test(`${descAll} ${charAll}`))
    ) {
      score += 75;
      reasons.push(INTENT_REASONS.noSugar[language]);
    }
    if (parsed.intents.has('wine') && product.useCases.includes('wine')) {
      score += 80;
      reasons.push(INTENT_REASONS.wine[language]);
    }
    if (parsed.intents.has('baking') && product.useCases.includes('baking')) {
      score += 65;
      reasons.push(INTENT_REASONS.baking[language]);
    }
    if (
      parsed.intents.has('coffee') &&
      (product.useCases.includes('coffee') || product.category === 'cream')
    ) {
      score += product.useCases.includes('coffee') ? 70 : 45;
      reasons.push(INTENT_REASONS.coffee[language]);
    }
    if (parsed.intents.has('export') && product.exportReady) {
      score += product.category === 'dry-dairy' || product.category === 'butter' ? 60 : 40;
      reasons.push(INTENT_REASONS.export[language]);
    }
    if (parsed.intents.has('longShelf')) {
      const maxDays = Math.max(
        0,
        ...product.packages.map((p) => parseShelfLifeDays(p.shelfLife.ru || p.shelfLife.en || ''))
      );
      if (maxDays >= 90) {
        score += 65;
        reasons.push(INTENT_REASONS.longShelf[language]);
      }
    }
    if (parsed.intents.has('dessert') && product.useCases.includes('dessert')) {
      score += 65;
      reasons.push(INTENT_REASONS.dessert[language]);
    }

    // 4. Numeric constraints
    if (parsed.fatMax !== undefined) {
      if (product.fatContent !== undefined && product.fatContent <= parsed.fatMax) {
        score += 55;
        reasons.push(`${INTENT_REASONS.lowFat[language]} (${product.fatContent}%)`);
      } else if (parsed.intents.size === 0 && parsed.categoryBoosts.size === 0) {
        score -= 40;
      }
    }
    if (parsed.fatMin !== undefined) {
      if ((product.fatContent ?? 0) >= parsed.fatMin) {
        score += 55;
      } else {
        score -= 40;
      }
    }
    if (parsed.fatExact !== undefined && product.fatContent !== undefined) {
      if (Math.abs(product.fatContent - parsed.fatExact) < 0.05) {
        score += 85;
      }
    }
    if (parsed.proteinMin !== undefined) {
      if ((product.proteinContent ?? 0) >= parsed.proteinMin) {
        score += 60;
        reasons.push(`${INTENT_REASONS.highProtein[language]} (${product.proteinContent} ${gUnit})`);
      } else {
        score -= 45;
      }
    }
    if (parsed.targetWeightGrams !== undefined) {
      const hasClosePack = product.packages.some(
        (pkg) => Math.abs(pkg.weightGrams - parsed.targetWeightGrams!) <= parsed.targetWeightGrams! * 0.15
      );
      if (hasClosePack) score += 50;
    }

    // 5. Token, Stem, Synonym & Typo matching across weighted fields
    let nameStemHits = 0;
    let catStemHits = 0;
    let packHits = 0;
    let charHits = 0;
    let descHits = 0;

    for (const rawTok of parsed.tokens) {
      const stem = stemToken(rawTok);
      const aliases = expandSynonyms(stem);

      const matchesAny = (haystack: string) => aliases.some((a) => haystack.includes(a));

      if (matchesAny(nameAll)) {
        nameStemHits++;
        if (nameWords.some((nw) => nw.startsWith(stem) || nw.startsWith(rawTok))) {
          score += 20;
        }
      } else if (rawTok.length >= 4) {
        const maxDist = rawTok.length >= 7 ? 2 : 1;
        if (nameWords.some((nw) => levenshteinBounded(rawTok, nw, maxDist) <= maxDist)) {
          score += 38;
        }
      }

      if (matchesAny(catNameAll)) {
        catStemHits++;
      } else if (rawTok.length >= 4) {
        const maxDist = rawTok.length >= 7 ? 2 : 1;
        if (catWords.some((cw) => levenshteinBounded(rawTok, cw, maxDist) <= maxDist)) {
          score += 30;
        }
      }

      if (matchesAny(packAll)) packHits++;
      if (matchesAny(charAll)) charHits++;
      if (matchesAny(descAll)) descHits++;
    }

    score += nameStemHits * 55;
    score += catStemHits * 45;
    score += packHits * 25;
    score += charHits * 10;
    score += descHits * 8;

    if (parsed.tokens.length >= 2 && nameStemHits + catStemHits >= parsed.tokens.length) {
      score += 35;
    }

    if (score > 0) {
      if (reasons.length === 0) {
        if (nameStemHits > 0 || catStemHits > 0) {
          reasons.push(
            language === 'ru'
            ? 'Точное совпадение по названию и категории'
            : language === 'be'
            ? 'Дакладнае супадзенне па назве і катэгорыі'
            : language === 'zh'
            ? '匹配产品名称与分类'
            : 'Matches product name and category'
          );
        } else {
          reasons.push(
            language === 'ru'
            ? 'Подходит по характеристикам и составу'
            : language === 'be'
            ? 'Падыходзіць па характарыстыках і складзе'
            : language === 'zh'
            ? '符合产品特性与规格'
            : 'Matches specifications and packaging'
          );
        }
      }

      scored.push({
        product,
        score,
        reasons,
        recommendedPackage: pickRecommendedPackage(product, parsed),
      });
    }
  }

  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return Number(Boolean(b.product.featured)) - Number(Boolean(a.product.featured));
  });

  const topScore = scored[0]?.score ?? 0;
  const filtered =
  topScore >= 85
  ? scored.filter((item) => item.score >= 30)
  : scored.filter((item) => item.score >= 15);

  return { results: filtered, criteria };
}

export function runSmartSearch(
  query: string,
  products: Product[],
  categories: Category[],
  language: Language
): SmartSearchResponse {
  const trimmed = query.trim();
  if (!trimmed) {
    return { results: [], criteria: [] };
  }

  const primary = evaluateQuery(trimmed, products, categories, language);
  if (primary.results.length > 0) {
    return primary;
  }

  const layoutFixed = decodeKeyboardLayout(trimmed);
  if (layoutFixed) {
    const recovered = evaluateQuery(layoutFixed, products, categories, language);
    if (recovered.results.length > 0) {
      return {
        results: recovered.results,
        correctedQuery: layoutFixed,
        criteria: [
          {
            id: 'layout-fix',
            label:
            language === 'ru'
            ? `Исправлена раскладка: «${layoutFixed}»`
            : language === 'be'
            ? `Выпраўлена раскладка: «${layoutFixed}»`
            : language === 'zh'
            ? `已自动纠正输入: "${layoutFixed}"`
            : `Auto-corrected: "${layoutFixed}"`,
          },
          ...recovered.criteria,
        ],
      };
    }
  }

  return primary;
}

export function runSmartProductMatch(
  query: string,
  products: Product[],
  language: Language,
  categories: Category[] = []
): SmartMatchResult[] {
  return runSmartSearch(query, products, categories, language).results.slice(0, 6);
}
