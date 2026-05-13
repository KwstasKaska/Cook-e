import { useState } from 'react';
import Navbar from '../../../components/Users/Navbar';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import { useMyFavoritesQuery } from '../../../generated/graphql';
import useIsUser from '../../../utils/useIsUser';
import PaginationControls from '../../../components/Helper/PaginationControls';
import { DIFFICULTY_MAP } from '../../../utils/recipeUtils';

const FAV_LIMIT = 9;

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
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 ">
            {favorites.map((fav) => {
              const recipe = fav.recipe;
              if (!recipe) return null;
              const title = isEl ? recipe.title_el : recipe.title_en;
              const totalTime = (recipe.prepTime ?? 0) + (recipe.cookTime ?? 0);
              const diff = recipe.difficulty
                ? DIFFICULTY_MAP[recipe.difficulty.toLowerCase()] ?? null
                : null;
              return (
                <div
                  key={fav.id}
                  onClick={() => router.push(`/user/recipes/${recipe.id}`)}
                  className="flex cursor-pointer flex-col items-center gap-2 rounded-2xl bg-surface p-4 shadow-lg transition-shadow hover:shadow-xl"
                >
                  <img
                    src={recipe.recipeImage!}
                    alt={title}
                    className="h-20 w-20 rounded-full border-2 border-cookie-400 object-cover shadow"
                  />
                  <h5 className="text-center">{title}</h5>
                  <div className="flex items-center gap-2 text-myText-muted">
                    {totalTime > 0 && (
                      <span>
                        {totalTime} {t('landing.minutes')}
                      </span>
                    )}
                    {diff && totalTime > 0 && <span>·</span>}
                    {diff && <span>{isEl ? diff.el : diff.en}</span>}
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
