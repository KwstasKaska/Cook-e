import React from 'react';
import Image from 'next/image';
import { useTranslation } from 'next-i18next';
import { pick } from '../../../utils/pick';
import { EditForm, DIFFICULTY_OPTIONS } from './types';

interface Props {
  recipe: any;
  lang: string;
  isEditing: boolean;
  editForm: EditForm;
  difficultyLabel: string;
  onUpdate: (field: keyof EditForm, value: unknown) => void;
}

export default function RecipeInfoCard({
  recipe,
  lang,
  isEditing,
  editForm,
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
      </div>
    </div>
  );
}
