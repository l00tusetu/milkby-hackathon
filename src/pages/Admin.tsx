import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus,
  Eye,
  EyeOff,
  Trash2,
  RotateCcw,
  Edit3,
  Check,
  Upload,
  Download,
  Globe2,
  LogOut,
} from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { useCatalogStore } from '../hooks/useCatalogStore';
import { useAuth } from '../hooks/useAuth';
import { ASSETS } from '../data/assets';
import { Category, Language, NewsArticle, PackageVariant, Product, RedirectRule } from '../types';
import { SeoHead } from '../components/SeoHead';
import { StaffAuthGate } from '../components/StaffAuth';
import { ImagePickerField } from '../components/admin/ImagePickerField';
import { AdminHomeTab } from '../components/admin/AdminHomeTab';
import { AdminTeamTab } from '../components/admin/AdminTeamTab';
import { AdminContactsTab } from '../components/admin/AdminContactsTab';
import { AdminFooterTab } from '../components/admin/AdminFooterTab';

const LANGS: Language[] = ['ru', 'be', 'en', 'zh'];

type AdminTab =
| 'home'
| 'team'
| 'products'
| 'categories'
| 'news'
| 'contacts'
| 'footer'
| 'redirects'
| 'translations';

const parseWeightGrams = (label: string): number => {
  const num = parseFloat(label.replace(',', '.'));
  if (!Number.isFinite(num) || num <= 0) return 250;
  if (/кг|kg|л|l/i.test(label) && !/мг|мл|ml/i.test(label)) {
    return Math.round(num * 1000);
  }
  return Math.round(num);
};

const emptyLocalized = (ruValue = '') => ({ ru: ruValue, be: '', en: '', zh: '' });

