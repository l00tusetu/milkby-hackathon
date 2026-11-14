import React, { useMemo, useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { useLanguage, useLocalizedPath } from '../hooks/useLanguage';
import { useCatalogStore } from '../hooks/useCatalogStore';
import { SeoHead } from '../components/SeoHead';
import { SearchBar } from '../components/SearchBar';
import { Filters, CatalogFilterState } from '../components/Filters';
import { ProductGrid } from '../components/ProductGrid';
import { SmartFinder } from '../components/SmartFinder';
import { runSmartSearch } from '../utils/smartMatch';

interface CatalogProps {
  initialCategorySlug?: string;
}

const DEFAULT_FILTERS: CatalogFilterState = {
  categoryId: 'all',
  subcategoryId: 'all',
  fatRange: 'all',
  weightRange: 'all',
  shelfLifeRange: 'all',
  proteinMin: 'all',
  lactoseFreeOnly: false,
  highProteinOnly: false,
  exportReadyOnly: false,
  characteristics: {},
  sortBy: 'featured',
};

function parseShelfLifeDays(text: string): number {
  const nums = text.match(/\d+/g);
  if (!nums || nums.length === 0) return 0;
  const val = parseInt(nums[0], 10);
  if (!Number.isFinite(val)) return 0;
  if (/месяц|month|月/i.test(text)) return val * 30;
  return val;
}

export const Catalog: React.FC<CatalogProps> = ({ initialCategorySlug }) => {
  const { language, localize, t } = useLanguage();
  const lp = useLocalizedPath();
  const { products, categories } = useCatalogStore();
  const [searchParams, setSearchParams] = useSearchParams();

  const resolvedCategoryId = useMemo(() => {
    if (!initialCategorySlug) return 'all';
    const found = categories.find(
      (c) => c.slug === initialCategorySlug || c.id === initialCategorySlug
    );
    return found ? found.id : initialCategorySlug;
  }, [categories, initialCategorySlug]);

  const [query, setQuery] = useState(() => searchParams.get('q') || '');
  const [filterState, setFilterState] = useState<CatalogFilterState>(() => ({
    ...DEFAULT_FILTERS,
    categoryId: resolvedCategoryId,
  }));

  useEffect(() => {
    setQuery(searchParams.get('q') || '');
  }, [searchParams]);

  useEffect(() => {
    setFilterState((prev) => ({
      ...prev,
      categoryId: resolvedCategoryId,
      subcategoryId: 'all',
      characteristics: {},
    }));
  }, [resolvedCategoryId]);

  const activeCategory = categories.find((c) => c.id === filterState.categoryId);

  const smartSearch = useMemo(() => {
    const trimmed = query.trim();
    if (!trimmed) return null;
    return runSmartSearch(trimmed, products, categories, language);
  }, [query, products, categories, language]);

  const filteredProducts = useMemo(() => {
    const scoreMap = smartSearch
      ? new Map(smartSearch.results.map((r) => [r.product.id, r.score]))
      : null;

    const list = products
      .filter((p) => p.visible)
      .filter((p) => {
        if (scoreMap && !scoreMap.has(p.id)) return false;

        if (filterState.categoryId !== 'all' && p.category !== filterState.categoryId) {
          return false;
        }
        if (filterState.subcategoryId !== 'all' && p.subcategory !== filterState.subcategoryId) {
          return false;
        }
        if (filterState.fatRange !== 'all') {
          const fat = p.fatContent ?? 0;
          if (filterState.fatRange === 'low' && fat > 5) return false;
          if (filterState.fatRange === 'medium' && (fat < 15 || fat > 35)) return false;
          if (filterState.fatRange === 'high' && fat < 45) return false;
        }
        if (filterState.weightRange !== 'all') {
          const matchesWeight = p.packages.some((pkg) => {
            if (filterState.weightRange === 'retail') return pkg.weightGrams <= 250;
            if (filterState.weightRange === 'medium')
              return pkg.weightGrams > 250 && pkg.weightGrams <= 1000;
            return pkg.weightGrams > 1000;
          });
          if (!matchesWeight) return false;
        }
        if (filterState.shelfLifeRange !== 'all') {
          const matchesShelf = p.packages.some((pkg) => {
            const days = parseShelfLifeDays(pkg.shelfLife.ru || pkg.shelfLife.en || '');
            if (filterState.shelfLifeRange === 'fresh') return days > 0 && days <= 21;
            if (filterState.shelfLifeRange === 'medium') return days > 21 && days <= 90;
            return days > 90;
          });
          if (!matchesShelf) return false;
        }
        if (filterState.proteinMin !== 'all') {
          const min = Number(filterState.proteinMin);
          if ((p.proteinContent ?? 0) < min) return false;
        }
        if (filterState.lactoseFreeOnly && !p.lactoseFree) return false;
        if (filterState.highProteinOnly && (p.proteinContent ?? 0) < 8) return false;
        if (filterState.exportReadyOnly && !p.exportReady) return false;

        for (const [charKey, selectedVal] of Object.entries(filterState.characteristics)) {
          if (!selectedVal || selectedVal === 'all') continue;
          const prodVal = localize(p.characteristics[charKey]);
          if (prodVal !== selectedVal) return false;
        }

        return true;
      });

    const sorted = [...list];
    sorted.sort((a, b) => {
      if (scoreMap && filterState.sortBy === 'featured') {
        return (scoreMap.get(b.id) ?? 0) - (scoreMap.get(a.id) ?? 0);
      }
      if (filterState.sortBy === 'fat-asc') return (a.fatContent ?? 0) - (b.fatContent ?? 0);
      if (filterState.sortBy === 'fat-desc') return (b.fatContent ?? 0) - (a.fatContent ?? 0);
      if (filterState.sortBy === 'protein-desc')
        return (b.proteinContent ?? 0) - (a.proteinContent ?? 0);
      if (filterState.sortBy === 'name')
        return localize(a.name).localeCompare(localize(b.name), language);
      return Number(Boolean(b.featured)) - Number(Boolean(a.featured));
    });

    return sorted;
  }, [products, smartSearch, filterState, localize, language]);

  const handleReset = () => {
    setQuery('');
    if (searchParams.has('q')) {
      setSearchParams({}, { replace: true });
    }
    setFilterState({
      ...DEFAULT_FILTERS,
      categoryId: resolvedCategoryId,
    });
  };

  const pageH1 = activeCategory ? localize(activeCategory.name) : t('navCatalog');

  const pageDesc = activeCategory
    ? localize(activeCategory.description)
    : {
        ru: 'Полный ассортимент молочной продукции ОАО «Молочный Мир»: фильтрация по категориям, жирности, фасовке, сроку годности, белку и характеристикам.',
        be: 'Поўны асартымент малочнай прадукцыі ААТ «Малочны Мір»: фільтрацыя па катэгорыях, тлустасці, фасоўцы, тэрміну прыдатнасці і бялку.',
        en: 'Complete dairy catalog with dynamic filtering by category, fat content, pack weight, shelf life, protein, and technical attributes.',
        zh: 'Molochny Mir 乳制品完整目录：按品类、乳脂含量、包装规格、保质期、蛋白质与技术参数精准筛选。',
      }[language];

  const seoTitle = activeCategory
    ? localize(activeCategory.seo.title)
    : `${t('navCatalog')} — ${t('brandName')} (milk.by)`;

  const seoDesc = activeCategory ? localize(activeCategory.seo.description) : pageDesc;

  const smartBannerLabel = {
    ru: 'Умный поиск распознал:',
    be: 'Разумны пошук распазнаў:',
    en: 'Smart search matched:',
    zh: '智能搜索已识别:',
  }[language];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
      <SeoHead
        title={seoTitle}
        description={seoDesc}
        canonicalPath={activeCategory ? `/catalog/${activeCategory.slug}` : '/catalog'}
      />

      <div className="space-y-3">
        <nav className="text-xs text-slate-500 flex items-center gap-2" aria-label="Breadcrumb">
          <Link to={lp('/')} className="hover:text-[#0057B8]">
            {language === 'ru'
              ? 'Главная'
              : language === 'be'
              ? 'Галоўная'
              : language === 'zh'
              ? '首页'
              : 'Home'}
          </Link>
          <span aria-hidden="true">/</span>
          {activeCategory ? (
            <>
              <Link to={lp('/catalog')} className="hover:text-[#0057B8]">
                {t('navCatalog')}
              </Link>
              <span aria-hidden="true">/</span>
              <span className="text-slate-900 font-medium">{localize(activeCategory.name)}</span>
            </>
          ) : (
            <span className="text-slate-900 font-medium">{t('navCatalog')}</span>
          )}
        </nav>

        <h1 className="font-display text-3xl sm:text-4xl font-bold text-slate-900">{pageH1}</h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-3xl">{pageDesc}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        <Link
          to={lp('/catalog')}
          className={`px-3.5 py-2 text-xs font-medium rounded-lg border transition-all duration-200 ${
            !activeCategory
              ? 'bg-[#0057B8] text-white border-[#0057B8]'
              : 'bg-white text-slate-700 border-slate-200 hover:border-[#0057B8]/50 hover:text-[#0057B8]'
          }`}
        >
          {language === 'ru'
            ? 'Все'
            : language === 'be'
            ? 'Усе'
            : language === 'zh'
            ? '全部'
            : 'All'}
        </Link>
        {categories.map((cat) => {
          const active = activeCategory?.id === cat.id;
          return (
            <Link
              key={cat.id}
              to={lp(`/catalog/${cat.slug}`)}
              className={`px-3.5 py-2 text-xs font-medium rounded-lg border transition-all duration-200 ${
                active
                  ? 'bg-[#0057B8] text-white border-[#0057B8]'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-[#0057B8]/50 hover:text-[#0057B8]'
              }`}
            >
              {localize(cat.name)}
            </Link>
          );
        })}
      </div>

      <SearchBar
        value={query}
        onChange={setQuery}
        onSubmitSearch={(val) => {
          setQuery(val);
          if (val) {
            setSearchParams({ q: val }, { replace: true });
          } else {
            setSearchParams({}, { replace: true });
          }
        }}
      />

      {smartSearch && smartSearch.criteria.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 text-xs bg-blue-50/70 border border-blue-200/70 rounded-xl px-4 py-2.5">
          <span className="inline-flex items-center gap-1.5 font-semibold text-[#0057B8]">
            <Sparkles className="w-3.5 h-3.5 shrink-0" />
            {smartBannerLabel}
          </span>
          {smartSearch.criteria.map((c) => (
            <span
              key={c.id}
              className="px-2.5 py-0.5 rounded-md bg-white border border-blue-200 text-slate-800 font-medium"
            >
              {c.label}
            </span>
          ))}
        </div>
      )}

      <Filters
        categories={categories}
        products={products}
        state={filterState}
        onChange={setFilterState}
        onReset={handleReset}
        totalCount={filteredProducts.length}
      />

      <ProductGrid products={filteredProducts} onResetFilters={handleReset} />

      <div className="pt-4">
        <SmartFinder />
      </div>
    </div>
  );
};
