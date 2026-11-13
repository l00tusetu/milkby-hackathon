import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { Product } from '../types';
import { useLanguage } from '../hooks/useLanguage';
import { useCatalogStore } from '../hooks/useCatalogStore';
import { ImageWithFallback } from './ImageWithFallback';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { language, localize } = useLanguage();
  const { categories } = useCatalogStore();

  const category = categories.find((c) => c.id === product.category);
  const categoryName = category ? localize(category.name) : product.category;
  const productName = localize(product.name);
  const productDesc = localize(product.description);

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
    className="group flex flex-col bg-white border border-slate-200 rounded-xl overflow-hidden hover:border-[#0057B8]/40 hover:-translate-y-1 hover:shadow-lg transition-all duration-200 ease-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0057B8]"
    >
    <div className="aspect-[4/3] w-full bg-slate-50 overflow-hidden border-b border-slate-100">
    <ImageWithFallback
    src={product.image}
    alt={productName}
    fallbackTitle={productName}
    className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-300 ease-out"
    />
    </div>

    <div className="p-5 flex-1 flex flex-col justify-between gap-4">
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

    <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed">
    {productDesc}
    </p>
    </div>

    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 tabular-nums">
    <span>
    {product.packages.map((p) => p.weight).slice(0, 3).join(' / ')}
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
