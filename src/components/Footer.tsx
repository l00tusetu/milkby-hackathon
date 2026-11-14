import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';

export const Footer: React.FC = () => {
  const { t, language } = useLanguage();

  const labels = {
    sections:
    language === 'ru'
    ? 'Разделы'
    : language === 'be'
    ? 'Раздзелы'
    : language === 'zh'
    ? '网站导航'
    : 'Sections',
    scenarios:
    language === 'ru'
    ? 'Сценарии'
    : language === 'be'
    ? 'Сцэнарыі'
    : language === 'zh'
    ? '业务通道'
    : 'Audience Paths',
    tools:
    language === 'ru'
    ? 'Управление и SEO'
    : language === 'be'
    ? 'Кіраванне і SEO'
    : language === 'zh'
    ? '系统管理与SEO'
    : 'Management & SEO',
    cms:
    language === 'ru'
    ? 'CMS-панель маркетолога'
    : language === 'be'
    ? 'CMS-панэль маркетолага'
    : language === 'zh'
    ? 'CMS 内容管理后台'
    : 'Marketing CMS Panel',
    sitemap:
    language === 'ru'
    ? 'XML-карта сайта и 301-редиректы'
    : language === 'be'
    ? 'XML-карта сайта і 301-рэдырэкты'
    : language === 'zh'
    ? 'XML 站点地图与301重定向'
    : 'XML Sitemap & 301 Audit',
  };

  return (
    <footer className="mt-10 sm:mt-12 bg-slate-50 relative overflow-hidden">
    {/* Компактная синяя молочная волна на границе с контентом */}
    <div className="w-full overflow-hidden leading-none bg-white" aria-hidden="true">
    <svg
    viewBox="0 0 1440 56"
    preserveAspectRatio="none"
    className="block w-full h-6 sm:h-9"
    >
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
    <svg
    viewBox="0 0 1440 60"
    preserveAspectRatio="none"
    className="block w-full h-full"
    >
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pb-5 border-b border-slate-200/90">
    <div className="space-y-2.5">
    <Link to="/" className="font-display text-lg font-bold text-slate-900 inline-block">
    {t('brandName')}
    </Link>
    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{t('footerLegal')}</p>
    </div>

    <div>
    <h3 className="text-xs font-semibold text-slate-900 mb-2">{labels.sections}</h3>
    <ul className="space-y-1.5 text-sm text-slate-600">
    <li>
    <Link to="/catalog" className="hover:text-[#0057B8] transition-colors">
    {t('navCatalog')}
    </Link>
    </li>
    <li>
    <Link to="/news" className="hover:text-[#0057B8] transition-colors">
    {t('navNews')}
    </Link>
    </li>
    <li>
    <Link to="/about" className="hover:text-[#0057B8] transition-colors">
    {t('navAbout')}
    </Link>
    </li>
    <li>
    <Link to="/contacts" className="hover:text-[#0057B8] transition-colors">
    {t('ctaContact')}
    </Link>
    </li>
    </ul>
    </div>

    <div>
    <h3 className="text-xs font-semibold text-slate-900 mb-2">{labels.scenarios}</h3>
    <ul className="space-y-1.5 text-sm text-slate-600">
    <li>
    <Link to="/catalog/cheese" className="hover:text-[#0057B8] transition-colors">
    {t('roleConsumerTitle')}
    </Link>
    </li>
    <li>
    <Link to="/partners" className="hover:text-[#0057B8] transition-colors">
    {t('roleB2BTitle')}
    </Link>
    </li>
    <li>
    <Link to="/export" className="hover:text-[#0057B8] transition-colors">
    {t('roleExportTitle')}
    </Link>
    </li>
    <li>
    <Link to="/news" className="hover:text-[#0057B8] transition-colors">
    {t('roleMediaTitle')}
    </Link>
    </li>
    </ul>
    </div>

    <div className="space-y-3">
    <div>
    <h3 className="text-xs font-semibold text-slate-900 mb-2">{labels.tools}</h3>
    <ul className="space-y-1.5 text-sm text-slate-600">
    <li>
    <Link to="/admin" className="hover:text-[#0057B8] transition-colors">
    {labels.cms}
    </Link>
    </li>
    <li>
    <Link to="/sitemap" className="hover:text-[#0057B8] transition-colors">
    {labels.sitemap}
    </Link>
    </li>
    <li className="font-mono text-xs text-slate-500 pt-0.5 tabular-nums">
    ved@milk.by · +375 (152) 60-07-52
    </li>
    </ul>
    </div>

    <Link
    to="/contacts"
    className="inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-white bg-[#0057B8] rounded-lg hover:bg-[#004494] transition-colors"
    >
    <span>{t('ctaContact')}</span>
    <ArrowRight className="w-3.5 h-3.5" />
    </Link>
    </div>
    </div>

    <div className="pt-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-slate-500">
    <span>
    {language === 'ru'
      ? '© 2026 ОАО «Молочный Мир» (milk.by)'
      : language === 'be'
      ? '© 2026 ААТ «Малочны Мір» (milk.by)'
      : language === 'zh'
      ? '© 2026 Molochny Mir 股份公司 (milk.by)'
  : '© 2026 Molochny Mir JSC (milk.by)'}
  </span>
  <span>FSSC 22000 · ISO 9001 · HACCP</span>
  </div>
  </div>
  </footer>
  );
};
