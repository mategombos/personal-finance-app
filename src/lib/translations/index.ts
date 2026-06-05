import en from './en';
import hu from './hu';

export type Language = 'en' | 'hu';

type LeafKeys<T, Prefix extends string = ''> = {
  [K in keyof T]: T[K] extends string
    ? `${Prefix}${K & string}`
    : LeafKeys<T[K], `${Prefix}${K & string}.`>;
}[keyof T];

export type TranslationKey = LeafKeys<typeof en>;

type MakeStrings<T> = { [K in keyof T]: T[K] extends string ? string : MakeStrings<T[K]> };

const translations: Record<Language, MakeStrings<typeof en>> = { en, hu };

export function getT(lang: Language) {
  const dict = translations[lang];
  return function t(key: TranslationKey): string {
    const value = key.split('.').reduce((obj: unknown, k) => {
      return (obj as Record<string, unknown>)?.[k];
    }, dict);
    return (value as string) ?? key;
  };
}

export function interpolate(str: string, vars: Record<string, string>): string {
  return str.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? '');
}
