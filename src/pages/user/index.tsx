import { useState } from 'react';
import Navbar from '../../components/Users/Navbar';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';

// Types
export type RecipeCard = {
  id: number;
  title: string;
  image: string;
  difficulty: 'Εύκολη' | 'Μέτρια' | 'Δύσκολη';
  rating: number;
  ratingCount: number;
  timeMinutes: number;
  kcal: number;
  category: string;
};

// Fake data
const FAKE_WEEK_RECIPES: RecipeCard[] = [
  {
    id: 1,
    title: 'Λεμονάτο με ρύζι',
    image:
      'https://images.unsplash.com/photo-1547592180-85f173990554?w=300&q=80',
    difficulty: 'Εύκολη',
    rating: 4.2,
    ratingCount: 18,
    timeMinutes: 25,
    kcal: 420,
    category: 'Σούπα',
  },
  {
    id: 2,
    title: 'Καλαμαράκια',
    image:
      'https://images.unsplash.com/photo-1559847844-5315695dadae?w=300&q=80',
    difficulty: 'Μέτρια',
    rating: 4.6,
    ratingCount: 24,
    timeMinutes: 25,
    kcal: 380,
    category: 'Θαλασσινά',
  },
  {
    id: 3,
    title: 'Μακαρόνια με σάλτσα ντομάτας',
    image:
      'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=300&q=80',
    difficulty: 'Εύκολη',
    rating: 4.9,
    ratingCount: 30,
    timeMinutes: 25,
    kcal: 500,
    category: 'Pasta',
  },
];

const FAKE_MACROS = {
  energia: {
    labelKey: 'landing.energy',
    value: '2000kcal',
    color: '#F9A8D4',
    pct: 0.28,
  },
  lipara: {
    labelKey: 'landing.fat',
    value: '90g',
    color: '#EAB308',
    pct: 0.18,
  },
  proteini: {
    labelKey: 'landing.protein',
    value: '50g',
    color: '#86EFAC',
    pct: 0.12,
  },
  ydatanthrakes: {
    labelKey: 'landing.carbs',
    value: '300g',
    color: '#93C5FD',
    pct: 0.42,
  },
};

export async function getServerSideProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}

