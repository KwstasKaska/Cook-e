import { useState } from 'react';
import Navbar from '../../../components/Users/Navbar';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import { useMyFavoritesQuery } from '../../../generated/graphql';
import useIsUser from '../../../utils/useIsUser';
import PaginationControls from '../../../components/Helper/PaginationControls';

const FAV_LIMIT = 12;

export async function getServerSideProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}

export default function FavoritesPage() {
  const { loading: authLoading, isAuthorized } = useIsUser();
  if (authLoading || !isAuthorized) return null;
  return <FavoritesContent />;
}

const FavoritesContent = () => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const isEl = router.locale === 'el';
  const [offset, setOffset] = useState(0);

  const { data, loading } = useMyFavoritesQuery({
    variables: { limit: FAV_LIMIT, offset },
    fetchPolicy: 'network-only',
  });

  const favorites = data?.myFavorites ?? [];
  const hasPrev = offset > 0;
  const hasMore = favorites.length === FAV_LIMIT;

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="mx-auto max-w-3xl px-6 pb-16 pt-10">
        <button
          onClick={() => router.push('/user')}
          className="mb-6 text-sm font-semibold text-myText-muted hover:text-cookie-400"
        >
          ← {t('common.back')}
        </button>

        <h1 className="mb-10 text-center">{t('recipes.favourites')}</h1>

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-cookie-300 border-t-transparent" />
          </div>
        ) : favorites.length === 0 && !hasPrev ? (
          <p className="text-center text-myText-muted">
            {t('recipes.noFavourites')}
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {favorites.map((fav) => {
              const recipe = fav.recipe;
              if (!recipe) return null;
              const title = isEl ? recipe.title_el : recipe.title_en;

              return (
                <div
                  key={fav.id}
                  onClick={() => router.push(`/user/recipes/${recipe.id}`)}
                  className="cursor-pointer rounded-2xl bg-surface shadow-xl overflow-hidden transition duration-200 hover:scale-105 flex flex-col"
                >
                  <div className="h-24 w-full overflow-hidden flex-shrink-0">
                    <img
                      src={recipe.recipeImage!}
                      alt={title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex flex-col gap-2 px-4 py-3">
                    <h5 className="text-center">{title}</h5>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {!loading && (
          <PaginationControls
            hasPrev={hasPrev}
            hasMore={hasMore && favorites.length > 0}
            onPrev={() => setOffset((o) => o - FAV_LIMIT)}
            onNext={() => setOffset((o) => o + FAV_LIMIT)}
          />
        )}
      </div>
    </div>
  );
};
