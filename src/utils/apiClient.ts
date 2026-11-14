import {
  AutocompleteResponse,
  B2BInquiry,
  BootstrapPayload,
  BulkImportResult,
  Category,
  Language,
  LocalizedText,
  NewsArticle,
  Product,
  RedirectRule,
  SeoAudit,
  SmartSelectResponse,
} from '../types';

const API_BASE = '/api/v1';

async function requestJson<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: {
      ...(options?.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
      ...(options?.headers || {}),
    },
    ...options,
  });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }
  if (res.status === 204) {
    return undefined as unknown as T;
  }
  return (await res.json()) as T;
}

export const apiClient = {
  getBootstrap: () => requestJson<BootstrapPayload>(`${API_BASE}/bootstrap`),

  autocomplete: (q: string, lang: Language, limit = 6) =>
    requestJson<AutocompleteResponse>(
      `${API_BASE}/search/autocomplete?q=${encodeURIComponent(q)}&lang=${lang}&limit=${limit}`
    ),

  smartSelect: (query: string, language: Language, limit = 6) =>
    requestJson<SmartSelectResponse>(`${API_BASE}/ai/smart-select`, {
      method: 'POST',
      body: JSON.stringify({ query, language, limit }),
    }),

  submitB2BInquiry: (payload: B2BInquiry) =>
    requestJson<B2BInquiry>(`${API_BASE}/b2b-inquiries`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  getSeoAudit: () => requestJson<SeoAudit>(`${API_BASE}/seo/audit`),

  // Admin CRUD
  createProduct: (product: Product) =>
    requestJson<Product>(`${API_BASE}/admin/products`, {
      method: 'POST',
      body: JSON.stringify(product),
    }),

  updateProduct: (product: Product) =>
    requestJson<Product>(`${API_BASE}/admin/products/${encodeURIComponent(product.id)}`, {
      method: 'PUT',
      body: JSON.stringify(product),
    }),

  toggleProductVisibility: (id: string) =>
    requestJson<Product>(`${API_BASE}/admin/products/${encodeURIComponent(id)}/visibility`, {
      method: 'PATCH',
    }),

  deleteProduct: (id: string) =>
    requestJson<void>(`${API_BASE}/admin/products/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    }),

  createCategory: (category: Category) =>
    requestJson<Category>(`${API_BASE}/admin/categories`, {
      method: 'POST',
      body: JSON.stringify(category),
    }),

  updateCategory: (category: Category) =>
    requestJson<Category>(`${API_BASE}/admin/categories/${encodeURIComponent(category.id)}`, {
      method: 'PUT',
      body: JSON.stringify(category),
    }),

  deleteCategory: (id: string) =>
    requestJson<void>(`${API_BASE}/admin/categories/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    }),

  createNews: (article: NewsArticle) =>
    requestJson<NewsArticle>(`${API_BASE}/admin/news`, {
      method: 'POST',
      body: JSON.stringify(article),
    }),

  updateNews: (article: NewsArticle) =>
    requestJson<NewsArticle>(`${API_BASE}/admin/news/${encodeURIComponent(article.id)}`, {
      method: 'PUT',
      body: JSON.stringify(article),
    }),

  toggleNewsPublished: (id: string) =>
    requestJson<NewsArticle>(`${API_BASE}/admin/news/${encodeURIComponent(id)}/publish`, {
      method: 'PATCH',
    }),

  deleteNews: (id: string) =>
    requestJson<void>(`${API_BASE}/admin/news/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    }),

  updateTranslation: (key: string, language: Language, value: string) =>
    requestJson<Record<string, LocalizedText>>(`${API_BASE}/admin/translations`, {
      method: 'PUT',
      body: JSON.stringify({ key, language, value }),
    }),

  createRedirect: (rule: RedirectRule) =>
    requestJson<RedirectRule>(`${API_BASE}/admin/redirects`, {
      method: 'POST',
      body: JSON.stringify(rule),
    }),

  deleteRedirect: (id: number) =>
    requestJson<void>(`${API_BASE}/admin/redirects/${id}`, {
      method: 'DELETE',
    }),

  listInquiries: () => requestJson<B2BInquiry[]>(`${API_BASE}/admin/inquiries`),

  uploadMedia: (file: File) => {
    const fd = new FormData();
    fd.append('file', file);
    return requestJson<{ url: string }>(`${API_BASE}/admin/upload`, {
      method: 'POST',
      body: fd,
    });
  },

  importProductsFile: (file: File) => {
    const fd = new FormData();
    fd.append('file', file);
    return requestJson<BulkImportResult>(`${API_BASE}/admin/import/products`, {
      method: 'POST',
      body: fd,
    });
  },

  importRedirectsFile: (file: File) => {
    const fd = new FormData();
    fd.append('file', file);
    return requestJson<BulkImportResult>(`${API_BASE}/admin/import/redirects`, {
      method: 'POST',
      body: fd,
    });
  },

  resetDemo: () =>
    requestJson<{ status: string }>(`${API_BASE}/admin/reset-demo`, {
      method: 'POST',
    }),
};
