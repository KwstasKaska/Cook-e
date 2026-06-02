import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import Navbar from '../../../components/Users/Navbar';
import useIsUser from '../../../utils/useIsUser';
import {
  useChefArticlesQuery,
  useArticlesQuery,
} from '../../../generated/graphql';
import PaginationControls from '../../../components/Helper/PaginationControls';
import { pick } from '../../../utils/pick';

const LIMIT = 28;

type Tab = 'chefs' | 'nutritionists';

export async function getServerSideProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}

export default function UserArticlesPage() {
  const { loading: authLoading, isAuthorized } = useIsUser();
  if (authLoading || !isAuthorized) return null;
  return <UserArticlesContent />;
}

const UserArticlesContent = () => {
  const { t, i18n } = useTranslation('common');
  const router = useRouter();
  const lang = i18n.language;

  const [tab, setTab] = useState<Tab>('chefs');
  const [chefOffset, setChefOffset] = useState(0);
  const [nutrOffset, setNutrOffset] = useState(0);

  const { data: chefData, loading: chefLoading } = useChefArticlesQuery({
    variables: { limit: LIMIT, offset: chefOffset },
    fetchPolicy: 'cache-and-network',
  });

  const { data: nutrData, loading: nutrLoading } = useArticlesQuery({
    variables: { limit: LIMIT, offset: nutrOffset },
    fetchPolicy: 'cache-and-network',
  });

  const chefArticles = chefData?.chefArticles ?? [];
  const nutrArticles = nutrData?.articles ?? [];

  const loading = tab === 'chefs' ? chefLoading : nutrLoading;
  const articles = tab === 'chefs' ? chefArticles : nutrArticles;
  const hasMore =
    tab === 'chefs'
      ? chefArticles.length === LIMIT
      : nutrArticles.length === LIMIT;
  const hasPrev = tab === 'chefs' ? chefOffset > 0 : nutrOffset > 0;

  const onPrev = () => {
    if (tab === 'chefs') setChefOffset((o) => o - LIMIT);
    else setNutrOffset((o) => o - LIMIT);
    window.scrollTo({ top: 0 });
  };

  const onNext = () => {
    if (tab === 'chefs') setChefOffset((o) => o + LIMIT);
    else setNutrOffset((o) => o + LIMIT);
    window.scrollTo({ top: 0 });
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="mx-auto max-w-3xl lg:max-w-4xl px-6 pb-16 pt-10">
        <button
          onClick={() => router.back()}
          className="mb-6 hover:text-cookie-400"
        >
          {t('common.back')}
        </button>

        <h1 className="mb-6 text-center">{t('chef.overview.allArticles')}</h1>

        <div className="mb-6 flex gap-2 justify-center">
          <button
            onClick={() => setTab('chefs')}
            className={`rounded-full border-2 border-cookie-400 px-4 py-1 transition ${
              tab === 'chefs'
                ? 'bg-cookie-400 text-white'
                : 'text-cookie-400 hover:bg-cookie-400 hover:text-white'
            }`}
          >
            {t('chef.overview.chefArticles')}
          </button>
          <button
            onClick={() => setTab('nutritionists')}
            className={`rounded-full border-2 border-cookie-400 px-4 py-1 transition ${
              tab === 'nutritionists'
                ? 'bg-cookie-400 text-white'
                : 'text-cookie-400 hover:bg-cookie-400 hover:text-white'
            }`}
          >
            {t('chef.overview.nutrArticles')}
          </button>
        </div>

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
                  <div
                    key={a.id}
                    onClick={() => router.push(`/user/articles/${a.id}`)}
                    className="cursor-pointer overflow-hidden rounded-2xl bg-surface shadow-xl transition duration-200 hover:scale-105 flex flex-col"
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
                    <div className="px-3 pt-2 pb-3 flex flex-col justify-center text-center gap-1">
                      <p className="line-clamp-2 break-words">{title}</p>
                      {a.creator?.username && (
                        <p className="">{a.creator.username}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {!loading && (hasPrev || hasMore) && (
          <div className="mt-6">
            <PaginationControls
              hasPrev={hasPrev}
              hasMore={hasMore}
              onPrev={onPrev}
              onNext={onNext}
              prevLabel={t('pagination.prevArticles')}
              nextLabel={t('pagination.nextArticles')}
            />
          </div>
        )}
      </div>
    </div>
  );
};
