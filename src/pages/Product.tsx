import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Download, MessageSquare, Package, Thermometer, Clock, Layers } from 'lucide-react';
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
    className="inline-flex px-4 py-2 text-sm font-semibold text-white bg-[#0057B8] rounded-lg"
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

  const gramUnit = language === 'ru' || language === 'be' ? 'г' : 'g';

  const labels = {
    home: language === 'ru' ? 'Главная' : language === 'be' ? 'Галоўная' : language === 'zh' ? '首页' : 'Home',
    packagesTitle:
    language === 'ru'
    ? 'Выберите вариант фасовки'
    : language === 'be'
    ? 'Выберыце варыянт фасоўкі'
    : language === 'zh'
    ? '选择包装规格'
    : 'Select Packaging Variant',
    weight: language === 'ru' ? 'Масса / объём' : language === 'be' ? 'Маса / аб’ём' : language === 'zh' ? '净重 / 容量' : 'Net Weight / Volume',
    shelfLife: language === 'ru' ? 'Срок годности' : language === 'be' ? 'Тэрмін прыдатнасці' : language === 'zh' ? '保质期' : 'Shelf Life',
    storage: language === 'ru' ? 'Условия хранения' : language === 'be' ? 'Умовы захоўвання' : language === 'zh' ? '储存条件' : 'Storage',
    packagingType: language === 'ru' ? 'Тип упаковки' : language === 'be' ? 'Тып упакоўкі' : language === 'zh' ? '包装形式' : 'Packaging',
    unitsPerBox: language === 'ru' ? 'Единиц в тарном месте' : language === 'be' ? 'Адзінак у тарным месцы' : language === 'zh' ? '每箱数量' : 'Units per Box',
    specsTitle:
    language === 'ru'
    ? 'Характеристики продукта'
    : language === 'be'
    ? 'Характарыстыкі прадукту'
    : language === 'zh'
    ? '产品技术参数'
    : 'Product Specifications',
    fat: language === 'ru' ? 'Массовая доля жира' : language === 'be' ? 'Масавая доля тлушчу' : language === 'zh' ? '乳脂含量' : 'Fat Content',
    protein: language === 'ru' ? 'Белок на 100 г' : language === 'be' ? 'Бялок на 100 г' : language === 'zh' ? '蛋白质 / 100克' : 'Protein / 100g',
    lactose: language === 'ru' ? 'Лактоза' : language === 'be' ? 'Лактоза' : language === 'zh' ? '乳糖' : 'Lactose',
    related:
    language === 'ru'
    ? 'Связанные позиции каталога'
    : language === 'be'
    ? 'Звязаныя пазіцыі каталога'
    : language === 'zh'
    ? '相关推荐产品'
    : 'Related Products',
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-14">
    <SeoHead
    title={localize(product.seo.title)}
    description={localize(product.seo.description)}
    canonicalHash={`/product/${product.slug}`}
    />

    {/* Breadcrumbs */}
    <nav className="text-xs text-slate-500 flex flex-wrap items-center gap-2" aria-label="Breadcrumb">
    <Link to="/" className="hover:text-[#0057B8]">
    {labels.home}
    </Link>
    <span aria-hidden="true">/</span>
    <Link to="/catalog" className="hover:text-[#0057B8]">
    {t('navCatalog')}
    </Link>
    {category && (
      <>
      <span aria-hidden="true">/</span>
      <Link to={`/catalog/${category.slug}`} className="hover:text-[#0057B8]">
      {localize(category.name)}
      </Link>
      </>
    )}
    <span aria-hidden="true">/</span>
    <span className="text-slate-900 font-medium">{localize(product.name)}</span>
    </nav>

    {/* Contiguous Product Module: Sticky Gallery Left + Packaging & Specs Right */}
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
    <div className="lg:col-span-6 lg:sticky lg:top-24">
    <div className="aspect-[4/3] w-full rounded-2xl overflow-hidden border border-slate-200 bg-slate-50">
    <ImageWithFallback
    src={product.image}
    alt={localize(product.name)}
    fallbackTitle={localize(product.name)}
    className="w-full h-full object-cover"
    />
    </div>
    </div>

    <div className="lg:col-span-6 space-y-6 min-w-0">
    <div className="space-y-3">
    <div className="text-xs text-slate-500 flex flex-wrap items-center gap-2 tabular-nums">
    {category && (
      <Link to={`/catalog/${category.slug}`} className="font-semibold text-[#0057B8] hover:underline">
      {localize(category.name)}
      </Link>
    )}
    {product.fatContent !== undefined && (
      <>
      <span aria-hidden="true">·</span>
      <span>{product.fatContent}%</span>
      </>
    )}
    {product.exportReady && (
      <>
      <span aria-hidden="true">·</span>
      <span>Export B2B</span>
      </>
    )}
    </div>

    <h1 className="font-display text-3xl sm:text-4xl font-bold text-slate-900">
    {localize(product.seo.h1) || localize(product.name)}
    </h1>

    <p className="text-base text-slate-600 leading-relaxed">
    {localize(product.description)}
    </p>
    </div>

    {/* Multi-Packaging Variant Selector */}
    {product.packages.length > 0 && (
      <div className="space-y-3 pt-2 border-t border-slate-200">
      <div className="text-xs font-semibold text-slate-900">
      {labels.packagesTitle}
      </div>
      <div className="flex flex-wrap gap-2">
      {product.packages.map((pkg) => {
        const isSelected = activePackage?.id === pkg.id;
        return (
          <button
          key={pkg.id}
          type="button"
          onClick={() => setSelectedPkgId(pkg.id)}
          className={`px-4 py-2 text-sm font-medium rounded-lg border transition-colors tabular-nums whitespace-nowrap ${
            isSelected
            ? 'bg-[#0057B8] text-white border-[#0057B8]'
            : 'bg-white text-slate-800 border-slate-200 hover:border-[#0057B8]/50'
          }`}
          >
          {pkg.weight}
          </button>
        );
      })}
      </div>

      {activePackage && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm tabular-nums">
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
        <div className="font-semibold text-slate-900">{localize(activePackage.shelfLife)}</div>
        </div>
        </div>
        <div className="flex items-start gap-2.5">
        <Thermometer className="w-4 h-4 text-[#0057B8] shrink-0 mt-0.5" />
        <div>
        <div className="text-xs text-slate-500">{labels.storage}</div>
        <div className="font-semibold text-slate-900">{localize(activePackage.storage)}</div>
        </div>
        </div>
        <div className="flex items-start gap-2.5">
        <Layers className="w-4 h-4 text-[#0057B8] shrink-0 mt-0.5" />
        <div>
        <div className="text-xs text-slate-500">{labels.unitsPerBox}</div>
        <div className="font-semibold text-slate-900 break-all">
        {activePackage.unitsPerBox} · GTIN {activePackage.gtin}
        </div>
        </div>
        </div>
        <div className="sm:col-span-2 pt-2 border-t border-slate-200/80 text-xs text-slate-600">
        <span className="text-slate-500">{labels.packagingType}: </span>
        <span className="font-medium text-slate-800">{localize(activePackage.packagingType)}</span>
        </div>
        </div>
      )}
      </div>
    )}

    {/* B2B Actions */}
    <div className="flex flex-wrap gap-3 pt-1">
    <button
    type="button"
    onClick={() => setModalOpen(true)}
    className="inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold text-white bg-[#0057B8] rounded-lg hover:bg-[#004494] transition-colors"
    >
    <MessageSquare className="w-4 h-4 shrink-0" />
    <span>{t('requestSalesBtn')}</span>
    </button>
    <button
    type="button"
    onClick={() => downloadProductB2BSpec(product, category, language)}
    className="inline-flex items-center gap-2 px-4 py-3 text-sm font-semibold text-slate-800 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
    >
    <Download className="w-4 h-4 shrink-0" />
    <span>{t('downloadSpecBtn')}</span>
    </button>
    </div>

    {/* Dynamic Category-Specific Characteristics Table */}
    <div className="space-y-3 pt-4 border-t border-slate-200">
    <h2 className="font-display text-lg font-semibold text-slate-900">
    {labels.specsTitle}
    </h2>
    <dl className="divide-y divide-slate-200 border border-slate-200 rounded-xl overflow-hidden text-sm tabular-nums">
    {product.fatContent !== undefined && (
      <div className="px-4 py-3 flex justify-between gap-4 bg-white">
      <dt className="text-slate-500">{labels.fat}</dt>
      <dd className="font-medium text-slate-900">{product.fatContent}%</dd>
      </div>
    )}
    {product.proteinContent !== undefined && (
      <div className="px-4 py-3 flex justify-between gap-4 bg-slate-50/50">
      <dt className="text-slate-500">{labels.protein}</dt>
      <dd className="font-medium text-slate-900">{product.proteinContent} {gramUnit}</dd>
      </div>
    )}
    <div className="px-4 py-3 flex justify-between gap-4 bg-white">
    <dt className="text-slate-500">{labels.lactose}</dt>
    <dd className="font-medium text-slate-900 text-right">
    {product.lactoseFree
      ? language === 'ru'
      ? 'Без лактозы (< 0,01%)'
      : language === 'be'
      ? 'Без лактозы (< 0,01%)'
      : language === 'zh'
      ? '无乳糖 (< 0.01%)'
      : 'Lactose-Free (< 0.01%)'
      : language === 'ru'
      ? 'Природная молочная'
      : language === 'be'
      ? 'Прыродная малочная'
      : language === 'zh'
      ? '含天然乳糖'
  : 'Natural dairy lactose'}
  </dd>
  </div>

  {Object.entries(product.characteristics).map(([key, value], idx) => {
    const schemaItem = category?.characteristicSchema.find((f) => f.key === key);
    const label = schemaItem ? localize(schemaItem.label) : key;
    return (
      <div
      key={key}
      className={`px-4 py-3 flex justify-between gap-4 ${
        idx % 2 === 0 ? 'bg-slate-50/50' : 'bg-white'
      }`}
      >
      <dt className="text-slate-500">{label}</dt>
      <dd className="font-medium text-slate-900 text-right">{localize(value)}</dd>
      </div>
    );
  })}
  </dl>
  </div>
  </div>
  </div>

  {/* Related Products */}
  {relatedProducts.length > 0 && (
    <section className="space-y-6 pt-6 border-t border-slate-200">
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
