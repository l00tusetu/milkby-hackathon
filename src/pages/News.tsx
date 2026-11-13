import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { useCatalogStore } from '../hooks/useCatalogStore';
import { SeoHead } from '../components/SeoHead';
import { ImageWithFallback } from '../components/ImageWithFallback';

const NEWS_CATEGORIES = [
  { id: 'all', label: { ru: 'Все рубрики', be: 'Усе рубрыкі', en: 'All topics', zh: '全部栏目' } },
{ id: 'export', label: { ru: 'Экспорт', be: 'Экспарт', en: 'Export', zh: '国际出口' } },
{ id: 'products', label: { ru: 'Продукция', be: 'Прадукцыя', en: 'Products', zh: '新品发布' } },
{ id: 'company', label: { ru: 'Компания', be: 'Кампанія', en: 'Company', zh: '企业动态' } },
{ id: 'awards', label: { ru: 'Награды', be: 'Узнагароды', en: 'Awards', zh: '荣誉奖项' } },
];

export const News: React.FC = () => {
  const { language, localize, t } = useLanguage();
  const { news } = useCatalogStore();

  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedYear, setSelectedYear] = useState<string>('all');

  const copy = {
    ru: {
      seoDesc: 'Новости ОАО «Молочный Мир»: модернизация производства, экспортные контракты, новинки ассортимента и отраслевые награды.',
      lead: 'Архив корпоративных публикаций, экспортных событий и запусков новых производственных линий.',
      searchPlaceholder: 'Поиск по новостям…',
      allYears: 'Все годы',
      empty: 'По вашему запросу публикации не найдены.',
    },
    be: {
      seoDesc: 'Навіны ААТ «Малочны Мір»: мадэрнізацыя вытворчасці, экспартныя кантракты, навінкі і ўзнагароды.',
      lead: 'Архіў карпаратыўных публікацый, экспартных падзей і запускаў новых вытворчых ліній.',
      searchPlaceholder: 'Пошук па навінах…',
      allYears: 'Усе гады',
      empty: 'Па вашым запыце публікацыі не знойдзены.',
    },
    en: {
      seoDesc: 'Latest production, export, and corporate news from Molochny Mir.',
      lead: 'Corporate announcements, export milestones, and product line launches.',
      searchPlaceholder: 'Search newsroom…',
      allYears: 'All years',
      empty: 'No articles match your filters.',
    },
    zh: {
      seoDesc: 'Molochny Mir 企业新闻：产线升级、国际出口合约、新品发布与行业荣誉。',
      lead: '企业新闻、新产线投产与全球出口动态存档。',
      searchPlaceholder: '搜索新闻标题或内容…',
      allYears: '全部年份',
      empty: '未找到符合筛选条件的新闻报道。',
    },
  }[language];

  const years = useMemo(() => {
    const set = new Set<number>(news.filter((n) => n.published).map((n) => n.year));
    return Array.from(set).sort((a, b) => b - a);
  }, [news]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return news
    .filter((n) => n.published)
    .filter((n) => {
      if (selectedCategory !== 'all' && n.categoryId !== selectedCategory) return false;
      if (selectedYear !== 'all' && String(n.year) !== selectedYear) return false;
      if (q) {
        const text = [
          n.title.ru,
          n.title.be,
          n.title.en,
          n.title.zh,
          n.excerpt.ru,
          n.excerpt.be,
          n.excerpt.en,
          n.excerpt.zh,
          n.content.ru,
          n.content.be,
          n.content.en,
          n.content.zh,
        ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
        if (!text.includes(q)) return false;
      }
      return true;
    })
    .sort((a, b) => b.date.localeCompare(a.date));
  }, [news, query, selectedCategory, selectedYear]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
    <SeoHead title={`${t('navNews')} — ${t('brandName')} (milk.by)`} description={copy.seoDesc} canonicalHash="/news" />

    <div className="space-y-3">
    <h1 className="font-display text-3xl sm:text-4xl font-bold text-slate-900">{t('navNews')}</h1>
    <p className="text-sm sm:text-base text-slate-600 max-w-2xl">{copy.lead}</p>
    </div>

    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-4">
    <div className="flex flex-col md:flex-row gap-3">
    <div className="relative flex-1">
    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
    <input
    type="text"
    value={query}
    onChange={(e) => setQuery(e.target.value)}
    placeholder={copy.searchPlaceholder}
    className="w-full h-10 pl-10 pr-4 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-[#0057B8]"
    />
    </div>

    <select
    value={selectedYear}
    onChange={(e) => setSelectedYear(e.target.value)}
    aria-label="Filter by year"
    className="h-10 px-3 text-sm bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-[#0057B8] tabular-nums"
    >
    <option value="all">{copy.allYears}</option>
    {years.map((y) => (
      <option key={y} value={String(y)}>
      {y}
      </option>
    ))}
    </select>
    </div>

    <div className="flex flex-wrap gap-2">
    {NEWS_CATEGORIES.map((cat) => (
      <button
      key={cat.id}
      type="button"
      onClick={() => setSelectedCategory(cat.id)}
      className={`px-3.5 py-1.5 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap ${
        selectedCategory === cat.id
        ? 'bg-[#0057B8] text-white border-[#0057B8]'
        : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
      }`}
      >
      {localize(cat.label)}
      </button>
    ))}
    </div>
    </div>

    {filtered.length === 0 ? (
      <div className="border border-slate-200 rounded-xl p-10 text-center text-sm text-slate-500">
      {copy.empty}
      </div>
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filtered.map((article) => (
        <Link
        key={article.id}
        to={`/news/${article.slug}`}
        className="group bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col hover:-translate-y-0.5 hover:shadow-md transition-all duration-150"
        >
        <div className="aspect-[16/10] bg-slate-50 overflow-hidden border-b border-slate-100">
        <ImageWithFallback
        src={article.image}
        alt={localize(article.title)}
        className="w-full h-full object-cover"
        />
        </div>
        <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-2">
        <div className="text-xs text-slate-500 font-mono tabular-nums">
        {article.date} · {article.categoryId.toUpperCase()}
        </div>
        <h2 className="font-display text-base font-semibold text-slate-900 group-hover:text-[#0057B8] transition-colors leading-snug">
        {localize(article.title)}
        </h2>
        <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed">
        {localize(article.excerpt)}
        </p>
        </div>
        </div>
        </Link>
      ))}
      </div>
    )}
    </div>
  );
};
