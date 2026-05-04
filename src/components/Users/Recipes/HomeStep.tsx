import React from 'react';
import { useTranslation } from 'next-i18next';

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
    <div className="max-w-5xl mx-auto px-6 pt-10 pb-20">
      <div className="mb-10">
        <h1 className="text-white text-3xl md:text-4xl font-bold mb-1">
          {t('recipes.title')}
        </h1>
        <p className="text-gray-300 text-sm">{t('recipes.subtitle')}</p>
      </div>

      <div className="mb-12">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-white text-xl font-bold">
            {t('recipes.favourites')}
          </h2>
        </div>

        {favLoading ? (
          <div className="flex justify-center py-8">
            <div className="h-6 w-6 animate-spin rounded-full border-4 border-myBlue-200 border-t-transparent" />
          </div>
        ) : favorites.length === 0 && !hasPrev ? (
          <p className="text-gray-400 text-sm">{t('recipes.noFavourites')}</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {favorites.map((fav) => {
              const recipe = fav.recipe;
              if (!recipe) return null;
              const title = isEl ? recipe.title_el : recipe.title_en;
              const totalTime = (recipe.prepTime ?? 0) + (recipe.cookTime ?? 0);
              return (
                <div
                  key={fav.id}
                  onClick={() => onSelectRecipe(recipe.id)}
                  className="bg-white rounded-2xl shadow-md overflow-hidden hover:scale-105 transition-transform duration-200 cursor-pointer"
                >
                  <div className="relative h-32 w-full">
                    {recipe.recipeImage ? (
                      <img
                        src={recipe.recipeImage}
                        alt={title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div
                        className="flex h-full w-full items-center justify-center text-4xl"
                        style={{ backgroundColor: '#B3D5F8' }}
                      >
                        🍽️
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <h3 className="text-sm font-bold text-gray-800 leading-tight mb-2">
                      {title}
                    </h3>
                    {totalTime > 0 && (
                      <span className="text-xs text-gray-400">
                        {totalTime} {t('landing.minutes')}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {!favLoading && (hasPrev || hasMore) && (
          <div className="mt-6 flex justify-center gap-4">
            {hasPrev && onPrev && (
              <button
                onClick={onPrev}
                className="rounded-full px-8 py-2 text-sm font-bold transition hover:opacity-90"
                style={{ backgroundColor: '#B3D5F8', color: '#3F4756' }}
              >
                {t('common.prev')}
              </button>
            )}
            {hasMore && onNext && (
              <button
                onClick={onNext}
                className="rounded-full px-8 py-2 text-sm font-bold transition hover:opacity-90"
                style={{ backgroundColor: '#B3D5F8', color: '#3F4756' }}
              >
                {t('common.next')}
              </button>
            )}
          </div>
        )}
      </div>

      <div className="flex flex-col items-center gap-3 pt-4">
        <p className="text-gray-500 text-sm">{t('recipes.discoverPrompt')}</p>
        <button
          onClick={onStartPicker}
          className="flex items-center gap-3 px-10 py-4 rounded-full font-bold text-base text-gray-800 hover:scale-105 transition-transform shadow-xl"
          style={{ backgroundColor: '#EAB308' }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5"
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
        <p className="text-gray-400 text-xs">{t('recipes.discoverHint')}</p>
      </div>
    </div>
  );
}
