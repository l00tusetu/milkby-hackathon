import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { useCatalogStore } from '../hooks/useCatalogStore';
import { ASSETS } from '../data/assets';
import { SeoHead } from '../components/SeoHead';
import { ImageWithFallback } from '../components/ImageWithFallback';
import { ProductGrid } from '../components/ProductGrid';
import { SmartFinder } from '../components/SmartFinder';
import { B2BInquiryModal } from '../components/B2BInquiryModal';
import { HomeHeroSection } from '../components/home/HomeHeroSection';
import { HomeAboutSection } from '../components/home/HomeAboutSection';
import { HomeTeamSlider } from '../components/home/HomeTeamSlider';
import { HomeTestimonialSection } from '../components/home/HomeTestimonialSection';
import { HomeLocationsSection } from '../components/home/HomeLocationsSection';

export const Home: React.FC = () => {
  const { t, language, localize } = useLanguage();
  const { products, categories, news } = useCatalogStore();
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const [inquiryChannel, setInquiryChannel] = useState<'export' | 'wholesale' | 'general'>(
    'wholesale'
  );

  const featuredProducts = products.filter((p) => p.visible && p.featured).slice(0, 6);
  const latestNews = news.filter((n) => n.published).slice(0, 3);
  const aboutImageSrc = latestNews[0]?.image || ASSETS.heroDairyShowcase;

  const seoTitle =
  language === 'ru'
  ? 'ОАО «Молочный Мир» (milk.by) — Каталог молочной продукции, экспорт и B2B'
  : language === 'be'
  ? 'ААТ «Малочны Мір» (milk.by) — Каталог малочнай прадукцыі, экспарт і B2B'
  : language === 'zh'
  ? 'Molochny Mir (milk.by) — 乳制品目录、国际出口与B2B合作'
  : 'Molochny Mir (milk.by) — Dairy Catalog, Export & B2B Portal';

  const seoDesc = t('heroSubtitle');

  const handleOpenInquiry = (channel: 'export' | 'wholesale' | 'general') => {
    setInquiryChannel(channel);
    setInquiryOpen(true);
  };

  return (
    <div className="space-y-16 sm:space-y-24">
    <SeoHead title={seoTitle} description={seoDesc} canonicalHash="/" />

    {/* 1. Full-bleed Hero + Live Search + 4-Audience Quick Entry */}
    <HomeHeroSection />

    {/* 2. Enterprise Story & Production Metrics (from new About layout) */}
    <HomeAboutSection imageSrc={aboutImageSrc} />

    {/* 3. Categories + Featured Dairy Collection + AI Smart Finder */}
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-4">
    <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900">
    {t('featuredHeading')}
    </h2>
    <Link
    to="/catalog"
    className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0057B8] hover:text-[#004494] whitespace-nowrap shrink-0"
    >
    <span>{t('allProductsLink')}</span>
    <ArrowRight className="w-4 h-4" />
    </Link>
    </div>

    <div className="flex flex-wrap gap-2">
    {categories.map((cat) => (
      <Link
      key={cat.id}
      to={`/catalog/${cat.slug}`}
      className="px-3.5 py-2 text-xs font-medium text-slate-700 bg-slate-50 border border-slate-200 rounded-lg hover:border-[#0057B8] hover:text-[#0057B8] transition-colors"
      >
      {localize(cat.name)}
      </Link>
    ))}
    </div>

    <ProductGrid products={featuredProducts} />

    <SmartFinder />
    </section>

    {/* 4. Interactive B2B, Quality & Export Specialists Slider */}
    <HomeTeamSlider onRequestContact={handleOpenInquiry} />

    {/* 5. Partner Testimonial Highlight */}
    <HomeTestimonialSection />

    {/* 6. Interactive Production Sites & Cold-Chain Map Tabs */}
    <HomeLocationsSection />

    {/* 7. Latest Newsroom */}
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
    <div className="flex items-end justify-between border-b border-slate-200 pb-4">
    <h2 className="font-display text-2xl font-bold text-slate-900">{t('navNews')}</h2>
    <Link
    to="/news"
    className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0057B8] hover:text-[#004494] whitespace-nowrap shrink-0"
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
  <ArrowRight className="w-4 h-4" />
  </Link>
  </div>

  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  {latestNews.map((item) => (
    <Link
    key={item.id}
    to={`/news/${item.slug}`}
    className="group bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col hover:-translate-y-0.5 hover:shadow-md transition-all duration-150"
    >
    <div className="aspect-[16/10] bg-slate-50 overflow-hidden border-b border-slate-100">
    <ImageWithFallback
    src={item.image}
    alt={localize(item.title)}
    className="w-full h-full object-cover"
    />
    </div>
    <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
    <div className="space-y-2">
    <div className="text-xs text-slate-500 font-mono tabular-nums">
    {item.date} · {item.categoryId.toUpperCase()}
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
