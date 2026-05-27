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
      <h3 className="mb-3">{t('chef.recipe_detail.ingredients')}</h3>

      {isEditing ? (
        <div className="flex flex-col gap-3">
          {editForm.ingredients.map((ing: IngredientRow, i: number) => (
            <div
              key={i}
              className="flex flex-col gap-1 border-b border-cookie-100 pb-2"
            >
              <select
                value={ing.ingredientId}
                onChange={(e) => handleSelect(i, Number(e.target.value))}
                className="w-full bg-transparent outline-none"
                style={{ color: ing.ingredientId ? undefined : '#9C9080' }}
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
                  className="w-12 border-b border-cookie-200 bg-transparent text-center  outline-none placeholder:"
                />
                <select
                  value={ing.unit}
                  onChange={(e) => updateRow(i, { unit: e.target.value })}
                  className="w-16 bg-transparent outline-none"
                  style={{ color: ing.unit ? undefined : '#9C9080' }}
                >
                  <option value="">{t('chef.create_recipe.unit_label')}</option>
                  {UNIT_OPTIONS.map((u) => (
                    <option key={u} value={u}>
                      {t(`chef.create_recipe.units.${u}`)}
                    </option>
                  ))}
                </select>
                {editForm.ingredients.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeRow(i)}
                    className="ml-auto flex-shrink-0  transition hover:text-myRed"
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

          {fieldError && <p className="text-myRed">{fieldError}</p>}

          <button
            type="button"
            onClick={addRow}
            className="mt-1 w-full rounded-full border-2 border-cookie-400 px-5 py-2  text-cookie-400 transition hover:bg-cookie-400 hover:text-white sm:w-auto"
          >
            {t('chef.create_recipe.add_ingredient')}
          </button>
        </div>
      ) : (
        <div className="flex list-decimal list-inside flex-col gap-1.5">
          {(recipe.recipeIngredients ?? []).map((ri: any, i: number) => (
            <span key={i} className="text-myText-base">
              <span className="">
                {ri.quantity}{' '}
                {t(`chef.create_recipe.units.${ri.unit}`, {
                  defaultValue: ri.unit,
                })}
              </span>{' '}
              {pick(
                ri.ingredient?.name_el ?? '',
                ri.ingredient?.name_en ?? '',
                lang,
              )}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
