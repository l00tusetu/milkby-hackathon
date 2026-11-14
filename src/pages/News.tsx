import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, X, ArrowRight, Calendar, Newspaper } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { useCatalogStore } from '../hooks/useCatalogStore';
import { NEWS_CATEGORY_LABELS } from '../data/news';
import { NewsCategoryId } from '../types';
import { SeoHead } from '../components/SeoHead';
import { ImageWithFallback } from '../components/ImageWithFallback';

const NEWS_CATEGORIES: {
  id: 'all' | NewsCategoryId;
  label: Record<'ru' | 'be' | 'en' | 'zh', string>;
}[] = [
  { id: 'all', label: { ru: 'Все рубрики', be: 'Усе рубрыкі', en: 'All topics', zh: '全部栏目' } },
{ id: 'export', label: NEWS_CATEGORY_LABELS.export },
{ id: 'products', label: NEWS_CATEGORY_LABELS.products },
{ id: 'company', label: NEWS_CATEGORY_LABELS.company },
{ id: 'awards', label: NEWS_CATEGORY_LABELS.awards },
];

export const News: React.FC = () => {
  const { language, localize, t } = useLanguage();
  const { news } = useCatalogStore();

  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | NewsCategoryId>('all');
  const [selectedYear, setSelectedYear] = useState<string>('all');

  const copy = {
    ru: {
      eyebrow: 'Пресс-центр',
      seoDesc:
      'Новости ОАО «Молочный Мир»: модернизация производства, экспортные контракты, новинки ассортимента и отраслевые награды.',
      lead: 'Архив корпоративных публикаций, экспортных событий и запусков новых производственных линий.',
      searchPlaceholder: 'Поиск по новостям…',
      allYears: 'Все годы',
      latestBadge: 'Последняя новость',
      readFull: 'Читать полностью',
      readMore: 'Читать далее',
      archiveTitle: 'Все публикации',
      foundCount: (n: number) => `Публикаций: ${n}`,
      emptyTitle: 'Публикации не найдены',
      empty: 'По выбранным параметрам и поисковому запросу новости не найдены.',
      reset: 'Сбросить фильтры',
    },
    be: {
      eyebrow: 'Прэс-цэнтр',
      seoDesc:
      'Навіны ААТ «Малочны Мір»: мадэрнізацыя вытворчасці, экспартныя кантракты, навінкі і ўзнагароды.',
      lead: 'Архіў карпаратыўных публікацый, экспартных падзей і запускаў новых вытворчых ліній.',
      searchPlaceholder: 'Пошук па навінах…',
      allYears: 'Усе гады',
      latestBadge: 'Апошняя навіна',
      readFull: 'Чытаць цалкам',
      readMore: 'Чытаць далей',
      archiveTitle: 'Усе публікацыі',
      foundCount: (n: number) => `Публікацый: ${n}`,
      emptyTitle: 'Публікацыі не знойдзены',
      empty: 'Па выбраных параметрах і пошукавым запыце навіны не знойдзены.',
      reset: 'Скінуць фільтры',
    },
    en: {
      eyebrow: 'Newsroom',
      seoDesc: 'Latest production, export, and corporate news from Molochny Mir.',
      lead: 'Corporate announcements, export milestones, and product line launches.',
      searchPlaceholder: 'Search newsroom…',
      allYears: 'All years',
      latestBadge: 'Latest News',
      readFull: 'Read full story',
      readMore: 'Read more',
      archiveTitle: 'More Stories',
      foundCount: (n: number) => `Articles: ${n}`,
      emptyTitle: 'No articles found',
      empty: 'No news items match the selected category, year, or search query.',
      reset: 'Reset filters',
    },
    zh: {
      eyebrow: '新闻中心',
      seoDesc: 'Molochny Mir 企业新闻：产线升级、国际出口合约、新品发布与行业荣誉。',
      lead: '企业新闻、新产线投产与全球出口动态存档。',
      searchPlaceholder: '搜索新闻标题或内容…',
      allYears: '全部年份',
      latestBadge: '最新动态',
      readFull: '阅读全文',
      readMore: '查看详情',
      archiveTitle: '更多新闻报道',
      foundCount: (n: number) => `新闻数: ${n}`,
      emptyTitle: '未找到相关新闻',
      empty: '没有符合当前筛选条件的新闻报道。',
      reset: '重置筛选',
    },
  }[language];

  const publishedSorted = useMemo(
    () => news.filter((n) => n.published).sort((a, b) => b.date.localeCompare(a.date)),
                                  [news]
  );

  const newestArticleId = publishedSorted[0]?.id;

  const years = useMemo(() => {
    const set = new Set<number>(publishedSorted.map((n) => n.year));
    return Array.from(set).sort((a, b) => b - a);
  }, [publishedSorted]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return publishedSorted.filter((n) => {
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
    });
  }, [publishedSorted, query, selectedCategory, selectedYear]);

  const hasActiveFilters =
  query.trim().length > 0 || selectedCategory !== 'all' || selectedYear !== 'all';

  const handleReset = () => {
    setQuery('');
    setSelectedCategory('all');
    setSelectedYear('all');
  };

  const featuredArticle = filtered[0];
  const restArticles = filtered.slice(1);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
    <SeoHead
    title={`${t('navNews')} — ${t('brandName')} (milk.by)`}
    description={copy.seoDesc}
    canonicalHash="/news"
    />

    {/* Заголовок и счётчик */}
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-6">
    <div className="space-y-2.5 max-w-2xl">
    <p className="text-xs font-semibold uppercase tracking-wider text-[#0057B8]">
    {copy.eyebrow}
    </p>
    <h1 className="font-display text-3xl sm:text-4xl font-bold text-slate-900">
    {t('navNews')}
    </h1>
    <p className="text-sm sm:text-base text-slate-600 leading-relaxed">{copy.lead}</p>
    </div>
    <div className="text-xs font-medium text-slate-500 tabular-nums shrink-0">
    {copy.foundCount(filtered.length)}
    </div>
    </div>

    {/* Панель поиска и фильтров */}
    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-4">
    <div className="flex flex-col md:flex-row gap-3">
    <div className="relative flex-1">
    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
    <input
    type="text"
    value={query}
    onChange={(e) => setQuery(e.target.value)}
    placeholder={copy.searchPlaceholder}
    className="w-full h-10 pl-10 pr-9 text-base sm:text-sm bg-white border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0057B8] focus:ring-2 focus:ring-[#0057B8]/15 transition-all"
    />
    {query && (
      <button
      type="button"
      onClick={() => setQuery('')}
      aria-label="Clear search"
      className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-md flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
      >
      <X className="w-4 h-4" />
      </button>
    )}
    </div>

    <select
    value={selectedYear}
    onChange={(e) => setSelectedYear(e.target.value)}
    aria-label="Filter by year"
    className="h-10 px-3.5 text-base sm:text-sm bg-white border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-[#0057B8] tabular-nums"
    >
    <option value="all">{copy.allYears}</option>
    {years.map((y) => (
      <option key={y} value={String(y)}>
      {y}
      </option>
    ))}
    </select>
    </div>

    <div className="flex flex-wrap items-center justify-between gap-3">
    <div className="flex flex-wrap gap-2">
    {NEWS_CATEGORIES.map((cat) => (
      <button
      key={cat.id}
      type="button"
      onClick={() => setSelectedCategory(cat.id)}
      className={`px-3.5 py-1.5 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap ${
        selectedCategory === cat.id
        ? 'bg-[#0057B8] text-white border-[#0057B8] shadow-xs'
        : 'bg-white text-slate-700 border-slate-200 hover:border-[#0057B8]/40 hover:text-[#0057B8]'
      }`}
      >
      {localize(cat.label)}
      </button>
    ))}
    </div>

    {hasActiveFilters && (
      <button
      type="button"
      onClick={handleReset}
      className="text-xs font-semibold text-[#0057B8] hover:text-[#004494] transition-colors whitespace-nowrap"
      >
      {copy.reset}
      </button>
    )}
    </div>
    </div>

    {/* Пустое состояние */}
    {filtered.length === 0 ? (
      <div className="border border-slate-200 rounded-2xl bg-slate-50/70 p-12 text-center space-y-3">
      <Newspaper className="w-8 h-8 text-slate-400 mx-auto" strokeWidth={1.5} />
      <h2 className="font-display text-lg font-semibold text-slate-900">{copy.emptyTitle}</h2>
      <p className="text-sm text-slate-600 max-w-md mx-auto">{copy.empty}</p>
      {hasActiveFilters && (
        <button
        type="button"
        onClick={handleReset}
        className="inline-flex items-center px-4 py-2 text-xs font-semibold text-white bg-[#0057B8] rounded-lg hover:bg-[#004494] transition-colors"
        >
        {copy.reset}
        </button>
      )}
      </div>
    ) : (
      <div className="space-y-10">
      {/* Выделенная последняя / главная новость */}
      {featuredArticle && (
        <Link
        to={`/news/${featuredArticle.slug}`}
        className="group grid grid-cols-1 lg:grid-cols-12 bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs hover:border-[#0057B8]/45 hover:shadow-xl transition-all duration-200"
        >
        <div className="lg:col-span-7 relative aspect-[16/10] lg:aspect-auto lg:min-h-[360px] bg-slate-100 overflow-hidden">
        <ImageWithFallback
        src={featuredArticle.image}
        alt={localize(featuredArticle.title)}
        className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300 ease-out"
        />
        {featuredArticle.id === newestArticleId && (
          <div className="absolute top-4 left-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0057B8] text-white text-xs font-semibold shadow-md">
          <span className="w-2 h-2 rounded-full bg-white animate-pulse motion-reduce:animate-none" />
          <span>{copy.latestBadge}</span>
          </div>
        )}
        </div>

        <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between gap-6 bg-gradient-to-br from-white to-slate-50/60">
        <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2.5 text-xs tabular-nums">
        <span className="px-2.5 py-1 rounded-md bg-blue-50 text-[#0057B8] font-semibold border border-blue-100">
        {localize(NEWS_CATEGORY_LABELS[featuredArticle.categoryId])}
        </span>
        <span className="inline-flex items-center gap-1.5 font-mono text-slate-500">
        <Calendar className="w-3.5 h-3.5 text-slate-400" />
        {featuredArticle.date}
        </span>
        </div>

        <h2 className="font-display text-2xl sm:text-[1.7rem] font-bold text-slate-900 group-hover:text-[#0057B8] transition-colors leading-snug">
        {localize(featuredArticle.title)}
        </h2>

        <p className="text-sm sm:text-base text-slate-600 leading-relaxed line-clamp-4">
        {localize(featuredArticle.excerpt)}
        </p>
        </div>

        <div className="pt-4 border-t border-slate-200/80 flex items-center justify-between">
        <span className="inline-flex items-center gap-2 text-sm font-semibold text-[#0057B8] group-hover:text-[#004494] transition-colors">
        <span>{copy.readFull}</span>
        <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
        </span>
        </div>
        </div>
        </Link>
      )}

      {/* Остальные новости */}
      {restArticles.length > 0 && (
        <section className="space-y-5">
        <h2 className="font-display text-xl font-bold text-slate-900">
        {copy.archiveTitle}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {restArticles.map((article) => (
          <Link
          key={article.id}
          to={`/news/${article.slug}`}
          className="group bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col hover:border-[#0057B8]/40 hover:-translate-y-1 hover:shadow-lg transition-all duration-200 ease-out"
          >
          <div className="aspect-[16/10] bg-slate-50 overflow-hidden border-b border-slate-100">
          <ImageWithFallback
          src={article.image}
          alt={localize(article.title)}
          className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-300 ease-out"
          />
          </div>
          <div className="p-5 flex-1 flex flex-col justify-between gap-4">
          <div className="space-y-2.5">
          <div className="flex items-center gap-2 text-xs text-slate-500 tabular-nums">
          <span className="font-mono">{article.date}</span>
          <span className="px-2 py-0.5 rounded-md bg-blue-50 text-[#0057B8] font-medium">
          {localize(NEWS_CATEGORY_LABELS[article.categoryId])}
          </span>
          </div>
          <h3 className="font-display text-base font-semibold text-slate-900 group-hover:text-[#0057B8] transition-colors leading-snug">
          {localize(article.title)}
          </h3>
          <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed">
          {localize(article.excerpt)}
          </p>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-700 group-hover:text-[#0057B8] transition-colors">
          <span>{copy.readMore}</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
          </div>
          </div>
          </Link>
        ))}
        </div>
        </section>
      )}
      </div>
    )}
    </div>
  );
};
