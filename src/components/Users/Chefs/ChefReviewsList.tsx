import { useTranslation } from 'next-i18next';
import { SmallStars } from '../../../components/Helper/Stars';
import { ChefRating } from '../../../generated/graphql';

const RATINGS_LIMIT = 5;

interface Props {
  reviews: ChefRating[];
  loading: boolean;
  fetchingMore: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
}

export default function ChefReviewsList({
  reviews,
  loading,
  fetchingMore,
  hasMore,
  onLoadMore,
}: Props) {
  const { t } = useTranslation('common');

  return (
    <div className="rounded-2xl bg-surface p-5 shadow-xl">
      <h3 className="mb-4">{t('chef.rating.title')}</h3>

      {loading && !fetchingMore ? (
        <div className="flex justify-center py-6">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-cookie-400 border-t-transparent" />
        </div>
      ) : reviews.length === 0 ? (
        <p className=" ">{t('chef.recipe_detail.no_ratings_yet')}</p>
      ) : (
        <div className="flex flex-col gap-4">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="border-b border-cookie-400 pb-4 last:border-0"
            >
              <div className="mb-2 flex items-center gap-3">
                {review.user?.image ? (
                  <img
                    src={review.user.image}
                    alt={review.user.username}
                    className="h-9 w-9 flex-shrink-0 rounded-full border-2 border-cookie-400 object-cover"
                  />
                ) : (
                  <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-myText-heading">
                    {review.user?.username?.[0]?.toUpperCase() ?? '?'}
                  </div>
                )}
                <div>
                  <p className=" ">{review.user?.username ?? '—'}</p>
                  <SmallStars rating={review.score} />
                </div>
              </div>
            </div>
          ))}

          {hasMore && (
            <button
              onClick={onLoadMore}
              disabled={fetchingMore}
              className="mt-2 w-full rounded-xl border-2 border-cookie-400 py-1.5  transition hover:bg-cookie-400 hover:text-white disabled:opacity-50"
            >
              {!fetchingMore && t('chef.more')}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export { RATINGS_LIMIT };
