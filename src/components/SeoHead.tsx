import React, { useEffect } from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { Language } from '../types';

interface SeoHeadProps {
  title: string;
  description: string;
  canonicalHash?: string;
}

const HREFLANG_LANGS: Language[] = ['ru', 'be', 'en', 'zh'];

export const SeoHead: React.FC<SeoHeadProps> = ({ title, description, canonicalHash }) => {
  const { language } = useLanguage();

  useEffect(() => {
    document.title = title;
    document.documentElement.lang = language;

    const setMeta = (selector: string, attr: string, value: string) => {
      let el = document.querySelector(selector);
      if (!el) {
        el = document.createElement('meta');
        if (selector.includes('property=')) {
          el.setAttribute('property', selector.match(/property="([^"]+)"/)?.[1] || '');
        } else {
          el.setAttribute('name', selector.match(/name="([^"]+)"/)?.[1] || '');
        }
        document.head.appendChild(el);
      }
      el.setAttribute(attr, value);
    };

    setMeta('meta[name="description"]', 'content', description);
    setMeta('meta[property="og:title"]', 'content', title);
    setMeta('meta[property="og:description"]', 'content', description);

    if (canonicalHash !== undefined) {
      const normalizedPath = canonicalHash.startsWith('/') ? canonicalHash : `/${canonicalHash}`;

      let canonicalLink = document.querySelector('link[rel="canonical"]');
      if (!canonicalLink) {
        canonicalLink = document.createElement('link');
        canonicalLink.setAttribute('rel', 'canonical');
        document.head.appendChild(canonicalLink);
      }
      canonicalLink.setAttribute('href', `https://milk.by/#/${language}${normalizedPath === '/' ? '' : normalizedPath}`);

      const upsertAlternate = (hreflang: string, href: string) => {
        let alt = document.querySelector(`link[rel="alternate"][hreflang="${hreflang}"]`);
        if (!alt) {
          alt = document.createElement('link');
          alt.setAttribute('rel', 'alternate');
          alt.setAttribute('hreflang', hreflang);
          document.head.appendChild(alt);
        }
        alt.setAttribute('href', href);
      };

      HREFLANG_LANGS.forEach((langCode) => {
        upsertAlternate(
          langCode,
          `https://milk.by/#/${langCode}${normalizedPath === '/' ? '' : normalizedPath}`
        );
      });
      upsertAlternate(
        'x-default',
        `https://milk.by/#/ru${normalizedPath === '/' ? '' : normalizedPath}`
      );
    }
  }, [title, description, canonicalHash, language]);

  return null;
};
