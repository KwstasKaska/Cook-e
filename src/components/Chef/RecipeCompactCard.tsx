import React from 'react';
import { useTranslation } from 'next-i18next';
import { Recipe } from '../../generated/graphql';
import { pick } from '../../utils/pick';
import { recipeImageSrc, totalDuration } from '../../utils/recipeHelpers';

interface Props {
  recipe: Recipe;
  lang: string;
  onClick: () => void;
  dark?: boolean;
}

export default function RecipeCompactCard({
  recipe,
  lang,
  onClick,
  dark = false,
}: Props) {
  const { t } = useTranslation('common');
  const title = pick(recipe.title_el, recipe.title_en, lang);
  const duration = totalDuration(
    recipe.prepTime,
    recipe.cookTime,
    recipe.restTime,
  );

  return (
    <div
      className="overflow-hidden rounded-2xl"
      style={dark ? { backgroundColor: '#3F4756' } : {}}
    >
      <button
        onClick={onClick}
        className={`flex w-full items-center gap-3 p-3 text-left transition ${
          dark
            ? 'hover:opacity-90'
            : 'bg-white rounded-2xl shadow hover:shadow-md hover:-translate-y-0.5'
        }`}
      >
        <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-full">
          <img
            src={recipeImageSrc(recipe.recipeImage)}
            alt={title}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <p
            className="font-bold text-sm truncate"
            style={{ color: dark ? 'white' : '#3F4756' }}
          >
            {title}
          </p>
          <div
            className={`mt-1 flex items-center gap-3 text-xs ${
              dark ? 'text-gray-300' : 'text-gray-500'
            }`}
          >
            <span>
              {t('chef.recipes.duration')}{' '}
              <span
                className="font-bold"
                style={{ color: dark ? 'white' : '#374151' }}
              >
                {duration}
              </span>
            </span>
          </div>
        </div>
      </button>
    </div>
  );
}
