import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import ChefNavbar from '../../components/Chef/ChefNavbar';
import RecipeSummaryModal, {
  RecipeSummaryData,
} from '../../components/Chef/RecipeSummary';
import Footer from '../../components/Users/Footer';

// ─── Types ────────────────────────────────────────────────────────────────────
interface RecipeCard {
  id: number;
  title: string;
  category: string;
  image: string;
  bgColor: string;
  rotation: number;
  zIndex: number;
  offsetX: number;
  description: string;
  duration: number;
  ingredientsCount: number;
  calories: number;
  tags: string[];
}

// ─── Fake data ────────────────────────────────────────────────────────────────
const FAKE_RECIPE_CARDS: RecipeCard[] = [
  {
    id: 1,
    title: 'Μακαρονάδα με σάλτσα ντομάτας',
    category: 'Ζυμαρικά',
    image: '/images/food.jpg',
    bgColor: '#B3D5F8',
    rotation: -15,
    zIndex: 1,
    offsetX: -180,
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    duration: 25,
    ingredientsCount: 7,
    calories: 220,
    tags: ['Μακαρονια', 'Ζυμαρικά', 'Ιταλική'],
  },
  {
    id: 2,
    title: 'Καλαμαράκια με πατάτες φούρνου',
    category: 'Θαλασσινά',
    image: '/images/food.jpg',
    bgColor: '#FEF9C3',
    rotation: -5,
    zIndex: 2,
    offsetX: -60,
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    duration: 40,
    ingredientsCount: 5,
    calories: 310,
    tags: ['Θαλασσινά', 'Φούρνος'],
  },
  {
    id: 3,
    title: 'Μακαρονάδα με σάλτσα ντομάτας',
    category: 'Ζυμαρικά',
    image: '/images/food.jpg',
    bgColor: '#FCE4EC',
    rotation: 5,
    zIndex: 3,
    offsetX: 60,
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    duration: 30,
    ingredientsCount: 6,
    calories: 200,
    tags: ['Μακαρονια', 'Ζυμαρικά'],
  },
  {
    id: 4,
    title: 'Σαλάτα του Καίσαρα',
    category: 'Σαλάτες',
    image: '/images/food.jpg',
    bgColor: '#DCFCE7',
    rotation: 15,
    zIndex: 4,
    offsetX: 180,
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    duration: 15,
    ingredientsCount: 8,
    calories: 180,
    tags: ['Σαλάτα', 'Vegan', 'Ελαφρύ'],
  },
];

const FAKE_RATING = {
  average: 4.9,
  total: 25,
  breakdown: [
    { stars: 5, pct: 80 },
    { stars: 4, pct: 65 },
    { stars: 3, pct: 45 },
    { stars: 2, pct: 35 },
    { stars: 1, pct: 50 },
  ],
};

// ─── Star component ────────────────────────────────────────────────────────────
const Stars = ({
  rating,
  size = 'md',
}: {
  rating: number;
  size?: 'sm' | 'md' | 'lg';
}) => {
  const sz = size === 'lg' ? 'h-7 w-7' : size === 'md' ? 'h-5 w-5' : 'h-4 w-4';
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill={i < Math.round(rating) ? '#EAB308' : 'none'}
          stroke="#EAB308"
          strokeWidth={i < Math.round(rating) ? 0 : 1.5}
          className={sz}
        >
          <path
            fillRule="evenodd"
            d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
            clipRule="evenodd"
          />
        </svg>
      ))}
    </div>
  );
};

// ─── Rating breakdown panel ────────────────────────────────────────────────────
const RatingPanel = ({ onClose }: { onClose: () => void }) => (
  <div className="rounded-2xl bg-white p-8 shadow-2xl w-full max-w-sm">
    {/* Back button */}
    <button
      onClick={onClose}
      className="mb-4 flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:bg-gray-100 transition"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
        className="h-4 w-4"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
        />
      </svg>
    </button>

    <h2
      className="mb-3 text-center text-xl font-bold"
      style={{ color: '#3F4756' }}
    >
      Αξιολόγηση Χρηστών
    </h2>

    {/* Score pill */}
    <div className="mb-1 flex justify-center">
      <div className="flex items-center gap-2 rounded-full border-2 border-gray-200 px-4 py-2">
        <Stars rating={FAKE_RATING.average} size="md" />
        <span className="font-bold text-gray-700">
          {FAKE_RATING.average}/ 5
        </span>
      </div>
    </div>
    <p className="mb-6 text-center text-sm text-gray-400">
      {FAKE_RATING.total} Αξιολογήσεις χρηστών
    </p>

    {/* Breakdown bars */}
    <div className="flex flex-col gap-4">
      {FAKE_RATING.breakdown.map((row) => (
        <div key={row.stars} className="flex items-center gap-3">
          <span className="w-20 text-sm text-gray-600">
            {row.stars} {row.stars === 1 ? 'αστέρι' : 'αστέρια'}
          </span>
          <div className="relative flex-1 h-8 rounded-full bg-gray-100 overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 rounded-full transition-all duration-700"
              style={{ width: `${row.pct}%`, backgroundColor: '#EAB308' }}
            />
          </div>
        </div>
      ))}
    </div>
  </div>
);

