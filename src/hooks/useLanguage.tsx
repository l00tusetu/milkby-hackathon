import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Language, LocalizedText } from '../types';
import { defaultTranslations } from '../data/translations';

interface LanguageContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  localize: (text?: Partial<LocalizedText> | null) => string;
  translations: Record<string, LocalizedText>;
  updateTranslation: (key: string, lang: Language, value: string) => void;
  resetTranslations: () => void;
}

const STORAGE_LANG_KEY = 'milk_world_lang';
const STORAGE_TRANS_KEY = 'milk_world_translations_v2';

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_LANG_KEY) as Language | null;
      if (saved && ['ru', 'be', 'en', 'zh'].includes(saved)) {
        return saved;
      }
    } catch {
      // ignore storage errors
    }
    return 'ru';
  });

  const [translations, setTranslations] = useState<Record<string, LocalizedText>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_TRANS_KEY);
      if (saved) {
        return { ...defaultTranslations, ...JSON.parse(saved) };
      }
    } catch {
      // ignore storage errors
    }
    return defaultTranslations;
  });

  useEffect(() => {
    document.documentElement.lang = language;
    try {
      localStorage.setItem(STORAGE_LANG_KEY, language);
    } catch {
      // ignore
    }
  }, [language]);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
  }, []);

  const t = useCallback(
    (key: string): string => {
      const entry = translations[key];
      if (!entry) return key;
      return entry[language] || entry.ru || entry.en || key;
    },
    [language, translations]
  );

  const localize = useCallback(
    (text?: Partial<LocalizedText> | null): string => {
      if (!text) return '';
      return text[language] || text.ru || text.en || text.be || text.zh || '';
    },
    [language]
  );

  const updateTranslation = useCallback((key: string, lang: Language, value: string) => {
    setTranslations((prev) => {
      const updated = {
        ...prev,
        [key]: {
          ...(prev[key] || { ru: '', be: '', en: '', zh: '' }),
                    [lang]: value,
        },
      };
      try {
        localStorage.setItem(STORAGE_TRANS_KEY, JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  }, []);

  const resetTranslations = useCallback(() => {
    setTranslations(defaultTranslations);
    try {
      localStorage.removeItem(STORAGE_TRANS_KEY);
    } catch {
      // ignore
    }
  }, []);

  return (
    <LanguageContext.Provider
    value={{
      language,
      setLanguage,
      t,
      localize,
      translations,
      updateTranslation,
      resetTranslations,
    }}
    >
    {children}
    </LanguageContext.Provider>
  );
};

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return ctx;
}
