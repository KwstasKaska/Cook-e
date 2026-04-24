import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import ChefNavbar from '../../components/Chef/ChefNavbar';
import RecipeSummaryModal, {
  RecipeSummaryData,
} from '../../components/Chef/RecipeSummary';
import Stars from '../../components/Helper/Stars';
import RatingModal from '../../components/Chef/RatingModal';
import Footer from '../../components/Users/Footer';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import {
  useMyRecipesQuery,
  useMyChefProfileQuery,
  useChefAverageRatingQuery,
  useChefRatingsQuery,
} from '../../generated/graphql';
import { pick } from '../../utils/pick';
import useIsChef from '../../utils/useIsChef';

type StarKey = 1 | 2 | 3 | 4 | 5;

const BG_COLORS = ['#B3D5F8', '#FEF9C3', '#FCE4EC', '#DCFCE7'];
const ROTATIONS = [-15, -5, 5, 15];
const OFFSETS = [-180, -60, 60, 180];

export default function ChefIndex() {
  const { t, i18n } = useTranslation('common');
  const lang = i18n.language;
  const { loading: authLoading, isAuthorized } = useIsChef();

  const [showRatings, setShowRatings] = useState(false);
  const [selectedRecipe, setSelectedRecipe] =
    useState<RecipeSummaryData | null>(null);

  const { data: profileData } = useMyChefProfileQuery();
  const chefId = profileData?.myChefProfile?.id;

  const { data: recipesData, loading: recipesLoading } = useMyRecipesQuery({
    variables: { limit: 4, offset: 0 },
    fetchPolicy: 'network-only',
  });

  const { data: avgData } = useChefAverageRatingQuery({
    variables: { chefId: chefId! },
    skip: !chefId,
  });

  const { data: ratingsData } = useChefRatingsQuery({
    variables: { chefId: chefId!, limit: 50, offset: 0 },
    skip: !chefId,
  });

  if (authLoading || !isAuthorized) return null;

  const fanRecipes = recipesData?.myRecipes ?? [];
  const averageRating = avgData?.chefAverageRating ?? 0;
  const ratings = ratingsData?.chefRatings ?? [];
  const totalRatings = ratings.length;

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

  const openModal = (recipe: (typeof fanRecipes)[0]) => {
    setSelectedRecipe({
      id: recipe.id,
      title: pick(recipe.title_el, recipe.title_en, lang),
      image: recipe.recipeImage ?? '/images/food.jpg',
      description: pick(recipe.description_el, recipe.description_en, lang),
      duration: (recipe.prepTime ?? 0) + (recipe.cookTime ?? 0),
      ingredientsCount: recipe.recipeIngredients?.length ?? 0,
      calories: recipe.caloriesTotal ?? 0,
      tags: recipe.category ? [t(`recipe_category.${recipe.category}`)] : [],
    });
  };

  return (
    <div
      className="flex min-h-screen flex-col"
      style={{ backgroundColor: '#3F4756' }}
    >
      <ChefNavbar />

      {selectedRecipe && (
        <RecipeSummaryModal
          recipe={selectedRecipe}
          onClose={() => setSelectedRecipe(null)}
        />
      )}

      <main className="relative flex flex-1 flex-col overflow-hidden">
        {/* Decorative circles */}
        <div
          className="pointer-events-none absolute"
          style={{
            left: '-60px',
            top: '60px',
            width: '340px',
            height: '340px',
            borderRadius: '50%',
            border: '2px solid #377CC3',
            opacity: 0.5,
          }}
        />
        <div
          className="pointer-events-none absolute"
          style={{
            right: '-40px',
            top: '80px',
            width: '280px',
            height: '280px',
            borderRadius: '50%',
            border: '2px solid #5899d6',
            opacity: 0.3,
          }}
        />

        <div className="relative z-10 flex flex-1 flex-col px-8 pt-10 md:px-16">
          {/* Top row */}
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div>
              <p
                className="mb-2 text-2xl italic"
                style={{ color: '#B3D5F8', fontFamily: 'Georgia, serif' }}
              >
                {t('chef.landing.tagline_pre')}
              </p>
              <div
                className="rounded-xl px-5 py-4"
                style={{ backgroundColor: '#B3D5F8', display: 'inline-block' }}
              >
                <h1
                  className="text-4xl font-black italic leading-tight uppercase"
                  style={{ color: '#3F4756', fontFamily: 'Georgia, serif' }}
                >
                  {t('chef.landing.tagline_bold')}
                </h1>
              </div>
            </div>

            {/* Rating widget */}
            {averageRating > 0 &&
              (!showRatings ? (
                <div className="flex flex-col items-center md:items-end">
                  <p className="mb-2 text-sm font-semibold text-white">
                    {t('chef.landing.user_rating')}
                  </p>
                  <button
                    onClick={() => setShowRatings(true)}
                    className="flex items-center gap-2 rounded-full px-4 py-2 transition hover:opacity-90"
                    style={{ backgroundColor: '#B3D5F8' }}
                  >
                    <Stars rating={averageRating} size="md" />
                    <span className="font-bold" style={{ color: '#3F4756' }}>
                      {averageRating.toFixed(1)}/ 5
                    </span>
                  </button>
                  <p className="mt-1 text-xs text-gray-300">
                    {totalRatings} {t('chef.landing.user_reviews')}
                  </p>
                </div>
              ) : (
                <RatingModal
                  onClose={() => setShowRatings(false)}
                  average={averageRating}
                  total={totalRatings}
                  counts={ratingCounts}
                  overlay={false}
                />
              ))}
          </div>

          {/* Fanned cards */}
          <div className="relative mt-8 flex flex-1 items-center justify-center pb-4">
            {recipesLoading ? (
              <p className="text-white opacity-60">{t('common.loading')}</p>
            ) : fanRecipes.length === 0 ? (
              <p className="text-white opacity-60">
                {t('chef.landing.no_recipes')}
              </p>
            ) : (
              <>
                {/* Mobile: horizontal scroll */}
                <div className="flex gap-4 overflow-x-auto pb-4 md:hidden">
                  {fanRecipes.map((recipe, idx) => (
                    <div
                      key={recipe.id}
                      onClick={() => openModal(recipe)}
                      className="flex-shrink-0 w-44 rounded-2xl overflow-hidden shadow-xl cursor-pointer transition-transform hover:scale-105"
                      style={{
                        backgroundColor: BG_COLORS[idx % BG_COLORS.length],
                      }}
                    >
                      <div className="p-3">
                        <span className="text-xs text-gray-500">
                          {recipe.category
                            ? t(`recipe_category.${recipe.category}`)
                            : ''}
                        </span>
                        <p
                          className="mt-1 text-sm font-bold leading-tight"
                          style={{ color: '#3F4756' }}
                        >
                          {pick(recipe.title_el, recipe.title_en, lang)}
                        </p>
                      </div>
                      <div
                        className="relative h-28 overflow-hidden rounded-xl mx-2 mb-2"
                        style={{ width: 'calc(100% - 16px)' }}
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

                {/* Desktop: fanned layout */}
                <div
                  className="relative hidden md:block"
                  style={{ width: '600px', height: '340px' }}
                >
                  {fanRecipes.map((recipe, idx) => (
                    <div
                      key={recipe.id}
                      onClick={() => openModal(recipe)}
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
                        <p
                          className="mt-1 text-sm font-bold leading-tight"
                          style={{ color: '#3F4756' }}
                        >
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

          {/* More button */}
          <div className="flex justify-center pb-10">
            <Link
              href="/chef/recipes"
              className="rounded-full px-10 py-3 text-sm font-bold transition hover:opacity-90"
              style={{ backgroundColor: '#B3D5F8', color: '#3F4756' }}
            >
              {t('chef.landing.more')}
            </Link>
          </div>
        </div>
      </main>

      <Footer />
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
