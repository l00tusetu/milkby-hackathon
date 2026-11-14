import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { useCatalogStore } from '../hooks/useCatalogStore';
import { NEWS_CATEGORY_LABELS } from '../data/news';
import { SeoHead } from '../components/SeoHead';
import { ImageWithFallback } from '../components/ImageWithFallback';

export const NewsArticle: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { language, localize, t } = useLanguage();
  const { news } = useCatalogStore();

  const article = news.find((n) => n.slug === id || n.id === id);

  const notFoundCopy = {
    ru: { seoTitle: 'Материал не найден', seoDesc: 'Новость не найдена.', title: 'Публикация не найдена' },
    be: { seoTitle: 'Матэрыял не знойдзены', seoDesc: 'Навіна не знойдзена.', title: 'Публікацыя не знойдзена' },
    en: { seoTitle: 'Article not found', seoDesc: 'Requested article was not found.', title: 'Article not found' },
    zh: { seoTitle: '未找到文章', seoDesc: '未找到相关新闻报道。', title: '未找到该新闻报道' },
  }[language];

  if (!article) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-4">
      <SeoHead title={`${notFoundCopy.seoTitle} — ${t('brandName')}`} description={notFoundCopy.seoDesc} />
      <h1 className="font-display text-2xl font-bold text-slate-900">{notFoundCopy.title}</h1>
      <Link to="/news" className="inline-flex px-4 py-2 text-sm font-semibold text-white bg-[#0057B8] rounded-lg">
      {t('navNews')}
      </Link>
      </div>
    );
  }

  const related = news.filter((n) => n.published && article.relatedIds.includes(n.id));

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
    <SeoHead
    title={localize(article.seo.title)}
    description={localize(article.seo.description)}
    canonicalHash={`/news/${article.slug}`}
    />

    <div className="space-y-4">
    <Link to="/news" className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-[#0057B8]">
    <ArrowLeft className="w-3.5 h-3.5" />
    <span>{t('navNews')}</span>
    </Link>

    <div className="flex items-center gap-2.5 text-xs text-slate-500 tabular-nums">
    <span className="font-mono">{article.date}</span>
    <span className="px-2.5 py-0.5 rounded-md bg-blue-50 text-[#0057B8] font-medium">
    {localize(NEWS_CATEGORY_LABELS[article.categoryId])}
    </span>
    </div>

    <h1 className="font-display text-3xl sm:text-4xl font-bold text-slate-900 leading-tight">
    {localize(article.title)}
    </h1>

    <p className="text-base sm:text-lg text-slate-600 leading-relaxed">{localize(article.excerpt)}</p>
    </div>

    <div className="aspect-[16/9] rounded-2xl overflow-hidden border border-slate-200 bg-slate-50">
    <ImageWithFallback src={article.image} alt={localize(article.title)} className="w-full h-full object-cover" />
    </div>

    <div className="text-base text-slate-800 leading-relaxed space-y-4 max-w-[70ch]">
    <p>{localize(article.content)}</p>
    </div>

    {related.length > 0 && (
      <section className="pt-8 border-t border-slate-200 space-y-4">
      <h2 className="font-display text-xl font-bold text-slate-900">
      {language === 'ru'
        ? 'Связанные материалы'
        : language === 'be'
        ? 'Звязаныя матэрыялы'
        : language === 'zh'
        ? '相关新闻'
    : 'Related News'}
    </h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
    {related.map((item) => (
      <Link
      key={item.id}
      to={`/news/${item.slug}`}
      className="p-4 border border-slate-200 rounded-xl hover:border-[#0057B8]/50 transition-colors space-y-1.5"
      >
      <div className="text-xs font-mono text-slate-500 tabular-nums">{item.date}</div>
      <div className="text-sm font-semibold text-slate-900 hover:text-[#0057B8]">{localize(item.title)}</div>
      </Link>
    ))}
    </div>
    </section>
    )}
    </article>
  );
};
