import { useState, useCallback } from 'react';
import Navbar from '../../components/Users/Navbar';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import {
  useMyCartQuery,
  useAddToCartMutation,
  useRemoveFromCartMutation,
  useIngredientsQuery,
} from '../../generated/graphql';
import ScrollToTopButton from '../../components/Helper/ScrollToTopButton';
import useIsUser from '../../utils/useIsUser';

export async function getServerSideProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}

export default function CartPage() {
  const { t } = useTranslation('common');
  const { locale } = useRouter();
  const isEl = locale === 'el';

  // ── Auth guard
  const { loading: authLoading, isAuthorized } = useIsUser();
  if (authLoading || !isAuthorized) return null;

  return <CartContent isEl={isEl} t={t} />;
}

// Split into inner component so hooks run after auth guard
function CartContent({
  isEl,
  t,
}: {
  isEl: boolean;
  t: ReturnType<typeof useTranslation>['t'];
}) {
  // ── State
  const [checkedIds, setCheckedIds] = useState<Set<number>>(new Set());
  const [search, setSearch] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [serverError, setServerError] = useState('');

  // ── Queries
  const { data, loading, refetch } = useMyCartQuery({
    fetchPolicy: 'network-only',
  });
  const { data: ingredientsData } = useIngredientsQuery({ skip: !showSearch });

  // ── Mutations
  const [addToCart] = useAddToCartMutation();
  const [removeFromCart] = useRemoveFromCartMutation();

  const items = data?.myCart ?? [];

  // ── Ingredient search results
  const filteredIngredients =
    search.trim().length > 0
      ? (ingredientsData?.ingredients ?? [])
          .filter((ing) =>
            (isEl ? ing.name_el : ing.name_en)
              .toLowerCase()
              .includes(search.toLowerCase()),
          )
          .slice(0, 8)
      : [];

  // ── Handlers
  const toggleChecked = (id: number) =>
    setCheckedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const handleRemove = useCallback(
    async (id: number) => {
      try {
        await removeFromCart({ variables: { id } });
        setCheckedIds((prev) => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
        await refetch();
      } catch {
        setServerError(t('cart.removeError'));
      }
    },
    [removeFromCart, refetch, t],
  );

  const handleClearChecked = useCallback(async () => {
    try {
      await Promise.all(
        [...checkedIds].map((id) => removeFromCart({ variables: { id } })),
      );
      setCheckedIds(new Set());
      await refetch();
    } catch {
      setServerError(t('cart.removeError'));
    }
  }, [checkedIds, removeFromCart, refetch, t]);

  const handleAddIngredient = useCallback(
    async (ingredientId: number) => {
      setServerError('');
      try {
        await addToCart({
          variables: { ingredientId, quantity: '100', unit: 'g' },
        });
        setSearch('');
        setShowSearch(false);
        await refetch();
      } catch {
        setServerError(t('cart.addError'));
      }
    },
    [addToCart, refetch, t],
  );

  const checkedCount = checkedIds.size;

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#3F4756' }}>
      <Navbar />

      <div className="relative overflow-hidden min-h-screen">
        <div className="relative z-10 max-w-2xl mx-auto px-6 pt-14 pb-20">
          {/* Heading */}
          <h2 className="text-white text-3xl md:text-4xl font-bold text-center mb-1">
            {t('cart.title')}
          </h2>
          <p className="text-gray-300 text-sm text-center mb-10">
            {t('cart.subtitle')}
          </p>

          {/* Server error */}
          {serverError && (
            <p className="mb-4 text-center text-sm font-semibold text-red-500">
              {serverError}
            </p>
          )}

          {/* Add item */}
          <div className="mb-6 relative">
            <div className="flex gap-2">
              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setShowSearch(true);
                }}
                onFocus={() => setShowSearch(true)}
                placeholder={t('cart.addIngredient')}
                className="flex-1 rounded-xl border-2 border-gray-200 px-4 py-2 text-sm text-gray-700 placeholder-gray-400 focus:border-myBlue-200 focus:outline-none"
              />
              <button
                onClick={() => {
                  setSearch('');
                  setShowSearch(false);
                }}
                className="rounded-xl px-4 py-2 text-sm font-bold text-white transition hover:scale-105"
                style={{ backgroundColor: '#377CC3' }}
              >
                ✕
              </button>
            </div>

            {/* Ingredient dropdown */}
            {showSearch && filteredIngredients.length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-1 z-20 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden">
                {filteredIngredients.map((ing) => (
                  <button
                    key={ing.id}
                    onClick={() => handleAddIngredient(ing.id)}
                    className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition border-b border-gray-50 last:border-0"
                  >
                    <span className="font-medium">
                      {isEl ? ing.name_el : ing.name_en}
                    </span>
                    {ing.caloriesPer100g && (
                      <span className="text-xs text-gray-400">
                        {ing.caloriesPer100g} kcal/100g
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Loading */}
          {loading ? (
            <div className="flex justify-center py-16">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-myBlue-200 border-t-transparent" />
            </div>
          ) : items.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-gray-200 p-10 text-center bg-white">
              <p className="text-gray-500">{t('cart.emptyCart')}</p>
            </div>
          ) : (
            <>
              {/* 2-column grid */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {items.map((item) => {
                  const isChecked = checkedIds.has(item.id);
                  const name = isEl
                    ? item.ingredient?.name_el ?? String(item.ingredientId)
                    : item.ingredient?.name_en ?? String(item.ingredientId);

                  return (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 rounded-2xl border-2 px-3 py-3 bg-white transition"
                      style={{
                        borderColor: isChecked ? '#B3D5F8' : '#EAEAEA',
                        backgroundColor: isChecked
                          ? 'rgba(179,213,248,0.15)'
                          : 'white',
                      }}
                    >
                      {/* Checkbox */}
                      <button
                        onClick={() => toggleChecked(item.id)}
                        className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded border-2 transition"
                        style={{
                          borderColor: isChecked ? '#377CC3' : '#3F4756',
                          backgroundColor: isChecked
                            ? '#377CC3'
                            : 'transparent',
                        }}
                      >
                        {isChecked && (
                          <svg
                            viewBox="0 0 16 16"
                            fill="none"
                            className="h-3 w-3"
                          >
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

                      {/* Name + quantity */}
                      <div className="flex-1 min-w-0">
                        <p
                          className="truncate text-sm font-bold md:text-base"
                          style={{
                            color: isChecked ? '#9CA3AF' : '#3F4756',
                            textDecoration: isChecked ? 'line-through' : 'none',
                          }}
                        >
                          {name}
                        </p>

                        {item.note && (
                          <p className="mt-1 text-xs text-gray-400 truncate">
                            {item.note}
                          </p>
                        )}
                      </div>

                      {/* Remove */}
                      <button
                        onClick={() => handleRemove(item.id)}
                        className="flex-shrink-0 text-gray-300 transition hover:text-red-400"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="h-4 w-4"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Footer */}
              <div
                className="mt-6 flex items-center justify-between border-t-2 pt-5"
                style={{ borderColor: '#EAEAEA' }}
              >
                <p className="text-sm text-gray-400">
                  {checkedCount}/{items.length} {t('cart.items')}
                </p>
                <button
                  onClick={handleClearChecked}
                  disabled={checkedCount === 0}
                  className="rounded-full border-2 px-5 py-2 text-sm font-bold transition"
                  style={{
                    borderColor: checkedCount > 0 ? '#ED5B5B' : '#EAEAEA',
                    color: checkedCount > 0 ? '#ED5B5B' : '#9CA3AF',
                    cursor: checkedCount > 0 ? 'pointer' : 'not-allowed',
                  }}
                  onMouseEnter={(e) => {
                    if (checkedCount > 0) {
                      e.currentTarget.style.backgroundColor = '#ED5B5B';
                      e.currentTarget.style.color = 'white';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color =
                      checkedCount > 0 ? '#ED5B5B' : '#9CA3AF';
                  }}
                >
                  {t('cart.clearSelected')}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
      <ScrollToTopButton />
    </div>
  );
}
