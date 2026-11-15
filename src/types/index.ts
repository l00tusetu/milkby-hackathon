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
  gallery?: string[];
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
  image?: string;
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

export interface TeamMember {
  id: string;
  initials: string;
  accentClass: string;
  photo?: string;
  channel: 'export' | 'wholesale' | 'general';
  email: string;
  phone: string;
  visible: boolean;
  name: LocalizedText;
  role: LocalizedText;
  bio: LocalizedText;
}

export type DirectoryGroup = 'sales' | 'management' | 'departments' | 'branches';

export interface DirectoryPhone {
  label?: LocalizedText;
  number: string;
}

export interface DirectoryEntry {
  id: string;
  group: DirectoryGroup;
  visible: boolean;
  title: LocalizedText;
  person?: LocalizedText;
  address?: LocalizedText;
  note?: LocalizedText;
  phones: DirectoryPhone[];
  emails?: { label?: string; address: string }[];
  website?: string;
}

export interface PlantLocation {
  id: string;
  xPercent: number;
  yPercent: number;
  coords: string;
  phone: string;
  visible: boolean;
  city: LocalizedText;
  address: LocalizedText;
  focus: LocalizedText;
  hours: LocalizedText;
}

export type PromoBannerTheme = 'brand' | 'slate' | 'light';

export interface SiteSettings {
  homeHero: {
    title: LocalizedText;
    subtitle: LocalizedText;
    primaryCta: LocalizedText;
    secondaryCta: LocalizedText;
    image: string;
    seoTitle: LocalizedText;
    seoDescription: LocalizedText;
  };
  promoBanner: {
    enabled: boolean;
    theme: PromoBannerTheme;
    badge: LocalizedText;
    extra: LocalizedText;
    title: LocalizedText;
    lead: LocalizedText;
    secondaryCtaLabel: LocalizedText;
    secondaryCtaTo: string;
    primaryCtaLabel: LocalizedText;
    primaryCtaTo: string;
  };
  teamSection: {
    enabled: boolean;
    eyebrow: LocalizedText;
    title: LocalizedText;
    subtitle: LocalizedText;
  };
  contactMeta: {
    hqAddress: LocalizedText;
    unp: string;
    schedule: LocalizedText;
    citizenHours: LocalizedText;
    receptionPhone: string;
    receptionEmail: string;
    receptionTitle: LocalizedText;
    receptionSubtitle: LocalizedText;
    salesPhone: string;
    salesEmail: string;
    salesOrdersEmail: string;
    salesTitle: LocalizedText;
    salesSubtitle: LocalizedText;
    exportPhone: string;
    exportPhoneAlt: string;
    exportEmail: string;
    exportTitle: LocalizedText;
    exportSubtitle: LocalizedText;
  };
  footer: {
    brandDesc: LocalizedText;
    address: LocalizedText;
    copyright: LocalizedText;
    heritage: LocalizedText;
    ctaLabel: LocalizedText;
    showProductsColumn: boolean;
    showCompanyColumn: boolean;
    showContactsColumn: boolean;
  };
}
