// utils/categoryLabel.ts
import { CATEGORY_OPTIONS } from '../components/Chef/createRecipe/types';

export const getCategoryLabel = (cat: string, lang: 'el' | 'en') => {
  const opt = CATEGORY_OPTIONS.find((o) => o.value === cat);
  if (!opt) return cat;
  return lang === 'el' ? opt.labelEl : opt.labelEn;
};
