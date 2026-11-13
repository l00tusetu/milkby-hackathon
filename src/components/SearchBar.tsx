import React, { useMemo, useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, ArrowRight } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { useCatalogStore } from '../hooks/useCatalogStore';

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
    }, 180);
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

  const suggestions = useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase();
    if (!q) return [];
    return products
    .filter((p) => p.visible)
    .filter((p) => {
      const cat = categories.find((c) => c.id === p.category);
      const searchIndex = [
        p.name.ru,
        p.name.be,
        p.name.en,
        p.name.zh,
        p.description.ru,
        p.description.be,
        p.description.en,
        p.description.zh,
        cat?.name.ru || '',
        cat?.name.be || '',
        cat?.name.en || '',
        cat?.name.zh || '',
        p.packages.map((pkg) => pkg.weight).join(' '),
            p.useCases.join(' '),
            ...Object.values(p.characteristics).flatMap((c) => [c.ru, c.be, c.en, c.zh]),
      ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();
      return searchIndex.includes(q);
    })
    .slice(0, 6);
  }, [debouncedQuery, products, categories]);

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
        navigate(`/product/${suggestions[activeIndex].slug}`);
        return;
      }
      setFocused(false);
      if (onSubmitSearch) {
        onSubmitSearch(value.trim());
      }
    }
  };

  const emptyMessage = {
    ru: 'Прямых совпадений не найдено — попробуйте «Умный подбор».',
    be: 'Прамых супадзенняў не знойдзена — паспрабуйце «Разумны падбор».',
    en: 'No direct matches — try the Smart Product Matcher.',
    zh: '未找到直接匹配产品 — 请尝试智能选品助手。',
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
      ? `search-option-${suggestions[activeIndex].id}`
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
    className="w-full h-11 pl-10 pr-10 text-sm bg-white border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0057B8] focus:ring-2 focus:ring-[#0057B8]/15 transition-colors"
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
      className="absolute right-2.5 w-7 h-7 flex items-center justify-center rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100"
      >
      <X className="w-4 h-4" />
      </button>
    )}
    </div>

    {showDropdown && (
      <div className="absolute left-0 right-0 top-full mt-1.5 z-30 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden">
      {suggestions.length > 0 ? (
        <ul id="search-suggestions-listbox" className="divide-y divide-slate-100" role="listbox">
        {suggestions.map((item, idx) => {
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
            className={`w-full px-4 py-3 text-left flex items-center justify-between gap-4 transition-colors ${
              isActive ? 'bg-blue-50/80' : 'hover:bg-slate-50'
            }`}
            >
            <div className="min-w-0">
            <div className="text-sm font-medium text-slate-900 truncate">
            {localize(item.name)}
            </div>
            <div className="text-xs text-slate-500 flex flex-wrap items-center gap-1.5 tabular-nums">
            <span>{cat ? localize(cat.name) : item.category}</span>
            {item.fatContent !== undefined && (
              <>
              <span aria-hidden="true">·</span>
              <span>{item.fatContent}%</span>
              </>
            )}
            <span aria-hidden="true">·</span>
            <span>{item.packages.map((p) => p.weight).join(', ')}</span>
            </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />
            </button>
            </li>
          );
        })}
        </ul>
      ) : (
        <div className="px-4 py-3 text-xs text-slate-500">{emptyMessage}</div>
      )}
      </div>
    )}
    </div>
  );
};
