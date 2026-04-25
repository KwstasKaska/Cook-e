import { useTranslation } from 'next-i18next';
import { SmallStars } from '../../Helper/Stars';

type Review = {
  id: number;
  score: number;
  comment?: string | null;
  user?: {
    username: string;
    image?: string | null;
  } | null;
};

export default function ReviewsPanel({
  reviews,
  loading,
  hasMore,
  loadingMore,
  onLoadMore,
}: {
  reviews: Review[];
  loading: boolean;
  hasMore?: boolean;
  loadingMore?: boolean;
  onLoadMore?: () => void;
}) {
  const { t } = useTranslation('common');

  return (
    <div className="p-5">
      <h3 className="mb-5 text-xl font-bold" style={{ color: '#3F4756' }}>
        {t('chef.rating.title')}
      </h3>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="h-6 w-6 animate-spin rounded-full border-4 border-myBlue-200 border-t-transparent" />
        </div>
      ) : reviews.length === 0 ? (
        <p className="text-sm text-gray-400">
          {t('chef.recipe_detail.no_ratings_yet')}
        </p>
      ) : (
        <div className="flex flex-col gap-5">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="border-b border-gray-100 pb-5 last:border-0"
            >
              <div className="mb-2 flex items-center gap-3">
                {review.user?.image ? (
                  <img
                    src={review.user.image}
                    alt={review.user.username}
                    className="h-10 w-10 rounded-full object-cover flex-shrink-0"
                  />
                ) : (
                  <div
                    className="h-10 w-10 rounded-full flex-shrink-0 flex items-center justify-center text-white text-sm font-bold"
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
                <p className="text-xs text-gray-500 leading-relaxed">
                  {review.comment}
                </p>
              )}
            </div>
          ))}

          {hasMore && onLoadMore && (
            <button
              onClick={onLoadMore}
              disabled={loadingMore}
              className="mt-2 w-full rounded-xl py-1.5 text-xs font-bold transition hover:opacity-90 disabled:opacity-50"
              style={{ backgroundColor: '#B3D5F8', color: '#3F4756' }}
            >
              {loadingMore ? t('common.loading') : t('chef.profile.more')}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
