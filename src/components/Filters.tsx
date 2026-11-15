import React, { useMemo, useState } from 'react';
import { RotateCcw, SlidersHorizontal, ChevronDown } from 'lucide-react';
import { Category, Product } from '../types';
import { useLanguage } from '../hooks/useLanguage';

export interface CatalogFilterState {
  categoryId: string;
  subcategoryId: string;
  fatRange: 'all' | 'low' | 'medium' | 'high';
  weightRange: 'all' | 'retail' | 'medium' | 'bulk';
  shelfLifeRange: 'all' | 'fresh' | 'medium' | 'long';
  proteinMin: 'all' | '8' | '15' | '24';
  lactoseFreeOnly: boolean;
  highProteinOnly: boolean;
  exportReadyOnly: boolean;
  characteristics: Record<string, string>;
  sortBy: 'featured' | 'fat-asc' | 'fat-desc' | 'protein-desc' | 'name';
}

interface FiltersProps {
  categories: Category[];
  products: Product[];
  state: CatalogFilterState;
  onChange: (next: CatalogFilterState) => void;
  onReset: () => void;
  totalCount: number;
}

export const Filters: React.FC<FiltersProps> = ({
  categories,
  products,
  state,
  onChange,
  onReset,
  totalCount,
}) => {
  const { language, localize } = useLanguage();
  const [mobileOpen, setMobileOpen] = useState(false);
  const activeCategory = categories.find((c) => c.id === state.categoryId);

  const labels = {
    ru: {
      filtersToggle: 'Фильтры и сортировка',
      category: 'Категория',
      allCategories: 'Все категории',
      subcategory: 'Подкатегория',
      allSubs: 'Все виды',
      fat: 'Жирность',
      fatAll: 'Любая',
      fatLow: 'До 5% (лёгкие)',
      fatMed: '6% – 35%',
      fatHigh: '45%+ (сыры и масло)',
      weight: 'Фасовка / вес',
      weightAll: 'Любая фасовка',
      weightRetail: 'До 250 г (розница)',
      weightMedium: '251 г – 1 кг',
      weightBulk: 'Более 1 кг (HoReCa / B2B)',
      shelfLife: 'Срок годности',
      shelfAll: 'Любой срок',
      shelfFresh: 'До 21 суток (фреш)',
      shelfMed: '22 – 90 суток',
      shelfLong: 'Более 90 суток (UHT / экспорт)',
      protein: 'Уровень белка',
      proteinAll: 'Любой',
      protein8: 'От 8 г / 100 г',
      protein15: 'От 15 г / 100 г',
      protein24: 'От 24 г / 100 г',
      lactoseFree: 'Без лактозы',
      highProtein: 'Высокий белок (≥8 г)',
      exportReady: 'Экспорт / B2B',
      sort: 'Сортировка',
      sortFeatured: 'Популярные',
      sortFatAsc: 'Жирность: по возрастанию',
      sortFatDesc: 'Жирность: по убыванию',
      sortProtein: 'Больше белка',
      sortName: 'По алфавиту',
      anyOption: 'Любое значение',
      found: 'Позиций:',
      reset: 'Сбросить',
    },
    be: {
      filtersToggle: 'Фільтры і сартаванне',
      category: 'Катэгорыя',
      allCategories: 'Усе катэгорыі',
      subcategory: 'Падкатэгорыя',
      allSubs: 'Усе віды',
      fat: 'Тлустасць',
      fatAll: 'Любая',
      fatLow: 'Да 5% (лёгкія)',
      fatMed: '6% – 35%',
      fatHigh: '45%+ (сыры і масла)',
      weight: 'Фасоўка / вага',
      weightAll: 'Любая фасоўка',
      weightRetail: 'Да 250 г (розніца)',
      weightMedium: '251 г – 1 кг',
      weightBulk: 'Больш за 1 кг (HoReCa / B2B)',
      shelfLife: 'Тэрмін прыдатнасці',
      shelfAll: 'Любы тэрмін',
      shelfFresh: 'Да 21 сутак (фрэш)',
      shelfMed: '22 – 90 сутак',
      shelfLong: 'Больш за 90 сутак (UHT / экспарт)',
      protein: 'Узровень бялку',
      proteinAll: 'Любы',
      protein8: 'Ад 8 г / 100 г',
      protein15: 'Ад 15 г / 100 г',
      protein24: 'Ад 24 г / 100 г',
      lactoseFree: 'Без лактозы',
      highProtein: 'Высокі бялок (≥8 г)',
      exportReady: 'Экспарт / B2B',
      sort: 'Сартаванне',
      sortFeatured: 'Папулярныя',
      sortFatAsc: 'Тлустасць ↑',
      sortFatDesc: 'Тлустасць ↓',
      sortProtein: 'Больш бялку',
      sortName: 'Па алфавіце',
      anyOption: 'Любое значэнне',
      found: 'Пазіцый:',
      reset: 'Скінуць',
    },
    en: {
      filtersToggle: 'Filters & Sorting',
      category: 'Category',
      allCategories: 'All categories',
      subcategory: 'Subcategory',
      allSubs: 'All types',
      fat: 'Fat content',
      fatAll: 'Any',
      fatLow: 'Up to 5%',
      fatMed: '6% – 35%',
      fatHigh: '45%+ (cheese & butter)',
      weight: 'Pack weight',
      weightAll: 'Any format',
      weightRetail: 'Up to 250g (retail)',
      weightMedium: '251g – 1kg',
      weightBulk: 'Over 1kg (HoReCa / B2B)',
      shelfLife: 'Shelf life',
      shelfAll: 'Any shelf life',
      shelfFresh: 'Up to 21 days (fresh)',
      shelfMed: '22 – 90 days',
      shelfLong: '90+ days (UHT / export)',
      protein: 'Protein level',
      proteinAll: 'Any',
      protein8: '≥ 8g / 100g',
      protein15: '≥ 15g / 100g',
      protein24: '≥ 24g / 100g',
      lactoseFree: 'Lactose-free',
      highProtein: 'High protein (≥8g)',
      exportReady: 'Export / B2B ready',
      sort: 'Sort by',
      sortFeatured: 'Featured',
      sortFatAsc: 'Fat: Low to High',
      sortFatDesc: 'Fat: High to Low',
      sortProtein: 'Highest protein',
      sortName: 'Alphabetical',
      anyOption: 'Any',
      found: 'Items:',
      reset: 'Reset',
    },
    zh: {
      filtersToggle: '筛选与排序',
      category: '产品分类',
      allCategories: '全部分类',
      subcategory: '细分系列',
      allSubs: '全部子项',
      fat: '乳脂含量',
      fatAll: '不限',
      fatLow: '≤ 5% 低脂',
      fatMed: '6% – 35%',
      fatHigh: '≥ 45% 奶酪黄油',
      weight: '包装规格',
      weightAll: '不限规格',
      weightRetail: '≤ 250克（零售小包装）',
      weightMedium: '251克 – 1公斤',
      weightBulk: '> 1公斤（餐饮 / B2B大包装）',
      shelfLife: '保质期',
      shelfAll: '不限',
      shelfFresh: '≤ 21天（短保鲜品）',
      shelfMed: '22 – 90天',
      shelfLong: '> 90天（常温 / 出口长保）',
      protein: '蛋白质门槛',
      proteinAll: '不限',
      protein8: '≥ 8克 / 100克',
      protein15: '≥ 15克 / 100克',
      protein24: '≥ 24克 / 100克',
      lactoseFree: '无乳糖',
      highProtein: '高蛋白 (≥8克)',
      exportReady: '支持出口 / B2B',
      sort: '排序',
      sortFeatured: '默认推荐',
      sortFatAsc: '脂肪含量 ↑',
      sortFatDesc: '脂肪含量 ↓',
      sortProtein: '蛋白质从高到低',
      sortName: '按名称',
      anyOption: '不限',
      found: '产品数:',
      reset: '重置',
    },
  }[language];

  const dynamicCharacteristicFilters = useMemo(() => {
    if (!activeCategory) return [];
    const catProducts = products.filter(
      (p) => p.visible && p.category === activeCategory.id
    );
    return activeCategory.characteristicSchema
    .map((field) => {
      const optionSet = new Set<string>();
      for (const p of catProducts) {
        const val = localize(p.characteristics[field.key]);
        if (val) optionSet.add(val);
      }
      return {
        key: field.key,
        label: localize(field.label),
         options: Array.from(optionSet),
      };
    })
    .filter((f) => f.options.length > 0 && f.options.length <= 20);
  }, [activeCategory, products, localize]);

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
        characteristics: {},
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

    <div>
    <label className="block text-xs font-medium text-slate-600 mb-1.5">
    {labels.weight}
    </label>
    <select
    value={state.weightRange}
    onChange={(e) =>
      onChange({
        ...state,
        weightRange: e.target.value as CatalogFilterState['weightRange'],
      })
    }
    className="w-full h-10 px-3 text-sm bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-[#0057B8]"
    >
    <option value="all">{labels.weightAll}</option>
    <option value="retail">{labels.weightRetail}</option>
    <option value="medium">{labels.weightMedium}</option>
    <option value="bulk">{labels.weightBulk}</option>
    </select>
    </div>

    <div>
    <label className="block text-xs font-medium text-slate-600 mb-1.5">
    {labels.shelfLife}
    </label>
    <select
    value={state.shelfLifeRange}
    onChange={(e) =>
      onChange({
        ...state,
        shelfLifeRange: e.target.value as CatalogFilterState['shelfLifeRange'],
      })
    }
    className="w-full h-10 px-3 text-sm bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-[#0057B8]"
    >
    <option value="all">{labels.shelfAll}</option>
    <option value="fresh">{labels.shelfFresh}</option>
    <option value="medium">{labels.shelfMed}</option>
    <option value="long">{labels.shelfLong}</option>
    </select>
    </div>

    <div>
    <label className="block text-xs font-medium text-slate-600 mb-1.5">
    {labels.protein}
    </label>
    <select
    value={state.proteinMin}
    onChange={(e) =>
      onChange({
        ...state,
        proteinMin: e.target.value as CatalogFilterState['proteinMin'],
      })
    }
    className="w-full h-10 px-3 text-sm bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-[#0057B8]"
    >
    <option value="all">{labels.proteinAll}</option>
    <option value="8">{labels.protein8}</option>
    <option value="15">{labels.protein15}</option>
    <option value="24">{labels.protein24}</option>
    </select>
    </div>
    </div>

    {/* Dynamic category-specific characteristic filters */}
    {dynamicCharacteristicFilters.length > 0 && (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2 border-t border-slate-200/70">
      {dynamicCharacteristicFilters.map((charField) => (
        <div key={charField.key}>
        <label className="block text-xs font-medium text-slate-600 mb-1.5">
        {charField.label}
        </label>
        <select
        value={state.characteristics[charField.key] || 'all'}
        onChange={(e) =>
          onChange({
            ...state,
            characteristics: {
              ...state.characteristics,
              [charField.key]: e.target.value,
            },
          })
        }
        className="w-full h-10 px-3 text-sm bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-[#0057B8]"
        >
        <option value="all">{labels.anyOption}</option>
        {charField.options.map((opt) => (
          <option key={opt} value={opt}>
          {opt}
          </option>
        ))}
        </select>
        </div>
      ))}
      </div>
    )}

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
