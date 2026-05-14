import { useState, useCallback } from 'react';
import Navbar from '../../components/Users/Navbar';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import {
  useMyCartQuery,
  useRemoveFromCartMutation,
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

const CartContent = ({
  isEl,
  t,
}: {
  isEl: boolean;
  t: ReturnType<typeof useTranslation>['t'];
}) => {
  const router = useRouter();
  const [checkedIds, setCheckedIds] = useState<Set<number>>(new Set());

  const { data, loading, refetch } = useMyCartQuery({
    fetchPolicy: 'network-only',
  });
  const [removeFromCart] = useRemoveFromCartMutation();

  const items = data?.myCart ?? [];

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

  const checkedCount = checkedIds.size;

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="relative min-h-screen">
        <div className="relative z-10 mx-auto max-w-2xl px-6 pb-24 pt-14">
          <button
            onClick={() => router.push('/user')}
            className="mb-6 text-myText-muted hover:text-cookie-400"
          >
            {t('common.back')}
          </button>

          <h1 className="mb-1 text-center">{t('cart.title')}</h1>
          <p className="mb-6 text-center ">{t('cart.subtitle')}</p>

          {loading ? (
            <div className="flex justify-center py-16">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-cookie-300 border-t-transparent" />
            </div>
          ) : items.length === 0 ? (
            <div className="mb-6 rounded-2xl border-2 border-cookie-400 p-10 text-center">
              <p className="mb-4 text-myText-muted">{t('cart.emptyCart')}</p>
              <button
                onClick={() => router.push('/user/recipes')}
                className="rounded-full border-2 border-cookie-400 px-5 py-1.5 text-cookie-400 transition hover:bg-cookie-400 hover:text-white"
              >
                {t('cart.browseRecipes')}
              </button>
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
                      className="flex items-center gap-3 rounded-2xl border-2 border-cookie-400 bg-surface px-3 py-3 transition"
                    >
                      <button
                        onClick={() => toggleChecked(item.id)}
                        className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded border-2 transition"
                        style={{
                          borderColor: isChecked ? '#C9955A' : '#9C9080',
                          backgroundColor: isChecked
                            ? '#C9955A'
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
                        className="min-w-0 flex-1 truncate"
                        style={{
                          color: isChecked ? '#9C9080' : '#3D3529',
                          textDecoration: isChecked ? 'line-through' : 'none',
                        }}
                      >
                        {name}
                      </p>

                      <button
                        onClick={() => handleRemove(item.id)}
                        className="flex-shrink-0 text-myText-muted transition hover:text-myRed"
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

              <div className="mt-6 flex items-center justify-between border-t-2 border-cookie-400 pt-5">
                <p className="text-myText-muted">
                  {checkedCount}/{items.length} {t('cart.items')}
                </p>
                <button
                  onClick={handleClearChecked}
                  disabled={checkedCount === 0}
                  className={`rounded-full border-2 px-5 py-2 transition ${
                    checkedCount > 0
                      ? 'cursor-pointer border-myRed text-myRed hover:bg-myRed hover:text-white'
                      : 'cursor-not-allowed border-cookie-400 text-myText-muted'
                  }`}
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
};