const AdminDashboard: React.FC = () => {
  const { language, localize, t, translations, updateTranslation, resetTranslations } = useLanguage();
  const { user, logout } = useAuth();
  const {
    products,
    categories,
    news,
    redirects,
    siteSettings,
    teamMembers,
    directoryEntries,
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
    resetDemoData,
  } = useCatalogStore();

  const [activeTab, setActiveTab] = useState<AdminTab>('home');
  const [editLang, setEditLang] = useState<Language>(language);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingNews, setEditingNews] = useState<NewsArticle | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showAddNews, setShowAddNews] = useState(false);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [showAllTranslations, setShowAllTranslations] = useState(false);
  const [importStatus, setImportStatus] = useState<string>('');

  // Add Product Form State
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
  const [newGalleryDraft, setNewGalleryDraft] = useState<string>(ASSETS.productMozzarella);

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
  const [catImage, setCatImage] = useState('');
  const [catSchemaInput, setCatSchemaInput] = useState('composition:Состав, origin:Происхождение');

  // Add News Form State
  const [newsTitleRu, setNewsTitleRu] = useState('');
  const [newsTitleEn, setNewsTitleEn] = useState('');
  const [newsExcerptRu, setNewsExcerptRu] = useState('');
  const [newsContentRu, setNewsContentRu] = useState('');
  const [newsDate, setNewsDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [newsCat, setNewsCat] = useState<NewsArticle['categoryId']>('company');
  const [newsImage, setNewsImage] = useState<string>(ASSETS.newsDairyFacility);

  // Add Redirect Form State
  const [redirFrom, setRedirFrom] = useState('');
  const [redirTo, setRedirTo] = useState('#/catalog');
  const [redirNote, setRedirNote] = useState('');

  const copy = {
    ru: {
      subtitle:
      'Управление главной страницей, командой, каталогом, картинками, контактами, футером, новостями, 301-редиректами и переводами.',
      seoSitemap: 'SEO и карта сайта',
      reset: 'Сбросить демо-данные',
      logout: 'Выйти',
      tabHome: 'Главная и плашка',
      tabTeam: `Команда (${teamMembers.length})`,
      tabProducts: `Продукция (${products.length})`,
      tabCategories: `Категории (${categories.length})`,
      tabNews: `Новости (${news.length})`,
      tabContacts: `Контакты (${directoryEntries.length})`,
      tabFooter: 'Футер',
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
      subtitle:
      'Кіраванне галоўнай старонкай, камандай, каталогам, выявамі, кантактамі, футэрам, навінамі, 301-рэдырэктамі і перакладамі.',
      seoSitemap: 'SEO і карта сайта',
      reset: 'Скінуць дэма-даныя',
      logout: 'Выйсці',
      tabHome: 'Галоўная і плашка',
      tabTeam: `Каманда (${teamMembers.length})`,
      tabProducts: `Прадукцыя (${products.length})`,
      tabCategories: `Катэгорыі (${categories.length})`,
      tabNews: `Навіны (${news.length})`,
      tabContacts: `Кантакты (${directoryEntries.length})`,
      tabFooter: 'Футэр',
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
      subtitle:
      'No-code CMS for homepage banners, leadership team, products, images, contacts, footer, news, 301 redirects, and 4 languages.',
      seoSitemap: 'SEO & Sitemap',
      reset: 'Reset Demo Data',
      logout: 'Log out',
      tabHome: 'Homepage & Plaque',
      tabTeam: `Team (${teamMembers.length})`,
      tabProducts: `Products (${products.length})`,
      tabCategories: `Categories (${categories.length})`,
      tabNews: `News (${news.length})`,
      tabContacts: `Contacts (${directoryEntries.length})`,
      tabFooter: 'Footer',
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
      subtitle:
      '免代码管理首页横幅、专家团队、产品目录、图片媒体、联系方式、页脚、新闻资讯、301重定向及四语翻译。',
      seoSitemap: 'SEO 与站点地图',
      reset: '重置演示数据',
      logout: '退出登录',
      tabHome: '首页与横幅',
      tabTeam: `专家团队 (${teamMembers.length})`,
      tabProducts: `产品目录 (${products.length})`,
      tabCategories: `产品分类 (${categories.length})`,
      tabNews: `新闻动态 (${news.length})`,
      tabContacts: `联系方式 (${directoryEntries.length})`,
      tabFooter: '页脚设置',
      tabRedirects: `301 重定向 (${redirects.length})`,
      tabTranslations: '语言与翻译',
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

  // Translation completeness audit across catalog, news, UI keys, team & site settings
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
      for (const m of teamMembers) {
        total += 3;
        if (m.name[lang]?.trim()) filled++;
        if (m.role[lang]?.trim()) filled++;
        if (m.bio[lang]?.trim()) filled++;
      }
      const siteFields = [
        siteSettings.homeHero.title,
        siteSettings.homeHero.subtitle,
        siteSettings.promoBanner.title,
        siteSettings.promoBanner.lead,
        siteSettings.footer.brandDesc,
        siteSettings.footer.copyright,
      ];
      for (const field of siteFields) {
        total += 1;
        if (field[lang]?.trim()) filled++;
      }
      for (const key of Object.keys(translations)) {
        total += 1;
        if (translations[key]?.[lang]?.trim()) filled++;
      }
      const pct = total > 0 ? Math.round((filled / total) * 100) : 100;
      return { lang, filled, total, pct };
    });
  }, [products, categories, news, teamMembers, siteSettings, translations]);

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
    setNewImage(ASSETS.productAgedCheese);
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
      storage: {
        ru: pkgStorage.trim(),
        be: pkgStorage.trim(),
        en: pkgStorage.trim(),
        zh: pkgStorage.trim(),
      },
      packagingType: { ru: pkgType.trim(), be: '', en: '', zh: '' },
      unitsPerBox: Number(pkgBox) || 1,
      gtin: pkgGtin.trim() || '4810268000000',
    };
    setEditingProduct({
      ...editingProduct,
      packages: [...editingProduct.packages, newPkg],
    });
  };

  const handleImportCatalogFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
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
          const lines = text
          .split(/\r?\n/)
          .map((l) => l.trim())
          .filter(Boolean);
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
                          storage: {
                            ru: '+2…+6 °C',
                            be: '+2…+6 °C',
                            en: '+2…+6 °C',
                            zh: '+2…+6 °C',
                          },
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
    const blob = new Blob([JSON.stringify(products, null, 2)], {
      type: 'application/json;charset=utf-8',
    });
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
    const dateVal = newsDate || new Date().toISOString().slice(0, 10);
    const id = `news-${Date.now().toString(36)}`;
    addNews({
      id,
      slug: id,
      date: dateVal,
      year: Number(dateVal.slice(0, 4)) || new Date().getFullYear(),
            categoryId: newsCat,
            title: { ru: newsTitleRu.trim(), be: '', en: newsTitleEn.trim(), zh: '' },
            excerpt: {
              ru: newsExcerptRu.trim() || 'Оперативное сообщение пресс-службы ОАО «Молочный Мир».',
            be: '',
            en: '',
            zh: '',
            },
            content: {
              ru: newsContentRu.trim() || newsExcerptRu.trim() || newsTitleRu.trim(),
            be: '',
            en: '',
            zh: '',
            },
            image: newsImage || ASSETS.newsDairyFacility,
            published: true,
            relatedIds: [],
            seo: {
              title: {
                ru: `${newsTitleRu.trim()} — Новости Молочный Мир`,
            be: '',
            en: newsTitleEn.trim() ? `${newsTitleEn.trim()} — News` : '',
            zh: '',
              },
              description: { ru: newsExcerptRu.trim() || newsTitleRu.trim(), be: '', en: '', zh: '' },
            },
    });
    setNewsTitleRu('');
    setNewsTitleEn('');
    setNewsExcerptRu('');
    setNewsContentRu('');
    setNewsImage(ASSETS.newsDairyFacility);
    setShowAddNews(false);
  };

  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!catNameRu.trim()) return;
    const slug = (catSlug.trim() || `cat-${Date.now().toString(36)}`)
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-');
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
      image: catImage || undefined,
      name: { ru: catNameRu.trim(), be: '', en: catNameEn.trim(), zh: '' },
                description: { ru: catDescRu.trim(), be: '', en: '', zh: '' },
                subcategories: [
                  { id: 'default', name: { ru: 'Основная серия', be: '', en: 'Main line', zh: '' } },
                ],
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
    setCatImage('');
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
  const visibleTranslations = showAllTranslations
  ? translationEntries
  : translationEntries.slice(0, 12);
  const editingCategoryObj = editingProduct
  ? categories.find((c) => c.id === editingProduct.category)
  : undefined;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
    <SeoHead
    title={`${t('adminTitle')} — ${t('brandName')}`}
    description={copy.subtitle}
    canonicalHash="/admin"
    noIndex
    />

    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
    <div>
    <div className="flex flex-wrap items-center gap-2.5">
    <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-900">
    {t('adminTitle')}
    </h1>
    {user && (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-[#0057B8] border border-blue-200/80">
      {user.username} · {user.role[language]}
      </span>
    )}
    </div>
    <p className="text-sm text-slate-600 mt-1">{copy.subtitle}</p>
    </div>

    <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto shrink-0">
    <Link
    to="/sitemap"
    className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-[#0057B8] bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors whitespace-nowrap"
    >
    <Globe2 className="w-3.5 h-3.5" />
    <span>{copy.seoSitemap}</span>
    </Link>

    <button
    type="button"
    onClick={() => {
      resetDemoData();
      resetTranslations();
    }}
    className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors whitespace-nowrap"
    >
    <RotateCcw className="w-3.5 h-3.5" />
    <span>{copy.reset}</span>
    </button>

    <button
    type="button"
    onClick={logout}
    className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors whitespace-nowrap"
    >
    <LogOut className="w-3.5 h-3.5" />
    <span>{copy.logout}</span>
    </button>
    </div>
    </div>

    {/* Tabs */}
    <div className="max-w-full overflow-x-auto pb-1">
    <div className="inline-flex items-center gap-1 p-1 bg-slate-100 rounded-lg border border-slate-200">
    {(
      [
        ['home', copy.tabHome],
      ['team', copy.tabTeam],
      ['products', copy.tabProducts],
      ['categories', copy.tabCategories],
      ['news', copy.tabNews],
      ['contacts', copy.tabContacts],
      ['footer', copy.tabFooter],
      ['redirects', copy.tabRedirects],
      ['translations', copy.tabTranslations],
      ] as const
    ).map(([tabKey, label]) => (
      <button
      key={tabKey}
      type="button"
      onClick={() => setActiveTab(tabKey)}
      className={`px-3.5 py-2 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
        activeTab === tabKey
        ? 'bg-white text-[#0057B8] shadow-xs'
        : 'text-slate-600 hover:text-slate-900'
      }`}
      >
      {label}
      </button>
    ))}
    </div>
    </div>

    {/* TAB: HOMEPAGE HERO & PROMO PLAQUE */}
    {activeTab === 'home' && <AdminHomeTab />}

    {/* TAB: HOMEPAGE EXPERT TEAM */}
    {activeTab === 'team' && <AdminTeamTab />}

    {/* TAB: PRODUCTS CMS */}
    {activeTab === 'products' && (
      <div className="space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-3">
      <h2 className="font-display text-lg font-semibold text-slate-900">
      {copy.catalogItems}
      </h2>
      <div className="flex flex-wrap items-center gap-2">
      {importStatus && (
        <span className="text-xs font-mono text-[#0057B8] bg-blue-50 px-2.5 py-1 rounded">
        {importStatus}
        </span>
      )}
      <label className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 cursor-pointer">
      <Upload className="w-3.5 h-3.5" />
      <span>{copy.importBtn}</span>
      <input
      type="file"
      accept=".json,.csv"
      onChange={handleImportCatalogFile}
      className="hidden"
      />
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
        <form
        onSubmit={handleCreateProduct}
        className="border border-slate-200 rounded-xl p-5 bg-slate-50 space-y-4"
        >
        <h3 className="font-display text-base font-semibold text-slate-900">
        {copy.addProduct}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
        <label className="block text-xs font-medium text-slate-700 mb-1">
        Название (RU) *
        </label>
        <input
        type="text"
        required
        value={newNameRu}
        onChange={(e) => setNewNameRu(e.target.value)}
        className="w-full h-9 px-3 text-sm bg-white border border-slate-200 rounded-lg"
        />
        </div>
        <div>
        <label className="block text-xs font-medium text-slate-700 mb-1">
        Назва (BE)
        </label>
        <input
        type="text"
        value={newNameBe}
        onChange={(e) => setNewNameBe(e.target.value)}
        className="w-full h-9 px-3 text-sm bg-white border border-slate-200 rounded-lg"
        />
        </div>
        <div>
        <label className="block text-xs font-medium text-slate-700 mb-1">
        Name (EN)
        </label>
        <input
        type="text"
        value={newNameEn}
        onChange={(e) => setNewNameEn(e.target.value)}
        className="w-full h-9 px-3 text-sm bg-white border border-slate-200 rounded-lg"
        />
        </div>
        <div>
        <label className="block text-xs font-medium text-slate-700 mb-1">
        名称 (ZH)
        </label>
        <input
        type="text"
        value={newNameZh}
        onChange={(e) => setNewNameZh(e.target.value)}
        className="w-full h-9 px-3 text-sm bg-white border border-slate-200 rounded-lg"
        />
        </div>
        <div>
        <label className="block text-xs font-medium text-slate-700 mb-1">
        {copy.colCategory}
        </label>
        <select
        value={newCategory}
        onChange={(e) => setNewCategory(e.target.value)}
        className="w-full h-9 px-3 text-sm bg-white border border-slate-200 rounded-lg"
        >
        {categories.map((c) => (
          <option key={c.id} value={c.id}>
          {localize(c.name)}
          </option>
        ))}
        </select>
        </div>
        <div>
        <label className="block text-xs font-medium text-slate-700 mb-1">Fat (%)</label>
        <input
        type="number"
        step="0.1"
        value={newFat}
        onChange={(e) => setNewFat(e.target.value)}
        className="w-full h-9 px-3 text-sm bg-white border border-slate-200 rounded-lg"
        />
        </div>
        <div>
        <label className="block text-xs font-medium text-slate-700 mb-1">
        Protein (g/100g)
        </label>
        <input
        type="number"
        step="0.1"
        value={newProtein}
        onChange={(e) => setNewProtein(e.target.value)}
        className="w-full h-9 px-3 text-sm bg-white border border-slate-200 rounded-lg"
        />
        </div>
        <div>
        <label className="block text-xs font-medium text-slate-700 mb-1">
        Pack / Shelf life
        </label>
        <div className="flex gap-2">
        <input
        type="text"
        value={newWeight}
        onChange={(e) => setNewWeight(e.target.value)}
        className="w-1/2 h-9 px-3 text-sm bg-white border border-slate-200 rounded-lg"
        />
        <input
        type="text"
        value={newShelfLife}
        onChange={(e) => setNewShelfLife(e.target.value)}
        className="w-1/2 h-9 px-3 text-sm bg-white border border-slate-200 rounded-lg"
        />
        </div>
        </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
        <label className="block text-xs font-medium text-slate-700 mb-1">
        Description (RU)
        </label>
        <input
        type="text"
        value={newDescRu}
        onChange={(e) => setNewDescRu(e.target.value)}
        className="w-full h-9 px-3 text-sm bg-white border border-slate-200 rounded-lg"
        />
        </div>
        <div>
        <label className="block text-xs font-medium text-slate-700 mb-1">
        SEO Title (RU)
        </label>
        <input
        type="text"
        value={newSeoTitle}
        onChange={(e) => setNewSeoTitle(e.target.value)}
        className="w-full h-9 px-3 text-sm bg-white border border-slate-200 rounded-lg"
        />
        </div>
        </div>

        <ImagePickerField
        label="Фотография товара (загрузка, URL или из галереи)"
        value={newImage}
        onChange={setNewImage}
        />

        <div className="flex justify-end gap-2">
        <button
        type="button"
        onClick={() => setShowAddProduct(false)}
        className="px-4 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg"
        >
        {copy.cancelBtn}
        </button>
        <button
        type="submit"
        className="px-4 py-2 text-xs font-semibold text-white bg-[#0057B8] rounded-lg"
        >
        {copy.saveBtn}
        </button>
        </div>
        </form>
      )}

      {editingProduct && (
        <form
        onSubmit={handleSaveEditProduct}
        className="border border-[#0057B8]/40 rounded-xl p-5 bg-blue-50/40 space-y-5"
        >
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
        <button
        type="button"
        onClick={() => setEditingProduct(null)}
        className="text-xs text-slate-500 hover:text-slate-900 px-2"
        >
        ✕
        </button>
        </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
        <label className="block text-xs font-medium text-slate-700 mb-1">
        Name ({editLang.toUpperCase()})
        </label>
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
        <label className="block text-xs font-medium text-slate-700 mb-1">
        {copy.colCategory}
        </label>
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
          <option key={c.id} value={c.id}>
          {localize(c.name)}
          </option>
        ))}
        </select>
        </div>
        <div>
        <label className="block text-xs font-medium text-slate-700 mb-1">Fat (%)</label>
        <input
        type="number"
        step="0.1"
        value={editingProduct.fatContent ?? 0}
        onChange={(e) =>
          setEditingProduct({ ...editingProduct, fatContent: Number(e.target.value) })
        }
        className="w-full h-9 px-3 text-sm bg-white border border-slate-200 rounded-lg"
        />
        </div>
        <div>
        <label className="block text-xs font-medium text-slate-700 mb-1">
        Protein (g/100g)
        </label>
        <input
        type="number"
        step="0.1"
        value={editingProduct.proteinContent ?? 0}
        onChange={(e) =>
          setEditingProduct({
            ...editingProduct,
            proteinContent: Number(e.target.value),
          })
        }
        className="w-full h-9 px-3 text-sm bg-white border border-slate-200 rounded-lg"
        />
        </div>
        </div>

        <div className="flex flex-wrap gap-5 text-xs text-slate-700">
        <label className="inline-flex items-center gap-2">
        <input
        type="checkbox"
        checked={Boolean(editingProduct.lactoseFree)}
        onChange={(e) =>
          setEditingProduct({ ...editingProduct, lactoseFree: e.target.checked })
        }
        />
        <span>Lactose-Free</span>
        </label>
        <label className="inline-flex items-center gap-2">
        <input
        type="checkbox"
        checked={Boolean(editingProduct.exportReady)}
        onChange={(e) =>
          setEditingProduct({ ...editingProduct, exportReady: e.target.checked })
        }
        />
        <span>Export B2B</span>
        </label>
        <label className="inline-flex items-center gap-2">
        <input
        type="checkbox"
        checked={Boolean(editingProduct.featured)}
        onChange={(e) =>
          setEditingProduct({ ...editingProduct, featured: e.target.checked })
        }
        />
        <span>Featured</span>
        </label>
        </div>

        {/* Primary photo & optional extra gallery */}
        <ImagePickerField
        label="Основное изображение карточки товара"
        value={editingProduct.image}
        onChange={(url) => setEditingProduct({ ...editingProduct, image: url })}
        />

        <div className="pt-2 border-t border-slate-200 space-y-2.5">
        <div className="text-xs font-semibold text-slate-700">
        Дополнительные фото в галерее карточки ({editingProduct.gallery?.length || 0})
        </div>
        {(editingProduct.gallery?.length || 0) > 0 && (
          <div className="flex flex-wrap gap-2">
          {editingProduct.gallery?.map((gUrl, idx) => (
            <div
            key={`${gUrl}-${idx}`}
            className="relative w-16 h-16 rounded-lg overflow-hidden border border-slate-200 bg-white group"
            >
            <img src={gUrl} alt="" className="w-full h-full object-cover" />
            <button
            type="button"
            onClick={() =>
              setEditingProduct({
                ...editingProduct,
                gallery: editingProduct.gallery?.filter((_, i) => i !== idx),
              })
            }
            aria-label="Remove gallery photo"
            className="absolute top-0.5 right-0.5 w-5 h-5 rounded-full bg-slate-900/75 text-white text-[10px] flex items-center justify-center hover:bg-red-600"
            >
            ✕
            </button>
            </div>
          ))}
          </div>
        )}
        <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-end">
        <div className="flex-1">
        <ImagePickerField
        label="Добавить фото в галерею товара"
        value={newGalleryDraft}
        onChange={setNewGalleryDraft}
        />
        </div>
        <button
        type="button"
        onClick={() => {
          if (!newGalleryDraft.trim()) return;
          setEditingProduct({
            ...editingProduct,
            gallery: [...(editingProduct.gallery || []), newGalleryDraft.trim()],
          });
        }}
        className="h-9 px-3.5 text-xs font-semibold text-[#0057B8] bg-white border border-[#0057B8]/40 rounded-lg hover:bg-blue-50 whitespace-nowrap"
        >
        + В галерею
        </button>
        </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
        <label className="block text-xs font-medium text-slate-700 mb-1">
        SEO H1 ({editLang.toUpperCase()})
        </label>
        <input
        type="text"
        value={editingProduct.seo.h1[editLang] || ''}
        onChange={(e) =>
          setEditingProduct({
            ...editingProduct,
            seo: {
              ...editingProduct.seo,
              h1: { ...editingProduct.seo.h1, [editLang]: e.target.value },
            },
          })
        }
        className="w-full h-9 px-3 text-sm bg-white border border-slate-200 rounded-lg"
        />
        </div>
        <div>
        <label className="block text-xs font-medium text-slate-700 mb-1">
        SEO Title ({editLang.toUpperCase()})
        </label>
        <input
        type="text"
        value={editingProduct.seo.title[editLang] || ''}
        onChange={(e) =>
          setEditingProduct({
            ...editingProduct,
            seo: {
              ...editingProduct.seo,
              title: { ...editingProduct.seo.title, [editLang]: e.target.value },
            },
          })
        }
        className="w-full h-9 px-3 text-sm bg-white border border-slate-200 rounded-lg"
        />
        </div>
        <div>
        <label className="block text-xs font-medium text-slate-700 mb-1">
        SEO Description ({editLang.toUpperCase()})
        </label>
        <input
        type="text"
        value={editingProduct.seo.description[editLang] || ''}
        onChange={(e) =>
          setEditingProduct({
            ...editingProduct,
            seo: {
              ...editingProduct.seo,
              description: {
                ...editingProduct.seo.description,
                [editLang]: e.target.value,
              },
            },
          })
        }
        className="w-full h-9 px-3 text-sm bg-white border border-slate-200 rounded-lg"
        />
        </div>
        <div>
        <label className="block text-xs font-medium text-slate-700 mb-1">
        Description ({editLang.toUpperCase()})
        </label>
        <input
        type="text"
        value={editingProduct.description[editLang] || ''}
        onChange={(e) =>
          setEditingProduct({
            ...editingProduct,
            description: {
              ...editingProduct.description,
              [editLang]: e.target.value,
            },
          })
        }
        className="w-full h-9 px-3 text-sm bg-white border border-slate-200 rounded-lg"
        />
        </div>
        </div>

        {editingCategoryObj && editingCategoryObj.characteristicSchema.length > 0 && (
          <div className="pt-3 border-t border-slate-200 space-y-2">
          <div className="text-xs font-semibold text-slate-700">
          Characteristics ({editLang.toUpperCase()})
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {editingCategoryObj.characteristicSchema.map((field) => {
            const currentVal =
            editingProduct.characteristics[field.key] || emptyLocalized('');
            return (
              <div key={field.key}>
              <label className="block text-xs text-slate-600 mb-1">
              {localize(field.label)}
              </label>
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
        <div className="text-xs font-semibold text-slate-700">
        {copy.colPacks} ({editingProduct.packages.length})
        </div>
        <div className="flex flex-wrap gap-2">
        {editingProduct.packages.map((pkg) => (
          <div
          key={pkg.id}
          className="inline-flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs"
          >
          <span className="font-semibold">{pkg.weight}</span>
          <span className="text-slate-500">
          {localize(pkg.shelfLife)} · GTIN {pkg.gtin}
          </span>
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
        <input
        type="text"
        value={pkgWeight}
        onChange={(e) => setPkgWeight(e.target.value)}
        placeholder="500 г"
        className="h-8 px-2 text-xs bg-white border border-slate-200 rounded"
        />
        <input
        type="text"
        value={pkgShelf}
        onChange={(e) => setPkgShelf(e.target.value)}
        placeholder="45 суток"
        className="h-8 px-2 text-xs bg-white border border-slate-200 rounded"
        />
        <input
        type="text"
        value={pkgStorage}
        onChange={(e) => setPkgStorage(e.target.value)}
        placeholder="+2…+6 °C"
        className="h-8 px-2 text-xs bg-white border border-slate-200 rounded"
        />
        <input
        type="text"
        value={pkgType}
        onChange={(e) => setPkgType(e.target.value)}
        placeholder="Вакуум"
        className="h-8 px-2 text-xs bg-white border border-slate-200 rounded"
        />
        <input
        type="text"
        value={pkgGtin}
        onChange={(e) => setPkgGtin(e.target.value)}
        placeholder="GTIN"
        className="h-8 px-2 text-xs bg-white border border-slate-200 rounded"
        />
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
        <button
        type="submit"
        className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#0057B8] rounded-lg"
        >
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
          <div className="flex items-center gap-3">
          <img
          src={prod.image}
          alt=""
          className="w-10 h-10 rounded-lg object-cover border border-slate-200 bg-slate-50 shrink-0"
          />
          <div>
          <div className="font-medium text-slate-900">{localize(prod.name)}</div>
          <div className="text-xs text-slate-500 font-mono">/{prod.slug}</div>
          </div>
          </div>
          </td>
          <td className="py-3 px-4 text-slate-600">
          {cat ? localize(cat.name) : prod.category}
          </td>
          <td className="py-3 px-4 text-slate-600 text-xs">
          {prod.packages.map((p) => p.weight).join(', ')}
          </td>
          <td className="py-3 px-4">
          <span
          className={`text-xs font-medium ${
            prod.visible ? 'text-[#0057B8]' : 'text-slate-400'
          }`}
          >
          {prod.visible ? copy.published : copy.hidden}
          </span>
          </td>
          <td className="py-3 px-4 text-right">
          <div className="inline-flex items-center gap-1.5">
          <button
          type="button"
          onClick={() => setEditingProduct(prod)}
          className="p-1.5 rounded-md text-slate-600 hover:bg-slate-100 hover:text-[#0057B8]"
          >
          <Edit3 className="w-4 h-4" />
          </button>
          <button
          type="button"
          onClick={() => toggleProductVisibility(prod.id)}
          className="p-1.5 rounded-md text-slate-600 hover:bg-slate-100"
          >
          {prod.visible ? (
            <Eye className="w-4 h-4" />
          ) : (
            <EyeOff className="w-4 h-4" />
          )}
          </button>
          <button
          type="button"
          onClick={() => deleteProduct(prod.id)}
          className="p-1.5 rounded-md text-slate-500 hover:bg-red-50 hover:text-red-600"
          >
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

    {/* TAB: CATEGORIES & SCHEMAS */}
    {activeTab === 'categories' && (
      <div className="space-y-6">
      <div className="flex justify-between items-center">
      <h2 className="font-display text-lg font-semibold text-slate-900">
      {copy.tabCategories}
      </h2>
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
        <form
        onSubmit={handleCreateCategory}
        className="border border-slate-200 rounded-xl p-5 bg-slate-50 space-y-4"
        >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <input
        type="text"
        required
        value={catNameRu}
        onChange={(e) => setCatNameRu(e.target.value)}
        placeholder="Название (RU) *"
        className="h-9 px-3 text-sm bg-white border border-slate-200 rounded-lg"
        />
        <input
        type="text"
        value={catNameEn}
        onChange={(e) => setCatNameEn(e.target.value)}
        placeholder="Name (EN)"
        className="h-9 px-3 text-sm bg-white border border-slate-200 rounded-lg"
        />
        <input
        type="text"
        value={catSlug}
        onChange={(e) => setCatSlug(e.target.value)}
        placeholder="slug (e.g. drinks)"
        className="h-9 px-3 text-sm bg-white border border-slate-200 rounded-lg"
        />
        </div>
        <input
        type="text"
        value={catDescRu}
        onChange={(e) => setCatDescRu(e.target.value)}
        placeholder="Описание (RU)"
        className="w-full h-9 px-3 text-sm bg-white border border-slate-200 rounded-lg"
        />
        <input
        type="text"
        value={catSchemaInput}
        onChange={(e) => setCatSchemaInput(e.target.value)}
        placeholder="Schema key:Label"
        className="w-full h-9 px-3 text-sm bg-white border border-slate-200 rounded-lg font-mono"
        />
        <ImagePickerField
        label="Обложка категории (необязательно)"
        value={catImage}
        allowClear
        onChange={setCatImage}
        />
        <div className="flex justify-end gap-2">
        <button
        type="button"
        onClick={() => setShowAddCategory(false)}
        className="px-4 py-2 text-xs bg-white border border-slate-200 rounded-lg"
        >
        {copy.cancelBtn}
        </button>
        <button
        type="submit"
        className="px-4 py-2 text-xs font-semibold text-white bg-[#0057B8] rounded-lg"
        >
        {copy.saveBtn}
        </button>
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
          <button
          key={l}
          type="button"
          onClick={() => setEditLang(l)}
          className={`px-2 py-0.5 text-xs font-semibold rounded ${
            editLang === l ? 'bg-[#0057B8] text-white' : 'text-slate-600'
          }`}
          >
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
            description: {
              ...editingCategory.description,
              [editLang]: e.target.value,
            },
          })
        }
        className="h-9 px-3 text-sm bg-white border border-slate-200 rounded-lg"
        />
        </div>
        <ImagePickerField
        label="Изображение категории (необязательно)"
        value={editingCategory.image || ''}
        allowClear
        onChange={(url) =>
          setEditingCategory({ ...editingCategory, image: url || undefined })
        }
        />
        <div className="flex justify-end gap-2">
        <button
        type="button"
        onClick={() => setEditingCategory(null)}
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
        <td className="py-3 px-4 font-medium text-slate-900">
        <div className="flex items-center gap-2.5">
        {cat.image && (
          <img
          src={cat.image}
          alt=""
          className="w-8 h-8 rounded object-cover border border-slate-200 shrink-0"
          />
        )}
        <span>{localize(cat.name)}</span>
        </div>
        </td>
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

    {/* TAB: NEWS CMS */}
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
        <form
        onSubmit={handleCreateNews}
        className="border border-slate-200 rounded-xl p-5 bg-slate-50 space-y-4"
        >
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="sm:col-span-2">
        <label className="block text-xs font-medium text-slate-700 mb-1">
        Title (RU) *
        </label>
        <input
        type="text"
        required
        value={newsTitleRu}
        onChange={(e) => setNewsTitleRu(e.target.value)}
        className="w-full h-9 px-3 text-sm bg-white border border-slate-200 rounded-lg"
        />
        </div>
        <div>
        <label className="block text-xs font-medium text-slate-700 mb-1">
        Title (EN)
        </label>
        <input
        type="text"
        value={newsTitleEn}
        onChange={(e) => setNewsTitleEn(e.target.value)}
        className="w-full h-9 px-3 text-sm bg-white border border-slate-200 rounded-lg"
        />
        </div>
        <div className="grid grid-cols-2 gap-2">
        <div>
        <label className="block text-xs font-medium text-slate-700 mb-1">
        {copy.colCategory}
        </label>
        <select
        value={newsCat}
        onChange={(e) => setNewsCat(e.target.value as NewsArticle['categoryId'])}
        className="w-full h-9 px-2 text-xs bg-white border border-slate-200 rounded-lg"
        >
        <option value="company">Company</option>
        <option value="export">Export</option>
        <option value="products">Products</option>
        <option value="awards">Awards</option>
        </select>
        </div>
        <div>
        <label className="block text-xs font-medium text-slate-700 mb-1">Date</label>
        <input
        type="date"
        value={newsDate}
        onChange={(e) => setNewsDate(e.target.value)}
        className="w-full h-9 px-2 text-xs bg-white border border-slate-200 rounded-lg"
        />
        </div>
        </div>
        </div>

        <div>
        <label className="block text-xs font-medium text-slate-700 mb-1">
        Excerpt / Анонс (RU)
        </label>
        <textarea
        rows={2}
        value={newsExcerptRu}
        onChange={(e) => setNewsExcerptRu(e.target.value)}
        className="w-full p-2.5 text-sm bg-white border border-slate-200 rounded-lg"
        />
        </div>

        <div>
        <label className="block text-xs font-medium text-slate-700 mb-1">
        Content / Полный текст статьи (RU)
        </label>
        <textarea
        rows={3}
        value={newsContentRu}
        onChange={(e) => setNewsContentRu(e.target.value)}
        className="w-full p-2.5 text-sm bg-white border border-slate-200 rounded-lg"
        />
        </div>

        <ImagePickerField
        label="Обложка новости (загрузка, URL или из галереи)"
        value={newsImage}
        onChange={setNewsImage}
        />

        <div className="flex justify-end gap-2">
        <button
        type="button"
        onClick={() => setShowAddNews(false)}
        className="px-4 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg"
        >
        {copy.cancelBtn}
        </button>
        <button
        type="submit"
        className="px-4 py-2 text-xs font-semibold text-white bg-[#0057B8] rounded-lg"
        >
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
        <h3 className="font-semibold text-sm text-slate-900">
        {localize(editingNews.title)}
        </h3>
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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
        <label className="block text-xs font-medium text-slate-700 mb-1">
        SEO Title ({editLang.toUpperCase()})
        </label>
        <input
        type="text"
        value={editingNews.seo.title[editLang] || ''}
        onChange={(e) =>
          setEditingNews({
            ...editingNews,
            seo: {
              ...editingNews.seo,
              title: { ...editingNews.seo.title, [editLang]: e.target.value },
            },
          })
        }
        className="w-full h-9 px-3 text-sm bg-white border border-slate-200 rounded-lg"
        />
        </div>
        <div>
        <label className="block text-xs font-medium text-slate-700 mb-1">
        SEO Description ({editLang.toUpperCase()})
        </label>
        <input
        type="text"
        value={editingNews.seo.description[editLang] || ''}
        onChange={(e) =>
          setEditingNews({
            ...editingNews,
            seo: {
              ...editingNews.seo,
              description: {
                ...editingNews.seo.description,
                [editLang]: e.target.value,
              },
            },
          })
        }
        className="w-full h-9 px-3 text-sm bg-white border border-slate-200 rounded-lg"
        />
        </div>
        </div>

        <ImagePickerField
        label="Обложка новости"
        value={editingNews.image}
        onChange={(url) => setEditingNews({ ...editingNews, image: url })}
        />

        <div className="flex justify-end gap-2">
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
        <td className="py-3 px-4">
        <div className="flex items-center gap-3">
        <img
        src={item.image}
        alt=""
        className="w-12 h-8 rounded object-cover border border-slate-200 bg-slate-50 shrink-0"
        />
        <span className="font-medium text-slate-900">{localize(item.title)}</span>
        </div>
        </td>
        <td className="py-3 px-4 text-xs font-mono text-slate-500">{item.date}</td>
        <td className="py-3 px-4 text-xs">
        <span
        className={item.published ? 'text-[#0057B8] font-medium' : 'text-slate-400'}
        >
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
        {item.published ? (
          <Eye className="w-4 h-4" />
        ) : (
          <EyeOff className="w-4 h-4" />
        )}
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

    {/* TAB: CONTACTS & MAP LOCATIONS */}
    {activeTab === 'contacts' && <AdminContactsTab />}

    {/* TAB: FOOTER */}
    {activeTab === 'footer' && (
      <AdminFooterTab onJumpToContacts={() => setActiveTab('contacts')} />
    )}

    {/* TAB: 301 REDIRECTS */}
    {activeTab === 'redirects' && (
      <div className="space-y-6">
      <form
      onSubmit={handleCreateRedirect}
      className="border border-slate-200 rounded-xl p-5 bg-slate-50 grid grid-cols-1 sm:grid-cols-4 gap-3 items-end"
      >
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
      <button
      type="submit"
      className="h-9 px-4 text-xs font-semibold text-white bg-[#0057B8] rounded-lg"
      >
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
        <td className="py-2.5 px-4 font-mono font-semibold text-[#0057B8]">
        {rule.code}
        </td>
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

    {/* TAB: TRANSLATIONS & LANGUAGE COMPLETENESS */}
    {activeTab === 'translations' && (
      <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {completenessStats.map((stat) => (
        <div
        key={stat.lang}
        className="border border-slate-200 rounded-xl p-4 bg-white space-y-2"
        >
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
    </div>
  );
};

export const Admin: React.FC = () => {
  return (
    <StaffAuthGate>
    <AdminDashboard />
    </StaffAuthGate>
  );
};
