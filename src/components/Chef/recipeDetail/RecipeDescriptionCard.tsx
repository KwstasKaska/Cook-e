import React from 'react';
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

export default function RecipeDescriptionCard({
  recipe,
  lang,
  isEditing,
  editForm,
  difficultyLabel,
  onUpdate,
}: Props) {
  const { t } = useTranslation('common');

  return (
    <div className="mb-6 rounded-xl p-4 bg-myBlue-100">
      {isEditing ? (
        <input
          value={editForm.title}
          onChange={(e) => onUpdate('title', e.target.value)}
          className="mb-2 w-full rounded-lg border border-blue-200 bg-white px-3 py-2 text-sm font-bold outline-none"
          placeholder={t('chef.recipe_detail.label_title')}
        />
      ) : (
        <h1 className="mb-1 text-xl font-black">
          {pick(recipe.title_el, recipe.title_en, lang)}
        </h1>
      )}

      {isEditing ? (
        <div className="mb-3 flex flex-wrap gap-2">
          {DIFFICULTY_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => onUpdate('difficulty', opt.value)}
              className="rounded-full px-3 py-0.5 text-xs font-semibold transition"
              style={{
                backgroundColor:
                  editForm.difficulty === opt.value ? '#EAB308' : 'white',
                color: editForm.difficulty === opt.value ? 'white' : '#3F4756',
              }}
            >
              {lang === 'el' ? opt.labelEl : opt.labelEn}
            </button>
          ))}
        </div>
      ) : difficultyLabel ? (
        <p className="mb-3 text-xs font-semibold text-myBlue-200">
          {t('chef.recipe_detail.difficulty')} {difficultyLabel}
        </p>
      ) : null}

      {isEditing ? (
        <>
          <textarea
            value={editForm.description}
            onChange={(e) => onUpdate('description', e.target.value)}
            rows={3}
            placeholder={t('chef.recipe_detail.placeholder_description')}
            className="mb-2 w-full resize-none rounded-lg border border-blue-200 bg-white px-3 py-2 text-sm outline-none"
          />
          <textarea
            value={editForm.chefComment}
            onChange={(e) => onUpdate('chefComment', e.target.value)}
            rows={2}
            placeholder={t('chef.recipe_detail.placeholder_chef_comment')}
            className="w-full resize-none rounded-lg border border-blue-200 bg-white px-3 py-2 text-sm italic outline-none"
          />
        </>
      ) : (
        <>
          {recipe.description_el && (
            <p className="mb-3 text-sm leading-relaxed">
              {pick(recipe.description_el, recipe.description_en ?? '', lang)}
            </p>
          )}
          {recipe.chefComment_el && (
            <p className="text-sm italic">
              "{pick(recipe.chefComment_el, recipe.chefComment_en ?? '', lang)}"
            </p>
          )}
        </>
      )}
    </div>
  );
}
