import { useTranslation } from 'next-i18next';
import { useIngredientsQuery } from '../../../generated/graphql';
import { FormData, IngredientRow, UNIT_OPTIONS } from './types';

interface StepFourProps {
  form: FormData;
  fieldErrors: Record<string, string>;
  onAddIngredient: () => void;
  onUpdateIngredient: (
    id: number,
    field: keyof IngredientRow,
    value: string | number,
  ) => void;
  onRemoveIngredient: (id: number) => void;
}

export default function StepFour({
  form,
  fieldErrors,
  onAddIngredient,
  onUpdateIngredient,
  onRemoveIngredient,
}: StepFourProps) {
  const { t, i18n } = useTranslation('common');
  const lang = i18n.language as 'el' | 'en';
  const { data: ingredientsData } = useIngredientsQuery();

  return (
    <div>
      <h2 className="mb-5 text-myYellow">
        {t('chef.create_recipe.step4_title')}
      </h2>

      <h3 className="mb-3">{t('chef.create_recipe.ingredients_label')}</h3>

      {fieldErrors.ingredients && (
        <p className="mb-2 text-myRed">{fieldErrors.ingredients}</p>
      )}

      <div className="flex flex-col gap-3">
        {form.ingredients.map((ing) => (
          <div
            key={ing.id}
            className="flex flex-col gap-1 border-b border-cookie-200 pb-2"
          >
            <select
              value={ing.ingredientId}
              onChange={(e) =>
                onUpdateIngredient(
                  ing.id,
                  'ingredientId',
                  Number(e.target.value),
                )
              }
              className="w-full bg-transparent outline-none"
              style={{ color: ing.ingredientId ? undefined : '#9C9080' }}
            >
              <option value={0}>
                {t('chef.create_recipe.select_ingredient')}
              </option>
              {(ingredientsData?.ingredients ?? []).map((i) => (
                <option key={i.id} value={i.id}>
                  {lang === 'el' ? i.name_el : i.name_en}
                </option>
              ))}
            </select>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={ing.quantity}
                onChange={(e) =>
                  onUpdateIngredient(ing.id, 'quantity', e.target.value)
                }
                placeholder="60"
                className="w-12 bg-transparent font-semibold outline-none placeholder: text-center border-b border-cookie-200"
              />
              <select
                value={ing.unit}
                onChange={(e) =>
                  onUpdateIngredient(ing.id, 'unit', e.target.value)
                }
                className="w-16 bg-transparent outline-none"
                style={{ color: ing.unit ? '#A0652A' : '#9C9080' }}
              >
                <option value="">{t('chef.create_recipe.unit_label')}</option>
                {UNIT_OPTIONS.map((u) => (
                  <option key={u} value={u}>
                    {t(`chef.create_recipe.units.${u}`)}
                  </option>
                ))}
              </select>
              {form.ingredients.length > 1 && (
                <button
                  type="button"
                  onClick={() => onRemoveIngredient(ing.id)}
                  className="ml-auto flex-shrink-0  hover:text-myRed transition-colors"
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
      </div>

      <button
        type="button"
        onClick={onAddIngredient}
        className="mt-5 rounded-full border-2 border-cookie-400 px-5 py-2 text-cookie-400 transition hover:bg-cookie-400 hover:text-white"
      >
        {t('chef.create_recipe.add_ingredient')}
      </button>
    </div>
  );
}
