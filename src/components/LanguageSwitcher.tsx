import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { LANGUAGES } from '../data/translations';
import { useLanguage } from '../hooks/useLanguage';
import { LanguageFlag } from './LanguageFlag';

interface LanguageSwitcherProps {
  compact?: boolean;
  dark?: boolean;
  variant?: 'pills' | 'dropdown';
  direction?: 'down' | 'up';
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  compact = false,
  dark = false,
  variant = 'pills',
  direction = 'down',
}) => {
  const { language, setLanguage } = useLanguage();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentLang = LANGUAGES.find((item) => item.code === language) || LANGUAGES[0];

  useEffect(() => {
    if (!open) return;
    const handleOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
      document.addEventListener('mousedown', handleOutside);
      window.addEventListener('keydown', handleEsc);
      return () => {
        document.removeEventListener('mousedown', handleOutside);
        window.removeEventListener('keydown', handleEsc);
      };
  }, [open]);

  if (variant === 'dropdown') {
    return (
      <div ref={containerRef} className="relative">
      <button
      type="button"
      onClick={() => setOpen((prev) => !prev)}
      aria-expanded={open}
      aria-haspopup="listbox"
      aria-label="Select language"
      className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-full border text-sm font-medium transition-all duration-150 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0057B8] ${
        dark
        ? 'bg-white/12 hover:bg-white/20 border-white/25 text-white backdrop-blur-sm'
        : 'bg-slate-100/80 hover:bg-slate-200/80 border-slate-200 text-slate-800'
      }`}
      >
      <LanguageFlag code={currentLang.code} className="w-[18px] h-3" />
      <span>{currentLang.label}</span>
      <ChevronDown
      className={`w-3.5 h-3.5 shrink-0 opacity-75 transition-transform duration-150 ${
        open ? 'rotate-180' : ''
      }`}
      />
      </button>

      {open && (
        <div
        role="listbox"
        aria-label="Language options"
        className={`absolute right-0 w-52 rounded-xl bg-white/95 backdrop-blur-xl border border-slate-200/90 shadow-xl p-1.5 z-50 ${
          direction === 'up' ? 'bottom-full mb-2' : 'top-full mt-2'
        }`}
        >
        {LANGUAGES.map((item) => {
          const active = language === item.code;
          return (
            <button
            key={item.code}
            type="button"
            role="option"
            aria-selected={active}
            onClick={() => {
              setLanguage(item.code);
              setOpen(false);
            }}
            className={`w-full px-3 py-2 rounded-lg text-left flex items-center justify-between gap-3 text-sm transition-colors ${
              active
              ? 'bg-slate-100 text-slate-900 font-semibold'
              : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
            }`}
            >
            <span className="flex items-center gap-2.5 min-w-0">
            <LanguageFlag code={item.code} className="w-5 h-3.5" />
            <span className="truncate">{item.nativeName}</span>
            <span className="text-[11px] font-mono uppercase text-slate-400 shrink-0">
            {item.label}
            </span>
            </span>
            {active && <Check className="w-4 h-4 text-[#0057B8] shrink-0" />}
            </button>
          );
        })}
        </div>
      )}
      </div>
    );
  }

  return (
    <div
    className={`inline-flex items-center gap-0.5 p-0.5 rounded-lg border transition-colors ${
      dark
      ? 'bg-white/10 border-white/20 backdrop-blur-xs'
      : 'bg-slate-100 border-slate-200/80'
    }`}
    role="group"
    aria-label="Language selector"
    >
    {LANGUAGES.map((item) => {
      const active = language === item.code;
      return (
        <button
        key={item.code}
        type="button"
        onClick={() => setLanguage(item.code)}
        title={item.nativeName}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#0057B8] ${
          active
          ? dark
          ? 'bg-white text-slate-900 shadow-xs'
          : 'bg-white text-[#0057B8] shadow-xs'
          : dark
          ? 'text-white/80 hover:text-white'
          : 'text-slate-600 hover:text-slate-900'
        }`}
        >
        <LanguageFlag code={item.code} className="w-4 h-3" />
        <span>{compact ? item.label : item.label}</span>
        </button>
      );
    })}
    </div>
  );
};
