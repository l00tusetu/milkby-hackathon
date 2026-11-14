import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { useCatalogStore } from '../hooks/useCatalogStore';
import { ASSETS } from '../data/assets';
import { NEWS_CATEGORY_LABELS } from '../data/news';
import { SeoHead } from '../components/SeoHead';
import { ImageWithFallback } from '../components/ImageWithFallback';
import { ProductGrid } from '../components/ProductGrid';
import { SmartFinder } from '../components/SmartFinder';
import { B2BInquiryModal } from '../components/B2BInquiryModal';
import { CategoryIcon } from '../components/CategoryIcon';
import { HomeHeroSection } from '../components/home/HomeHeroSection';
import { HomeAboutSection } from '../components/home/HomeAboutSection';
import { HomeTeamSlider } from '../components/home/HomeTeamSlider';
import { HomeLocationsSection } from '../components/home/HomeLocationsSection';
import { Product } from '../types';

const FLAGSHIP_ORDER = ['mozzarella-pizza', 'goroden-aged', 'milk-lactose-free', 'butter-825'];

export const Home: React.FC = () => {
  const { t, language, localize } = useLanguage();
  const { products, categories, news } = useCatalogStore();
  const [activeCategoryId, setActiveCategoryId] = useState<string>('all');
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const [inquiryChannel, setInquiryChannel] = useState<'export' | 'wholesale' | 'general'>(
    'wholesale'
  );

  const visibleProducts = useMemo(() => products.filter((p) => p.visible), [products]);

  const displayedProducts = useMemo(() => {
    if (activeCategoryId === 'all') {
      const featuredList = visibleProducts.filter((p) => p.featured);
      const customFeatured = featuredList.filter(
        (p) => !FLAGSHIP_ORDER.includes(p.id) && p.id.startsWith('custom-')
      );
      const prioritized = FLAGSHIP_ORDER.map((id) => featuredList.find((p) => p.id === id)).filter(
        (p): p is Product => Boolean(p)
      );
      const restFeatured = featuredList.filter(
        (p) => !FLAGSHIP_ORDER.includes(p.id) && !p.id.startsWith('custom-')
      );
      return [...customFeatured, ...prioritized, ...restFeatured].slice(0, 4);
    }
    return visibleProducts.filter((p) => p.category === activeCategoryId).slice(0, 4);
  }, [visibleProducts, activeCategoryId]);

  const activeCategory = categories.find((c) => c.id === activeCategoryId);
  const latestNews = news.filter((n) => n.published).slice(0, 3);
  const aboutImageSrc = latestNews[0]?.image || ASSETS.heroDairyShowcase;

  const seoTitle =
  language === 'ru'
  ? 'ОАО «Молочный Мир» (milk.by) — Натуральные сыры, молоко и экспорт'
  : language === 'be'
  ? 'ААТ «Малочны Мір» (milk.by) — Натуральныя сыры, малако і экспарт'
  : language === 'zh'
  ? 'Molochny Mir (milk.by) — 乳制品目录、国际出口与B2B合作'
  : 'Molochny Mir (milk.by) — Dairy Catalog, Export & B2B Portal';

  const seoDesc = t('heroSubtitle');

  const promoCopy = {
    ru: {
      badge: 'ХИТЫ ПРОДАЖ · СОРТ «ЭКСТРА»',
      extra: 'ЛИНЕЙКА «ГОРОДЕНЪ» И ACTIVE LIFE',
      lead: 'От тягучей моцареллы HoReCa и выдержанных сыров до безлактозного молока и масла 82,5% — натуральный вкус, подтверждённый наградами.',
      lineCta: 'Линейка «ГороденЪ»',
      allTab: 'Хиты ассортимента',
    },
    be: {
      badge: 'ХІТЫ ПРОДАЖАЎ · ГАТУНАК «ЭКСТРА»',
      extra: 'ЛІНЕЙКА «ГОРАДЗЕНЪ» І ACTIVE LIFE',
      lead: 'Ад цягучай мацарэлы HoReCa і вытрыманых сыроў да безлактознага малака і масла 82,5% — натуральны смак, пацверджаны ўзнагародамі.',
      lineCta: 'Лінейка «ГорадзенЪ»',
      allTab: 'Хіты асартыменту',
    },
    en: {
      badge: 'BESTSELLERS · EXTRA-GRADE MILK',
      extra: 'GORODEN & ACTIVE LIFE RANGES',
      lead: 'From stretchy HoReCa mozzarella and aged reserve cheeses to lactose-free milk and 82.5% sweet cream butter — award-winning daily quality.',
      lineCta: 'Goroden Series',
      allTab: 'Top Highlights',
    },
    zh: {
      badge: '热销口碑 · 特级生牛乳',
      extra: 'GORODEN 与 ACTIVE LIFE 旗舰系列',
      lead: '从餐饮拉丝披萨马苏里拉奶酪、陈年干酪到零乳糖牛奶与82.5%纯脂黄油——屡获殊荣的白俄罗斯纯正乳品风味。',
      lineCta: 'Goroden 臻选',
      allTab: '精选热销',
    },
  }[language];

  const openCategoryText = activeCategory
  ? `${t('allProductsLink')}: ${localize(activeCategory.name)}`
  : t('allProductsLink');

  const handleOpenInquiry = (channel: 'export' | 'wholesale' | 'general') => {
    setInquiryChannel(channel);
    setInquiryOpen(true);
  };

  return (
    <div className="space-y-12 sm:space-y-20">
    <SeoHead title={seoTitle} description={seoDesc} canonicalHash="/" />

    {/* 1. Full-bleed Hero + Live Smart Search */}
    <HomeHeroSection />

    {/* 2. Compact Promotional Product Showcase + Category Filter Tabs + Smart Finder */}
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4 sm:space-y-5">
    <div className="rounded-2xl bg-gradient-to-r from-[#0057B8] via-[#0a65c2] to-[#0284c7] text-white p-4 sm:px-6 sm:py-4.5 flex flex-col lg:flex-row lg:items-center justify-between gap-3.5 shadow-sm">
    <div className="space-y-1 min-w-0">
    <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-blue-100">
    <span className="inline-flex items-center gap-1">
    <Sparkles className="w-3 h-3 shrink-0" />
    {promoCopy.badge}
    </span>
    <span aria-hidden="true">·</span>
    <span>{promoCopy.extra}</span>
    </div>
    <h2 className="font-display text-xl sm:text-2xl font-bold text-white tracking-tight">
    {t('featuredHeading')}
    </h2>
    <p className="text-xs sm:text-sm text-blue-50/95 max-w-2xl leading-snug">
    {promoCopy.lead}
    </p>
    </div>

    <div className="flex flex-wrap items-center gap-2.5 shrink-0">
    <Link
    to="/catalog/cheese"
    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/15 hover:bg-white/25 border border-white/25 text-xs font-semibold text-white transition-colors whitespace-nowrap"
    >
    <span>{promoCopy.lineCta}</span>
    </Link>
    <Link
    to={activeCategory ? `/catalog/${activeCategory.slug}` : '/catalog'}
    className="group inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white text-[#0057B8] hover:bg-blue-50 text-xs font-bold transition-colors whitespace-nowrap shadow-xs"
    >
    <span>{openCategoryText}</span>
    <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
    </Link>
    </div>
    </div>

    {/* Category pills with compact milk.by-inspired icons */}
    <div className="flex flex-nowrap sm:flex-wrap gap-2 overflow-x-auto no-scrollbar -mx-4 px-4 scroll-px-4 sm:mx-0 sm:px-0 sm:scroll-px-0 pb-1 sm:pb-0">
    <button
    type="button"
    onClick={() => setActiveCategoryId('all')}
    className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-all duration-200 whitespace-nowrap shrink-0 ${
      activeCategoryId === 'all'
      ? 'bg-[#0057B8] text-white border-[#0057B8] shadow-xs'
      : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-[#0057B8]/50 hover:text-[#0057B8]'
    }`}
    >
    <CategoryIcon categoryId="all" className="w-4 h-4 shrink-0" />
    <span>{promoCopy.allTab}</span>
    </button>
    {categories.map((cat) => {
      const active = activeCategoryId === cat.id;
      return (
        <button
        key={cat.id}
        type="button"
        onClick={() => setActiveCategoryId(cat.id)}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-all duration-200 whitespace-nowrap shrink-0 ${
          active
          ? 'bg-[#0057B8] text-white border-[#0057B8] shadow-xs'
          : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-[#0057B8]/50 hover:text-[#0057B8]'
        }`}
        >
        <CategoryIcon categoryId={cat.id} className="w-4 h-4 shrink-0" />
        <span>{localize(cat.name)}</span>
        </button>
      );
    })}
    </div>

    <ProductGrid
    products={displayedProducts}
    mobileCarousel
    variant="promo"
    desktopCols={4}
    scrollResetKey={activeCategoryId}
    />

    <SmartFinder />
    </section>

    {/* 3. Enterprise Story & Production Metrics */}
    <HomeAboutSection imageSrc={aboutImageSrc} />

    {/* 4. Interactive B2B, Quality & Export Specialists Slider */}
    <HomeTeamSlider onRequestContact={handleOpenInquiry} />

    {/* 5. Interactive Production Sites & Cold-Chain Map Tabs */}
    <HomeLocationsSection />

    {/* 6. Latest Newsroom */}
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
    <div className="flex items-end justify-between border-b border-slate-200 pb-4">
    <h2 className="font-display text-2xl font-bold text-slate-900">{t('navNews')}</h2>
    <Link
    to="/news"
    className="group inline-flex items-center gap-1.5 text-sm font-semibold text-[#0057B8] hover:text-[#004494] transition-colors whitespace-nowrap shrink-0"
    >
    <span>
    {language === 'ru'
      ? 'Все новости'
      : language === 'be'
      ? 'Усе навіны'
      : language === 'zh'
      ? '全部新闻'
  : 'All news'}
  </span>
  <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
  </Link>
  </div>

  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  {latestNews.map((item) => (
    <Link
    key={item.id}
    to={`/news/${item.slug}`}
    className="group bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col hover:border-[#0057B8]/40 hover:-translate-y-1 hover:shadow-lg transition-all duration-200 ease-out"
    >
    <div className="aspect-[16/10] bg-slate-50 overflow-hidden border-b border-slate-100">
    <ImageWithFallback
    src={item.image}
    alt={localize(item.title)}
    className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-300 ease-out"
    />
    </div>
    <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
    <div className="space-y-2">
    <div className="flex items-center gap-2 text-xs text-slate-500 tabular-nums">
    <span className="font-mono">{item.date}</span>
    <span className="px-2 py-0.5 rounded-md bg-blue-50 text-[#0057B8] font-medium">
    {localize(NEWS_CATEGORY_LABELS[item.categoryId])}
    </span>
    </div>
    <h3 className="font-display text-base font-semibold text-slate-900 group-hover:text-[#0057B8] transition-colors leading-snug">
    {localize(item.title)}
    </h3>
    <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed">
    {localize(item.excerpt)}
    </p>
    </div>
    </div>
    </Link>
  ))}
  </div>
  </section>

  <B2BInquiryModal
  open={inquiryOpen}
  onClose={() => setInquiryOpen(false)}
  defaultChannel={inquiryChannel}
  />
  </div>
  );
};
