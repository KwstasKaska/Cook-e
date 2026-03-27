import { useState } from 'react';
import Navbar from '../../components/Users/Navbar';

//Types
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
    label: 'Ενέργεια',
    value: '2000kcal',
    color: '#F9A8D4',
    pct: 0.28,
  },
  lipara: { label: 'Λιπαρά', value: '90g', color: '#EAB308', pct: 0.18 },
  proteini: { label: 'Πρωτείνη', value: '50g', color: '#86EFAC', pct: 0.12 },
  ydatanthrakes: {
    label: 'Υδατάνθρακες',
    value: '300g',
    color: '#93C5FD',
    pct: 0.42,
  },
};

//Donut chart (pure SVG)
function DonutChart() {
  const size = 160;
  const cx = size / 2;
  const cy = size / 2;
  const r = 58;
  const stroke = 18;
  const circumference = 2 * Math.PI * r;

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
        ημέρες
      </text>
    </svg>
  );
}

//Star rating
function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg
          key={s}
          className={`w-4 h-4 ${
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

//Recipe card
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
  const order = [
    (activeIndex + 0) % 3,
    (activeIndex + 1) % 3,
    (activeIndex + 2) % 3,
  ];

  const rotations = [-8, -3, 0];
  const xOffsets = ['-60px', '-30px', '0px'];
  const yOffsets = ['20px', '10px', '0px'];

  return (
    <div className="relative flex items-center justify-end pr-4 md:pr-10">
      {/* Cards stack */}
      <div className="relative" style={{ width: 260, height: 380 }}>
        {order.map((recipeIdx, stackPos) => {
          const recipe = recipes[recipeIdx];
          const isFront = stackPos === 2;
          const bgColor = cardColors[recipeIdx];

          return (
            <div
              key={recipe.id}
              className="absolute rounded-2xl shadow-xl overflow-visible"
              style={{
                width: 240,
                bottom: 0,
                left: xOffsets[stackPos],
                transform: `rotate(${rotations[stackPos]}deg) translateY(${yOffsets[stackPos]})`,
                backgroundColor: bgColor,
                zIndex: stackPos,
                transition: 'all 0.4s ease',
              }}
            >
              {/* Food image overlapping top */}
              <div
                className="relative flex justify-center"
                style={{ marginTop: -40 }}
              >
                <img
                  src={recipe.image}
                  alt={recipe.title}
                  className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-md"
                />
              </div>

              <div className="px-4 pt-2 pb-4">
                {isFront && (
                  <div className="flex justify-end mb-1">
                    <span className="bg-white text-gray-700 text-xs font-semibold px-3 py-0.5 rounded-full">
                      {recipe.difficulty}
                    </span>
                  </div>
                )}

                <h3
                  className="font-bold text-gray-800 text-sm leading-tight mb-1"
                  style={{ minHeight: 36 }}
                >
                  {recipe.title}
                </h3>

                <div className="flex items-center gap-1 mb-1">
                  <Stars rating={recipe.rating} />
                  {isFront && (
                    <span className="text-xs text-gray-600 ml-1">
                      {recipe.rating}/ 5 ({recipe.ratingCount})
                    </span>
                  )}
                </div>

                {isFront && (
                  <>
                    <div className="flex items-center justify-between text-xs font-semibold text-gray-700 border-t border-white/60 pt-2 mb-3">
                      <span>{recipe.timeMinutes} λεπτά</span>
                      <span className="border-l border-white/60 pl-3">
                        {recipe.kcal} Kcal
                      </span>
                      <span className="border-l border-white/60 pl-3">
                        {recipe.category}
                      </span>
                    </div>
                    <button className="w-full border-2 border-gray-800 text-gray-800 font-bold text-sm py-2 rounded-xl hover:bg-gray-800 hover:text-white transition-colors duration-150">
                      Ξεκίνα να μαγειρεύεις!
                    </button>
                  </>
                )}

                {!isFront && (
                  <div className="mt-2">
                    <button className="w-full border border-gray-700 text-gray-700 text-xs font-semibold py-1.5 rounded-xl">
                      Ξεκίνα να…
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Arrow button */}
      <button
        onClick={onNext}
        className="ml-4 w-12 h-12 rounded-full border-2 border-gray-700 flex items-center justify-center text-gray-700 hover:bg-gray-700 hover:text-white transition-colors duration-150 flex-shrink-0 self-center"
        style={{ marginBottom: 0 }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5"
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
  const [activeCard, setActiveCard] = useState(2); // front card index

  const handleNext = () => {
    setActiveCard((prev) => (prev + 1) % 3);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#3F4756' }}>
      <Navbar />

      {/* ── Hero section: dark top + diagonal split ── */}
      <div className="relative overflow-hidden">
        {/* White diagonal bottom half */}
        <div
          className="absolute bottom-0 left-0 w-full bg-white"
          style={{
            height: '55%',
            clipPath: 'polygon(0 40%, 100% 0%, 100% 100%, 0% 100%)',
          }}
        />

        <div className="relative z-10 max-w-6xl mx-auto px-6 pt-10 pb-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Left: Donut card */}
            <div className="bg-white rounded-2xl shadow-lg p-6 flex gap-6 items-center max-w-md mx-auto md:mx-0">
              {/* Legend */}
              <div className="flex flex-col gap-3">
                {Object.values(FAKE_MACROS).map((m) => (
                  <div key={m.label} className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-3 h-3 rounded-sm flex-shrink-0"
                        style={{ backgroundColor: m.color }}
                      />
                      <span className="text-sm font-semibold text-gray-700">
                        {m.label}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500 ml-5">
                      {m.value}
                    </span>
                  </div>
                ))}
              </div>
              {/* Donut */}
              <div className="flex-shrink-0">
                <DonutChart />
              </div>
            </div>

            {/* Right: Text */}
            <div className="text-white">
              <h1
                className="text-4xl md:text-5xl font-bold italic mb-4"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                Διατροφικά Στοιχεία
              </h1>
              <p className="text-gray-200 text-base leading-relaxed max-w-sm">
                Παρακολουθήστε τα διατροφικά στοιχεία που καταναλώσατε την
                τελευταία βδομάδα, συγκεντρωτικά, στο γράφημα αριστερά.
              </p>
            </div>
          </div>
        </div>

        {/* ── Bottom section: text left + fanned cards right ── */}
        <div className="relative z-10 max-w-6xl mx-auto px-6 pt-12 pb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
            {/* Left: Weekly recipes text */}
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Οι συνταγες της εβδομάδας
              </h2>
              <div className="text-gray-600 text-sm leading-relaxed space-y-3 max-w-sm">
                <p>
                  Τα υλικά των σημερινών συνταγών είναι αυτά που τις έκαναν να
                  προταθούν. Τα γνωρίζεις;
                </p>
                <p>
                  Μάλλον ναι, αφού πολλά απο αυτά τα χρησιμοποίησες το τελευταίο
                  διάστημα.
                </p>
                <p>Δοκίμασε τες και πες μας την γνώμη σου!</p>
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
