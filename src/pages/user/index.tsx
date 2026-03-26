import React, { useState } from 'react';
import Image, { StaticImageData } from 'next/image';
import Link from 'next/link';
import Navbar from '../../components/Users/Navbar';
import ScrollToTopButton from '../../components/Helper/ScrollToTopButton';

interface WeeklyRecipe {
  id: number;
  title: string;
  image: StaticImageData | string;
  mealType: string;
  chefName: string;
  rating: number;
  ratingCount: number;
}

const FAKE_RECIPES: WeeklyRecipe[] = [
  {
    id: 1,
    title: 'Μοσχάρι κοκκινιστό με κριθαράκι',
    image: '/images/food.jpg',
    mealType: 'Μεσημεριανό',
    chefName: 'Chef Kostas',
    rating: 4.5,
    ratingCount: 100,
  },
  {
    id: 2,
    title: 'Μακαρόνια με κιμά',
    image: '/images/food.jpg',
    mealType: 'Βραδινό',
    chefName: 'Chef Kostas',
    rating: 4,
    ratingCount: 80,
  },
  {
    id: 3,
    title: 'Σαλάτα Ελληνική',
    image: '/images/food.jpg',
    mealType: 'Μεσημεριανό',
    chefName: 'Chef Kostas',
    rating: 5,
    ratingCount: 42,
  },
];

const MACROS = [
  { label: 'Ενέργεια', value: '2100kcal', color: '#4FC3F7', pct: 20 },
  { label: 'Λευκώματα', value: '85g', color: '#81C784', pct: 15 },
  { label: 'Λιπαρά', value: '70g', color: '#FFB74D', pct: 20 },
  { label: 'Πρωτεΐνες', value: '210g', color: '#F06292', pct: 25 },
  { label: 'Υδατάνθρακες', value: '310g', color: '#CE93D8', pct: 20 },
];

