import { useState } from 'react';

type Ingredient = {
  id: number;
  name_el: string;
  name_en: string;
  caloriesPer100g?: number | null;
  category?: { id: number; name_el: string; name_en: string } | null;
};

export default function IngredientStep({
  categoryKeys,
  ingredientsByCategory,
  selectedIds,
  onToggle,
  loading,
  isEl,
  error,
  onClearError,
}: {
  categoryKeys: string[];
  ingredientsByCategory: Map<string, Ingredient[]>;
  selectedIds: number[];
  onToggle: (id: number) => void;
  loading: boolean;
  isEl: boolean;
  error?: string | null;
  onClearError?: () => void;
}) {
  const [openCat, setOpenCat] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-cookie-300 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {categoryKeys.map((catName) => {
        const isOpen = openCat === catName;
        const items = ingredientsByCategory.get(catName) ?? [];

        return (
          <div
            key={catName}
            className="rounded-2xl bg-surface overflow-hidden"
            style={{
              border: isOpen
                ? '1.5px solid #C9955A'
                : '1.5px solid transparent',
            }}
          >
            <button
              onClick={() => setOpenCat(isOpen ? null : catName)}
              className="w-full flex items-center justify-between px-5 py-3.5 transition"
            >
              <span>{catName}</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                className="h-4 w-4 transition-transform duration-200"
                style={{
                  transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                />
              </svg>
            </button>

            {isOpen && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 px-4 pb-4">
                {items.map((item) => {
                  const sel = selectedIds.includes(item.id);
                  const name = isEl ? item.name_el : item.name_en;
                  return (
                    <div
                      key={item.id}
                      onClick={() => {
                        onToggle(item.id);
                        onClearError?.();
                      }}
                      className={`rounded-xl border border-cookie-400 px-4 py-3 cursor-pointer transition ${
                        sel ? 'bg-cookie-200' : 'bg-surface'
                      }`}
                    >
                      <p className="truncate">{name}</p>
                      {item.caloriesPer100g != null &&
                        item.caloriesPer100g > 0 && (
                          <p className="mt-0.5 text-myText-muted">
                            {item.caloriesPer100g} Kcal/100g
                          </p>
                        )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}

      <div className="min-h-[1.5rem] mt-2">
        {error ? <p className="font-medium text-myRed">{error}</p> : null}
      </div>
    </div>
  );
}
