import React, { useState, useMemo } from 'react';
import { Plus, Eye, EyeOff, Trash2, RotateCcw, Edit3, Check, Upload, Download } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { useCatalogStore } from '../hooks/useCatalogStore';
import { ASSETS } from '../data/assets';
import { apiClient } from '../utils/apiClient';
import { Category, Language, NewsArticle, PackageVariant, Product, RedirectRule } from '../types';
import { SeoHead } from '../components/SeoHead';

const LANGS: Language[] = ['ru', 'be', 'en', 'zh'];

const parseWeightGrams = (label: string): number => {
  const num = parseFloat(label.replace(',', '.'));
  if (!Number.isFinite(num) || num <= 0) return 250;
  if (/кг|kg|л|l/i.test(label) && !/мг|мл|ml/i.test(label)) {
    return Math.round(num * 1000);
  }
  return Math.round(num);
};

const emptyLocalized = (ruValue = '') => ({ ru: ruValue, be: '', en: '', zh: '' });

export const Admin: React.FC = () => {
  const { language, localize, t, translations, updateTranslation, resetTranslations } = useLanguage();
  const {
    products,
    categories,
    news,
    redirects,
    addProduct,
    updateProduct,
    importProducts,
    toggleProductVisibility,
    deleteProduct,
    addCategory,
    updateCategory,
    deleteCategory,
    addNews,
    updateNews,
    toggleNewsPublished,
    deleteNews,
    addRedirect,
    deleteRedirect,
    inquiries,
    apiConnected,
    refreshFromServer,
    refreshInquiries,
    resetDemoData,
  } = useCatalogStore();

  const [activeTab, setActiveTab] = useState<
  'products' | 'categories' | 'news' | 'redirects' | 'translations' | 'inquiries'
  >('products');
  const [editLang, setEditLang] = useState<Language>(language);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingNews, setEditingNews] = useState<NewsArticle | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showAddNews, setShowAddNews] = useState(false);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [showAllTranslations, setShowAllTranslations] = useState(false);
  const [importStatus, setImportStatus] = useState<string>('');

  // Add Product Form State (does not silently copy RU into BE/EN/ZH)
  const [newNameRu, setNewNameRu] = useState('');
  const [newNameBe, setNewNameBe] = useState('');
  const [newNameEn, setNewNameEn] = useState('');
  const [newNameZh, setNewNameZh] = useState('');
  const [newCategory, setNewCategory] = useState('cheese');
  const [newFat, setNewFat] = useState('45');
  const [newProtein, setNewProtein] = useState('20');
  const [newImage, setNewImage] = useState<string>(ASSETS.productAgedCheese);
  const [newDescRu, setNewDescRu] = useState('');
  const [newWeight, setNewWeight] = useState('250 г');
  const [newShelfLife, setNewShelfLife] = useState('30 суток');
  const [newSeoTitle, setNewSeoTitle] = useState('');

  // Add Package inside Editing Product
  const [pkgWeight, setPkgWeight] = useState('500 г');
  const [pkgShelf, setPkgShelf] = useState('45 суток');
  const [pkgStorage, setPkgStorage] = useState('+2…+6 °C');
  const [pkgType, setPkgType] = useState('Вакуумная упаковка');
  const [pkgBox, setPkgBox] = useState('12');
  const [pkgGtin, setPkgGtin] = useState('4810268099999');

  // Add Category Form State
  const [catSlug, setCatSlug] = useState('');
  const [catNameRu, setCatNameRu] = useState('');
  const [catNameEn, setCatNameEn] = useState('');
  const [catDescRu, setCatDescRu] = useState('');
  const [catSchemaInput, setCatSchemaInput] = useState('composition:Состав, origin:Происхождение');

  // Add News Form State
  const [newsTitleRu, setNewsTitleRu] = useState('');
  const [newsTitleEn, setNewsTitleEn] = useState('');
  const [newsExcerptRu, setNewsExcerptRu] = useState('');
  const [newsCat, setNewsCat] = useState<NewsArticle['categoryId']>('company');

  // Add Redirect Form State
  const [redirFrom, setRedirFrom] = useState('');
  const [redirTo, setRedirTo] = useState('/ru/catalog');
  const [redirNote, setRedirNote] = useState('');

  const copy = {
    ru: {
      subtitle: 'Управление каталогом, фасовками, категориями, 301-редиректами, SEO-тегами, новостями и 4 языковыми версиями.',
      reset: 'Сбросить демо-данные',
      tabProducts: `Продукция (${products.length})`,
      tabCategories: `Категории (${categories.length})`,
      tabNews: `Новости (${news.length})`,
      tabRedirects: `301-редиректы (${redirects.length})`,
      tabTranslations: 'Языки и переводы',
      catalogItems: 'Позиции каталога',
      addProduct: 'Добавить товар',
      importBtn: 'Импорт CSV / JSON',
      exportJson: 'Экспорт JSON',
      published: 'Опубликован',
      hidden: 'Скрыт',
      newsPub: 'Опубликована',
      newsHidden: 'Снята',
      fieldsFilled: 'полей переведено',
      showFewer: 'Свернуть список',
      showAll: `Показать все ключи (${Object.keys(translations).length})`,
      colProduct: 'Товар',
      colCategory: 'Категория',
      colPacks: 'Фасовки',
      colStatus: 'Статус',
      colActions: 'Действия',
      saveBtn: 'Применить изменения',
      cancelBtn: 'Отмена',
    },
    be: {
      subtitle: 'Кіраванне каталогам, фасоўкамі, катэгорыямі, 301-рэдырэктамі, SEO-тэгамі, навінамі і 4 моўнымі версіямі.',
      reset: 'Скінуць дэма-даныя',
      tabProducts: `Прадукцыя (${products.length})`,
      tabCategories: `Катэгорыі (${categories.length})`,
      tabNews: `Навіны (${news.length})`,
      tabRedirects: `301-рэдырэкты (${redirects.length})`,
      tabTranslations: 'Мовы і пераклады',
      catalogItems: 'Пазіцыі каталога',
      addProduct: 'Дадаць тавар',
      importBtn: 'Імпарт CSV / JSON',
      exportJson: 'Экспарт JSON',
      published: 'Апублікаваны',
      hidden: 'Схаваны',
      newsPub: 'Апублікавана',
      newsHidden: 'Знята',
      fieldsFilled: 'палёў перакладзена',
      showFewer: 'Згарнуць спіс',
      showAll: `Паказаць усе ключы (${Object.keys(translations).length})`,
      colProduct: 'Тавар',
      colCategory: 'Катэгорыя',
      colPacks: 'Фасоўкі',
      colStatus: 'Статус',
      colActions: 'Дзеянні',
      saveBtn: 'Прымяніць змены',
      cancelBtn: 'Адмена',
    },
    en: {
      subtitle: 'No-code management for products, packaging variants, category schemas, 301 redirects, SEO, news, and 4-language translations.',
      reset: 'Reset Demo Data',
      tabProducts: `Products (${products.length})`,
      tabCategories: `Categories (${categories.length})`,
      tabNews: `News (${news.length})`,
      tabRedirects: `301 Redirects (${redirects.length})`,
      tabTranslations: 'Languages & Translations',
      catalogItems: 'Catalog Items',
      addProduct: 'Add Product',
      importBtn: 'Import CSV / JSON',
      exportJson: 'Export JSON',
      published: 'Visible',
      hidden: 'Hidden',
      newsPub: 'Published',
      newsHidden: 'Draft',
      fieldsFilled: 'fields translated',
      showFewer: 'Show fewer keys',
      showAll: `Show all keys (${Object.keys(translations).length})`,
      colProduct: 'Product',
      colCategory: 'Category',
      colPacks: 'Packages',
      colStatus: 'Status',
      colActions: 'Actions',
      saveBtn: 'Apply Changes',
      cancelBtn: 'Cancel',
    },
    zh: {
      subtitle: '免代码管理产品目录、包装规格、分类属性模板、301重定向、SEO标签、新闻资讯及四语翻译。',
      reset: '重置演示数据',
      tabProducts: `产品目录 (${products.length})`,
      tabCategories: `产品分类 (${categories.length})`,
      tabNews: `新闻动态 (${news.length})`,
      tabRedirects: `301 重定向 (${redirects.length})`,
      tabTranslations: '语言与翻译审计',
      catalogItems: '目录产品列表',
      addProduct: '新增产品',
      importBtn: '导入 CSV / JSON',
      exportJson: '导出 JSON',
      published: '已发布',
      hidden: '已隐藏',
      newsPub: '已发布',
      newsHidden: '已下线',
      fieldsFilled: '项字段已翻译',
      showFewer: '收起列表',
      showAll: `显示全部键 (${Object.keys(translations).length})`,
      colProduct: '产品',
      colCategory: '分类',
      colPacks: '包装规格',
      colStatus: '状态',
      colActions: '操作',
      saveBtn: '保存更改',
      cancelBtn: '取消',
    },
  }[language];

  // True translation completeness audit (does not count untranslated empty fields)
  const completenessStats = useMemo(() => {
    return LANGS.map((lang) => {
      let total = 0;
      let filled = 0;
      for (const p of products) {
        total += 5;
        if (p.name[lang]?.trim()) filled++;
        if (p.description[lang]?.trim()) filled++;
        if (p.seo.title[lang]?.trim()) filled++;
        if (p.seo.description[lang]?.trim()) filled++;
        if (p.seo.h1[lang]?.trim()) filled++;
      }
      for (const c of categories) {
        total += 2;
        if (c.name[lang]?.trim()) filled++;
        if (c.description[lang]?.trim()) filled++;
      }
      for (const n of news) {
        total += 5;
        if (n.title[lang]?.trim()) filled++;
        if (n.excerpt[lang]?.trim()) filled++;
        if (n.content[lang]?.trim()) filled++;
        if (n.seo.title[lang]?.trim()) filled++;
        if (n.seo.description[lang]?.trim()) filled++;
      }
      for (const key of Object.keys(translations)) {
        total += 1;
        if (translations[key]?.[lang]?.trim()) filled++;
      }
      const pct = total > 0 ? Math.round((filled / total) * 100) : 100;
      return { lang, filled, total, pct };
    });
  }, [products, categories, news, translations]);

  const handleImageUpload = async (file: File | undefined, onLoaded: (dataUrl: string) => void) => {
    if (!file) return;
    if (apiConnected) {
      try {
        const res = await apiClient.uploadMedia(file);
        onLoaded(res.url);
        return;
      } catch {
        // fallback to base64 if upload fails
      }
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        onLoaded(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNameRu.trim()) return;
    const slugBase = `custom-${Date.now().toString(36)}`;
    const weightLabel = newWeight.trim() || '250 г';
    const cat = categories.find((c) => c.id === newCategory);

    const product: Product = {
      id: slugBase,
      slug: slugBase,
      category: newCategory,
      subcategory: cat?.subcategories[0]?.id || 'default',
      name: {
        ru: newNameRu.trim(),
        be: newNameBe.trim(),
        en: newNameEn.trim(),
        zh: newNameZh.trim(),
      },
      description: {
        ru: newDescRu.trim() || 'Новый продукт в каталоге ОАО «Молочный Мир».',
        be: '',
        en: '',
        zh: '',
      },
      image: newImage || ASSETS.productAgedCheese,
      fatContent: Number(newFat) || 0,
      proteinContent: Number(newProtein) || 0,
      lactoseFree: false,
      exportReady: true,
      featured: true,
      visible: true,
      packages: [
        {
          id: `${slugBase}-pkg`,
          weight: weightLabel,
          weightGrams: parseWeightGrams(weightLabel),
          shelfLife: { ru: newShelfLife, be: '', en: '', zh: '' },
          storage: { ru: '+2…+6 °C', be: '+2…+6 °C', en: '+2…+6 °C', zh: '+2…+6 °C' },
          packagingType: { ru: 'Герметичная упаковка', be: '', en: '', zh: '' },
          unitsPerBox: 12,
          gtin: '4810268099999',
        },
      ],
      characteristics: {},
      useCases: ['daily'],
      relatedIds: ['mozzarella'],
      seo: {
        title: {
          ru: newSeoTitle.trim() || `${newNameRu.trim()} — Молочный Мир`,
          be: newNameBe.trim() ? `${newNameBe.trim()} — Малочны Мір` : '',
          en: newNameEn.trim() ? `${newNameEn.trim()} — Molochny Mir` : '',
          zh: newNameZh.trim() ? `${newNameZh.trim()} — Molochny Mir` : '',
        },
        description: {
          ru: newDescRu.trim() || `${newNameRu.trim()} от ОАО «Молочный Мир».`,
          be: '',
          en: '',
          zh: '',
        },
        h1: {
          ru: newNameRu.trim(),
          be: newNameBe.trim(),
          en: newNameEn.trim(),
          zh: newNameZh.trim(),
        },
      },
    };
    addProduct(product);
    setNewNameRu('');
    setNewNameBe('');
    setNewNameEn('');
    setNewNameZh('');
    setNewDescRu('');
    setNewSeoTitle('');
    setShowAddProduct(false);
  };

  const handleSaveEditProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    updateProduct(editingProduct);
    setEditingProduct(null);
  };

  const handleAddPackageToEditing = () => {
    if (!editingProduct || !pkgWeight.trim()) return;
    const newPkg: PackageVariant = {
      id: `pkg-${Date.now().toString(36)}`,
      weight: pkgWeight.trim(),
      weightGrams: parseWeightGrams(pkgWeight),
      shelfLife: { ru: pkgShelf.trim(), be: '', en: '', zh: '' },
      storage: { ru: pkgStorage.trim(), be: pkgStorage.trim(), en: pkgStorage.trim(), zh: pkgStorage.trim() },
      packagingType: { ru: pkgType.trim(), be: '', en: '', zh: '' },
      unitsPerBox: Number(pkgBox) || 1,
      gtin: pkgGtin.trim() || '4810268000000',
    };
    setEditingProduct({
      ...editingProduct,
      packages: [...editingProduct.packages, newPkg],
    });
  };

  const handleImportCatalogFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (apiConnected) {
      try {
        const res = await apiClient.importProductsFile(file);
        await refreshFromServer();
        setImportStatus(`DB: +${res.created} / upd ${res.updated}`);
        e.target.value = '';
        return;
      } catch {
        // fallback to local parse
      }
    }
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const text = String(reader.result || '');
        if (file.name.endsWith('.json')) {
          const parsed = JSON.parse(text);
          if (Array.isArray(parsed)) {
            const valid = parsed.filter((item) => item && item.id && item.name);
            importProducts(valid);
            setImportStatus(`JSON: +${valid.length}`);
            return;
          }
        } else {
          // Simple CSV import: id;category;name_ru;name_en;fat;protein;weight;shelfLife
          const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
          const dataLines = lines.slice(lines[0]?.toLowerCase().includes('name') ? 1 : 0);
          const imported: Product[] = [];
          for (const line of dataLines) {
            const cols = line.split(/[;,]/).map((c) => c.trim());
            const [idRaw, catId, nameRu, nameEn, fatStr, protStr, weightLabel, shelf] = cols;
            if (!nameRu) continue;
            const slug = idRaw || `csv-${Date.now().toString(36)}-${imported.length}`;
            const w = weightLabel || '250 г';
            imported.push({
              id: slug,
              slug,
              category: categories.some((c) => c.id === catId) ? catId : 'other',
                          subcategory: 'default',
                          name: { ru: nameRu, be: '', en: nameEn || '', zh: '' },
                          description: emptyLocalized(nameRu),
                          image: ASSETS.productAgedCheese,
                          fatContent: Number(fatStr) || 0,
                          proteinContent: Number(protStr) || 0,
                          lactoseFree: false,
                          exportReady: true,
                          featured: false,
                          visible: true,
                          packages: [
                            {
                              id: `${slug}-pkg`,
                              weight: w,
                              weightGrams: parseWeightGrams(w),
                          shelfLife: emptyLocalized(shelf || '30 суток'),
                          storage: { ru: '+2…+6 °C', be: '+2…+6 °C', en: '+2…+6 °C', zh: '+2…+6 °C' },
                          packagingType: emptyLocalized('Стандартная упаковка'),
                          unitsPerBox: 12,
                          gtin: '4810268000001',
                            },
                          ],
                          characteristics: {},
                          useCases: ['daily'],
                          relatedIds: [],
                          seo: {
                            title: { ru: `${nameRu} — Молочный Мир`, be: '', en: nameEn || '', zh: '' },
                            description: emptyLocalized(nameRu),
                          h1: { ru: nameRu, be: '', en: nameEn || '', zh: '' },
                          },
            });
          }
          if (imported.length > 0) {
            importProducts(imported);
            setImportStatus(`CSV: +${imported.length}`);
            return;
          }
        }
        setImportStatus('Invalid format');
      } catch {
        setImportStatus('Import error');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleExportJson = () => {
    const blob = new Blob([JSON.stringify(products, null, 2)], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'milkby-catalog.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCreateNews = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsTitleRu.trim()) return;
    const today = new Date().toISOString().slice(0, 10);
    const id = `news-${Date.now().toString(36)}`;
    addNews({
      id,
      slug: id,
      date: today,
      year: new Date().getFullYear(),
            categoryId: newsCat,
            title: { ru: newsTitleRu.trim(), be: '', en: newsTitleEn.trim(), zh: '' },
            excerpt: { ru: newsExcerptRu.trim() || 'Оперативное сообщение пресс-службы ОАО «Молочный Мир».', be: '', en: '', zh: '' },
            content: { ru: newsExcerptRu.trim() || newsTitleRu.trim(), be: '', en: '', zh: '' },
            image: ASSETS.newsDairyFacility,
            published: true,
            relatedIds: [],
            seo: {
              title: { ru: `${newsTitleRu.trim()} — Новости Молочный Мир`, be: '', en: newsTitleEn.trim() ? `${newsTitleEn.trim()} — News` : '', zh: '' },
            description: { ru: newsExcerptRu.trim() || newsTitleRu.trim(), be: '', en: '', zh: '' },
            },
    });
    setNewsTitleRu('');
    setNewsTitleEn('');
    setNewsExcerptRu('');
    setShowAddNews(false);
  };

  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!catNameRu.trim()) return;
    const slug = (catSlug.trim() || `cat-${Date.now().toString(36)}`).toLowerCase().replace(/[^a-z0-9-]/g, '-');
    const schema = catSchemaInput
    .split(',')
    .map((pair) => pair.trim())
    .filter(Boolean)
    .map((pair) => {
      const [k, labelRu] = pair.split(':').map((s) => s.trim());
      return {
        key: k || `attr_${Date.now().toString(36)}`,
         label: { ru: labelRu || k, be: '', en: '', zh: '' },
      };
    });
    addCategory({
      id: slug,
      slug,
      name: { ru: catNameRu.trim(), be: '', en: catNameEn.trim(), zh: '' },
                description: { ru: catDescRu.trim(), be: '', en: '', zh: '' },
                subcategories: [{ id: 'default', name: { ru: 'Основная серия', be: '', en: 'Main line', zh: '' } }],
                filterKeys: ['fat', 'exportReady'],
                characteristicSchema: schema,
                seo: {
                  title: { ru: `${catNameRu.trim()} — Молочный Мир`, be: '', en: catNameEn.trim(), zh: '' },
                description: { ru: catDescRu.trim() || catNameRu.trim(), be: '', en: '', zh: '' },
                },
    });
    setCatSlug('');
    setCatNameRu('');
    setCatNameEn('');
    setCatDescRu('');
    setShowAddCategory(false);
  };

  const handleCreateRedirect = (e: React.FormEvent) => {
    e.preventDefault();
    if (!redirFrom.trim() || !redirTo.trim()) return;
    const rule: RedirectRule = {
      from: redirFrom.trim(),
      to: redirTo.trim(),
      code: 301,
      note: redirNote.trim() || 'CMS custom rule',
    };
    addRedirect(rule);
    setRedirFrom('');
    setRedirNote('');
  };

  const translationEntries = Object.entries(translations);
  const visibleTranslations = showAllTranslations ? translationEntries : translationEntries.slice(0, 12);
  const editingCategoryObj = editingProduct
  ? categories.find((c) => c.id === editingProduct.category)
  : undefined;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
    <SeoHead
    title={`${t('adminTitle')} — ${t('brandName')}`}
    description={copy.subtitle}
    noIndex
        canonicalPath="/admin"
    />

    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
    <div>
    <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-900">{t('adminTitle')}</h1>
            <span className={`px-2.5 py-0.5 text-[11px] font-mono rounded-full border ${apiConnected ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
              {apiConnected ? 'PostgreSQL API' : 'Offline Mode'}
            </span>
          </div>
    <p className="text-sm text-slate-600 mt-1">{copy.subtitle}</p>
    </div>

    <button
    type="button"
    onClick={() => {
      resetDemoData();
      resetTranslations();
    }}
    className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors whitespace-nowrap shrink-0 self-start sm:self-auto"
    >
    <RotateCcw className="w-3.5 h-3.5" />
    <span>{copy.reset}</span>
    </button>
    </div>

    {/* Tabs */}
    <div className="max-w-full overflow-x-auto">
    <div className="inline-flex items-center gap-1 p-1 bg-slate-100 rounded-lg border border-slate-200">
    {(
      [
        ['products', copy.tabProducts],
      ['categories', copy.tabCategories],
      ['news', copy.tabNews],
      ['redirects', copy.tabRedirects],
      ['translations', copy.tabTranslations],
      ['inquiries', `B2B (${inquiries.length})`],
      ] as const
    ).map(([tabKey, label]) => (
      <button
      key={tabKey}
      type="button"
      onClick={() => { setActiveTab(tabKey); if (tabKey === 'inquiries') refreshInquiries(); }}
      className={`px-4 py-2 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
        activeTab === tabKey ? 'bg-white text-[#0057B8] shadow-xs' : 'text-slate-600 hover:text-slate-900'
      }`}
      >
      {label}
      </button>
    ))}
    </div>
    </div>

    {/* TAB 1: PRODUCTS CMS */}
    {activeTab === 'products' && (
      <div className="space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-3">
      <h2 className="font-display text-lg font-semibold text-slate-900">{copy.catalogItems}</h2>
      <div className="flex flex-wrap items-center gap-2">
      {importStatus && (
        <span className="text-xs font-mono text-[#0057B8] bg-blue-50 px-2.5 py-1 rounded">
        {importStatus}
        </span>
      )}
      <label className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 cursor-pointer">
      <Upload className="w-3.5 h-3.5" />
      <span>{copy.importBtn}</span>
      <input type="file" accept=".json,.csv" onChange={handleImportCatalogFile} className="hidden" />
      </label>
      <button
      type="button"
      onClick={handleExportJson}
      className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200"
      >
      <Download className="w-3.5 h-3.5" />
      <span>{copy.exportJson}</span>
      </button>
      <button
      type="button"
      onClick={() => setShowAddProduct((v) => !v)}
      className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#0057B8] rounded-lg hover:bg-[#004494] transition-colors shrink-0"
      >
      <Plus className="w-4 h-4" />
      <span>{copy.addProduct}</span>
      </button>
      </div>
      </div>

      {showAddProduct && (
        <form onSubmit={handleCreateProduct} className="border border-slate-200 rounded-xl p-5 bg-slate-50 space-y-4">
        <h3 className="font-display text-base font-semibold text-slate-900">{copy.addProduct}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
        <label className="block text-xs font-medium text-slate-700 mb-1">Название (RU) *</label>
        <input type="text" required value={newNameRu} onChange={(e) => setNewNameRu(e.target.value)} className="w-full h-9 px-3 text-sm bg-white border border-slate-200 rounded-lg" />
        </div>
        <div>
        <label className="block text-xs font-medium text-slate-700 mb-1">Назва (BE)</label>
        <input type="text" value={newNameBe} onChange={(e) => setNewNameBe(e.target.value)} className="w-full h-9 px-3 text-sm bg-white border border-slate-200 rounded-lg" />
        </div>
        <div>
        <label className="block text-xs font-medium text-slate-700 mb-1">Name (EN)</label>
        <input type="text" value={newNameEn} onChange={(e) => setNewNameEn(e.target.value)} className="w-full h-9 px-3 text-sm bg-white border border-slate-200 rounded-lg" />
        </div>
        <div>
        <label className="block text-xs font-medium text-slate-700 mb-1">名称 (ZH)</label>
        <input type="text" value={newNameZh} onChange={(e) => setNewNameZh(e.target.value)} className="w-full h-9 px-3 text-sm bg-white border border-slate-200 rounded-lg" />
        </div>
        <div>
        <label className="block text-xs font-medium text-slate-700 mb-1">{copy.colCategory}</label>
        <select value={newCategory} onChange={(e) => setNewCategory(e.target.value)} className="w-full h-9 px-3 text-sm bg-white border border-slate-200 rounded-lg">
        {categories.map((c) => (
          <option key={c.id} value={c.id}>{localize(c.name)}</option>
        ))}
        </select>
        </div>
        <div>
        <label className="block text-xs font-medium text-slate-700 mb-1">Fat (%)</label>
        <input type="number" step="0.1" value={newFat} onChange={(e) => setNewFat(e.target.value)} className="w-full h-9 px-3 text-sm bg-white border border-slate-200 rounded-lg" />
        </div>
        <div>
        <label className="block text-xs font-medium text-slate-700 mb-1">Protein (g/100g)</label>
        <input type="number" step="0.1" value={newProtein} onChange={(e) => setNewProtein(e.target.value)} className="w-full h-9 px-3 text-sm bg-white border border-slate-200 rounded-lg" />
        </div>
        <div>
        <label className="block text-xs font-medium text-slate-700 mb-1">Pack / Shelf life</label>
        <div className="flex gap-2">
        <input type="text" value={newWeight} onChange={(e) => setNewWeight(e.target.value)} className="w-1/2 h-9 px-3 text-sm bg-white border border-slate-200 rounded-lg" />
        <input type="text" value={newShelfLife} onChange={(e) => setNewShelfLife(e.target.value)} className="w-1/2 h-9 px-3 text-sm bg-white border border-slate-200 rounded-lg" />
        </div>
        </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
        <label className="block text-xs font-medium text-slate-700 mb-1">Description (RU)</label>
        <input type="text" value={newDescRu} onChange={(e) => setNewDescRu(e.target.value)} className="w-full h-9 px-3 text-sm bg-white border border-slate-200 rounded-lg" />
        </div>
        <div>
        <label className="block text-xs font-medium text-slate-700 mb-1">SEO Title (RU)</label>
        <input type="text" value={newSeoTitle} onChange={(e) => setNewSeoTitle(e.target.value)} className="w-full h-9 px-3 text-sm bg-white border border-slate-200 rounded-lg" />
        </div>
        <div>
        <label className="block text-xs font-medium text-slate-700 mb-1">Photo Upload</label>
        <input
        type="file"
        accept="image/*"
        onChange={(e) => handleImageUpload(e.target.files?.[0], setNewImage)}
        className="w-full text-xs text-slate-600 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-blue-50 file:text-[#0057B8]"
        />
        </div>
        </div>
        <div className="flex justify-end gap-2">
        <button type="button" onClick={() => setShowAddProduct(false)} className="px-4 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg">
        {copy.cancelBtn}
        </button>
        <button type="submit" className="px-4 py-2 text-xs font-semibold text-white bg-[#0057B8] rounded-lg">
        {copy.saveBtn}
        </button>
        </div>
        </form>
      )}

      {editingProduct && (
        <form onSubmit={handleSaveEditProduct} className="border border-[#0057B8]/40 rounded-xl p-5 bg-blue-50/40 space-y-5">
        <div className="flex flex-wrap justify-between items-center gap-3">
        <h3 className="font-display text-base font-semibold text-slate-900">
        {localize(editingProduct.name)}
        </h3>
        <div className="flex items-center gap-2">
        <div className="inline-flex bg-white border border-slate-200 rounded-lg p-0.5">
        {LANGS.map((l) => (
          <button
          key={l}
          type="button"
          onClick={() => setEditLang(l)}
          className={`px-2.5 py-1 text-xs font-semibold rounded ${
            editLang === l ? 'bg-[#0057B8] text-white' : 'text-slate-600'
          }`}
          >
          {l.toUpperCase()}
          </button>
        ))}
        </div>
        <button type="button" onClick={() => setEditingProduct(null)} className="text-xs text-slate-500 hover:text-slate-900 px-2">
        ✕
        </button>
        </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
        <label className="block text-xs font-medium text-slate-700 mb-1">Name ({editLang.toUpperCase()})</label>
        <input
        type="text"
        value={editingProduct.name[editLang] || ''}
        onChange={(e) =>
          setEditingProduct({
            ...editingProduct,
            name: { ...editingProduct.name, [editLang]: e.target.value },
          })
        }
        className="w-full h-9 px-3 text-sm bg-white border border-slate-200 rounded-lg"
        />
        </div>
        <div>
        <label className="block text-xs font-medium text-slate-700 mb-1">{copy.colCategory}</label>
        <select
        value={editingProduct.category}
        onChange={(e) => {
          const cat = categories.find((c) => c.id === e.target.value);
          setEditingProduct({
            ...editingProduct,
            category: e.target.value,
            subcategory: cat?.subcategories[0]?.id || 'default',
          });
        }}
        className="w-full h-9 px-3 text-sm bg-white border border-slate-200 rounded-lg"
        >
        {categories.map((c) => (
          <option key={c.id} value={c.id}>{localize(c.name)}</option>
        ))}
        </select>
        </div>
        <div>
        <label className="block text-xs font-medium text-slate-700 mb-1">Fat (%)</label>
        <input
        type="number"
        step="0.1"
        value={editingProduct.fatContent ?? 0}
        onChange={(e) => setEditingProduct({ ...editingProduct, fatContent: Number(e.target.value) })}
        className="w-full h-9 px-3 text-sm bg-white border border-slate-200 rounded-lg"
        />
        </div>
        <div>
        <label className="block text-xs font-medium text-slate-700 mb-1">Protein (g/100g)</label>
        <input
        type="number"
        step="0.1"
        value={editingProduct.proteinContent ?? 0}
        onChange={(e) => setEditingProduct({ ...editingProduct, proteinContent: Number(e.target.value) })}
        className="w-full h-9 px-3 text-sm bg-white border border-slate-200 rounded-lg"
        />
        </div>
        </div>

        <div className="flex flex-wrap gap-5 text-xs text-slate-700">
        <label className="inline-flex items-center gap-2">
        <input
        type="checkbox"
        checked={editingProduct.lactoseFree}
        onChange={(e) => setEditingProduct({ ...editingProduct, lactoseFree: e.target.checked })}
        />
        <span>Lactose-Free</span>
        </label>
        <label className="inline-flex items-center gap-2">
        <input
        type="checkbox"
        checked={editingProduct.exportReady}
        onChange={(e) => setEditingProduct({ ...editingProduct, exportReady: e.target.checked })}
        />
        <span>Export B2B</span>
        </label>
        <label className="inline-flex items-center gap-2">
        <input
        type="checkbox"
        checked={editingProduct.featured}
        onChange={(e) => setEditingProduct({ ...editingProduct, featured: e.target.checked })}
        />
        <span>Featured</span>
        </label>
        <label className="inline-flex items-center gap-2">
        <span>Photo:</span>
        <input
        type="file"
        accept="image/*"
        onChange={(e) =>
          handleImageUpload(e.target.files?.[0], (url) =>
          setEditingProduct({ ...editingProduct, image: url })
          )
        }
        className="text-xs"
        />
        </label>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
        <label className="block text-xs font-medium text-slate-700 mb-1">SEO H1 ({editLang.toUpperCase()})</label>
        <input
        type="text"
        value={editingProduct.seo.h1[editLang] || ''}
        onChange={(e) =>
          setEditingProduct({
            ...editingProduct,
            seo: { ...editingProduct.seo, h1: { ...editingProduct.seo.h1, [editLang]: e.target.value } },
          })
        }
        className="w-full h-9 px-3 text-sm bg-white border border-slate-200 rounded-lg"
        />
        </div>
        <div>
        <label className="block text-xs font-medium text-slate-700 mb-1">SEO Title ({editLang.toUpperCase()})</label>
        <input
        type="text"
        value={editingProduct.seo.title[editLang] || ''}
        onChange={(e) =>
          setEditingProduct({
            ...editingProduct,
            seo: { ...editingProduct.seo, title: { ...editingProduct.seo.title, [editLang]: e.target.value } },
          })
        }
        className="w-full h-9 px-3 text-sm bg-white border border-slate-200 rounded-lg"
        />
        </div>
        <div>
        <label className="block text-xs font-medium text-slate-700 mb-1">SEO Description ({editLang.toUpperCase()})</label>
        <input
        type="text"
        value={editingProduct.seo.description[editLang] || ''}
        onChange={(e) =>
          setEditingProduct({
            ...editingProduct,
            seo: {
              ...editingProduct.seo,
              description: { ...editingProduct.seo.description, [editLang]: e.target.value },
            },
          })
        }
        className="w-full h-9 px-3 text-sm bg-white border border-slate-200 rounded-lg"
        />
        </div>
        <div>
        <label className="block text-xs font-medium text-slate-700 mb-1">Description ({editLang.toUpperCase()})</label>
        <input
        type="text"
        value={editingProduct.description[editLang] || ''}
        onChange={(e) =>
          setEditingProduct({
            ...editingProduct,
            description: { ...editingProduct.description, [editLang]: e.target.value },
          })
        }
        className="w-full h-9 px-3 text-sm bg-white border border-slate-200 rounded-lg"
        />
        </div>
        </div>

        {/* Dynamic characteristics by category schema */}
        {editingCategoryObj && editingCategoryObj.characteristicSchema.length > 0 && (
          <div className="pt-3 border-t border-slate-200 space-y-2">
          <div className="text-xs font-semibold text-slate-700">
          Characteristics ({editLang.toUpperCase()})
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {editingCategoryObj.characteristicSchema.map((field) => {
            const currentVal = editingProduct.characteristics[field.key] || emptyLocalized('');
            return (
              <div key={field.key}>
              <label className="block text-xs text-slate-600 mb-1">{localize(field.label)}</label>
              <input
              type="text"
              value={currentVal[editLang] || ''}
              onChange={(e) =>
                setEditingProduct({
                  ...editingProduct,
                  characteristics: {
                    ...editingProduct.characteristics,
                    [field.key]: { ...currentVal, [editLang]: e.target.value },
                  },
                })
              }
              className="w-full h-8 px-2.5 text-xs bg-white border border-slate-200 rounded-lg"
              />
              </div>
            );
          })}
          </div>
          </div>
        )}

        {/* Packages Editor */}
        <div className="pt-3 border-t border-slate-200 space-y-3">
        <div className="text-xs font-semibold text-slate-700">{copy.colPacks} ({editingProduct.packages.length})</div>
        <div className="flex flex-wrap gap-2">
        {editingProduct.packages.map((pkg) => (
          <div key={pkg.id} className="inline-flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs">
          <span className="font-semibold">{pkg.weight}</span>
          <span className="text-slate-500">{localize(pkg.shelfLife)} · GTIN {pkg.gtin}</span>
          <button
          type="button"
          onClick={() =>
            setEditingProduct({
              ...editingProduct,
              packages: editingProduct.packages.filter((p) => p.id !== pkg.id),
            })
          }
          className="text-red-500 hover:text-red-700"
          >
          ✕
          </button>
          </div>
        ))}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 items-end">
        <input type="text" value={pkgWeight} onChange={(e) => setPkgWeight(e.target.value)} placeholder="500 г" className="h-8 px-2 text-xs bg-white border border-slate-200 rounded" />
        <input type="text" value={pkgShelf} onChange={(e) => setPkgShelf(e.target.value)} placeholder="45 суток" className="h-8 px-2 text-xs bg-white border border-slate-200 rounded" />
        <input type="text" value={pkgStorage} onChange={(e) => setPkgStorage(e.target.value)} placeholder="+2…+6 °C" className="h-8 px-2 text-xs bg-white border border-slate-200 rounded" />
        <input type="text" value={pkgType} onChange={(e) => setPkgType(e.target.value)} placeholder="Вакуум" className="h-8 px-2 text-xs bg-white border border-slate-200 rounded" />
        <input type="text" value={pkgGtin} onChange={(e) => setPkgGtin(e.target.value)} placeholder="GTIN" className="h-8 px-2 text-xs bg-white border border-slate-200 rounded" />
        <button
        type="button"
        onClick={handleAddPackageToEditing}
        className="h-8 px-3 text-xs font-semibold text-[#0057B8] bg-white border border-[#0057B8]/40 rounded hover:bg-blue-50"
        >
        + Pack
        </button>
        </div>
        </div>

        <div className="flex justify-end gap-2">
        <button type="submit" className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#0057B8] rounded-lg">
        <Check className="w-3.5 h-3.5" />
        <span>{copy.saveBtn}</span>
        </button>
        </div>
        </form>
      )}

      <div className="border border-slate-200 rounded-xl overflow-x-auto bg-white">
      <table className="w-full text-left border-collapse text-sm">
      <thead>
      <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600">
      <th className="py-3 px-4">{copy.colProduct}</th>
      <th className="py-3 px-4">{copy.colCategory}</th>
      <th className="py-3 px-4">{copy.colPacks}</th>
      <th className="py-3 px-4">{copy.colStatus}</th>
      <th className="py-3 px-4 text-right">{copy.colActions}</th>
      </tr>
      </thead>
      <tbody className="divide-y divide-slate-200 tabular-nums">
      {products.map((prod) => {
        const cat = categories.find((c) => c.id === prod.category);
        return (
          <tr key={prod.id} className="hover:bg-slate-50/70">
          <td className="py-3 px-4">
          <div className="font-medium text-slate-900">{localize(prod.name)}</div>
          <div className="text-xs text-slate-500 font-mono">/{prod.slug}</div>
          </td>
          <td className="py-3 px-4 text-slate-600">{cat ? localize(cat.name) : prod.category}</td>
          <td className="py-3 px-4 text-slate-600 text-xs">{prod.packages.map((p) => p.weight).join(', ')}</td>
          <td className="py-3 px-4">
          <span className={`text-xs font-medium ${prod.visible ? 'text-[#0057B8]' : 'text-slate-400'}`}>
          {prod.visible ? copy.published : copy.hidden}
          </span>
          </td>
          <td className="py-3 px-4 text-right">
          <div className="inline-flex items-center gap-1.5">
          <button type="button" onClick={() => setEditingProduct(prod)} className="p-1.5 rounded-md text-slate-600 hover:bg-slate-100 hover:text-[#0057B8]">
          <Edit3 className="w-4 h-4" />
          </button>
          <button type="button" onClick={() => toggleProductVisibility(prod.id)} className="p-1.5 rounded-md text-slate-600 hover:bg-slate-100">
          {prod.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </button>
          <button type="button" onClick={() => deleteProduct(prod.id)} className="p-1.5 rounded-md text-slate-500 hover:bg-red-50 hover:text-red-600">
          <Trash2 className="w-4 h-4" />
          </button>
          </div>
          </td>
          </tr>
        );
      })}
      </tbody>
      </table>
      </div>
      </div>
    )}

    {/* TAB 2: CATEGORIES & SCHEMAS */}
    {activeTab === 'categories' && (
      <div className="space-y-6">
      <div className="flex justify-between items-center">
      <h2 className="font-display text-lg font-semibold text-slate-900">{copy.tabCategories}</h2>
      <button
      type="button"
      onClick={() => setShowAddCategory((v) => !v)}
      className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#0057B8] rounded-lg"
      >
      <Plus className="w-4 h-4" />
      <span>+ Category</span>
      </button>
      </div>

      {showAddCategory && (
        <form onSubmit={handleCreateCategory} className="border border-slate-200 rounded-xl p-5 bg-slate-50 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <input type="text" required value={catNameRu} onChange={(e) => setCatNameRu(e.target.value)} placeholder="Название (RU) *" className="h-9 px-3 text-sm bg-white border border-slate-200 rounded-lg" />
        <input type="text" value={catNameEn} onChange={(e) => setCatNameEn(e.target.value)} placeholder="Name (EN)" className="h-9 px-3 text-sm bg-white border border-slate-200 rounded-lg" />
        <input type="text" value={catSlug} onChange={(e) => setCatSlug(e.target.value)} placeholder="slug (e.g. drinks)" className="h-9 px-3 text-sm bg-white border border-slate-200 rounded-lg" />
        </div>
        <input type="text" value={catDescRu} onChange={(e) => setCatDescRu(e.target.value)} placeholder="Описание (RU)" className="w-full h-9 px-3 text-sm bg-white border border-slate-200 rounded-lg" />
        <input type="text" value={catSchemaInput} onChange={(e) => setCatSchemaInput(e.target.value)} placeholder="Schema key:Label" className="w-full h-9 px-3 text-sm bg-white border border-slate-200 rounded-lg font-mono" />
        <div className="flex justify-end gap-2">
        <button type="button" onClick={() => setShowAddCategory(false)} className="px-4 py-2 text-xs bg-white border border-slate-200 rounded-lg">{copy.cancelBtn}</button>
        <button type="submit" className="px-4 py-2 text-xs font-semibold text-white bg-[#0057B8] rounded-lg">{copy.saveBtn}</button>
        </div>
        </form>
      )}

      {editingCategory && (
        <form
        onSubmit={(e) => {
          e.preventDefault();
          updateCategory(editingCategory);
          setEditingCategory(null);
        }}
        className="border border-[#0057B8]/40 rounded-xl p-5 bg-blue-50/40 space-y-4"
        >
        <div className="flex justify-between items-center">
        <h3 className="font-semibold text-sm">{localize(editingCategory.name)}</h3>
        <div className="inline-flex bg-white border border-slate-200 rounded-lg p-0.5">
        {LANGS.map((l) => (
          <button key={l} type="button" onClick={() => setEditLang(l)} className={`px-2 py-0.5 text-xs font-semibold rounded ${editLang === l ? 'bg-[#0057B8] text-white' : 'text-slate-600'}`}>
          {l.toUpperCase()}
          </button>
        ))}
        </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <input
        type="text"
        value={editingCategory.name[editLang] || ''}
        onChange={(e) =>
          setEditingCategory({
            ...editingCategory,
            name: { ...editingCategory.name, [editLang]: e.target.value },
          })
        }
        className="h-9 px-3 text-sm bg-white border border-slate-200 rounded-lg"
        />
        <input
        type="text"
        value={editingCategory.description[editLang] || ''}
        onChange={(e) =>
          setEditingCategory({
            ...editingCategory,
            description: { ...editingCategory.description, [editLang]: e.target.value },
          })
        }
        className="h-9 px-3 text-sm bg-white border border-slate-200 rounded-lg"
        />
        </div>
        <div className="flex justify-end gap-2">
        <button type="button" onClick={() => setEditingCategory(null)} className="px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg">{copy.cancelBtn}</button>
        <button type="submit" className="px-4 py-1.5 text-xs font-semibold text-white bg-[#0057B8] rounded-lg">{copy.saveBtn}</button>
        </div>
        </form>
      )}

      <div className="border border-slate-200 rounded-xl overflow-x-auto bg-white">
      <table className="w-full text-left border-collapse text-sm">
      <thead>
      <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600">
      <th className="py-3 px-4">{copy.colCategory}</th>
      <th className="py-3 px-4">Slug</th>
      <th className="py-3 px-4">Schema</th>
      <th className="py-3 px-4 text-right">{copy.colActions}</th>
      </tr>
      </thead>
      <tbody className="divide-y divide-slate-200">
      {categories.map((cat) => (
        <tr key={cat.id} className="hover:bg-slate-50/70">
        <td className="py-3 px-4 font-medium text-slate-900">{localize(cat.name)}</td>
        <td className="py-3 px-4 font-mono text-xs text-slate-500">/{cat.slug}</td>
        <td className="py-3 px-4 text-xs text-slate-600">
        {cat.characteristicSchema.map((f) => localize(f.label)).join(', ') || '—'}
        </td>
        <td className="py-3 px-4 text-right">
        <div className="inline-flex items-center gap-1.5">
        <button
        type="button"
        onClick={() => setEditingCategory(cat)}
        className="p-1.5 rounded-md text-slate-600 hover:bg-slate-100 hover:text-[#0057B8]"
        >
        <Edit3 className="w-4 h-4" />
        </button>
        <button
        type="button"
        onClick={() => deleteCategory(cat.id)}
        className="p-1.5 rounded-md text-slate-500 hover:bg-red-50 hover:text-red-600"
        >
        <Trash2 className="w-4 h-4" />
        </button>
        </div>
        </td>
        </tr>
      ))}
      </tbody>
      </table>
      </div>
      </div>
    )}

    {/* TAB 3: NEWS CMS */}
    {activeTab === 'news' && (
      <div className="space-y-6">
      <div className="flex justify-between items-center gap-3">
      <h2 className="font-display text-lg font-semibold text-slate-900">{copy.tabNews}</h2>
      <button
      type="button"
      onClick={() => setShowAddNews((v) => !v)}
      className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#0057B8] rounded-lg hover:bg-[#004494] shrink-0"
      >
      <Plus className="w-4 h-4" />
      <span>+ News</span>
      </button>
      </div>

      {showAddNews && (
        <form onSubmit={handleCreateNews} className="border border-slate-200 rounded-xl p-5 bg-slate-50 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
        <label className="block text-xs font-medium text-slate-700 mb-1">Title (RU) *</label>
        <input
        type="text"
        required
        value={newsTitleRu}
        onChange={(e) => setNewsTitleRu(e.target.value)}
        className="w-full h-9 px-3 text-sm bg-white border border-slate-200 rounded-lg"
        />
        </div>
        <div>
        <label className="block text-xs font-medium text-slate-700 mb-1">Title (EN)</label>
        <input
        type="text"
        value={newsTitleEn}
        onChange={(e) => setNewsTitleEn(e.target.value)}
        className="w-full h-9 px-3 text-sm bg-white border border-slate-200 rounded-lg"
        />
        </div>
        <div>
        <label className="block text-xs font-medium text-slate-700 mb-1">{copy.colCategory}</label>
        <select
        value={newsCat}
        onChange={(e) => setNewsCat(e.target.value as NewsArticle['categoryId'])}
        className="w-full h-9 px-3 text-sm bg-white border border-slate-200 rounded-lg"
        >
        <option value="company">Company</option>
        <option value="export">Export</option>
        <option value="products">Products</option>
        <option value="awards">Awards</option>
        </select>
        </div>
        </div>
        <div>
        <label className="block text-xs font-medium text-slate-700 mb-1">Excerpt / Content (RU)</label>
        <textarea
        rows={2}
        value={newsExcerptRu}
        onChange={(e) => setNewsExcerptRu(e.target.value)}
        className="w-full p-3 text-sm bg-white border border-slate-200 rounded-lg"
        />
        </div>
        <div className="flex justify-end gap-2">
        <button
        type="button"
        onClick={() => setShowAddNews(false)}
        className="px-4 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg"
        >
        {copy.cancelBtn}
        </button>
        <button type="submit" className="px-4 py-2 text-xs font-semibold text-white bg-[#0057B8] rounded-lg">
        {copy.saveBtn}
        </button>
        </div>
        </form>
      )}

      {editingNews && (
        <form
        onSubmit={(e) => {
          e.preventDefault();
          updateNews(editingNews);
          setEditingNews(null);
        }}
        className="border border-[#0057B8]/40 rounded-xl p-5 bg-blue-50/40 space-y-4"
        >
        <div className="flex flex-wrap justify-between items-center gap-3">
        <h3 className="font-semibold text-sm text-slate-900">{localize(editingNews.title)}</h3>
        <div className="inline-flex bg-white border border-slate-200 rounded-lg p-0.5">
        {LANGS.map((l) => (
          <button
          key={l}
          type="button"
          onClick={() => setEditLang(l)}
          className={`px-2.5 py-1 text-xs font-semibold rounded ${
            editLang === l ? 'bg-[#0057B8] text-white' : 'text-slate-600'
          }`}
          >
          {l.toUpperCase()}
          </button>
        ))}
        </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="sm:col-span-2">
        <label className="block text-xs font-medium text-slate-700 mb-1">
        Title ({editLang.toUpperCase()})
        </label>
        <input
        type="text"
        value={editingNews.title[editLang] || ''}
        onChange={(e) =>
          setEditingNews({
            ...editingNews,
            title: { ...editingNews.title, [editLang]: e.target.value },
          })
        }
        className="w-full h-9 px-3 text-sm bg-white border border-slate-200 rounded-lg"
        />
        </div>
        <div>
        <label className="block text-xs font-medium text-slate-700 mb-1">Date</label>
        <input
        type="date"
        value={editingNews.date}
        onChange={(e) =>
          setEditingNews({
            ...editingNews,
            date: e.target.value,
            year: Number(e.target.value.slice(0, 4)) || editingNews.year,
          })
        }
        className="w-full h-9 px-3 text-sm bg-white border border-slate-200 rounded-lg"
        />
        </div>
        </div>

        <div>
        <label className="block text-xs font-medium text-slate-700 mb-1">
        Excerpt ({editLang.toUpperCase()})
        </label>
        <textarea
        rows={2}
        value={editingNews.excerpt[editLang] || ''}
        onChange={(e) =>
          setEditingNews({
            ...editingNews,
            excerpt: { ...editingNews.excerpt, [editLang]: e.target.value },
          })
        }
        className="w-full p-2.5 text-sm bg-white border border-slate-200 rounded-lg"
        />
        </div>

        <div>
        <label className="block text-xs font-medium text-slate-700 mb-1">
        Content ({editLang.toUpperCase()})
        </label>
        <textarea
        rows={3}
        value={editingNews.content[editLang] || ''}
        onChange={(e) =>
          setEditingNews({
            ...editingNews,
            content: { ...editingNews.content, [editLang]: e.target.value },
          })
        }
        className="w-full p-2.5 text-sm bg-white border border-slate-200 rounded-lg"
        />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
        <input
        type="file"
        accept="image/*"
        onChange={(e) =>
          handleImageUpload(e.target.files?.[0], (url) =>
          setEditingNews({ ...editingNews, image: url })
          )
        }
        className="text-xs"
        />
        <div className="flex gap-2">
        <button
        type="button"
        onClick={() => setEditingNews(null)}
        className="px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg"
        >
        {copy.cancelBtn}
        </button>
        <button
        type="submit"
        className="px-4 py-1.5 text-xs font-semibold text-white bg-[#0057B8] rounded-lg"
        >
        {copy.saveBtn}
        </button>
        </div>
        </div>
        </form>
      )}

      <div className="border border-slate-200 rounded-xl overflow-x-auto bg-white">
      <table className="w-full text-left border-collapse text-sm">
      <thead>
      <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600">
      <th className="py-3 px-4">Title</th>
      <th className="py-3 px-4">Date</th>
      <th className="py-3 px-4">{copy.colStatus}</th>
      <th className="py-3 px-4 text-right">{copy.colActions}</th>
      </tr>
      </thead>
      <tbody className="divide-y divide-slate-200 tabular-nums">
      {news.map((item) => (
        <tr key={item.id} className="hover:bg-slate-50/70">
        <td className="py-3 px-4 font-medium text-slate-900">{localize(item.title)}</td>
        <td className="py-3 px-4 text-xs font-mono text-slate-500">{item.date}</td>
        <td className="py-3 px-4 text-xs">
        <span className={item.published ? 'text-[#0057B8] font-medium' : 'text-slate-400'}>
        {item.published ? copy.newsPub : copy.newsHidden}
        </span>
        </td>
        <td className="py-3 px-4 text-right">
        <div className="inline-flex items-center gap-1.5">
        <button
        type="button"
        onClick={() => setEditingNews(item)}
        className="p-1.5 rounded-md text-slate-600 hover:bg-slate-100 hover:text-[#0057B8]"
        >
        <Edit3 className="w-4 h-4" />
        </button>
        <button
        type="button"
        onClick={() => toggleNewsPublished(item.id)}
        className="p-1.5 rounded-md text-slate-600 hover:bg-slate-100"
        >
        {item.published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
        </button>
        <button
        type="button"
        onClick={() => deleteNews(item.id)}
        className="p-1.5 rounded-md text-slate-500 hover:bg-red-50 hover:text-red-600"
        >
        <Trash2 className="w-4 h-4" />
        </button>
        </div>
        </td>
        </tr>
      ))}
      </tbody>
      </table>
      </div>
      </div>
    )}

    {/* TAB 4: 301 REDIRECTS */}
    {activeTab === 'redirects' && (
      <div className="space-y-6">
      <form onSubmit={handleCreateRedirect} className="border border-slate-200 rounded-xl p-5 bg-slate-50 grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
      <div>
      <label className="block text-xs font-medium text-slate-700 mb-1">From URL *</label>
      <input
      type="text"
      required
      value={redirFrom}
      onChange={(e) => setRedirFrom(e.target.value)}
      placeholder="/old-page.php"
      className="w-full h-9 px-3 text-sm bg-white border border-slate-200 rounded-lg font-mono"
      />
      </div>
      <div>
      <label className="block text-xs font-medium text-slate-700 mb-1">To Target *</label>
      <input
      type="text"
      required
      value={redirTo}
      onChange={(e) => setRedirTo(e.target.value)}
      placeholder="#/catalog"
      className="w-full h-9 px-3 text-sm bg-white border border-slate-200 rounded-lg font-mono"
      />
      </div>
      <div>
      <label className="block text-xs font-medium text-slate-700 mb-1">Note</label>
      <input
      type="text"
      value={redirNote}
      onChange={(e) => setRedirNote(e.target.value)}
      placeholder="Legacy URL rule"
      className="w-full h-9 px-3 text-sm bg-white border border-slate-200 rounded-lg"
      />
      </div>
      <button type="submit" className="h-9 px-4 text-xs font-semibold text-white bg-[#0057B8] rounded-lg">
      + 301 Rule
      </button>
      </form>

      <div className="border border-slate-200 rounded-xl overflow-x-auto bg-white">
      <table className="w-full text-left border-collapse text-xs">
      <thead>
      <tr className="bg-slate-50 border-b border-slate-200 font-semibold text-slate-600">
      <th className="py-3 px-4">From</th>
      <th className="py-3 px-4">Code</th>
      <th className="py-3 px-4">Target</th>
      <th className="py-3 px-4">Note</th>
      <th className="py-3 px-4 text-right">{copy.colActions}</th>
      </tr>
      </thead>
      <tbody className="divide-y divide-slate-200">
      {redirects.map((rule, idx) => (
        <tr key={`${rule.from}-${idx}`}>
        <td className="py-2.5 px-4 font-mono text-slate-700">{rule.from}</td>
        <td className="py-2.5 px-4 font-mono font-semibold text-[#0057B8]">{rule.code}</td>
        <td className="py-2.5 px-4 font-mono text-slate-700">{rule.to}</td>
        <td className="py-2.5 px-4 text-slate-600">{rule.note}</td>
        <td className="py-2.5 px-4 text-right">
        <button
        type="button"
        onClick={() => deleteRedirect(idx)}
        className="p-1.5 rounded-md text-slate-500 hover:bg-red-50 hover:text-red-600"
        >
        <Trash2 className="w-4 h-4" />
        </button>
        </td>
        </tr>
      ))}
      </tbody>
      </table>
      </div>
      </div>
    )}

    {/* TAB 5: TRANSLATIONS & LANGUAGE COMPLETENESS */}
    {activeTab === 'translations' && (
      <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {completenessStats.map((stat) => (
        <div key={stat.lang} className="border border-slate-200 rounded-xl p-4 bg-white space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-900">
        <span>{stat.lang.toUpperCase()}</span>
        <span className="font-mono text-[#0057B8] tabular-nums">{stat.pct}%</span>
        </div>
        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div className="h-full bg-[#0057B8]" style={{ width: `${stat.pct}%` }} />
        </div>
        <div className="text-xs text-slate-500 tabular-nums">
        {stat.filled} / {stat.total} {copy.fieldsFilled}
        </div>
        </div>
      ))}
      </div>

      <div className="border border-slate-200 rounded-xl overflow-x-auto bg-white">
      <table className="w-full text-left border-collapse text-xs">
      <thead>
      <tr className="bg-slate-50 border-b border-slate-200 font-semibold text-slate-600">
      <th className="py-3 px-4">UI Key</th>
      <th className="py-3 px-4">RU</th>
      <th className="py-3 px-4">BE</th>
      <th className="py-3 px-4">EN</th>
      <th className="py-3 px-4">ZH</th>
      </tr>
      </thead>
      <tbody className="divide-y divide-slate-200">
      {visibleTranslations.map(([key, val]) => (
        <tr key={key}>
        <td className="py-2.5 px-4 font-mono text-slate-500">{key}</td>
        {LANGS.map((lang) => (
          <td key={lang} className="py-2 px-2">
          <input
          type="text"
          value={val[lang] || ''}
          onChange={(e) => updateTranslation(key, lang, e.target.value)}
          className="w-full min-w-[140px] h-8 px-2 text-xs border border-slate-200 rounded focus:outline-none focus:border-[#0057B8]"
          />
          </td>
        ))}
        </tr>
      ))}
      </tbody>
      </table>
      </div>

      {translationEntries.length > 12 && (
        <div className="flex justify-end">
        <button
        type="button"
        onClick={() => setShowAllTranslations((v) => !v)}
        className="px-4 py-2 text-xs font-medium text-[#0057B8] bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
        >
        {showAllTranslations ? copy.showFewer : copy.showAll}
        </button>
        </div>
      )}
      </div>
    )}
  
    {/* TAB 6: B2B INQUIRIES */}
    {activeTab === 'inquiries' && (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-slate-900">B2B & Export Inquiries ({inquiries.length})</h2>
          <button
            type="button"
            onClick={() => refreshInquiries()}
            className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200"
          >
            Refresh
          </button>
        </div>
        <div className="border border-slate-200 rounded-xl overflow-x-auto bg-white">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 font-semibold text-slate-600">
                <th className="py-3 px-4">Company / Contact</th>
                <th className="py-3 px-4">Channel</th>
                <th className="py-3 px-4">Country / Volume</th>
                <th className="py-3 px-4">Message</th>
                <th className="py-3 px-4">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {inquiries.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-500">
                    No submitted B2B inquiries yet. Submit one via product card, Export, or Contacts form.
                  </td>
                </tr>
              ) : (
                inquiries.map((inq, idx) => (
                  <tr key={inq.id || idx}>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900">{inq.company}</div>
                      <div className="text-slate-600">{inq.contactName} · {inq.email}</div>
                    </td>
                    <td className="py-3 px-4 font-mono text-[#0057B8] uppercase">{inq.channel}</td>
                    <td className="py-3 px-4 text-slate-700">
                      <div>{inq.country || '—'}</div>
                      <div className="text-slate-500">{inq.volume || '—'}</div>
                    </td>
                    <td className="py-3 px-4 text-slate-700 max-w-xs">{inq.message}</td>
                    <td className="py-3 px-4 font-mono text-slate-500">
                      {inq.createdAt ? inq.createdAt.slice(0, 16).replace('T', ' ') : '—'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    )}
  </div>
  );
};