const StarRow = ({ rating }: { rating: number }) => (
  <div className="flex gap-[2px]">
    {Array.from({ length: 5 }).map((_, i) => (
      <svg
        key={i}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill={i < Math.round(rating) ? '#EF9F27' : 'none'}
        stroke="#EF9F27"
        strokeWidth={i < Math.round(rating) ? 0 : 1.5}
        className="h-3 w-3"
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

export default function UserHome() {
  const [sliderStart, setSliderStart] = useState(0);
  const visibleCount = 3;
  const canNext = sliderStart + visibleCount < FAKE_RECIPES.length;

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1">
        <section className="relative min-h-screen">
          {/* Full dark background */}
          <div className="absolute inset-0 bg-myGrey-200" />

          {/* White diagonal triangle — right side, matches design */}
          <div
            className="absolute inset-0 hidden bg-white md:block"
            style={{
              clipPath: 'polygon(45% 0%, 100% 0%, 100% 100%, 15% 100%)',
              zIndex: 0,
            }}
          />

          {/* All content above both layers */}
          <div className="relative z-10 mx-auto max-w-7xl px-6 py-12 md:px-12 md:py-20">
            {/* ROW 1 — nutrition card (dark side) + description text (white side) */}
            <div className="mb-12 grid grid-cols-1 gap-8 md:grid-cols-2 md:items-start">
              {/* Nutrition card — sits on dark background */}
              <div className="w-full max-w-xs rounded-2xl bg-white p-5 shadow-3xl">
                <h3 className="mb-1 text-sm font-bold text-myGrey-200 md:text-base">
                  Διατροφικά Στοιχεία
                </h3>
                <p className="mb-4 text-xs text-gray-500">
                  Παρακολουθήστε τα διατροφικά στοιχεία που καταναλώνετε την
                  τελευταία εβδομάδα, συγκεκριμένα στο γράφημα αριστερά.
                </p>
                <div className="flex items-center gap-3">
                  {/* Donut */}
                  <div className="relative flex h-24 w-24 flex-shrink-0 items-center justify-center">
                    <svg viewBox="0 0 36 36" className="h-24 w-24 -rotate-90">
                      <circle
                        cx="18"
                        cy="18"
                        r="15.9"
                        fill="none"
                        stroke="#E0E0E0"
                        strokeWidth="3.5"
                      />
                      {MACROS.map((m, i) => {
                        const offset = MACROS.slice(0, i).reduce(
                          (s, x) => s + x.pct,
                          0,
                        );
                        return (
                          <circle
                            key={m.label}
                            cx="18"
                            cy="18"
                            r="15.9"
                            fill="none"
                            stroke={m.color}
                            strokeWidth="3.5"
                            strokeDasharray={`${m.pct} ${100 - m.pct}`}
                            strokeDashoffset={-offset}
                            strokeLinecap="round"
                          />
                        );
                      })}
                    </svg>
                    <div className="absolute flex flex-col items-center">
                      <span className="text-lg font-bold text-myGrey-200">
                        7
                      </span>
                      <span className="text-xs text-gray-400">ημέρες</span>
                    </div>
                  </div>
                  {/* Legend */}
                  <ul className="flex flex-col gap-1">
                    {MACROS.map((m) => (
                      <li
                        key={m.label}
                        className="flex items-center gap-1.5 text-xs text-myGrey-200"
                      >
                        <span
                          className="h-2 w-2 flex-shrink-0 rounded-full"
                          style={{ background: m.color }}
                        />
                        <span>{m.label}</span>
                        <span className="ml-auto pl-1 text-gray-400">
                          {m.value}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Description — sits over white triangle on desktop */}
              <div className="flex flex-col gap-2 md:pl-4">
                <h2
                  className="text-xl font-bold text-white md:text-2xl md:text-myGrey-200 xl:text-3xl"
                  style={{ color: undefined }}
                >
                  <span className="text-white md:text-myGrey-200">
                    Διατροφικά Στοιχεία
                  </span>
                </h2>
                <p className="text-sm text-myGrey-100 md:text-myGrey-200">
                  Παρακολουθήστε τα διατροφικά στοιχεία που καταναλώνετε την
                  τελευταία εβδομάδα, συγκεκριμένα στο γράφημα αριστερά.
                </p>
              </div>
            </div>

            {/* ROW 2 — weekly recipes label (left) + centered slider (right) */}
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:items-center">
              {/* Left: section text */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <h2 className="text-lg font-bold text-white md:text-xl">
                    Οι συνταγές της εβδομάδας
                  </h2>
                  <Link
                    href="/user/recipes"
                    className="ml-auto rounded-full bg-myBlue-200 px-3 py-1 text-xs font-bold text-white transition hover:scale-105"
                  >
                    Σύνολο
                  </Link>
                </div>
                <p className="text-xs text-myGrey-100 md:text-sm">
                  Τα υλικά των σημερινών συνταγών είναι αυτά που τα έχεις να
                  μαγειρέψεις. Τα φρέσκα, αφού κάλλα αυτά τα χρησιμοποιείς σε
                  τελευταία διάστημα.
                </p>
                <p className="text-xs text-myBlue-100 md:text-sm">
                  Δοκίμας και πες μας τη γνώμη σου!
                </p>
                <Link
                  href="/user/recipes"
                  className="mt-2 w-fit rounded-full bg-myBlue-200 px-6 py-2 text-sm font-bold text-white transition hover:scale-105 hover:bg-myBlue-100"
                >
                  Επιλογή να μαγειρέψεις
                </Link>
              </div>

              {/* Right: recipe slider — mobile horizontal scroll, desktop fanned centered */}

              {/* Mobile */}
              <div className="flex gap-3 overflow-x-auto pb-2 md:hidden">
                {FAKE_RECIPES.map((r) => (
                  <Link
                    href="/user/recipes"
                    key={r.id}
                    className="flex w-[130px] flex-shrink-0 flex-col items-center gap-1 rounded-xl bg-white p-3 shadow-3xl transition hover:scale-105"
                  >
                    <div className="relative h-12 w-12 overflow-hidden rounded-full">
                      <Image
                        src={r.image}
                        alt={r.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <p className="text-center text-xs font-bold text-myGrey-200 leading-tight">
                      {r.title}
                    </p>
                    <p className="text-9 text-gray-400">{r.mealType}</p>
                    <StarRow rating={r.rating} />
                  </Link>
                ))}
              </div>

              {/* Desktop: fanned cards — centered using flex + absolute positioning relative to center */}
              <div
                className="relative hidden h-72 w-full md:flex md:items-center md:justify-center"
                style={{ overflow: 'visible' }}
              >
                {FAKE_RECIPES.slice(
                  sliderStart,
                  sliderStart + visibleCount,
                ).map((r, i) => {
                  const configs = [
                    { rotate: -6, x: -130, y: 14, z: 10 },
                    { rotate: 0, x: 0, y: 0, z: 20 },
                    { rotate: 6, x: 130, y: 14, z: 10 },
                  ];
                  const c = configs[i];
                  return (
                    <Link
                      href="/user/recipes"
                      key={r.id}
                      className="absolute w-44 cursor-pointer rounded-xl bg-white p-3 shadow-3xl transition duration-300 hover:scale-110"
                      style={{
                        transform: `translateX(${c.x}px) translateY(${c.y}px) rotate(${c.rotate}deg)`,
                        zIndex: c.z,
                      }}
                    >
                      <div className="relative mb-2 h-24 w-full overflow-hidden rounded-lg">
                        <Image
                          src={r.image}
                          alt={r.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <p className="text-xs font-bold text-myGrey-200 leading-tight">
                        {r.title}
                      </p>
                      <p className="text-9 text-gray-400">{r.mealType}</p>
                      <StarRow rating={r.rating} />
                      <p className="text-9 text-myBlue-200">
                        Από Chef {r.chefName}
                      </p>
                    </Link>
                  );
                })}

                {/* Arrow — outside the fanned cards to the right */}
                <button
                  onClick={() => setSliderStart(canNext ? sliderStart + 1 : 0)}
                  className="absolute right-0 top-1/2 z-30 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-3xl transition hover:bg-myBlue-100"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="#377CC3"
                    className="h-5 w-5"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.28 11.47a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 011.06-1.06l7.5 7.5z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <ScrollToTopButton />
    </div>
  );
}
