import { useState, useCallback, useMemo } from 'react';
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

  const { loading: authLoading, isAuthorized } = useIsUser();
  if (authLoading || !isAuthorized) return null;

  return <CartContent isEl={isEl} t={t} />;
}

function CartContent({
  isEl,
  t,
}: {
  isEl: boolean;
  t: ReturnType<typeof useTranslation>['t'];
}) {
  const [checkedIds, setCheckedIds] = useState<Set<number>>(new Set());
  const [openCategory, setOpenCategory] = useState<string | null>(null);

  const { data, loading, refetch } = useMyCartQuery({
    fetchPolicy: 'network-only',
  });
  const { data: ingredientsData } = useIngredientsQuery();
  const [addToCart] = useAddToCartMutation();
  const [removeFromCart] = useRemoveFromCartMutation();

  const items = data?.myCart ?? [];
  const cartIngredientIds = useMemo(
    () => new Set(items.map((i) => i.ingredientId)),
    [items],
  );

  const ingredientsByCategory = useMemo(() => {
    const all = ingredientsData?.ingredients ?? [];
    const map = new Map<string, typeof all>();
    for (const ing of all) {
      const key = isEl
        ? ing.category?.name_el ?? ''
        : ing.category?.name_en ?? '';
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(ing);
    }
    return map;
  }, [ingredientsData, isEl]);

  const toggleChecked = (id: number) =>
    setCheckedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const handleRemove = useCallback(
    async (id: number) => {
      await removeFromCart({ variables: { id } });
      setCheckedIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      await refetch();
    },
    [removeFromCart, refetch],
  );

  const handleClearChecked = useCallback(async () => {
    await Promise.all(
      [...checkedIds].map((id) => removeFromCart({ variables: { id } })),
    );
    setCheckedIds(new Set());
    await refetch();
  }, [checkedIds, removeFromCart, refetch]);

  const handleAdd = useCallback(
    async (ingredientId: number) => {
      await addToCart({ variables: { ingredientId } });
      await refetch();
    },
    [addToCart, refetch],
  );

  const checkedCount = checkedIds.size;

  return (
    <div className="min-h-screen bg-myGrey-200">
      <Navbar />

      <div className="relative min-h-screen">
        <div className="relative z-10 max-w-2xl mx-auto px-6 pt-14 pb-24">
          <h2 className="text-white text-3xl md:text-4xl font-bold text-center mb-1">
            {t('cart.title')}
          </h2>
          <p className="text-gray-300 text-sm text-center mb-10">
            {t('cart.subtitle')}
          </p>

          {loading ? (
            <div className="flex justify-center py-16">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-myBlue-200 border-t-transparent" />
            </div>
          ) : items.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-gray-500 p-10 text-center mb-6">
              <p className="text-gray-400">{t('cart.emptyCart')}</p>
            </div>
          ) : (
            <>
              <div className="flex flex-col gap-2">
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

                      <p
                        className="flex-1 min-w-0 truncate text-sm font-bold md:text-base"
                        style={{
                          color: isChecked ? '#9CA3AF' : '#3F4756',
                          textDecoration: isChecked ? 'line-through' : 'none',
                        }}
                      >
                        {name}
                      </p>

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

              <div className="mt-6 flex border-myGrey-100 items-center justify-between border-t-2 pt-5">
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

          <div className="mt-10">
            <h3 className="text-white text-xl font-bold mb-4">
              {t('cart.browseIngredients')}
            </h3>

            {[...ingredientsByCategory.entries()].map(([category, ings]) => {
              const isOpen = openCategory === category;

              return (
                <div key={category} className="mb-2">
                  <button
                    onClick={() => setOpenCategory(isOpen ? null : category)}
                    className="w-full flex items-center justify-between rounded-2xl bg-white bg-opacity-10 px-4 py-3 text-left transition hover:bg-opacity-15"
                  >
                    <span className="text-sm font-bold text-white">
                      {category}
                    </span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="h-4 w-4 text-gray-300 transition-transform"
                      style={{
                        transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                      }}
                    >
                      <path
                        fillRule="evenodd"
                        d="M12.53 16.28a.75.75 0 01-1.06 0l-7.5-7.5a.75.75 0 011.06-1.06L12 14.69l6.97-6.97a.75.75 0 111.06 1.06l-7.5 7.5z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>

                  {isOpen && (
                    <div className="grid grid-cols-1 gap-2 mt-2 sm:grid-cols-2 lg:grid-cols-3">
                      {ings.map((ing) => {
                        const alreadyIn = cartIngredientIds.has(ing.id);
                        const name = isEl ? ing.name_el : ing.name_en;

                        return (
                          <button
                            key={ing.id}
                            onClick={() => !alreadyIn && handleAdd(ing.id)}
                            disabled={alreadyIn}
                            className="flex items-center justify-between rounded-xl bg-white px-3 py-2.5 text-left text-sm transition"
                            style={{
                              opacity: alreadyIn ? 0.45 : 1,
                              cursor: alreadyIn ? 'default' : 'pointer',
                            }}
                          >
                            <span className="font-semibold text-myGrey-200 truncate">
                              {name}
                            </span>
                            {!alreadyIn && (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                className="h-4 w-4 flex-shrink-0 ml-2 text-myBlue-200"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M12 3.75a.75.75 0 01.75.75v6.75h6.75a.75.75 0 010 1.5h-6.75v6.75a.75.75 0 01-1.5 0v-6.75H4.5a.75.75 0 010-1.5h6.75V4.5a.75.75 0 01.75-.75z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <ScrollToTopButton />
    </div>
  );
}
