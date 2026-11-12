import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Compass, ArrowRight, Check } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { useCatalogStore } from '../hooks/useCatalogStore';
import { runSmartProductMatch } from '../utils/smartMatch';
import { ImageWithFallback } from './ImageWithFallback';

const SAMPLE_PROMPTS = {
  ru: [
    'Мне нужен сыр для пиццы',
    'Мне нужен продукт без лактозы',
    'Мне нужен продукт с высоким содержанием белка',
    'Мне нужен сыр для дегустации с вином',
  ],
  be: [
    'Мне патрэбен сыр для піцы',
    'Мне патрэбен прадукт без лактозы',
    'Мне патрэбен прадукт з высокім утрыманнем бялку',
    'Мне патрэбен сыр для дэгустацыі з віном',
  ],
  en: [
    'I need cheese for pizza',
    'I need a lactose-free product',
    'I need a high-protein dairy product',
    'I need aged cheese for wine tasting',
  ],
  zh: [
    '我需要披萨专用奶酪',
    '我需要无乳糖乳制品',
    '我需要高蛋白乳制品',
    '我需要配葡萄酒的奶酪',
  ],
};

export const SmartFinder: React.FC = () => {
  const { t, language, localize } = useLanguage();
  const { products } = useCatalogStore();
  const [query, setQuery] = useState('');

  const matches = useMemo(
    () => runSmartProductMatch(query, products, language),
                          [query, products, language]
  );

  const prompts = SAMPLE_PROMPTS[language] || SAMPLE_PROMPTS.ru;

  return (
    <section className="border border-slate-200 rounded-2xl bg-slate-50/70 p-5 sm:p-8 space-y-5 min-w-0">
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
    <div className="space-y-1.5">
    <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#0057B8]">
    <Compass className="w-4 h-4 shrink-0" />
    <span>{t('smartFinderTitle')}</span>
    </div>
    <p className="text-sm text-slate-600 max-w-2xl">
    {t('smartFinderSubtitle')}
    </p>
    </div>
    </div>

    <div className="flex flex-col sm:flex-row gap-3">
    <input
    type="text"
    value={query}
    onChange={(e) => setQuery(e.target.value)}
    placeholder={t('smartFinderPlaceholder')}
    className="flex-1 min-w-0 h-11 px-4 text-sm bg-white border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0057B8] focus:ring-2 focus:ring-[#0057B8]/15"
    />
    {query && (
      <button
      type="button"
      onClick={() => setQuery('')}
      className="h-11 px-4 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors whitespace-nowrap shrink-0"
      >
      {language === 'ru' ? 'Очистить' : language === 'be' ? 'Ачысціць' : language === 'zh' ? '清空' : 'Clear'}
      </button>
    )}
    </div>

    <div className="flex flex-wrap gap-2">
    {prompts.map((sample) => (
      <button
      key={sample}
      type="button"
      onClick={() => setQuery(sample)}
      className={`max-w-full px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors text-left leading-snug ${
        query === sample
        ? 'bg-[#0057B8] text-white border-[#0057B8]'
        : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:text-slate-900'
      }`}
      >
      {sample}
      </button>
    ))}
    </div>

    {query.trim().length > 0 && (
      <div className="pt-2">
      {matches.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {matches.map(({ product, reasons }) => (
          <Link
          key={product.id}
          to={`/product/${product.slug}`}
          className="group bg-white border border-slate-200 rounded-xl p-4 flex gap-4 hover:border-[#0057B8]/50 hover:shadow-sm transition-all min-w-0"
          >
          <div className="w-20 h-20 rounded-lg bg-slate-50 overflow-hidden shrink-0 border border-slate-100">
          <ImageWithFallback
          src={product.image}
          alt={localize(product.name)}
          className="w-full h-full object-cover"
          />
          </div>
          <div className="min-w-0 flex-1 space-y-1.5">
          <div className="text-sm font-semibold text-slate-900 group-hover:text-[#0057B8] transition-colors truncate">
          {localize(product.name)}
          </div>
          <ul className="space-y-0.5">
          {reasons.slice(0, 2).map((reason, idx) => (
            <li
            key={idx}
            className="text-xs text-slate-600 flex items-start gap-1.5 leading-snug"
            >
            <Check className="w-3.5 h-3.5 text-[#0057B8] shrink-0 mt-0.5" />
            <span>{reason}</span>
            </li>
          ))}
          </ul>
          <div className="pt-1 text-xs font-medium text-[#0057B8] inline-flex items-center gap-1 flex-wrap">
          <span>{product.packages.map((p) => p.weight).slice(0, 2).join(' · ')}</span>
          <ArrowRight className="w-3 h-3 shrink-0" />
          </div>
          </div>
          </Link>
        ))}
        </div>
      ) : (
        <p className="text-sm text-slate-600 bg-white border border-slate-200 rounded-lg p-4">
        {language === 'ru'
          ? 'Подходящих позиций по этому запросу не найдено. Попробуйте «сыр для пиццы», «без лактозы» или «высокий белок».'
          : language === 'be'
          ? 'Падыходзячых пазіцый не знойдзена.'
          : language === 'zh'
          ? '未找到匹配产品，请尝试“披萨奶酪”、“无乳糖”或“高蛋白”。'
      : 'No exact match found. Try "pizza cheese", "lactose-free", or "high protein".'}
      </p>
      )}
      </div>
    )}
    </section>
  );
};
