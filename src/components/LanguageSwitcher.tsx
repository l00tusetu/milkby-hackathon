import React from 'react';
import { LANGUAGES } from '../data/translations';
import { useLanguage } from '../hooks/useLanguage';

interface LanguageSwitcherProps {
  compact?: boolean;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ compact = false }) => {
  const { language, setLanguage } = useLanguage();

  return (
    <div
      className="inline-flex items-center gap-0.5 p-0.5 bg-slate-100 rounded-lg border border-slate-200/80"
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
            className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#0057B8] ${
              active
                ? 'bg-white text-[#0057B8] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {compact ? item.label : item.label}
          </button>
        );
      })}
    </div>
  );
};
