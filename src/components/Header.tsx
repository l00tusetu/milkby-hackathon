import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { LanguageSwitcher } from './LanguageSwitcher';
import logoUrl from '../assets/logo.webp';

export const Header: React.FC = () => {
  const { t, language } = useLanguage();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [pastHero, setPastHero] = useState(false);

  const isHomePage =
  location.pathname === '/' || /^\/(ru|be|en|zh)\/?$/.test(location.pathname);

  useEffect(() => {
    const handleScroll = () => {
      setPastHero(window.scrollY > 440);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  const isOverHero = isHomePage && !pastHero;

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
    <header
    className={`${
      isHomePage ? 'fixed top-0 left-0 right-0' : 'sticky top-0'
    } z-40 transition-colors duration-200 ${
      isOverHero
      ? 'bg-black/25 backdrop-blur-md border-b border-white/15'
      : 'bg-white/85 backdrop-blur-md border-b border-slate-200/80'
    }`}
    >
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[72px] flex items-center justify-between gap-6">
    {/* Zone 1: Brand Logo (enlarged, no light backdrop) */}
    <Link
    to="/"
    onClick={() => setMobileOpen(false)}
    aria-label={t('brandName')}
    className="inline-flex items-center shrink-0 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0057B8]"
    >
    <img
    src={logoUrl}
    alt={t('brandName')}
    className="h-11 sm:h-12 w-auto object-contain"
    />
    </Link>

    {/* Zone 2: Navigation Links (enlarged font) */}
    <nav
    className="hidden lg:flex items-center gap-7 text-base font-medium"
    aria-label="Main navigation"
    >
    {navItems.map((item) => {
      const active = isActive(item.to);
      return (
        <Link
        key={item.to}
        to={item.to}
        className={`whitespace-nowrap shrink-0 py-1.5 border-b-2 transition-colors duration-150 ${
          isOverHero
          ? active
          ? 'text-white border-white'
          : 'text-white/90 border-transparent hover:text-white hover:border-white/50'
          : active
          ? 'text-[#0057B8] border-[#0057B8]'
          : 'text-slate-700 border-transparent hover:text-slate-950 hover:border-slate-300'
        }`}
        >
        {item.label}
        </Link>
      );
    })}
    </nav>

    {/* Zone 3: Refined Language Dropdown + Mobile Toggle */}
    <div className="flex items-center gap-3 shrink-0">
    <div className="hidden sm:inline-flex">
    <LanguageSwitcher variant="dropdown" dark={isOverHero} />
    </div>

    <button
    type="button"
    onClick={() => setMobileOpen((prev) => !prev)}
    className={`lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg border transition-colors ${
      isOverHero
      ? 'border-white/25 text-white hover:bg-white/10'
      : 'border-slate-200 text-slate-700 hover:bg-slate-50'
    }`}
    aria-expanded={mobileOpen}
    aria-label="Toggle navigation menu"
    >
    {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
    </button>
    </div>
    </div>

    {/* Mobile drawer */}
    {mobileOpen && (
      <div className="lg:hidden border-t border-slate-200 bg-white/95 backdrop-blur-md text-slate-900 px-4 py-4 space-y-4">
      <nav className="flex flex-col space-y-1">
      {navItems.map((item) => (
        <Link
        key={item.to}
        to={item.to}
        onClick={() => setMobileOpen(false)}
        className={`px-3 py-2.5 rounded-lg text-base font-medium transition-colors ${
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
      className="px-3 py-2.5 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-50"
      >
      {t('ctaContact')}
      </Link>
      <Link
      to="/admin"
      onClick={() => setMobileOpen(false)}
      className="px-3 py-2.5 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-50"
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
  );
};
