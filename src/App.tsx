/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { HashRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { LanguageProvider } from './hooks/useLanguage';
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

const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const NotFound: React.FC = () => (
  <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
    <h1 className="font-display text-3xl font-bold text-slate-900">404 — Страница не найдена</h1>
    <p className="text-sm text-slate-600">
      Запрошенный адрес не существует. Воспользуйтесь каталогом продукции или вернитесь на главную.
    </p>
    <div className="flex justify-center gap-3 pt-2">
      <Link
        to="/"
        className="px-4 py-2 text-sm font-semibold text-white bg-[#0057B8] rounded-lg hover:bg-[#004494]"
      >
        На главную
      </Link>
      <Link
        to="/catalog"
        className="px-4 py-2 text-sm font-semibold text-slate-800 bg-slate-100 rounded-lg hover:bg-slate-200"
      >
        Каталог продукции
      </Link>
    </div>
  </div>
);

export default function App() {
  return (
    <LanguageProvider>
      <CatalogStoreProvider>
        <HashRouter>
          <ScrollToTop />
          <div className="min-h-screen flex flex-col bg-white text-slate-900">
            <Header />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/catalog" element={<Catalog />} />
                <Route path="/catalog/:category" element={<Category />} />
                <Route path="/product/:id" element={<Product />} />
                <Route path="/news" element={<News />} />
                <Route path="/news/:id" element={<NewsArticle />} />
                <Route path="/export" element={<Export />} />
                <Route path="/partners" element={<Partners />} />
                <Route path="/about" element={<About />} />
                <Route path="/contacts" element={<Contacts />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/sitemap" element={<SitemapPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </HashRouter>
      </CatalogStoreProvider>
    </LanguageProvider>
  );
}
