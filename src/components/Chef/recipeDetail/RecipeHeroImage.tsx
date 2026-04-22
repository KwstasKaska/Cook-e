import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { pick } from '../../../utils/pick';

interface Props {
  recipeImage?: string | null;
  title_el: string;
  title_en: string;
  lang: string;
}

export default function RecipeHeroImage({
  recipeImage,
  title_el,
  title_en,
  lang,
}: Props) {
  const { t } = useTranslation('common');
  const router = useRouter();

  return (
    <div className="relative h-56 md:h-72 w-full overflow-hidden bg-gray-200">
      <button
        onClick={() => router.back()}
        className="absolute left-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white shadow transition hover:bg-gray-100"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="#3F4756"
          className="h-4 w-4"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
          />
        </svg>
      </button>
      {recipeImage ? (
        <Image
          src={recipeImage}
          alt={pick(title_el, title_en, lang)}
          fill
          className="object-cover"
        />
      ) : (
        <div className="flex h-full items-center justify-center text-gray-400 text-sm">
          {t('chef.recipe_detail.no_image')}
        </div>
      )}
    </div>
  );
}
