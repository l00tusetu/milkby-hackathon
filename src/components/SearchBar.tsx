import React, { useMemo, useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, ArrowRight, Sparkles } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { useCatalogStore } from '../hooks/useCatalogStore';
import { runSmartSearch } from '../utils/smartMatch';
import { ImageWithFallback } from './ImageWithFallback';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSubmitSearch?: (value: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ value, onChange, onSubmitSearch }) => {
  const { t, localize, language } = useLanguage();
  const { products, categories } = useCatalogStore();
  const [focused, setFocused] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState(value);
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedQuery(value);
    }, 140);
    return () => window.clearTimeout(timer);
  }, [value]);

  useEffect(() => {
    setActiveIndex(-1);
  }, [debouncedQuery]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const searchResponse = useMemo(
    () => runSmartSearch(debouncedQuery, products, categories, language),
                                 [debouncedQuery, products, categories, language]
  );

  const suggestions = searchResponse.results.slice(0, 6);
  const showDropdown = focused && debouncedQuery.trim().length > 0;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setFocused(false);
      setActiveIndex(-1);
      return;
    }
    if (e.key === 'ArrowDown' && suggestions.length > 0) {
      e.preventDefault();
      setFocused(true);
      setActiveIndex((prev) => (prev + 1) % suggestions.length);
      return;
    }
    if (e.key === 'ArrowUp' && suggestions.length > 0) {
      e.preventDefault();
      setFocused(true);
      setActiveIndex((prev) => (prev <= 0 ? suggestions.length - 1 : prev - 1));
      return;
    }
    if (e.key === 'Enter') {
      if (activeIndex >= 0 && suggestions[activeIndex]) {
        e.preventDefault();
        setFocused(false);
        navigate(`/product/${suggestions[activeIndex].product.slug}`);
        return;
      }
      setFocused(false);
      if (onSubmitSearch) {
        onSubmitSearch(value.trim());
      }
    }
  };

  const copy = {
    ru: {
      empty: 'Прямых совпадений не найдено — попробуйте указать вкус, жирность или задачу (например, «для пиццы»).',
      allResults: 'Показать все результаты в каталоге',
      smartHint: 'Умный подбор:',
    },
    be: {
      empty: 'Прамых супадзенняў не знойдзена — паспрабуйце задаць густ, тлустасць або задачу (напрыклад, «для піцы»).',
      allResults: 'Паказаць усе вынікі ў каталогу',
      smartHint: 'Разумны падбор:',
    },
    en: {
      empty: 'No direct matches — try describing your need (e.g., "pizza cheese", "lactose-free", "butter 82.5").',
      allResults: 'View all matching results in catalog',
      smartHint: 'Smart match:',
    },
    zh: {
      empty: '未找到直接匹配 — 请尝试输入用途或特征（如“披萨奶酪”、“无乳糖”、“黄油 82.5”）。',
      allResults: '在目录中查看全部结果',
      smartHint: '智能匹配:',
    },
  }[language];

  return (
    <div ref={containerRef} className="relative w-full min-w-0">
    <div className="relative flex items-center">
    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
    <input
    type="text"
    role="combobox"
    aria-expanded={showDropdown}
    aria-controls="search-suggestions-listbox"
    aria-activedescendant={
      activeIndex >= 0 && suggestions[activeIndex]
      ? `search-option-${suggestions[activeIndex].product.id}`
      : undefined
    }
    value={value}
    onChange={(e) => {
      onChange(e.target.value);
      setFocused(true);
    }}
    onFocus={() => setFocused(true)}
    onKeyDown={handleKeyDown}
    placeholder={t('searchPlaceholder')}
    aria-label={t('searchPlaceholder')}
    className="w-full h-12 pl-10 pr-10 text-sm bg-white border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 shadow-sm focus:outline-none focus:border-[#0057B8] focus:ring-2 focus:ring-[#0057B8]/20 transition-all duration-200"
    />
    {value && (
      <button
      type="button"
      onClick={() => {
        onChange('');
        setDebouncedQuery('');
        setActiveIndex(-1);
        setFocused(false);
      }}
      aria-label="Clear search"
      className="absolute right-2.5 w-7 h-7 flex items-center justify-center rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
      >
      <X className="w-4 h-4" />
      </button>
    )}
    </div>

    {showDropdown && (
      <div className="absolute left-0 right-0 top-full mt-2 z-30 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden">
      {searchResponse.criteria.length > 0 && suggestions.length > 0 && (
        <div className="px-4 py-2 bg-blue-50/70 border-b border-blue-100 flex flex-wrap items-center gap-1.5 text-xs">
        <span className="inline-flex items-center gap-1 font-semibold text-[#0057B8]">
        <Sparkles className="w-3.5 h-3.5 shrink-0" />
        {copy.smartHint}
        </span>
        {searchResponse.criteria.map((c) => (
          <span
          key={c.id}
          className="px-2 py-0.5 rounded-md bg-white border border-blue-200/80 text-slate-700 font-medium"
          >
          {c.label}
          </span>
        ))}
        </div>
      )}

      {suggestions.length > 0 ? (
        <>
        <ul id="search-suggestions-listbox" className="divide-y divide-slate-100" role="listbox">
        {suggestions.map(({ product: item, recommendedPackage }, idx) => {
          const cat = categories.find((c) => c.id === item.category);
          const isActive = idx === activeIndex;
          return (
            <li
            key={item.id}
            id={`search-option-${item.id}`}
            role="option"
            aria-selected={isActive}
            >
            <button
            type="button"
            onMouseEnter={() => setActiveIndex(idx)}
            onClick={() => {
              setFocused(false);
              navigate(`/product/${item.slug}`);
            }}
            className={`w-full px-4 py-2.5 text-left flex items-center justify-between gap-3 transition-colors duration-150 ${
              isActive ? 'bg-blue-50/80' : 'hover:bg-slate-50'
            }`}
            >
            <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-100 border border-slate-200/80 shrink-0">
            <ImageWithFallback
            src={item.image}
            alt={localize(item.name)}
            className="w-full h-full object-cover"
            />
            </div>
            <div className="min-w-0">
            <div className="text-sm font-medium text-slate-900 truncate">
            {localize(item.name)}
            </div>
            <div className="text-xs text-slate-500 flex flex-wrap items-center gap-1.5 tabular-nums">
            <span className="text-[#0057B8] font-medium">
            {cat ? localize(cat.name) : item.category}
            </span>
            {item.fatContent !== undefined && (
              <>
              <span aria-hidden="true">·</span>
              <span>{item.fatContent}%</span>
              </>
            )}
            <span aria-hidden="true">·</span>
            <span>
            {recommendedPackage
              ? recommendedPackage.weight
              : item.packages.map((p) => p.weight).join(', ')}
              </span>
              </div>
              </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />
              </button>
              </li>
          );
        })}
        </ul>

        {onSubmitSearch && (
          <button
          type="button"
          onClick={() => {
            setFocused(false);
            onSubmitSearch(value.trim());
          }}
          className="w-full px-4 py-2.5 text-xs font-semibold text-[#0057B8] bg-slate-50 hover:bg-blue-50/70 border-t border-slate-100 flex items-center justify-between transition-colors"
          >
          <span>
          {copy.allResults} ({searchResponse.results.length})
          </span>
          <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
        </>
      ) : (
        <div className="px-4 py-3.5 text-xs text-slate-500">{copy.empty}</div>
      )}
      </div>
    )}
    </div>
  );
};
