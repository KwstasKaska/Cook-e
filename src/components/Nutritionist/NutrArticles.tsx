import React, { useState } from 'react';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useMyArticlesQuery } from '../../generated/graphql';
import moment from 'moment';

moment.locale('el');

const LIMIT = 4;

const NutrArticles: React.FC = () => {
  const { t } = useTranslation('common');
  const { locale } = useRouter();
  const [offset, setOffset] = useState(0);

  const { data, loading } = useMyArticlesQuery({
    variables: { limit: LIMIT, offset },
    fetchPolicy: 'cache-and-network',
  });

  const articles = data?.myArticles ?? [];
  const hasMore = articles.length === LIMIT;
  const hasPrev = offset > 0;

  return (
    <section id="section_1" className="flex min-h-screen flex-col">
      <div className="flex w-full flex-1 flex-col items-center justify-center gap-8 bg-myGrey-200 px-4 py-10 sm:px-6">
        {/* Title */}
        <h1 className="bg-gradient-to-r from-[#B3D5F8] to-[#FFFFFF] bg-clip-text font-exo text-3xl font-bold text-transparent md:text-5xl">
          {t('nutr.yourArticles')}
        </h1>

        {loading && (
          <p className="text-white">{t('common.loading') ?? 'Loading...'}</p>
        )}

        {!loading && articles.length === 0 && offset === 0 && (
          <p className="text-white">{t('chef.profile.no_articles')}</p>
        )}

        {/* Grid */}
        {!loading && articles.length > 0 && (
          <div className="w-full max-w-5xl">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {articles.map((article) => {
                const title =
                  locale === 'el' ? article.title_el : article.title_en;
                const imageSrc = article.image ?? null;

                return (
                  <Link
                    key={article.id}
                    href={`/nutritionist/articles/${article.id}`}
                    className="group flex flex-col overflow-hidden rounded-2xl border border-white/20 bg-white/5 transition duration-300 hover:bg-white/10"
                  >
                    {imageSrc && (
                      <div className="h-44 w-full overflow-hidden">
                        <img
                          src={imageSrc}
                          alt={t('nutr.articleImageAlt')}
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        />
                      </div>
                    )}
                    <div className="flex flex-1 flex-col gap-2 p-4 text-white">
                      <p className="text-xs font-semibold text-myBlue-100">
                        {moment(parseInt(article.createdAt)).format('ll')}
                      </p>
                      <span className="h-[2px] w-12 bg-myBlue-100" />
                      <h2 className="text-sm font-bold leading-snug md:text-base">
                        {title}
                      </h2>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Prev / Next — outside grid block so Prev shows even on empty page */}
        {!loading && (hasPrev || (hasMore && articles.length > 0)) && (
          <div className="flex justify-center gap-4">
            {hasPrev && (
              <button
                onClick={() => setOffset((o) => o - LIMIT)}
                className="rounded-full px-8 py-2.5 text-sm font-bold transition hover:opacity-90"
                style={{ backgroundColor: '#B3D5F8', color: '#3F4756' }}
              >
                {t('common.prev')}
              </button>
            )}
            {hasMore && articles.length > 0 && (
              <button
                onClick={() => setOffset((o) => o + LIMIT)}
                className="rounded-full px-8 py-2.5 text-sm font-bold transition hover:opacity-90"
                style={{ backgroundColor: '#B3D5F8', color: '#3F4756' }}
              >
                {t('common.next')}
              </button>
            )}
          </div>
        )}

        {/* New article button */}
        <Link
          href="/nutritionist/create-article"
          className="flex items-center gap-1.5 rounded-full px-6 py-2 text-sm font-bold transition hover:opacity-90"
          style={{ backgroundColor: '#EAB308', color: '#3F4756' }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            stroke="currentColor"
            className="h-4 w-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
          {t('nutr.newArticle')}
        </Link>
      </div>
    </section>
  );
};

export default NutrArticles;
