import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { LanguageSwitcher } from './LanguageSwitcher';

export const Header: React.FC = () => {
  const { t, language } = useLanguage();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { to: '/catalog', label: t('navCatalog') },
    { to: '/export', label: t('navExport') },
    { to: '/partners', label: t('navPartners') },
    { to: '/news', label: t('navNews') },
    { to: '/about', label: t('navAbout') },
  ];

  const isActive = (path: string) =>
    location.pathname === path || location.pathname.startsWith(`${path}/`);

  const adminLabel =
    language === 'ru'
      ? 'CMS Админ'
      : language === 'be'
      ? 'CMS Адмін'
      : language === 'zh'
      ? 'CMS 管理'
      : 'CMS Admin';

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Single-element brand wordmark */}
          <Link
            to="/"
            onClick={() => setMobileOpen(false)}
            className="font-display text-lg sm:text-xl font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 hover:text-[#0057B8] transition-colors"
          >
            {t('brandName')}
          </Link>

          {/* Zone 2: 5 concise single-line nav links */}
          <nav
            className="hidden lg:flex items-center gap-6 text-sm font-medium"
            aria-label="Main navigation"
          >
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`whitespace-nowrap shrink-0 py-1 border-b-2 transition-colors duration-150 ${
                  isActive(item.to)
                    ? 'text-[#0057B8] border-[#0057B8]'
                    : 'text-slate-600 border-transparent hover:text-slate-900 hover:border-slate-300'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Zone 3: 1 primary action on desktop + mobile toggle */}
          <div className="flex items-center gap-3 shrink-0">
            <Link
              to="/contacts"
              className="hidden sm:inline-flex items-center justify-center px-4 py-2 text-xs font-semibold text-white bg-[#0057B8] rounded-lg hover:bg-[#004494] transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0057B8]"
            >
              {t('ctaContact')}
            </Link>
            <button
              type="button"
              onClick={() => setMobileOpen((prev) => !prev)}
              className="lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors"
              aria-expanded={mobileOpen}
              aria-label="Toggle navigation menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile drawer */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-4">
            <nav className="flex flex-col space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileOpen(false)}
                  className={`px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive(item.to)
                      ? 'bg-blue-50 text-[#0057B8]'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              <Link
                to="/contacts"
                onClick={() => setMobileOpen(false)}
                className="px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                {t('ctaContact')}
              </Link>
              <Link
                to="/admin"
                onClick={() => setMobileOpen(false)}
                className="px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                {adminLabel}
              </Link>
            </nav>
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500">Language / Язык</span>
              <LanguageSwitcher compact />
            </div>
          </div>
        )}
      </header>

      {/* Non-sticky workspace utility bar (Language Switcher + CMS Admin) keeping Top Bar strictly 3 zones */}
      <div className="hidden lg:block bg-slate-50 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-10 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-4">
            <span>milk.by</span>
            <span aria-hidden="true">·</span>
            <Link to="/sitemap" className="hover:text-slate-900 transition-colors">
              Sitemap &amp; SEO
            </Link>
            <span aria-hidden="true">·</span>
            <Link to="/admin" className="hover:text-[#0057B8] font-medium text-slate-700 transition-colors">
              {adminLabel}
            </Link>
          </div>
          <LanguageSwitcher />
        </div>
      </div>
    </>
  );
};
