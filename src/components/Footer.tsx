import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { LanguageSwitcher } from './LanguageSwitcher';

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
    <footer className="bg-slate-50 border-t border-slate-200 mt-16">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-10 border-b border-slate-200">
    <div className="space-y-4">
    <Link to="/" className="font-display text-lg font-bold text-slate-900 inline-block">
    {t('brandName')}
    </Link>
    <p className="text-sm text-slate-600 leading-relaxed">{t('footerLegal')}</p>
    <div>
    <LanguageSwitcher />
    </div>
    </div>

    <div>
    <h3 className="text-xs font-semibold text-slate-900 mb-3">{labels.sections}</h3>
    <ul className="space-y-2 text-sm text-slate-600">
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
    <h3 className="text-xs font-semibold text-slate-900 mb-3">{labels.scenarios}</h3>
    <ul className="space-y-2 text-sm text-slate-600">
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

    <div className="space-y-4">
    <div>
    <h3 className="text-xs font-semibold text-slate-900 mb-3">{labels.tools}</h3>
    <ul className="space-y-2 text-sm text-slate-600">
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
    <li className="font-mono text-xs text-slate-500 pt-1 tabular-nums">
    export@milk.by · +375 (152) 44-55-12
    </li>
    </ul>
    </div>

    <Link
    to="/contacts"
    className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#0057B8] rounded-lg hover:bg-[#004494] transition-colors"
    >
    <span>{t('ctaContact')}</span>
    <ArrowRight className="w-3.5 h-3.5" />
    </Link>
    </div>
    </div>

    <div className="pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-slate-500">
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
