import Image from 'next/image';
import { useTranslation } from 'next-i18next';
import { Difficulty } from '../../../generated/graphql';
import { FormData, CATEGORY_OPTIONS } from './types';

// ─── LivePreview

interface LivePreviewProps {
  form: FormData;
  step: number;
  onBack: () => void;
  ingredientName: (id: number) => string;
}

export default function LivePreview({
  form,
  step,
  onBack,
  ingredientName,
}: LivePreviewProps) {
  const { t, i18n } = useTranslation('common');
  const lang = i18n.language as 'el' | 'en';

  const totalTime =
    (parseInt(form.prepTime) || 0) +
    (parseInt(form.cookTime) || 0) +
    (parseInt(form.restTime) || 0);

  const difficultyLabel =
    form.difficulty === Difficulty.Easy
      ? t('chef.create_recipe.easy')
      : form.difficulty === Difficulty.Medium
        ? t('chef.create_recipe.medium')
        : form.difficulty === Difficulty.Difficult
          ? t('chef.create_recipe.hard')
          : '';

  if (step === 1 && !form.title) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-sm text-gray-400 italic">
          {t('chef.create_recipe.preview_placeholder')}
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col overflow-y-auto">
      {/* Back button */}
      {step > 1 && (
        <button
          onClick={onBack}
          className="mb-3 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-white shadow transition hover:bg-gray-100"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="#3F4756"
            className="h-3.5 w-3.5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
            />
          </svg>
        </button>
      )}

      {/* Hero image */}
      <div
        className="relative w-full mb-3 flex-shrink-0 overflow-hidden rounded-xl bg-gray-200"
        style={{ height: '130px' }}
      >
        {form.image ? (
          <Image src={form.image} alt="recipe" fill className="object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-gray-400 text-xs">
            {t('chef.create_recipe.photo_slot')}
          </div>
        )}
      </div>

      {/* Personal note block */}
      {step >= 2 && form.personalNote && (
        <div className="mb-3 rounded-xl p-3 bg-myBlue-100 flex-shrink-0">
          <p className="mb-2 text-xs italic ">"{form.personalNote}"</p>
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-full bg-gray-300 flex-shrink-0" />
            <span className="text-xs font-semibold ">Chef</span>
          </div>
        </div>
      )}

      {/* Ingredients preview */}
      {step >= 4 && form.ingredients.some((i) => i.ingredientId > 0) && (
        <div className="mb-2 flex-shrink-0">
          <p className="text-xs font-bold mb-1">
            {t('chef.create_recipe.ingredients_label')}:
          </p>
          <ol className="flex flex-col gap-0.5 list-decimal list-inside">
            {form.ingredients
              .filter((i) => i.ingredientId > 0)
              .map((ing) => (
                <li key={ing.id} className="text-xs text-gray-600">
                  {ing.quantity && (
                    <span className="font-semibold">
                      {ing.quantity} {ing.unit}{' '}
                    </span>
                  )}
                  {ingredientName(ing.ingredientId)}
                </li>
              ))}
          </ol>
        </div>
      )}

      {/* Steps preview */}
      {step >= 5 && form.steps.some((s) => s.text) && (
        <div className="mb-2 flex-shrink-0">
          <p className="text-xs font-bold mb-1">
            {t('chef.create_recipe.execution_label')}:
          </p>
          <div className="flex flex-col gap-1">
            {form.steps
              .filter((s) => s.text)
              .map((s) => (
                <div key={s.id} className="flex items-start gap-1.5">
                  <div className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 rounded-full border border-gray-400" />
                  <span className="text-xs text-gray-600 leading-relaxed">
                    {s.text}
                  </span>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Mini cards */}
      {step >= 2 && (
        <div className="mt-auto flex flex-col gap-2 pt-2">
          {/* Recipe info card */}
          <div className="overflow-hidden bg-myGrey-200 rounded-xl">
            <div className="flex gap-2 p-2">
              <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-lg bg-gray-600">
                {form.image && (
                  <Image
                    src={form.image}
                    alt="dish"
                    fill
                    className="object-cover"
                  />
                )}
              </div>
              <div>
                <p className="text-xs font-bold text-white">
                  {form.title || t('chef.create_recipe.recipe_title_preview')}
                </p>
                {form.difficulty && (
                  <p className="text-xs text-gray-300">
                    {t('chef.recipe_detail.difficulty')} {difficultyLabel}
                  </p>
                )}
                {form.personalNote && (
                  <p className="text-xs text-gray-400 line-clamp-2 mt-0.5">
                    {form.personalNote}
                  </p>
                )}
                <div className="mt-1 flex items-center justify-between">
                  {totalTime > 0 && (
                    <span className="text-xs text-gray-300">
                      {t('chef.recipe_detail.time_label')} {totalTime}{' '}
                      {t('chef.create_recipe.minutes')}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Time card */}
          {(form.prepTime || form.cookTime || form.restTime) && (
            <div className="rounded-xl border border-gray-200 p-2 bg-white">
              <p className="text-center text-xs  font-bold mb-1">
                {t('chef.recipe_detail.implementation_time')} {totalTime}{' '}
                {t('chef.create_recipe.minutes')}
              </p>
              {form.prepTime && (
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">
                    {t('chef.create_recipe.prep_time')}
                  </span>
                  <span className="font-semibold text-myBlue-200">
                    {form.prepTime} {t('chef.create_recipe.minutes')}
                  </span>
                </div>
              )}
              {form.cookTime && (
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">
                    {t('chef.create_recipe.cook_time')}
                  </span>
                  <span className="font-semibold text-myBlue-200">
                    {form.cookTime} {t('chef.create_recipe.minutes')}
                  </span>
                </div>
              )}
              {form.restTime && (
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">
                    {t('chef.create_recipe.rest_time')}
                  </span>
                  <span className="font-semibold" style={{ color: '#377CC3' }}>
                    {form.restTime} {t('chef.create_recipe.minutes')}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Category card */}
          {step >= 3 && (form.category || form.cuisine) && (
            <div className="rounded-xl border border-gray-200 p-2 bg-white">
              <p className="text-center text-xs font-bold mb-1">
                {t('chef.recipe_detail.food_type')}
              </p>
              {form.category && (
                <div>
                  <p className="text-xs text-gray-500">
                    {t('chef.recipe_detail.dish_type')}
                  </p>
                  <p
                    className="text-xs font-medium italic border-b pb-0.5 mb-1"
                    style={{ color: '#377CC3', borderColor: '#B3D5F8' }}
                  >
                    {lang === 'el'
                      ? CATEGORY_OPTIONS.find((c) => c.value === form.category)
                          ?.labelEl
                      : CATEGORY_OPTIONS.find((c) => c.value === form.category)
                          ?.labelEn}
                  </p>
                </div>
              )}
              {form.cuisine && (
                <div>
                  <p className="text-xs text-gray-500">
                    {t('chef.recipe_detail.cuisine')}
                  </p>
                  <p
                    className="text-xs font-medium italic"
                    style={{ color: '#377CC3' }}
                  >
                    {form.cuisine}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
