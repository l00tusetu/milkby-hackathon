import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  Download,
  MessageSquare,
  Package,
  Thermometer,
  Clock,
  Layers,
  ShieldCheck,
  Check,
  Globe2,
} from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { useCatalogStore } from '../hooks/useCatalogStore';
import { SeoHead } from '../components/SeoHead';
import { ImageWithFallback } from '../components/ImageWithFallback';
import { ProductGrid } from '../components/ProductGrid';
import { B2BInquiryModal } from '../components/B2BInquiryModal';
import { downloadProductB2BSpec } from '../utils/specExport';

export const Product: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { language, localize, t } = useLanguage();
  const { products, categories } = useCatalogStore();

  const product = products.find((p) => p.slug === id || p.id === id);
  const [selectedPkgId, setSelectedPkgId] = useState<string>('');
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (product && product.packages.length > 0) {
      setSelectedPkgId((prev) =>
      product.packages.some((pkg) => pkg.id === prev) ? prev : product.packages[0].id
      );
    }
  }, [product]);

  if (!product) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-4">
      <SeoHead
      title={`${
        language === 'ru'
        ? 'Товар не найден'
        : language === 'be'
        ? 'Тавар не знойдзены'
        : language === 'zh'
        ? '未找到产品'
        : 'Product not found'
      } — ${t('brandName')}`}
      description={
        language === 'ru'
        ? 'Запрошенный продукт не найден в каталоге.'
        : language === 'be'
        ? 'Запытаны прадукт не знойдзены ў каталогу.'
        : language === 'zh'
        ? '未在目录中找到所请求的产品。'
        : 'Requested product was not found in the catalog.'
      }
      />
      <h1 className="font-display text-2xl font-bold text-slate-900">
      {language === 'ru'
        ? 'Продукт не найден'
        : language === 'be'
        ? 'Прадукт не знойдзены'
        : language === 'zh'
        ? '未找到该产品'
    : 'Product not found'}
    </h1>
    <Link
    to="/catalog"
    className="inline-flex px-4 py-2 text-sm font-semibold text-white bg-[#0057B8] rounded-lg hover:bg-[#004494] transition-colors"
    >
    {t('heroPrimaryCta')}
    </Link>
    </div>
    );
  }

  const category = categories.find((c) => c.id === product.category);
  const activePackage =
  product.packages.find((pkg) => pkg.id === selectedPkgId) || product.packages[0];

  const relatedProducts = products.filter(
    (p) => p.visible && product.relatedIds.includes(p.id)
  );

  const gramUnit = language === 'ru' || language === 'be' ? 'г' : language === 'zh' ? '克' : 'g';

  const labels = {
    ru: {
      home: 'Главная',
      packagesTitle: 'Выберите вариант фасовки',
      weight: 'Масса / объём',
      shelfLife: 'Срок годности',
      storage: 'Условия хранения',
      packagingType: 'Тип упаковки',
      unitsPerBox: 'В тарном месте',
      specsTitle: 'Характеристики продукта',
      specsSubtitle: 'Технические параметры и состав продукции',
      allPacksTitle: 'Все фасовки и логистика короба',
      allPacksSubtitle: 'Нажмите на вариант, чтобы выбрать его для запроса КП',
      fat: 'Массовая доля жира',
      fatShort: 'Жирность',
      protein: 'Белок на 100 г',
      proteinShort: 'Белок / 100 г',
      lactose: 'Лактоза',
      lactoseFreeVal: 'Без лактозы (< 0,01%)',
      lactoseNaturalVal: 'Природная молочная',
      lactoseFreeShort: 'Без лактозы',
      lactoseShort: 'Природная',
      qualityLabel: 'Стандарт',
      exportBadge: 'Экспорт B2B',
      domesticBadge: 'Розница / РБ',
      boxUnitsShort: 'шт/кор',
      related: 'Связанные позиции каталога',
    },
    be: {
      home: 'Галоўная',
      packagesTitle: 'Выберыце варыянт фасоўкі',
      weight: 'Маса / аб’ём',
      shelfLife: 'Тэрмін прыдатнасці',
      storage: 'Умовы захоўвання',
      packagingType: 'Тып упакоўкі',
      unitsPerBox: 'У тарным месцы',
      specsTitle: 'Характарыстыкі прадукту',
      specsSubtitle: 'Тэхнічныя параметры і склад прадукцыі',
      allPacksTitle: 'Усе фасоўкі і лагістыка каробкі',
      allPacksSubtitle: 'Націсніце на варыянт, каб выбраць яго для запыту КП',
      fat: 'Масавая доля тлушчу',
      fatShort: 'Тлустасць',
      protein: 'Бялок на 100 г',
      proteinShort: 'Бялок / 100 г',
      lactose: 'Лактоза',
      lactoseFreeVal: 'Без лактозы (< 0,01%)',
      lactoseNaturalVal: 'Прыродная малочная',
      lactoseFreeShort: 'Без лактозы',
      lactoseShort: 'Прыродная',
      qualityLabel: 'Стандарт',
      exportBadge: 'Экспарт B2B',
      domesticBadge: 'Розніца / РБ',
      boxUnitsShort: 'шт/кар',
      related: 'Звязаныя пазіцыі каталога',
    },
    en: {
      home: 'Home',
      packagesTitle: 'Select Packaging Variant',
      weight: 'Net Weight / Volume',
      shelfLife: 'Shelf Life',
      storage: 'Storage Conditions',
      packagingType: 'Packaging Type',
      unitsPerBox: 'Units per Box',
      specsTitle: 'Product Specifications',
      specsSubtitle: 'Technical parameters & composition',
      allPacksTitle: 'Packaging & Box Logistics',
      allPacksSubtitle: 'Click any format below to select it for your quote',
      fat: 'Fat Content',
      fatShort: 'Fat',
      protein: 'Protein / 100g',
      proteinShort: 'Protein / 100g',
      lactose: 'Lactose',
      lactoseFreeVal: 'Lactose-Free (< 0.01%)',
      lactoseNaturalVal: 'Natural dairy lactose',
      lactoseFreeShort: 'Lactose-Free',
      lactoseShort: 'Natural',
      qualityLabel: 'Compliance',
      exportBadge: 'Export B2B',
      domesticBadge: 'Retail Supply',
      boxUnitsShort: 'pcs/box',
      related: 'Related Products',
    },
    zh: {
      home: '首页',
      packagesTitle: '选择包装规格',
      weight: '净重 / 容量',
      shelfLife: '保质期',
      storage: '储存条件',
      packagingType: '包装形式',
      unitsPerBox: '每箱数量',
      specsTitle: '产品技术参数',
      specsSubtitle: '技术指标与产品成分说明',
      allPacksTitle: '全部包装规格与装箱物流',
      allPacksSubtitle: '点击下方任意规格即可切换并用于发送商业询盘',
      fat: '乳脂含量',
      fatShort: '乳脂',
      protein: '蛋白质 / 100克',
      proteinShort: '蛋白质 / 100克',
      lactose: '乳糖',
      lactoseFreeVal: '无乳糖 (< 0.01%)',
      lactoseNaturalVal: '含天然乳糖',
      lactoseFreeShort: '无乳糖',
      lactoseShort: '含天然乳糖',
      qualityLabel: '认证标准',
      exportBadge: '支持出口 B2B',
      domesticBadge: '国内零售渠道',
      boxUnitsShort: '件/箱',
      related: '相关推荐产品',
    },
  }[language];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-12 sm:space-y-14">
    <SeoHead
    title={localize(product.seo.title)}
    description={localize(product.seo.description)}
    canonicalHash={`/product/${product.slug}`}
    />

    {/* Breadcrumbs */}
    <nav className="text-xs text-slate-500 flex flex-wrap items-center gap-2" aria-label="Breadcrumb">
    <Link to="/" className="hover:text-[#0057B8] transition-colors">
    {labels.home}
    </Link>
    <span aria-hidden="true">/</span>
    <Link to="/catalog" className="hover:text-[#0057B8] transition-colors">
    {t('navCatalog')}
    </Link>
    {category && (
      <>
      <span aria-hidden="true">/</span>
      <Link to={`/catalog/${category.slug}`} className="hover:text-[#0057B8] transition-colors">
      {localize(category.name)}
      </Link>
      </>
    )}
    <span aria-hidden="true">/</span>
    <span className="text-slate-900 font-medium">{localize(product.name)}</span>
    </nav>

    {/* Hero Product Overview: Anchored Image Left + Pack Selector & CTAs Right */}
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
    {/* Left Column: Static Image + Key Nutrition/Compliance Metrics */}
    <div className="lg:col-span-6 space-y-4">
    <div className="aspect-[4/3] w-full rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 shadow-xs">
    <ImageWithFallback
    src={product.image}
    alt={localize(product.name)}
    fallbackTitle={localize(product.name)}
    className="w-full h-full object-cover"
    />
    </div>

    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 tabular-nums">
    <div className="rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 py-2.5">
    <div className="text-[11px] text-slate-500">{labels.fatShort}</div>
    <div className="font-display text-sm font-bold text-slate-900 mt-0.5">
    {product.fatContent !== undefined ? `${product.fatContent}%` : '—'}
    </div>
    </div>
    <div className="rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 py-2.5">
    <div className="text-[11px] text-slate-500">{labels.proteinShort}</div>
    <div className="font-display text-sm font-bold text-slate-900 mt-0.5">
    {product.proteinContent !== undefined
      ? `${product.proteinContent} ${gramUnit}`
      : '—'}
      </div>
      </div>
      <div className="rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 py-2.5">
      <div className="text-[11px] text-slate-500">{labels.lactose}</div>
      <div className="font-display text-sm font-bold text-slate-900 mt-0.5 truncate">
      {product.lactoseFree ? labels.lactoseFreeShort : labels.lactoseShort}
      </div>
      </div>
      <div className="rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 py-2.5">
      <div className="text-[11px] text-slate-500">{labels.qualityLabel}</div>
      <div className="font-display text-sm font-bold text-[#0057B8] mt-0.5 truncate">
      FSSC 22000
      </div>
      </div>
      </div>
      </div>

      {/* Right Column: Title, Interactive Pack Switcher, Active Pack Info, CTAs */}
      <div className="lg:col-span-6 space-y-6 min-w-0">
      <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2 text-xs">
      {category && (
        <Link
        to={`/catalog/${category.slug}`}
        className="px-2.5 py-1 rounded-md bg-blue-50 text-[#0057B8] font-semibold hover:bg-blue-100 transition-colors"
        >
        {localize(category.name)}
        </Link>
      )}
      {product.exportReady ? (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 font-medium border border-emerald-200/70">
        <Globe2 className="w-3.5 h-3.5" />
        {labels.exportBadge}
        </span>
      ) : (
        <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 font-medium">
        {labels.domesticBadge}
        </span>
      )}
      {product.lactoseFree && (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-amber-50 text-amber-800 font-medium border border-amber-200/70">
        <ShieldCheck className="w-3.5 h-3.5" />
        {labels.lactoseFreeShort}
        </span>
      )}
      </div>

      <h1 className="font-display text-2xl sm:text-4xl font-bold text-slate-900 tracking-tight leading-tight">
      {localize(product.seo.h1) || localize(product.name)}
      </h1>

      <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
      {localize(product.description)}
      </p>
      </div>

      {/* Multi-Packaging Variant Selector */}
      {product.packages.length > 0 && (
        <div className="space-y-3 pt-4 border-t border-slate-200">
        <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-700">
        {labels.packagesTitle}
        </span>
        <span className="text-xs font-mono text-slate-400 tabular-nums">
        {product.packages.length} SKU
        </span>
        </div>

        <div className="flex flex-wrap gap-2">
        {product.packages.map((pkg) => {
          const isSelected = activePackage?.id === pkg.id;
          return (
            <button
            key={pkg.id}
            type="button"
            onClick={() => setSelectedPkgId(pkg.id)}
            aria-pressed={isSelected}
            className={`px-4 py-2 text-sm font-semibold rounded-xl border transition-all duration-150 tabular-nums whitespace-nowrap ${
              isSelected
              ? 'bg-[#0057B8] text-white border-[#0057B8] shadow-xs'
              : 'bg-white text-slate-800 border-slate-200 hover:border-[#0057B8]/50 hover:text-[#0057B8]'
            }`}
            >
            {pkg.weight}
            </button>
          );
        })}
        </div>

        {activePackage && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 bg-slate-50/90 border border-slate-200 rounded-2xl p-4 sm:p-5 text-sm tabular-nums">
          <div className="flex items-start gap-2.5">
          <Package className="w-4 h-4 text-[#0057B8] shrink-0 mt-0.5" />
          <div>
          <div className="text-xs text-slate-500">{labels.weight}</div>
          <div className="font-semibold text-slate-900">{activePackage.weight}</div>
          </div>
          </div>
          <div className="flex items-start gap-2.5">
          <Clock className="w-4 h-4 text-[#0057B8] shrink-0 mt-0.5" />
          <div>
          <div className="text-xs text-slate-500">{labels.shelfLife}</div>
          <div className="font-semibold text-slate-900">
          {localize(activePackage.shelfLife)}
          </div>
          </div>
          </div>
          <div className="flex items-start gap-2.5">
          <Thermometer className="w-4 h-4 text-[#0057B8] shrink-0 mt-0.5" />
          <div>
          <div className="text-xs text-slate-500">{labels.storage}</div>
          <div className="font-semibold text-slate-900">
          {localize(activePackage.storage)}
          </div>
          </div>
          </div>
          <div className="flex items-start gap-2.5">
          <Layers className="w-4 h-4 text-[#0057B8] shrink-0 mt-0.5" />
          <div>
          <div className="text-xs text-slate-500">{labels.unitsPerBox}</div>
          <div className="font-semibold text-slate-900 break-all">
          {activePackage.unitsPerBox} {labels.boxUnitsShort} · GTIN {activePackage.gtin}
          </div>
          </div>
          </div>
          <div className="sm:col-span-2 pt-2.5 border-t border-slate-200/80 text-xs text-slate-600">
          <span className="text-slate-500">{labels.packagingType}: </span>
          <span className="font-medium text-slate-900">
          {localize(activePackage.packagingType)}
          </span>
          </div>
          </div>
        )}
        </div>
      )}

      {/* B2B Actions */}
      <div className="flex flex-col sm:flex-row flex-wrap gap-3 pt-1">
      <button
      type="button"
      onClick={() => setModalOpen(true)}
      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-white bg-[#0057B8] rounded-xl hover:bg-[#004494] transition-colors shadow-xs"
      >
      <MessageSquare className="w-4 h-4 shrink-0" />
      <span>{t('requestSalesBtn')}</span>
      </button>
      <button
      type="button"
      onClick={() => downloadProductB2BSpec(product, category, language)}
      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-slate-800 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors"
      >
      <Download className="w-4 h-4 shrink-0" />
      <span>{t('downloadSpecBtn')}</span>
      </button>
      </div>
      </div>
      </div>

      {/* Dedicated Full-Width Section: Technical Specifications & All Pack Formats */}
      <div className="pt-8 border-t border-slate-200 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Dynamic Category-Specific Characteristics Table */}
      <section className="lg:col-span-6 space-y-4">
      <div>
      <h2 className="font-display text-xl font-bold text-slate-900">
      {labels.specsTitle}
      </h2>
      <p className="text-xs text-slate-500 mt-1">{labels.specsSubtitle}</p>
      </div>

      <dl className="divide-y divide-slate-200 border border-slate-200 rounded-2xl overflow-hidden text-sm tabular-nums bg-white">
      {product.fatContent !== undefined && (
        <div className="px-4 py-3.5 flex justify-between gap-4 bg-white">
        <dt className="text-slate-500">{labels.fat}</dt>
        <dd className="font-semibold text-slate-900 min-w-0 break-words text-right">
        {product.fatContent}%
        </dd>
        </div>
      )}
      {product.proteinContent !== undefined && (
        <div className="px-4 py-3.5 flex justify-between gap-4 bg-slate-50/60">
        <dt className="text-slate-500">{labels.protein}</dt>
        <dd className="font-semibold text-slate-900 min-w-0 break-words text-right">
        {product.proteinContent} {gramUnit}
        </dd>
        </div>
      )}
      <div className="px-4 py-3.5 flex justify-between gap-4 bg-white">
      <dt className="text-slate-500">{labels.lactose}</dt>
      <dd className="font-semibold text-slate-900 min-w-0 break-words text-right">
      {product.lactoseFree ? labels.lactoseFreeVal : labels.lactoseNaturalVal}
      </dd>
      </div>

      {Object.entries(product.characteristics).map(([key, value], idx) => {
        const schemaItem = category?.characteristicSchema.find((f) => f.key === key);
        const label = schemaItem ? localize(schemaItem.label) : key;
        return (
          <div
          key={key}
          className={`px-4 py-3.5 flex justify-between gap-4 ${
            idx % 2 === 0 ? 'bg-slate-50/60' : 'bg-white'
          }`}
          >
          <dt className="text-slate-500">{label}</dt>
          <dd className="font-semibold text-slate-900 min-w-0 break-words text-right">
          {localize(value)}
          </dd>
          </div>
        );
      })}
      </dl>
      </section>

      {/* Interactive All-Packs Logistics Matrix */}
      {product.packages.length > 0 && (
        <section className="lg:col-span-6 space-y-4">
        <div>
        <h2 className="font-display text-xl font-bold text-slate-900">
        {labels.allPacksTitle}
        </h2>
        <p className="text-xs text-slate-500 mt-1">{labels.allPacksSubtitle}</p>
        </div>

        <div className="space-y-2.5">
        {product.packages.map((pkg) => {
          const isSelected = activePackage?.id === pkg.id;
          return (
            <button
            key={pkg.id}
            type="button"
            onClick={() => setSelectedPkgId(pkg.id)}
            className={`w-full text-left rounded-2xl border p-4 transition-all duration-150 flex items-center justify-between gap-4 tabular-nums ${
              isSelected
              ? 'bg-blue-50/70 border-[#0057B8] shadow-xs ring-1 ring-[#0057B8]/20'
              : 'bg-white border-slate-200 hover:border-[#0057B8]/40 hover:bg-slate-50/60'
            }`}
            >
            <div className="min-w-0 space-y-1">
            <div className="flex flex-wrap items-center gap-2">
            <span className="font-display text-base font-bold text-slate-900">
            {pkg.weight}
            </span>
            <span className="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">
            {localize(pkg.shelfLife)}
            </span>
            <span className="text-xs text-slate-500">
            {localize(pkg.storage)}
            </span>
            </div>
            <div className="text-xs text-slate-600 truncate">
            {localize(pkg.packagingType)}
            </div>
            <div className="text-[11px] font-mono text-slate-400">
            {pkg.unitsPerBox} {labels.boxUnitsShort} · GTIN {pkg.gtin}
            </div>
            </div>

            <div
            className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-colors ${
              isSelected
              ? 'bg-[#0057B8] text-white'
              : 'bg-slate-100 text-slate-400'
            }`}
            >
            <Check className="w-4 h-4" />
            </div>
            </button>
          );
        })}
        </div>
        </section>
      )}
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="space-y-6 pt-8 border-t border-slate-200">
        <h2 className="font-display text-2xl font-bold text-slate-900">
        {labels.related}
        </h2>
        <ProductGrid products={relatedProducts} />
        </section>
      )}

      <B2BInquiryModal
      open={modalOpen}
      onClose={() => setModalOpen(false)}
      product={product}
      selectedPackageId={activePackage?.id}
      defaultChannel={product.exportReady ? 'export' : 'wholesale'}
      />
      </div>
  );
};
