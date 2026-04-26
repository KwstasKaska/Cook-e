import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import ChefNavbar from '../../components/Chef/ChefNavbar';
import Stars from '../../components/Helper/Stars';
import RatingModal from '../../components/Chef/RatingModal';
import ArticleCreateForm from '../../components/Chef/ArticleCreateForm';
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

type StarKey = 1 | 2 | 3 | 4 | 5;

export default function ChefProfile() {
  const { t, i18n } = useTranslation('common');
  const lang = i18n.language;
  const { loading: authLoading, isAuthorized } = useIsChef();

  const [showRatingModal, setShowRatingModal] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);

  // ── Data fetching ──────────────────────────────────────────────────────────
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

  if (authLoading || !isAuthorized) return null;

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
      <div
        className="flex min-h-screen flex-col items-center justify-center"
        style={{ backgroundColor: '#3F4756' }}
      >
        <ChefNavbar />
        <p className="text-white opacity-60 mt-20">{t('common.loading')}</p>
      </div>
    );
  }

  return (
    <div
      className="flex min-h-screen flex-col"
      style={{ backgroundColor: '#3F4756' }}
    >
      <ChefNavbar />

      {showRatingModal && averageRating > 0 && (
        <RatingModal
          onClose={() => setShowRatingModal(false)}
          average={averageRating}
          total={totalRatings}
          counts={ratingCounts}
          overlay
        />
      )}

      <main className="flex flex-1 flex-col items-center px-4 py-8 md:px-8">
        <h1
          className="mb-6 text-3xl italic"
          style={{
            color: 'rgba(255,255,255,0.85)',
            fontFamily: 'Georgia, serif',
          }}
        >
          {t('chef.profile.page_title')}
        </h1>

        <div
          className="w-full max-w-3xl rounded-2xl p-6 md:p-8"
          style={{ backgroundColor: '#E9DEC5' }}
        >
          {/* ── Top row: contact | avatar | rating ───────────────────────── */}
          <div className="flex flex-col items-center gap-6 md:flex-row md:items-start">
            {/* Contact */}
            <div className="flex-1">
              <p
                className="mb-2 text-sm font-semibold"
                style={{ color: '#3F4756' }}
              >
                {t('chef.profile.contact')}
              </p>
              <div
                className="flex items-center gap-2 rounded-full border border-gray-400 px-3 py-1.5 text-sm"
                style={{ color: '#3F4756' }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="h-4 w-4 flex-shrink-0"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                  />
                </svg>
                {chefProfile?.user?.email ?? '—'}
              </div>
            </div>

            {/* Avatar */}
            <div className="flex-1 flex flex-col items-center">
              <div
                className="h-24 w-24 overflow-hidden rounded-full border-4 shadow-lg"
                style={{ borderColor: '#3F4756', backgroundColor: '#B3D5F8' }}
              >
                {chefProfile?.user?.image ? (
                  <img
                    src={chefProfile.user.image}
                    alt={chefProfile.user.username ?? ''}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <span
                      className="text-2xl font-bold"
                      style={{ color: '#3F4756' }}
                    >
                      {chefProfile?.user?.username?.[0]?.toUpperCase() ?? '?'}
                    </span>
                  </div>
                )}
              </div>
              <p
                className="mt-2 text-lg font-bold"
                style={{ fontFamily: 'Georgia, serif', color: '#3F4756' }}
              >
                {chefProfile?.user?.username ?? ''}
              </p>
            </div>

            {/* Rating */}
            <div className="flex-1 flex flex-col items-center md:items-end">
              <p
                className="mb-2 text-sm font-semibold"
                style={{ color: '#3F4756' }}
              >
                {t('chef.profile.user_rating')}
              </p>
              {averageRating > 0 ? (
                <>
                  <button
                    onClick={() => setShowRatingModal(true)}
                    className="flex items-center gap-2 rounded-full border-2 border-gray-400 px-3 py-1.5 transition hover:border-yellow-400"
                  >
                    <Stars rating={averageRating} size="sm" />
                    <span
                      className="text-sm font-bold"
                      style={{ color: '#3F4756' }}
                    >
                      {averageRating.toFixed(1)}/ 5
                    </span>
                  </button>
                  <p className="mt-1 text-xs text-gray-500">
                    {totalRatings} {t('chef.profile.user_reviews')}
                  </p>
                </>
              ) : (
                <p className="text-sm text-gray-500">
                  {t('chef.profile.no_ratings')}
                </p>
              )}
            </div>
          </div>

          {/* ── Bio ───────────────────────────────────────────────────────── */}
          <div
            className="mt-6 rounded-xl px-5 py-4"
            style={{ backgroundColor: '#D6C9A8' }}
          >
            <p
              className="mb-1 text-xs font-bold uppercase tracking-wide"
              style={{ color: '#3F4756' }}
            >
              {t('settings.bio')}
            </p>
            {chefProfile?.bio ? (
              <p
                className="text-sm leading-relaxed"
                style={{ color: '#3F4756' }}
              >
                {chefProfile.bio}
              </p>
            ) : (
              <p className="text-sm italic text-gray-500">
                {t('chef.profile.bio_placeholder')}
              </p>
            )}
          </div>

          {/* ── Stats ─────────────────────────────────────────────────────── */}
          <div className="mt-6 flex items-center justify-center divide-x divide-gray-400">
            {stats.map((stat) => (
              <div key={stat.label} className="flex flex-col items-center px-8">
                <span className="text-sm text-gray-500">{stat.label}</span>
                <span
                  className="text-2xl font-bold"
                  style={{ color: '#3F4756' }}
                >
                  {stat.value}
                </span>
              </div>
            ))}
          </div>

          {/* ── Articles ──────────────────────────────────────────────────── */}
          <div className="mt-8 mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold" style={{ color: '#3F4756' }}>
              {t('chef.profile.articles')}
            </h3>
            {!showCreateForm && (
              <button
                onClick={() => setShowCreateForm(true)}
                className="flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-bold transition hover:opacity-90"
                style={{ backgroundColor: '#EAB308', color: '#3F4756' }}
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

          {showCreateForm && userId && (
            <ArticleCreateForm
              chefUserId={userId}
              onClose={() => setShowCreateForm(false)}
            />
          )}

          {articlesLoading ? (
            <p className="text-center text-sm text-gray-500">
              {t('common.loading')}
            </p>
          ) : articles.length === 0 ? (
            <p className="text-center text-sm text-gray-500">
              {t('chef.profile.no_articles')}
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {articles.map((article) => (
                <Link
                  key={article.id}
                  href={`/chef/articles/${article.id}`}
                  className="cursor-pointer overflow-hidden rounded-xl transition hover:scale-105 hover:shadow-lg"
                  style={{ backgroundColor: '#B3D5F8' }}
                >
                  <div className="relative h-28 w-full overflow-hidden">
                    <Image
                      src={article.image ?? '/images/food.jpg'}
                      alt={pick(article.title_el, article.title_en, lang)}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-2">
                    <p
                      className="text-xs font-semibold leading-tight line-clamp-2"
                      style={{ color: '#3F4756' }}
                    >
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
                className="rounded-full px-8 py-2 text-sm font-bold transition hover:opacity-90"
                style={{ backgroundColor: '#B3D5F8', color: '#3F4756' }}
              >
                {t('chef.profile.more')}
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export async function getServerSideProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}
