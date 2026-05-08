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
import PaginationControls from '../../../components/Helper/PaginationControls';

const LIMIT = 5;

export default function ChefRecipes() {
  const { loading: authLoading, isAuthorized } = useIsChef();
  const { t } = useTranslation('common');
  const router = useRouter();
  const lang = router.locale ?? 'el';

  const [activeCategory, setActiveCategory] = useState<RecipeCategory | null>(
    null,
  );
  const [search, setSearch] = useState('');
  const [offset, setOffset] = useState(0);

  const allRecipesQuery = useMyRecipesQuery({
    variables: { limit: LIMIT, offset },
    skip: activeCategory !== null,
    fetchPolicy: 'network-only',
  });

  const categoryRecipesQuery = useMyRecipesByCategoryQuery({
    variables: { category: activeCategory!, limit: LIMIT, offset },
    skip: activeCategory === null,
    fetchPolicy: 'network-only',
  });

  const loading =
    activeCategory === null
      ? allRecipesQuery.loading
      : categoryRecipesQuery.loading;

  const rawRecipes: Recipe[] = useMemo(() => {
    const list =
      activeCategory === null
        ? allRecipesQuery.data?.myRecipes ?? []
        : categoryRecipesQuery.data?.myRecipesByCategory ?? [];
    return list as Recipe[];
  }, [activeCategory, allRecipesQuery.data, categoryRecipesQuery.data]);

  const filtered = useMemo(
    () =>
      rawRecipes.filter((r) =>
        pick(r.title_el, r.title_en, lang)
          .toLowerCase()
          .includes(search.toLowerCase()),
      ),
    [rawRecipes, search, lang],
  );

  const handleCategoryChange = (cat: RecipeCategory | null) => {
    setActiveCategory(cat);
    setOffset(0);
  };

  if (authLoading || !isAuthorized) return null;

  const featured = filtered[0] ?? null;
  const rest = filtered.slice(1);

  const hasPrev = offset > 0;
  const hasMore = rawRecipes.length === LIMIT;

  return (
    <div className="flex min-h-screen flex-col">
      <ChefNavbar />

      <main className="relative flex flex-1 flex-col items-center px-4 py-8 md:px-8">
        <h1
          className="relative z-10 mb-8 text-3xl italic"
          style={{ color: 'rgba(255,255,255,0.85)' }}
        >
          {t('chef.recipes.page_title')}
        </h1>

        <div className="relative z-10 bg-white w-full max-w-4xl rounded-2xl p-6 md:p-8">
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <h2 className="text-2xl font-bold">
              {t('chef.recipes.categories_label')}
            </h2>
            <RecipeSearchBar search={search} onSearchChange={setSearch} />
          </div>

          <div className="flex flex-col gap-6 md:flex-row">
            <RecipeCategoryFilter
              activeCategory={activeCategory}
              onChange={handleCategoryChange}
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

              <PaginationControls
                hasPrev={hasPrev}
                hasMore={hasMore}
                onPrev={() => setOffset((o) => o - LIMIT)}
                onNext={() => setOffset((o) => o + LIMIT)}
              />
            </div>
          </div>
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