// Donut chart (pure SVG)
function DonutChart() {
  const { t } = useTranslation('common');
  const size = 160;
  const cx = size / 2;
  const cy = size / 2;
  const r = 58;
  const stroke = 18;

  const segments = Object.values(FAKE_MACROS);
  let cumulativePct = 0;
  const gap = 0.015;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {segments.map((seg, i) => {
        const startPct = cumulativePct + gap / 2;
        const arcPct = seg.pct - gap;
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
        7
      </text>
      <text x={cx} y={cy + 14} textAnchor="middle" fontSize="11" fill="#6B7280">
        {t('landing.days')}
      </text>
    </svg>
  );
}

// Star rating
function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg
          key={s}
          className={`h-4 w-4 ${
            s <= Math.round(rating) ? 'text-yellow-400' : 'text-gray-300'
          }`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

const cardColors = ['#EAB308', '#86EFAC', '#B3D5F8'];

function FannedCards({
  recipes,
  activeIndex,
  onNext,
}: {
  recipes: RecipeCard[];
  activeIndex: number;
  onNext: () => void;
}) {
  const { t } = useTranslation('common');

  const order = [
    (activeIndex + 0) % 3,
    (activeIndex + 1) % 3,
    (activeIndex + 2) % 3,
  ];

  const rotations = [-8, -3, 0];
  const xOffsets = ['-28px', '-14px', '0px'];
  const yOffsets = ['20px', '10px', '0px'];

  return (
    <div className="flex flex-col items-center gap-4 md:flex-row md:justify-center">
      <div className="relative w-full max-w-[260px]" style={{ height: 380 }}>
        {order.map((recipeIdx, stackPos) => {
          const recipe = recipes[recipeIdx];
          const isFront = stackPos === 2;
          const bgColor = cardColors[recipeIdx];

          return (
            <div
              key={recipe.id}
              className="absolute rounded-2xl shadow-xl overflow-visible"
              style={{
                width: 'calc(100% - 0px)',
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
                <img
                  src={recipe.image}
                  alt={recipe.title}
                  className="h-28 w-28 rounded-full border-4 border-white object-cover shadow-md"
                />
              </div>

              <div className="px-4 pb-4 pt-2">
                {isFront && (
                  <div className="mb-1 flex justify-end">
                    <span className="rounded-full bg-white px-3 py-0.5 text-xs font-semibold text-gray-700">
                      {recipe.difficulty}
                    </span>
                  </div>
                )}

                <h3
                  className="mb-1 text-sm font-bold leading-tight text-gray-800"
                  style={{ minHeight: 36 }}
                >
                  {recipe.title}
                </h3>

                <div className="mb-1 flex items-center gap-1">
                  <Stars rating={recipe.rating} />
                  {isFront && (
                    <span className="ml-1 text-xs text-gray-600">
                      {recipe.rating}/ 5 ({recipe.ratingCount})
                    </span>
                  )}
                </div>

                {isFront && (
                  <>
                    <div className="mb-3 flex items-center justify-between border-t border-white/60 pt-2 text-xs font-semibold text-gray-700">
                      <span>
                        {recipe.timeMinutes} {t('landing.minutes')}
                      </span>
                      <span className="border-l border-white/60 pl-3">
                        {recipe.kcal} Kcal
                      </span>
                      <span className="border-l border-white/60 pl-3">
                        {recipe.category}
                      </span>
                    </div>
                    <button className="w-full rounded-xl border-2 border-gray-800 py-2 text-sm font-bold text-gray-800 transition-colors duration-150 hover:bg-gray-800 hover:text-white">
                      {t('landing.startCooking')}
                    </button>
                  </>
                )}

                {!isFront && (
                  <div className="mt-2">
                    <button className="w-full rounded-xl border border-gray-700 py-1.5 text-xs font-semibold text-gray-700">
                      {t('landing.startCooking')}…
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <button
        onClick={onNext}
        className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border-2 border-gray-700 text-gray-700 transition-colors duration-150 hover:bg-gray-700 hover:text-white"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}

// Page
export default function UserHomePage() {
  const { t } = useTranslation('common');
  const [activeCard, setActiveCard] = useState(2);

  const handleNext = () => {
    setActiveCard((prev) => (prev + 1) % 3);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#3F4756' }}>
      <Navbar />

      <div className="relative overflow-hidden">
        <div
          className="absolute bottom-0 left-0 w-full bg-white"
          style={{
            height: '55%',
            clipPath: 'polygon(0 40%, 100% 0%, 100% 100%, 0% 100%)',
          }}
        />

        <div className="relative z-10 mx-auto max-w-6xl px-6 pb-0 pt-10">
          <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2">
            {/* Left: Donut card */}
            <div className="mx-auto flex max-w-md items-center gap-6 rounded-2xl bg-white p-6 shadow-lg md:mx-0">
              <div className="flex flex-col gap-3">
                {Object.values(FAKE_MACROS).map((m) => (
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
                <DonutChart />
              </div>
            </div>

            {/* Right: Text */}
            <div className="text-white">
              <h1
                className="mb-4 text-4xl font-bold italic md:text-5xl"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                {t('landing.nutritionTitle')}
              </h1>
              <p className="max-w-sm text-base leading-relaxed text-gray-200">
                {t('landing.nutritionDesc')}
              </p>
            </div>
          </div>
        </div>

        <div className="relative z-10 mx-auto max-w-6xl px-6 pb-16 pt-12">
          <div className="grid grid-cols-1 items-end gap-8 md:grid-cols-2">
            {/* Left: Weekly recipes text */}
            <div>
              <h2 className="mb-4 text-2xl font-bold text-white md:text-gray-800">
                {t('landing.weeklyRecipesTitle')}
              </h2>
              <div className="max-w-sm space-y-3 text-sm leading-relaxed text-gray-200 md:text-gray-600">
                <p>{t('landing.weeklyRecipesDesc1')}</p>
                <p>{t('landing.weeklyRecipesDesc2')}</p>
                <p>{t('landing.weeklyRecipesDesc3')}</p>
              </div>
            </div>

            {/* Right: Fanned recipe cards */}
            <FannedCards
              recipes={FAKE_WEEK_RECIPES}
              activeIndex={activeCard}
              onNext={handleNext}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
