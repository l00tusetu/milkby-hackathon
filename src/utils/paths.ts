import { Language } from '../types';

export const SUPPORTED_LANGUAGES: Language[] = ['ru', 'be', 'en', 'zh'];

export function extractLangFromPath(pathname: string): Language | null {
  const match = pathname.match(/^\/(ru|be|en|zh)(?=\/|$)/);
  return match ? (match[1] as Language) : null;
}

export function stripLangPrefix(pathname: string): string {
  const cleaned = pathname.replace(/^\/?#?\/?(ru|be|en|zh)(?=\/|$)/, '');
  if (!cleaned) return '/';
  return cleaned.startsWith('/') ? cleaned : `/${cleaned}`;
}

export function buildLocalizedPath(path: string, lang: Language): string {
  const clean = path.replace(/^\/?#/, '').trim();
  const withSlash = clean.startsWith('/') ? clean : `/${clean}`;
  const stripped = stripLangPrefix(withSlash);
  return stripped === '/' ? `/${lang}/` : `/${lang}${stripped}`;
}
