export type Language = 'ru' | 'be' | 'en' | 'zh';

export type LocalizedText = Record<Language, string>;

export interface PackageVariant {
  id: string;
  weight: string;
  weightGrams: number;
  shelfLife: LocalizedText;
  storage: LocalizedText;
  packagingType: LocalizedText;
  unitsPerBox: number;
  gtin: string;
}

export interface ProductSeo {
  title: LocalizedText;
  description: LocalizedText;
  h1: LocalizedText;
}

export interface Product {
  id: string;
  slug: string;
  category: string;
  subcategory: string;
  name: LocalizedText;
  description: LocalizedText;
  image: string;
  fatContent?: number | null;
  proteinContent?: number | null;
  lactoseFree?: boolean;
  exportReady?: boolean;
  featured?: boolean;
  visible: boolean;
  packages: PackageVariant[];
  characteristics: Record<string, LocalizedText>;
  useCases: string[];
  relatedIds: string[];
  seo: ProductSeo;
}

export interface CategorySubcategory {
  id: string;
  name: LocalizedText;
}

export interface CharacteristicField {
  key: string;
  label: LocalizedText;
}

export interface Category {
  id: string;
  slug: string;
  name: LocalizedText;
  description: LocalizedText;
  subcategories: CategorySubcategory[];
  filterKeys: ('fat' | 'lactoseFree' | 'highProtein' | 'exportReady')[];
  characteristicSchema: CharacteristicField[];
  seo: {
    title: LocalizedText;
    description: LocalizedText;
  };
}

export type NewsCategoryId = 'company' | 'export' | 'products' | 'awards';

export interface NewsArticle {
  id: string;
  slug: string;
  date: string;
  year: number;
  categoryId: NewsCategoryId;
  title: LocalizedText;
  excerpt: LocalizedText;
  content: LocalizedText;
  image: string;
  published: boolean;
  relatedIds: string[];
  seo: {
    title: LocalizedText;
    description: LocalizedText;
  };
}

export interface RedirectRule {
  id?: number;
  from: string;
  to: string;
  code: 301;
  note: string;
}

export interface B2BInquiry {
  id?: string;
  company: string;
  contactName: string;
  email: string;
  phone: string;
  country: string;
  productId?: string | null;
  packageId?: string | null;
  volume: string;
  message: string;
  channel: 'export' | 'wholesale' | 'general';
  language?: Language;
  status?: string;
  createdAt?: string;
}

export interface ProductListResponse {
  items: Product[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface SmartCriterion {
  id: string;
  label: string;
}

export interface SmartMatchResult {
  product: Product;
  score: number;
  reasons: string[];
  recommendedPackage?: PackageVariant | null;
}

export interface SmartSelectResponse {
  query: string;
  correctedQuery?: string | null;
  mode: 'llm+db' | 'nlp+db';
  criteria: SmartCriterion[];
  results: SmartMatchResult[];
}

export interface AutocompleteSuggestion {
  id: string;
  slug: string;
  name: LocalizedText;
  category: string;
  categoryName: LocalizedText;
  image: string;
  fatContent?: number | null;
  recommendedPackage?: PackageVariant | null;
}

export interface AutocompleteResponse {
  query: string;
  correctedQuery?: string | null;
  criteria: SmartCriterion[];
  suggestions: AutocompleteSuggestion[];
  totalMatches: number;
}

export interface BulkImportResult {
  created: number;
  updated: number;
  skipped: number;
  errors: string[];
}

export interface SeoAudit {
  totalProducts: number;
  uniqueTitlesByLang: Record<string, number>;
  duplicateTitlesByLang: Record<string, string[]>;
  totalNews: number;
  totalRedirects: number;
  sitemapUrlCount: number;
}

export interface BootstrapPayload {
  categories: Category[];
  products: Product[];
  news: NewsArticle[];
  redirects: RedirectRule[];
  translations: Record<string, LocalizedText>;
}
