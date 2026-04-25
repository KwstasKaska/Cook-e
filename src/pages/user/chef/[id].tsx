import { useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../../../components/Users/Navbar';
import ScrollToTopButton from '../../../components/Helper/ScrollToTopButton';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import {
  StarRow,
  SmallStars,
  StarPicker,
} from '../../../components/Helper/Stars';
import {
  useChefQuery,
  useChefAverageRatingQuery,
  useChefRatingsQuery,
  useMyChefRatingQuery,
  useRateChefMutation,
  useDeleteChefRatingMutation,
  useRecipesByChefQuery,
} from '../../../generated/graphql';
import useIsUser from '../../../utils/useIsUser';
import { useChatContext } from '../../../components/Chat/ChatContext';

const RECIPES_LIMIT = 6;
const RATINGS_LIMIT = 10;

export async function getServerSideProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}

export default function ChefProfilePage() {
  const { loading: authLoading, isAuthorized } = useIsUser();
  if (authLoading || !isAuthorized) return null;

  return <ChefProfileContent />;
}

function ChefProfileContent() {
  const { t } = useTranslation('common');
  const router = useRouter();
  const { id } = router.query;
  const chefId = parseInt(id as string, 10);
  const isEl = router.locale === 'el';
  const { openConversation } = useChatContext();

  // ── Rating form state
  const [ratingScore, setRatingScore] = useState(0);
  const [ratingComment, setRatingComment] = useState('');
  const [ratingError, setRatingError] = useState('');
  const [ratingSuccess, setRatingSuccess] = useState('');

  // ── Queries
  const { data: chefData, loading: chefLoading } = useChefQuery({
    variables: { id: chefId },
    skip: isNaN(chefId),
    fetchPolicy: 'network-only',
  });

  const { data: avgData } = useChefAverageRatingQuery({
    variables: { chefId },
    skip: isNaN(chefId),
  });

  const {
    data: ratingsData,
    loading: ratingsLoading,
    refetch: refetchRatings,
    fetchMore: fetchMoreRatings,
    networkStatus: ratingsNetworkStatus,
  } = useChefRatingsQuery({
    variables: { chefId, limit: RATINGS_LIMIT, offset: 0 },
    skip: isNaN(chefId),
    fetchPolicy: 'network-only',
    notifyOnNetworkStatusChange: true,
  });

  const { data: myRatingData, refetch: refetchMyRating } = useMyChefRatingQuery(
    {
      variables: { chefId },
      skip: isNaN(chefId),
    },
  );

  const chef = chefData?.chef;

  // ── Recipes — real fetchMore, chefId = ChefProfile.id = authorId on Recipe
  const {
    data: recipesData,
    loading: recipesLoading,
    fetchMore: fetchMoreRecipes,
    networkStatus: recipesNetworkStatus,
  } = useRecipesByChefQuery({
    variables: { chefId, limit: RECIPES_LIMIT, offset: 0 },
    skip: isNaN(chefId),
    fetchPolicy: 'network-only',
    notifyOnNetworkStatusChange: true,
  });

  // ── Mutations
  const [rateChef, { loading: submitting }] = useRateChefMutation();
  const [deleteChefRating] = useDeleteChefRatingMutation();

  const avgRating = avgData?.chefAverageRating ?? 0;
  const reviews = ratingsData?.chefRatings ?? [];
  const myRating = myRatingData?.myChefRating ?? null;
  const recipes = recipesData?.recipesByChef ?? [];

  const fetchingMoreRecipes = recipesNetworkStatus === 3;
  const fetchingMoreRatings = ratingsNetworkStatus === 3;

  const hasMoreRecipes =
    recipes.length > 0 && recipes.length % RECIPES_LIMIT === 0;
  const hasMoreReviews =
    reviews.length > 0 && reviews.length % RATINGS_LIMIT === 0;

  // ── Handlers
  const handleRate = useCallback(async () => {
    setRatingError('');
    setRatingSuccess('');
    if (ratingScore < 1 || ratingScore > 5) {
      setRatingError(t('recipes.ratingScoreError'));
      return;
    }
    try {
      await rateChef({
        variables: {
          chefId,
          score: ratingScore,
          comment: ratingComment || undefined,
        },
      });
      setRatingSuccess(t('recipes.ratingSuccess'));
      setRatingComment('');
      setRatingScore(0);
      await refetchRatings();
      await refetchMyRating();
    } catch {
      setRatingError(t('recipes.errorGeneric'));
    }
  }, [
    rateChef,
    chefId,
    ratingScore,
    ratingComment,
    refetchRatings,
    refetchMyRating,
    t,
  ]);

  const handleDeleteRating = useCallback(async () => {
    setRatingError('');
    setRatingSuccess('');
    try {
      await deleteChefRating({ variables: { chefId } });
      setRatingScore(0);
      setRatingComment('');
      setRatingSuccess(t('recipes.ratingDeleted'));
      await refetchRatings();
      await refetchMyRating();
    } catch {
      setRatingError(t('recipes.errorGeneric'));
    }
  }, [deleteChefRating, chefId, refetchRatings, refetchMyRating, t]);

  const handleLoadMoreRecipes = () => {
    fetchMoreRecipes({
      variables: { chefId, limit: RECIPES_LIMIT, offset: recipes.length },
    });
  };

  const handleLoadMoreRatings = () => {
    fetchMoreRatings({
      variables: { chefId, limit: RATINGS_LIMIT, offset: reviews.length },
    });
  };

  if (chefLoading) {
    return (
      <div
        className="flex min-h-screen items-center justify-center"
        style={{ backgroundColor: '#3F4756' }}
      >
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-myBlue-200 border-t-transparent" />
      </div>
    );
  }

  if (!chef) {
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
        <div className="relative overflow-hidden">
          {/* Diagonal background */}
          <div
            className="absolute bottom-0 left-0 w-full bg-gray-100"
            style={{
              height: '70%',
              clipPath: 'polygon(0 20%, 100% 0%, 100% 100%, 0% 100%)',
            }}
          />

          <div className="relative z-10 mx-auto max-w-4xl px-6 pb-20 pt-10">
            {/* Back */}
            <button
              onClick={() => router.back()}
              className="mb-8 flex items-center gap-2 text-sm font-bold transition hover:opacity-80"
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

            <div className="grid grid-cols-1 gap-10 md:grid-cols-[1fr_340px] md:items-start">
              {/* ── LEFT: chef info + recipes */}
              <div className="flex flex-col gap-6">
                {/* Avatar + name + message button */}
                <div className="flex items-center gap-5">
                  {chef.user?.image ? (
                    <img
                      src={chef.user.image}
                      alt={chef.user.username}
                      className="h-20 w-20 rounded-full border-4 border-white object-cover shadow-xl flex-shrink-0"
                    />
                  ) : (
                    <div
                      className="h-20 w-20 rounded-full border-4 border-white shadow-xl flex-shrink-0 flex items-center justify-center text-2xl font-bold text-white"
                      style={{ backgroundColor: '#377CC3' }}
                    >
                      {chef.user?.username?.[0]?.toUpperCase() ?? '?'}
                    </div>
                  )}
                  <div className="flex flex-col gap-2">
                    <h1
                      className="text-3xl font-bold italic text-white md:text-4xl"
                      style={{ fontFamily: 'Georgia, serif' }}
                    >
                      {chef.user?.username}
                    </h1>
                    {avgRating > 0 && (
                      <StarRow
                        rating={avgRating}
                        ratingCount={reviews.length}
                      />
                    )}
                    {chef.user?.id && (
                      <button
                        onClick={() => openConversation(chef.user!.id)}
                        className="flex w-fit items-center gap-2 rounded-full px-4 py-1.5 text-sm font-semibold text-white shadow transition-opacity hover:opacity-90"
                        style={{ backgroundColor: '#377CC3' }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M8 10h.01M12 10h.01M16 10h.01M21 16c0 1.1-.9 2-2 2H7l-4 4V6a2 2 0 012-2h14a2 2 0 012 2v10z"
                          />
                        </svg>
                        {t('send_message', 'Send message')}
                      </button>
                    )}
                  </div>
                </div>

                {/* Bio */}
                {chef.bio && (
                  <p className="max-w-lg text-sm leading-relaxed text-gray-300">
                    {chef.bio}
                  </p>
                )}

                {/* ── Recipes grid */}
                <div>
                  <h2 className="flex justify-center mb-4 text-xl font-bold text-black">
                    {t('chef.profile.recipes')}
                  </h2>

                  {recipesLoading && !fetchingMoreRecipes ? (
                    <div className="flex justify-center py-8">
                      <div className="h-8 w-8 animate-spin rounded-full border-4 border-myBlue-200 border-t-transparent" />
                    </div>
                  ) : recipes.length === 0 ? (
                    <p className="text-sm text-gray-400">
                      {t('chef.profile.no_recipes', 'No recipes yet.')}
                    </p>
                  ) : (
                    <>
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {recipes.map((recipe) => {
                          const title = isEl
                            ? recipe.title_el
                            : recipe.title_en;
                          return (
                            <div
                              key={recipe.id}
                              onClick={() =>
                                router.push(`/user/recipes/${recipe.id}`)
                              }
                              className="cursor-pointer rounded-2xl overflow-hidden shadow-lg transition hover:scale-[1.02] hover:shadow-xl"
                              style={{ backgroundColor: '#E9DEC5' }}
                            >
                              <div className="relative h-36 w-full overflow-hidden">
                                {recipe.recipeImage ? (
                                  <img
                                    src={recipe.recipeImage}
                                    alt={title}
                                    className="h-full w-full object-cover"
                                  />
                                ) : (
                                  <div
                                    className="h-full w-full flex items-center justify-center text-4xl"
                                    style={{ backgroundColor: '#B3D5F8' }}
                                  >
                                    🍽️
                                  </div>
                                )}
                              </div>
                              <div className="px-4 py-3">
                                <p
                                  className="font-bold text-sm leading-tight truncate"
                                  style={{ color: '#3F4756' }}
                                >
                                  {title}
                                </p>
                                {recipe.difficulty && (
                                  <p className="mt-1 text-xs text-gray-500 uppercase tracking-wide">
                                    {recipe.difficulty}
                                  </p>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {hasMoreRecipes && (
                        <div className="mt-6 flex justify-center">
                          <button
                            onClick={handleLoadMoreRecipes}
                            disabled={fetchingMoreRecipes}
                            className="rounded-full px-8 py-2 text-sm font-bold transition hover:opacity-90 disabled:opacity-50"
                            style={{
                              backgroundColor: '#B3D5F8',
                              color: '#3F4756',
                            }}
                          >
                            {fetchingMoreRecipes
                              ? t('common.loading')
                              : t('chef.profile.more')}
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* ── RIGHT: reviews + rate form */}
              <div className="flex flex-col gap-4">
                {/* Rate form */}
                <div className="rounded-2xl bg-white shadow-xl p-5">
                  <h3
                    className="mb-4 text-lg font-bold"
                    style={{ color: '#3F4756' }}
                  >
                    {t('recipes.rateChefTitle')}
                  </h3>

                  {myRating && (
                    <div
                      className="mb-4 rounded-xl px-3 py-2 text-sm"
                      style={{ backgroundColor: '#B3D5F8', color: '#3F4756' }}
                    >
                      {t('recipes.existingRating')}: {myRating.score}/5
                      <button
                        onClick={handleDeleteRating}
                        className="ml-2 text-xs underline hover:no-underline"
                      >
                        {t('common.delete')}
                      </button>
                    </div>
                  )}

                  <div className="mb-4">
                    <StarPicker value={ratingScore} onChange={setRatingScore} />
                  </div>

                  {ratingError && (
                    <p className="mb-2 text-xs font-semibold text-red-500">
                      {ratingError}
                    </p>
                  )}
                  {ratingSuccess && (
                    <p className="mb-2 text-xs font-semibold text-green-500">
                      {ratingSuccess}
                    </p>
                  )}

                  <button
                    onClick={handleRate}
                    disabled={submitting || ratingScore === 0}
                    className="w-full rounded-xl py-2 text-sm font-bold text-white transition"
                    style={{
                      backgroundColor: '#377CC3',
                      opacity: submitting || ratingScore === 0 ? 0.5 : 1,
                      cursor:
                        submitting || ratingScore === 0
                          ? 'not-allowed'
                          : 'pointer',
                    }}
                  >
                    {submitting
                      ? t('common.saving')
                      : t('recipes.submitRating')}
                  </button>
                </div>

                {/* Reviews list */}
                <div className="rounded-2xl bg-white shadow-xl p-5">
                  <h3
                    className="mb-4 text-lg font-bold"
                    style={{ color: '#3F4756' }}
                  >
                    {t('chef.rating.title')}
                  </h3>

                  {ratingsLoading && !fetchingMoreRatings ? (
                    <div className="flex justify-center py-6">
                      <div className="h-6 w-6 animate-spin rounded-full border-4 border-myBlue-200 border-t-transparent" />
                    </div>
                  ) : reviews.length === 0 ? (
                    <p className="text-sm text-gray-400">
                      {t('chef.recipe_detail.no_ratings_yet')}
                    </p>
                  ) : (
                    <div className="flex flex-col gap-4">
                      {reviews.map((review) => (
                        <div
                          key={review.id}
                          className="border-b border-gray-100 pb-4 last:border-0"
                        >
                          <div className="mb-2 flex items-center gap-3">
                            {review.user?.image ? (
                              <img
                                src={review.user.image}
                                alt={review.user.username}
                                className="h-9 w-9 rounded-full object-cover flex-shrink-0"
                              />
                            ) : (
                              <div
                                className="h-9 w-9 rounded-full flex-shrink-0 flex items-center justify-center text-white text-sm font-bold"
                                style={{ backgroundColor: '#377CC3' }}
                              >
                                {review.user?.username?.[0]?.toUpperCase() ??
                                  '?'}
                              </div>
                            )}
                            <div>
                              <p
                                className="text-sm font-bold"
                                style={{ color: '#3F4756' }}
                              >
                                {review.user?.username ?? '—'}
                              </p>
                              <SmallStars rating={review.score} />
                            </div>
                          </div>
                          {review.comment && (
                            <p className="text-xs text-gray-500 leading-relaxed">
                              {review.comment}
                            </p>
                          )}
                        </div>
                      ))}

                      {hasMoreReviews && (
                        <button
                          onClick={handleLoadMoreRatings}
                          disabled={fetchingMoreRatings}
                          className="mt-2 w-full rounded-xl py-1.5 text-xs font-bold transition hover:opacity-90 disabled:opacity-50"
                          style={{
                            backgroundColor: '#B3D5F8',
                            color: '#3F4756',
                          }}
                        >
                          {fetchingMoreRatings
                            ? t('common.loading')
                            : t('chef.profile.more')}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <ScrollToTopButton />
    </div>
  );
}
