import { useRef, useState, useCallback } from 'react';
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
} from '../../../generated/graphql';
import useIsUser from '../../../utils/useIsUser';

const RATINGS_LIMIT = 10;

type DetailTab = 'reviews' | 'rate';

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

function RecipeDetailContent() {
  const { t } = useTranslation('common');
  const router = useRouter();
  const { id } = router.query;
  const recipeId = parseInt(id as string, 10);
  const isEl = router.locale === 'el';

  const [activeTab, setActiveTab] = useState<DetailTab>('reviews');
  const [checkedIngredients, setCheckedIngredients] = useState<Set<number>>(
    new Set(),
  );
  const [addedToCart, setAddedToCart] = useState<Set<number>>(new Set());
  const [ratingScore, setRatingScore] = useState(0);
  const [ratingError, setRatingError] = useState('');
  const [ratingSuccess, setRatingSuccess] = useState('');
  const [serverError, setServerError] = useState('');
  const [cookedSuccess, setCookedSuccess] = useState(false);
  const stepsRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

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
  const totalTime = (recipe?.prepTime ?? 0) + (recipe?.cookTime ?? 0);

  const fetchingMoreRatings = ratingsNetworkStatus === 3;
  const hasMoreReviews =
    reviews.length > 0 && reviews.length % RATINGS_LIMIT === 0;

  const handleScroll = () => {
    if (!stepsRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = stepsRef.current;
    setScrollProgress(
      scrollHeight > clientHeight
        ? scrollTop / (scrollHeight - clientHeight)
        : 0,
    );
  };

  const currentStep = Math.min(
    Math.round(scrollProgress * (steps.length - 1)) + 1,
    steps.length,
  );

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
      setServerError('');
      try {
        await addToCart({ variables: { ingredientId } });
        setAddedToCart((prev) => new Set(prev).add(ingredientId));
        setTimeout(() => {
          setAddedToCart((prev) => {
            const next = new Set(prev);
            next.delete(ingredientId);
            return next;
          });
        }, 1500);
      } catch {
        setServerError(t('cart.addError'));
      }
    },
    [addToCart, t],
  );

  const handleToggleFavorite = async () => {
    setServerError('');
    try {
      if (isFavorited) {
        await unsaveRecipe({ variables: { recipeId } });
      } else {
        await saveRecipe({ variables: { recipeId } });
      }
      await refetchFav();
    } catch {
      setServerError(t('recipes.errorGeneric'));
    }
  };

  const handleRate = async () => {
    setRatingError('');
    setRatingSuccess('');
    if (ratingScore < 1 || ratingScore > 5) {
      setRatingError(t('recipes.ratingScoreError'));
      return;
    }
    try {
      await rateRecipe({ variables: { recipeId, score: ratingScore } });
      setRatingSuccess(t('recipes.ratingSuccess'));
      setRatingScore(0);
      await refetchRatings();
      await refetchMyRating();
    } catch {
      setRatingError(t('recipes.errorGeneric'));
    }
  };

  const handleDeleteRating = async () => {
    setRatingError('');
    setRatingSuccess('');
    try {
      await deleteRecipeRating({ variables: { recipeId } });
      setRatingScore(0);
      setRatingSuccess(t('recipes.ratingDeleted'));
      await refetchRatings();
      await refetchMyRating();
    } catch {
      setRatingError(t('recipes.errorGeneric'));
    }
  };

  const handleLogCooked = async () => {
    setServerError('');
    try {
      await logCookedRecipe({ variables: { recipeId } });
      setCookedSuccess(true);
      setTimeout(() => setCookedSuccess(false), 2000);
    } catch {
      setServerError(t('recipes.errorGeneric'));
    }
  };

  const handleLoadMoreRatings = () => {
    fetchMoreRatings({
      variables: { recipeId, limit: RATINGS_LIMIT, offset: reviews.length },
    });
  };

  if (recipeLoading) {
    return (
      <div className="flex min-h-screen items-center bg-myGrey-200 justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-myBlue-200 border-t-transparent" />
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="flex min-h-screen bg-myGrey-200 items-center justify-center">
        <p className="text-white">{t('chef.recipe_detail.not_found')}</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-myGrey-200 flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-4 py-10 md:px-8 md:py-16">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-[1fr_280px] lg:grid-cols-[1fr_320px] md:items-start">
            {/* ── LEFT column */}
            <div className="flex min-w-0 flex-col gap-6">
              <button
                onClick={() => router.back()}
                className="flex w-fit items-center gap-2 text-sm font-bold transition hover:opacity-80"
                style={{ color: '#EAB308' }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-4 w-4"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.72 12.53a.75.75 0 010-1.06l7.5-7.5a.75.75 0 111.06 1.06L9.31 12l6.97 6.97a.75.75 0 11-1.06 1.06l-7.5-7.5z"
                    clipRule="evenodd"
                  />
                </svg>
                {t('recipes.backToSearch')}
              </button>

              {/* title + image */}
              <div className="relative min-w-0">
                {recipe.category && (
                  <p
                    className="mb-2 text-base font-bold"
                    style={{ color: '#EAB308' }}
                  >
                    {recipe.category}
                  </p>
                )}
                <div className="flex items-start justify-between gap-4">
                  <h1 className="break-words text-3xl font-bold text-white md:text-4xl xl:text-5xl max-w-lg">
                    {title}
                  </h1>
                  {recipe.recipeImage && (
                    <div className="relative hidden h-48 w-48 flex-shrink-0 overflow-hidden rounded-full border-4 border-white shadow-xl md:block">
                      <img
                        src={recipe.recipeImage}
                        alt={title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
                {recipe.recipeImage && (
                  <div className="relative mx-auto mt-4 h-40 w-40 overflow-hidden rounded-full border-4 border-white shadow-xl md:hidden">
                    <img
                      src={recipe.recipeImage}
                      alt={title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>

              {avgRating > 0 && (
                <StarRow rating={avgRating} ratingCount={reviews.length} />
              )}

              {/* ingredients */}
              {ingredients.length > 0 && (
                <div>
                  <h2 className="mb-4 text-2xl font-bold text-white md:text-3xl">
                    {t('ingredientCategories.title')}
                  </h2>
                  <div className="flex flex-col gap-2">
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
                          className="flex items-center gap-2 py-1"
                        >
                          <button
                            onClick={() => toggleIngredient(ingId)}
                            className="flex-shrink-0"
                          >
                            <span
                              className="flex h-4 w-4 items-center justify-center rounded-full border-2 transition"
                              style={{
                                borderColor: isChecked ? '#EAB308' : '#6B7280',
                                backgroundColor: isChecked
                                  ? '#EAB308'
                                  : 'transparent',
                              }}
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
                            className="text-sm leading-relaxed md:text-base"
                            style={{
                              color: isChecked ? '#9CA3AF' : '#fff',
                              textDecoration: isChecked
                                ? 'line-through'
                                : 'none',
                            }}
                          >
                            {ri.quantity} {ri.unit} {name}
                          </span>
                          <button
                            onClick={() => handleAddToCart(ingId)}
                            className="transition"
                            style={{ color: inCart ? '#EAB308' : '#6B7280' }}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="white"
                              className="h-4 w-4"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
                              />
                            </svg>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* steps */}
              {steps.length > 0 && (
                <div>
                  <h2 className="mb-6 text-2xl font-bold text-white md:text-3xl">
                    {t('chef.recipe_detail.execution')}
                  </h2>
                  <div className="flex gap-4">
                    <div
                      ref={stepsRef}
                      onScroll={handleScroll}
                      className="flex flex-1 flex-col gap-6"
                      style={{
                        maxHeight: 480,
                        overflowY: 'auto',
                        scrollbarWidth: 'none',
                      }}
                    >
                      {steps.map((step, i) => (
                        <div key={step.id} className="flex gap-4">
                          <div className="flex w-8 flex-shrink-0 flex-col items-center">
                            <div
                              className="flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold"
                              style={{
                                backgroundColor: '#EAB308',
                                color: '#3F4756',
                              }}
                            >
                              {i + 1}
                            </div>
                            {i < steps.length - 1 && (
                              <div className="mt-2 flex-1 w-0.5 bg-yellow-400 opacity-30" />
                            )}
                          </div>
                          <div className="flex-1 pb-2">
                            <p className="text-sm text-white leading-relaxed md:text-base">
                              {isEl ? step.body_el : step.body_en}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                    {steps.length > 1 && (
                      <div className="hidden flex-col items-center gap-2 md:flex">
                        <div className="flex-1 w-1 rounded-full bg-white/20">
                          <div
                            className="w-1 rounded-full transition-all duration-150"
                            style={{
                              height: `${scrollProgress * 100}%`,
                              backgroundColor: '#EAB308',
                            }}
                          />
                        </div>
                        <span className="text-xs text-white">
                          {currentStep} / {steps.length}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {serverError && (
                <p className="text-sm font-semibold text-red-400">
                  {serverError}
                </p>
              )}
            </div>

            {/* ── RIGHT panel */}
            <div className="min-w-0 overflow-hidden rounded-2xl bg-white shadow-xl md:sticky md:top-6">
              {/* chef section */}
              {recipe.author?.user && (
                <button
                  onClick={() => router.push(`/user/chef/${recipe.authorId}`)}
                  className="flex w-full flex-col items-center gap-3 px-6 pt-6 pb-4 group border-b border-gray-100"
                >
                  {recipe.author.user.image ? (
                    <img
                      src={recipe.author.user.image}
                      alt={recipe.author.user.username}
                      className="h-20 w-20 rounded-full object-cover border-4 border-gray-100 shadow"
                    />
                  ) : (
                    <div
                      className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-gray-100 text-2xl font-bold shadow"
                      style={{ backgroundColor: '#377CC3', color: '#fff' }}
                    >
                      {recipe.author.user.username?.[0]?.toUpperCase() ?? '?'}
                    </div>
                  )}
                  <span className="text-base font-bold text-gray-700 group-hover:underline transition">
                    {recipe.author.user.username}
                  </span>
                </button>
              )}

              {/* chef comment */}
              {chefComment && (
                <div className="px-6 py-4 border-b border-gray-100">
                  <p className="text-sm italic text-gray-500 text-center">
                    &ldquo;{chefComment}&rdquo;
                  </p>
                </div>
              )}

              {/* description */}
              {description && (
                <div className="px-6 py-4 border-b border-gray-100">
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {description}
                  </p>
                </div>
              )}

              {/* stats */}
              <div className="px-6 py-4 border-b border-gray-100 flex flex-col gap-2">
                {totalTime > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">
                      {t('chef.recipe_detail.implementation_time')}
                    </span>
                    <span className="font-semibold text-gray-700">
                      {totalTime} {t('chef.recipe_detail.minutes')}
                    </span>
                  </div>
                )}
                {recipe.caloriesTotal != null && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Kcal</span>
                    <span className="font-semibold text-gray-700">
                      {recipe.caloriesTotal}
                    </span>
                  </div>
                )}
                {recipe.difficulty && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">
                      {t('chef.recipe_detail.difficulty')}
                    </span>
                    <span className="font-semibold text-gray-700">
                      {recipe.difficulty}
                    </span>
                  </div>
                )}
              </div>

              {/* tab content */}
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

              {/* bottom action bar */}
              <div className="flex items-center justify-around border-t border-gray-100 px-4 py-3">
                {[
                  {
                    tab: 'reviews' as DetailTab,
                    icon: 'M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z',
                  },
                  {
                    tab: 'rate' as DetailTab,
                    icon: 'M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z',
                  },
                ].map(({ tab, icon }) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className="flex h-10 w-10 items-center justify-center rounded-full transition"
                    style={{
                      backgroundColor:
                        activeTab === tab ? '#EAB308' : 'transparent',
                      color: activeTab === tab ? 'white' : '#9CA3AF',
                    }}
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
                  className="flex h-10 w-10 items-center justify-center rounded-full transition"
                  style={{ color: isFavorited ? '#EAB308' : '#9CA3AF' }}
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

                <button
                  onClick={handleLogCooked}
                  disabled={logging}
                  className="flex h-10 w-10 items-center justify-center rounded-full transition"
                  style={{ color: cookedSuccess ? '#86EFAC' : '#9CA3AF' }}
                  title={t('recipes.logCooked')}
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
                      d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
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
}
