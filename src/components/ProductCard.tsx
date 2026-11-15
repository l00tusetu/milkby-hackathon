import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, Sparkles } from 'lucide-react';
import { Language, Product } from '../types';
import { useLanguage } from '../hooks/useLanguage';
import { useCatalogStore } from '../hooks/useCatalogStore';
import { packageLabelTranslations } from '../data/packageLabelTranslations';
import { ImageWithFallback } from './ImageWithFallback';

interface ProductCardProps {
  product: Product;
  variant?: 'default' | 'promo';
}

const reportedMissingPackageLabels = new Set<string>();

function localizePackageLabel(weight: string, language: Language): string {
  if (language === 'ru') return weight;

  const translation = packageLabelTranslations[weight]?.[language];
  if (!translation) {
    const key = `${language}:${weight}`;
    if (!reportedMissingPackageLabels.has(key)) {
      console.warn(`Missing ${language} package label translation for "${weight}"`);
      reportedMissingPackageLabels.add(key);
    }
    return weight;
  }
  return translation;
}

function getPromoBadge(product: Product, language: Language): string {
  if (product.id === 'syr-myagkiy-slivochnyy-goroden') {
    return { ru: 'Хит HoReCa', be: 'Хіт HoReCa', en: 'HoReCa Hit', zh: '餐饮热销' }[language];
  }
  if (product.id === 'syr-gubert' || product.id === 'syr-grodnenskaya-vezha') {
    return {
      ru: 'Серия «ГороденЪ»',
      be: 'Серыя «ГорадзенЪ»',
      en: 'Goroden Reserve',
      zh: 'Goroden 臻选',
    }[language];
  }
  if (product.lactoseFree) {
    return {
      ru: '0% лактозы',
      be: '0% лактозы',
      en: 'Lactose-Free',
      zh: '零乳糖',
    }[language];
  }
  if (product.id === 'maslo-goroden' || product.id === 'maslo-vesovoe') {
    return {
      ru: 'Сливки 82,5%',
      be: 'Вяршкі 82,5%',
      en: '82.5% Cream',
      zh: '82.5% 纯脂',
    }[language];
  }
  if ((product.proteinContent ?? 0) >= 8) {
    return {
      ru: 'Высокобелковый',
      be: 'Высокабялковы',
      en: 'High Protein',
      zh: '高蛋白',
    }[language];
  }
  if (product.id === 'moloko-sterilizovannoe' || product.id === 'moloko-goroden') {
    return {
      ru: 'Сорт «Экстра»',
      be: 'Гатунак «Экстра»',
      en: 'Extra Grade',
      zh: '特级鲜奶',
    }[language];
  }
  return {
    ru: 'Выбор покупателей',
    be: 'Выбар пакупнікоў',
    en: 'Bestseller',
    zh: '口碑精选',
  }[language];
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, variant = 'default' }) => {
  const { language, localize } = useLanguage();
  const { categories } = useCatalogStore();

  const category = categories.find((c) => c.id === product.category);
  const categoryName = category ? localize(category.name) : product.category;
  const productName = localize(product.name);
  const productDesc = localize(product.description);

  if (variant === 'promo') {
    const promoBadge = getPromoBadge(product, language);
    const selectLabel =
    language === 'ru'
    ? 'Выбрать'
    : language === 'be'
    ? 'Выбраць'
    : language === 'zh'
    ? '查看'
    : 'View';

    return (
      <Link
      to={`/product/${product.slug}`}
      className="group h-full flex flex-col bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-xs hover:border-[#0057B8]/50 hover:-translate-y-1 hover:shadow-xl transition-all duration-200 ease-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0057B8]"
      >
      <div className="relative aspect-[16/10] w-full bg-slate-50 overflow-hidden border-b border-slate-100 shrink-0">
      <ImageWithFallback
      src={product.image}
      fallbackSrc={product.localImage}
      alt={productName}
      fallbackTitle={productName}
      className="w-full h-full object-cover group-hover:scale-[1.05] transition-transform duration-300 ease-out"
      />

      <div className="absolute inset-x-0 top-0 p-2.5 flex items-start justify-between gap-2 pointer-events-none">
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#0057B8]/95 text-white text-[11px] font-semibold shadow-sm backdrop-blur-xs">
      <Sparkles className="w-3 h-3 shrink-0" />
      <span>{promoBadge}</span>
      </span>

      {product.fatContent !== undefined && (
        <span className="px-2 py-0.5 rounded-full bg-white/95 text-slate-900 border border-slate-200/80 text-[11px] font-bold tabular-nums shadow-xs">
        {product.fatContent}%
        </span>
      )}
      </div>
      </div>

      <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between gap-2.5">
      <div className="space-y-1.5">
      <div className="text-[11px] font-semibold uppercase tracking-wide text-[#0057B8]">
      {categoryName}
      </div>

      <h3 className="font-display text-[15px] font-bold text-slate-900 group-hover:text-[#0057B8] transition-colors duration-200 leading-snug line-clamp-2">
      {productName}
      </h3>

      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{productDesc}</p>
      </div>

      <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2 text-xs tabular-nums">
      <span className="text-slate-500 truncate">
      {product.packages
        .map((p) => localizePackageLabel(p.weight, language))
        .slice(0, 2)
        .join(' · ')}
        </span>
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 text-[#0057B8] font-semibold group-hover:bg-[#0057B8] group-hover:text-white transition-colors duration-200 whitespace-nowrap shrink-0">
        <span>{selectLabel}</span>
        <ArrowRight className="w-3 h-3 transition-transform duration-200 group-hover:translate-x-0.5" />
        </span>
        </div>
        </div>
        </Link>
    );
  }

  const packCountLabel =
  language === 'ru'
  ? `${product.packages.length} фас.`
  : language === 'be'
  ? `${product.packages.length} фас.`
  : language === 'zh'
  ? `${product.packages.length} 种包装`
  : `${product.packages.length} packs`;

  const viewLabel =
  language === 'ru'
  ? 'Подробнее'
  : language === 'be'
  ? 'Падрабязней'
  : language === 'zh'
  ? '查看详情'
  : 'Details';

  return (
    <Link
    to={`/product/${product.slug}`}
    className="group h-full flex flex-col bg-white border border-slate-200 rounded-xl overflow-hidden hover:border-[#0057B8]/40 hover:-translate-y-1 hover:shadow-lg transition-all duration-200 ease-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0057B8]"
    >
    <div className="aspect-[4/3] w-full bg-slate-50 overflow-hidden border-b border-slate-100 shrink-0">
    <ImageWithFallback
    src={product.image}
    fallbackSrc={product.localImage}
    alt={productName}
    fallbackTitle={productName}
    className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-300 ease-out"
    />
    </div>

    <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between gap-3 sm:gap-4">
    <div className="space-y-2">
    <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500 tabular-nums">
    <span className="font-medium text-[#0057B8]">{categoryName}</span>
    {product.fatContent !== undefined && (
      <>
      <span aria-hidden="true">·</span>
      <span>{product.fatContent}%</span>
      </>
    )}
    {product.lactoseFree && (
      <>
      <span aria-hidden="true">·</span>
      <span>
      {language === 'ru'
        ? 'Без лактозы'
        : language === 'be'
        ? 'Без лактозы'
        : language === 'zh'
        ? '无乳糖'
    : 'Lactose-Free'}
    </span>
    </>
    )}
    </div>

    <h3 className="font-display text-base font-semibold text-slate-900 group-hover:text-[#0057B8] transition-colors duration-200 leading-snug">
    {productName}
    </h3>

    <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed">{productDesc}</p>
    </div>

    <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 text-xs text-slate-500 tabular-nums">
    <span className="truncate">
    {product.packages
      .map((p) => localizePackageLabel(p.weight, language))
      .slice(0, 3)
      .join(' / ')}
      {product.packages.length > 3 ? ` · ${packCountLabel}` : ''}
      </span>
      <span className="inline-flex items-center gap-1 font-medium text-slate-700 group-hover:text-[#0057B8] transition-colors duration-200 whitespace-nowrap shrink-0">
      {viewLabel}
      <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </span>
      </div>
      </div>
      </Link>
  );
};
