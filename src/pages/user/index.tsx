import { useState } from 'react';
import Navbar from '../../components/Users/Navbar';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import Link from 'next/link';
import {
  useMyNutritionalSummaryQuery,
  useTopRatedRecipesQuery,
} from '../../generated/graphql';
import useIsUser from '../../utils/useIsUser';
import { DIFFICULTY_OPTIONS } from '../../components/Chef/recipeDetail/types';

export async function getServerSideProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}

export default function UserHomePage() {
  const { loading: authLoading, isAuthorized } = useIsUser();
  if (authLoading || !isAuthorized) return null;
  return <HomeContent />;
}

function HomeContent() {
  const { t } = useTranslation('common');
  const { locale } = useRouter();
  const isEl = locale === 'el';
  const [activeCard, setActiveCard] = useState(0);

  const { data: summaryData, loading: summaryLoading } =
    useMyNutritionalSummaryQuery({ fetchPolicy: 'network-only' });

  const { data: topRatedData, loading: topRatedLoading } =
    useTopRatedRecipesQuery({
      variables: { limit: 3 },
      fetchPolicy: 'network-only',
    });

  const summary = summaryData?.myNutritionalSummary;
  const topRecipes = topRatedData?.topRatedRecipes ?? [];

  const totalMacroG =
    (summary?.totalFat ?? 0) +
    (summary?.totalProtein ?? 0) +
    (summary?.totalCarbs ?? 0);

  const macros = [
    {
      labelKey: 'landing.energy',
      value: `${Math.round(summary?.totalCalories ?? 0)} kcal`,
      color: '#F9A8D4',
      pct:
        totalMacroG > 0
          ? Math.min((summary?.totalCalories ?? 0) / 2000, 1) * 0.4
          : 0.25,
    },
    {
      labelKey: 'landing.fat',
      value: `${Math.round(summary?.totalFat ?? 0)}g`,
      color: '#EAB308',
      pct: totalMacroG > 0 ? (summary?.totalFat ?? 0) / totalMacroG : 0.2,
    },
    {
      labelKey: 'landing.protein',
      value: `${Math.round(summary?.totalProtein ?? 0)}g`,
      color: '#86EFAC',
      pct: totalMacroG > 0 ? (summary?.totalProtein ?? 0) / totalMacroG : 0.15,
    },
    {
      labelKey: 'landing.carbs',
      value: `${Math.round(summary?.totalCarbs ?? 0)}g`,
      color: '#93C5FD',
      pct: totalMacroG > 0 ? (summary?.totalCarbs ?? 0) / totalMacroG : 0.4,
    },
  ];

  const pctSum = macros.reduce((acc, m) => acc + m.pct, 0);
  const normMacros =
    pctSum > 0 ? macros.map((m) => ({ ...m, pct: m.pct / pctSum })) : macros;

  const handleNext = () =>
    setActiveCard((prev) => (prev + 1) % Math.max(topRecipes.length, 1));

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#3F4756' }}>
      <Navbar />

      <div className="relative overflow-x-hidden">
        {/* ── Top section: donut + title */}
        <div className="relative z-10 mx-auto max-w-6xl px-6 pb-0 pt-10">
          <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2">
            <div className="order-last mx-auto flex max-w-md flex-col sm:flex-row items-center gap-4 rounded-2xl bg-white p-6 shadow-lg sm:gap-6 md:mx-0 md:order-first">
              {summaryLoading ? (
                <div className="flex h-40 w-full items-center justify-center">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-myBlue-200 border-t-transparent" />
                </div>
              ) : (
                <>
                  <div className="flex flex-col gap-3">
                    {normMacros.map((m) => (
                      <div key={m.labelKey} className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <span
                            className="h-3 w-3 flex-shrink-0 rounded-sm"
                            style={{ backgroundColor: m.color }}
                          />
                          <span className="text-sm font-semibold text-gray-700">
                            {t(m.labelKey)}
                          </span>
                        </div>
                        <span className="ml-5 text-sm text-gray-500">
                          {m.value}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="flex-shrink-0">
                    <DonutChart
                      macros={normMacros}
                      cookCount={summary?.cookCount ?? 0}
                      t={t}
                    />
                  </div>
                </>
              )}
            </div>

            <div className="min-w-0 text-white">
              <h1 className="mb-4 break-words text-3xl font-bold italic md:text-5xl">
                {t('landing.nutritionTitle')}
              </h1>
              <p className="max-w-sm text-base leading-relaxed text-gray-200">
                {t('landing.nutritionDesc')}
              </p>
            </div>
          </div>
        </div>

        {/* ── Bottom section: top rated recipes */}
        <div className="relative z-10 mx-auto max-w-6xl px-6 pb-32 pt-12">
          <div className="grid grid-cols-1 items-end gap-8 md:grid-cols-2">
            <div>
              <h2 className="mb-4 text-2xl font-bold text-white ">
                {t('landing.weeklyRecipesTitle')}
              </h2>
              <div className="max-w-sm space-y-3 text-sm leading-relaxed text-gray-200 ">
                <p>{t('landing.weeklyRecipesDesc1')}</p>
                <p>{t('landing.weeklyRecipesDesc3')}</p>
              </div>
            </div>

            {topRatedLoading ? (
              <div className="flex justify-center py-16">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-myBlue-200 border-t-transparent" />
              </div>
            ) : topRecipes.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-4 rounded-2xl bg-white px-8 py-12 text-center shadow-lg">
                <p className="text-sm font-semibold text-gray-700">
                  {t('landing.noRatingsTitle')}
                </p>
                <p className="max-w-xs text-xs text-gray-400">
                  {t('landing.noRatingsDesc')}
                </p>
                <Link
                  href="/recipes"
                  className="mt-2 rounded-xl border-2 border-gray-800 px-5 py-2 text-sm font-bold text-gray-800 transition-colors hover:bg-gray-800 hover:text-white"
                >
                  {t('landing.noRatingsCta')}
                </Link>
              </div>
            ) : (
              <FannedCards
                recipes={topRecipes}
                activeIndex={activeCard}
                onNext={handleNext}
                isEl={isEl}
                t={t}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Donut chart
function DonutChart({
  macros,
  cookCount,
  t,
}: {
  macros: { color: string; pct: number }[];
  cookCount: number;
  t: ReturnType<typeof useTranslation>['t'];
}) {
  const size = 160;
  const cx = size / 2;
  const cy = size / 2;
  const r = 58;
  const stroke = 18;
  const gap = 0.015;
  let cumulativePct = 0;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {macros.map((seg, i) => {
        const startPct = cumulativePct + gap / 2;
        const arcPct = Math.max(seg.pct - gap, 0.001);
        cumulativePct += seg.pct;

        const startAngle = startPct * 2 * Math.PI - Math.PI / 2;
        const endAngle = (startPct + arcPct) * 2 * Math.PI - Math.PI / 2;

        const x1 = cx + r * Math.cos(startAngle);
        const y1 = cy + r * Math.sin(startAngle);
        const x2 = cx + r * Math.cos(endAngle);
        const y2 = cy + r * Math.sin(endAngle);
        const largeArc = arcPct > 0.5 ? 1 : 0;

        return (
          <path
            key={i}
            d={`M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`}
            fill="none"
            stroke={seg.color}
            strokeWidth={stroke}
            strokeLinecap="round"
          />
        );
      })}
      <text
        x={cx}
        y={cy - 6}
        textAnchor="middle"
        fontSize="22"
        fontWeight="700"
        fill="#3F4756"
      >
        {cookCount}
      </text>
      <text x={cx} y={cy + 14} textAnchor="middle" fontSize="11" fill="#6B7280">
        {t('landing.cookCount')}
      </text>
    </svg>
  );
}

// ── Fanned cards
const CARD_COLORS = ['#EAB308', '#86EFAC', '#B3D5F8'];

type TopRecipe = {
  id: number;
  title_el: string;
  title_en: string;
  recipeImage?: string | null;
  caloriesTotal?: number | null;
  prepTime?: number | null;
  cookTime?: number | null;
  difficulty?: string | null;
  category?: string | null;
};

function FannedCards({
  recipes,
  activeIndex,
  onNext,
  isEl,
  t,
}: {
  recipes: TopRecipe[];
  activeIndex: number;
  onNext: () => void;
  isEl: boolean;
  t: ReturnType<typeof useTranslation>['t'];
}) {
  const count = recipes.length;
  const rotations = [-8, -3, 0];
  const xOffsets = ['-28px', '-14px', '0px'];
  const yOffsets = ['20px', '10px', '0px'];

  const indices =
    count === 1
      ? [0, 0, 0]
      : count === 2
        ? [(activeIndex + 1) % 2, activeIndex % 2, activeIndex % 2]
        : [
            activeIndex % count,
            (activeIndex + 1) % count,
            (activeIndex + 2) % count,
          ];

  // Resolve difficulty to a human-readable label using the shared DIFFICULTY_OPTIONS
  const getDifficultyLabel = (difficulty?: string | null): string => {
    if (!difficulty) return '';
    const match = DIFFICULTY_OPTIONS.find(
      (opt) => opt.value.toLowerCase() === difficulty.toLowerCase(),
    );
    if (!match) return difficulty;
    return isEl ? match.labelEl : match.labelEn;
  };

  return (
    <div className="flex flex-col items-center gap-4 md:flex-row md:justify-center">
      <div className="relative w-full max-w-[260px]" style={{ height: 420 }}>
        {indices.map((recipeIdx, stackPos) => {
          const recipe = recipes[recipeIdx];
          if (!recipe) return null;

          const isFront = stackPos === 2;
          const bgColor = CARD_COLORS[recipeIdx % CARD_COLORS.length];
          const title = isEl ? recipe.title_el : recipe.title_en;
          const totalTime = (recipe.prepTime ?? 0) + (recipe.cookTime ?? 0);

          return (
            <div
              key={`${recipe.id}-${stackPos}`}
              className="absolute overflow-visible rounded-2xl shadow-xl"
              style={{
                width: '100%',
                bottom: 0,
                left: xOffsets[stackPos],
                transform: `rotate(${rotations[stackPos]}deg) translateY(${yOffsets[stackPos]})`,
                backgroundColor: bgColor,
                zIndex: stackPos,
                transition: 'all 0.4s ease',
              }}
            >
              <div
                className="relative flex justify-center"
                style={{ marginTop: -40 }}
              >
                {recipe.recipeImage ? (
                  <img
                    src={recipe.recipeImage}
                    alt={title}
                    className="h-28 w-28 rounded-full border-4 border-white object-cover shadow-md"
                  />
                ) : (
                  <div className="h-28 w-28 rounded-full border-4 border-white bg-gray-100 shadow-md" />
                )}
              </div>

              <div className="px-4 pb-4 pt-2">
                {isFront && recipe.difficulty && (
                  <div className="mb-1 flex justify-end">
                    <span className="rounded-full bg-white px-3 py-0.5 text-xs font-semibold text-gray-700">
                      {getDifficultyLabel(recipe.difficulty)}
                    </span>
                  </div>
                )}

                <h3
                  className="mb-1 text-sm font-bold leading-tight text-gray-900"
                  style={{ minHeight: 36 }}
                >
                  {title}
                </h3>

                {isFront && (
                  <>
                    <div className="mb-3 flex items-center justify-between border-t border-white/60 pt-2 text-xs font-semibold text-gray-700">
                      {totalTime > 0 && (
                        <span>
                          {totalTime} {t('landing.minutes')}
                        </span>
                      )}
                      {recipe.caloriesTotal && (
                        <span className="border-l border-white/60 pl-3">
                          {recipe.caloriesTotal} Kcal
                        </span>
                      )}
                      {recipe.category && (
                        <span className="border-l border-white/60 pl-3">
                          {t(`recipe_category.${recipe.category}`)}
                        </span>
                      )}
                    </div>
                    <Link
                      href={`/user/recipes/${recipe.id}`}
                      className="block w-full rounded-xl border-2 border-gray-800 py-2 text-center text-sm font-bold text-gray-800 transition-colors duration-150 hover:bg-gray-800 hover:text-white"
                    >
                      {t('landing.startCooking')}
                    </Link>
                  </>
                )}

                {!isFront && (
                  <div className="mt-2">
                    <span className="block w-full rounded-xl border border-gray-700 py-1.5 text-center text-xs font-semibold text-gray-700">
                      {t('landing.startCooking')}…
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {count > 1 && (
        <button
          onClick={onNext}
          className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border-2 border-white text-white "
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
  );
}
