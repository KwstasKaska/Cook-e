import { useTranslation } from 'next-i18next';
import { SmallStars } from '../../../components/Helper/Stars';
import { ChefRating } from '../../../generated/graphql';

const RATINGS_LIMIT = 3;

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
    <div className="rounded-2xl bg-white p-5 shadow-xl">
      <h3 className="mb-4 text-lg font-bold" style={{ color: '#3F4756' }}>
        {t('chef.rating.title')}
      </h3>

      {loading && !fetchingMore ? (
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
                    className="h-9 w-9 flex-shrink-0 rounded-full object-cover"
                  />
                ) : (
                  <div
                    className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
                    style={{ backgroundColor: '#377CC3' }}
                  >
                    {review.user?.username?.[0]?.toUpperCase() ?? '?'}
                  </div>
                )}
                <div>
                  <p className="text-sm font-bold" style={{ color: '#3F4756' }}>
                    {review.user?.username ?? '—'}
                  </p>
                  <SmallStars rating={review.score} />
                </div>
              </div>
              {review.comment && (
                <p className="text-xs leading-relaxed text-gray-500">
                  {review.comment}
                </p>
              )}
            </div>
          ))}

          {hasMore && (
            <button
              onClick={onLoadMore}
              disabled={fetchingMore}
              className="mt-2 w-full rounded-xl py-1.5 text-xs font-bold transition hover:opacity-90 disabled:opacity-50"
              style={{ backgroundColor: '#B3D5F8', color: '#3F4756' }}
            >
              {fetchingMore ? t('common.loading') : t('chef.profile.more')}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export { RATINGS_LIMIT };
