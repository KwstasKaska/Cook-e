import React, { useState } from 'react';
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
  const [search, setSearch] = useState('');

  const filtered = search.trim()
    ? ingredients.filter((ing) => {
        const name = lang === 'el' ? ing.name_el : ing.name_en;
        return name.toLowerCase().includes(search.toLowerCase());
      })
    : [];

  const addIngredient = (ing: IngredientOption) => {
    const alreadyAdded = editForm.ingredients.some(
      (r) => r.ingredientId === ing.id,
    );
    if (alreadyAdded) return;
    const newRow: IngredientRow = {
      ingredientId: ing.id,
      quantity: '',
      unit: UNIT_OPTIONS[0],
      name_el: ing.name_el,
      name_en: ing.name_en,
    };
    onUpdate('ingredients', [...editForm.ingredients, newRow]);
    setSearch('');
  };

  return (
    <div className="mb-6">
      <h3 className="mb-3 text-lg font-black" style={{ color: '#3F4756' }}>
        {t('chef.recipe_detail.ingredients')}
      </h3>

      {isEditing ? (
        <div className="flex flex-col gap-2">
          {/* Ingredient rows */}
          {editForm.ingredients.map((ing: IngredientRow, i: number) => (
            <div
              key={ing.ingredientId}
              className="flex items-center gap-2 border-b border-gray-100 pb-2"
            >
              <span
                className="flex-1 text-sm truncate"
                style={{ color: '#3F4756' }}
              >
                {lang === 'el' ? ing.name_el : ing.name_en}
              </span>
              <input
                type="text"
                value={ing.quantity}
                onChange={(e) => {
                  const updated = [...editForm.ingredients];
                  updated[i] = { ...updated[i], quantity: e.target.value };
                  onUpdate('ingredients', updated);
                }}
                placeholder="ποσ."
                className="w-14 rounded border border-gray-200 px-2 py-1 text-center text-sm outline-none"
                style={{ color: '#3F4756' }}
              />
              <select
                value={ing.unit}
                onChange={(e) => {
                  const updated = [...editForm.ingredients];
                  updated[i] = { ...updated[i], unit: e.target.value };
                  onUpdate('ingredients', updated);
                }}
                className="rounded border border-gray-200 px-1 py-1 text-xs outline-none"
                style={{ color: '#3F4756' }}
              >
                {UNIT_OPTIONS.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() =>
                  onUpdate(
                    'ingredients',
                    editForm.ingredients.filter((_, idx) => idx !== i),
                  )
                }
                className="text-gray-300 hover:text-red-400 transition-colors flex-shrink-0"
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
            </div>
          ))}

          {/* Field error */}
          {fieldError && <p className="text-xs text-red-500">{fieldError}</p>}

          {/* Ingredient search */}
          <div className="relative mt-2">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('chef.create_recipe.search_ingredients')}
              className="w-full rounded-full border border-gray-200 px-4 py-2 text-sm outline-none focus:border-blue-300"
              style={{ color: '#3F4756' }}
            />
            {filtered.length > 0 && (
              <ul className="absolute z-20 mt-1 w-full rounded-xl border border-gray-100 bg-white shadow-lg max-h-48 overflow-y-auto">
                {filtered.slice(0, 8).map((ing) => (
                  <li key={ing.id}>
                    <button
                      type="button"
                      onClick={() => addIngredient(ing)}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition"
                      style={{ color: '#3F4756' }}
                    >
                      {lang === 'el' ? ing.name_el : ing.name_en}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <p className="text-xs text-gray-400 italic mt-1">
            {t('chef.recipe_detail.ingredients_edit_note')}
          </p>
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
