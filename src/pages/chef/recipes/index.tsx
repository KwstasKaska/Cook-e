import React, { useState, useMemo } from 'react';
import ChefNavbar from '../../../components/Chef/ChefNavbar';

import RecipeFeaturedCard from '../../../components/Chef/RecipeFeaturedCard';
import RecipeCompactCard from '../../../components/Chef/RecipeCompactCard';
import RecipeCategoryFilter from '../../../components/Chef/RecipeCategoryFilter';
import RecipeSearchBar from '../../../components/Chef/RecipeSearchBar';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import {
  useMyRecipesQuery,
  useMyRecipesByCategoryQuery,
  RecipeCategory,
  Recipe,
} from '../../../generated/graphql';
import { pick } from '../../../utils/pick';
import useIsChef from '../../../utils/useIsChef';

export default function ChefRecipes() {
  const { loading: authLoading, isAuthorized } = useIsChef();
  const { t } = useTranslation('common');
  const router = useRouter();
  const lang = router.locale ?? 'el';
  const [activeCategory, setActiveCategory] = useState<RecipeCategory | null>(
    null,
  );
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<'newest' | 'oldest' | 'alpha'>('newest');

  const allRecipesQuery = useMyRecipesQuery({
    variables: { limit: 5, offset: 0 },
    skip: activeCategory !== null,
    fetchPolicy: 'network-only',
  });

  const categoryRecipesQuery = useMyRecipesByCategoryQuery({
    variables: { category: activeCategory!, limit: 5, offset: 0 },
    skip: activeCategory === null,
    fetchPolicy: 'network-only',
  });

  const loading =
    activeCategory === null
      ? allRecipesQuery.loading
      : categoryRecipesQuery.loading;

  const fetchingMore =
    activeCategory === null
      ? allRecipesQuery.networkStatus === 3
      : categoryRecipesQuery.networkStatus === 3;

  const rawRecipes: Recipe[] = useMemo(() => {
    const list =
      activeCategory === null
        ? allRecipesQuery.data?.myRecipes ?? []
        : categoryRecipesQuery.data?.myRecipesByCategory ?? [];
    return list as Recipe[];
  }, [activeCategory, allRecipesQuery.data, categoryRecipesQuery.data]);

  const filtered = useMemo(() => {
    let result = rawRecipes.filter((r) =>
      pick(r.title_el, r.title_en, lang)
        .toLowerCase()
        .includes(search.toLowerCase()),
    );

    if (sort === 'newest') {
      result = [...result].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
    } else if (sort === 'oldest') {
      result = [...result].sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      );
    } else if (sort === 'alpha') {
      result = [...result].sort((a, b) =>
        pick(a.title_el, a.title_en, lang).localeCompare(
          pick(b.title_el, b.title_en, lang),
          lang,
        ),
      );
    }

    return result;
  }, [rawRecipes, search, sort, lang]);

  // Auth guard — after all hooks
  if (authLoading || !isAuthorized) return null;

  const featured = filtered[0] ?? null;
  const rest = filtered.slice(1);

  const handleLoadMore = () => {
    if (activeCategory === null) {
      allRecipesQuery.fetchMore({
        variables: { limit: 5, offset: rawRecipes.length },
      });
    } else {
      categoryRecipesQuery.fetchMore({
        variables: {
          category: activeCategory,
          limit: 5,
          offset: rawRecipes.length,
        },
      });
    }
  };

  // Show load more only if the last fetch returned a full page
  const hasMore = rawRecipes.length > 0 && rawRecipes.length % 5 === 0;

  return (
    <div
      className="flex min-h-screen flex-col"
      style={{ backgroundColor: '#3F4756' }}
    >
      <ChefNavbar />

      <main className="relative flex flex-1 flex-col items-center px-4 py-8 md:px-8">
        {/* Decorative diamond shapes */}
        <div
          className="pointer-events-none absolute hidden md:block"
          style={{
            left: '60px',
            top: '80px',
            width: '120px',
            height: '120px',
            backgroundColor: '#B3D5F8',
            transform: 'rotate(45deg)',
            borderRadius: '12px',
            opacity: 0.7,
          }}
        />
        <div
          className="pointer-events-none absolute hidden md:block"
          style={{
            right: '60px',
            top: '80px',
            width: '120px',
            height: '120px',
            backgroundColor: '#B3D5F8',
            transform: 'rotate(45deg)',
            borderRadius: '12px',
            opacity: 0.7,
          }}
        />
        <div
          className="pointer-events-none absolute hidden md:block"
          style={{
            left: '30px',
            bottom: '200px',
            width: '90px',
            height: '90px',
            backgroundColor: '#B3D5F8',
            transform: 'rotate(45deg)',
            borderRadius: '10px',
            opacity: 0.5,
          }}
        />
        <div
          className="pointer-events-none absolute hidden md:block"
          style={{
            right: '30px',
            bottom: '200px',
            width: '90px',
            height: '90px',
            backgroundColor: '#B3D5F8',
            transform: 'rotate(45deg)',
            borderRadius: '10px',
            opacity: 0.5,
          }}
        />

        <h1
          className="relative z-10 mb-8 text-3xl italic"
          style={{
            color: 'rgba(255,255,255,0.85)',
            fontFamily: 'Georgia, serif',
          }}
        >
          {t('chef.recipes.page_title')}
        </h1>

        <div
          className="relative z-10 w-full max-w-4xl rounded-2xl p-6 md:p-8"
          style={{ backgroundColor: 'white' }}
        >
          {/* Top bar */}
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <h2 className="text-2xl font-bold" style={{ color: '#3F4756' }}>
              {t('chef.recipes.categories_label')}
            </h2>
            <RecipeSearchBar
              search={search}
              sort={sort}
              onSearchChange={setSearch}
              onSortChange={setSort}
            />
          </div>

          {/* Body */}
          <div className="flex flex-col gap-6 md:flex-row">
            <RecipeCategoryFilter
              activeCategory={activeCategory}
              onChange={setActiveCategory}
            />

            <div className="flex-1">
              {loading ? (
                <p className="text-center text-gray-400 py-12">
                  {t('common.loading')}
                </p>
              ) : filtered.length === 0 ? (
                <p className="text-center text-gray-400 py-12">
                  {t('chef.recipes.empty')}
                </p>
              ) : (
                <div className="flex flex-col gap-4 md:flex-row">
                  {featured && (
                    <div className="md:w-1/2">
                      <RecipeFeaturedCard
                        recipe={featured}
                        lang={lang}
                        onClick={() =>
                          router.push(`/chef/recipes/${featured.id}`)
                        }
                      />
                    </div>
                  )}
                  {rest.length > 0 && (
                    <div className="flex flex-col gap-3 md:w-1/2">
                      {rest.map((recipe, i) => (
                        <RecipeCompactCard
                          key={recipe.id}
                          recipe={recipe}
                          lang={lang}
                          onClick={() =>
                            router.push(`/chef/recipes/${recipe.id}`)
                          }
                          dark={i === 0}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {hasMore && (
            <div className="mt-8 flex justify-center">
              <button
                onClick={handleLoadMore}
                disabled={fetchingMore}
                className="rounded-full px-10 py-3 text-sm font-bold text-white transition hover:opacity-90 disabled:opacity-50"
                style={{ backgroundColor: '#3F4756' }}
              >
                {fetchingMore ? t('common.loading') : t('chef.recipes.more')}
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export async function getServerSideProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}
