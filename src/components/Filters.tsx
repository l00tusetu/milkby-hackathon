import React, { useState } from 'react';
import { RotateCcw, SlidersHorizontal, ChevronDown } from 'lucide-react';
import { Category } from '../types';
import { useLanguage } from '../hooks/useLanguage';

export interface CatalogFilterState {
  categoryId: string;
  subcategoryId: string;
  fatRange: 'all' | 'low' | 'medium' | 'high';
  lactoseFreeOnly: boolean;
  highProteinOnly: boolean;
  exportReadyOnly: boolean;
  sortBy: 'featured' | 'fat-asc' | 'fat-desc' | 'protein-desc' | 'name';
}

interface FiltersProps {
  categories: Category[];
  state: CatalogFilterState;
  onChange: (next: CatalogFilterState) => void;
  onReset: () => void;
  totalCount: number;
}

export const Filters: React.FC<FiltersProps> = ({
  categories,
  state,
  onChange,
  onReset,
  totalCount,
}) => {
  const { language, localize } = useLanguage();
  const [mobileOpen, setMobileOpen] = useState(false);
  const activeCategory = categories.find((c) => c.id === state.categoryId);

  const labels = {
    filtersToggle:
    language === 'ru'
    ? 'Фильтры и сортировка'
    : language === 'be'
    ? 'Фільтры і сартаванне'
    : language === 'zh'
    ? '筛选与排序'
    : 'Filters & Sorting',
    category: language === 'ru' ? 'Категория' : language === 'be' ? 'Катэгорыя' : language === 'zh' ? '产品分类' : 'Category',
    allCategories: language === 'ru' ? 'Все категории' : language === 'be' ? 'Усе катэгорыі' : language === 'zh' ? '全部分类' : 'All categories',
    subcategory: language === 'ru' ? 'Подкатегория' : language === 'be' ? 'Падкатэгорыя' : language === 'zh' ? '细分系列' : 'Subcategory',
    allSubs: language === 'ru' ? 'Все виды' : language === 'be' ? 'Усе віды' : language === 'zh' ? '全部子项' : 'All types',
    fat: language === 'ru' ? 'Жирность' : language === 'be' ? 'Тлустасць' : language === 'zh' ? '乳脂含量' : 'Fat content',
    fatAll: language === 'ru' ? 'Любая' : language === 'be' ? 'Любая' : language === 'zh' ? '不限' : 'Any',
    fatLow: language === 'ru' ? 'До 5% (лёгкие)' : language === 'be' ? 'Да 5%' : language === 'zh' ? '≤ 5% 低脂' : 'Up to 5%',
    fatMed: language === 'ru' ? '15% – 35%' : language === 'be' ? '15% – 35%' : language === 'zh' ? '15% – 35%' : '15% – 35%',
    fatHigh: language === 'ru' ? '45%+ (сыры и масло)' : language === 'be' ? '45%+ (сыры і масла)' : language === 'zh' ? '≥ 45% 奶酪黄油' : '45%+ (cheese & butter)',
    lactoseFree: language === 'ru' ? 'Без лактозы' : language === 'be' ? 'Без лактозы' : language === 'zh' ? '无乳糖' : 'Lactose-free',
    highProtein: language === 'ru' ? 'Высокий белок (≥8 г)' : language === 'be' ? 'Высокі бялок (≥8 г)' : language === 'zh' ? '高蛋白 (≥8克)' : 'High protein (≥8g)',
    exportReady: language === 'ru' ? 'Экспорт / B2B' : language === 'be' ? 'Экспарт / B2B' : language === 'zh' ? '支持出口 / B2B' : 'Export / B2B ready',
    sort: language === 'ru' ? 'Сортировка' : language === 'be' ? 'Сартаванне' : language === 'zh' ? '排序' : 'Sort by',
    sortFeatured: language === 'ru' ? 'Популярные' : language === 'be' ? 'Папулярныя' : language === 'zh' ? '默认推荐' : 'Featured',
    sortFatAsc: language === 'ru' ? 'Жирность: по возрастанию' : language === 'be' ? 'Тлустасць ↑' : language === 'zh' ? '脂肪含量 ↑' : 'Fat: Low to High',
    sortFatDesc: language === 'ru' ? 'Жирность: по убыванию' : language === 'be' ? 'Тлустасць ↓' : language === 'zh' ? '脂肪含量 ↓' : 'Fat: High to Low',
    sortProtein: language === 'ru' ? 'Больше белка' : language === 'be' ? 'Больш бялку' : language === 'zh' ? '蛋白质从高到低' : 'Highest protein',
    sortName: language === 'ru' ? 'По алфавиту' : language === 'be' ? 'Па алфавіце' : language === 'zh' ? '按名称' : 'Alphabetical',
    found: language === 'ru' ? 'Позиций:' : language === 'be' ? 'Пазіцый:' : language === 'zh' ? '产品数:' : 'Items:',
    reset: language === 'ru' ? 'Сбросить' : language === 'be' ? 'Скінуць' : language === 'zh' ? '重置' : 'Reset',
  };

  const showLactoseFilter = !activeCategory || activeCategory.filterKeys.includes('lactoseFree');
  const showProteinFilter = !activeCategory || activeCategory.filterKeys.includes('highProtein');
  const showExportFilter = !activeCategory || activeCategory.filterKeys.includes('exportReady');

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 sm:p-5 space-y-4">
    <div className="flex sm:hidden items-center justify-between gap-3">
    <button
    type="button"
    onClick={() => setMobileOpen((prev) => !prev)}
    aria-expanded={mobileOpen}
    className="inline-flex items-center gap-2 text-sm font-semibold text-slate-800"
    >
    <SlidersHorizontal className="w-4 h-4 text-[#0057B8]" />
    <span>{labels.filtersToggle}</span>
    <ChevronDown
    className={`w-4 h-4 text-slate-500 transition-transform ${mobileOpen ? 'rotate-180' : ''}`}
    />
    </button>
    <span className="text-xs text-slate-500 tabular-nums">
    {labels.found} <strong className="text-slate-900">{totalCount}</strong>
    </span>
    </div>

    <div className={`${mobileOpen ? 'block' : 'hidden'} sm:block space-y-4`}>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
    <div>
    <label className="block text-xs font-medium text-slate-600 mb-1.5">
    {labels.category}
    </label>
    <select
    value={state.categoryId}
    onChange={(e) =>
      onChange({
        ...state,
        categoryId: e.target.value,
        subcategoryId: 'all',
      })
    }
    className="w-full h-10 px-3 text-sm bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-[#0057B8]"
    >
    <option value="all">{labels.allCategories}</option>
    {categories.map((cat) => (
      <option key={cat.id} value={cat.id}>
      {localize(cat.name)}
      </option>
    ))}
    </select>
    </div>

    <div>
    <label className="block text-xs font-medium text-slate-600 mb-1.5">
    {labels.subcategory}
    </label>
    <select
    value={state.subcategoryId}
    disabled={!activeCategory || activeCategory.subcategories.length === 0}
    onChange={(e) => onChange({ ...state, subcategoryId: e.target.value })}
    className="w-full h-10 px-3 text-sm bg-white border border-slate-200 rounded-lg text-slate-900 disabled:bg-slate-100 disabled:text-slate-400 focus:outline-none focus:border-[#0057B8]"
    >
    <option value="all">{labels.allSubs}</option>
    {activeCategory?.subcategories.map((sub) => (
      <option key={sub.id} value={sub.id}>
      {localize(sub.name)}
      </option>
    ))}
    </select>
    </div>

    <div>
    <label className="block text-xs font-medium text-slate-600 mb-1.5">
    {labels.fat}
    </label>
    <select
    value={state.fatRange}
    onChange={(e) =>
      onChange({ ...state, fatRange: e.target.value as CatalogFilterState['fatRange'] })
    }
    className="w-full h-10 px-3 text-sm bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-[#0057B8]"
    >
    <option value="all">{labels.fatAll}</option>
    <option value="low">{labels.fatLow}</option>
    <option value="medium">{labels.fatMed}</option>
    <option value="high">{labels.fatHigh}</option>
    </select>
    </div>

    <div>
    <label className="block text-xs font-medium text-slate-600 mb-1.5">
    {labels.sort}
    </label>
    <select
    value={state.sortBy}
    onChange={(e) =>
      onChange({ ...state, sortBy: e.target.value as CatalogFilterState['sortBy'] })
    }
    className="w-full h-10 px-3 text-sm bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-[#0057B8]"
    >
    <option value="featured">{labels.sortFeatured}</option>
    <option value="fat-asc">{labels.sortFatAsc}</option>
    <option value="fat-desc">{labels.sortFatDesc}</option>
    <option value="protein-desc">{labels.sortProtein}</option>
    <option value="name">{labels.sortName}</option>
    </select>
    </div>
    </div>

    <div className="pt-3 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-4">
    <div className="flex flex-wrap items-center gap-4 text-sm text-slate-700">
    {showLactoseFilter && (
      <label className="inline-flex items-center gap-2 cursor-pointer select-none">
      <input
      type="checkbox"
      checked={state.lactoseFreeOnly}
      onChange={(e) => onChange({ ...state, lactoseFreeOnly: e.target.checked })}
      className="w-4 h-4 rounded border-slate-300 text-[#0057B8] focus:ring-[#0057B8]"
      />
      <span>{labels.lactoseFree}</span>
      </label>
    )}

    {showProteinFilter && (
      <label className="inline-flex items-center gap-2 cursor-pointer select-none">
      <input
      type="checkbox"
      checked={state.highProteinOnly}
      onChange={(e) => onChange({ ...state, highProteinOnly: e.target.checked })}
      className="w-4 h-4 rounded border-slate-300 text-[#0057B8] focus:ring-[#0057B8]"
      />
      <span>{labels.highProtein}</span>
      </label>
    )}

    {showExportFilter && (
      <label className="inline-flex items-center gap-2 cursor-pointer select-none">
      <input
      type="checkbox"
      checked={state.exportReadyOnly}
      onChange={(e) => onChange({ ...state, exportReadyOnly: e.target.checked })}
      className="w-4 h-4 rounded border-slate-300 text-[#0057B8] focus:ring-[#0057B8]"
      />
      <span>{labels.exportReady}</span>
      </label>
    )}
    </div>

    <div className="flex items-center gap-4 text-xs text-slate-500 tabular-nums">
    <span className="hidden sm:inline">
    {labels.found} <strong className="text-slate-900">{totalCount}</strong>
    </span>
    <button
    type="button"
    onClick={onReset}
    className="inline-flex items-center gap-1.5 text-slate-600 hover:text-[#0057B8] font-medium transition-colors whitespace-nowrap shrink-0"
    >
    <RotateCcw className="w-3.5 h-3.5" />
    {labels.reset}
    </button>
    </div>
    </div>
    </div>
    </div>
  );
};
