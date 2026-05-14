import { useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../../../components/Users/Navbar';
import ScrollToTopButton from '../../../components/Helper/ScrollToTopButton';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import { StarRow } from '../../../components/Helper/Stars';
import ReviewsPanel from '../../../components/Users/Recipes/ReviewsPanel';
import RatePanel from '../../../components/Users/Recipes/RatePanel';
import {
  useRecipeQuery,
  useRecipeAverageRatingQuery,
  useRecipeRatingsQuery,
  useMyRecipeRatingQuery,
  useIsFavoritedQuery,
  useSaveRecipeMutation,
  useUnsaveRecipeMutation,
  useAddToCartMutation,
  useRateRecipeMutation,
  useDeleteRecipeRatingMutation,
  useLogCookedRecipeMutation,
  useDeleteCookLogMutation,
} from '../../../generated/graphql';
import useIsUser from '../../../utils/useIsUser';
import { getDifficultyLabel } from '../../../utils/recipeHelpers';
import { getCategoryLabel } from '../../../utils/categoryLabel';
import ShareButton from '../../../components/Helper/ShareButton';
import { useApolloClient } from '@apollo/client';

const RATINGS_LIMIT = 10;

type DetailTab = 'reviews' | 'rate';
type CookState = 'idle' | 'confirm' | 'undo' | 'done';

export async function getServerSideProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}

export default function RecipeDetailPage() {
  const { loading: authLoading, isAuthorized } = useIsUser();
  if (authLoading || !isAuthorized) return null;
  return <RecipeDetailContent />;
}

const CartIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke-width="1.5"
    stroke="currentColor"
    className="h-5 w-5"
  >
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
    />
  </svg>
);

const CheckIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2.5}
    className="h-4 w-4"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M4.5 12.75l6 6 9-13.5"
    />
  </svg>
);

