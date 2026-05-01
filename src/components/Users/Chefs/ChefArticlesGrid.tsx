import { useState } from 'react';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useArticlesByChefQuery } from '../../../generated/graphql';

const LIMIT = 2;

interface Props {
  chefUserId: number; // User.id of the chef (not ChefProfile.id)
}

export default function ChefArticlesGrid({ chefUserId }: Props) {
  const { t } = useTranslation('common');
  const router = useRouter();
  const isEl = router.locale === 'el';
  const [offset, setOffset] = useState(0);

  const { data, loading } = useArticlesByChefQuery({
    variables: { chefId: chefUserId, limit: LIMIT, offset },
    skip: isNaN(chefUserId) || !chefUserId,
    fetchPolicy: 'network-only',
  });

  const articles = data?.articlesByChef ?? [];
  const hasMore = articles.length === LIMIT;
  const hasPrev = offset > 0;

  return (
    <div className="mt-4">
      <h2 className="mb-4 flex justify-center text-xl font-bold text-black">
        {t('chef.profile.articles')}
      </h2>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-myBlue-200 border-t-transparent" />
        </div>
      ) : articles.length === 0 && offset === 0 ? (
        <p className="text-sm text-gray-400">
          {t('chef.profile.no_articles', 'No articles yet.')}
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {articles.map((article) => {
            const title = isEl ? article.title_el : article.title_en;
            return (
              <div
                key={article.id}
                onClick={() => router.push(`/user/articles/${article.id}`)}
                className="cursor-pointer overflow-hidden rounded-2xl shadow-lg transition hover:scale-[1.02] hover:shadow-xl"
                style={{ backgroundColor: '#E9DEC5' }}
              >
                <div className="relative h-36 w-full overflow-hidden">
                  {article.image ? (
                    <img
                      src={article.image}
                      alt={title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div
                      className="flex h-full w-full items-center justify-center text-4xl"
                      style={{ backgroundColor: '#B3D5F8' }}
                    >
                      📰
                    </div>
                  )}
                </div>
                <div className="px-4 py-3">
                  <p className="line-clamp-2 text-sm font-bold leading-tight">
                    {title}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Prev / Next */}
      {!loading && (hasPrev || (hasMore && articles.length > 0)) && (
        <div className="mt-6 flex justify-center gap-4">
          {hasPrev && (
            <button
              onClick={() => setOffset((o) => o - LIMIT)}
              className="rounded-full px-8 py-2 text-sm font-bold transition hover:opacity-90"
              style={{ backgroundColor: '#B3D5F8', color: '#3F4756' }}
            >
              {t('common.prev')}
            </button>
          )}
          {hasMore && articles.length > 0 && (
            <button
              onClick={() => setOffset((o) => o + LIMIT)}
              className="rounded-full px-8 py-2 text-sm font-bold transition hover:opacity-90"
              style={{ backgroundColor: '#B3D5F8', color: '#3F4756' }}
            >
              {t('common.next')}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
