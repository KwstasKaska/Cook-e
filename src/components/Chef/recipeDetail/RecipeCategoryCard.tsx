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

  if (!recipe.category && !recipe.foodEthnicity) return null;

  return (
    <div className="rounded-2xl border border-gray-200 p-4">
      <h4 className="mb-3 text-center text-sm font-bold">
        {t('chef.recipe_detail.food_type')}
      </h4>
      <div className="flex flex-col gap-3">
        {recipe.category && (
          <div>
            <p className="text-xs text-gray-500">
              {t('chef.recipe_detail.dish_type')}
            </p>
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
                    className="rounded-full px-2 py-0.5 text-xs font-semibold transition"
                    style={{
                      backgroundColor:
                        editForm.category === opt.value ? '#377CC3' : '#E5E7EB',
                      color:
                        editForm.category === opt.value ? 'white' : '#3F4756',
                    }}
                  >
                    {getCategoryLabel(opt.value, lang)}
                  </button>
                ))}
              </div>
            ) : (
              <p className="mt-0.5 border-b border-myBlue-200 text-myBlue-200 pb-1 text-sm font-medium italic">
                {getCategoryLabel(recipe.category, lang)}
              </p>
            )}
          </div>
        )}
        {recipe.foodEthnicity && (
          <div>
            <p className="text-xs text-gray-500">
              {t('chef.recipe_detail.cuisine')}
            </p>
            {isEditing ? (
              <input
                value={editForm.foodEthnicity}
                onChange={(e) => onUpdate('foodEthnicity', e.target.value)}
                className="mt-0.5 w-full border-b pb-1 text-sm font-medium italic outline-none border-myYellow text-myBlue-200"
              />
            ) : (
              <p className="mt-0.5 text-sm font-medium italic text-myBlue-200">
                {recipe.foodEthnicity}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
