import { useState, useMemo } from 'react';
import { useRouter } from 'next/router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import {
  useMyRecipesQuery,
  useMyRecipesByCategoryQuery,
  RecipeCategory,
  Recipe,
} from '../../../generated/graphql';
import { pick } from '../../../utils/pick';
import useIsChef from '../../../utils/useIsChef';
import ChefNavbar from '../../../components/Chef/ChefNavbar';
import RecipeFeaturedCard from '../../../components/Chef/RecipeFeaturedCard';
import RecipeCompactCard from '../../../components/Chef/RecipeCompactCard';
import RecipeCategoryFilter from '../../../components/Chef/RecipeCategoryFilter';
import PaginationControls from '../../../components/Helper/PaginationControls';

const LIMIT = 5;

export default function ChefRecipes() {
  const { loading: authLoading, isAuthorized } = useIsChef();
  if (authLoading || !isAuthorized) return null;
  return <ChefRecipesContent />;
}

const ChefRecipesContent = () => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const lang = router.locale ?? 'el';

  const [activeCategory, setActiveCategory] = useState<RecipeCategory | null>(
    null,
  );
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
        pick(r.title_el, r.title_en, lang).toLowerCase(),
      ),
    [rawRecipes, lang],
  );

  const handleCategoryChange = (cat: RecipeCategory | null) => {
    setActiveCategory(cat);
    setOffset(0);
  };

  const featured = filtered[0] ?? null;
  const rest = filtered.slice(1);
  const hasPrev = offset > 0;
  const hasMore = rawRecipes.length === LIMIT;

  return (
    <div className="min-h-screen">
      <ChefNavbar />

      <div className="mx-auto max-w-4xl px-6 pb-16 pt-10">
        <button
          onClick={() => router.push('/chef')}
          className="mb-6 text-myText-muted hover:text-cookie-400"
        >
          ← {t('common.back')}
        </button>

        <div className="rounded-2xl bg-surface p-6 shadow-lg md:p-8">
          <h1 className="text-center mb-10">{t('chef.recipes.page_title')}</h1>

          <div className="flex flex-col gap-6 md:flex-row">
            <RecipeCategoryFilter
              activeCategory={activeCategory}
              onChange={handleCategoryChange}
            />

            <div className="flex-1">
              {loading ? (
                <div className="flex justify-center py-12">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-cookie-400 border-t-transparent" />
                </div>
              ) : filtered.length === 0 ? (
                <p className="py-12 text-center text-myText-muted">
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
                      {rest.map((recipe) => (
                        <RecipeCompactCard
                          key={recipe.id}
                          recipe={recipe}
                          lang={lang}
                          onClick={() =>
                            router.push(`/chef/recipes/${recipe.id}`)
                          }
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div className="mt-6">
                <PaginationControls
                  hasPrev={hasPrev}
                  hasMore={hasMore}
                  onPrev={() => setOffset((o) => o - LIMIT)}
                  onNext={() => setOffset((o) => o + LIMIT)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export async function getServerSideProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}
