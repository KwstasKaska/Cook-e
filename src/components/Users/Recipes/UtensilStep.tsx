import { useMemo, useState } from 'react';
import { useTranslation } from 'next-i18next';

type Utensil = {
  id: number;
  name_el: string;
  name_en: string;
  category_el: string;
  category_en: string;
};

const CAT_I18N: Record<string, string> = {
  'Cooking Vessels': 'cookingVessels',
  Utensils: 'utensils',
  'Extra Equipment': 'extraEquipment',
};

export default function UtensilStep({
  utensils,
  selectedIds,
  onToggle,
  onBack,
  onSearch,
  loading,
  isEl,
}: {
  utensils: Utensil[];
  selectedIds: number[];
  onToggle: (id: number) => void;
  onBack: () => void;
  onSearch: () => void;
  loading: boolean;
  isEl: boolean;
}) {
  const { t } = useTranslation('common');
  const [openCat, setOpenCat] = useState<string | null>(null);

  const getCatLabel = (catKey: string) => {
    const i18nKey = CAT_I18N[catKey];
    return i18nKey ? t(`utensils.${i18nKey}`) : catKey;
  };

  const grouped = useMemo(() => {
    const map = new Map<string, Utensil[]>();
    for (const u of utensils) {
      const key = u.category_en;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(u);
    }
    return map;
  }, [utensils]);

  const categoryKeys = useMemo(() => Array.from(grouped.keys()), [grouped]);

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
                className="flex h-7 w-7 bg-myGrey-100 items-center justify-center rounded-full transition"
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
              <h2 className=" text-xl font-bold text-white">
                {t('utensils.title')}
              </h2>
            </div>

            <div className="flex flex-col gap-2">
              {categoryKeys.map((catKey) => {
                const isOpen = openCat === catKey;
                const items = grouped.get(catKey) ?? [];

                return (
                  <div
                    key={catKey}
                    className="rounded-2xl bg-myBlue-100 overflow-hidden"
                    style={{
                      border: isOpen
                        ? '1.5px solid #377CC3'
                        : '1.5px solid transparent',
                    }}
                  >
                    <button
                      onClick={() => setOpenCat(isOpen ? null : catKey)}
                      className="w-full flex items-center justify-between px-5 py-3.5 text-sm font-bold text-myGrey-200 transition"
                    >
                      <span>{getCatLabel(catKey)}</span>
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
                        {items.map((u) => {
                          const sel = selectedIds.includes(u.id);
                          const name = isEl ? u.name_el : u.name_en;
                          return (
                            <div
                              key={u.id}
                              onClick={() => onToggle(u.id)}
                              className="rounded-xl px-4 py-3 cursor-pointer transition"
                              style={{
                                backgroundColor: sel ? '#377CC3' : '#323c4a',
                              }}
                            >
                              <p className="text-sm font-bold text-white truncate">
                                {name}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="flex justify-center mt-8">
              <button
                onClick={onSearch}
                className="rounded-full px-12 py-3 text-sm font-bold text-gray-800 transition hover:scale-105 bg-[#EAB308]"
              >
                {t('recipes.search')}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
