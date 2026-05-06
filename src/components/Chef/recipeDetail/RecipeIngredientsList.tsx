import React from 'react';
import { useTranslation } from 'next-i18next';
import { pick } from '../../../utils/pick';
import { EditForm, IngredientRow } from './types';
import { UNIT_OPTIONS } from '../createRecipe/types';

interface IngredientOption {
  id: number;
  name_el: string;
  name_en: string;
}

interface Props {
  recipe: any;
  lang: string;
  isEditing: boolean;
  editForm: EditForm;
  fieldError?: string;
  ingredients: IngredientOption[];
  onUpdate: (field: keyof EditForm, value: unknown) => void;
}

export default function RecipeIngredientsList({
  recipe,
  lang,
  isEditing,
  editForm,
  fieldError,
  ingredients,
  onUpdate,
}: Props) {
  const { t } = useTranslation('common');

  const updateRow = (i: number, patch: Partial<IngredientRow>) => {
    const updated = editForm.ingredients.map((row, idx) =>
      idx === i ? { ...row, ...patch } : row,
    );
    onUpdate('ingredients', updated);
  };

  const handleSelect = (i: number, id: number) => {
    const found = ingredients.find((ing) => ing.id === id);
    updateRow(i, {
      ingredientId: id,
      name_el: found?.name_el ?? '',
      name_en: found?.name_en ?? '',
    });
  };

  const addRow = () => {
    const newRow: IngredientRow = {
      ingredientId: 0,
      quantity: '',
      unit: UNIT_OPTIONS[0],
      name_el: '',
      name_en: '',
    };
    onUpdate('ingredients', [...editForm.ingredients, newRow]);
  };

  const removeRow = (i: number) =>
    onUpdate(
      'ingredients',
      editForm.ingredients.filter((_, idx) => idx !== i),
    );

  return (
    <div className="mb-6">
      <h3 className="mb-3 text-lg font-black">
        {t('chef.recipe_detail.ingredients')}
      </h3>

      {isEditing ? (
        <div className="flex flex-col gap-3">
          {editForm.ingredients.map((ing: IngredientRow, i: number) => (
            <div
              key={i}
              className="flex flex-col gap-1 border-b border-gray-100 pb-2"
            >
              <select
                value={ing.ingredientId}
                onChange={(e) => handleSelect(i, Number(e.target.value))}
                className="w-full bg-transparent text-sm outline-none"
                style={{ color: ing.ingredientId ? '#3F4756' : '#9CA3AF' }}
              >
                <option value={0}>
                  {t('chef.create_recipe.select_ingredient')}
                </option>
                {ingredients.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {lang === 'el' ? opt.name_el : opt.name_en}
                  </option>
                ))}
              </select>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={ing.quantity}
                  onChange={(e) => updateRow(i, { quantity: e.target.value })}
                  placeholder="60"
                  className="w-12 bg-transparent text-sm font-semibold outline-none placeholder:text-gray-300 text-center border-b border-gray-200"
                />
                <select
                  value={ing.unit}
                  onChange={(e) => updateRow(i, { unit: e.target.value })}
                  className="w-16 bg-transparent text-sm outline-none"
                  style={{ color: ing.unit ? '#3F4756' : '#9CA3AF' }}
                >
                  <option value="">{t('chef.create_recipe.unit_label')}</option>
                  {UNIT_OPTIONS.map((u) => (
                    <option key={u} value={u}>
                      {u}
                    </option>
                  ))}
                </select>
                {editForm.ingredients.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeRow(i)}
                    className="ml-auto flex-shrink-0 text-gray-300 hover:text-red-400 transition-colors"
                  >
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          ))}

          {fieldError && <p className="text-xs text-red-500">{fieldError}</p>}

          <button
            type="button"
            onClick={addRow}
            className="mt-1 rounded-full border border-myGrey-200 px-5 py-2 text-sm font-semibold transition hover:bg-gray-50 w-full sm:w-auto"
          >
            {t('chef.create_recipe.add_ingredient')}
          </button>
        </div>
      ) : (
        <ol className="flex flex-col gap-1.5 list-decimal list-inside">
          {(recipe.recipeIngredients ?? []).map((ri: any, i: number) => (
            <li key={i} className="text-sm text-gray-600">
              <span className="font-semibold">
                {ri.quantity} {ri.unit}
              </span>{' '}
              {pick(
                ri.ingredient?.name_el ?? '',
                ri.ingredient?.name_en ?? '',
                lang,
              )}
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
