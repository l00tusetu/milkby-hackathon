import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Check, Package, X } from 'lucide-react';
import { useLanguage, useLocalizedPath } from '../hooks/useLanguage';
import { useCatalogStore } from '../hooks/useCatalogStore';
import { runSmartSearch } from '../utils/smartMatch';
import { apiClient } from '../utils/apiClient';
import { SmartCriterion, SmartMatchResult } from '../types';
import { ImageWithFallback } from './ImageWithFallback';

const SAMPLE_PROMPTS = {
  ru: [
    'Сыр для пиццы 1 кг',
    'Продукт без лактозы',
    'Высокий белок до 5% жира',
    'Выдержанный сыр к вину',
    'Для выпечки и кондитерки',
    'На экспорт с долгим хранением',
  ],
  be: [
    'Сыр для піцы 1 кг',
    'Прадукт без лактозы',
    'Высокі бялок да 5% тлушчу',
    'Вытрыманы сыр да віна',
    'Для выпечкі і кандытаркі',
    'На экспарт з доўгім захоўваннем',
  ],
  en: [
    'Pizza cheese 1kg',
    'Lactose-free dairy',
    'High protein under 5% fat',
    'Aged cheese for wine tasting',
    'Butter or cream for baking',
    'Long-shelf export products',
  ],
  zh: [
    '1公斤披萨专用奶酪',
    '无乳糖乳制品',
    '高蛋白低脂',
    '配葡萄酒的陈年奶酪',
    '烘焙用黄油与淡奶油',
    '出口长保质期产品',
  ],
};

