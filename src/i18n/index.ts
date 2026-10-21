import en from './en.json';

/**
 * Languages the site is built in. The first one is the default and lives at
 * the root (/games/...); every other one gets a prefix (/tr/games/...).
 *
 * To add Turkish: copy en.json to tr.json, translate it, import it below and
 * add it to `dictionaries` ({ en, tr }). Game files fall back to English for
 * any field that has no "tr" value.
 */
const dictionaries = { en } as const;

export type Locale = keyof typeof dictionaries;
export const locales = Object.keys(dictionaries) as Locale[];
export const defaultLocale: Locale = 'en';

export const localeNames: Record<string, string> = { en: 'English', tr: 'Türkçe' };

export type Dictionary = typeof en;

export function useTranslations(locale: Locale): Dictionary {
  return dictionaries[locale] ?? dictionaries[defaultLocale];
}

/** Replace {name}-style tokens in a UI string. */
export function fill(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, key) => String(values[key] ?? `{${key}}`));
}

/** Pick the right language from a game-file text field. */
export function pick(value: string | Record<string, string> | undefined, locale: Locale): string {
  if (value === undefined) return '';
  if (typeof value === 'string') return value;
  return value[locale] ?? value[defaultLocale] ?? Object.values(value)[0] ?? '';
}

/** Build an internal URL for a locale: href('tr', '/games/') -> '/tr/games/'. */
export function href(locale: Locale, path = '/'): string {
  const clean = path.startsWith('/') ? path : `/${path}`;
  return locale === defaultLocale ? clean : `/${locale}${clean}`;
}

/** getStaticPaths helper: one entry per locale for the [...lang] route segment. */
export function localeParams() {
  return locales.map((locale) => ({
    params: { lang: locale === defaultLocale ? undefined : locale },
    props: { locale },
  }));
}
