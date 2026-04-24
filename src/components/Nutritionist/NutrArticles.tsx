import React, { useState } from 'react';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';

import Slider from 'react-slick';
import { Settings } from '../Helper/SliderSettings';
import { useMyArticlesQuery } from '../../generated/graphql';
import moment from 'moment';

moment.locale('el');

const NutrArticles: React.FC = () => {
  const { t } = useTranslation('common');
  const { locale } = useRouter();
  const [isHovered, setIsHovered] = useState<boolean>(false);

  const { data, loading } = useMyArticlesQuery({
    variables: { limit: 20, offset: 0 },
    fetchPolicy: 'cache-and-network',
  });

  const articles = data?.myArticles ?? [];

  const desktopShow = Math.min(3, articles.length);
  const tabletShow = Math.min(2, articles.length);
  const mobileShow = Math.min(1, articles.length);
  const canLoop = articles.length >= 3;

  const settings: Settings = {
    dots: false,
    infinite: canLoop,
    slidesToShow: desktopShow,
    slidesToScroll: desktopShow || 1,
    initialSlide: 0,
    autoplay: canLoop,
    speed: 1000,
    autoplaySpeed: 8000,
    adaptiveHeight: true,
    pauseOnHover: true,
    swipeToSlide: true,
    className: 'max-w-[58em] cursor-pointer',
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: tabletShow,
          slidesToScroll: tabletShow || 1,
          infinite: articles.length >= 2,
          className: 'max-w-[43em]',
        },
      },
      {
        breakpoint: 767,
        settings: {
          slidesToShow: mobileShow,
          slidesToScroll: 1,
          infinite: articles.length >= 1,
          className: 'w-[18em]',
        },
      },
    ],
  };

  return (
    <section id="section_1" className="flex min-h-screen flex-col">
      <div className="flex w-full flex-1 flex-col items-center justify-center gap-8 bg-myGrey-200 py-10">
        {/* Title — centered at top */}
        <h1 className="bg-gradient-to-r from-[#B3D5F8] to-[#FFFFFF] bg-clip-text font-exo text-3xl font-bold text-transparent md:text-5xl">
          {t('nutr.yourArticles')}
        </h1>

        {loading && (
          <p className="text-white">{t('common.loading') ?? 'Loading...'}</p>
        )}

        {!loading && articles.length === 0 && (
          <p className="text-white">{t('nutr.noArticlesYet')}</p>
        )}

        {/* Slider */}
        {!loading && articles.length > 0 && (
          <div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <Slider {...settings}>
              {articles.map((article) => {
                const title =
                  locale === 'el' ? article.title_el : article.title_en;
                const imageSrc = article.image ?? null;

                return (
                  <Link
                    key={article.id}
                    href={`/nutritionist/articles/${article.id}`}
                    className="block rounded-3xl border-2 border-white p-6 transition duration-500 ease-in hover:bg-myGrey-100"
                  >
                    <div className="flex flex-col gap-4 rounded-[10px] bg-transparent text-white hover:text-black">
                      <p className="flex flex-col gap-2 text-left text-base font-bold leading-relaxed">
                        <span>
                          {moment(parseInt(article.createdAt)).format('ll')}
                        </span>
                        <span
                          className={`h-1 w-20 ${
                            isHovered ? 'bg-black' : 'bg-myGrey-100'
                          }`}
                        />
                      </p>
                      <h2 className="px-[.3em] text-center text-base font-bold md:text-lg">
                        {title}
                      </h2>
                      <img
                        src={imageSrc}
                        alt={t('nutr.articleImageAlt')}
                        className="aspect-[5/4] rounded-[10px] object-cover"
                      />
                    </div>
                  </Link>
                );
              })}
            </Slider>
          </div>
        )}

        {/* New article button — centered below slider */}
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
