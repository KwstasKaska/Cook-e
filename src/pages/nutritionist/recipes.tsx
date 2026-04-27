import { useState, useMemo } from 'react';
import { useRouter } from 'next/router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import NutrNavbar from '../../components/Nutritionist/NutrNavbar';
import useIsNutritionist from '../../utils/useIsNutr';
import { useRecipesQuery } from '../../generated/graphql';
import ScrollToTopButton from '../../components/Helper/ScrollToTopButton';
import { pick } from '../../utils/pick';

export async function getServerSideProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}

const LIMIT = 12;

export default function NutrRecipesPage() {
  const { loading: authLoading, isAuthorized } = useIsNutritionist();
  if (authLoading || !isAuthorized) return null;
  return <NutrRecipesContent />;
}

function NutrRecipesContent() {
  const { t, i18n } = useTranslation('common');
  const router = useRouter();
  const lang = i18n.language;

  const [search, setSearch] = useState('');

  const { data, loading, fetchMore, networkStatus } = useRecipesQuery({
    variables: { limit: LIMIT, offset: 0 },
    fetchPolicy: 'network-only',
    notifyOnNetworkStatusChange: true,
  });

  const recipes = data?.recipes ?? [];
  const fetchingMore = networkStatus === 3;
  const hasMore = recipes.length > 0 && recipes.length % LIMIT === 0;

  const filtered = useMemo(() => {
    if (!search.trim()) return recipes;
    return recipes.filter((r) =>
      pick(r.title_el, r.title_en, lang)
        .toLowerCase()
        .includes(search.toLowerCase()),
    );
  }, [recipes, search, lang]);

  const handleLoadMore = () => {
    fetchMore({ variables: { limit: LIMIT, offset: recipes.length } });
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#3F4756' }}>
      <NutrNavbar />

      <main className="mx-auto w-full max-w-6xl px-6 pb-20 pt-12">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <h1 className="text-2xl font-bold text-white md:text-3xl">
            {t('nutr.nutr_recipes')}
          </h1>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('chef.recipes.search_placeholder')}
            className="w-full rounded-full border border-gray-200 bg-white px-5 py-2.5 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-myBlue-200 md:w-72"
          />
        </div>

        {/* Loading skeleton */}
        {loading && !fetchingMore && (
          <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="animate-pulse rounded-2xl bg-white/10 h-56"
              />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && filtered.length === 0 && (
          <div className="py-20 text-center text-gray-300 text-sm">
            {t('nutr_recipes.empty', 'Δεν βρέθηκαν συνταγές.')}
          </div>
        )}

        {/* Recipe grid */}
        {filtered.length > 0 && (
          <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
            {filtered.map((recipe) => {
              const title = pick(recipe.title_el, recipe.title_en, lang);
              const author = recipe.author?.user?.username ?? '';
              return (
                <button
                  key={recipe.id}
                  onClick={() =>
                    router.push(`/nutritionist/recipes/${recipe.id}`)
                  }
                  className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-md transition-transform duration-200 hover:scale-105 text-left"
                >
                  <div className="relative h-40 w-full overflow-hidden bg-gray-100">
                    <img
                      src={recipe.recipeImage ?? undefined}
                      alt={title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>
                  <div className="flex flex-col gap-1 p-3">
                    <p className="text-sm font-bold text-gray-800 line-clamp-2 leading-tight">
                      {title}
                    </p>
                    {author && (
                      <p className="text-xs text-gray-500">by {author}</p>
                    )}
                    {recipe.category && (
                      <span className="mt-1 w-fit rounded-full bg-myBlue-200/10 px-2 py-0.5 text-xs font-medium text-myBlue-200">
                        {recipe.category}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* Load more */}
        {hasMore && !search.trim() && (
          <div className="mt-10 flex justify-center">
            <button
              onClick={handleLoadMore}
              disabled={fetchingMore}
              className="rounded-full bg-myBlue-200 px-8 py-2.5 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50 transition"
            >
              {fetchingMore ? t('common.loading') : t('nutr.loadMore')}
            </button>
          </div>
        )}
      </main>

      <ScrollToTopButton />
    </div>
  );
}
