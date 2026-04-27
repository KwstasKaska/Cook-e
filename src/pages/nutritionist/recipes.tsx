import { useState } from 'react';
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

const LIMIT = 9; // 3 cols × 3 rows on desktop

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
  const [offset, setOffset] = useState(0);

  const { data, loading } = useRecipesQuery({
    variables: { limit: LIMIT, offset },
    fetchPolicy: 'network-only',
  });

  const recipes = data?.recipes ?? [];
  const hasMore = recipes.length === LIMIT;
  const hasPrev = offset > 0;

  const filtered = search.trim()
    ? recipes.filter((r) =>
        pick(r.title_el, r.title_en, lang)
          .toLowerCase()
          .includes(search.toLowerCase()),
      )
    : recipes;

  const handleSearch = (value: string) => {
    setSearch(value);
    setOffset(0); // reset to first page on new search
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#3F4756' }}>
      <NutrNavbar />

      <main className="mx-auto w-full max-w-6xl px-4 pb-20 pt-12 sm:px-6">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <h1 className="text-2xl font-bold text-white md:text-3xl">
            {t('nutr.nutr_recipes')}
          </h1>
          <input
            type="text"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder={t('chef.recipes.search_placeholder')}
            className="w-full rounded-full border border-gray-200 bg-white px-5 py-2.5 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-myBlue-200 md:w-72"
          />
        </div>

        {/* Loading */}
        {loading && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
            {Array.from({ length: LIMIT }).map((_, i) => (
              <div
                key={i}
                className="h-56 animate-pulse rounded-2xl bg-white/10"
              />
            ))}
          </div>
        )}

        {/* Empty */}
        {!loading && filtered.length === 0 && (
          <div className="py-20 text-center text-sm text-gray-300">
            {t('chef.recipes.empty')}
          </div>
        )}

        {/* Grid */}
        {!loading && filtered.length > 0 && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
            {filtered.map((recipe) => {
              const title = pick(recipe.title_el, recipe.title_en, lang);
              const author = recipe.author?.user?.username ?? '';
              return (
                <button
                  key={recipe.id}
                  onClick={() =>
                    router.push(`/nutritionist/recipes/${recipe.id}`)
                  }
                  className="group flex flex-col overflow-hidden rounded-2xl bg-white text-left shadow-md transition-transform duration-200 hover:scale-105"
                >
                  <div className="relative h-40 w-full overflow-hidden bg-gray-100">
                    <img
                      src={recipe.recipeImage ?? undefined}
                      alt={title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>
                  <div className="flex flex-col gap-1 p-3">
                    <p className="line-clamp-2 text-sm font-bold leading-tight text-gray-800">
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

        {/* Prev / Next — hidden when searching */}
        {!search.trim() && (hasPrev || hasMore) && (
          <div className="mt-10 flex justify-center gap-4">
            {hasPrev && (
              <button
                onClick={() => setOffset((o) => o - LIMIT)}
                className="rounded-full px-8 py-2.5 text-sm font-bold transition hover:opacity-90"
                style={{ backgroundColor: '#B3D5F8', color: '#3F4756' }}
              >
                ← {t('common.prev')}
              </button>
            )}
            {hasMore && (
              <button
                onClick={() => setOffset((o) => o + LIMIT)}
                className="rounded-full px-8 py-2.5 text-sm font-bold transition hover:opacity-90"
                style={{ backgroundColor: '#B3D5F8', color: '#3F4756' }}
              >
                {t('common.next')} →
              </button>
            )}
          </div>
        )}
      </main>

      <ScrollToTopButton />
    </div>
  );
}