// ─── Main page ─────────────────────────────────────────────────────────────────
export default function ChefIndex() {
  const [showRatings, setShowRatings] = useState(false);
  const [selectedRecipe, setSelectedRecipe] =
    useState<RecipeSummaryData | null>(null);

  const openModal = (card: RecipeCard) => {
    setSelectedRecipe({
      id: card.id,
      title: card.title,
      image: card.image,
      description: card.description,
      duration: card.duration,
      ingredientsCount: card.ingredientsCount,
      calories: card.calories,
      tags: card.tags,
    });
  };

  return (
    <div
      className="flex min-h-screen flex-col"
      style={{ backgroundColor: '#3F4756' }}
    >
      <ChefNavbar />

      {/* Recipe summary modal */}
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

        {/* Content area */}
        <div className="relative z-10 flex flex-1 flex-col px-8 pt-10 md:px-16">
          {/* Top row: headline left + rating right */}
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            {/* Headline */}
            <div>
              <p
                className="mb-2 text-2xl italic"
                style={{ color: '#B3D5F8', fontFamily: 'Georgia, serif' }}
              >
                Η μαγειρική
              </p>
              <div
                className="rounded-xl px-5 py-4"
                style={{ backgroundColor: '#B3D5F8', display: 'inline-block' }}
              >
                <h1
                  className="text-4xl font-black italic leading-tight"
                  style={{ color: '#3F4756', fontFamily: 'Georgia, serif' }}
                >
                  ΑΥΘΕΝΤΙΑ
                  <br />
                  <span style={{ fontStyle: 'italic' }}>των</span>
                  <br />
                  ΣΥΝΤΑΓΩΝ
                </h1>
              </div>
              <p
                className="mt-3 text-2xl italic"
                style={{ color: '#B3D5F8', fontFamily: 'Georgia, serif' }}
              >
                σας.
              </p>
            </div>

            {/* Rating widget */}
            {!showRatings ? (
              <div className="flex flex-col items-center md:items-end">
                <p className="mb-2 text-sm font-semibold text-white">
                  Αξιολόγηση Χρηστών
                </p>
                <button
                  onClick={() => setShowRatings(true)}
                  className="flex items-center gap-2 rounded-full px-4 py-2 transition hover:opacity-90"
                  style={{ backgroundColor: '#B3D5F8' }}
                >
                  <Stars rating={FAKE_RATING.average} size="md" />
                  <span className="font-bold" style={{ color: '#3F4756' }}>
                    {FAKE_RATING.average}/ 5
                  </span>
                </button>
                <p className="mt-1 text-xs text-gray-300">
                  {FAKE_RATING.total} Αξιολογήσεις χρηστών
                </p>
              </div>
            ) : (
              <RatingPanel onClose={() => setShowRatings(false)} />
            )}
          </div>

          {/* Fanned cards */}
          <div className="relative mt-8 flex flex-1 items-center justify-center pb-4">
            {/* Mobile: horizontal scroll */}
            <div className="flex gap-4 overflow-x-auto pb-4 md:hidden">
              {FAKE_RECIPE_CARDS.map((card) => (
                <div
                  key={card.id}
                  onClick={() => openModal(card)}
                  className="flex-shrink-0 w-44 rounded-2xl overflow-hidden shadow-xl cursor-pointer transition-transform hover:scale-105"
                  style={{ backgroundColor: card.bgColor }}
                >
                  <div className="p-3">
                    <span className="text-xs text-gray-500">
                      {card.category}
                    </span>
                    <p
                      className="mt-1 text-sm font-bold leading-tight"
                      style={{ color: '#3F4756' }}
                    >
                      {card.title}
                    </p>
                  </div>
                  <div
                    className="relative h-28 w-full overflow-hidden rounded-xl mx-2 mb-2"
                    style={{ width: 'calc(100% - 16px)' }}
                  >
                    <Image
                      src={card.image}
                      alt={card.title}
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
              {FAKE_RECIPE_CARDS.map((card) => (
                <div
                  key={card.id}
                  onClick={() => openModal(card)}
                  className="absolute w-48 rounded-2xl overflow-hidden shadow-2xl cursor-pointer transition-transform hover:scale-105 hover:-translate-y-2"
                  style={{
                    backgroundColor: card.bgColor,
                    transform: `rotate(${card.rotation}deg) translateX(${card.offsetX}px)`,
                    zIndex: card.zIndex,
                    top: '20px',
                    left: '50%',
                    marginLeft: '-96px',
                    transformOrigin: 'bottom center',
                  }}
                >
                  <div className="p-3">
                    <span className="text-xs text-gray-500">
                      {card.category}
                    </span>
                    <p
                      className="mt-1 text-sm font-bold leading-tight"
                      style={{ color: '#3F4756' }}
                    >
                      {card.title}
                    </p>
                  </div>
                  <div
                    className="relative mx-2 mb-2 overflow-hidden rounded-xl"
                    style={{ height: '140px', width: 'calc(100% - 16px)' }}
                  >
                    <Image
                      src={card.image}
                      alt={card.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Περισσότερα button */}
          <div className="flex justify-center pb-10">
            <Link
              href="/chef/recipes"
              className="rounded-full px-10 py-3 text-sm font-bold text-white transition hover:opacity-90"
              style={{ backgroundColor: '#B3D5F8', color: '#3F4756' }}
            >
              Περισσότερα
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
