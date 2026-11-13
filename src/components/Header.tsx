import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, ArrowRight } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { useCatalogStore } from '../hooks/useCatalogStore';
import { LanguageSwitcher } from './LanguageSwitcher';
import logoUrl from '../assets/logo.webp';

export const Header: React.FC = () => {
  const { t, localize, language } = useLanguage();
  const { categories } = useCatalogStore();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<'catalog' | 'business' | null>(null);
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

  useEffect(() => {
    setMobileOpen(false);
    setOpenMenu(null);
  }, [location.pathname]);

  const isOverHero = isHomePage && !pastHero;

  const isActive = (path: string) =>
  location.pathname === path || location.pathname.startsWith(`${path}/`);

  const isBusinessActive = isActive('/partners') || isActive('/export');

  const copy = {
    ru: {
      allCatalog: 'Весь каталог продукции',
      wholesale: 'Оптовым покупателям и HoReCa',
      wholesaleSub: 'Поставки для сетей, пиццерий и пекарен',
      exportTitle: 'Международный экспорт',
      exportSub: 'СОМ, масло, сыры и сертификаты GACC / ISO',
      admin: 'CMS Админ',
    },
    be: {
      allCatalog: 'Увесь каталог прадукцыі',
      wholesale: 'Аптовым пакупнікам і HoReCa',
      wholesaleSub: 'Пастаўкі для сетак, піцэрый і пякарняў',
      exportTitle: 'Міжнародны экспарт',
      exportSub: 'САМ, масла, сыры і сертыфікаты GACC / ISO',
      admin: 'CMS Адмін',
    },
    en: {
      allCatalog: 'View All Products',
      wholesale: 'Wholesale & HoReCa Partners',
      wholesaleSub: 'Supply for retail chains, pizzerias, and bakeries',
      exportTitle: 'Global Export Portal',
      exportSub: 'SMP, butter, aged cheese, GACC & ISO docs',
      admin: 'CMS Admin',
    },
    zh: {
      allCatalog: '浏览全部产品目录',
      wholesale: '大宗批发与 HoReCa 餐饮合作',
      wholesaleSub: '面向连锁商超、披萨门店与工业烘焙直供',
      exportTitle: '国际出口专区',
      exportSub: '脱脂奶粉、黄油、奶酪及 GACC / ISO 认证',
      admin: 'CMS 管理',
    },
  }[language];

  const linkClass = (active: boolean) =>
  `nav-underline-link inline-flex items-center gap-1 whitespace-nowrap shrink-0 py-2 transition-colors duration-200 ${
    isOverHero
    ? active
    ? 'text-white'
    : 'text-white/90 hover:text-white'
    : active
    ? 'text-[#0057B8]'
    : 'text-slate-700 hover:text-[#0057B8]'
  }`;

  return (
    <header
    className={`${
      isHomePage ? 'fixed top-0 left-0 right-0' : 'sticky top-0'
    } z-40 transition-colors duration-200 ${
      isOverHero
      ? 'bg-black/25 backdrop-blur-md border-b border-white/15'
      : 'bg-white/90 backdrop-blur-md border-b border-slate-200/80'
    }`}
    >
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[72px] flex items-center justify-between gap-6">
    {/* Zone 1: Brand Logo */}
    <Link
    to="/"
    onClick={() => setMobileOpen(false)}
    aria-label={t('brandName')}
    className="inline-flex items-center shrink-0 rounded-lg transition-transform duration-200 hover:scale-[1.02] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0057B8]"
    >
    <img
    src={logoUrl}
    alt={t('brandName')}
    className="h-11 sm:h-12 w-auto object-contain"
    />
    </Link>

    {/* Zone 2: Clean 5-Item Navigation with Dropdowns & Animated Underlines */}
    <nav
    className="hidden lg:flex items-center gap-7 text-[15px] font-medium"
    aria-label="Main navigation"
    >
    {/* 1. Products + Category Dropdown */}
    <div
    className="relative group/nav"
    onMouseEnter={() => setOpenMenu('catalog')}
    onMouseLeave={() => setOpenMenu(null)}
    >
    <Link
    to="/catalog"
    data-active={isActive('/catalog')}
    className={linkClass(isActive('/catalog'))}
    >
    <span>{t('navCatalog')}</span>
    <ChevronDown
    className={`w-3.5 h-3.5 transition-transform duration-200 ${
      openMenu === 'catalog' ? 'rotate-180' : ''
    }`}
    />
    </Link>

    {openMenu === 'catalog' && (
      <div className="absolute left-0 top-full pt-2 z-50">
      <div className="w-[460px] rounded-2xl bg-white/98 backdrop-blur-xl border border-slate-200/90 shadow-xl p-3 space-y-2">
      <div className="grid grid-cols-2 gap-1">
      {categories.map((cat) => (
        <Link
        key={cat.id}
        to={`/catalog/${cat.slug}`}
        onClick={() => setOpenMenu(null)}
        className="group/item px-3 py-2 rounded-lg text-sm text-slate-700 hover:bg-blue-50/70 hover:text-[#0057B8] transition-colors flex items-center justify-between gap-2"
        >
        <span className="truncate">{localize(cat.name)}</span>
        <ArrowRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-all duration-200 shrink-0" />
        </Link>
      ))}
      </div>
      <div className="pt-2 border-t border-slate-100">
      <Link
      to="/catalog"
      onClick={() => setOpenMenu(null)}
      className="group/all flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold text-[#0057B8] hover:bg-blue-50 transition-colors"
      >
      <span>{copy.allCatalog}</span>
      <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover/all:translate-x-0.5" />
      </Link>
      </div>
      </div>
      </div>
    )}
    </div>

    {/* 2. B2B & Export Dropdown */}
    <div
    className="relative group/nav"
    onMouseEnter={() => setOpenMenu('business')}
    onMouseLeave={() => setOpenMenu(null)}
    >
    <Link
    to="/export"
    data-active={isBusinessActive}
    className={linkClass(isBusinessActive)}
    >
    <span>{t('navBusiness')}</span>
    <ChevronDown
    className={`w-3.5 h-3.5 transition-transform duration-200 ${
      openMenu === 'business' ? 'rotate-180' : ''
    }`}
    />
    </Link>

    {openMenu === 'business' && (
      <div className="absolute left-0 top-full pt-2 z-50">
      <div className="w-80 rounded-2xl bg-white/98 backdrop-blur-xl border border-slate-200/90 shadow-xl p-2 space-y-1">
      <Link
      to="/partners"
      onClick={() => setOpenMenu(null)}
      className="block px-3.5 py-2.5 rounded-xl hover:bg-blue-50/70 transition-colors group/item"
      >
      <div className="text-sm font-semibold text-slate-900 group-hover/item:text-[#0057B8] transition-colors">
      {copy.wholesale}
      </div>
      <div className="text-xs text-slate-500 mt-0.5">{copy.wholesaleSub}</div>
      </Link>
      <Link
      to="/export"
      onClick={() => setOpenMenu(null)}
      className="block px-3.5 py-2.5 rounded-xl hover:bg-blue-50/70 transition-colors group/item"
      >
      <div className="text-sm font-semibold text-slate-900 group-hover/item:text-[#0057B8] transition-colors">
      {copy.exportTitle}
      </div>
      <div className="text-xs text-slate-500 mt-0.5">{copy.exportSub}</div>
      </Link>
      </div>
      </div>
    )}
    </div>

    {/* 3. News */}
    <Link to="/news" data-active={isActive('/news')} className={linkClass(isActive('/news'))}>
    {t('navNews')}
    </Link>

    {/* 4. About */}
    <Link to="/about" data-active={isActive('/about')} className={linkClass(isActive('/about'))}>
    {t('navAbout')}
    </Link>

    {/* 5. Contacts */}
    <Link
    to="/contacts"
    data-active={isActive('/contacts')}
    className={linkClass(isActive('/contacts'))}
    >
    {t('navContacts')}
    </Link>
    </nav>

    {/* Zone 3: Language Switcher + Mobile Toggle */}
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

    {/* Mobile Drawer */}
    {mobileOpen && (
      <div className="lg:hidden border-t border-slate-200 bg-white/95 backdrop-blur-md text-slate-900 px-4 py-4 space-y-4">
      <nav className="flex flex-col space-y-1">
      {[
        { to: '/catalog', label: t('navCatalog') },
                    { to: '/partners', label: t('navPartners') },
                    { to: '/export', label: t('navExport') },
                    { to: '/news', label: t('navNews') },
                    { to: '/about', label: t('navAbout') },
                    { to: '/contacts', label: t('navContacts') },
                    { to: '/admin', label: copy.admin },
      ].map((item) => (
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
