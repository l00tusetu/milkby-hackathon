import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { Category, NewsArticle, Product, RedirectRule } from '../types';
import { products as initialProducts, legacyRedirects as initialRedirects } from '../data/products';
import { categories as initialCategories } from '../data/categories';
import { newsArticles as initialNews } from '../data/news';

interface CatalogStoreContextValue {
  products: Product[];
  categories: Category[];
  news: NewsArticle[];
  redirects: RedirectRule[];
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
  resetDemoData: () => void;
}

const STORAGE_PRODUCTS_KEY = 'milk_world_products_v1';
const STORAGE_CATEGORIES_KEY = 'milk_world_categories_v1';
const STORAGE_NEWS_KEY = 'milk_world_news_v1';
const STORAGE_REDIRECTS_KEY = 'milk_world_redirects_v1';

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

  const addProduct = useCallback((product: Product) => {
    setProducts((prev) => [product, ...prev]);
  }, []);

  const updateProduct = useCallback((updated: Product) => {
    setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
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
  }, []);

  const deleteProduct = useCallback((id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const addCategory = useCallback((category: Category) => {
    setCategories((prev) => [...prev, category]);
  }, []);

  const updateCategory = useCallback((updated: Category) => {
    setCategories((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
  }, []);

  const deleteCategory = useCallback((id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const addNews = useCallback((article: NewsArticle) => {
    setNews((prev) => [article, ...prev]);
  }, []);

  const updateNews = useCallback((updated: NewsArticle) => {
    setNews((prev) => prev.map((n) => (n.id === updated.id ? updated : n)));
  }, []);

  const toggleNewsPublished = useCallback((id: string) => {
    setNews((prev) =>
    prev.map((n) => (n.id === id ? { ...n, published: !n.published } : n))
    );
  }, []);

  const deleteNews = useCallback((id: string) => {
    setNews((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const addRedirect = useCallback((rule: RedirectRule) => {
    setRedirects((prev) => [rule, ...prev]);
  }, []);

  const updateRedirect = useCallback((index: number, rule: RedirectRule) => {
    setRedirects((prev) => prev.map((r, i) => (i === index ? rule : r)));
  }, []);

  const deleteRedirect = useCallback((index: number) => {
    setRedirects((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const resetDemoData = useCallback(() => {
    setProducts(initialProducts);
    setCategories(initialCategories);
    setNews(initialNews);
    setRedirects(initialRedirects);
  }, []);

  return (
    <CatalogStoreContext.Provider
    value={{
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
      updateRedirect,
      deleteRedirect,
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
