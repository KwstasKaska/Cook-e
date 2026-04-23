import { useTranslation } from 'next-i18next';

type IngredientRow = {
  ingredientId: number;
  quantity?: string | null;
  unit?: string | null;
  ingredient?: {
    name_el: string;
    name_en: string;
  } | null;
};

export default function IngredientsPanel({
  ingredients,
  totalTime,
  caloriesTotal,
  difficulty,
  checkedIngredients,
  addedToCart,
  onToggleIngredient,
  onAddToCart,
  isEl,
}: {
  ingredients: IngredientRow[];
  totalTime: number;
  caloriesTotal?: number | null;
  difficulty?: string | null;
  checkedIngredients: Set<number>;
  addedToCart: Set<number>;
  onToggleIngredient: (id: number) => void;
  onAddToCart: (id: number, quantity?: string, unit?: string) => void;
  isEl: boolean;
}) {
  const { t } = useTranslation('common');

  return (
    <div className="p-5">
      {/* Meta row */}
      <div className="mb-5 flex flex-col gap-2 border-b border-gray-100 pb-5">
        {totalTime > 0 && (
          <div
            className="flex items-center gap-2 text-sm"
            style={{ color: '#3F4756' }}
          >
            <span className="font-semibold">
              {t('chef.recipe_card.minutes')}:
            </span>
            <span>{totalTime}</span>
          </div>
        )}
        {caloriesTotal != null && (
          <div
            className="flex items-center gap-2 text-sm"
            style={{ color: '#3F4756' }}
          >
            <span className="font-semibold">Kcal:</span>
            <span>{Math.round(caloriesTotal)}</span>
          </div>
        )}
        {difficulty && (
          <div
            className="flex items-center gap-2 text-sm"
            style={{ color: '#3F4756' }}
          >
            <span className="font-semibold">
              {t('chef.recipe_card.difficulty')}
            </span>
            <span>{difficulty}</span>
          </div>
        )}
      </div>

      <h3 className="mb-4 text-xl font-bold" style={{ color: '#3F4756' }}>
        {t('chef.recipe_detail.ingredients')}
      </h3>

      {ingredients.length === 0 ? (
        <p className="text-sm text-gray-400">{t('common.no_results')}</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {ingredients.map((ing) => {
            const ingId = ing.ingredientId;
            const isChecked = checkedIngredients.has(ingId);
            const isAdded = addedToCart.has(ingId);
            const name = isEl
              ? ing.ingredient?.name_el
              : ing.ingredient?.name_en;
            const label = [ing.quantity, ing.unit, name]
              .filter(Boolean)
              .join(' ');

            return (
              <li key={ingId} className="flex items-center gap-3">
                {/* Checkbox */}
                <button
                  onClick={() => onToggleIngredient(ingId)}
                  className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border-2 transition"
                  style={{
                    borderColor: isChecked ? '#EAB308' : '#D1D5DB',
                    backgroundColor: isChecked ? '#EAB308' : 'transparent',
                  }}
                >
                  {isChecked && (
                    <svg viewBox="0 0 16 16" fill="none" className="h-3 w-3">
                      <path
                        d="M3 8l3.5 3.5L13 4"
                        stroke="white"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </button>

                {/* Name */}
                <span
                  className="flex-1 text-sm"
                  style={{
                    color: '#3F4756',
                    textDecoration: isChecked ? 'line-through' : 'none',
                    opacity: isChecked ? 0.5 : 1,
                  }}
                >
                  {label || String(ingId)}
                </span>

                {/* Add to cart button */}
                <button
                  onClick={() =>
                    onAddToCart(
                      ingId,
                      ing.quantity ?? undefined,
                      ing.unit ?? undefined,
                    )
                  }
                  className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full transition-all duration-150"
                  style={{
                    backgroundColor: isAdded ? '#86EFAC' : '#EAEAEA',
                    color: isAdded ? '#166534' : '#3F4756',
                  }}
                  title={t('cart.title')}
                >
                  {isAdded ? (
                    <svg
                      viewBox="0 0 16 16"
                      fill="none"
                      className="h-3.5 w-3.5"
                    >
                      <path
                        d="M3 8l3.5 3.5L13 4"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      className="h-3.5 w-3.5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
                      />
                    </svg>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
