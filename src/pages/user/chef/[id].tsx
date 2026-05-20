import { useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../../../components/Users/Navbar';
import ScrollToTopButton from '../../../components/Helper/ScrollToTopButton';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { StarRow } from '../../../components/Helper/Stars';
import { useApolloClient } from '@apollo/client';
import {
  useChefQuery,
  useChefAverageRatingQuery,
  useChefRatingsQuery,
  useMyChefRatingQuery,
  useRateChefMutation,
  useDeleteChefRatingMutation,
  useArticlesByChefQuery,
  useRecipesByChefQuery,
} from '../../../generated/graphql';
import useIsUser from '../../../utils/useIsUser';
import { useChatContext } from '../../../components/Chat/ChatContext';
import PaginationControls from '../../../components/Helper/PaginationControls';
import ChefRateForm from '../../../components/Users/Chefs/ChefRateForm';
import ChefReviewsList, {
  RATINGS_LIMIT,
} from '../../../components/Users/Chefs/ChefReviewsList';
import { pick } from '../../../utils/pick';

const ARTICLES_LIMIT = 6;
const RECIPES_LIMIT = 6;

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

const ChefProfileContent = () => {
  const { t, i18n } = useTranslation('common');
  const lang = i18n.language;
  const router = useRouter();
  const { id } = router.query;
  const chefId = parseInt(id as string, 10);
  const { openConversation } = useChatContext();
  const client = useApolloClient();

  const [showRateForm, setShowRateForm] = useState(false);
  const [ratingScore, setRatingScore] = useState(0);
  const [ratingError, setRatingError] = useState('');
  const [ratingSuccess, setRatingSuccess] = useState('');
  const [showArticles, setShowArticles] = useState(false);
  const [articlesOffset, setArticlesOffset] = useState(0);
  const [showRecipes, setShowRecipes] = useState(false);
  const [recipesOffset, setRecipesOffset] = useState(0);

  const { data: chefData, loading: chefLoading } = useChefQuery({
    variables: { id: chefId },
    skip: isNaN(chefId),
    fetchPolicy: 'network-only',
  });

  const { data: avgData, refetch: refetchAvg } = useChefAverageRatingQuery({
    variables: { chefId },
    skip: isNaN(chefId),
    fetchPolicy: 'network-only',
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
      fetchPolicy: 'network-only',
    },
  );

  const [rateChef, { loading: submitting }] = useRateChefMutation();
  const [deleteChefRating] = useDeleteChefRatingMutation();

  const { data: articlesData, loading: articlesLoading } =
    useArticlesByChefQuery({
      variables: { chefId, limit: ARTICLES_LIMIT, offset: articlesOffset },
      skip: !showArticles || isNaN(chefId),
      fetchPolicy: 'network-only',
    });

  const { data: recipesData, loading: recipesLoading } = useRecipesByChefQuery({
    variables: { chefId, limit: RECIPES_LIMIT, offset: recipesOffset },
    skip: !showRecipes || isNaN(chefId),
    fetchPolicy: 'network-only',
  });

  const chef = chefData?.chef;
  const avgRating = avgData?.chefAverageRating ?? 0;
  const reviews = ratingsData?.chefRatings ?? [];
  const myRating = myRatingData?.myChefRating ?? null;
  const fetchingMoreRatings = ratingsNetworkStatus === 3;
  const hasMoreReviews =
    reviews.length > 0 && reviews.length % RATINGS_LIMIT === 0;

  const articles = articlesData?.articlesByChef ?? [];
  const articlesHasMore = articles.length === ARTICLES_LIMIT;
  const articlesHasPrev = articlesOffset > 0;

  const recipes = recipesData?.recipesByChef ?? [];
  const recipesHasMore = recipes.length === RECIPES_LIMIT;
  const recipesHasPrev = recipesOffset > 0;

  const handleRate = useCallback(async () => {
    setRatingError('');
    setRatingSuccess('');
    if (ratingScore < 1 || ratingScore > 5) {
      setRatingError(t('recipes.ratingScoreError'));
      return;
    }
    await rateChef({ variables: { chefId, score: ratingScore } });
    setRatingSuccess(t('recipes.ratingSuccess'));
    setRatingScore(0);
    setShowRateForm(false);
    client.cache.evict({ fieldName: 'chefRatings' });
    client.cache.evict({ fieldName: 'chefAverageRating' });
    client.cache.gc();
    await refetchRatings();
    await refetchMyRating();
    await refetchAvg();
  }, [
    rateChef,
    chefId,
    ratingScore,
    refetchRatings,
    refetchMyRating,
    refetchAvg,
    client,
    t,
  ]);

  const handleDeleteRating = useCallback(async () => {
    setRatingError('');
    setRatingSuccess('');
    await deleteChefRating({ variables: { chefId } });
    setRatingScore(0);
    setRatingSuccess(t('recipes.ratingDeleted'));
    client.cache.evict({ fieldName: 'chefRatings' });
    client.cache.evict({ fieldName: 'chefAverageRating' });
    client.cache.gc();
    await refetchRatings();
    await refetchMyRating();
    await refetchAvg();
  }, [
    deleteChefRating,
    chefId,
    refetchRatings,
    refetchMyRating,
    refetchAvg,
    client,
    t,
  ]);

  if (chefLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-cookie-400 border-t-transparent" />
      </div>
    );
  }

  if (!chef) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>{t('chef.recipe_detail.not_found')}</p>
      </div>
    );
  }

  const bio = pick(chef.bio_el ?? '', chef.bio_en ?? '', lang);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="mx-auto max-w-3xl lg:max-w-4xl px-6 pb-20 pt-10">
          <button
            onClick={() => router.back()}
            className="mb-8 text-myText-muted "
          >
            {t('common.back')}
          </button>

          <div className="flex flex-col gap-6 rounded-2xl bg-surface p-6 shadow-lg">
            <div className="flex items-center gap-4">
              {chef.user?.image ? (
                <img
                  src={chef.user.image}
                  alt={chef.user.username}
                  className="h-16 w-16 flex-shrink-0 rounded-full border-2 border-cookie-400 object-cover"
                />
              ) : (
                <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full border-2 border-cookie-400 bg-cookie-200 text-myText-heading">
                  {chef.user?.username?.[0]?.toUpperCase() ?? '?'}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <h3 className="truncate">{chef.user?.username}</h3>
              </div>
              {chef.user?.id && (
                <button
                  onClick={() => openConversation(chef.user!.id)}
                  className="flex-shrink-0 rounded-full border-2 border-cookie-400 p-2 transition hover:bg-cookie-400 hover:text-white"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
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
                </button>
              )}
            </div>

            {bio && <p className=" leading-relaxed text-myText-muted">{bio}</p>}

            {avgRating > 0 && (
              <StarRow rating={avgRating} ratingCount={reviews.length} />
            )}

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowRecipes((prev) => !prev);
                  setRecipesOffset(0);
                }}
                className="flex-1  rounded-xl bg-cookie-300 py-2 transition text-white hover:bg-cookie-400"
              >
                {showRecipes ? t('common.cancel') : t('chef.profile.recipes')}
              </button>
              <button
                onClick={() => {
                  setShowArticles((prev) => !prev);
                  setArticlesOffset(0);
                }}
                className="flex-1  rounded-xl bg-cookie-300 py-2 transition text-white hover:bg-cookie-400"
              >
                {showArticles ? t('common.cancel') : t('chef.profile.articles')}
              </button>
            </div>

            {showRecipes && (
              <div className="border-t border-cookie-200 pt-4">
                {recipesLoading ? (
                  <div className="flex justify-center py-12">
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-cookie-300 border-t-transparent" />
                  </div>
                ) : recipes.length === 0 ? (
                  <div className="py-12 text-center">
                    <p className="text-myText-muted">
                      {t('chef.landing.no_recipes')}
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {recipes.map((recipe) => {
                      const title = pick(
                        recipe.title_el,
                        recipe.title_en,
                        lang,
                      );
                      return (
                        <div
                          key={recipe.id}
                          onClick={() =>
                            router.push(`/user/recipes/${recipe.id}`)
                          }
                          className="cursor-pointer overflow-hidden rounded-2xl bg-cookie-100 shadow-lg transition hover:scale-[1.02] hover:shadow-xl"
                        >
                          <div className="relative h-32 w-full overflow-hidden">
                            <img
                              src={recipe.recipeImage!}
                              alt={title}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="px-4 py-3">
                            <p className="line-clamp-2 font-medium">{title}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {!recipesLoading && (recipesHasPrev || recipesHasMore) && (
                  <PaginationControls
                    hasPrev={recipesHasPrev}
                    hasMore={recipesHasMore}
                    onPrev={() => setRecipesOffset((o) => o - RECIPES_LIMIT)}
                    onNext={() => setRecipesOffset((o) => o + RECIPES_LIMIT)}
                    prevLabel={t('pagination.prevRecipes')}
                    nextLabel={t('pagination.nextRecipes')}
                  />
                )}
              </div>
            )}

            {showArticles && (
              <div className="border-t border-cookie-200 pt-4">
                {articlesLoading ? (
                  <div className="flex justify-center py-12">
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-cookie-300 border-t-transparent" />
                  </div>
                ) : articles.length === 0 ? (
                  <div className="py-12 text-center">
                    <p className="text-myText-muted">
                      {t('chef.profile.no_articles')}
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {articles.map((article) => {
                      const title = pick(
                        article.title_el,
                        article.title_en,
                        lang,
                      );
                      return (
                        <div
                          key={article.id}
                          onClick={() =>
                            router.push(`/user/articles/${article.id}`)
                          }
                          className="cursor-pointer overflow-hidden rounded-2xl bg-cookie-100 shadow-lg transition hover:scale-[1.02] hover:shadow-xl"
                        >
                          <div className="relative h-32 w-full overflow-hidden">
                            <img
                              src={article.image}
                              alt={title}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="px-4 py-3">
                            <p className="line-clamp-2 font-medium">{title}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {!articlesLoading && (articlesHasPrev || articlesHasMore) && (
                  <PaginationControls
                    hasPrev={articlesHasPrev}
                    hasMore={articlesHasMore}
                    onPrev={() => setArticlesOffset((o) => o - ARTICLES_LIMIT)}
                    onNext={() => setArticlesOffset((o) => o + ARTICLES_LIMIT)}
                    prevLabel={t('pagination.prevArticles')}
                    nextLabel={t('pagination.nextArticles')}
                  />
                )}
              </div>
            )}

            <div className="border-t border-cookie-200 pt-4">
              <button
                onClick={() => setShowRateForm((v) => !v)}
                className="w-full rounded-xl bg-cookie-300 py-2 transition text-white hover:bg-cookie-400"
              >
                {showRateForm ? t('common.cancel') : t('recipes.rateChefTitle')}
              </button>

              {showRateForm && (
                <div className="mt-4">
                  <ChefRateForm
                    myRating={myRating}
                    ratingScore={ratingScore}
                    ratingError={ratingError}
                    ratingSuccess={ratingSuccess}
                    submitting={submitting}
                    onScoreChange={setRatingScore}
                    onSubmit={handleRate}
                    onDelete={handleDeleteRating}
                  />
                </div>
              )}
            </div>

            <div className="border-t border-cookie-200 pt-4">
              <ChefReviewsList
                reviews={reviews as any}
                loading={ratingsLoading}
                fetchingMore={fetchingMoreRatings}
                hasMore={hasMoreReviews}
                onLoadMore={() =>
                  fetchMoreRatings({
                    variables: {
                      chefId,
                      limit: RATINGS_LIMIT,
                      offset: reviews.length,
                    },
                  })
                }
              />
            </div>
          </div>
        </div>
      </main>
      <ScrollToTopButton />
    </div>
  );
};
