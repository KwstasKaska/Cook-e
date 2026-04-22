export const pick = (
  el: string | null | undefined,
  en: string | null | undefined,
  lang: string,
): string => (lang === 'en' ? en ?? el ?? '' : el ?? en ?? '');
