import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Download, CheckCircle2 } from 'lucide-react';
import { useLanguage, useLocalizedPath } from '../hooks/useLanguage';
import { useCatalogStore } from '../hooks/useCatalogStore';
import { generateXmlSitemap } from '../utils/specExport';
import { SeoHead } from '../components/SeoHead';

export const SitemapPage: React.FC = () => {
  const { language, t } = useLanguage();
  const lp = useLocalizedPath();
  const { products, categories, news, redirects } = useCatalogStore();

  const copy = {
    ru: {
      seoDesc: 'Автоматически обновляемый sitemap.xml, hreflang-связи 4 языковых версий и таблица 301-редиректов со старых URL milk.by.',
      h1: 'XML-карта сайта, SEO-аудит и 301-редиректы',
      lead: 'Автоматическая генерация ЧПУ-структуры с поддержкой hreflang (RU / BE / EN / ZH) и отсутствием дублей.',
      downloadXml: 'Скачать sitemap.xml',
      uniqTitle: 'Уникальность SEO Title (все 4 языка)',
      noDupes: '(Без дублей)',
      langVersions: 'Языковые версии (hreflang)',
      redirectsCount: 'Настроено 301-редиректов',
      rulesUnit: 'правил',
      redirectsHeading: 'Карта 301-редиректов со старых URL milk.by',
      colOld: 'Старый URL (milk.by)',
      colCode: 'Код',
      colNew: 'Новый канонический URL',
      colNote: 'Примечание',
    },
    be: {
      seoDesc: 'Аўтаматычна абнаўляемы sitemap.xml, hreflang-сувязі 4 моўных версій і табліца 301-рэдырэктаў са старых URL milk.by.',
      h1: 'XML-карта сайта, SEO-аўдыт і 301-рэдырэкты',
      lead: 'Аўтаматычная генерацыя ЧПУ-структуры з падтрымкай hreflang (RU / BE / EN / ZH) і адсутнасцю дубляў.',
      downloadXml: 'Спампаваць sitemap.xml',
      uniqTitle: 'Унікальнасць SEO Title (усе 4 мовы)',
      noDupes: '(Без дубляў)',
      langVersions: 'Моўныя версіі (hreflang)',
      redirectsCount: 'Наладжана 301-рэдырэктаў',
      rulesUnit: 'правілаў',
      redirectsHeading: 'Карта 301-рэдырэктаў са старых URL milk.by',
      colOld: 'Стары URL (milk.by)',
      colCode: 'Код',
      colNew: 'Новы кананічны URL',
      colNote: 'Заўвага',
    },
    en: {
      seoDesc: 'Auto-generated sitemap.xml, 4-language hreflang links, and 301 redirect rules from legacy milk.by URLs.',
      h1: 'XML Sitemap, SEO Audit & 301 Redirects',
      lead: 'Auto-generated clean URL sitemap with 4-language hreflang links and legacy 301 redirects.',
      downloadXml: 'Download sitemap.xml',
      uniqTitle: 'Unique SEO Titles (4 languages)',
      noDupes: '(No duplicates)',
      langVersions: 'Language Versions (hreflang)',
      redirectsCount: 'Configured 301 Redirects',
      rulesUnit: 'rules',
      redirectsHeading: 'Legacy URL 301 Redirect Mapping',
      colOld: 'Legacy URL (milk.by)',
      colCode: 'Code',
      colNew: 'Canonical Target URL',
      colNote: 'Note',
    },
    zh: {
      seoDesc: '自动更新的 sitemap.xml、四种语言 hreflang 关联及 milk.by 旧版链接 301 重定向映射表。',
      h1: 'XML 站点地图、SEO 审计与 301 重定向',
      lead: '自动生成支持四种语言 hreflang (RU / BE / EN / ZH) 且无重复标题的规范化 URL 站点地图。',
      downloadXml: '下载 sitemap.xml',
      uniqTitle: 'SEO 标题唯一性（四语）',
      noDupes: '（无重复）',
      langVersions: '语言版本 (hreflang)',
      redirectsCount: '已配置 301 重定向',
      rulesUnit: '条规则',
      redirectsHeading: 'milk.by 旧版链接 301 重定向映射表',
      colOld: '旧版 URL (milk.by)',
      colCode: '状态码',
      colNew: '新版规范 URL',
      colNote: '说明',
    },
  }[language];

  const xmlContent = useMemo(
    () => generateXmlSitemap(products, categories, news),
    [products, categories, news]
  );

  const seoAudit = useMemo(() => {
    const visibleProducts = products.filter((p) => p.visible);
    const titles = visibleProducts.map((p) => p.seo.title[language] || p.seo.title.ru);
    const uniqueTitles = new Set(titles);
    const allLangsClean = (['ru', 'be', 'en', 'zh'] as const).every((l) => {
      const list = visibleProducts.map((p) => p.seo.title[l] || p.name[l] || '');
      return new Set(list).size === list.length;
    });
    return {
      totalProducts: visibleProducts.length,
      uniqueTitlesCount: uniqueTitles.size,
      noDuplicates: titles.length === uniqueTitles.size && allLangsClean,
    };
  }, [products, language]);

  const handleDownloadXml = () => {
    const blob = new Blob([xmlContent], { type: 'application/xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sitemap.xml';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-10">
      <SeoHead
        noIndex
        title={`XML Sitemap & SEO Audit — ${t('brandName')}`}
        description={copy.seoDesc}
        canonicalPath="/sitemap"
      />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-900">{copy.h1}</h1>
          <p className="text-sm text-slate-600 mt-1">{copy.lead}</p>
        </div>

        <button
          type="button"
          onClick={handleDownloadXml}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-[#0057B8] rounded-lg hover:bg-[#004494] transition-colors whitespace-nowrap shrink-0 self-start sm:self-auto"
        >
          <Download className="w-4 h-4" />
          <span>{copy.downloadXml}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 tabular-nums">
        <div className="border border-slate-200 rounded-xl p-4 bg-white">
          <div className="text-xs text-slate-500">{copy.uniqTitle}</div>
          <div className="mt-1 flex items-center gap-2 font-display text-lg font-bold text-slate-900">
            <CheckCircle2 className="w-4 h-4 text-[#0057B8] shrink-0" />
            <span>
              {seoAudit.uniqueTitlesCount} / {seoAudit.totalProducts}{' '}
              {seoAudit.noDuplicates ? copy.noDupes : ''}
            </span>
          </div>
        </div>
        <div className="border border-slate-200 rounded-xl p-4 bg-white">
          <div className="text-xs text-slate-500">{copy.langVersions}</div>
          <div className="mt-1 font-display text-lg font-bold text-slate-900">
            4 (RU · BE · EN · ZH)
          </div>
        </div>
        <div className="border border-slate-200 rounded-xl p-4 bg-white">
          <div className="text-xs text-slate-500">{copy.redirectsCount}</div>
          <div className="mt-1 font-display text-lg font-bold text-slate-900">
            {redirects.length} {copy.rulesUnit}
          </div>
        </div>
      </div>

      <section className="space-y-3">
        <h2 className="font-display text-lg font-semibold text-slate-900">
          {copy.redirectsHeading}
        </h2>
        <div className="border border-slate-200 rounded-xl overflow-x-auto bg-white">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 font-semibold text-slate-600">
                <th className="py-3 px-4">{copy.colOld}</th>
                <th className="py-3 px-4">{copy.colCode}</th>
                <th className="py-3 px-4">{copy.colNew}</th>
                <th className="py-3 px-4">{copy.colNote}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {redirects.map((rule) => {
                const targetPath = rule.to.startsWith('/') ? rule.to : lp(rule.to);
                return (
                  <tr key={rule.from}>
                    <td className="py-2.5 px-4 font-mono text-slate-600">{rule.from}</td>
                    <td className="py-2.5 px-4 font-mono font-semibold text-[#0057B8]">{rule.code}</td>
                    <td className="py-2.5 px-4 font-mono">
                      <Link to={targetPath} className="text-[#0057B8] hover:underline">
                        {rule.to}
                      </Link>
                    </td>
                    <td className="py-2.5 px-4 text-slate-600">{rule.note}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-lg font-semibold text-slate-900">
          sitemap.xml (Live Preview)
        </h2>
        <pre className="p-4 bg-slate-950 text-slate-100 rounded-xl overflow-x-auto text-xs font-mono leading-relaxed max-h-[420px]">
          {xmlContent}
        </pre>
      </section>
    </div>
  );
};
