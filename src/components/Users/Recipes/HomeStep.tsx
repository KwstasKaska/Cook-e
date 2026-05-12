import React from 'react';
import { useTranslation } from 'next-i18next';

export default function HomeStep({
  onStartPicker,
}: {
  onStartPicker: () => void;
  isEl: boolean;
}) {
  const { t } = useTranslation('common');

  return (
    <div className="mx-auto max-w-5xl px-6 pb-20 pt-10">
      <div className="mb-10">
        <h1 className="mb-1">{t('recipes.title')}</h1>
        <p className="opacity-80">{t('recipes.recipeHint1')}</p>
        <p className="mt-1 opacity-80">{t('recipes.recipeHint2')}</p>
      </div>

      <div className="flex flex-col items-center gap-3 pt-4">
        <button
          onClick={onStartPicker}
          className="flex items-center gap-3 rounded-xl border-2  px-8 py-4  shadow-xl border-cookie-400 transition-transform hover:text-white hover:bg-cookie-400"
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
        <p className="max-w-sm text-center text-sm text-myText-muted">
          {t('recipes.searchHint')}
        </p>
      </div>
    </div>
  );
}
