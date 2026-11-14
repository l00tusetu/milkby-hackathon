import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { useCatalogStore } from '../hooks/useCatalogStore';
import { ASSETS } from '../data/assets';
import { NEWS_CATEGORY_LABELS } from '../data/news';
import { SeoHead } from '../components/SeoHead';
import { ImageWithFallback } from '../components/ImageWithFallback';
import { ProductGrid } from '../components/ProductGrid';
import { SmartFinder } from '../components/SmartFinder';
import { B2BInquiryModal } from '../components/B2BInquiryModal';
import { HomeHeroSection } from '../components/home/HomeHeroSection';
import { HomeAboutSection } from '../components/home/HomeAboutSection';
import { HomeTeamSlider } from '../components/home/HomeTeamSlider';
import { HomeLocationsSection } from '../components/home/HomeLocationsSection';

export const Home: React.FC = () => {
  const { t, language, localize } = useLanguage();
  const { products, categories, news } = useCatalogStore();
  const [activeCategoryId, setActiveCategoryId] = useState<string>('all');
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const [inquiryChannel, setInquiryChannel] = useState<'export' | 'wholesale' | 'general'>(
    'wholesale'
  );

  const visibleProducts = useMemo(
    () => products.filter((p) => p.visible),
                                  [products]
  );

  const displayedProducts = useMemo(() => {
    if (activeCategoryId === 'all') {
      return visibleProducts.filter((p) => p.featured).slice(0, 6);
    }
    return visibleProducts.filter((p) => p.category === activeCategoryId).slice(0, 6);
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

  const allTabLabel =
  language === 'ru'
  ? 'Хиты ассортимента'
  : language === 'be'
  ? 'Хіты асартыменту'
  : language === 'zh'
  ? '精选热销'
  : 'Top Highlights';

  const openCategoryText = activeCategory
  ? `${t('allProductsLink')}: ${localize(activeCategory.name)}`
  : t('allProductsLink');

  const handleOpenInquiry = (channel: 'export' | 'wholesale' | 'general') => {
    setInquiryChannel(channel);
    setInquiryOpen(true);
  };

  return (
    <div className="space-y-16 sm:space-y-24">
    <SeoHead title={seoTitle} description={seoDesc} canonicalHash="/" />

    {/* 1. Full-bleed Hero + Live Smart Search */}
    <HomeHeroSection />

    {/* 2. Immediate Product Showcase + Interactive Category Filter Tabs + Smart Finder */}
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-4">
    <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900">
    {t('featuredHeading')}
    </h2>
    <Link
    to={activeCategory ? `/catalog/${activeCategory.slug}` : '/catalog'}
    className="group inline-flex items-center gap-1.5 text-sm font-semibold text-[#0057B8] hover:text-[#004494] transition-colors whitespace-nowrap shrink-0"
    >
    <span>{openCategoryText}</span>
    <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
    </Link>
    </div>

    {/* Clean interactive category filter pills */}
    <div className="flex flex-wrap gap-2">
    <button
    type="button"
    onClick={() => setActiveCategoryId('all')}
    className={`px-3.5 py-2 text-xs font-medium rounded-lg border transition-all duration-200 ${
      activeCategoryId === 'all'
      ? 'bg-[#0057B8] text-white border-[#0057B8] shadow-xs'
      : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-[#0057B8]/50 hover:text-[#0057B8]'
    }`}
    >
    {allTabLabel}
    </button>
    {categories.map((cat) => {
      const active = activeCategoryId === cat.id;
      return (
        <button
        key={cat.id}
        type="button"
        onClick={() => setActiveCategoryId(cat.id)}
        className={`px-3.5 py-2 text-xs font-medium rounded-lg border transition-all duration-200 ${
          active
          ? 'bg-[#0057B8] text-white border-[#0057B8] shadow-xs'
          : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-[#0057B8]/50 hover:text-[#0057B8]'
        }`}
        >
        {localize(cat.name)}
        </button>
      );
    })}
    </div>

    <ProductGrid products={displayedProducts} />

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
