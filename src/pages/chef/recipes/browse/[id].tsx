import Image from 'next/image';
import { useRouter } from 'next/router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import ChefNavbar from '../../../../components/Chef/ChefNavbar';
import useIsChef from '../../../../utils/useIsChef';
import { useRecipeQuery } from '../../../../generated/graphql';
import { pick } from '../../../../utils/pick';
import Stars from '../../../../components/Helper/Stars';
import {
  useRecipeAverageRatingQuery,
  useRecipeRatingsQuery,
} from '../../../../generated/graphql';

export async function getServerSideProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}

export default function ChefBrowseRecipeDetailPage() {
  const { loading: authLoading, isAuthorized } = useIsChef();
  if (authLoading || !isAuthorized) return null;
  return <ChefBrowseRecipeDetailContent />;
}

const ChefBrowseRecipeDetailContent = () => {
  const { t, i18n } = useTranslation('common');
  const lang = i18n.language as 'el' | 'en';
  const router = useRouter();
  const recipeId = router.isReady ? Number(router.query.id) : null;

  const { data, loading } = useRecipeQuery({
    variables: { id: recipeId! },
    skip: !recipeId,
    fetchPolicy: 'network-only',
  });

  const { data: avgData } = useRecipeAverageRatingQuery({
    variables: { recipeId: recipeId! },
    skip: !recipeId,
  });

  const { data: ratingsData } = useRecipeRatingsQuery({
    variables: { recipeId: recipeId!, limit: 50, offset: 0 },
    skip: !recipeId,
  });

  const recipe = data?.recipe;
  const avgRating = avgData?.recipeAverageRating ?? 0;
  const totalRatings = ratingsData?.recipeRatings?.length ?? 0;
  const title = recipe ? pick(recipe.title_el, recipe.title_en, lang) : '';
  const description = recipe
    ? pick(recipe.description_el ?? '', recipe.description_en ?? '', lang)
    : '';
  const chefComment = recipe
    ? pick(recipe.chefComment_el ?? '', recipe.chefComment_en ?? '', lang)
    : '';
  const totalTime = recipe
    ? (recipe.prepTime || 0) + (recipe.cookTime || 0) + (recipe.restTime || 0)
    : 0;

  if (loading) {
    return (
      <div className="min-h-screen">
        <ChefNavbar />
        <div className="flex justify-center pt-24">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-cookie-400 border-t-transparent" />
        </div>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="min-h-screen">
        <ChefNavbar />
        <p className="pt-24 text-center">{t('chef.recipe_detail.not_found')}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <ChefNavbar />

      <main className="mx-auto w-full max-w-3xl lg:max-w-4xl px-6 pb-20 pt-8">
        <button
          onClick={() => router.back()}
          className="mb-6 hover:text-cookie-400"
        >
          {t('common.back')}
        </button>

        <div className="overflow-hidden rounded-2xl bg-surface shadow-xl">
          {recipe.recipeImage && (
            <div className="relative h-56 w-full overflow-hidden">
              <Image
                src={recipe.recipeImage}
                alt={title}
                fill
                className="object-cover"
              />
            </div>
          )}

          <div className="p-6 md:p-8">
            <h1 className="mb-2">{title}</h1>

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
                <span>{recipe.author.user.username}</span>
              </div>
            )}

            {avgRating > 0 && (
              <div className="mb-4 flex items-center gap-2">
                <Stars rating={avgRating} size="sm" />
                <span>
                  {avgRating.toFixed(1)} ({totalRatings})
                </span>
              </div>
            )}

            {description && <p className="mb-6">{description}</p>}

            {chefComment && (
              <p className="mb-6 italic text-myText-muted">
                &ldquo;{chefComment}&rdquo;
              </p>
            )}

            <div className="mb-6 flex flex-col gap-2 rounded-xl border-2 border-cookie-400 px-4 py-3">
              {recipe.prepTime > 0 && (
                <div className="flex justify-between">
                  <span>{t('chef.recipe_detail.prep_time')}</span>
                  <span>
                    {recipe.prepTime} {t('chef.recipe_detail.minutes')}
                  </span>
                </div>
              )}
              {recipe.cookTime > 0 && (
                <div className="flex justify-between">
                  <span>{t('chef.recipe_detail.cook_time')}</span>
                  <span>
                    {recipe.cookTime} {t('chef.recipe_detail.minutes')}
                  </span>
                </div>
              )}
              {recipe.restTime != null && recipe.restTime > 0 && (
                <div className="flex justify-between">
                  <span>{t('chef.recipe_detail.rest_time')}</span>
                  <span>
                    {recipe.restTime} {t('chef.recipe_detail.minutes')}
                  </span>
                </div>
              )}
              {totalTime > 0 && (
                <div className="flex justify-between border-t border-cookie-200 pt-2">
                  <span>{t('chef.recipe_detail.implementation_time')}</span>
                  <span>
                    {totalTime} {t('chef.recipe_detail.minutes')}
                  </span>
                </div>
              )}
              {recipe.difficulty && (
                <div className="flex justify-between">
                  <span>{t('chef.recipe_detail.difficulty')}</span>
                  <span>{recipe.difficulty}</span>
                </div>
              )}
            </div>

            {recipe.recipeIngredients &&
              recipe.recipeIngredients.length > 0 && (
                <div className="mb-6">
                  <h2 className="mb-3">
                    {t('chef.recipe_detail.ingredients')}
                  </h2>
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

            {recipe.steps && recipe.steps.length > 0 && (
              <div className="mb-6">
                <h2 className="mb-3">{t('chef.recipe_detail.execution')}</h2>
                <div className="flex flex-col gap-3">
                  {recipe.steps.map((step, i) => (
                    <div key={step.id} className="flex gap-3">
                      <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-cookie-300 text-white">
                        {i + 1}
                      </span>
                      <p>
                        {pick(step.body_el ?? '', step.body_en ?? '', lang)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {recipe.utensils && recipe.utensils.length > 0 && (
              <div className="mb-6">
                <h2 className="mb-3">{t('chef.recipe_detail.utensils')}</h2>
                <div className="flex flex-wrap gap-2">
                  {recipe.utensils.map((u) => (
                    <span
                      key={u.id}
                      className="rounded-full bg-cookie-100 px-3 py-1"
                    >
                      {lang === 'el' ? u.name_el : u.name_en}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {(recipe.caloriesTotal != null ||
              recipe.protein != null ||
              recipe.carbs != null ||
              recipe.fat != null) && (
              <div>
                <h2 className="mb-3">{t('chef.recipe_detail.macros')}</h2>
                <div className="flex flex-col gap-2 rounded-xl border-2 border-cookie-400 px-4 py-3">
                  {recipe.caloriesTotal != null && (
                    <div className="flex justify-between">
                      <span>{t('chef.create_recipe.calories')}</span>
                      <span>{recipe.caloriesTotal} kcal</span>
                    </div>
                  )}
                  {recipe.protein != null && (
                    <div className="flex justify-between">
                      <span>{t('chef.create_recipe.protein')}</span>
                      <span>{recipe.protein}g</span>
                    </div>
                  )}
                  {recipe.carbs != null && (
                    <div className="flex justify-between">
                      <span>{t('chef.create_recipe.carbs')}</span>
                      <span>{recipe.carbs}g</span>
                    </div>
                  )}
                  {recipe.fat != null && (
                    <div className="flex justify-between">
                      <span>{t('chef.create_recipe.fat')}</span>
                      <span>{recipe.fat}g</span>
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
