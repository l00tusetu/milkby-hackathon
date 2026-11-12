import React, { useEffect } from 'react';
import { useLanguage } from '../hooks/useLanguage';

interface SeoHeadProps {
  title: string;
  description: string;
  canonicalHash?: string;
}

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
      let link = document.querySelector('link[rel="canonical"]');
      if (!link) {
        link = document.createElement('link');
        link.setAttribute('rel', 'canonical');
        document.head.appendChild(link);
      }
      link.setAttribute('href', `https://milk.by/#${canonicalHash}`);
    }
  }, [title, description, canonicalHash, language]);

  return null;
};
