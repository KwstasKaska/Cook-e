import React from 'react';
import Image from 'next/image';
import { useTranslation } from 'next-i18next';
import { pick } from '../../../utils/pick';
import { EditForm, DIFFICULTY_OPTIONS } from './types';

const Stars = ({
  rating,
  size = 'sm',
}: {
  rating: number;
  size?: 'sm' | 'md';
}) => {
  const sz = size === 'md' ? 'h-5 w-5' : 'h-3.5 w-3.5';
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill={i < Math.round(rating) ? '#EAB308' : 'none'}
          stroke="#EAB308"
          strokeWidth={i < Math.round(rating) ? 0 : 1.5}
          className={sz}
        >
          <path
            fillRule="evenodd"
            d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
            clipRule="evenodd"
          />
        </svg>
      ))}
    </div>
  );
};

interface Props {
  recipe: any;
  lang: string;
  isEditing: boolean;
  editForm: EditForm;
  totalTime: number;
  difficultyLabel: string;
  onUpdate: (field: keyof EditForm, value: unknown) => void;
}

export default function RecipeInfoCard({
  recipe,
  lang,
  isEditing,
  editForm,
  totalTime,
  difficultyLabel,
  onUpdate,
}: Props) {
  const { t } = useTranslation('common');

  return (
    <div
      className="overflow-hidden rounded-2xl"
      style={{ backgroundColor: '#3F4756' }}
    >
      {recipe.recipeImage && (
        <div className="relative h-28 w-full overflow-hidden">
          <Image
            src={recipe.recipeImage}
            alt={pick(recipe.title_el, recipe.title_en, lang)}
            fill
            className="object-cover"
          />
        </div>
      )}
      <div className="p-4">
        {isEditing ? (
          <input
            value={editForm.title}
            onChange={(e) => onUpdate('title', e.target.value)}
            className="mb-1 w-full rounded border border-gray-600 bg-gray-700 px-2 py-1 text-sm font-bold text-white outline-none"
          />
        ) : (
          <h4 className="mb-1 font-bold text-white">
            {pick(recipe.title_el, recipe.title_en, lang)}
          </h4>
        )}
        {isEditing ? (
          <div className="mb-2 flex gap-1 flex-wrap">
            {DIFFICULTY_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => onUpdate('difficulty', opt.value)}
                className="rounded-full px-3 py-0.5 text-xs font-semibold transition"
                style={{
                  backgroundColor:
                    editForm.difficulty === opt.value ? '#EAB308' : '#4B5563',
                  color: 'white',
                }}
              >
                {lang === 'el' ? opt.labelEl : opt.labelEn}
              </button>
            ))}
          </div>
        ) : (
          <p className="mb-2 text-xs text-gray-300">
            {t('chef.recipe_detail.difficulty')} {difficultyLabel}
          </p>
        )}
        {recipe.description_el && (
          <p className="mb-3 text-xs leading-relaxed text-gray-400 line-clamp-3">
            {pick(recipe.description_el, recipe.description_en ?? '', lang)}
          </p>
        )}
        <div className="flex items-center justify-between">
          <Stars rating={0} size="sm" />
          <span className="text-xs text-gray-300">
            {t('chef.recipe_detail.time_label')} {totalTime}{' '}
            {t('chef.recipe_detail.minutes')}
          </span>
        </div>
      </div>
    </div>
  );
}
