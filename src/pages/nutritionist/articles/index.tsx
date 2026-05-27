import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import { useMyArticlesQuery } from '../../../generated/graphql';
import useIsNutr from '../../../utils/useIsNutr';
import { pick } from '../../../utils/pick';
import NutrNavbar from '../../../components/Nutritionist/NutrNavbar';
import ArticleForm from '../../../components/Article/ArticleForm';
import PaginationControls from '../../../components/Helper/PaginationControls';

const LIMIT = 9;

export default function NutrArticlesPage() {
  const { loading: authLoading, isAuthorized } = useIsNutr();
  if (authLoading || !isAuthorized) return null;
  return <NutrArticlesContent />;
}

const NutrArticlesContent = () => {
  const { t, i18n } = useTranslation('common');
  const lang = i18n.language;
  const router = useRouter();
  const [offset, setOffset] = useState(0);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const { data, loading } = useMyArticlesQuery({
    variables: { limit: LIMIT, offset },
    fetchPolicy: 'network-only',
  });

  const articles = data?.myArticles ?? [];
  const hasMore = articles.length === LIMIT;
  const hasPrev = offset > 0;

  return (
    <div className="min-h-screen">
      <NutrNavbar />

      <div className="mx-auto max-w-3xl lg:max-w-4xl px-6 pb-16 pt-10">
        <button
          onClick={() => router.back()}
          className="mb-6 hover:text-cookie-400"
        >
          {t('common.back')}
        </button>

        <div className="mb-8 flex items-center justify-between">
          <h1>{t('chef.overview.myArticles')}</h1>
          {!showCreateForm && (
            <button
              onClick={() => setShowCreateForm(true)}
              className="flex items-center gap-1.5 rounded-full border-2 border-cookie-400 px-4 py-1.5 text-cookie-400 transition hover:bg-cookie-400 hover:text-white"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
                stroke="currentColor"
                className="h-3.5 w-3.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
              {t('chef.profile.create_article')}
            </button>
          )}
        </div>

        {showCreateForm && (
          <div className="mb-8 rounded-2xl bg-surface p-5 shadow-lg">
            <ArticleForm
              rows={6}
              onSuccess={() => setShowCreateForm(false)}
              onCancel={() => setShowCreateForm(false)}
              cacheEvictFields={['myArticles', 'articles']}
            />
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-cookie-400 border-t-transparent" />
          </div>
        ) : articles.length === 0 ? (
          <div className="py-12 text-center">
            <p>{t('chef.profile.no_articles')}</p>
          </div>
        ) : (
          <div className="rounded-2xl bg-surface px-4 pb-8 pt-4 shadow-lg">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {articles.map((a) => {
                const title = pick(a.title_el, a.title_en, lang);
                return (
                  <Link
                    key={a.id}
                    href={`/nutritionist/articles/${a.id}`}
                    className="overflow-hidden rounded-2xl bg-surface shadow-xl transition duration-200 hover:scale-105 flex flex-col"
                  >
                    <div className="w-full bg-cookie-100 overflow-hidden">
                      <div className="relative h-28 w-full">
                        <Image
                          src={a.image}
                          alt={title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>
                    <div className="px-3 pt-2 pb-3 flex flex-col justify-center text-center">
                      <p className="line-clamp-2 break-words">{title}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {!loading && (hasMore || hasPrev) && (
          <div className="mt-6">
            <PaginationControls
              hasPrev={hasPrev}
              hasMore={hasMore}
              onPrev={() => {
                setOffset((o) => o - LIMIT);
                window.scrollTo({ top: 0 });
              }}
              onNext={() => {
                setOffset((o) => o + LIMIT);
                window.scrollTo({ top: 0 });
              }}
              prevLabel={t('pagination.prevArticles')}
              nextLabel={t('pagination.nextArticles')}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export const getServerSideProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common'])),
  },
});
