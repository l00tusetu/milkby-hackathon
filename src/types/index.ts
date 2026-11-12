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
  fatContent?: number;
  proteinContent?: number;
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
  from: string;
  to: string;
  code: 301;
  note: string;
}

export interface B2BInquiry {
  company: string;
  contactName: string;
  email: string;
  phone: string;
  country: string;
  productId?: string;
  packageId?: string;
  volume: string;
  message: string;
  channel: 'export' | 'wholesale' | 'general';
}
