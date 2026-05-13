import React from 'react';
import { useTranslation } from 'next-i18next';
import { pick } from '../../../utils/pick';
import { EditForm } from './types';
import { DIFFICULTY_OPTIONS } from '../../../utils/recipeUtils';

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
    <div className="mb-6 rounded-xl bg-cookie-100 p-4">
      {isEditing ? (
        <input
          value={editForm.title}
          onChange={(e) => onUpdate('title', e.target.value)}
          className="mb-2 w-full rounded-lg border border-cookie-200 bg-surface px-3 py-2  outline-none focus:border-cookie-400"
          placeholder={t('chef.recipe_detail.label_title')}
        />
      ) : (
        <h3 className="mb-1">{pick(recipe.title_el, recipe.title_en, lang)}</h3>
      )}

      {isEditing ? (
        <div className="mb-3 flex flex-wrap gap-2">
          {DIFFICULTY_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => onUpdate('difficulty', opt.value)}
              className={`rounded-full px-3 py-0.5   transition ${
                editForm.difficulty === opt.value
                  ? 'bg-cookie-400 text-white'
                  : 'bg-cookie-200 text-myText-base hover:bg-cookie-300 hover:text-white'
              }`}
            >
              {lang === 'el' ? opt.labelEl : opt.labelEn}
            </button>
          ))}
        </div>
      ) : difficultyLabel ? (
        <p className="mb-3   text-cookie-400">
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
            className="mb-2 w-full resize-none rounded-lg border border-cookie-200 bg-surface px-3 py-2 outline-none focus:border-cookie-400"
          />
          <textarea
            value={editForm.chefComment}
            onChange={(e) => onUpdate('chefComment', e.target.value)}
            rows={2}
            placeholder={t('chef.recipe_detail.placeholder_chef_comment')}
            className="w-full resize-none rounded-lg border border-cookie-200 bg-surface px-3 py-2  outline-none focus:border-cookie-400"
          />
        </>
      ) : (
        <>
          {recipe.description_el && (
            <p className="mb-3 ">
              {pick(recipe.description_el, recipe.description_en ?? '', lang)}
            </p>
          )}
          {recipe.chefComment_el && (
            <p className=" text-myText-muted">
              "{pick(recipe.chefComment_el, recipe.chefComment_en ?? '', lang)}"
            </p>
          )}
        </>
      )}
    </div>
  );
}