const RecipeDetailContent = () => {
  const { t, i18n } = useTranslation('common');
  const lang = i18n.language as 'el' | 'en';
  const router = useRouter();
  const { id } = router.query;
  const recipeId = parseInt(id as string, 10);
  const isEl = router.locale === 'el';
  const client = useApolloClient();

  const [activeTab, setActiveTab] = useState<DetailTab>('reviews');
  const [checkedIngredients, setCheckedIngredients] = useState<Set<number>>(
    new Set(),
  );
  const [addedToCart, setAddedToCart] = useState<Set<number>>(new Set());
  const [ratingScore, setRatingScore] = useState(0);
  const [ratingError, setRatingError] = useState('');
  const [ratingSuccess, setRatingSuccess] = useState('');
  const [cookState, setCookState] = useState<CookState>('idle');
  const [lastCookId, setLastCookId] = useState<number | null>(null);
  const undoTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { data: recipeData, loading: recipeLoading } = useRecipeQuery({
    variables: { id: recipeId },
    skip: isNaN(recipeId),
    fetchPolicy: 'network-only',
  });

  const { data: avgData } = useRecipeAverageRatingQuery({
    variables: { recipeId },
    skip: isNaN(recipeId),
    fetchPolicy: 'network-only',
  });

  const {
    data: ratingsData,
    loading: ratingsLoading,
    refetch: refetchRatings,
    fetchMore: fetchMoreRatings,
    networkStatus: ratingsNetworkStatus,
  } = useRecipeRatingsQuery({
    variables: { recipeId, limit: RATINGS_LIMIT, offset: 0 },
    skip: isNaN(recipeId),
    fetchPolicy: 'network-only',
    notifyOnNetworkStatusChange: true,
  });

  const { data: myRatingData, refetch: refetchMyRating } =
    useMyRecipeRatingQuery({
      variables: { recipeId },
      skip: isNaN(recipeId),
      fetchPolicy: 'network-only',
    });

  const { data: favData, refetch: refetchFav } = useIsFavoritedQuery({
    variables: { recipeId },
    skip: isNaN(recipeId),
  });

  const [saveRecipe] = useSaveRecipeMutation();
  const [unsaveRecipe] = useUnsaveRecipeMutation();
  const [addToCart] = useAddToCartMutation();
  const [rateRecipe, { loading: rating }] = useRateRecipeMutation();
  const [deleteRecipeRating] = useDeleteRecipeRatingMutation();
  const [logCookedRecipe, { loading: logging }] = useLogCookedRecipeMutation();
  const [deleteCookLog] = useDeleteCookLogMutation();

  const recipe = recipeData?.recipe;
  const avgRating = avgData?.recipeAverageRating ?? 0;
  const reviews = ratingsData?.recipeRatings ?? [];
  const isFavorited = favData?.isFavorited ?? false;
  const myRating = myRatingData?.myRecipeRating ?? null;
  const title = isEl ? recipe?.title_el : recipe?.title_en;
  const description = isEl ? recipe?.description_el : recipe?.description_en;
  const chefComment = isEl ? recipe?.chefComment_el : recipe?.chefComment_en;
  const steps = [...(recipe?.steps ?? [])].sort((a, b) => a.id - b.id);
  const ingredients = recipe?.recipeIngredients ?? [];
  const utensils = recipe?.utensils ?? [];
  const totalTime = (recipe?.prepTime ?? 0) + (recipe?.cookTime ?? 0);

  const fetchingMoreRatings = ratingsNetworkStatus === 3;
  const hasMoreReviews =
    reviews.length > 0 && reviews.length % RATINGS_LIMIT === 0;

  const toggleIngredient = (ingredientId: number) =>
    setCheckedIngredients((prev) => {
      const next = new Set(prev);
      next.has(ingredientId)
        ? next.delete(ingredientId)
        : next.add(ingredientId);
      return next;
    });

  const handleAddToCart = useCallback(
    async (ingredientId: number) => {
      await addToCart({ variables: { ingredientId } });
      setAddedToCart((prev) => new Set(prev).add(ingredientId));
      setTimeout(() => {
        setAddedToCart((prev) => {
          const next = new Set(prev);
          next.delete(ingredientId);
          return next;
        });
      }, 1500);
    },
    [addToCart],
  );

  const handleToggleFavorite = async () => {
    if (isFavorited) {
      await unsaveRecipe({ variables: { recipeId } });
    } else {
      await saveRecipe({ variables: { recipeId } });
    }
    await refetchFav();
  };

  const handleRate = async () => {
    setRatingError('');
    setRatingSuccess('');
    if (ratingScore < 1 || ratingScore > 5) {
      setRatingError(t('recipes.ratingScoreError'));
      return;
    }
    await rateRecipe({ variables: { recipeId, score: ratingScore } });
    setRatingSuccess(t('recipes.ratingSuccess'));
    setRatingScore(0);
    client.cache.evict({ fieldName: 'recipeRatings' });
    client.cache.gc();
    await refetchRatings();
    await refetchMyRating();
  };

  const handleDeleteRating = async () => {
    setRatingError('');
    setRatingSuccess('');
    await deleteRecipeRating({ variables: { recipeId } });
    setRatingScore(0);
    setRatingSuccess(t('recipes.ratingDeleted'));
    await refetchRatings();
    await refetchMyRating();
  };

  const handleLogCooked = async () => {
    const res = await logCookedRecipe({ variables: { recipeId } });
    const logId = res.data?.logCookedRecipe?.id ?? null;
    setLastCookId(logId);
    setCookState('undo');
    undoTimerRef.current = setTimeout(() => {
      setLastCookId(null);
      setCookState('done');
      setTimeout(() => setCookState('idle'), 2000);
    }, 4000);
  };

  const handleUndoCooked = async () => {
    if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
    if (lastCookId !== null)
      await deleteCookLog({ variables: { id: lastCookId } });
    setLastCookId(null);
    setCookState('idle');
  };

  const handleLoadMoreRatings = () => {
    fetchMoreRatings({
      variables: { recipeId, limit: RATINGS_LIMIT, offset: reviews.length },
    });
  };

  if (recipeLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-cookie-300 border-t-transparent" />
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>{t('chef.recipe_detail.not_found')}</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-4 py-10 md:px-8 md:py-16">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-[1fr_280px] lg:grid-cols-[1fr_320px] md:items-start">
            <div className="flex min-w-0 flex-col gap-8">
              <button
                onClick={() => router.back()}
                className="flex w-fit items-center gap-2 text-myText-muted transition hover:text-cookie-400"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="h-4 w-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
                  />
                </svg>
                {t('common.back')}
              </button>

              <div className="flex min-w-0 flex-col gap-3">
                {recipe.category && (
                  <p className="text-sm text-myText-muted">
                    {getCategoryLabel(recipe.category, lang)}
                  </p>
                )}
                <h1 className="max-w-lg break-words leading-tight">{title}</h1>
                {avgRating > 0 && (
                  <StarRow rating={avgRating} ratingCount={reviews.length} />
                )}
                <ShareButton
                  dark
                  url={
                    typeof window !== 'undefined' ? window.location.href : ''
                  }
                />
              </div>

              {cookState === 'undo' ? (
                <div className="flex items-center gap-2">
                  <span className="rounded-xl border-2 border-herb-200 bg-herb-200 px-4 py-0.5 text-white">
                    {t('chef.recipe_detail.marked_as_cooked')}
                  </span>
                  <button
                    onClick={handleUndoCooked}
                    className="rounded-xl border-2 border-myRed px-4 py-0.5 text-myRed transition hover:bg-myRed hover:text-white"
                  >
                    {t('common.undo')}
                  </button>
                </div>
              ) : (
                <button
                  onClick={cookState === 'idle' ? handleLogCooked : undefined}
                  disabled={logging || cookState === 'done'}
                  className={`w-fit rounded-xl border-2 border-cookie-400 px-4 py-0.5 transition disabled:cursor-not-allowed disabled:opacity-50 ${
                    cookState === 'done'
                      ? 'border-herb-200 bg-herb-200 text-white'
                      : 'hover:bg-cookie-400 hover:text-white'
                  }`}
                >
                  {cookState === 'done'
                    ? t('chef.recipe_detail.marked_as_cooked')
                    : t('chef.recipe_detail.mark_as_cooked')}
                </button>
              )}

              {description && (
                <p className="text-myText-muted md:hidden">{description}</p>
              )}

              {ingredients.length > 0 && (
                <div>
                  <h2 className="mb-4">{t('ingredientCategories.title')}</h2>
                  <div className="flex flex-col divide-y divide-cookie-200">
                    {ingredients.map((ri) => {
                      if (!ri.ingredient) return null;
                      const ingId = ri.ingredientId;
                      const name = isEl
                        ? ri.ingredient.name_el
                        : ri.ingredient.name_en;
                      const isChecked = checkedIngredients.has(ingId);
                      const inCart = addedToCart.has(ingId);
                      return (
                        <div
                          key={ingId}
                          className="flex items-center gap-3 py-2.5"
                        >
                          <button
                            onClick={() => toggleIngredient(ingId)}
                            className="flex-shrink-0"
                          >
                            <span
                              className={`flex h-4 w-4 items-center justify-center rounded-full border-2 transition ${
                                isChecked
                                  ? 'border-cookie-300 bg-cookie-300'
                                  : 'border-myText-muted'
                              }`}
                            >
                              {isChecked && (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 24 24"
                                  fill="currentColor"
                                  className="h-2.5 w-2.5 text-white"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              )}
                            </span>
                          </button>

                          <span
                            className={`flex-1 transition ${
                              isChecked ? 'text-myText-muted line-through' : ''
                            }`}
                          >
                            {ri.quantity} {ri.unit} {name}
                          </span>

                          <button
                            onClick={() => !inCart && handleAddToCart(ingId)}
                            title={
                              inCart
                                ? t('recipes.cart.addedToCart')
                                : t('recipes.cart.addToList')
                            }
                            className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border-2 transition ${
                              inCart
                                ? 'border-herb-200 bg-herb-200 text-white'
                                : 'border-cookie-400 text-cookie-400 hover:bg-cookie-400 hover:text-white'
                            }`}
                          >
                            {inCart ? <CheckIcon /> : <CartIcon />}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {steps.length > 0 && (
                <div>
                  <h2 className="mb-6">{t('chef.recipe_detail.execution')}</h2>
                  <div className="flex flex-col gap-4">
                    {steps.map((step, i) => (
                      <div key={step.id} className="flex gap-4">
                        <div className="flex w-8 flex-shrink-0 flex-col items-center">
                          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-cookie-300 text-white">
                            {i + 1}
                          </div>
                        </div>
                        <div className="flex-1 pb-2">
                          <p>{isEl ? step.body_el : step.body_en}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {utensils.length > 0 && (
                <div>
                  <h2 className="mb-4">
                    {t('chef.create_recipe.utensils_label')}
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {utensils.map((u) => (
                      <span
                        key={u.id}
                        className="rounded-full border-2 border-cookie-400 px-4 py-1.5"
                      >
                        {isEl ? u.name_el : u.name_en}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="min-w-0 overflow-hidden rounded-2xl bg-surface shadow-xl md:sticky md:top-6">
              {recipe.author?.user && (
                <button
                  onClick={() => router.push(`/user/chef/${recipe.authorId}`)}
                  className="group flex w-full flex-col items-center gap-2 border-b border-cookie-400 px-6 pb-4 pt-6"
                >
                  {recipe.author.user.image ? (
                    <img
                      src={recipe.author.user.image}
                      alt={recipe.author.user.username}
                      className="h-20 w-20 rounded-full border-4 border-surface object-cover shadow"
                    />
                  ) : (
                    <div className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-surface bg-cookie-200 text-myText-heading shadow">
                      {recipe.author.user.username[0].toUpperCase()}
                    </div>
                  )}
                  <span className="text-base transition group-hover:underline">
                    {recipe.author.user.username}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-cookie-200 px-3 py-0.5">
                    {t('chef.recipe_detail.view_chef_profile')}
                  </span>
                </button>
              )}

              {chefComment && (
                <div className="border-b border-cookie-400 px-6 py-4">
                  <p className="text-center">&ldquo;{chefComment}&rdquo;</p>
                </div>
              )}

              {description && (
                <div className="hidden border-b border-cookie-400 px-6 py-4 md:block">
                  <p>{description}</p>
                </div>
              )}

              <div className="flex flex-col gap-2 border-b border-cookie-400 px-6 py-4">
                {recipe.prepTime > 0 && (
                  <div className="flex justify-between">
                    <span>{t('chef.create_recipe.prep_time')}</span>
                    <span>
                      {recipe.prepTime} {t('chef.recipe_detail.minutes')}
                    </span>
                  </div>
                )}
                {recipe.cookTime > 0 && (
                  <div className="flex justify-between">
                    <span>{t('chef.create_recipe.cook_time')}</span>
                    <span>
                      {recipe.cookTime} {t('chef.recipe_detail.minutes')}
                    </span>
                  </div>
                )}
                {recipe.restTime != null && recipe.restTime > 0 && (
                  <div className="flex justify-between">
                    <span>{t('chef.create_recipe.rest_time')}</span>
                    <span>
                      {recipe.restTime} {t('chef.recipe_detail.minutes')}
                    </span>
                  </div>
                )}
                {totalTime > 0 && (
                  <div className="mt-1 flex justify-between border-b border-cookie-400 pb-4">
                    <span>{t('chef.recipe_detail.implementation_time')}</span>
                    <span>
                      {totalTime} {t('chef.recipe_detail.minutes')}
                    </span>
                  </div>
                )}
                {recipe.difficulty && (
                  <div className="flex justify-between">
                    <span>{t('chef.recipe_detail.difficulty')}</span>
                    <span>{getDifficultyLabel(recipe.difficulty, t)}</span>
                  </div>
                )}
                {(recipe.caloriesTotal != null ||
                  recipe.protein != null ||
                  recipe.carbs != null ||
                  recipe.fat != null) && (
                  <div className="mt-1 flex flex-col gap-1.5 border-t border-cookie-400 pt-2">
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
                )}
              </div>

              {activeTab === 'reviews' && (
                <ReviewsPanel
                  reviews={reviews}
                  loading={ratingsLoading && !fetchingMoreRatings}
                  hasMore={hasMoreReviews}
                  loadingMore={fetchingMoreRatings}
                  onLoadMore={handleLoadMoreRatings}
                />
              )}
              {activeTab === 'rate' && (
                <RatePanel
                  myRating={myRating}
                  ratingScore={ratingScore}
                  ratingError={ratingError}
                  ratingSuccess={ratingSuccess}
                  submitting={rating}
                  onScoreChange={setRatingScore}
                  onSubmit={handleRate}
                  onDelete={handleDeleteRating}
                />
              )}

              <div className="flex items-center justify-around border-t border-cookie-400 px-4 py-3">
                {(
                  [
                    {
                      tab: 'reviews' as DetailTab,
                      icon: 'M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z',
                    },
                    {
                      tab: 'rate' as DetailTab,
                      icon: 'M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z',
                    },
                  ] as const
                ).map(({ tab, icon }) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex h-10 w-10 items-center justify-center rounded-full transition ${
                      activeTab === tab
                        ? 'bg-cookie-300 text-white'
                        : 'text-myText-muted'
                    }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="h-5 w-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d={icon}
                      />
                    </svg>
                  </button>
                ))}

                <button
                  onClick={handleToggleFavorite}
                  className={`flex h-10 w-10 items-center justify-center rounded-full transition ${
                    isFavorited ? 'text-cookie-300' : 'text-myText-muted'
                  }`}
                  title={t('recipes.favourites')}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill={isFavorited ? 'currentColor' : 'none'}
                    stroke="currentColor"
                    strokeWidth={isFavorited ? 0 : 1.5}
                    className="h-5 w-5"
                  >
                    <path d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <ScrollToTopButton />
    </div>
  );
};
