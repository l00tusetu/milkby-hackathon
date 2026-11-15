import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Lock, Mail, Phone, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { useAuth } from '../hooks/useAuth';
import { StaffAuthModal } from './StaffAuth';

export const Footer: React.FC = () => {
  const { t, language } = useLanguage();
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [staffLoginOpen, setStaffLoginOpen] = useState(false);

  const copy = {
    ru: {
      brandDesc:
      'Натуральные молочные продукты из Гродно с 1938 года: свежее молоко, сыры, сливочное масло, йогурты и пломбир.',
      address: '230005, г. Гродно, ул. Гаспадарчая, 28 · Пн–Пт 08:00–17:00',
      productsTitle: 'Продукция',
      allCatalog: 'Весь каталог',
      cheese: 'Сыры и моцарелла',
      milk: 'Молоко и кефир',
      butter: 'Масло и сливки',
      yogurt: 'Йогурты и творог',
      iceCream: 'Мороженое',
      companyTitle: 'Компания и партнёрам',
      partners: 'Оптовым покупателям и HoReCa',
      export: 'Международный экспорт',
      contactsTitle: 'Связаться с нами',
      receptionLabel: 'Приёмная',
      salesLabel: 'Отдел продаж',
      exportLabel: 'Экспорт',
      copyright: '© 2026 ОАО «Молочный Мир» · УНП 500040357',
      heritage: 'Белорусские молочные традиции с 1938 года',
      staffLogin: 'Для сотрудников',
      cmsLink: 'Панель управления',
      seoLink: 'SEO и карта сайта',
      logout: 'Выйти',
    },
    be: {
      brandDesc:
      'Натуральныя малочныя прадукты з Гродна з 1938 года: свежае малако, сыры, сметанковае масла, ёгурты і пламбір.',
      address: '230005, г. Гродна, вул. Гаспадарчая, 28 · Пн–Пт 08:00–17:00',
      productsTitle: 'Прадукцыя',
      allCatalog: 'Увесь каталог',
      cheese: 'Сыры і мацарэла',
      milk: 'Малако і кефір',
      butter: 'Масла і вяршкі',
      yogurt: 'Ёгурты і тварог',
      iceCream: 'Марозіва',
      companyTitle: 'Кампанія і партнёрам',
      partners: 'Аптовым пакупнікам і HoReCa',
      export: 'Міжнародны экспарт',
      contactsTitle: 'Звязацца з намі',
      receptionLabel: 'Прыёмная',
      salesLabel: 'Аддзел продажаў',
      exportLabel: 'Экспарт',
      copyright: '© 2026 ААТ «Малочны Мір» · УНП 500040357',
      heritage: 'Беларускія малочныя традыцыі з 1938 года',
      staffLogin: 'Супрацоўнікам',
      cmsLink: 'Панэль кіравання',
      seoLink: 'SEO і карта сайта',
      logout: 'Выйсці',
    },
    en: {
      brandDesc:
      'Natural dairy products from Grodno since 1938: farm-fresh milk, aged cheeses, sweet cream butter, yogurts, and ice cream.',
      address: '28 Gaspadarchaya St, Grodno 230005 · Mon–Fri 08:00–17:00',
      productsTitle: 'Products',
      allCatalog: 'Full Catalog',
      cheese: 'Cheeses & Mozzarella',
      milk: 'Milk & Kefir',
      butter: 'Butter & Cream',
      yogurt: 'Yogurts & Tvorog',
      iceCream: 'Ice Cream',
      companyTitle: 'Company & Partners',
      partners: 'Wholesale & HoReCa',
      export: 'Global Export',
      contactsTitle: 'Get in Touch',
      receptionLabel: 'Reception',
      salesLabel: 'Sales Desk',
      exportLabel: 'Export',
      copyright: '© 2026 OJSC "Molochny Mir" (milk.by)',
      heritage: 'Belarusian dairy craft since 1938',
      staffLogin: 'Staff',
      cmsLink: 'CMS Panel',
      seoLink: 'SEO & Sitemap',
      logout: 'Log out',
    },
    zh: {
      brandDesc:
      '自 1938 年起的格罗德诺天然乳品：纯鲜牛奶、陈年奶酪、天然黄油、希腊酸奶与经典冰淇淋。',
      address: '格罗德诺市 Gaspadarchaya 街 28 号 · 周一至周五 08:00–17:00',
      productsTitle: '产品系列',
      allCatalog: '浏览全部目录',
      cheese: '奶酪与马苏里拉',
      milk: '鲜牛奶与开菲尔',
      butter: '天然黄油与稀奶油',
      yogurt: '酸奶与凝乳干酪',
      iceCream: '冰淇淋系列',
      companyTitle: '企业与合作',
      partners: '大宗批发与餐饮渠道',
      export: '国际出口业务',
      contactsTitle: '联系我们',
      receptionLabel: '总机前台',
      salesLabel: '销售中心',
      exportLabel: '国际出口',
      copyright: '© 2026 Molochny Mir 股份公司 (milk.by)',
      heritage: '始自 1938 年的白俄罗斯乳品品质',
      staffLogin: '员工入口',
      cmsLink: '管理后台',
      seoLink: 'SEO 与站点地图',
      logout: '退出',
    },
  }[language];

  return (
    <footer className="mt-10 sm:mt-12 bg-slate-50 relative overflow-hidden">
    {/* Компактная синяя молочная волна на границе с контентом */}
    <div className="w-full overflow-hidden leading-none bg-white" aria-hidden="true">
    <svg viewBox="0 0 1440 56" preserveAspectRatio="none" className="block w-full h-6 sm:h-9">
    <path
    d="M0,20 C240,50 480,0 720,24 C960,48 1200,4 1440,22 L1440,56 L0,56 Z"
    fill="#0057B8"
    fillOpacity="0.08"
    />
    <path
    d="M0,32 C320,6 600,54 900,26 C1120,4 1300,40 1440,28 L1440,56 L0,56 Z"
    fill="#0057B8"
    fillOpacity="0.14"
    />
    <path
    d="M0,40 C280,16 520,54 820,34 C1080,16 1280,44 1440,36 L1440,56 L0,56 Z"
    fill="#f8fafc"
    />
    <path
    d="M0,40 C280,16 520,54 820,34 C1080,16 1280,44 1440,36"
    fill="none"
    stroke="#0057B8"
    strokeOpacity="0.28"
    strokeWidth="2"
    />
    </svg>
    </div>

    {/* Компактная декоративная волна под нижним текстом */}
    <div
    className="pointer-events-none select-none absolute inset-x-0 bottom-0 h-8 sm:h-10"
    aria-hidden="true"
    >
    <svg viewBox="0 0 1440 60" preserveAspectRatio="none" className="block w-full h-full">
    <path
    d="M0,26 C260,8 520,44 780,22 C1040,4 1260,38 1440,18 L1440,60 L0,60 Z"
    fill="#0057B8"
    fillOpacity="0.06"
    />
    <path
    d="M0,38 C320,50 620,20 920,38 C1140,50 1320,28 1440,34 L1440,60 L0,60 Z"
    fill="#0057B8"
    fillOpacity="0.09"
    />
    <path
    d="M0,38 C320,50 620,20 920,38 C1140,50 1320,28 1440,34"
    fill="none"
    stroke="#0057B8"
    strokeOpacity="0.18"
    strokeWidth="1.5"
    />
    </svg>
    </div>

    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12 sm:pb-14">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-7 pb-6 border-b border-slate-200/90">
    {/* 1. О бренде */}
    <div className="space-y-2.5">
    <Link to="/" className="font-display text-lg font-bold text-slate-900 inline-block">
    {t('brandName')}
    </Link>
    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{copy.brandDesc}</p>
    <p className="text-xs text-slate-500 leading-relaxed pt-0.5">{copy.address}</p>
    </div>

    {/* 2. Продукция */}
    <div>
    <h3 className="text-xs font-semibold text-slate-900 mb-2.5">{copy.productsTitle}</h3>
    <ul className="space-y-1.5 text-sm text-slate-600">
    <li>
    <Link to="/catalog" className="hover:text-[#0057B8] transition-colors">
    {copy.allCatalog}
    </Link>
    </li>
    <li>
    <Link to="/catalog/cheese" className="hover:text-[#0057B8] transition-colors">
    {copy.cheese}
    </Link>
    </li>
    <li>
    <Link to="/catalog/milk" className="hover:text-[#0057B8] transition-colors">
    {copy.milk}
    </Link>
    </li>
    <li>
    <Link to="/catalog/butter" className="hover:text-[#0057B8] transition-colors">
    {copy.butter}
    </Link>
    </li>
    <li>
    <Link to="/catalog/yogurt" className="hover:text-[#0057B8] transition-colors">
    {copy.yogurt}
    </Link>
    </li>
    <li>
    <Link to="/catalog/ice-cream" className="hover:text-[#0057B8] transition-colors">
    {copy.iceCream}
    </Link>
    </li>
    </ul>
    </div>

    {/* 3. Компания и сотрудничество */}
    <div>
    <h3 className="text-xs font-semibold text-slate-900 mb-2.5">{copy.companyTitle}</h3>
    <ul className="space-y-1.5 text-sm text-slate-600">
    <li>
    <Link to="/about" className="hover:text-[#0057B8] transition-colors">
    {t('navAbout')}
    </Link>
    </li>
    <li>
    <Link to="/news" className="hover:text-[#0057B8] transition-colors">
    {t('navNews')}
    </Link>
    </li>
    <li>
    <Link to="/partners" className="hover:text-[#0057B8] transition-colors">
    {copy.partners}
    </Link>
    </li>
    <li>
    <Link to="/export" className="hover:text-[#0057B8] transition-colors">
    {copy.export}
    </Link>
    </li>
    <li>
    <Link to="/contacts" className="hover:text-[#0057B8] transition-colors">
    {t('navContacts')}
    </Link>
    </li>
    </ul>
    </div>

    {/* 4. Контакты */}
    <div className="space-y-3.5">
    <div>
    <h3 className="text-xs font-semibold text-slate-900 mb-2.5">{copy.contactsTitle}</h3>
    <ul className="space-y-2 text-xs text-slate-600 tabular-nums">
    <li className="flex items-center gap-2">
    <Phone className="w-3.5 h-3.5 text-[#0057B8] shrink-0" />
    <span>
    <span className="text-slate-500">{copy.receptionLabel}: </span>
    <a href="tel:+375152430172" className="hover:text-[#0057B8] font-medium">
    +375 (152) 43-01-72
    </a>
    </span>
    </li>
    <li className="flex items-center gap-2">
    <Phone className="w-3.5 h-3.5 text-[#0057B8] shrink-0" />
    <span>
    <span className="text-slate-500">{copy.salesLabel}: </span>
    <a href="tel:+375152453942" className="hover:text-[#0057B8] font-medium">
    +375 (152) 45-39-42
    </a>
    </span>
    </li>
    <li className="flex items-center gap-2">
    <Mail className="w-3.5 h-3.5 text-[#0057B8] shrink-0" />
    <span>
    <span className="text-slate-500">{copy.exportLabel}: </span>
    <a href="mailto:ved@milk.by" className="hover:text-[#0057B8] font-medium">
    ved@milk.by
    </a>
    </span>
    </li>
    </ul>
    </div>

    <Link
    to="/contacts"
    className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-[#0057B8] rounded-lg hover:bg-[#004494] transition-colors"
    >
    <span>{t('ctaContact')}</span>
    <ArrowRight className="w-3.5 h-3.5" />
    </Link>
    </div>
    </div>

    {/* Нижняя строка + незаметный вход для сотрудников */}
    <div className="pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-slate-500">
    <span>{copy.copyright}</span>

    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
    <span>{copy.heritage}</span>

    <span className="text-slate-300 hidden sm:inline" aria-hidden="true">
    ·
    </span>

    {isAuthenticated ? (
      <div className="inline-flex items-center gap-3 text-[11px]">
      <Link
      to="/admin"
      className="inline-flex items-center gap-1 font-medium text-[#0057B8] hover:underline"
      >
      <ShieldCheck className="w-3 h-3 shrink-0" />
      <span>{copy.cmsLink}</span>
      </Link>
      <Link
      to="/sitemap"
      className="text-slate-500 hover:text-[#0057B8] transition-colors"
      >
      {copy.seoLink}
      </Link>
      <button
      type="button"
      onClick={logout}
      className="text-slate-400 hover:text-slate-700 transition-colors"
      >
      {copy.logout}
      </button>
      </div>
    ) : (
      <button
      type="button"
      onClick={() => setStaffLoginOpen(true)}
      className="inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-600 transition-colors"
      >
      <Lock className="w-3 h-3 shrink-0" />
      <span>{copy.staffLogin}</span>
      </button>
    )}
    </div>
    </div>
    </div>

    <StaffAuthModal
    open={staffLoginOpen}
    onClose={() => setStaffLoginOpen(false)}
    onSuccess={() => navigate('/admin')}
    />
    </footer>
  );
};
