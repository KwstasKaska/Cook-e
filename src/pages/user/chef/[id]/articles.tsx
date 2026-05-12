import { useState } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Navbar from '../../../../components/Users/Navbar';
import PaginationControls from '../../../../components/Helper/PaginationControls';
import { useArticlesByChefQuery } from '../../../../generated/graphql';
import useIsUser from '../../../../utils/useIsUser';

const LIMIT = 12;

export async function getServerSideProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}

export default function ChefArticlesPage() {
  const { loading: authLoading, isAuthorized } = useIsUser();
  if (authLoading || !isAuthorized) return null;
  return <ChefArticlesContent />;
}

const ChefArticlesContent = () => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const { id } = router.query;
  const chefId = parseInt(id as string, 10);
  const isEl = router.locale === 'el';
  const [offset, setOffset] = useState(0);

  const { data, loading } = useArticlesByChefQuery({
    variables: { chefId, limit: LIMIT, offset },
    skip: isNaN(chefId) || !chefId,
    fetchPolicy: 'network-only',
  });

  const articles = data?.articlesByChef ?? [];
  const hasMore = articles.length === LIMIT;
  const hasPrev = offset > 0;

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="mx-auto max-w-3xl px-6 pb-16 pt-10">
        <button
          onClick={() => router.back()}
          className="mb-6 text-myText-muted hover:text-cookie-400"
        >
          ← {t('common.back')}
        </button>

        <h1 className="mb-8 text-center">{t('chef.profile.articles')}</h1>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-cookie-400 border-t-transparent" />
          </div>
        ) : articles.length === 0 && offset === 0 ? (
          <div className="py-12 text-center">
            <p className="text-myText-muted">{t('chef.profile.no_articles')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => {
              const title = isEl ? article.title_el : article.title_en;
              return (
                <div
                  key={article.id}
                  onClick={() => router.push(`/user/articles/${article.id}`)}
                  className="cursor-pointer overflow-hidden rounded-2xl bg-surface shadow-lg transition hover:scale-[1.02] hover:shadow-xl"
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

        {!loading && (
          <PaginationControls
            hasPrev={hasPrev}
            hasMore={hasMore && articles.length > 0}
            onPrev={() => setOffset((o) => o - LIMIT)}
            onNext={() => setOffset((o) => o + LIMIT)}
          />
        )}
      </div>
    </div>
  );
};
