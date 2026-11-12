import React, { useMemo, useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useLanguage } from '../hooks/useLanguage';
import { useCatalogStore } from '../hooks/useCatalogStore';
import { SeoHead } from '../components/SeoHead';
import { SearchBar } from '../components/SearchBar';
import { Filters, CatalogFilterState } from '../components/Filters';
import { ProductGrid } from '../components/ProductGrid';
import { SmartFinder } from '../components/SmartFinder';

interface CatalogProps {
  initialCategorySlug?: string;
}

const DEFAULT_FILTERS: CatalogFilterState = {
  categoryId: 'all',
  subcategoryId: 'all',
  fatRange: 'all',
  lactoseFreeOnly: false,
  highProteinOnly: false,
  exportReadyOnly: false,
  sortBy: 'featured',
};

export const Catalog: React.FC<CatalogProps> = ({ initialCategorySlug }) => {
  const { language, localize, t } = useLanguage();
  const { products, categories } = useCatalogStore();
  const [searchParams, setSearchParams] = useSearchParams();

  const [query, setQuery] = useState(() => searchParams.get('q') || '');
  const [filterState, setFilterState] = useState<CatalogFilterState>(() => ({
    ...DEFAULT_FILTERS,
    categoryId: initialCategorySlug || 'all',
  }));

  useEffect(() => {
    setQuery(searchParams.get('q') || '');
  }, [searchParams]);

  useEffect(() => {
    setFilterState((prev) => ({
      ...prev,
      categoryId: initialCategorySlug || 'all',
      subcategoryId: 'all',
    }));
  }, [initialCategorySlug]);

  const activeCategory = categories.find((c) => c.id === filterState.categoryId);

  const filteredProducts = useMemo(() => {
    const q = query.trim().toLowerCase();

    const list = products
    .filter((p) => p.visible)
    .filter((p) => {
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
      if (filterState.lactoseFreeOnly && !p.lactoseFree) return false;
      if (filterState.highProteinOnly && (p.proteinContent ?? 0) < 8) return false;
      if (filterState.exportReadyOnly && !p.exportReady) return false;

      if (q) {
        const cat = categories.find((c) => c.id === p.category);
        const haystack = [
          p.name.ru,
          p.name.be,
          p.name.en,
          p.name.zh,
          p.description.ru,
          p.description.be,
          p.description.en,
          p.description.zh,
          cat?.name.ru || '',
          cat?.name.be || '',
          cat?.name.en || '',
          cat?.name.zh || '',
          p.packages.map((pkg) => pkg.weight).join(' '),
            p.useCases.join(' '),
        ]
        .join(' ')
        .toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });

    const sorted = [...list];
    sorted.sort((a, b) => {
      if (filterState.sortBy === 'fat-asc') return (a.fatContent ?? 0) - (b.fatContent ?? 0);
      if (filterState.sortBy === 'fat-desc') return (b.fatContent ?? 0) - (a.fatContent ?? 0);
      if (filterState.sortBy === 'protein-desc')
        return (b.proteinContent ?? 0) - (a.proteinContent ?? 0);
      if (filterState.sortBy === 'name')
        return localize(a.name).localeCompare(localize(b.name), language);
      return Number(Boolean(b.featured)) - Number(Boolean(a.featured));
    });

    return sorted;
  }, [products, categories, filterState, query, localize, language]);

  const handleReset = () => {
    setQuery('');
    if (searchParams.has('q')) {
      setSearchParams({}, { replace: true });
    }
    setFilterState({
      ...DEFAULT_FILTERS,
      categoryId: initialCategorySlug || 'all',
    });
  };

  const pageH1 = activeCategory ? localize(activeCategory.name) : t('navCatalog');

  const pageDesc = activeCategory
  ? localize(activeCategory.description)
  : language === 'ru'
  ? 'Полный ассортимент молочной продукции ОАО «Молочный Мир»: фильтрация по категориям, жирности, белку, отсутствию лактозы и формату упаковки.'
  : language === 'be'
  ? 'Поўны асартымент малочнай прадукцыі ААТ «Малочны Мір».'
  : language === 'zh'
  ? 'Molochny Mir 乳制品完整目录：按品类、乳脂含量、蛋白质、无乳糖及包装规格筛选。'
  : 'Complete dairy catalog with dynamic filtering by category, fat content, protein, lactose-free status, and packaging format.';

  const seoTitle = activeCategory
  ? localize(activeCategory.seo.title)
  : `${t('navCatalog')} — ${t('brandName')} (milk.by)`;

  const seoDesc = activeCategory ? localize(activeCategory.seo.description) : pageDesc;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
    <SeoHead
    title={seoTitle}
    description={seoDesc}
    canonicalHash={activeCategory ? `/catalog/${activeCategory.slug}` : '/catalog'}
    />

    {/* Breadcrumbs & Page Heading */}
    <div className="space-y-3">
    <nav className="text-xs text-slate-500 flex items-center gap-2" aria-label="Breadcrumb">
    <Link to="/" className="hover:text-[#0057B8]">
    {language === 'ru' ? 'Главная' : language === 'be' ? 'Галоўная' : language === 'zh' ? '首页' : 'Home'}
    </Link>
    <span aria-hidden="true">/</span>
    {activeCategory ? (
      <>
      <Link to="/catalog" className="hover:text-[#0057B8]">
      {t('navCatalog')}
      </Link>
      <span aria-hidden="true">/</span>
      <span className="text-slate-900 font-medium">{localize(activeCategory.name)}</span>
      </>
    ) : (
      <span className="text-slate-900 font-medium">{t('navCatalog')}</span>
    )}
    </nav>

    <h1 className="font-display text-3xl sm:text-4xl font-bold text-slate-900">
    {pageH1}
    </h1>
    <p className="text-sm sm:text-base text-slate-600 max-w-3xl">
    {pageDesc}
    </p>
    </div>

    {/* Category quick tabs */}
    <div className="flex flex-wrap gap-2">
    <Link
    to="/catalog"
    className={`px-3.5 py-2 text-xs font-medium rounded-lg border transition-colors ${
      !activeCategory
      ? 'bg-[#0057B8] text-white border-[#0057B8]'
      : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
    }`}
    >
    {language === 'ru' ? 'Все' : language === 'be' ? 'Усе' : language === 'zh' ? '全部' : 'All'}
    </Link>
    {categories.map((cat) => {
      const active = activeCategory?.id === cat.id;
      return (
        <Link
        key={cat.id}
        to={`/catalog/${cat.slug}`}
        className={`px-3.5 py-2 text-xs font-medium rounded-lg border transition-colors ${
          active
          ? 'bg-[#0057B8] text-white border-[#0057B8]'
          : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
        }`}
        >
        {localize(cat.name)}
        </Link>
      );
    })}
    </div>

    <SearchBar value={query} onChange={setQuery} />

    <Filters
    categories={categories}
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
