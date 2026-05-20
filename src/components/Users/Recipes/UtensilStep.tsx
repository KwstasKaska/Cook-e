import { useMemo, useState } from 'react';
import { GiCookingPot, GiKnifeFork, GiBlender } from 'react-icons/gi';
import { HiOutlineX } from 'react-icons/hi';

type Utensil = {
  id: number;
  name_el: string;
  name_en: string;
  category_el: string;
  category_en: string;
};

const CATEGORY_ICONS: Record<string, JSX.Element> = {
  'Cooking Vessels': <GiCookingPot className="h-7 w-7" />,
  Utensils: <GiKnifeFork className="h-7 w-7" />,
  'Extra Equipment': <GiBlender className="h-7 w-7" />,
};

const EN_KEYS: Record<string, string> = {
  Βοηθητικά: 'Extra Equipment',
  Σκεύη: 'Utensils',
  'Σκεύη Μαγειρέματος': 'Cooking Vessels',
};

const getCategoryIcon = (name: string): JSX.Element =>
  CATEGORY_ICONS[name] ??
  CATEGORY_ICONS[EN_KEYS[name]] ?? <GiKnifeFork className="h-7 w-7" />;

export default function UtensilStep({
  utensils,
  selectedIds,
  onToggle,
  loading,
  isEl,
}: {
  utensils: Utensil[];
  selectedIds: number[];
  onToggle: (id: number) => void;
  loading: boolean;
  isEl: boolean;
}) {
  const [openCat, setOpenCat] = useState<string | null>(null);

  const grouped = useMemo(() => {
    const map = new Map<string, Utensil[]>();
    for (const u of utensils) {
      const key = isEl ? u.category_el : u.category_en;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(u);
    }
    return map;
  }, [utensils, isEl]);

  const categoryKeys = useMemo(() => Array.from(grouped.keys()), [grouped]);

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-cookie-300 border-t-transparent" />
      </div>
    );
  }

  const selectedUtensils = utensils.filter((u) => selectedIds.includes(u.id));

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-3 gap-2">
        {categoryKeys.map((catKey) => {
          const isOpen = openCat === catKey;

          return (
            <button
              key={catKey}
              onClick={() => setOpenCat(isOpen ? null : catKey)}
              className={`flex flex-col items-center justify-center gap-2 rounded-2xl border-2 px-2 py-4 transition ${
                isOpen
                  ? 'border-cookie-400 bg-cookie-100 text-cookie-400'
                  : 'border-cookie-200 bg-surface  hover:border-cookie-300 hover:text-cookie-300'
              }`}
            >
              {getCategoryIcon(catKey)}
              <span className="text-center">{catKey}</span>
            </button>
          );
        })}
      </div>

      {openCat && (
        <div className="rounded-2xl border-2 border-cookie-400 bg-surface p-3">
          <p className="mb-2 px-1  ">{openCat}</p>
          <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
            {(grouped.get(openCat) ?? []).map((u) => {
              const sel = selectedIds.includes(u.id);
              const name = isEl ? u.name_el : u.name_en;
              return (
                <div
                  key={u.id}
                  onClick={() => onToggle(u.id)}
                  className={`cursor-pointer rounded-xl border px-3 py-2 transition ${
                    sel
                      ? 'border-cookie-400 bg-cookie-200'
                      : 'border-cookie-200 bg-surface hover:border-cookie-300'
                  }`}
                >
                  <p className="truncate ">{name}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="min-h-[52px] rounded-2xl border-2 border-cookie-200 bg-surface px-4 py-3">
        {selectedUtensils.length === 0 ? (
          <p className=" ">
            {isEl
              ? 'Δεν έχεις επιλέξει σκεύη ακόμα.'
              : 'No utensils selected yet.'}
          </p>
        ) : (
          <div className="flex flex-wrap gap-1.5">
            {selectedUtensils.map((u) => (
              <button
                key={u.id}
                onClick={() => onToggle(u.id)}
                className="flex items-center gap-1 rounded-full border border-cookie-400 bg-cookie-100 px-2.5 py-0.5  transition hover:bg-cookie-400 hover:text-white"
              >
                {isEl ? u.name_el : u.name_en}
                <HiOutlineX className="h-3 w-3 flex-shrink-0" />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
