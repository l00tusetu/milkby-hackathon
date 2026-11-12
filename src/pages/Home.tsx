import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Globe2, Building2, ShoppingBag, Newspaper } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { useCatalogStore } from '../hooks/useCatalogStore';
import { ASSETS } from '../data/assets';
import { SeoHead } from '../components/SeoHead';
import { ImageWithFallback } from '../components/ImageWithFallback';
import { SearchBar } from '../components/SearchBar';
import { ProductGrid } from '../components/ProductGrid';
import { SmartFinder } from '../components/SmartFinder';

export const Home: React.FC = () => {
  const { t, language, localize } = useLanguage();
  const { products, categories, news } = useCatalogStore();
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const featuredProducts = products.filter((p) => p.visible && p.featured).slice(0, 6);
  const latestNews = news.filter((n) => n.published).slice(0, 3);

  const heroKickerText = t('heroKicker')
  .replace(/\s*[&·]\s*Halal(\s+Certified)?/gi, (_, cert) => (cert ? ' Certified' : ''))
  .replace(/\s*与清真认证/g, ' 与国际质量认证');

  const seoTitle =
  language === 'ru'
  ? 'ОАО «Молочный Мир» (milk.by) — Каталог молочной продукции, экспорт и B2B'
  : language === 'be'
  ? 'ААТ «Малочны Мір» (milk.by) — Каталог малочнай прадукцыі, экспарт і B2B'
  : language === 'zh'
  ? 'Molochny Mir (milk.by) — 乳制品目录、国际出口与B2B合作'
  : 'Molochny Mir (milk.by) — Dairy Catalog, Export & B2B Portal';

  const seoDesc = t('heroSubtitle');

  const roleCards = [
    {
      to: '/catalog',
      icon: ShoppingBag,
      title: t('roleConsumerTitle'),
      desc: t('roleConsumerDesc'),
    },
    {
      to: '/partners',
      icon: Building2,
      title: t('roleB2BTitle'),
      desc: t('roleB2BDesc'),
    },
    {
      to: '/export',
      icon: Globe2,
      title: t('roleExportTitle'),
      desc: t('roleExportDesc'),
    },
    {
      to: '/news',
      icon: Newspaper,
      title: t('roleMediaTitle'),
      desc: t('roleMediaDesc'),
    },
  ];

  const stats = [
    {
      value: '142+',
      label:
      language === 'ru'
      ? 'Наименований продукции в ассортименте'
      : language === 'be'
      ? 'Найменняў прадукцыі ў асартыменце'
      : language === 'zh'
      ? '在售乳制品SKU品类'
      : 'Dairy SKUs in full catalog',
    },
    {
      value: '25+',
      label:
      language === 'ru'
      ? 'Стран регулярных экспортных поставок'
      : language === 'be'
      ? 'Краін рэгулярных экспартных паставак'
      : language === 'zh'
      ? '长期稳定出口国家与地区'
      : 'Export destination countries',
    },
    {
      value: '4 200',
      label:
      language === 'ru'
      ? 'Паллетомест с контролем холодовой цепи'
      : language === 'be'
      ? 'Палетамесцаў з кантролем халадовага ланцуга'
      : language === 'zh'
      ? '智能温控冷链仓储托盘位'
      : 'Cold-chain automated pallet slots',
    },
    {
      value: 'FSSC 22000',
      label:
      language === 'ru'
      ? 'Международная сертификация качества'
      : language === 'be'
      ? 'Міжнародная сертыфікацыя якасці'
      : language === 'zh'
      ? 'FSSC 22000 与 ISO 9001 国际认证'
      : 'Food safety & quality compliance',
    },
  ];

  return (
    <div className="space-y-16 sm:space-y-20">
    <SeoHead title={seoTitle} description={seoDesc} canonicalHash="/" />

    {/* Section 1: Hero + 4-column Audience Routing Strip */}
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 space-y-8">
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
    <div className="lg:col-span-6 lg:min-h-[380px] flex flex-col justify-between space-y-6 min-w-0">
    <div className="space-y-3.5">
    <p className="text-xs font-medium text-slate-500">
    {heroKickerText}
    </p>
    <h1
    className="font-display font-bold text-slate-900 tracking-tight leading-[1.15]"
    style={{ fontSize: 'clamp(1.65rem, 2.35vw, 2.35rem)' }}
    >
    {t('heroTitle')}
    </h1>
    <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-xl">
    {t('heroSubtitle')}
    </p>
    </div>

    <div className="space-y-4">
    <SearchBar
    value={searchQuery}
    onChange={setSearchQuery}
    onSubmitSearch={(q) =>
      navigate(q ? `/catalog?q=${encodeURIComponent(q)}` : '/catalog')
    }
    />

    <div className="flex flex-wrap items-center gap-3">
    <Link
    to="/catalog"
    className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-[#0057B8] rounded-lg hover:bg-[#004494] transition-colors whitespace-nowrap shrink-0"
    >
    <span>{t('heroPrimaryCta')}</span>
    <ArrowRight className="w-4 h-4" />
    </Link>
    <Link
    to="/export"
    className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-slate-800 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors whitespace-nowrap shrink-0"
    >
    <span>{t('heroSecondaryCta')}</span>
    </Link>
    </div>
    </div>
    </div>

    <div className="lg:col-span-6">
    <div className="h-[240px] sm:h-[300px] lg:h-[380px] rounded-2xl overflow-hidden border border-slate-200 bg-slate-50">
    <ImageWithFallback
    src={ASSETS.heroDairyShowcase}
    alt={t('brandName')}
    className="w-full h-full object-cover"
    />
    </div>
    </div>
    </div>

    {/* Full-width 4-column role navigation strip */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
    {roleCards.map((card) => {
      const Icon = card.icon;
      return (
        <Link
        key={card.to}
        to={card.to}
        className="group p-4 sm:min-h-[92px] bg-white border border-slate-200 rounded-xl hover:border-[#0057B8]/50 hover:bg-slate-50/60 transition-colors flex items-start gap-3.5 min-w-0"
        >
        <div className="w-9 h-9 rounded-lg bg-slate-100 text-[#0057B8] flex items-center justify-center shrink-0 group-hover:bg-[#0057B8] group-hover:text-white transition-colors">
        <Icon className="w-4 h-4" />
        </div>
        <div className="min-w-0">
        <div className="text-sm font-semibold text-slate-900 group-hover:text-[#0057B8] transition-colors">
        {card.title}
        </div>
        <div className="text-xs text-slate-500 mt-0.5 leading-snug">
        {card.desc}
        </div>
        </div>
        </Link>
      );
    })}
    </div>
    </section>

    {/* Section 2: Categories + Featured Dairy Collection + Smart Finder */}
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-4">
    <div>
    <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900">
    {t('featuredHeading')}
    </h2>
    </div>
    <Link
    to="/catalog"
    className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0057B8] hover:text-[#004494] whitespace-nowrap shrink-0"
    >
    <span>{t('allProductsLink')}</span>
    <ArrowRight className="w-4 h-4" />
    </Link>
    </div>

    {/* Category quick links */}
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

    {/* Section 3: Production Scale & Export Proof */}
    <section className="bg-slate-50 border-y border-slate-200 py-14">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
    <div className="lg:col-span-5 space-y-4">
    <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900">
    {language === 'ru'
      ? 'Качество сырья и прозрачная логистика для B2B и экспорта'
      : language === 'be'
      ? 'Якасць сыравіны і празрыстая лагістыка для B2B і экспарту'
      : language === 'zh'
      ? '严控奶源品质与透明冷链，服务全球 B2B 与出口伙伴'
  : 'Verified milk quality and cold-chain logistics for global B2B'}
  </h2>
  <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
  {language === 'ru'
    ? 'Прямые контракты с сертифицированными хозяйствами, собственные лаборатории и автоматизированная упаковка позволяют обеспечивать стабильные отгрузки для торговых сетей, HoReCa и зарубежных импортёров.'
    : language === 'be'
    ? 'Прамыя кантракты з гаспадаркамі і ўласныя лабараторыі забяспечваюць стабільныя адгрузкі для сетак і экспарту.'
    : language === 'zh'
    ? '自有认证牧场直供生牛乳、全自动无菌加工与GACC国际认证，确保零售商超、餐饮连锁及海外进口商的稳定交付。'
  : 'Direct farm sourcing, in-house accredited laboratories, and automated packaging support retail chains, HoReCa operators, and international importers.'}
  </p>
  <div className="pt-2 flex flex-wrap gap-3">
  <Link
  to="/export"
  className="px-4 py-2 text-xs font-semibold text-white bg-[#0057B8] rounded-lg hover:bg-[#004494] transition-colors"
  >
  {t('navExport')}
  </Link>
  <Link
  to="/partners"
  className="px-4 py-2 text-xs font-semibold text-slate-800 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors"
  >
  {t('navPartners')}
  </Link>
  </div>
  </div>

  <div className="lg:col-span-7 grid grid-cols-2 gap-4">
  {stats.map((stat) => (
    <div
    key={stat.value}
    className="bg-white border border-slate-200 rounded-xl p-5 space-y-1.5"
    >
    <div className="font-display text-2xl sm:text-3xl font-bold text-slate-900 tabular-nums">
    {stat.value}
    </div>
    <div className="text-xs sm:text-sm text-slate-600 leading-snug">
    {stat.label}
    </div>
    </div>
  ))}
  </div>
  </div>
  </div>
  </section>

  {/* Section 4: Latest Newsroom */}
  <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
  <div className="flex items-end justify-between border-b border-slate-200 pb-4">
  <h2 className="font-display text-2xl font-bold text-slate-900">
  {t('navNews')}
  </h2>
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
  </div>
  );
};
