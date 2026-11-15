import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import {
  Category,
  DirectoryEntry,
  LocalizedText,
  NewsArticle,
  PlantLocation,
  Product,
  RedirectRule,
  SiteSettings,
  TeamMember,
} from '../types';
import { products as initialProducts, legacyRedirects as initialRedirects } from '../data/products';
import { categories as initialCategories } from '../data/categories';
import { newsArticles as initialNews } from '../data/news';
import {
  defaultDirectoryEntries,
  defaultLocations,
  defaultSiteSettings,
  defaultTeamMembers,
} from '../data/siteContent';

interface CatalogStoreContextValue {
  products: Product[];
  categories: Category[];
  news: NewsArticle[];
  redirects: RedirectRule[];
  siteSettings: SiteSettings;
  teamMembers: TeamMember[];
  directoryEntries: DirectoryEntry[];
  locations: PlantLocation[];
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
  updateSiteSettings: (
    next: SiteSettings | ((prev: SiteSettings) => SiteSettings)
  ) => void;
  addTeamMember: (member: TeamMember) => void;
  updateTeamMember: (member: TeamMember) => void;
  toggleTeamMemberVisibility: (id: string) => void;
  moveTeamMember: (id: string, direction: 'up' | 'down') => void;
  deleteTeamMember: (id: string) => void;
  addDirectoryEntry: (entry: DirectoryEntry) => void;
  updateDirectoryEntry: (entry: DirectoryEntry) => void;
  toggleDirectoryEntryVisibility: (id: string) => void;
  deleteDirectoryEntry: (id: string) => void;
  addLocation: (location: PlantLocation) => void;
  updateLocation: (location: PlantLocation) => void;
  deleteLocation: (id: string) => void;
  resetDemoData: () => void;
}

const STORAGE_PRODUCTS_KEY = 'milk_world_products_v3';
const STORAGE_CATEGORIES_KEY = 'milk_world_categories_v3';
const STORAGE_NEWS_KEY = 'milk_world_news_v2';
const STORAGE_REDIRECTS_KEY = 'milk_world_redirects_v3';
const STORAGE_SITE_SETTINGS_KEY = 'milk_world_site_settings_v2';
const STORAGE_TEAM_KEY = 'milk_world_team_v2';
const STORAGE_CONTACTS_KEY = 'milk_world_contacts_v2';
const STORAGE_LOCATIONS_KEY = 'milk_world_locations_v2';

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

function loadSiteSettings(): SiteSettings {
  try {
    const raw = localStorage.getItem(STORAGE_SITE_SETTINGS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<SiteSettings>;
      return {
        homeHero: { ...defaultSiteSettings.homeHero, ...(parsed.homeHero || {}) },
        promoBanner: { ...defaultSiteSettings.promoBanner, ...(parsed.promoBanner || {}) },
        teamSection: { ...defaultSiteSettings.teamSection, ...(parsed.teamSection || {}) },
        contactMeta: { ...defaultSiteSettings.contactMeta, ...(parsed.contactMeta || {}) },
        footer: { ...defaultSiteSettings.footer, ...(parsed.footer || {}) },
      };
    }
  } catch {
    // ignore storage errors
  }
  return defaultSiteSettings;
}

function saveStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore storage errors
  }
}

function mergeLocalizedText(
  saved: LocalizedText | undefined,
  defaults: LocalizedText
): LocalizedText {
  const merged = { ...defaults, ...(saved || {}) };
  const sourceRu = saved?.ru || defaults.ru;

  for (const language of ['be', 'en', 'zh'] as const) {
    if (!merged[language] || merged[language] === sourceRu) {
      merged[language] = defaults[language];
    }
  }

  return merged;
}

function loadProducts(): Product[] {
  const storedProducts = loadStorage(STORAGE_PRODUCTS_KEY, initialProducts);
  const initialProductsById = new Map(initialProducts.map((product) => [product.id, product]));

  return storedProducts.map((product) => {
    const defaults = initialProductsById.get(product.id);
    if (!defaults) return product;

    return {
      ...product,
      name: mergeLocalizedText(product.name, defaults.name),
      description: mergeLocalizedText(product.description, defaults.description),
      seo: {
        ...product.seo,
        title: mergeLocalizedText(product.seo?.title, defaults.seo.title),
        description: mergeLocalizedText(product.seo?.description, defaults.seo.description),
        h1: mergeLocalizedText(product.seo?.h1, defaults.seo.h1),
      },
    };
  });
}

