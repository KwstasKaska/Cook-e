import { useState } from 'react';
import Navbar from '../../components/Users/Navbar';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import {
  useMyNutritionalSummaryQuery,
  useMyFavoritesQuery,
} from '../../generated/graphql';
import useIsUser from '../../utils/useIsUser';
import PaginationControls from '../../components/Helper/PaginationControls';

const FAV_LIMIT = 2;

const DIFFICULTY_MAP: Record<string, { el: string; en: string }> = {
  easy: { el: 'Εύκολο', en: 'Easy' },
  medium: { el: 'Μέτριο', en: 'Medium' },
  hard: { el: 'Δύσκολο', en: 'Hard' },
};

export async function getServerSideProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}

export default function UserHomePage() {
  const { loading: authLoading, isAuthorized } = useIsUser();
  if (authLoading || !isAuthorized) return null;
  return <HomeContent />;
}

const HomeContent = () => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const isEl = router.locale === 'el';
  const [favOffset, setFavOffset] = useState(0);

  const { data: summaryData, loading: summaryLoading } =
    useMyNutritionalSummaryQuery({ fetchPolicy: 'network-only' });

  const { data: favData, loading: favLoading } = useMyFavoritesQuery({
    variables: { limit: FAV_LIMIT, offset: favOffset },
    fetchPolicy: 'network-only',
  });

  const summary = summaryData?.myNutritionalSummary;
  const favorites = favData?.myFavorites ?? [];
  const hasPrev = favOffset > 0;
  const hasMore = favorites.length === FAV_LIMIT;

  const stats = [
    {
      labelKey: 'landing.energy',
      value: `${Math.round(summary?.totalCalories ?? 0)} kcal`,
    },
    {
      labelKey: 'landing.fat',
      value: `${Math.round(summary?.totalFat ?? 0)}g`,
    },
    {
      labelKey: 'landing.protein',
      value: `${Math.round(summary?.totalProtein ?? 0)}g`,
    },
    {
      labelKey: 'landing.carbs',
      value: `${Math.round(summary?.totalCarbs ?? 0)}g`,
    },
    { labelKey: 'landing.cookCount', value: `${summary?.cookCount ?? 0}` },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="mx-auto max-w-3xl px-6 pb-16 pt-10">
        <div className="mb-8">
          <h1 className="mb-3 break-words text-center">
            {t('landing.nutritionTitle')}
          </h1>
          <p className="mx-auto max-w-md text-left">
            {t('landing.nutritionDesc')}
          </p>
        </div>

        <div className="mx-auto max-w-md rounded-2xl bg-surface p-6 shadow-lg">
          {summaryLoading ? (
            <div className="flex h-32 items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-cookie-300 border-t-transparent" />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3">
              {stats.map((s) => (
                <div key={s.labelKey} className="flex flex-col gap-0.5">
                  <span className="text-xs text-myText-muted">
                    {t(s.labelKey)}
                  </span>
                  <span className="text-lg font-bold text-myText-heading">
                    {s.value}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-16">
          <h1 className="mb-8 text-center">{t('recipes.favourites')}</h1>

          {favLoading ? (
            <div className="flex justify-center py-10">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-cookie-300 border-t-transparent" />
            </div>
          ) : favorites.length === 0 && !hasPrev ? (
            <p className="text-center text-myText-muted">
              {t('recipes.noFavourites')}
            </p>
          ) : (
            <div className="flex flex-wrap justify-center gap-4">
              {favorites.map((fav) => {
                const recipe = fav.recipe;
                if (!recipe) return null;
                const title = isEl ? recipe.title_el : recipe.title_en;
                const totalTime =
                  (recipe.prepTime ?? 0) + (recipe.cookTime ?? 0);
                const diff = recipe.difficulty
                  ? DIFFICULTY_MAP[recipe.difficulty.toLowerCase()] ?? null
                  : null;
                return (
                  <div
                    key={fav.id}
                    onClick={() => router.push(`/user/recipes/${recipe.id}`)}
                    className="flex w-full max-w-[220px] cursor-pointer flex-col items-center gap-2 rounded-2xl bg-surface p-4 shadow-lg transition-shadow hover:shadow-xl"
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

          {!favLoading && (
            <PaginationControls
              hasPrev={hasPrev}
              hasMore={hasMore && favorites.length > 0}
              onPrev={() => setFavOffset((o) => o - FAV_LIMIT)}
              onNext={() => setFavOffset((o) => o + FAV_LIMIT)}
            />
          )}
        </div>
      </div>
    </div>
  );
};
