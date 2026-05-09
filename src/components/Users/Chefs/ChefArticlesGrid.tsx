import { useState } from 'react';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useArticlesByChefQuery } from '../../../generated/graphql';
import PaginationControls from '../../Helper/PaginationControls';

const LIMIT = 2;

interface Props {
  chefUserId: number;
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
      <h2 className="mb-4 flex justify-center text-xl font-bold text-white">
        {t('chef.profile.articles')}
      </h2>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-myBlue-200 border-t-transparent" />
        </div>
      ) : articles.length === 0 && offset === 0 ? (
        <p className="text-sm text-gray-400">{t('chef.profile.no_articles')}</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {articles.map((article) => {
            const title = isEl ? article.title_el : article.title_en;
            return (
              <div
                key={article.id}
                onClick={() => router.push(`/user/articles/${article.id}`)}
                className="cursor-pointer overflow-hidden rounded-2xl shadow-lg transition hover:scale-[1.02] bg-myBeige-100 hover:shadow-xl"
              >
                <div className="relative h-36 w-full overflow-hidden">
                  article.image
                  <img
                    src={article.image}
                    alt={title}
                    className="h-full w-full object-cover"
                  />
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

      {!loading && (
        <PaginationControls
          hasPrev={hasPrev}
          hasMore={hasMore && articles.length > 0}
          onPrev={() => setOffset((o) => o - LIMIT)}
          onNext={() => setOffset((o) => o + LIMIT)}
        />
      )}
    </div>
  );
}
