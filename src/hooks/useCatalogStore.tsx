import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { B2BInquiry, Category, NewsArticle, Product, RedirectRule } from '../types';
import { products as initialProducts, legacyRedirects as initialRedirects } from '../data/products';
import { categories as initialCategories } from '../data/categories';
import { newsArticles as initialNews } from '../data/news';
import { apiClient } from '../utils/apiClient';
import { useLanguage } from './useLanguage';

interface CatalogStoreContextValue {
  products: Product[];
  categories: Category[];
  news: NewsArticle[];
  redirects: RedirectRule[];
  inquiries: B2BInquiry[];
  apiConnected: boolean;
  loading: boolean;
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  importProducts: (items: Product[]) => void;
  toggleProductVisibility: (id: string) => void;
  deleteProduct: (id: string) => void;
  addCategory: (category: Category) => void;
  updateCategory: (category: Category) => void;
  deleteCategory: (id: string) => void;
  addNews: (article: NewsArticle) => void;
  updateNews: (article: NewsArticle) => void;
  toggleNewsPublished: (id: string) => void;
  deleteNews: (id: string) => void;
  addRedirect: (rule: RedirectRule) => void;
  updateRedirect: (index: number, rule: RedirectRule) => void;
  deleteRedirect: (index: number) => void;
  refreshFromServer: () => Promise<void>;
  refreshInquiries: () => Promise<void>;
  resetDemoData: () => void;
}

const STORAGE_PRODUCTS_KEY = 'milk_world_products_v2';
const STORAGE_CATEGORIES_KEY = 'milk_world_categories_v2';
const STORAGE_NEWS_KEY = 'milk_world_news_v2';
const STORAGE_REDIRECTS_KEY = 'milk_world_redirects_v2';

const CatalogStoreContext = createContext<CatalogStoreContextValue | undefined>(undefined);

function loadStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw) as T;
  } catch {
    // ignore storage errors
  }
  return fallback;
}

function saveStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore storage errors
  }
}

