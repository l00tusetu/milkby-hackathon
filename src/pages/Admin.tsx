import React, { useState, useMemo } from 'react';
import { Plus, Eye, EyeOff, Trash2, RotateCcw, Edit3, Check } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { useCatalogStore } from '../hooks/useCatalogStore';
import { ASSETS } from '../data/assets';
import { Language, NewsArticle, Product } from '../types';
import { SeoHead } from '../components/SeoHead';

export const Admin: React.FC = () => {
  const { language, localize, t, translations, updateTranslation, resetTranslations } = useLanguage();
  const {
    products,
    categories,
    news,
    addProduct,
    updateProduct,
    toggleProductVisibility,
    deleteProduct,
    addNews,
    toggleNewsPublished,
    deleteNews,
    resetDemoData,
  } = useCatalogStore();

  const [activeTab, setActiveTab] = useState<'products' | 'news' | 'translations'>('products');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showAddNews, setShowAddNews] = useState(false);

  // Add Product Form State
  const [newNameRu, setNewNameRu] = useState('');
  const [newNameEn, setNewNameEn] = useState('');
  const [newCategory, setNewCategory] = useState('cheese');
  const [newFat, setNewFat] = useState('45');
  const [newProtein, setNewProtein] = useState('20');
  const [newDescRu, setNewDescRu] = useState('');
  const [newWeight, setNewWeight] = useState('250 г');
  const [newShelfLife, setNewShelfLife] = useState('30 суток');
  const [newSeoTitle, setNewSeoTitle] = useState('');

  // Add News Form State
  const [newsTitleRu, setNewsTitleRu] = useState('');
  const [newsExcerptRu, setNewsExcerptRu] = useState('');
  const [newsCat, setNewsCat] = useState<NewsArticle['categoryId']>('company');

  // Translation Completeness Audit across RU / BE / EN / ZH
  const completenessStats = useMemo(() => {
    const langs: Language[] = ['ru', 'be', 'en', 'zh'];
    return langs.map((lang) => {
      let total = 0;
      let filled = 0;
      for (const p of products) {
        total += 2;
        if (p.name[lang]?.trim()) filled++;
        if (p.description[lang]?.trim()) filled++;
      }
      for (const n of news) {
        total += 2;
        if (n.title[lang]?.trim()) filled++;
        if (n.excerpt[lang]?.trim()) filled++;
      }
      for (const key of Object.keys(translations)) {
        total += 1;
        if (translations[key]?.[lang]?.trim()) filled++;
      }
      const pct = total > 0 ? Math.round((filled / total) * 100) : 100;
      return { lang, filled, total, pct };
    });
  }, [products, news, translations]);

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNameRu.trim()) return;
    const slugBase = `custom-${Date.now().toString(36)}`;
    const product: Product = {
      id: slugBase,
      slug: slugBase,
      category: newCategory,
      subcategory: categories.find((c) => c.id === newCategory)?.subcategories[0]?.id || 'default',
      name: {
        ru: newNameRu.trim(),
        be: newNameRu.trim(),
        en: newNameEn.trim() || newNameRu.trim(),
        zh: newNameEn.trim() || newNameRu.trim(),
      },
      description: {
        ru: newDescRu.trim() || 'Новый продукт в каталоге ОАО «Молочный Мир».',
        be: newDescRu.trim() || 'Новы прадукт у каталогу ААТ «Малочны Мір».',
        en: newDescRu.trim() || 'New dairy product in Molochny Mir catalog.',
        zh: newDescRu.trim() || 'Molochny Mir 目录新品。',
      },
      image: ASSETS.productAgedCheese,
      fatContent: Number(newFat) || 0,
      proteinContent: Number(newProtein) || 0,
      lactoseFree: false,
      exportReady: true,
      featured: true,
      visible: true,
      packages: [
        {
          id: `${slugBase}-pkg`,
          weight: newWeight.trim() || '250 г',
          weightGrams: 250,
          shelfLife: { ru: newShelfLife, be: newShelfLife, en: newShelfLife, zh: newShelfLife },
          storage: { ru: '+2…+6 °C', be: '+2…+6 °C', en: '+2…+6 °C', zh: '+2…+6 °C' },
          packagingType: { ru: 'Герметичная упаковка', be: 'Герметычная ўпакоўка', en: 'Sealed pack', zh: '密封包装' },
          unitsPerBox: 12,
          gtin: '4810268099999',
        },
      ],
      characteristics: {
        milkBase: { ru: 'Коровье молоко', be: 'Каровіна малако', en: 'Cow milk', zh: '鲜牛奶' },
      },
      useCases: ['daily'],
      relatedIds: ['mozzarella'],
      seo: {
        title: {
          ru: newSeoTitle.trim() || `${newNameRu.trim()} — Молочный Мир`,
          be: `${newNameRu.trim()} — Малочны Мір`,
          en: `${newNameEn.trim() || newNameRu.trim()} — Molochny Mir`,
          zh: `${newNameEn.trim() || newNameRu.trim()} — Molochny Mir`,
        },
        description: {
          ru: newDescRu.trim() || `${newNameRu.trim()} от ОАО «Молочный Мир».`,
          be: newDescRu.trim() || `${newNameRu.trim()} ад ААТ «Малочны Мір».`,
          en: newDescRu.trim() || `${newNameEn.trim() || newNameRu.trim()} by Molochny Mir.`,
          zh: newDescRu.trim() || `${newNameEn.trim() || newNameRu.trim()} — Molochny Mir.`,
        },
        h1: {
          ru: newNameRu.trim(),
          be: newNameRu.trim(),
          en: newNameEn.trim() || newNameRu.trim(),
          zh: newNameEn.trim() || newNameRu.trim(),
        },
      },
    };
    addProduct(product);
    setNewNameRu('');
    setNewNameEn('');
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
      title: {
        ru: newsTitleRu.trim(),
        be: newsTitleRu.trim(),
        en: newsTitleRu.trim(),
        zh: newsTitleRu.trim(),
      },
      excerpt: {
        ru: newsExcerptRu.trim() || 'Оперативное сообщение пресс-службы ОАО «Молочный Мир».',
        be: newsExcerptRu.trim() || 'Паведамленне прэс-службы ААТ «Малочны Мір».',
        en: newsExcerptRu.trim() || 'Corporate press update from Molochny Mir.',
        zh: newsExcerptRu.trim() || 'Molochny Mir 企业新闻通告。',
      },
      content: {
        ru: newsExcerptRu.trim() || newsTitleRu.trim(),
        be: newsExcerptRu.trim() || newsTitleRu.trim(),
        en: newsExcerptRu.trim() || newsTitleRu.trim(),
        zh: newsExcerptRu.trim() || newsTitleRu.trim(),
      },
      image: ASSETS.newsDairyFacility,
      published: true,
      relatedIds: [],
      seo: {
        title: {
          ru: `${newsTitleRu.trim()} — Новости Молочный Мир`,
          be: `${newsTitleRu.trim()} — Навіны Малочны Мір`,
          en: `${newsTitleRu.trim()} — Molochny Mir News`,
          zh: `${newsTitleRu.trim()} — Molochny Mir 新闻`,
        },
        description: {
          ru: newsExcerptRu.trim() || newsTitleRu.trim(),
          be: newsExcerptRu.trim() || newsTitleRu.trim(),
          en: newsExcerptRu.trim() || newsTitleRu.trim(),
          zh: newsExcerptRu.trim() || newsTitleRu.trim(),
        },
      },
    });
    setNewsTitleRu('');
    setNewsExcerptRu('');
    setShowAddNews(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
      <SeoHead
        title={`${t('adminTitle')} — ${t('brandName')}`}
        description="Административная панель для управления каталогом, фасовками, новостями, SEO и переводами."
        canonicalHash="/admin"
      />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-900">
            {t('adminTitle')}
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            {language === 'ru'
              ? 'Управление каталогом, фасовками, SEO-тегами, новостями и 4 языковыми версиями без участия программиста.'
              : 'No-code management for products, packaging variants, SEO metadata, newsroom, and 4-language translations.'}
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            resetDemoData();
            resetTranslations();
          }}
          className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors whitespace-nowrap shrink-0"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>{language === 'ru' ? 'Сбросить демо-данные' : 'Reset Demo Data'}</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="inline-flex items-center gap-1 p-1 bg-slate-100 rounded-lg border border-slate-200">
        <button
          type="button"
          onClick={() => setActiveTab('products')}
          className={`px-4 py-2 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
            activeTab === 'products' ? 'bg-white text-[#0057B8] shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          {language === 'ru' ? `Продукция (${products.length})` : `Products (${products.length})`}
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('news')}
          className={`px-4 py-2 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
            activeTab === 'news' ? 'bg-white text-[#0057B8] shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          {language === 'ru' ? `Новости (${news.length})` : `News (${news.length})`}
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('translations')}
          className={`px-4 py-2 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
            activeTab === 'translations' ? 'bg-white text-[#0057B8] shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          {language === 'ru' ? 'Языки и переводы' : 'Languages & Translations'}
        </button>
      </div>

      {/* TAB 1: PRODUCTS CMS */}
      {activeTab === 'products' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="font-display text-lg font-semibold text-slate-900">
              {language === 'ru' ? 'Позиции каталога' : 'Catalog Items'}
            </h2>
            <button
              type="button"
              onClick={() => setShowAddProduct((v) => !v)}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#0057B8] rounded-lg hover:bg-[#004494] transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>{language === 'ru' ? 'Добавить товар' : 'Add Product'}</span>
            </button>
          </div>

          {showAddProduct && (
            <form
              onSubmit={handleCreateProduct}
              className="border border-slate-200 rounded-xl p-5 bg-slate-50 space-y-4"
            >
              <h3 className="font-display text-base font-semibold text-slate-900">
                {language === 'ru' ? 'Новый товар' : 'Create Product'}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Название (RU) *</label>
                  <input
                    type="text"
                    required
                    value={newNameRu}
                    onChange={(e) => setNewNameRu(e.target.value)}
                    placeholder="Сыр Сулугуни"
                    className="w-full h-9 px-3 text-sm bg-white border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Name (EN)</label>
                  <input
                    type="text"
                    value={newNameEn}
                    onChange={(e) => setNewNameEn(e.target.value)}
                    placeholder="Suluguni Cheese"
                    className="w-full h-9 px-3 text-sm bg-white border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Категория</label>
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
                  <label className="block text-xs font-medium text-slate-700 mb-1">Жирность (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newFat}
                    onChange={(e) => setNewFat(e.target.value)}
                    className="w-full h-9 px-3 text-sm bg-white border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Белок (г/100 г)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newProtein}
                    onChange={(e) => setNewProtein(e.target.value)}
                    className="w-full h-9 px-3 text-sm bg-white border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Фасовка / Срок</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newWeight}
                      onChange={(e) => setNewWeight(e.target.value)}
                      placeholder="250 г"
                      className="w-1/2 h-9 px-3 text-sm bg-white border border-slate-200 rounded-lg"
                    />
                    <input
                      type="text"
                      value={newShelfLife}
                      onChange={(e) => setNewShelfLife(e.target.value)}
                      placeholder="30 суток"
                      className="w-1/2 h-9 px-3 text-sm bg-white border border-slate-200 rounded-lg"
                    />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Описание (RU)</label>
                  <input
                    type="text"
                    value={newDescRu}
                    onChange={(e) => setNewDescRu(e.target.value)}
                    className="w-full h-9 px-3 text-sm bg-white border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">SEO Title (RU)</label>
                  <input
                    type="text"
                    value={newSeoTitle}
                    onChange={(e) => setNewSeoTitle(e.target.value)}
                    placeholder="Уникальный SEO заголовок"
                    className="w-full h-9 px-3 text-sm bg-white border border-slate-200 rounded-lg"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddProduct(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-[#0057B8] rounded-lg"
                >
                  Сохранить в каталог
                </button>
              </div>
            </form>
          )}

          {editingProduct && (
            <form
              onSubmit={handleSaveEditProduct}
              className="border border-[#0057B8]/40 rounded-xl p-5 bg-blue-50/40 space-y-4"
            >
              <div className="flex justify-between items-center">
                <h3 className="font-display text-base font-semibold text-slate-900">
                  Редактирование: {localize(editingProduct.name)}
                </h3>
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="text-xs text-slate-500 hover:text-slate-900"
                >
                  Закрыть
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Название ({language.toUpperCase()})
                  </label>
                  <input
                    type="text"
                    value={editingProduct.name[language]}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        name: { ...editingProduct.name, [language]: e.target.value },
                      })
                    }
                    className="w-full h-9 px-3 text-sm bg-white border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    SEO Title ({language.toUpperCase()})
                  </label>
                  <input
                    type="text"
                    value={editingProduct.seo.title[language]}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        seo: {
                          ...editingProduct.seo,
                          title: { ...editingProduct.seo.title, [language]: e.target.value },
                        },
                      })
                    }
                    className="w-full h-9 px-3 text-sm bg-white border border-slate-200 rounded-lg"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    SEO Description ({language.toUpperCase()})
                  </label>
                  <input
                    type="text"
                    value={editingProduct.seo.description[language]}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        seo: {
                          ...editingProduct.seo,
                          description: {
                            ...editingProduct.seo.description,
                            [language]: e.target.value,
                          },
                        },
                      })
                    }
                    className="w-full h-9 px-3 text-sm bg-white border border-slate-200 rounded-lg"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#0057B8] rounded-lg"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Применить изменения</span>
                </button>
              </div>
            </form>
          )}

          <div className="border border-slate-200 rounded-xl overflow-x-auto bg-white">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600">
                  <th className="py-3 px-4">Товар</th>
                  <th className="py-3 px-4">Категория</th>
                  <th className="py-3 px-4">Фасовки</th>
                  <th className="py-3 px-4">Статус</th>
                  <th className="py-3 px-4 text-right">Действия</th>
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
                          {prod.visible
                            ? language === 'ru'
                              ? 'Опубликован'
                              : 'Visible'
                            : language === 'ru'
                            ? 'Скрыт'
                            : 'Hidden'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => setEditingProduct(prod)}
                            title="Edit"
                            className="p-1.5 rounded-md text-slate-600 hover:bg-slate-100 hover:text-[#0057B8]"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => toggleProductVisibility(prod.id)}
                            title={prod.visible ? 'Hide' : 'Show'}
                            className="p-1.5 rounded-md text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                          >
                            {prod.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteProduct(prod.id)}
                            title="Delete"
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

      {/* TAB 2: NEWS CMS */}
      {activeTab === 'news' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="font-display text-lg font-semibold text-slate-900">
              {language === 'ru' ? 'Публикации и новости' : 'Newsroom Items'}
            </h2>
            <button
              type="button"
              onClick={() => setShowAddNews((v) => !v)}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#0057B8] rounded-lg hover:bg-[#004494]"
            >
              <Plus className="w-4 h-4" />
              <span>{language === 'ru' ? 'Добавить новость' : 'Add News'}</span>
            </button>
          </div>

          {showAddNews && (
            <form
              onSubmit={handleCreateNews}
              className="border border-slate-200 rounded-xl p-5 bg-slate-50 space-y-4"
            >
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-slate-700 mb-1">Заголовок *</label>
                  <input
                    type="text"
                    required
                    value={newsTitleRu}
                    onChange={(e) => setNewsTitleRu(e.target.value)}
                    className="w-full h-9 px-3 text-sm bg-white border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Рубрика</label>
                  <select
                    value={newsCat}
                    onChange={(e) => setNewsCat(e.target.value as NewsArticle['categoryId'])}
                    className="w-full h-9 px-3 text-sm bg-white border border-slate-200 rounded-lg"
                  >
                    <option value="company">Компания</option>
                    <option value="export">Экспорт</option>
                    <option value="products">Продукция</option>
                    <option value="awards">Награды</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Краткий анонс</label>
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
                  Отмена
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-[#0057B8] rounded-lg"
                >
                  Опубликовать
                </button>
              </div>
            </form>
          )}

          <div className="border border-slate-200 rounded-xl overflow-x-auto bg-white">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600">
                  <th className="py-3 px-4">Заголовок</th>
                  <th className="py-3 px-4">Дата</th>
                  <th className="py-3 px-4">Статус</th>
                  <th className="py-3 px-4 text-right">Действия</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 tabular-nums">
                {news.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/70">
                    <td className="py-3 px-4 font-medium text-slate-900">{localize(item.title)}</td>
                    <td className="py-3 px-4 text-xs font-mono text-slate-500">{item.date}</td>
                    <td className="py-3 px-4 text-xs">
                      <span className={item.published ? 'text-[#0057B8] font-medium' : 'text-slate-400'}>
                        {item.published ? 'Опубликована' : 'Снята'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
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

      {/* TAB 3: TRANSLATIONS & LANGUAGE COMPLETENESS */}
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
                  <div
                    className="h-full bg-[#0057B8]"
                    style={{ width: `${stat.pct}%` }}
                  />
                </div>
                <div className="text-xs text-slate-500 tabular-nums">
                  {stat.filled} / {stat.total} полей заполнено
                </div>
              </div>
            ))}
          </div>

          <div className="border border-slate-200 rounded-xl overflow-x-auto bg-white">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 font-semibold text-slate-600">
                  <th className="py-3 px-4">Ключ интерфейса</th>
                  <th className="py-3 px-4">RU</th>
                  <th className="py-3 px-4">BE</th>
                  <th className="py-3 px-4">EN</th>
                  <th className="py-3 px-4">ZH</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {Object.entries(translations).slice(0, 12).map(([key, val]) => (
                  <tr key={key}>
                    <td className="py-2.5 px-4 font-mono text-slate-500">{key}</td>
                    {(['ru', 'be', 'en', 'zh'] as Language[]).map((lang) => (
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
        </div>
      )}
    </div>
  );
};
