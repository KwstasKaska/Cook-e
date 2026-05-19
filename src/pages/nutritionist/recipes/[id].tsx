import { useRouter } from 'next/router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import NutrNavbar from '../../../components/Nutritionist/NutrNavbar';
import { useRecipeQuery } from '../../../generated/graphql';
import useIsNutritionist from '../../../utils/useIsNutr';
import { pick } from '../../../utils/pick';
import ShareButton from '../../../components/Helper/ShareButton';

export async function getServerSideProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}

export default function NutrRecipeDetailPage() {
  const { loading: authLoading, isAuthorized } = useIsNutritionist();
  if (authLoading || !isAuthorized) return null;
  return <NutrRecipeDetailContent />;
}

const NutrRecipeDetailContent = () => {
  const { t } = useTranslation('common');
  const router = useRouter();

  const { id } = router.query;
  const recipeId = parseInt(id as string, 10);
  const lang = router.locale === 'el' ? 'el' : 'en';

  const { data, loading } = useRecipeQuery({
    variables: { id: recipeId },
    skip: isNaN(recipeId),
    fetchPolicy: 'network-only',
  });

  const recipe = data?.recipe;
  const title = recipe ? pick(recipe.title_el, recipe.title_en, lang) : '';

  const hasMacros =
    recipe &&
    (recipe.caloriesTotal != null ||
      recipe.protein != null ||
      recipe.carbs != null ||
      recipe.fat != null);

  if (loading) {
    return (
      <div className="min-h-screen">
        <NutrNavbar />
        <div className="flex justify-center pt-24">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-cookie-400 border-t-transparent" />
        </div>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="min-h-screen">
        <NutrNavbar />
        <p className="pt-24 text-center text-myText-muted">
          {t('recipe_detail.not_found')}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <NutrNavbar />

      <main className="mx-auto w-full max-w-2xl px-6 pb-20 pt-8">
        <button
          onClick={() => router.back()}
          className="mb-6 flex items-center gap-2 text-myText-muted transition hover:opacity-70"
        >
          {t('common.back')}
        </button>

        <div className="overflow-hidden rounded-2xl bg-surface shadow-xl">
          {recipe.recipeImage && (
            <div className="relative h-56 w-full overflow-hidden">
              <img
                src={recipe.recipeImage}
                alt={title}
                className="h-full w-full object-cover"
              />
            </div>
          )}

          <div className="p-6 md:p-8">
            <h1 className="mb-4">{title}</h1>

            {recipe.author?.user && (
              <div className="mb-4 flex items-center gap-3">
                {recipe.author.user.image ? (
                  <img
                    src={recipe.author.user.image}
                    alt={recipe.author.user.username}
                    className="h-9 w-9 rounded-full border-2 border-cookie-400 object-cover"
                  />
                ) : (
                  <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-cookie-400 bg-cookie-200">
                    {recipe.author.user.username?.[0]?.toUpperCase() ?? '?'}
                  </div>
                )}
                <span className="">{recipe.author.user.username}</span>
              </div>
            )}

            <div className="mb-6">
              <ShareButton
                dark
                url={
                  typeof window !== 'undefined'
                    ? `${window.location.origin}/user/recipes/${recipe.id}`
                    : ''
                }
              />
            </div>

            {recipe.recipeIngredients &&
              recipe.recipeIngredients.length > 0 && (
                <div className="mb-6">
                  <h2 className="mb-3">{t('recipes.ingredients')}</h2>
                  <div className="flex flex-col gap-1.5 rounded-xl border-2 border-cookie-400 px-4 py-3">
                    {recipe.recipeIngredients.map((ri) => (
                      <div
                        key={ri.ingredientId}
                        className="flex items-center gap-2"
                      >
                        <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-cookie-400" />
                        {pick(
                          ri.ingredient?.name_el ?? '',
                          ri.ingredient?.name_en ?? '',
                          lang,
                        )}{' '}
                        — {ri.quantity} {ri.unit}
                      </div>
                    ))}
                  </div>
                </div>
              )}

            {hasMacros && (
              <div className="mb-6">
                <h2 className="mb-3">{t('chef.create_recipe.macros_label')}</h2>
                <div className="flex flex-col gap-2 rounded-xl border-2 border-cookie-400 px-4 py-3">
                  {recipe.caloriesTotal != null && (
                    <div className="flex justify-between">
                      <span>{t('chef.create_recipe.calories')}</span>
                      <span className="font-semibold">
                        {recipe.caloriesTotal} kcal
                      </span>
                    </div>
                  )}
                  {recipe.protein != null && (
                    <div className="flex justify-between">
                      <span>{t('chef.create_recipe.protein')}</span>
                      <span className="font-semibold">{recipe.protein}g</span>
                    </div>
                  )}
                  {recipe.carbs != null && (
                    <div className="flex justify-between">
                      <span>{t('chef.create_recipe.carbs')}</span>
                      <span className="font-semibold">{recipe.carbs}g</span>
                    </div>
                  )}
                  {recipe.fat != null && (
                    <div className="flex justify-between">
                      <span>{t('chef.create_recipe.fat')}</span>
                      <span className="font-semibold">{recipe.fat}g</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};