export const CatalogStoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { hydrateTranslations } = useLanguage();
  const [apiConnected, setApiConnected] = useState(false);
  const [loading, setLoading] = useState(true);

  const [products, setProducts] = useState<Product[]>(() =>
    loadStorage(STORAGE_PRODUCTS_KEY, initialProducts)
  );
  const [categories, setCategories] = useState<Category[]>(() =>
    loadStorage(STORAGE_CATEGORIES_KEY, initialCategories)
  );
  const [news, setNews] = useState<NewsArticle[]>(() =>
    loadStorage(STORAGE_NEWS_KEY, initialNews)
  );
  const [redirects, setRedirects] = useState<RedirectRule[]>(() =>
    loadStorage(STORAGE_REDIRECTS_KEY, initialRedirects)
  );
  const [inquiries, setInquiries] = useState<B2BInquiry[]>([]);

  const refreshFromServer = useCallback(async () => {
    try {
      const data = await apiClient.getBootstrap();
      setCategories(data.categories);
      setProducts(data.products);
      setNews(data.news);
      setRedirects(data.redirects);
      hydrateTranslations(data.translations);
      setApiConnected(true);
    } catch {
      setApiConnected(false);
    } finally {
      setLoading(false);
    }
  }, [hydrateTranslations]);

  useEffect(() => {
    refreshFromServer();
  }, [refreshFromServer]);

  useEffect(() => {
    saveStorage(STORAGE_PRODUCTS_KEY, products);
  }, [products]);

  useEffect(() => {
    saveStorage(STORAGE_CATEGORIES_KEY, categories);
  }, [categories]);

  useEffect(() => {
    saveStorage(STORAGE_NEWS_KEY, news);
  }, [news]);

  useEffect(() => {
    saveStorage(STORAGE_REDIRECTS_KEY, redirects);
  }, [redirects]);

  const refreshInquiries = useCallback(async () => {
    try {
      const list = await apiClient.listInquiries();
      setInquiries(list);
    } catch {
      // ignore offline
    }
  }, []);

  const addProduct = useCallback((product: Product) => {
    setProducts((prev) => [product, ...prev]);
    apiClient.createProduct(product).then((saved) => {
      setProducts((prev) => prev.map((p) => (p.id === saved.id ? saved : p)));
    }).catch(() => {});
  }, []);

  const updateProduct = useCallback((updated: Product) => {
    setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    apiClient.updateProduct(updated).then((saved) => {
      setProducts((prev) => prev.map((p) => (p.id === saved.id ? saved : p)));
    }).catch(() => {});
  }, []);

  const importProducts = useCallback((items: Product[]) => {
    setProducts((prev) => {
      const map = new Map(prev.map((p) => [p.id, p]));
      for (const item of items) {
        map.set(item.id, item);
      }
      return Array.from(map.values());
    });
  }, []);

  const toggleProductVisibility = useCallback((id: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, visible: !p.visible } : p))
    );
    apiClient.toggleProductVisibility(id).catch(() => {});
  }, []);

  const deleteProduct = useCallback((id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    apiClient.deleteProduct(id).catch(() => {});
  }, []);

  const addCategory = useCallback((category: Category) => {
    setCategories((prev) => [...prev, category]);
    apiClient.createCategory(category).catch(() => {});
  }, []);

  const updateCategory = useCallback((updated: Category) => {
    setCategories((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
    apiClient.updateCategory(updated).catch(() => {});
  }, []);

  const deleteCategory = useCallback((id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
    apiClient.deleteCategory(id).catch(() => {});
  }, []);

  const addNews = useCallback((article: NewsArticle) => {
    setNews((prev) => [article, ...prev]);
    apiClient.createNews(article).catch(() => {});
  }, []);

  const updateNews = useCallback((updated: NewsArticle) => {
    setNews((prev) => prev.map((n) => (n.id === updated.id ? updated : n)));
    apiClient.updateNews(updated).catch(() => {});
  }, []);

  const toggleNewsPublished = useCallback((id: string) => {
    setNews((prev) =>
      prev.map((n) => (n.id === id ? { ...n, published: !n.published } : n))
    );
    apiClient.toggleNewsPublished(id).catch(() => {});
  }, []);

  const deleteNews = useCallback((id: string) => {
    setNews((prev) => prev.filter((n) => n.id !== id));
    apiClient.deleteNews(id).catch(() => {});
  }, []);

  const addRedirect = useCallback((rule: RedirectRule) => {
    setRedirects((prev) => [rule, ...prev]);
    apiClient.createRedirect(rule).then((saved) => {
      setRedirects((prev) => [saved, ...prev.filter((r) => r.from !== saved.from)]);
    }).catch(() => {});
  }, []);

  const updateRedirect = useCallback((index: number, rule: RedirectRule) => {
    setRedirects((prev) => prev.map((r, i) => (i === index ? rule : r)));
  }, []);

  const deleteRedirect = useCallback((index: number) => {
    setRedirects((prev) => {
      const target = prev[index];
      if (target?.id !== undefined) {
        apiClient.deleteRedirect(target.id).catch(() => {});
      }
      return prev.filter((_, i) => i !== index);
    });
  }, []);

  const resetDemoData = useCallback(() => {
    setProducts(initialProducts);
    setCategories(initialCategories);
    setNews(initialNews);
    setRedirects(initialRedirects);
    apiClient.resetDemo().then(() => refreshFromServer()).catch(() => {});
  }, [refreshFromServer]);

  return (
    <CatalogStoreContext.Provider
      value={{
        products,
        categories,
        news,
        redirects,
        inquiries,
        apiConnected,
        loading,
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
        updateRedirect,
        deleteRedirect,
        refreshFromServer,
        refreshInquiries,
        resetDemoData,
      }}
    >
      {children}
    </CatalogStoreContext.Provider>
  );
};

export function useCatalogStore(): CatalogStoreContextValue {
  const ctx = useContext(CatalogStoreContext);
  if (!ctx) {
    throw new Error('useCatalogStore must be used within a CatalogStoreProvider');
  }
  return ctx;
}