export const SmartFinder: React.FC = () => {
  const { t, language, localize } = useLanguage();
  const lp = useLocalizedPath();
  const { products, categories, apiConnected } = useCatalogStore();
  const [query, setQuery] = useState('');
  const [remoteState, setRemoteState] = useState<{
    query: string;
    results: SmartMatchResult[];
    criteria: SmartCriterion[];
    mode: string;
  } | null>(null);

  const localMatch = useMemo(
    () => runSmartSearch(query, products, categories, language),
    [query, products, categories, language]
  );

  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed || !apiConnected) {
      setRemoteState(null);
      return;
    }
    let cancelled = false;
    const timer = window.setTimeout(async () => {
      try {
        const res = await apiClient.smartSelect(trimmed, language, 6);
        if (!cancelled) {
          setRemoteState({
            query: trimmed,
            results: res.results,
            criteria: res.criteria,
            mode: res.mode,
          });
        }
      } catch {
        // Ignore error and keep deterministic local results
      }
    }, 240);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [query, language, apiConnected]);

  const activeRemote = remoteState && remoteState.query === query.trim() ? remoteState : null;
  const results = activeRemote ? activeRemote.results : localMatch.results;
  const criteria = activeRemote ? activeRemote.criteria : localMatch.criteria;
  const matches = results.slice(0, 6);
  const prompts = SAMPLE_PROMPTS[language] || SAMPLE_PROMPTS.ru;

  const copy = {
    ru: {
      submit: 'Подобрать',
      clearAria: 'Очистить запрос',
      criteriaLabel: 'Распознанные параметры:',
      packLabel: 'Фасовка:',
      openCatalog: 'Открыть подборку в каталоге',
      empty: 'Подходящих позиций по этому запросу не найдено. Попробуйте «сыр для пиццы», «без лактозы», «высокий белок» или «масло 82.5».',
    },
    be: {
      submit: 'Падабраць',
      clearAria: 'Ачысціць запыт',
      criteriaLabel: 'Распазнаныя параметры:',
      packLabel: 'Фасоўка:',
      openCatalog: 'Адкрыць падборку ў каталогу',
      empty: 'Падыходзячых пазіцый не знойдзена. Паспрабуйце «сыр для піцы», «без лактозы» ці «масла 82.5».',
    },
    en: {
      submit: 'Match',
      clearAria: 'Clear query',
      criteriaLabel: 'Understood criteria:',
      packLabel: 'Pack:',
      openCatalog: 'Open results in catalog',
      empty: 'No exact match found. Try "pizza cheese", "lactose-free", "high protein", or "butter 82.5".',
    },
    zh: {
      submit: '智能匹配',
      clearAria: '清空输入',
      criteriaLabel: '识别条件:',
      packLabel: '推荐规格:',
      openCatalog: '在目录中查看全部结果',
      empty: '未找到匹配产品，请尝试“披萨奶酪”、“无乳糖”、“高蛋白”或“黄油 82.5”。',
    },
  }[language];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) {
      setQuery(prompts[0]);
    }
  };

  return (
    <section className="border border-slate-200 rounded-2xl bg-slate-50/80 p-4 sm:p-8 space-y-4 sm:space-y-5 min-w-0">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#0057B8]">
            <Sparkles className="w-4 h-4 shrink-0" />
            <span>{t('smartFinderTitle')}</span>
          </div>
          <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">
            {t('smartFinderSubtitle')}
          </p>
        </div>
        {activeRemote && (
          <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-white border border-slate-200 text-slate-500">
            {activeRemote.mode.toUpperCase()}
          </span>
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2.5 sm:gap-3">
        <div className="relative w-full sm:flex-1 sm:min-w-0">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('smartFinderPlaceholder')}
            aria-label={t('smartFinderTitle')}
            className="w-full h-11 pl-3.5 pr-10 text-base sm:text-sm bg-white border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0057B8] focus:ring-2 focus:ring-[#0057B8]/15 transition-all"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              aria-label={copy.clearAria}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <button
          type="submit"
          className="w-full sm:w-auto h-11 px-5 text-sm sm:text-xs font-semibold text-white bg-[#0057B8] rounded-xl hover:bg-[#004494] transition-colors whitespace-nowrap shrink-0"
        >
          {copy.submit}
        </button>
      </form>

      <div className="flex flex-nowrap sm:flex-wrap gap-2 overflow-x-auto no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 pb-1 sm:pb-0">
        {prompts.map((sample) => (
          <button
            key={sample}
            type="button"
            onClick={() => setQuery(sample)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all duration-200 whitespace-nowrap shrink-0 ${
              query === sample
                ? 'bg-[#0057B8] text-white border-[#0057B8] shadow-xs'
                : 'bg-white text-slate-700 border-slate-200 hover:border-[#0057B8]/50 hover:text-[#0057B8]'
            }`}
          >
            {sample}
          </button>
        ))}
      </div>

      {query.trim().length > 0 && (
        <div className="pt-1 sm:pt-2 space-y-4">
          {criteria.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs">
              <span className="text-slate-500 font-medium">{copy.criteriaLabel}</span>
              {criteria.map((c) => (
                <span
                  key={c.id}
                  className="px-2.5 py-0.5 rounded-md bg-blue-50 text-[#0057B8] border border-blue-200/70 font-medium"
                >
                  {c.label}
                </span>
              ))}
            </div>
          )}

          {matches.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {matches.map(({ product, reasons, recommendedPackage }) => (
                  <Link
                    key={product.id}
                    to={lp(`/product/${product.slug}`)}
                    className="group bg-white border border-slate-200 rounded-xl p-3.5 sm:p-4 flex items-start gap-3 sm:gap-4 hover:border-[#0057B8]/50 hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 min-w-0"
                  >
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg bg-slate-50 overflow-hidden shrink-0 border border-slate-100">
                      <ImageWithFallback
                        src={product.image}
                        alt={localize(product.name)}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="min-w-0 flex-1 space-y-1.5">
                      <div className="text-sm font-semibold text-slate-900 group-hover:text-[#0057B8] transition-colors leading-snug line-clamp-2">
                        {localize(product.name)}
                      </div>
                      <ul className="space-y-0.5">
                        {reasons.slice(0, 2).map((reason, idx) => (
                          <li
                            key={idx}
                            className="text-xs text-slate-600 flex items-start gap-1.5 leading-snug"
                          >
                            <Check className="w-3.5 h-3.5 text-[#0057B8] shrink-0 mt-0.5" />
                            <span className="min-w-0 break-words">{reason}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="pt-1 text-xs font-medium text-[#0057B8] flex items-center gap-1.5 flex-wrap tabular-nums">
                        {recommendedPackage ? (
                          <span className="inline-flex items-center gap-1 bg-blue-50 px-2 py-0.5 rounded text-[11px] max-w-full break-words">
                            <Package className="w-3 h-3 shrink-0" />
                            <span>
                              {copy.packLabel} {recommendedPackage.weight}
                            </span>
                          </span>
                        ) : (
                          <span>
                            {product.packages.map((p) => p.weight).slice(0, 2).join(' · ')}
                          </span>
                        )}
                        <ArrowRight className="w-3 h-3 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              <div className="flex justify-end">
                <Link
                  to={lp(`/catalog?q=${encodeURIComponent(query.trim())}`)}
                  className="group inline-flex items-center gap-1.5 py-1 text-xs font-semibold text-[#0057B8] hover:text-[#004494] transition-colors"
                >
                  <span>
                    {copy.openCatalog} ({results.length})
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
                </Link>
              </div>
            </>
          ) : (
            <p className="text-sm text-slate-600 bg-white border border-slate-200 rounded-lg p-4">
              {copy.empty}
            </p>
          )}
        </div>
      )}
    </section>
  );
};
