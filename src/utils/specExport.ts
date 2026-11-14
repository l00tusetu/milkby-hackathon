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
