/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  Navigate,
  useLocation,
  useParams,
} from 'react-router-dom';
import { LanguageProvider, useLanguage, useLocalizedPath } from './hooks/useLanguage';
import { CatalogStoreProvider } from './hooks/useCatalogStore';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Catalog } from './pages/Catalog';
import { Category } from './pages/Category';
import { Product } from './pages/Product';
import { News } from './pages/News';
import { NewsArticle } from './pages/NewsArticle';
import { Export } from './pages/Export';
import { Partners } from './pages/Partners';
import { About } from './pages/About';
import { Contacts } from './pages/Contacts';
import { Admin } from './pages/Admin';
import { SitemapPage } from './pages/SitemapPage';
import { Language } from './types';

const SUPPORTED_LANGS: Language[] = ['ru', 'be', 'en', 'zh'];

const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const NotFound: React.FC = () => {
  const { language } = useLanguage();
  const lp = useLocalizedPath();

  const copy = {
    ru: {
      title: '404 — Страница не найдена',
      desc: 'Запрошенный адрес не существует. Воспользуйтесь каталогом продукции или вернитесь на главную.',
      home: 'На главную',
      catalog: 'Каталог продукции',
    },
    be: {
      title: '404 — Старонка не знойдзена',
      desc: 'Запытаны адрас не існуе. Скарыстайцеся каталогам прадукцыі або вярніцеся на галоўную.',
      home: 'На галоўную',
      catalog: 'Каталог прадукцыі',
    },
    en: {
      title: '404 — Page Not Found',
      desc: 'The requested page does not exist. Browse our dairy catalog or return to the homepage.',
      home: 'Homepage',
      catalog: 'Product Catalog',
    },
    zh: {
      title: '404 — 页面未找到',
      desc: '您访问的地址不存在。请浏览产品目录或返回首页。',
      home: '返回首页',
      catalog: '产品目录',
    },
  }[language];

  return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
      <h1 className="font-display text-3xl font-bold text-slate-900">{copy.title}</h1>
      <p className="text-sm text-slate-600">{copy.desc}</p>
      <div className="flex flex-wrap justify-center gap-3 pt-2">
        <Link
          to={lp('/')}
          className="px-4 py-2 text-sm font-semibold text-white bg-[#0057B8] rounded-lg hover:bg-[#004494]"
        >
          {copy.home}
        </Link>
        <Link
          to={lp('/catalog')}
          className="px-4 py-2 text-sm font-semibold text-slate-800 bg-slate-100 rounded-lg hover:bg-slate-200"
        >
          {copy.catalog}
        </Link>
      </div>
    </div>
  );
};

const UnprefixedRedirect: React.FC = () => {
  const location = useLocation();
  return <Navigate to={`/ru${location.pathname}${location.search}${location.hash}`} replace />;
};

const LanguageScopedRoutes: React.FC = () => {
  const { lang } = useParams<{ lang: string }>();
  const { setLanguage } = useLanguage();
  const lastSyncedParam = useRef<string | undefined>(undefined);

  const isSupported = Boolean(lang && SUPPORTED_LANGS.includes(lang as Language));

  useEffect(() => {
    if (isSupported && lang && lastSyncedParam.current !== lang) {
      lastSyncedParam.current = lang;
      setLanguage(lang as Language);
    }
  }, [isSupported, lang, setLanguage]);

  if (!isSupported) {
    return <NotFound />;
  }

  return (
    <Routes>
      <Route index element={<Home />} />
      <Route path="catalog" element={<Catalog />} />
      <Route path="catalog/:category" element={<Category />} />
      <Route path="product/:id" element={<Product />} />
      <Route path="news" element={<News />} />
      <Route path="news/:id" element={<NewsArticle />} />
      <Route path="export" element={<Export />} />
      <Route path="partners" element={<Partners />} />
      <Route path="about" element={<About />} />
      <Route path="contacts" element={<Contacts />} />
      <Route path="admin" element={<Admin />} />
      <Route path="sitemap" element={<SitemapPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default function App() {
  return (
    <LanguageProvider>
      <CatalogStoreProvider>
        <BrowserRouter>
          <ScrollToTop />
          <div className="min-h-screen flex flex-col bg-white text-slate-900">
            <Header />
            <main className="flex-1 min-w-0">
              <Routes>
                <Route path="/" element={<Navigate to="/ru/" replace />} />
                <Route path="/catalog/*" element={<UnprefixedRedirect />} />
                <Route path="/product/*" element={<UnprefixedRedirect />} />
                <Route path="/news/*" element={<UnprefixedRedirect />} />
                <Route path="/export" element={<UnprefixedRedirect />} />
                <Route path="/partners" element={<UnprefixedRedirect />} />
                <Route path="/about" element={<UnprefixedRedirect />} />
                <Route path="/contacts" element={<UnprefixedRedirect />} />
                <Route path="/admin" element={<UnprefixedRedirect />} />
                <Route path="/sitemap" element={<UnprefixedRedirect />} />
                <Route path="/:lang/*" element={<LanguageScopedRoutes />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </BrowserRouter>
      </CatalogStoreProvider>
    </LanguageProvider>
  );
}
