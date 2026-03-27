import React, { useState } from 'react';
import Image from 'next/image';
import ChefNavbar from '../../components/Chef/ChefNavbar';
import Footer from '../../components/Users/Footer';

// ─── Types ────────────────────────────────────────────────────────────────────
interface RecipeItem {
  id: number;
  title: string;
  image: string;
}

// ─── Fake data ────────────────────────────────────────────────────────────────
const FAKE_PROFILE = {
  name: 'Κασκαντίρης',
  surname: 'Κωσνταντίνος',
  email: 'kwstas@kwstas.com',
  //   avatar: '/images/chef-avatar.jpg',
  bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore',
  recipesCount: 15,
  followersCount: 150,
  articlesCount: 20,
  rating: 4.9,
  ratingTotal: 25,
};

const FAKE_RECIPES: RecipeItem[] = Array.from({ length: 8 }, (_, i) => ({
  id: i + 1,
  title: 'Η διατροφή στις μέρες μας, υπάρχει εύκολη λύση;',
  image: '/images/food.jpg',
}));

const FAKE_RATING_BREAKDOWN = [
  { stars: 5, pct: 80 },
  { stars: 4, pct: 65 },
  { stars: 3, pct: 45 },
  { stars: 2, pct: 35 },
  { stars: 1, pct: 50 },
];

// ─── Star component ─────────────────────────────────────────────────────────────
const Stars = ({
  rating,
  size = 'md',
}: {
  rating: number;
  size?: 'sm' | 'md' | 'lg';
}) => {
  const sz =
    size === 'lg' ? 'h-6 w-6' : size === 'md' ? 'h-5 w-5' : 'h-3.5 w-3.5';
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

// ─── Rating modal ─────────────────────────────────────────────────────────────
const RatingModal = ({ onClose }: { onClose: () => void }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center">
    {/* Backdrop */}
    <div className="absolute inset-0 bg-black/40" onClick={onClose} />

    {/* Modal card */}
    <div className="relative z-10 w-full max-w-sm rounded-2xl bg-white p-8 shadow-2xl mx-4">
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
          <Stars rating={FAKE_PROFILE.rating} size="md" />
          <span className="font-bold text-gray-700">
            {FAKE_PROFILE.rating}/ 5
          </span>
        </div>
      </div>
      <p className="mb-6 text-center text-sm text-gray-400">
        {FAKE_PROFILE.ratingTotal} Αξιολογήσεις χρηστών
      </p>

      {/* Breakdown bars */}
      <div className="flex flex-col gap-4">
        {FAKE_RATING_BREAKDOWN.map((row) => (
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
  </div>
);

// ─── Main page ─────────────────────────────────────────────────────────────────
export default function ChefProfile() {
  const [showRatingModal, setShowRatingModal] = useState(false);

  return (
    <div
      className="flex min-h-screen flex-col"
      style={{ backgroundColor: '#3F4756' }}
    >
      <ChefNavbar />

      {showRatingModal && (
        <RatingModal onClose={() => setShowRatingModal(false)} />
      )}

      <main className="flex flex-1 flex-col items-center px-4 py-8 md:px-8">
        {/* Page title */}
        <h1
          className="mb-6 text-3xl italic"
          style={{
            color: 'rgba(255,255,255,0.85)',
            fontFamily: 'Georgia, serif',
          }}
        >
          Το <em>προφίλ μου</em>
        </h1>

        {/* Profile card */}
        <div
          className="w-full max-w-3xl rounded-2xl p-6 md:p-8"
          style={{ backgroundColor: '#E9DEC5' }}
        >
          {/* Top row: contact + avatar + rating */}
          <div className="flex flex-col items-center gap-6 md:flex-row md:items-start md:justify-between">
            {/* Contact */}
            <div>
              <p
                className="mb-2 text-sm font-semibold"
                style={{ color: '#3F4756' }}
              >
                Επικοινωνία
              </p>
              <div
                className="flex items-center gap-2 rounded-full border border-gray-400 px-3 py-1.5 text-sm"
                style={{ color: '#3F4756' }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="h-4 w-4 flex-shrink-0"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                  />
                </svg>
                Email: {FAKE_PROFILE.email}
              </div>
            </div>

            {/* Avatar */}
            <div className="flex flex-col items-center">
              <div
                className="relative h-24 w-24 overflow-hidden rounded-full border-4 shadow-lg"
                style={{ borderColor: '#3F4756' }}
              >
                {/* <Image
                  src={FAKE_PROFILE.avatar}
                  alt="Avatar"
                  fill
                  className="object-cover object-top"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://api.dicebear.com/7.x/initials/svg?seed=KK';
                  }}
                /> */}
              </div>
            </div>

            {/* Rating */}
            <div className="flex flex-col items-center md:items-end">
              <p
                className="mb-2 text-sm font-semibold"
                style={{ color: '#3F4756' }}
              >
                Αξιολόγηση Χρηστών
              </p>
              <button
                onClick={() => setShowRatingModal(true)}
                className="flex items-center gap-2 rounded-full border-2 border-gray-400 px-3 py-1.5 transition hover:border-yellow-400"
              >
                <Stars rating={FAKE_PROFILE.rating} size="sm" />
                <span
                  className="text-sm font-bold"
                  style={{ color: '#3F4756' }}
                >
                  {FAKE_PROFILE.rating}/ 5
                </span>
              </button>
              <p className="mt-1 text-xs text-gray-500">
                {FAKE_PROFILE.ratingTotal} Αξιολογήσεις χρηστών
              </p>
            </div>
          </div>

          {/* Name + bio */}
          <div className="mt-6 text-center">
            <h2
              className="text-2xl font-bold"
              style={{ fontFamily: 'Georgia, serif', color: '#3F4756' }}
            >
              <em>{FAKE_PROFILE.name}</em> {FAKE_PROFILE.surname}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-gray-600 max-w-md mx-auto">
              {FAKE_PROFILE.bio}
            </p>
          </div>

          {/* Stats row */}
          <div className="mt-6 flex items-center justify-center divide-x divide-gray-400">
            {[
              { label: 'Συνταγές', value: FAKE_PROFILE.recipesCount },
              { label: 'Ακόλουθοι', value: FAKE_PROFILE.followersCount },
              { label: 'Άρθρα', value: FAKE_PROFILE.articlesCount },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col items-center px-8">
                <span className="text-sm text-gray-500">{stat.label}</span>
                <span
                  className="text-2xl font-bold"
                  style={{ color: '#3F4756' }}
                >
                  {stat.value}
                </span>
              </div>
            ))}
          </div>

          {/* Recipe grid */}
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {FAKE_RECIPES.map((recipe) => (
              <div
                key={recipe.id}
                className="cursor-pointer overflow-hidden rounded-xl transition hover:scale-105 hover:shadow-lg"
                style={{ backgroundColor: '#B3D5F8' }}
              >
                <div className="relative h-28 w-full overflow-hidden">
                  <Image
                    src={recipe.image}
                    alt={recipe.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-2">
                  <p
                    className="text-xs font-semibold leading-tight"
                    style={{ color: '#3F4756' }}
                  >
                    {recipe.title}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Περισσότερα */}
          <div className="mt-6 flex justify-center">
            <button
              className="rounded-full px-10 py-3 text-sm font-bold transition hover:opacity-90"
              style={{ backgroundColor: '#B3D5F8', color: '#3F4756' }}
            >
              Περισσότερα
            </button>
          </div>
        </div>
      </main>

      <Footer></Footer>
    </div>
  );
}
