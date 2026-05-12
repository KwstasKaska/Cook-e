import { useState } from 'react';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useArticlesByNutritionistQuery } from '../../../generated/graphql';
import PaginationControls from '../../Helper/PaginationControls';

const LIMIT = 4;

interface Props {
  nutritionistId: number;
}

export default function NutrArticlesGrid({ nutritionistId }: Props) {
  const { t } = useTranslation('common');
  const router = useRouter();
  const isEl = router.locale === 'el';
  const [offset, setOffset] = useState(0);

  const { data, loading } = useArticlesByNutritionistQuery({
    variables: { nutritionistId, limit: LIMIT, offset },
    skip: !nutritionistId,
    fetchPolicy: 'network-only',
  });

  const articles = data?.articlesByNutritionist ?? [];
  const hasMore = articles.length === LIMIT;
  const hasPrev = offset > 0;

  return (
    <div className="mt-12">
      <h1 className="mb-6 text-center">{t('chef.profile.articles')}</h1>

      {loading ? (
        <div className="flex justify-center py-6">
          <div className="h-6 w-6 animate-spin rounded-full border-4 border-cookie-300 border-t-transparent" />
        </div>
      ) : articles.length === 0 && offset === 0 ? (
        <p className="text-center  text-myText-muted">
          {t('chef.profile.no_articles')}
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {articles.map((article) => {
            const title = isEl ? article.title_el : article.title_en;
            return (
              <div
                key={article.id}
                onClick={() => router.push(`/user/articles/${article.id}`)}
                className="cursor-pointer overflow-hidden rounded-2xl bg-surface shadow-lg transition hover:scale-[1.02] hover:shadow-xl"
              >
                <div className="relative h-24 w-full overflow-hidden">
                  <img
                    src={article.image}
                    alt={title}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="px-4 py-3">
                  <p className="line-clamp-2">{title}</p>
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
