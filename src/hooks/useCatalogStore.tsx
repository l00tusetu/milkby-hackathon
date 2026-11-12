import React, { createContext, useContext, useState, useCallback } from 'react';
import { Category, NewsArticle, Product } from '../types';
import { products as initialProducts } from '../data/products';
import { categories as initialCategories } from '../data/categories';
import { newsArticles as initialNews } from '../data/news';

interface CatalogStoreContextValue {
  products: Product[];
  categories: Category[];
  news: NewsArticle[];
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  toggleProductVisibility: (id: string) => void;
  deleteProduct: (id: string) => void;
  addCategory: (category: Category) => void;
  addNews: (article: NewsArticle) => void;
  updateNews: (article: NewsArticle) => void;
  toggleNewsPublished: (id: string) => void;
  deleteNews: (id: string) => void;
  resetDemoData: () => void;
}

const STORAGE_PRODUCTS_KEY = 'milk_world_products_v1';
const STORAGE_CATEGORIES_KEY = 'milk_world_categories_v1';
const STORAGE_NEWS_KEY = 'milk_world_news_v1';

const CatalogStoreContext = createContext<CatalogStoreContextValue | undefined>(undefined);

function loadStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw) as T;
  } catch {
    // ignore
  }
  return fallback;
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

  const persistProducts = useCallback((next: Product[]) => {
    setProducts(next);
    try {
      localStorage.setItem(STORAGE_PRODUCTS_KEY, JSON.stringify(next));
    } catch {
      // ignore
    }
  }, []);

  const persistCategories = useCallback((next: Category[]) => {
    setCategories(next);
    try {
      localStorage.setItem(STORAGE_CATEGORIES_KEY, JSON.stringify(next));
    } catch {
      // ignore
    }
  }, []);

  const persistNews = useCallback((next: NewsArticle[]) => {
    setNews(next);
    try {
      localStorage.setItem(STORAGE_NEWS_KEY, JSON.stringify(next));
    } catch {
      // ignore
    }
  }, []);

  const addProduct = useCallback(
    (product: Product) => {
      persistProducts([product, ...products]);
    },
    [products, persistProducts]
  );

  const updateProduct = useCallback(
    (updated: Product) => {
      persistProducts(products.map((p) => (p.id === updated.id ? updated : p)));
    },
    [products, persistProducts]
  );

  const toggleProductVisibility = useCallback(
    (id: string) => {
      persistProducts(products.map((p) => (p.id === id ? { ...p, visible: !p.visible } : p)));
    },
    [products, persistProducts]
  );

  const deleteProduct = useCallback(
    (id: string) => {
      persistProducts(products.filter((p) => p.id !== id));
    },
    [products, persistProducts]
  );

  const addCategory = useCallback(
    (category: Category) => {
      persistCategories([...categories, category]);
    },
    [categories, persistCategories]
  );

  const addNews = useCallback(
    (article: NewsArticle) => {
      persistNews([article, ...news]);
    },
    [news, persistNews]
  );

  const updateNews = useCallback(
    (updated: NewsArticle) => {
      persistNews(news.map((n) => (n.id === updated.id ? updated : n)));
    },
    [news, persistNews]
  );

  const toggleNewsPublished = useCallback(
    (id: string) => {
      persistNews(news.map((n) => (n.id === id ? { ...n, published: !n.published } : n)));
    },
    [news, persistNews]
  );

  const deleteNews = useCallback(
    (id: string) => {
      persistNews(news.filter((n) => n.id !== id));
    },
    [news, persistNews]
  );

  const resetDemoData = useCallback(() => {
    persistProducts(initialProducts);
    persistCategories(initialCategories);
    persistNews(initialNews);
  }, [persistProducts, persistCategories, persistNews]);

  return (
    <CatalogStoreContext.Provider
      value={{
        products,
        categories,
        news,
        addProduct,
        updateProduct,
        toggleProductVisibility,
        deleteProduct,
        addCategory,
        addNews,
        updateNews,
        toggleNewsPublished,
        deleteNews,
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
