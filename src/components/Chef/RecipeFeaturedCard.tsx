import React from 'react';
import { useTranslation } from 'next-i18next';
import { Recipe } from '../../generated/graphql';
import { pick } from '../../utils/pick';
import { recipeImageSrc, totalDuration } from '../../utils/recipeHelpers';

interface Props {
  recipe: Recipe;
  lang: string;
  onClick: () => void;
}

export default function RecipeFeaturedCard({ recipe, lang, onClick }: Props) {
  const { t } = useTranslation('common');
  const title = pick(recipe.title_el, recipe.title_en, lang);
  const description = pick(
    recipe.description_el ?? '',
    recipe.description_en ?? '',
    lang,
  );
  const duration = totalDuration(recipe);

  return (
    <button
      onClick={onClick}
      className="flex w-full flex-col overflow-hidden rounded-2xl bg-white text-left shadow-lg transition hover:shadow-xl hover:-translate-y-1"
    >
      <div className="relative h-52 w-full overflow-hidden">
        <img
          src={recipeImageSrc(recipe.recipeImage)}
          alt={title}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-bold" style={{ color: '#3F4756' }}>
          {title}
        </h3>
        <p className="mt-1 text-sm leading-relaxed text-gray-500 line-clamp-4">
          {description}
        </p>
        <div className="mt-3 flex items-center gap-4 text-sm text-gray-500">
          <span>
            {t('chef.recipes.duration')}{' '}
            <span className="font-bold text-gray-700">
              {duration} {t('chef.recipes.minutes')}
            </span>
          </span>
        </div>
      </div>
    </button>
  );
}
