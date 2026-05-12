import { useState } from 'react';
import Navbar from '../../components/Users/Navbar';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import {
  useMyNutritionalSummaryQuery,
  useMyFavoritesQuery,
} from '../../generated/graphql';
import useIsUser from '../../utils/useIsUser';
import PaginationControls from '../../components/Helper/PaginationControls';

const FAV_LIMIT = 3;

const DIFFICULTY_MAP: Record<string, { el: string; en: string }> = {
  easy: { el: 'Εύκολο', en: 'Easy' },
  medium: { el: 'Μέτριο', en: 'Medium' },
  hard: { el: 'Δύσκολο', en: 'Hard' },
};

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

const HomeContent = () => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const { locale } = router;
  const isEl = locale === 'el';
  const [favOffset, setFavOffset] = useState(0);

  const { data: summaryData, loading: summaryLoading } =
    useMyNutritionalSummaryQuery({ fetchPolicy: 'network-only' });

  const { data: favData, loading: favLoading } = useMyFavoritesQuery({
    variables: { limit: FAV_LIMIT, offset: favOffset },
    fetchPolicy: 'network-only',
  });

  const summary = summaryData?.myNutritionalSummary;
  const favorites = favData?.myFavorites ?? [];
  const hasPrev = favOffset > 0;
  const hasMore = favorites.length === FAV_LIMIT;

  const macros = [
    {
      labelKey: 'landing.energy',
      value: `${Math.round(summary?.totalCalories ?? 0)} kcal`,
    },
    {
      labelKey: 'landing.fat',
      value: `${Math.round(summary?.totalFat ?? 0)}g`,
    },
    {
      labelKey: 'landing.protein',
      value: `${Math.round(summary?.totalProtein ?? 0)}g`,
    },
    {
      labelKey: 'landing.carbs',
      value: `${Math.round(summary?.totalCarbs ?? 0)}g`,
    },
  ];

  const totalMacroG =
    (summary?.totalFat ?? 0) +
    (summary?.totalProtein ?? 0) +
    (summary?.totalCarbs ?? 0);

  const donutSegments = [
    {
      pct:
        totalMacroG > 0
          ? Math.min((summary?.totalCalories ?? 0) / 2000, 1) * 0.4
          : 0.25,
    },
    { pct: totalMacroG > 0 ? (summary?.totalFat ?? 0) / totalMacroG : 0.2 },
    {
      pct: totalMacroG > 0 ? (summary?.totalProtein ?? 0) / totalMacroG : 0.15,
    },
    { pct: totalMacroG > 0 ? (summary?.totalCarbs ?? 0) / totalMacroG : 0.4 },
  ];

  const pctSum = donutSegments.reduce((acc, s) => acc + s.pct, 0);
  const normSegments =
    pctSum > 0
      ? donutSegments.map((s) => ({ pct: s.pct / pctSum }))
      : donutSegments;

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="mx-auto max-w-3xl px-6 pb-16 pt-10">
        <div className="mb-8 ">
          <h1 className="mb-3 text-center break-words">
            {t('landing.nutritionTitle')}
          </h1>
          <p className="mx-auto text-left max-w-md ">
            {t('landing.nutritionDesc')}
          </p>
        </div>

        <div className="mx-auto flex max-w-md flex-col items-center gap-4 rounded-2xl bg-surface p-6 shadow-lg sm:flex-row sm:gap-6">
          {summaryLoading ? (
            <div className="flex h-40 w-full items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-cookie-300 border-t-transparent" />
            </div>
          ) : (
            <>
              <div className="flex flex-col gap-3">
                {macros.map((m) => (
                  <div key={m.labelKey} className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="h-3 w-3 flex-shrink-0 rounded-sm bg-cookie-200" />
                      <span className="text-sm font-semibold">
                        {t(m.labelKey)}
                      </span>
                    </div>
                    <span className="ml-5 text-sm text-myText-muted">
                      {m.value}
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex-shrink-0">
                <DonutChart
                  segments={normSegments}
                  cookCount={summary?.cookCount ?? 0}
                  t={t}
                />
              </div>
            </>
          )}
        </div>

        <div className="mt-16">
          <h1 className="mb-8 text-center">{t('recipes.favourites')}</h1>

          {favLoading ? (
            <div className="flex justify-center py-10">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-cookie-300 border-t-transparent" />
            </div>
          ) : favorites.length === 0 && !hasPrev ? (
            <p className="text-center text-myText-muted">
              {t('recipes.noFavourites')}
            </p>
          ) : (
            <div className="flex flex-wrap justify-center gap-4">
              {favorites.map((fav) => {
                const recipe = fav.recipe;
                if (!recipe) return null;
                const title = isEl ? recipe.title_el : recipe.title_en;
                const totalTime =
                  (recipe.prepTime ?? 0) + (recipe.cookTime ?? 0);
                const diff = recipe.difficulty
                  ? DIFFICULTY_MAP[recipe.difficulty.toLowerCase()] ?? null
                  : null;
                return (
                  <div
                    key={fav.id}
                    onClick={() => router.push(`/user/recipes/${recipe.id}`)}
                    className="flex w-full max-w-[220px] cursor-pointer flex-col items-center gap-2 rounded-2xl bg-surface p-4 shadow-lg transition-shadow hover:shadow-xl"
                  >
                    <img
                      src={recipe.recipeImage!}
                      alt={title}
                      className="h-20 w-20 rounded-full border-4 border-cookie-200 object-cover shadow"
                    />
                    <h5 className="text-center ">{title}</h5>
                    <div className="flex items-center gap-2  text-myText-muted">
                      {totalTime > 0 && (
                        <span>
                          {totalTime} {t('landing.minutes')}
                        </span>
                      )}
                      {diff && totalTime > 0 && <span>·</span>}
                      {diff && <span>{isEl ? diff.el : diff.en}</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {!favLoading && (
            <PaginationControls
              hasPrev={hasPrev}
              hasMore={hasMore && favorites.length > 0}
              onPrev={() => setFavOffset((o) => o - FAV_LIMIT)}
              onNext={() => setFavOffset((o) => o + FAV_LIMIT)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

const DonutChart = ({
  segments,
  cookCount,
  t,
}: {
  segments: { pct: number }[];
  cookCount: number;
  t: ReturnType<typeof useTranslation>['t'];
}) => {
  const size = 160;
  const cx = size / 2;
  const cy = size / 2;
  const r = 58;
  const stroke = 18;
  const gap = 0.015;
  let cumulativePct = 0;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {segments.map((seg, i) => {
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
            stroke="#EDD4B0"
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
        fill="#1F1A14"
      >
        {cookCount}
      </text>
      <text x={cx} y={cy + 14} textAnchor="middle" fontSize="11" fill="#9C9080">
        {t('landing.cookCount')}
      </text>
    </svg>
  );
};
