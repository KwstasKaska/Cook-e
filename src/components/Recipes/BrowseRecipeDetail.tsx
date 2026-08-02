import { ReactNode, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { useApolloClient } from '@apollo/client';
import { StarRow } from '../Helper/Stars';
import ReviewsPanel from '../Users/Recipes/ReviewsPanel';
import RatePanel from '../Users/Recipes/RatePanel';
import ShareButton from '../Helper/ShareButton';
import {
  useRecipeQuery,
  useRecipeAverageRatingQuery,
  useRecipeRatingsQuery,
  useMyRecipeRatingQuery,
  useIsFavoritedQuery,
  useSaveRecipeMutation,
  useUnsaveRecipeMutation,
  useAddToCartMutation,
  useRemoveFromCartByIngredientIdMutation,
  useRateRecipeMutation,
  useDeleteRecipeRatingMutation,
  useLogCookedRecipeMutation,
  useDeleteCookLogMutation,
  useMyCartIngredientIdsQuery,
  useMyChefProfileQuery,
} from '../../generated/graphql';
import { getDifficultyLabel } from '../../utils/recipeHelpers';
import { getCategoryLabel } from '../../utils/categoryLabel';

const RATINGS_LIMIT = 10;

type CookState = 'idle' | 'confirmed';

type Props = {
  navbar: ReactNode;
  role: 'user' | 'chef' | 'nutritionist';
};

const BrowseRecipeDetail = ({ navbar, role }: Props) => {
  const { t, i18n } = useTranslation('common');
  const lang = i18n.language as 'el' | 'en';
  const router = useRouter();
  const { id } = router.query;
  const recipeId = parseInt(id as string, 10);
  const isEl = router.locale === 'el';
  const client = useApolloClient();

  const [showRateForm, setShowRateForm] = useState(false);
  const [ratingScore, setRatingScore] = useState(0);
  const [cookState, setCookState] = useState<CookState>('idle');
  const [lastCookId, setLastCookId] = useState<number | null>(null);

  const { data: recipeData, loading: recipeLoading } = useRecipeQuery({
    variables: { id: recipeId },
    skip: isNaN(recipeId),
    fetchPolicy: 'network-only',
  });

  const { data: avgData, refetch: refetchAvg } = useRecipeAverageRatingQuery({
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

  const { data: cartIdsData, refetch: refetchCartIds } =
    useMyCartIngredientIdsQuery({
      fetchPolicy: 'network-only',
      skip: role !== 'user',
    });

  const { data: chefProfileData } = useMyChefProfileQuery({
    skip: role !== 'chef',
  });

  const cartIngredientIds = new Set(cartIdsData?.myCartIngredientIds ?? []);
  const myChefProfileId = chefProfileData?.myChefProfile?.id;

  const [saveRecipe] = useSaveRecipeMutation();
  const [unsaveRecipe] = useUnsaveRecipeMutation();
  const [addToCart] = useAddToCartMutation();
  const [removeFromCartByIngredientId] =
    useRemoveFromCartByIngredientIdMutation();
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
  const isOwnRecipe =
    role === 'chef' &&
    myChefProfileId !== undefined &&
    recipe?.authorId === myChefProfileId;

  const fetchingMoreRatings = ratingsNetworkStatus === 3;
  const hasMoreReviews =
    reviews.length > 0 && reviews.length % RATINGS_LIMIT === 0;

  const handleToggleCart = async (ingredientId: number) => {
    if (cartIngredientIds.has(ingredientId)) {
      await removeFromCartByIngredientId({ variables: { ingredientId } });
    } else {
      await addToCart({ variables: { ingredientId } });
    }
    await refetchCartIds();
  };

  const handleToggleFavorite = async () => {
    if (isFavorited) {
      await unsaveRecipe({ variables: { recipeId } });
    } else {
      await saveRecipe({ variables: { recipeId } });
    }
    await refetchFav();
  };

  const handleRate = async () => {
    await rateRecipe({ variables: { recipeId, score: ratingScore } });
    setRatingScore(0);
    setShowRateForm(false);
    client.cache.evict({ fieldName: 'recipeRatings' });
    client.cache.evict({ fieldName: 'recipeAverageRating' });
    client.cache.gc();
    await refetchRatings();
    await refetchMyRating();
    await refetchAvg();
  };

  const handleDeleteRating = async () => {
    await deleteRecipeRating({ variables: { recipeId } });
    setRatingScore(0);
    client.cache.evict({ fieldName: 'recipeRatings' });
    client.cache.evict({ fieldName: 'recipeAverageRating' });
    client.cache.gc();
    await refetchRatings();
    await refetchMyRating();
    await refetchAvg();
  };

  const handleLogCooked = async () => {
    const res = await logCookedRecipe({ variables: { recipeId } });
    const logId = res.data?.logCookedRecipe?.id ?? null;
    setLastCookId(logId);
    setCookState('confirmed');
  };

  const handleUndoCooked = async () => {
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
      {navbar}
      <main className="flex-1">
        <div className="mx-auto max-w-3xl lg:max-w-5xl px-4 py-10 md:px-8 md:py-16">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-[1fr_280px] lg:grid-cols-[1fr_320px] md:items-start">
            <div className="flex min-w-0 flex-col gap-8">
              <button
                onClick={() => router.back()}
                className="flex w-fit items-center gap-2 transition hover:text-cookie-400"
              >
                {t('common.back')}
              </button>

              <div className="flex min-w-0 flex-col gap-3">
                {recipe.category && (
                  <p className="text-sm">
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
                    typeof window !== 'undefined'
                      ? `${window.location.origin}/user/recipes/${recipeId}`
                      : ''
                  }
                />
              </div>

              {description && <p className="md:hidden">{description}</p>}

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
                      const inCart = cartIngredientIds.has(ingId);
                      return (
                        <div
                          key={ingId}
                          className="flex items-center gap-3 py-2.5"
                        >
                          <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-cookie-400" />
                          <span className="flex-1">
                            {ri.quantity}{' '}
                            {t(`chef.create_recipe.units.${ri.unit}`)} {name}
                          </span>
                          {role === 'user' && (
                            <button
                              onClick={() => handleToggleCart(ingId)}
                              className={`flex-shrink-0 rounded-xl border-2 px-3 py-0.5 text-sm transition ${
                                inCart
                                  ? 'border-herb-200 bg-herb-200 text-white hover:border-myRed hover:bg-myRed'
                                  : 'border-cookie-400 text-cookie-400 hover:bg-cookie-400 hover:text-white'
                              }`}
                            >
                              {inCart
                                ? t('cart.addedToCart')
                                : t('cart.addToList')}
                            </button>
                          )}
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
                <div
                  onClick={() =>
                    role === 'user' &&
                    router.push(`/user/chef/${recipe.authorId}`)
                  }
                  className={`flex flex-col items-center gap-2 border-b border-cookie-400 px-6 pb-4 pt-6 ${
                    role === 'user' ? 'cursor-pointer' : ''
                  }`}
                >
                  {recipe.author.user.image ? (
                    <img
                      src={recipe.author.user.image}
                      alt={recipe.author.user.username}
                      className="h-20 w-20 rounded-full border-4 border-surface object-cover shadow"
                    />
                  ) : (
                    <div className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-surface bg-cookie-200 shadow">
                      {recipe.author.user.username[0].toUpperCase()}
                    </div>
                  )}
                  <span className="text-base">
                    {recipe.author.user.username}
                  </span>
                </div>
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

              <div className="flex flex-col gap-2 border-b border-cookie-400 px-6 py-3">
                <button
                  onClick={handleToggleFavorite}
                  className={`w-full rounded-xl border-2 px-4 py-1.5 transition ${
                    isFavorited
                      ? 'border-herb-200 bg-herb-200 text-white hover:border-myRed hover:bg-myRed'
                      : 'border-cookie-400 text-cookie-400 hover:bg-cookie-400 hover:text-white'
                  }`}
                >
                  {isFavorited
                    ? t('recipes.savedToFavorites')
                    : t('recipes.save')}
                </button>

                {role === 'user' &&
                  (cookState === 'confirmed' ? (
                    <div className="flex flex-col gap-2 rounded-xl border-2 border-herb-200 px-4 py-2.5">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm text-herb-200">
                          {t('chef.recipe_detail.logged_to_summary')}
                        </span>
                        <button
                          onClick={handleUndoCooked}
                          className="flex-shrink-0 rounded-xl border-2 border-myRed px-3 py-0.5 text-sm text-myRed transition hover:bg-myRed hover:text-white"
                        >
                          {t('common.undo')}
                        </button>
                      </div>
                      <Link
                        href="/user"
                        className="text-center text-sm text-cookie-400 underline transition hover:text-cookie-300"
                      >
                        {t('chef.recipe_detail.view_nutritional_info')}
                      </Link>
                    </div>
                  ) : (
                    <button
                      onClick={handleLogCooked}
                      disabled={logging}
                      className="w-full rounded-xl border-2 border-cookie-400 px-4 py-1.5 text-cookie-400 transition hover:bg-cookie-400 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {t('chef.recipe_detail.mark_as_cooked')}
                    </button>
                  ))}

                {!isOwnRecipe && (
                  <button
                    onClick={() => setShowRateForm((prev) => !prev)}
                    className={`w-full rounded-xl border-2 px-4 py-1.5 transition ${
                      showRateForm
                        ? 'border-herb-200 bg-herb-200 hover:border-myRed hover:bg-myRed text-white'
                        : 'border-cookie-400 text-cookie-400 hover:bg-cookie-400 hover:text-white'
                    }`}
                  >
                    {t('recipes.rateTitle')}
                  </button>
                )}
              </div>

              {showRateForm && (
                <RatePanel
                  myRating={myRating}
                  ratingScore={ratingScore}
                  submitting={rating}
                  onScoreChange={setRatingScore}
                  onSubmit={handleRate}
                  onDelete={handleDeleteRating}
                />
              )}

              <ReviewsPanel
                reviews={reviews}
                loading={ratingsLoading && !fetchingMoreRatings}
                hasMore={hasMoreReviews}
                loadingMore={fetchingMoreRatings}
                onLoadMore={handleLoadMoreRatings}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BrowseRecipeDetail;
