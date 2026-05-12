import React from 'react';
import { useTranslation } from 'next-i18next';
import PaginationControls from '../../Helper/PaginationControls';

type FavRecipe = {
  id: number;
  recipeId: number;
  recipe?: {
    id: number;
    title_el: string;
    title_en: string;
    recipeImage?: string | null;
    category?: string | null;
    prepTime?: number | null;
    cookTime?: number | null;
  } | null;
};

export default function HomeStep({
  favorites,
  favLoading,
  hasPrev,
  hasMore,
  onPrev,
  onNext,
  onStartPicker,
  onSelectRecipe,
  isEl,
}: {
  favorites: FavRecipe[];
  favLoading: boolean;
  hasPrev?: boolean;
  hasMore?: boolean;
  onPrev?: () => void;
  onNext?: () => void;
  onStartPicker: () => void;
  onSelectRecipe: (id: number) => void;
  isEl: boolean;
}) {
  const { t } = useTranslation('common');

  return (
    <div className="mx-auto max-w-5xl px-6 pb-20 pt-10">
      <div className="mb-10">
        <h1 className="mb-1 text-white">{t('recipes.title')}</h1>
        <p className="text-white opacity-80">{t('recipes.recipeHint1')}</p>
        <p className="mt-1 text-white opacity-80">{t('recipes.recipeHint2')}</p>
      </div>

      <div className="mb-12">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-white">{t('recipes.favourites')}</h2>
        </div>

        {favLoading ? (
          <div className="flex justify-center py-8">
            <div className="h-6 w-6 animate-spin rounded-full border-4 border-cookie-300 border-t-transparent" />
          </div>
        ) : favorites.length === 0 && !hasPrev ? (
          <p className="text-myText-muted">{t('recipes.noFavourites')}</p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {favorites.map((fav) => {
              const recipe = fav.recipe;
              if (!recipe) return null;
              const title = isEl ? recipe.title_el : recipe.title_en;
              const totalTime = (recipe.prepTime ?? 0) + (recipe.cookTime ?? 0);
              return (
                <div
                  key={fav.id}
                  onClick={() => onSelectRecipe(recipe.id)}
                  className="cursor-pointer overflow-hidden rounded-2xl bg-surface shadow-md transition-transform duration-200 hover:scale-105"
                >
                  <div className="relative h-32 w-full">
                    {recipe.recipeImage ? (
                      <img
                        src={recipe.recipeImage}
                        alt={title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-cookie-100 text-4xl">
                        🍽️
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <h5 className="mb-2 leading-tight">{title}</h5>
                    {totalTime > 0 && (
                      <span className="text-xs text-myText-muted">
                        {totalTime} {t('landing.minutes')}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {!favLoading && (
          <PaginationControls
            hasPrev={hasPrev ?? false}
            hasMore={hasMore ?? false}
            onPrev={onPrev ?? (() => {})}
            onNext={onNext ?? (() => {})}
          />
        )}
      </div>

      <div className="flex flex-col items-center gap-3 pt-4">
        <button
          onClick={onStartPicker}
          className="flex items-center gap-3 rounded-full bg-myYellow px-10 py-4 font-bold text-myText-heading shadow-xl transition-transform hover:scale-105"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z"
            />
          </svg>
          {t('recipes.discoverBtn')}
        </button>
        <p className="max-w-sm text-center text-xs text-white">
          {t('recipes.searchHint')}
        </p>
      </div>
    </div>
  );
}
