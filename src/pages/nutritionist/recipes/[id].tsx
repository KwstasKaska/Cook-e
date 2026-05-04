import { useRouter } from 'next/router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import NutrNavbar from '../../../components/Nutritionist/NutrNavbar';
import ScrollToTopButton from '../../../components/Helper/ScrollToTopButton';
import { useRecipeQuery } from '../../../generated/graphql';
import useIsNutritionist from '../../../utils/useIsNutr';
import { pick } from '../../../utils/pick';

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

function NutrRecipeDetailContent() {
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
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-myBlue-200 border-t-transparent" />
        </div>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="min-h-screen">
        <NutrNavbar />
        <p className="pt-24 text-center text-gray-300">
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
          onClick={() => router.push('/nutritionist/recipes')}
          className="mb-6 flex items-center gap-1 text-sm text-gray-300 hover:text-white transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          {t('common.back')}
        </button>

        <button
          onClick={() => {
            const url = `${window.location.origin}/user/recipes/${recipe.id}`;
            navigator.clipboard.writeText(url);
          }}
          className="mb-8 flex items-center gap-2 text-sm text-myBlue-200 hover:text-white transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-4 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
          {t('recipes.copy')}
        </button>

        <div className="flex items-start justify-between gap-4 mb-6">
          <h1 className="text-3xl font-bold text-white leading-tight md:text-4xl">
            {title}
          </h1>
        </div>

        {recipe.author?.user && (
          <div className="mb-4 flex items-center gap-3">
            {recipe.author.user.image ? (
              <img
                src={recipe.author.user.image}
                alt={recipe.author.user.username}
                className="h-9 w-9 rounded-full object-cover border-2 border-white shadow"
              />
            ) : (
              <div
                className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white text-sm font-bold shadow"
                style={{ backgroundColor: '#377CC3', color: '#fff' }}
              >
                {recipe.author.user.username?.[0]?.toUpperCase() ?? '?'}
              </div>
            )}
            <span className="text-sm font-semibold text-gray-300">
              {recipe.author.user.username}
            </span>
          </div>
        )}

        {recipe.recipeIngredients && recipe.recipeIngredients.length > 0 && (
          <div className="mb-8 ">
            <h2 className="mb-3 text-xl font-bold text-white">
              {t('recipes.ingredients')}
            </h2>
            <ul className="rounded-xl bg-white/5 border  border-white/10 px-4 py-3 flex flex-col gap-1.5">
              {recipe.recipeIngredients.map((ri) => (
                <li
                  key={ri.ingredientId}
                  className="flex items-center gap-2 text-white text-sm "
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-myBlue-200 flex-shrink-0" />
                  {pick(
                    ri.ingredient?.name_el ?? '',
                    ri.ingredient?.name_en ?? '',
                    lang,
                  )}{' '}
                  — {ri.quantity} {ri.unit}
                </li>
              ))}
            </ul>
          </div>
        )}

        {hasMacros && (
          <div className="mb-8">
            <h2 className="mb-3 text-xl font-bold text-white">
              {t('chef.create_recipe.macros_label')}
            </h2>
            <div className="rounded-xl bg-white/5 border text-white border-white/10 px-4 py-3 flex flex-col gap-2">
              {recipe.caloriesTotal != null && (
                <div className="flex justify-between  text-sm">
                  <span className="">{t('chef.create_recipe.calories')}</span>
                  <span className="font-semibold ">
                    {recipe.caloriesTotal} kcal
                  </span>
                </div>
              )}
              {recipe.protein != null && (
                <div className="flex justify-between text-sm">
                  <span className="">{t('chef.create_recipe.protein')}</span>
                  <span className="font-semibold ">{recipe.protein}g</span>
                </div>
              )}
              {recipe.carbs != null && (
                <div className="flex justify-between text-sm">
                  <span className="">{t('chef.create_recipe.carbs')}</span>
                  <span className="font-semibold ">{recipe.carbs}g</span>
                </div>
              )}
              {recipe.fat != null && (
                <div className="flex justify-between text-sm">
                  <span className="">{t('chef.create_recipe.fat')}</span>
                  <span className="font-semibold ">{recipe.fat}g</span>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      <ScrollToTopButton />
    </div>
  );
}
