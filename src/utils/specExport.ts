import { Category, Language, NewsArticle, Product } from '../types';

export function downloadProductB2BSpec(
  product: Product,
  category: Category | undefined,
  language: Language
): void {
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
    `PRODUCT ID / SLUG: ${product.id} (/${product.slug})`,
    `FAT CONTENT: ${product.fatContent !== undefined ? `${product.fatContent}%` : 'N/A'}`,
    `PROTEIN CONTENT: ${product.proteinContent !== undefined ? `${product.proteinContent} g / 100g` : 'N/A'}`,
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
  const staticPaths = ['', '/catalog', '/export', '/partners', '/news', '/about', '/contacts'];

  const urls: string[] = [];

  for (const path of staticPaths) {
    urls.push(
      `  <url>\n    <loc>${baseUrl}/#${path || '/'}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>${
        path === '' ? '1.0' : '0.8'
      }</priority>\n    ${langs
        .map((l) => `<xhtml:link rel="alternate" hreflang="${l}" href="${baseUrl}/${l}/#${path || '/'}" />`)
        .join('\n    ')}\n  </url>`
    );
  }

  for (const cat of categories) {
    urls.push(
      `  <url>\n    <loc>${baseUrl}/#/catalog/${cat.slug}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>0.85</priority>\n  </url>`
    );
  }

  for (const prod of products.filter((p) => p.visible)) {
    urls.push(
      `  <url>\n    <loc>${baseUrl}/#/product/${prod.slug}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>0.9</priority>\n  </url>`
    );
  }

  for (const item of news.filter((n) => n.published)) {
    urls.push(
      `  <url>\n    <loc>${baseUrl}/#/news/${item.slug}</loc>\n    <lastmod>${item.date}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.7</priority>\n  </url>`
    );
  }

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n        xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls.join(
    '\n'
  )}\n</urlset>`;
}
