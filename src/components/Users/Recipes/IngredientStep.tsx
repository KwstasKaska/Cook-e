import { useState } from 'react';
import {
  GiBroccoli,
  GiStrawberry,
  GiWheat,
  GiMilkCarton,
  GiMeat,
  GiOlive,
  GiPeas,
  GiCakeSlice,
  GiChiliPepper,
  GiCook,
} from 'react-icons/gi';
import { HiOutlineX } from 'react-icons/hi';

type Ingredient = {
  id: number;
  name_el: string;
  name_en: string;
  caloriesPer100g?: number | null;
  category?: { id: number; name_el: string; name_en: string } | null;
};

const CATEGORY_ICONS: Record<string, JSX.Element> = {
  'Meat & Seafood': <GiMeat className="h-7 w-7" />,
  'Fats & Oils': <GiOlive className="h-7 w-7" />,
  Dairy: <GiMilkCarton className="h-7 w-7" />,
  'Spices & Herbs': <GiChiliPepper className="h-7 w-7" />,
  Vegetables: <GiBroccoli className="h-7 w-7" />,
  Legumes: <GiPeas className="h-7 w-7" />,
  'Grains & Pasta': <GiWheat className="h-7 w-7" />,
  Fruits: <GiStrawberry className="h-7 w-7" />,
  'Sweets & Pastry': <GiCakeSlice className="h-7 w-7" />,
};

const EN_KEYS: Record<string, string> = {
  'Κρέας & Ψαρικά': 'Meat & Seafood',
  'Λίπη & Έλαια': 'Fats & Oils',
  Γαλακτοκομικά: 'Dairy',
  Μπαχαρικά: 'Spices & Herbs',
  Λαχανικά: 'Vegetables',
  Όσπρια: 'Legumes',
  'Δημητριακά & Ζυμαρικά': 'Grains & Pasta',
  Φρούτα: 'Fruits',
  'Γλυκά & Είδη ζαχαροπλαστικής': 'Sweets & Pastry',
};

const getCategoryIcon = (name: string): JSX.Element =>
  CATEGORY_ICONS[name] ??
  CATEGORY_ICONS[EN_KEYS[name]] ?? <GiCook className="h-7 w-7" />;

export default function IngredientStep({
  categoryKeys,
  ingredientsByCategory,
  selectedIds,
  onToggle,
  loading,
  isEl,
  error,
  onClearError,
  allIngredients,
}: {
  categoryKeys: string[];
  ingredientsByCategory: Map<string, Ingredient[]>;
  selectedIds: number[];
  onToggle: (id: number) => void;
  loading: boolean;
  isEl: boolean;
  error?: string | null;
  onClearError?: () => void;
  allIngredients: Ingredient[];
}) {
  const [openCat, setOpenCat] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-cookie-300 border-t-transparent" />
      </div>
    );
  }

  const selectedIngredients = allIngredients.filter((i) =>
    selectedIds.includes(i.id),
  );

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-3 gap-2">
        {categoryKeys.map((catName) => {
          const isOpen = openCat === catName;

          return (
            <button
              key={catName}
              onClick={() => {
                setOpenCat(isOpen ? null : catName);
                onClearError?.();
              }}
              className={`flex flex-col items-center justify-center gap-2 rounded-2xl border-2 px-2 py-4 transition ${
                isOpen
                  ? 'border-cookie-400 bg-cookie-100 text-cookie-400'
                  : 'border-cookie-200 bg-surface  hover:border-cookie-300 hover:text-cookie-300'
              }`}
            >
              {getCategoryIcon(catName)}
              <span className="text-center">{catName}</span>
            </button>
          );
        })}
      </div>

      {openCat && (
        <div className="rounded-2xl border-2 border-cookie-400 bg-surface p-3">
          <p className="mb-2 px-1  ">{openCat}</p>
          <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
            {(ingredientsByCategory.get(openCat) ?? []).map((item) => {
              const sel = selectedIds.includes(item.id);
              const name = isEl ? item.name_el : item.name_en;
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    onToggle(item.id);
                    onClearError?.();
                  }}
                  className={`cursor-pointer rounded-xl border px-3 py-2 transition ${
                    sel
                      ? 'border-cookie-400 bg-cookie-200'
                      : 'border-cookie-200 bg-surface hover:border-cookie-300'
                  }`}
                >
                  <p className="truncate">{name}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="min-h-[52px] rounded-2xl border-2 border-cookie-200 bg-surface px-4 py-3">
        {selectedIngredients.length === 0 ? (
          <p className=" ">
            {error ??
              (isEl
                ? 'Δεν έχεις επιλέξει υλικά ακόμα.'
                : 'No ingredients selected yet.')}
          </p>
        ) : (
          <div className="flex flex-wrap gap-1.5">
            {selectedIngredients.map((i) => (
              <button
                key={i.id}
                onClick={() => onToggle(i.id)}
                className="flex items-center gap-1 rounded-full border border-cookie-400 bg-cookie-100 px-2.5 py-0.5  transition hover:bg-cookie-400 hover:text-white"
              >
                {isEl ? i.name_el : i.name_en}
                <HiOutlineX className="h-3 w-3 flex-shrink-0" />
              </button>
            ))}
          </div>
        )}
        {error && selectedIngredients.length > 0 && (
          <p className="mt-1.5  text-myRed">{error}</p>
        )}
      </div>
    </div>
  );
}
