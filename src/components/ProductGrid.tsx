import React from 'react';
import { PackageSearch } from 'lucide-react';
import { Product } from '../types';
import { ProductCard } from './ProductCard';
import { useLanguage } from '../hooks/useLanguage';

interface ProductGridProps {
  products: Product[];
  onResetFilters?: () => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({ products, onResetFilters }) => {
  const { language } = useLanguage();

  if (products.length === 0) {
    return (
      <div className="border border-slate-200 rounded-xl bg-slate-50/70 p-10 text-center space-y-3">
        <PackageSearch className="w-8 h-8 text-slate-400 mx-auto" strokeWidth={1.5} />
        <h3 className="font-display text-base font-semibold text-slate-900">
          {language === 'ru'
            ? 'По выбранным параметрам товары не найдены'
            : language === 'be'
            ? 'Па выбраных параметрах тавары не знойдзены'
            : language === 'zh'
            ? '未找到符合筛选条件的产品'
            : 'No products match the selected filters'}
        </h3>
        <p className="text-sm text-slate-600 max-w-md mx-auto">
          {language === 'ru'
            ? 'Попробуйте изменить диапазон жирности, сбросить фильтр категории или воспользоваться умным подбором.'
            : language === 'be'
            ? 'Паспрабуйце змяніць дыяпазон тлустасці або скінуць фільтр.'
            : language === 'zh'
            ? '请尝试调整乳脂范围或重置筛选条件。'
            : 'Try adjusting the fat range, clearing category filters, or using the Smart Matcher.'}
        </p>
        {onResetFilters && (
          <button
            type="button"
            onClick={onResetFilters}
            className="inline-flex items-center px-4 py-2 text-xs font-semibold text-white bg-[#0057B8] rounded-lg hover:bg-[#004494] transition-colors"
          >
            {language === 'ru'
              ? 'Сбросить фильтры'
              : language === 'be'
              ? 'Скінуць фільтры'
              : language === 'zh'
              ? '重置筛选'
              : 'Reset filters'}
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};