export const CatalogStoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(() =>
  loadProducts()
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
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(loadSiteSettings);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(() =>
  loadStorage(STORAGE_TEAM_KEY, defaultTeamMembers)
  );
  const [directoryEntries, setDirectoryEntries] = useState<DirectoryEntry[]>(() =>
  loadStorage(STORAGE_CONTACTS_KEY, defaultDirectoryEntries)
  );
  const [locations, setLocations] = useState<PlantLocation[]>(() =>
  loadStorage(STORAGE_LOCATIONS_KEY, defaultLocations)
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

  useEffect(() => {
    saveStorage(STORAGE_SITE_SETTINGS_KEY, siteSettings);
  }, [siteSettings]);

  useEffect(() => {
    saveStorage(STORAGE_TEAM_KEY, teamMembers);
  }, [teamMembers]);

  useEffect(() => {
    saveStorage(STORAGE_CONTACTS_KEY, directoryEntries);
  }, [directoryEntries]);

  useEffect(() => {
    saveStorage(STORAGE_LOCATIONS_KEY, locations);
  }, [locations]);

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

  const updateSiteSettings = useCallback(
    (next: SiteSettings | ((prev: SiteSettings) => SiteSettings)) => {
      setSiteSettings((prev) => (typeof next === 'function' ? next(prev) : next));
    },
    []
  );

  const addTeamMember = useCallback((member: TeamMember) => {
    setTeamMembers((prev) => [member, ...prev]);
  }, []);

  const updateTeamMember = useCallback((updated: TeamMember) => {
    setTeamMembers((prev) => prev.map((m) => (m.id === updated.id ? updated : m)));
  }, []);

  const toggleTeamMemberVisibility = useCallback((id: string) => {
    setTeamMembers((prev) =>
    prev.map((m) => (m.id === id ? { ...m, visible: !m.visible } : m))
    );
  }, []);

  const moveTeamMember = useCallback((id: string, direction: 'up' | 'down') => {
    setTeamMembers((prev) => {
      const idx = prev.findIndex((m) => m.id === id);
      if (idx === -1) return prev;
      const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
      if (targetIdx < 0 || targetIdx >= prev.length) return prev;
      const copy = [...prev];
      const [item] = copy.splice(idx, 1);
      copy.splice(targetIdx, 0, item);
      return copy;
    });
  }, []);

  const deleteTeamMember = useCallback((id: string) => {
    setTeamMembers((prev) => prev.filter((m) => m.id !== id));
  }, []);

  const addDirectoryEntry = useCallback((entry: DirectoryEntry) => {
    setDirectoryEntries((prev) => [entry, ...prev]);
  }, []);

  const updateDirectoryEntry = useCallback((updated: DirectoryEntry) => {
    setDirectoryEntries((prev) => prev.map((e) => (e.id === updated.id ? updated : e)));
  }, []);

  const toggleDirectoryEntryVisibility = useCallback((id: string) => {
    setDirectoryEntries((prev) =>
    prev.map((e) => (e.id === id ? { ...e, visible: !e.visible } : e))
    );
  }, []);

  const deleteDirectoryEntry = useCallback((id: string) => {
    setDirectoryEntries((prev) => prev.filter((e) => e.id !== id));
  }, []);

  const addLocation = useCallback((location: PlantLocation) => {
    setLocations((prev) => [...prev, location]);
  }, []);

  const updateLocation = useCallback((updated: PlantLocation) => {
    setLocations((prev) => prev.map((l) => (l.id === updated.id ? updated : l)));
  }, []);

  const deleteLocation = useCallback((id: string) => {
    setLocations((prev) => prev.filter((l) => l.id !== id));
  }, []);

  const resetDemoData = useCallback(() => {
    setProducts(initialProducts);
    setCategories(initialCategories);
    setNews(initialNews);
    setRedirects(initialRedirects);
    setSiteSettings(defaultSiteSettings);
    setTeamMembers(defaultTeamMembers);
    setDirectoryEntries(defaultDirectoryEntries);
    setLocations(defaultLocations);
  }, []);

  return (
    <CatalogStoreContext.Provider
    value={{
      products,
      categories,
      news,
      redirects,
      siteSettings,
      teamMembers,
      directoryEntries,
      locations,
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
      updateSiteSettings,
      addTeamMember,
      updateTeamMember,
      toggleTeamMemberVisibility,
      moveTeamMember,
      deleteTeamMember,
      addDirectoryEntry,
      updateDirectoryEntry,
      toggleDirectoryEntryVisibility,
      deleteDirectoryEntry,
      addLocation,
      updateLocation,
      deleteLocation,
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
