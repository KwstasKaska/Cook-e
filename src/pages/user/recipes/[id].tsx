import { useRef, useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../../../components/Users/Navbar';
import ScrollToTopButton from '../../../components/Helper/ScrollToTopButton';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import { StarRow } from '../../../components/Helper/Stars';
import IngredientsPanel from '../../../components/Users/Recipes/IngredientsPanel';
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
} from '../../../generated/graphql';
import useIsUser from '../../../utils/useIsUser';

type DetailTab = 'ingredients' | 'reviews' | 'rate';

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

  // ── UI state
  const [activeTab, setActiveTab] = useState<DetailTab>('ingredients');
  const [checkedIngredients, setCheckedIngredients] = useState<Set<number>>(
    new Set(),
  );
  const [addedToCart, setAddedToCart] = useState<Set<number>>(new Set());
  const [ratingScore, setRatingScore] = useState(0);
  const [ratingComment, setRatingComment] = useState('');
  const [ratingError, setRatingError] = useState('');
  const [ratingSuccess, setRatingSuccess] = useState('');
  const [serverError, setServerError] = useState('');
  const stepsRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  // ── Queries
  const { data: recipeData, loading: recipeLoading } = useRecipeQuery({
    variables: { id: recipeId },
    skip: isNaN(recipeId),
    fetchPolicy: 'network-only',
  });

  const { data: avgData } = useRecipeAverageRatingQuery({
    variables: { recipeId },
    skip: isNaN(recipeId),
  });

  const {
    data: ratingsData,
    loading: ratingsLoading,
    refetch: refetchRatings,
  } = useRecipeRatingsQuery({
    variables: { recipeId, limit: 10, offset: 0 },
    skip: isNaN(recipeId),
    fetchPolicy: 'network-only',
  });

  const { data: myRatingData, refetch: refetchMyRating } =
    useMyRecipeRatingQuery({
      variables: { recipeId },
      skip: isNaN(recipeId),
    });

  const { data: favData, refetch: refetchFav } = useIsFavoritedQuery({
    variables: { recipeId },
    skip: isNaN(recipeId),
  });

  // ── Mutations
  const [saveRecipe] = useSaveRecipeMutation();
  const [unsaveRecipe] = useUnsaveRecipeMutation();
  const [addToCart] = useAddToCartMutation();
  const [rateRecipe, { loading: rating }] = useRateRecipeMutation();
  const [deleteRecipeRating] = useDeleteRecipeRatingMutation();

  const recipe = recipeData?.recipe;
  const avgRating = avgData?.recipeAverageRating ?? 0;
  const ratingCount = ratingsData?.recipeRatings?.length ?? 0;
  const isFavorited = favData?.isFavorited ?? false;
  const myRating = myRatingData?.myRecipeRating ?? null;
  const title = isEl ? recipe?.title_el : recipe?.title_en;
  const steps = [...(recipe?.steps ?? [])].sort((a, b) => a.id - b.id);
  const ingredients = recipe?.recipeIngredients ?? [];
  const totalTime = (recipe?.prepTime ?? 0) + (recipe?.cookTime ?? 0);

  // ── Scroll handler
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

  // ── Handlers
  const toggleIngredient = (ingredientId: number) =>
    setCheckedIngredients((prev) => {
      const next = new Set(prev);
      next.has(ingredientId)
        ? next.delete(ingredientId)
        : next.add(ingredientId);
      return next;
    });

  const handleAddToCart = useCallback(
    async (ingredientId: number, quantity?: string, unit?: string) => {
      setServerError('');
      try {
        await addToCart({
          variables: {
            ingredientId,
            quantity: quantity ?? '100',
            unit: unit ?? 'g',
          },
        });
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
      await rateRecipe({
        variables: {
          recipeId,
          score: ratingScore,
          comment: ratingComment || undefined,
        },
      });
      setRatingSuccess(t('recipes.ratingSuccess'));
      setRatingComment('');
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
      setRatingComment('');
      setRatingSuccess(t('recipes.ratingDeleted'));
      await refetchRatings();
      await refetchMyRating();
    } catch {
      setRatingError(t('recipes.errorGeneric'));
    }
  };

  if (recipeLoading) {
    return (
      <div
        className="flex min-h-screen items-center justify-center"
        style={{ backgroundColor: '#3F4756' }}
      >
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-myBlue-200 border-t-transparent" />
      </div>
    );
  }

  if (!recipe) {
    return (
      <div
        className="flex min-h-screen items-center justify-center"
        style={{ backgroundColor: '#3F4756' }}
      >
        <p className="text-white">{t('chef.recipe_detail.not_found')}</p>
      </div>
    );
  }

  return (
    <div
      className="flex min-h-screen flex-col"
      style={{ backgroundColor: '#3F4756' }}
    >
      <Navbar />
      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-4 py-10 md:px-8 md:py-16">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-[1fr_360px] md:items-start">
            {/* ── LEFT */}
            <div className="flex flex-col gap-6">
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

              {/* Title + image */}
              <div className="relative">
                {recipe.category && (
                  <p
                    className="mb-2 text-base font-bold"
                    style={{ color: '#EAB308' }}
                  >
                    {recipe.category}
                  </p>
                )}
                <div className="flex items-start justify-between gap-4">
                  <h1 className="text-3xl font-bold text-white md:text-4xl xl:text-5xl max-w-lg">
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
                <StarRow rating={avgRating} ratingCount={ratingCount} />
              )}

              {(isEl ? recipe.chefComment_el : recipe.chefComment_en) && (
                <p className="max-w-lg text-sm italic text-gray-300">
                  "{isEl ? recipe.chefComment_el : recipe.chefComment_en}"
                  {recipe.author?.user?.username && (
                    <span className="ml-2 not-italic font-semibold text-gray-400">
                      —{' '}
                      <button
                        onClick={() =>
                          router.push(`/user/chef/${recipe.authorId}`)
                        }
                        className="hover:underline transition"
                      >
                        {recipe.author.user.username}
                      </button>
                    </span>
                  )}
                </p>
              )}

              {/* Steps */}
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
            <div className="rounded-2xl bg-white shadow-xl overflow-hidden sticky top-6">
              {activeTab === 'ingredients' && (
                <IngredientsPanel
                  ingredients={ingredients}
                  totalTime={totalTime}
                  caloriesTotal={recipe.caloriesTotal}
                  difficulty={recipe.difficulty}
                  checkedIngredients={checkedIngredients}
                  addedToCart={addedToCart}
                  onToggleIngredient={toggleIngredient}
                  onAddToCart={handleAddToCart}
                  isEl={isEl}
                />
              )}

              {activeTab === 'reviews' && (
                <ReviewsPanel
                  reviews={ratingsData?.recipeRatings ?? []}
                  loading={ratingsLoading}
                />
              )}

              {activeTab === 'rate' && (
                <RatePanel
                  myRating={myRating}
                  ratingScore={ratingScore}
                  ratingComment={ratingComment}
                  ratingError={ratingError}
                  ratingSuccess={ratingSuccess}
                  submitting={rating}
                  onScoreChange={setRatingScore}
                  onCommentChange={setRatingComment}
                  onSubmit={handleRate}
                  onDelete={handleDeleteRating}
                />
              )}

              {/* Bottom action bar */}
              <div className="flex items-center justify-around border-t border-gray-100 px-4 py-3">
                {(
                  [
                    {
                      tab: 'ingredients' as DetailTab,
                      icon: 'M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25',
                    },
                    {
                      tab: 'reviews' as DetailTab,
                      icon: 'M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z',
                    },
                    {
                      tab: 'rate' as DetailTab,
                      icon: 'M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z',
                    },
                  ] as { tab: DetailTab; icon: string }[]
                ).map(({ tab, icon }) => (
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

                {/* Save/unsave */}
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
              </div>
            </div>
          </div>
        </div>
      </main>
      <ScrollToTopButton />
    </div>
  );
}
