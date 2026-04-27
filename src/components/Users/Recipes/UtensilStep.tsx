import { useTranslation } from 'next-i18next';

const UTENSIL_CAT_I18N: Record<string, string> = {
  pot: 'pot',
  pan: 'pan',
  dutchOven: 'dutchOven',
  wok: 'wok',
  mortar: 'mortar',
  knives: 'knives',
  pressureCooker: 'pressureCooker',
  other: 'otherUtensils',
};

type Utensil = {
  id: number;
  name_el: string;
  name_en: string;
  category_el: string;
  category_en: string;
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
  const selected = utensils.filter((u) => selectedIds.includes(u.id));

  const getUtensilLabel = (u: Utensil) => {
    const catKey = isEl ? u.category_el : u.category_en;
    const i18nKey = UTENSIL_CAT_I18N[catKey];
    if (i18nKey) return t(`utensils.${i18nKey}`);
    return isEl ? u.name_el : u.name_en;
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#3F4756' }}>
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
                  {t('utensils.title')}
                </h2>
              </div>
              <div className="flex flex-col gap-2.5">
                {utensils.map((u) => {
                  const sel = selectedIds.includes(u.id);
                  return (
                    <button
                      key={u.id}
                      onClick={() => onToggle(u.id)}
                      className="w-full rounded-full py-2.5 text-sm font-bold transition-all duration-150"
                      style={{
                        backgroundColor: sel ? '#EAB308' : '#377CC3',
                        color: 'white',
                      }}
                    >
                      {getUtensilLabel(u)}
                    </button>
                  );
                })}
              </div>
            </div>

            {selected.length > 0 && (
              <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {selected.map((u) => (
                  <div
                    key={u.id}
                    className="flex items-center gap-3 rounded-xl px-4 py-3"
                    style={{ backgroundColor: '#2a3240' }}
                  >
                    <span className="text-sm font-bold text-white">
                      {getUtensilLabel(u)}
                    </span>
                  </div>
                ))}
              </div>
            )}

            <div className="flex justify-center">
              <button
                onClick={onSearch}
                className="rounded-full px-12 py-3 text-sm font-bold text-gray-800 transition hover:scale-105"
                style={{ backgroundColor: '#EAB308' }}
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
