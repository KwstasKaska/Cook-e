import { CATEGORY_OPTIONS } from './recipeUtils';

export const getCategoryLabel = (cat: string, lang: 'el' | 'en') => {
  const opt = CATEGORY_OPTIONS.find((o) => o.value === cat);
  if (!opt) return cat;
  return lang === 'el' ? opt.labelEl : opt.labelEn;
};
