import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import ChefNavbar from '../../components/Chef/ChefNavbar';

import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import { useMyRecipesQuery } from '../../generated/graphql';
import { pick } from '../../utils/pick';
import useIsChef from '../../utils/useIsChef';
import { useRouter } from 'next/router';

const BG_COLORS = ['#B3D5F8', '#FEF9C3', '#FCE4EC', '#DCFCE7'];
const ROTATIONS = [-15, -5, 5, 15];
const OFFSETS = [-180, -60, 60, 180];

export default function ChefIndex() {
  const { t, i18n } = useTranslation('common');
  const lang = i18n.language;
  const { loading: authLoading, isAuthorized } = useIsChef();
  const router = useRouter();
  const [activeIdx, setActiveIdx] = useState(0);

  const { data: recipesData, loading: recipesLoading } = useMyRecipesQuery({
    variables: { limit: 4, offset: 0 },
    fetchPolicy: 'network-only',
  });

  if (authLoading || !isAuthorized) return null;

  const fanRecipes = recipesData?.myRecipes ?? [];
  const count = fanRecipes.length;

  const handlePrev = () => setActiveIdx((p) => (p - 1 + count) % count);
  const handleNext = () => setActiveIdx((p) => (p + 1) % count);

  return (
    <div className="flex min-h-screen flex-col">
      <ChefNavbar />

      <main className="relative flex flex-1 flex-col overflow-hidden">
        <div className="relative z-10 flex flex-1 flex-col px-8 pt-10 md:px-16">
          {/* Top row */}
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="mb-2 text-2xl italic bg-myBlue-100">
                {t('chef.landing.tagline_pre')}
              </p>
              <div className="rounded-xl inline-block bg-myBlue-100 px-5 py-4">
                <h1 className="text-4xl font-black italic leading-tight">
                  {t('chef.landing.tagline_bold')}
                </h1>
              </div>
            </div>
          </div>

          {/* Cards */}
          <div className="relative mt-8 flex flex-1 items-center justify-center pb-4">
            {recipesLoading ? (
              <p className="text-white opacity-60">{t('common.loading')}</p>
            ) : fanRecipes.length === 0 ? (
              <p className="text-white opacity-60">
                {t('chef.landing.no_recipes')}
              </p>
            ) : (
              <>
                {/* Mobile: slider */}
                <div className="flex items-center gap-3 md:hidden">
                  {count > 1 && (
                    <button
                      onClick={handlePrev}
                      className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border-2 border-white text-white"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15 19l-7-7 7-7"
                        />
                      </svg>
                    </button>
                  )}

                  <div
                    onClick={() =>
                      router.push(`/chef/recipes/${fanRecipes[activeIdx].id}`)
                    }
                    className="w-52 flex-shrink-0 cursor-pointer rounded-2xl overflow-hidden shadow-xl transition-transform hover:scale-105"
                    style={{
                      backgroundColor: BG_COLORS[activeIdx % BG_COLORS.length],
                    }}
                  >
                    <div className="p-3">
                      <span className="text-xs text-gray-500">
                        {fanRecipes[activeIdx].category
                          ? t(
                              `recipe_category.${fanRecipes[activeIdx].category}`,
                            )
                          : ''}
                      </span>
                      <p className="mt-1 text-sm font-bold leading-tight">
                        {pick(
                          fanRecipes[activeIdx].title_el,
                          fanRecipes[activeIdx].title_en,
                          lang,
                        )}
                      </p>
                    </div>
                    <div
                      className="relative mx-2 mb-2 h-36 overflow-hidden rounded-xl"
                      style={{ width: 'calc(100% - 16px)' }}
                    >
                      <Image
                        src={
                          fanRecipes[activeIdx].recipeImage ??
                          '/images/food.jpg'
                        }
                        alt={pick(
                          fanRecipes[activeIdx].title_el,
                          fanRecipes[activeIdx].title_en,
                          lang,
                        )}
                        fill
                        className="object-cover"
                      />
                    </div>
                    {count > 1 && (
                      <div className="mb-3 flex justify-center gap-1.5">
                        {fanRecipes.map((_, i) => (
                          <span
                            key={i}
                            className="h-1.5 w-1.5 rounded-full"
                            style={{
                              backgroundColor:
                                i === activeIdx ? '#3F4756' : '#ffffff',
                            }}
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  {count > 1 && (
                    <button
                      onClick={handleNext}
                      className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border-2 border-white text-white"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>
                  )}
                </div>

                {/* Desktop: fanned layout */}
                <div
                  className="relative hidden md:block"
                  style={{ width: '600px', height: '340px' }}
                >
                  {fanRecipes.map((recipe, idx) => (
                    <div
                      key={recipe.id}
                      onClick={() => router.push(`/chef/recipes/${recipe.id}`)}
                      className="absolute w-48 rounded-2xl overflow-hidden shadow-2xl cursor-pointer transition-transform hover:scale-105 hover:-translate-y-2"
                      style={{
                        backgroundColor: BG_COLORS[idx % BG_COLORS.length],
                        transform: `rotate(${ROTATIONS[idx]}deg) translateX(${OFFSETS[idx]}px)`,
                        zIndex: idx + 1,
                        top: '20px',
                        left: '50%',
                        marginLeft: '-96px',
                        transformOrigin: 'bottom center',
                      }}
                    >
                      <div className="p-3">
                        <span className="text-xs text-gray-500">
                          {recipe.category
                            ? t(`recipe_category.${recipe.category}`)
                            : ''}
                        </span>
                        <p className="mt-1 text-sm font-bold leading-tight">
                          {pick(recipe.title_el, recipe.title_en, lang)}
                        </p>
                      </div>
                      <div
                        className="relative mx-2 mb-2 overflow-hidden rounded-xl"
                        style={{ height: '140px', width: 'calc(100% - 16px)' }}
                      >
                        <Image
                          src={recipe.recipeImage ?? '/images/food.jpg'}
                          alt={pick(recipe.title_el, recipe.title_en, lang)}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="flex justify-center pb-10">
            <Link
              href="/chef/recipes"
              className="rounded-full px-10 bg-myBlue-100 py-3 text-sm font-bold transition hover:opacity-90"
            >
              {t('chef.more')}
            </Link>
          </div>
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
