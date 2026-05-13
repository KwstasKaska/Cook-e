import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import ChefNavbar from '../../components/Chef/ChefNavbar';
import Stars from '../../components/Helper/Stars';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import {
  useMyChefProfileQuery,
  useChefAverageRatingQuery,
  useChefRatingsQuery,
  useArticlesByChefQuery,
  useMyRecipesCountQuery,
} from '../../generated/graphql';
import useIsChef from '../../utils/useIsChef';
import { pick } from '../../utils/pick';
import ArticleForm from '../../components/Article/ArticleForm';

type StarKey = 1 | 2 | 3 | 4 | 5;

export default function ChefIndex() {
  const { loading: authLoading, isAuthorized } = useIsChef();
  if (authLoading || !isAuthorized) return null;
  return <ChefHomeContent />;
}

const ChefHomeContent = () => {
  const { t, i18n } = useTranslation('common');
  const lang = i18n.language;

  const [showCreateForm, setShowCreateForm] = useState(false);

  const { data: profileData, loading: profileLoading } =
    useMyChefProfileQuery();
  const chefProfile = profileData?.myChefProfile;
  const chefProfileId = chefProfile?.id;
  const userId = chefProfile?.user?.id;

  const { data: avgData } = useChefAverageRatingQuery({
    variables: { chefId: chefProfileId! },
    skip: !chefProfileId,
  });

  const { data: ratingsData } = useChefRatingsQuery({
    variables: { chefId: chefProfileId!, limit: 50, offset: 0 },
    skip: !chefProfileId,
  });

  const { data: countData } = useMyRecipesCountQuery();

  const {
    data: articlesData,
    loading: articlesLoading,
    fetchMore: fetchMoreArticles,
  } = useArticlesByChefQuery({
    variables: { chefId: userId!, limit: 3, offset: 0 },
    skip: !userId,
  });

  const averageRating = avgData?.chefAverageRating ?? 0;
  const ratings = ratingsData?.chefRatings ?? [];
  const totalRatings = ratings.length;
  const articles = articlesData?.articlesByChef ?? [];
  const recipesCount = countData?.myRecipesCount ?? 0;

  const ratingCounts: Record<StarKey, number> = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
  };
  for (const r of ratings) {
    const score = r.score as StarKey;
    if (score >= 1 && score <= 5) ratingCounts[score]++;
  }

  const stats = [
    { label: t('chef.profile.recipes'), value: recipesCount },
    { label: t('chef.profile.articles'), value: articles.length },
  ];

  if (profileLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <ChefNavbar />
        <div className="flex flex-1 items-center justify-center">
          <p className="text-myText-muted">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <ChefNavbar />

      <main className="flex flex-1 flex-col items-center px-4 py-8 md:px-8">
        <h1 className="mb-6 italic">{t('chef.profile.page_title')}</h1>

        <div className="w-full max-w-3xl rounded-2xl bg-cookie-100 p-6 md:p-8">
          <div className="mb-4 flex flex-col items-center">
            <div className="h-24 w-24 overflow-hidden rounded-full border-4 border-cookie-400 shadow-lg bg-cookie-200">
              {chefProfile?.user?.image ? (
                <img
                  src={chefProfile.user.image}
                  alt={chefProfile.user.username ?? ''}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <span className=" ">
                    {chefProfile?.user?.username?.[0]?.toUpperCase() ?? '?'}
                  </span>
                </div>
              )}
            </div>
            <p className="mt-2  ">{chefProfile?.user?.username ?? ''}</p>
          </div>

          <div className="mb-4 flex justify-center">
            <div className="flex flex-col items-center">
              <p className="mb-2  ">{t('chef.profile.user_rating')}</p>
              {averageRating > 0 ? (
                <>
                  <div className="flex items-center gap-2 rounded-full border-2 border-cookie-400 px-3 py-1.5">
                    <Stars rating={averageRating} size="sm" />
                    <span className=" ">{averageRating.toFixed(1)} / 5</span>
                  </div>
                  <p className="mt-1  text-myText-muted">
                    {totalRatings} {t('chef.profile.user_reviews')}
                  </p>
                </>
              ) : (
                <p className=" text-myText-muted">
                  {t('chef.profile.no_ratings')}
                </p>
              )}
            </div>
          </div>

          <div className="mt-2 rounded-xl bg-cookie-200 px-5 py-4">
            <p className="mb-1   tracking-wide">{t('settings.bio')}</p>
            {chefProfile?.bio_el || chefProfile?.bio_en ? (
              <p className=" ">
                {pick(chefProfile.bio_el ?? '', chefProfile.bio_en ?? '', lang)}
              </p>
            ) : (
              <p className=" italic text-myText-muted">
                {t('chef.profile.bio_placeholder')}
              </p>
            )}
          </div>

          <div className="mt-6 flex items-center justify-center divide-x divide-cookie-400">
            {stats.map((stat) => (
              <div key={stat.label} className="flex flex-col items-center px-8">
                <span className=" text-myText-muted">{stat.label}</span>
                <span className=" ">{stat.value}</span>
              </div>
            ))}
          </div>

          <div className="mb-3 mt-8 flex items-center justify-between">
            <h3>{t('chef.profile.articles')}</h3>
            {!showCreateForm && (
              <button
                onClick={() => setShowCreateForm(true)}
                className="flex items-center gap-1.5 rounded-full bg-cookie-300 px-4 py-1.5   text-white transition hover:bg-cookie-400"
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
            <div className="mb-4 rounded-2xl bg-cookie-200 p-5">
              <ArticleForm
                rows={6}
                onSuccess={() => setShowCreateForm(false)}
                onCancel={() => setShowCreateForm(false)}
                cacheEvictFields={['articlesByChef']}
              />
            </div>
          )}

          {articlesLoading ? (
            <p className="text-center  text-myText-muted">
              {t('common.loading')}
            </p>
          ) : articles.length === 0 ? (
            <p className="text-center  text-myText-muted">
              {t('chef.profile.no_articles')}
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              {articles.map((article) => (
                <Link
                  key={article.id}
                  href={`/chef/articles/${article.id}`}
                  className="cursor-pointer overflow-hidden rounded-xl bg-cookie-200 transition hover:scale-105 hover:shadow-lg"
                >
                  <div className="relative h-28 w-full overflow-hidden">
                    <Image
                      src={article.image}
                      alt={pick(article.title_el, article.title_en, lang)}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-2">
                    <p className="line-clamp-2   ">
                      {pick(article.title_el, article.title_en, lang)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {articles.length >= 6 && (
            <div className="mt-4 flex justify-center">
              <button
                onClick={() =>
                  fetchMoreArticles({
                    variables: { chefId: userId!, offset: articles.length },
                  })
                }
                className="rounded-full border-2 border-cookie-400 px-8 py-2   transition hover:bg-cookie-400 hover:text-white"
              >
                {t('chef.more')}
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export async function getServerSideProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}
