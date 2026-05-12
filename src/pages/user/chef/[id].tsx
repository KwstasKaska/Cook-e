import { useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../../../components/Users/Navbar';
import ScrollToTopButton from '../../../components/Helper/ScrollToTopButton';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { StarRow } from '../../../components/Helper/Stars';
import {
  useChefQuery,
  useChefAverageRatingQuery,
  useChefRatingsQuery,
  useMyChefRatingQuery,
  useRateChefMutation,
  useDeleteChefRatingMutation,
} from '../../../generated/graphql';
import useIsUser from '../../../utils/useIsUser';
import { useChatContext } from '../../../components/Chat/ChatContext';
import ChefContentGrid from '../../../components/Users/Chefs/ChefContentGrid';
import ChefArticlesGrid from '../../../components/Users/Chefs/ChefArticlesGrid';
import ChefRateForm from '../../../components/Users/Chefs/ChefRateForm';
import ChefReviewsList, {
  RATINGS_LIMIT,
} from '../../../components/Users/Chefs/ChefReviewsList';
import { pick } from '../../../utils/pick';

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

  const [ratingScore, setRatingScore] = useState(0);
  const [ratingError, setRatingError] = useState('');
  const [ratingSuccess, setRatingSuccess] = useState('');

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

  const [rateChef, { loading: submitting }] = useRateChefMutation();
  const [deleteChefRating] = useDeleteChefRatingMutation();

  const avgRating = avgData?.chefAverageRating ?? 0;
  const reviews = ratingsData?.chefRatings ?? [];
  const myRating = myRatingData?.myChefRating ?? null;

  const fetchingMoreRatings = ratingsNetworkStatus === 3;
  const hasMoreReviews =
    reviews.length > 0 && reviews.length % RATINGS_LIMIT === 0;

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
    await refetchRatings();
    await refetchMyRating();
  }, [rateChef, chefId, ratingScore, refetchRatings, refetchMyRating, t]);

  const handleDeleteRating = useCallback(async () => {
    setRatingError('');
    setRatingSuccess('');
    await deleteChefRating({ variables: { chefId } });
    setRatingScore(0);
    setRatingSuccess(t('recipes.ratingDeleted'));
    await refetchRatings();
    await refetchMyRating();
  }, [deleteChefRating, chefId, refetchRatings, refetchMyRating, t]);

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
        <p className="">{t('chef.recipe_detail.not_found')}</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="relative overflow-hidden">
          <div className="relative z-10 mx-auto max-w-4xl px-6 pb-20 pt-10">
            <button
              onClick={() => router.push('/user/recipes')}
              className="mb-8 flex items-center gap-2   text-myText-muted transition hover:opacity-80"
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
              {t('recipes.backToRecipes')}
            </button>

            <div className="grid grid-cols-1 gap-10 md:grid-cols-[1fr_340px] md:items-start">
              <div className="flex flex-col gap-6">
                <div className="flex items-center gap-5">
                  {chef.user?.image ? (
                    <img
                      src={chef.user.image}
                      alt={chef.user.username}
                      className="h-20 w-20 flex-shrink-0 rounded-full border-2 border-cookie-400 object-cover shadow-xl"
                    />
                  ) : (
                    <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-full border-2 border-cookie-400 bg-cookie-200   text-myText-heading shadow-xl">
                      {chef.user?.username?.[0]?.toUpperCase()}
                    </div>
                  )}
                  <div className="flex flex-col gap-2">
                    <h1 className="">{chef.user?.username}</h1>
                    {avgRating > 0 && (
                      <StarRow
                        rating={avgRating}
                        ratingCount={reviews.length}
                      />
                    )}
                    {chef.user?.id && (
                      <button
                        onClick={() => openConversation(chef.user!.id)}
                        className="flex w-fit items-center gap-2 rounded-full bg-cookie-300 px-4 py-1.5   text-white shadow transition hover:bg-cookie-400"
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
                      </button>
                    )}
                  </div>
                </div>

                {(chef.bio_el || chef.bio_en) && (
                  <p className="max-w-lg">
                    {pick(chef.bio_el ?? '', chef.bio_en ?? '', lang)}
                  </p>
                )}

                <ChefContentGrid chefId={chefId} />

                {chef.user?.id && (
                  <ChefArticlesGrid chefUserId={chef.user.id} />
                )}
              </div>

              <div className="flex flex-col gap-4">
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
        </div>
      </main>
      <ScrollToTopButton />
    </div>
  );
};
