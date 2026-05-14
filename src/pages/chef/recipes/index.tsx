import { useState } from 'react';
import { useRouter } from 'next/router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import {
  useMyRecipesQuery,
  useMyRecipesByCategoryQuery,
  RecipeCategory,
} from '../../../generated/graphql';
import { pick } from '../../../utils/pick';
import { totalDuration, recipeImageSrc } from '../../../utils/recipeHelpers';
import useIsChef from '../../../utils/useIsChef';
import ChefNavbar from '../../../components/Chef/ChefNavbar';
import RecipeCategoryFilter from '../../../components/Chef/RecipeCategoryFilter';
import PaginationControls from '../../../components/Helper/PaginationControls';

const LIMIT = 9;

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

  const recipes =
    activeCategory === null
      ? allRecipesQuery.data?.myRecipes ?? []
      : categoryRecipesQuery.data?.myRecipesByCategory ?? [];

  const handleCategoryChange = (cat: RecipeCategory | null) => {
    setActiveCategory(cat);
    setOffset(0);
  };

  const hasPrev = offset > 0;
  const hasMore = recipes.length === LIMIT;

  return (
    <div className="min-h-screen bg-cookie-100">
      <ChefNavbar />

      <div className="mx-auto max-w-5xl px-6 pb-16 pt-10">
        <button
          onClick={() => router.push('/chef')}
          className="mb-6 flex items-center gap-2 text-myText-muted transition hover:text-cookie-400"
        >
          {t('common.back')}
        </button>

        <h1 className="mb-8 text-center">{t('chef.recipes.page_title')}</h1>

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
            ) : recipes.length === 0 ? (
              <p className="py-12 text-center text-myText-muted">
                {t('chef.recipes.empty')}
              </p>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {recipes.map((recipe) => {
                  const title = pick(recipe.title_el, recipe.title_en, lang);
                  const duration = totalDuration(
                    recipe.prepTime,
                    recipe.cookTime,
                    recipe.restTime,
                  );
                  return (
                    <div
                      key={recipe.id}
                      onClick={() => router.push(`/chef/recipes/${recipe.id}`)}
                      className="cursor-pointer overflow-hidden rounded-2xl bg-surface shadow-lg transition hover:scale-[1.02] hover:shadow-xl"
                    >
                      <div className="h-32 w-full overflow-hidden">
                        <img
                          src={recipeImageSrc(recipe.recipeImage)}
                          alt={title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="px-4 py-3 flex flex-col gap-1">
                        <p className="font-medium line-clamp-2">{title}</p>
                        <p className="text-myText-muted">
                          {duration} {t('chef.recipes.minutes')}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {!loading && (
              <div className="mt-6">
                <PaginationControls
                  hasPrev={hasPrev}
                  hasMore={hasMore && recipes.length > 0}
                  onPrev={() => setOffset((o) => o - LIMIT)}
                  onNext={() => setOffset((o) => o + LIMIT)}
                  prevLabel={t('pagination.prevRecipes')}
                  nextLabel={t('pagination.nextRecipes')}
                />
              </div>
            )}
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
