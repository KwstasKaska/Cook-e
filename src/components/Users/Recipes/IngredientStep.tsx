import { useState } from 'react';
import { useTranslation } from 'next-i18next';
import DiagonalLayout from '../../Helper/DiagonalLayout';

const CAT_I18N: Record<string, string> = {
  Λαχανικά: 'vegetables',
  Φρούτα: 'fruits',
  'Ψωμί & Δημητριακά': 'breadGrains',
  Γαλακτοκομικά: 'dairy',
  'Κρεατικά/Αυγά/Ψαρικά/Θαλασσινά': 'meatEggsFishSeafood',
  'Λίπη & Λάδια': 'fatOils',
  Όσπρια: 'legumes',
  'Γλυκίσματα/Αναψυκτικά και σνακ': 'sweetsSnacks',
};

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
  onNext,
  onBack,
  loading,
  isEl,
}: {
  categoryKeys: string[];
  ingredientsByCategory: Map<string, Ingredient[]>;
  selectedIds: number[];
  onToggle: (id: number) => void;
  onNext: () => void;
  onBack: () => void;
  loading: boolean;
  isEl: boolean;
}) {
  const { t } = useTranslation('common');
  const [activeCat, setActiveCat] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const effectiveCat = activeCat ?? categoryKeys[0] ?? null;
  const items = effectiveCat
    ? ingredientsByCategory.get(effectiveCat) ?? []
    : [];

  const getCatLabel = (catName: string) => {
    const key = CAT_I18N[catName];
    return key ? t(`ingredientCategories.${key}`) : catName;
  };

  const handleNext = () => {
    if (selectedIds.length < 3) {
      setError(t('recipes.minIngredientsError'));
      return;
    }
    setError(null);
    onNext();
  };

  return (
    <DiagonalLayout whiteStart="50%">
      <div className="max-w-2xl mx-auto px-6 pt-10 pb-24">
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-myBlue-200 border-t-transparent" />
          </div>
        ) : (
          <>
            <div className="bg-gray-100 rounded-2xl shadow-xl p-6 mb-8">
              <div className="flex items-center gap-3 mb-5">
                <button
                  onClick={onBack}
                  className="flex h-7 w-7 items-center justify-center rounded-full transition"
                  style={{ backgroundColor: '#EAEAEA', color: '#3F4756' }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-4 w-4"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.72 12.53a.75.75 0 010-1.06l7.5-7.5a.75.75 0 111.06 1.06L9.31 12l6.97 6.97a.75.75 0 11-1.06 1.06l-7.5-7.5z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
                <h2 className="text-xl font-bold text-gray-800">
                  {t('ingredientCategories.title')}
                </h2>
              </div>
              <div className="flex flex-col gap-2.5">
                {categoryKeys.map((catName) => (
                  <button
                    key={catName}
                    onClick={() => setActiveCat(catName)}
                    className="w-full rounded-full py-2.5 text-sm font-bold transition-all duration-150"
                    style={{
                      backgroundColor:
                        effectiveCat === catName ? '#EAB308' : '#377CC3',
                      color: 'white',
                    }}
                  >
                    {getCatLabel(catName)}
                  </button>
                ))}
              </div>
            </div>

            {items.length > 0 && (
              <div className="mb-6">
                <h3 className="text-gray-800 text-sm font-bold mb-3 ml-1">
                  {effectiveCat ? getCatLabel(effectiveCat) : ''}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {items.map((item) => {
                    const sel = selectedIds.includes(item.id);
                    const name = isEl ? item.name_el : item.name_en;
                    return (
                      <div
                        key={item.id}
                        className="flex items-center gap-3 rounded-xl px-4 py-3 transition"
                        style={{ backgroundColor: sel ? '#377CC3' : '#2a3240' }}
                      >
                        <div className="flex-1 min-w-0">
                          <p className="truncate text-sm font-bold text-white">
                            {name}
                          </p>
                          {item.caloriesPer100g != null &&
                            item.caloriesPer100g > 0 && (
                              <p className="text-xs text-gray-300">
                                {item.caloriesPer100g} Kcal/100g
                              </p>
                            )}
                        </div>
                        <button
                          onClick={() => {
                            onToggle(item.id);
                            setError(null);
                          }}
                          className="flex-shrink-0 rounded-lg p-1.5 transition"
                          style={{
                            backgroundColor: sel
                              ? 'white'
                              : 'rgba(255,255,255,0.1)',
                            color: sel ? '#377CC3' : 'white',
                          }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={1.5}
                            className="h-4 w-4"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
                            />
                          </svg>
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="text-center mb-4 min-h-[1.5rem]">
              {error ? (
                <p className="text-sm font-medium" style={{ color: '#ED5B5B' }}>
                  {error}
                </p>
              ) : selectedIds.length > 0 ? (
                <p className="text-sm" style={{ color: '#B3D5F8' }}>
                  {selectedIds.length} {t('recipes.selectedIngredients')}
                </p>
              ) : null}
            </div>

            <div className="flex justify-center">
              <button
                onClick={handleNext}
                className="rounded-full px-12 py-3 text-sm font-bold text-gray-800 transition hover:scale-105"
                style={{ backgroundColor: '#EAB308' }}
              >
                {t('recipes.next')}
              </button>
            </div>
          </>
        )}
      </div>
    </DiagonalLayout>
  );
}
