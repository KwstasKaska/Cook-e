import React from 'react';
import { useTranslation } from 'next-i18next';
import { EditForm, CATEGORY_OPTIONS } from './types';
import { getCategoryLabel } from '../../../utils/categoryLabel';

interface Props {
  recipe: any;
  lang: 'el' | 'en';
  isEditing: boolean;
  editForm: EditForm;
  onUpdate: (field: keyof EditForm, value: unknown) => void;
}

export default function RecipeCategoryCard({
  recipe,
  lang,
  isEditing,
  editForm,
  onUpdate,
}: Props) {
  const { t } = useTranslation('common');

  if (!recipe.category) return null;

  return (
    <div className="rounded-2xl border border-cookie-400 p-4">
      <h4 className="mb-3 text-center ">{t('chef.recipe_detail.food_type')}</h4>
      <div className="flex flex-col gap-3">
        {recipe.category && (
          <div>
            <span className="">{t('chef.recipe_detail.dish_type')}</span>
            {isEditing ? (
              <div className="mt-1 flex flex-wrap gap-1">
                {CATEGORY_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() =>
                      onUpdate(
                        'category',
                        editForm.category === opt.value ? '' : opt.value,
                      )
                    }
                    className={`rounded-full px-2 py-0.5   transition ${
                      editForm.category === opt.value
                        ? 'bg-cookie-400 text-white'
                        : 'bg-cookie-100 text-myText-base hover:bg-cookie-300 hover:text-white'
                    }`}
                  >
                    {getCategoryLabel(opt.value, lang)}
                  </button>
                ))}
              </div>
            ) : (
              <p className="mt-0.5  border-cookie-400 pb-1   ">
                {getCategoryLabel(recipe.category, lang)}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
