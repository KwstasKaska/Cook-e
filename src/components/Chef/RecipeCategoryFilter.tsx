import React from 'react';
import { useTranslation } from 'next-i18next';
import { RecipeCategory } from '../../generated/graphql';

const CATEGORIES: RecipeCategory[] = [
  RecipeCategory.Meat,
  RecipeCategory.Legumes,
  RecipeCategory.Seafood,
  RecipeCategory.Salads,
  RecipeCategory.Pasta,
  RecipeCategory.Appetizers,
  RecipeCategory.Vegan,
];

interface Props {
  activeCategory: RecipeCategory | null;
  onChange: (category: RecipeCategory | null) => void;
}

export default function RecipeCategoryFilter({
  activeCategory,
  onChange,
}: Props) {
  const { t } = useTranslation('common');

  return (
    <div className="flex flex-row flex-wrap gap-2 md:flex-col md:w-36 md:flex-none">
      {CATEGORIES.map((cat) => (
        <button
          key={cat}
          onClick={() => onChange(activeCategory === cat ? null : cat)}
          className="rounded-full border px-4 py-2 text-sm font-medium transition"
          style={{
            backgroundColor: activeCategory === cat ? '#3F4756' : 'white',
            borderColor: '#3F4756',
            color: activeCategory === cat ? 'white' : '#3F4756',
          }}
        >
          {t(`recipe_category.${cat}`)}
        </button>
      ))}
    </div>
  );
}
