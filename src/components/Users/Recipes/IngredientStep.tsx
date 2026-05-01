import { useState } from 'react';
import { useTranslation } from 'next-i18next';

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
  const [openCat, setOpenCat] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

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
    <div className="min-h-screen bg-myGrey-200">
      <div className="max-w-3xl lg:max-w-5xl mx-auto px-6 pt-10 pb-24">
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-myBlue-200 border-t-transparent" />
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3 mb-6">
              <button
                onClick={onBack}
                className="flex h-7 bg-myGrey-100  w-7 items-center justify-center rounded-full transition"
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
              <h2 className="text-xl  font-bold text-white ">
                {t('ingredientCategories.title')}
              </h2>
            </div>

            <div className="flex flex-col gap-2">
              {categoryKeys.map((catName) => {
                const isOpen = openCat === catName;
                const items = ingredientsByCategory.get(catName) ?? [];

                return (
                  <div
                    key={catName}
                    className="rounded-2xl  bg-myBlue-100 overflow-hidden"
                    style={{
                      border: isOpen
                        ? '1.5px solid #377CC3'
                        : '1.5px solid transparent',
                    }}
                  >
                    <button
                      onClick={() => setOpenCat(isOpen ? null : catName)}
                      className="w-full flex items-center justify-between px-5 py-3.5 text-sm font-bold text-myGrey-200 transition"
                    >
                      <span>{getCatLabel(catName)}</span>
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
                                setError(null);
                              }}
                              className="rounded-xl px-4 py-3 cursor-pointer transition"
                              style={{
                                backgroundColor: sel ? '#377CC3' : '#323c4a',
                              }}
                            >
                              <p className="text-sm font-bold text-white truncate">
                                {name}
                              </p>
                              {item.caloriesPer100g != null &&
                                item.caloriesPer100g > 0 && (
                                  <p
                                    className="text-xs mt-0.5"
                                    style={{ color: 'rgba(255,255,255,0.45)' }}
                                  >
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
            </div>

            <div className="text-center mt-6 mb-4 min-h-[1.5rem]">
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
    </div>
  );
}
