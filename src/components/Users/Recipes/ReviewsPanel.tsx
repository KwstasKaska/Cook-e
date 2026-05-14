import { useTranslation } from 'next-i18next';
import { SmallStars } from '../../Helper/Stars';

type Review = {
  id: number;
  score: number;
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
      <h3 className="mb-5 ">{t('chef.rating.title')}</h3>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="h-6 w-6 animate-spin rounded-full border-4 border-cookie-400 border-t-transparent" />
        </div>
      ) : reviews.length === 0 ? (
        <p className=" text-myText-muted">
          {t('chef.recipe_detail.no_ratings_yet')}
        </p>
      ) : (
        <div className="flex flex-col gap-5">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="border-b border-cookie-400 pb-5 last:border-0"
            >
              <div className="mb-2 flex items-center gap-3">
                {review.user?.image ? (
                  <img
                    src={review.user.image}
                    alt={review.user.username}
                    className="h-10 w-10 flex-shrink-0 border-2 border-cookie-400 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-cookie-200   text-myText-heading">
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

          {hasMore && onLoadMore && (
            <button
              onClick={onLoadMore}
              disabled={loadingMore}
              className="mt-2 w-full rounded-xl border-2 border-cookie-400 py-1.5 transition hover:bg-cookie-400 hover:text-white disabled:opacity-50"
            >
              {!loadingMore && t('chef.more')}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
