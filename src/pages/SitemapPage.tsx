import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Download, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { useCatalogStore } from '../hooks/useCatalogStore';
import { legacyRedirects } from '../data/products';
import { generateXmlSitemap } from '../utils/specExport';
import { SeoHead } from '../components/SeoHead';

export const SitemapPage: React.FC = () => {
  const { language, t } = useLanguage();
  const { products, categories, news } = useCatalogStore();

  const xmlContent = useMemo(
    () => generateXmlSitemap(products, categories, news),
    [products, categories, news]
  );

  const seoAudit = useMemo(() => {
    const visibleProducts = products.filter((p) => p.visible);
    const titles = visibleProducts.map((p) => p.seo.title[language]);
    const uniqueTitles = new Set(titles);
    return {
      totalProducts: visibleProducts.length,
      uniqueTitlesCount: uniqueTitles.size,
      noDuplicates: titles.length === uniqueTitles.size,
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
        title={`XML Sitemap & SEO Audit — ${t('brandName')}`}
        description="Автоматически обновляемый sitemap.xml, hreflang-связи 4 языковых версий и таблица 301-редиректов со старых URL milk.by."
        canonicalHash="/sitemap"
      />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-900">
            {language === 'ru'
              ? 'XML-карта сайта, SEO-аудит и 301-редиректы'
              : 'XML Sitemap, SEO Audit & 301 Redirects'}
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            {language === 'ru'
              ? 'Автоматическая генерация ЧПУ-структуры с поддержкой hreflang (RU / BE / EN / ZH) и отсутствием дублей.'
              : 'Auto-generated clean URL sitemap with 4-language hreflang links and legacy 301 redirects.'}
          </p>
        </div>

        <button
          type="button"
          onClick={handleDownloadXml}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-[#0057B8] rounded-lg hover:bg-[#004494] transition-colors whitespace-nowrap shrink-0"
        >
          <Download className="w-4 h-4" />
          <span>Download sitemap.xml</span>
        </button>
      </div>

      {/* SEO Health Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 tabular-nums">
        <div className="border border-slate-200 rounded-xl p-4 bg-white">
          <div className="text-xs text-slate-500">Уникальность SEO Title</div>
          <div className="mt-1 flex items-center gap-2 font-display text-lg font-bold text-slate-900">
            <CheckCircle2 className="w-4 h-4 text-[#0057B8]" />
            <span>
              {seoAudit.uniqueTitlesCount} / {seoAudit.totalProducts}{' '}
              {seoAudit.noDuplicates ? '(Без дублей)' : ''}
            </span>
          </div>
        </div>
        <div className="border border-slate-200 rounded-xl p-4 bg-white">
          <div className="text-xs text-slate-500">Языковые версии (hreflang)</div>
          <div className="mt-1 font-display text-lg font-bold text-slate-900">
            4 (RU · BE · EN · ZH)
          </div>
        </div>
        <div className="border border-slate-200 rounded-xl p-4 bg-white">
          <div className="text-xs text-slate-500">Настроено 301-редиректов</div>
          <div className="mt-1 font-display text-lg font-bold text-slate-900">
            {legacyRedirects.length} правил
          </div>
        </div>
      </div>

      {/* 301 Redirect Map */}
      <section className="space-y-3">
        <h2 className="font-display text-lg font-semibold text-slate-900">
          {language === 'ru'
            ? 'Карта 301-редиректов со старых URL milk.by'
            : 'Legacy URL 301 Redirect Mapping'}
        </h2>
        <div className="border border-slate-200 rounded-xl overflow-x-auto bg-white">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 font-semibold text-slate-600">
                <th className="py-3 px-4">Старый URL (milk.by)</th>
                <th className="py-3 px-4">Код</th>
                <th className="py-3 px-4">Новый канонический URL</th>
                <th className="py-3 px-4">Примечание</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {legacyRedirects.map((rule) => (
                <tr key={rule.from}>
                  <td className="py-2.5 px-4 font-mono text-slate-600">{rule.from}</td>
                  <td className="py-2.5 px-4 font-mono font-semibold text-[#0057B8]">{rule.code}</td>
                  <td className="py-2.5 px-4 font-mono">
                    <Link to={rule.to.replace('#', '')} className="text-[#0057B8] hover:underline">
                      {rule.to}
                    </Link>
                  </td>
                  <td className="py-2.5 px-4 text-slate-600">{rule.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* XML Output Preview */}
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
