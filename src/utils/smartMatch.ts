import { Language, Product } from '../types';

export interface SmartMatchResult {
  product: Product;
  score: number;
  reasons: string[];
}

const REASON_LABELS: Record<string, Record<Language, string>> = {
  pizza: {
    ru: 'Термостабильность и равномерное плавление для пиццы',
    be: 'Тэрмастабільнасць і раўнамернае плаўленне для піцы',
    en: 'Heat-stable stretch and melt engineered for pizza ovens',
    zh: '耐高温、融化均匀且拉丝绵长，适合披萨烤制',
  },
  lactoseFree: {
    ru: 'Без лактозы (< 0,01% или естественное отсутствие при выдержке)',
    be: 'Без лактозы (< 0,01% або натуральная адсутнасць пры вытрымцы)',
    en: 'Lactose-free (< 0.01% or naturally eliminated during aging)',
    zh: '无乳糖（<0.01% 或陈年发酵天然去乳糖）',
  },
  highProtein: {
    ru: 'Высокое содержание натурального молочного белка',
    be: 'Высокае ўтрыманне натуральнага малочнага бялку',
    en: 'High natural dairy protein content',
    zh: '高天然乳蛋白含量',
  },
  wine: {
    ru: 'Богатый букет и текстура для дегустации с вином',
    be: 'Багаты букет і тэкстура для дэгустацыі з віном',
    en: 'Complex aged aroma & texture tailored for wine pairing',
    zh: '风味层次丰富，适合搭配葡萄酒品鉴',
  },
  baking: {
    ru: 'Стабильные показатели жирности для выпечки и кондитерки',
    be: 'Стабільныя паказчыкі тлустасці для выпечкі і кандытаркі',
    en: 'Reliable milkfat structure for pastry and culinary baking',
    zh: '乳脂稳定，适合烘焙与甜点制作',
  },
  export: {
    ru: 'Длительный срок годности и экспортная упаковка B2B',
    be: 'Працяглы тэрмін прыдатнасці і экспартная ўпакоўка B2B',
    en: 'Extended shelf life and B2B export-ready packaging',
    zh: '超长保质期与B2B出口专供包装',
  },
  textMatch: {
    ru: 'Совпадение по названию, категории или описанию',
    be: 'Супадзенне па назве, катэгорыі або апісанні',
    en: 'Matches product name, category, or description',
    zh: '匹配产品名称、分类或描述',
  },
};

function extractSearchTokens(q: string): string[] {
  const tokens = new Set<string>();

  // Latin, Cyrillic, numbers & percentages (2+ chars so "5%", "СО", etc. work)
  const wordMatches = q.match(/[a-zа-яёіў0-9%.-]{2,}/gi) || [];
  for (const w of wordMatches) {
    tokens.add(w.toLowerCase());
  }

  // CJK contiguous runs: keep 2-char words intact and split longer runs into bigrams
  const cjkRuns = q.match(/[\u4e00-\u9fff]+/g) || [];
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

export function runSmartProductMatch(
  query: string,
  products: Product[],
  language: Language
): SmartMatchResult[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const visibleProducts = products.filter((p) => p.visible);

  const wantsPizza = /пицц|pizza|піц|披萨|запек|плав/i.test(q);
  const wantsLactoseFree = /без\s*лактоз|lactose|безлактоз|无乳糖|零乳糖/i.test(q);
  const wantsHighProtein = /белок|белк|протеин|protein|бялк|спорт|高蛋白|蛋白/i.test(q);
  const wantsWine = /вин|wine|дегустац|сырн.*тарел|сыр.*вин|він|葡萄酒|红酒|品鉴/i.test(q);
  const wantsBaking = /выпеч|кондитер|кандытар|торт|крем|pastry|bak|круассан|烘焙|甜点/i.test(q);
  const wantsExport = /экспорт|экспарт|опт|аптов|horeca|export|b2b|мешк|мяшк|25\s*кг|20\s*кг|出口|大宗/i.test(q);

  const tokens = extractSearchTokens(q);
  const results: SmartMatchResult[] = [];

  for (const product of visibleProducts) {
    let score = 0;
    const reasons: string[] = [];

    if (wantsPizza && product.useCases.includes('pizza')) {
      score += product.id === 'mozzarella-pizza' ? 60 : 40;
      reasons.push(REASON_LABELS.pizza[language]);
    }
    if (wantsLactoseFree && (product.lactoseFree || product.useCases.includes('lactose-free'))) {
      score += product.id === 'milk-lactose-free' ? 65 : 50;
      reasons.push(REASON_LABELS.lactoseFree[language]);
    }
    if (
      wantsHighProtein &&
      ((product.proteinContent ?? 0) >= 8 || product.useCases.includes('high-protein'))
    ) {
      score += (product.proteinContent ?? 0) >= 15 ? 55 : 40;
      reasons.push(
        `${REASON_LABELS.highProtein[language]} (${product.proteinContent ?? 0} ${
          language === 'ru' || language === 'be' ? 'г' : 'g'
        } / 100${language === 'ru' || language === 'be' ? 'г' : 'g'})`
      );
    }
    if (wantsWine && product.useCases.includes('wine')) {
      score += 60;
      reasons.push(REASON_LABELS.wine[language]);
    }
    if (wantsBaking && product.useCases.includes('baking')) {
      score += 45;
      reasons.push(REASON_LABELS.baking[language]);
    }
    if (wantsExport && product.exportReady) {
      score += 35;
      reasons.push(REASON_LABELS.export[language]);
    }

    const haystack = [
      product.name.ru,
      product.name.be,
      product.name.en,
      product.name.zh,
      product.description.ru,
      product.description.be,
      product.description.en,
      product.description.zh,
      product.category,
      product.subcategory,
      product.packages.map((p) => p.weight).join(' '),
      product.useCases.join(' '),
      ...Object.values(product.characteristics).flatMap((c) => [c.ru, c.be, c.en, c.zh]),
    ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

    if (haystack.includes(q)) {
      score += 40;
      if (reasons.length === 0) {
        reasons.push(REASON_LABELS.textMatch[language]);
      }
    }

    let tokenHits = 0;
    for (const token of tokens) {
      if (haystack.includes(token)) tokenHits++;
    }
    if (tokenHits > 0) {
      score += tokenHits * 15;
      if (reasons.length === 0) {
        reasons.push(REASON_LABELS.textMatch[language]);
      }
    }

    if (score > 0) {
      results.push({ product, score, reasons });
    }
  }

  return results.sort((a, b) => b.score - a.score).slice(0, 6);
}
