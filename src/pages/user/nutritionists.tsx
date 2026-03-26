import React, { useState } from 'react';
import Image, { StaticImageData } from 'next/image';
import Navbar from '../../components/Users/Navbar';

import ScrollToTopButton from '../../components/Helper/ScrollToTopButton';

// ─── Types ────────────────────────────────────────────────────────────────────
interface NutrCard {
  id: number;
  name: string;
  image: StaticImageData | string;
  city: string;
  rating: number;
  ratingCount: number;
  cardColor: 'yellow' | 'green' | 'blue';
}
interface TimeSlot {
  id: number;
  time: string;
  isAvailable: boolean;
}
interface DaySlots {
  label: string;
  slots: TimeSlot[];
}

// ─── Fake data ────────────────────────────────────────────────────────────────
const NUTRITIONISTS: NutrCard[] = [
  {
    id: 1,
    name: 'Dr. Κωνσταντίνος Κωνσταντίνος',
    image: '/images/myphoto.jpg',
    city: 'Αθήνα',
    rating: 4.5,
    ratingCount: 100,
    cardColor: 'yellow',
  },
  {
    id: 2,
    name: 'Dr. Κωνσταντίνος Κωνσταντίνος',
    image: '/images/myphoto.jpg',
    city: 'Αθήνα',
    rating: 4,
    ratingCount: 80,
    cardColor: 'green',
  },
  {
    id: 3,
    name: 'Dr. Κωνσταντίνος Κωνσταντίνος',
    image: '/images/myphoto.jpg',
    city: 'Αθήνα',
    rating: 3.5,
    ratingCount: 60,
    cardColor: 'blue',
  },
  {
    id: 4,
    name: 'Dr. Κωνσταντίνος Κωνσταντίνος',
    image: '/images/myphoto.jpg',
    city: 'Αθήνα',
    rating: 5,
    ratingCount: 120,
    cardColor: 'yellow',
  },
  {
    id: 5,
    name: 'Dr. Κωνσταντίνος Κωνσταντίνος',
    image: '/images/myphoto.jpg',
    city: 'Αθήνα',
    rating: 4.5,
    ratingCount: 90,
    cardColor: 'green',
  },
  {
    id: 6,
    name: 'Dr. Κωνσταντίνος Κωνσταντίνος',
    image: '/images/myphoto.jpg',
    city: 'Αθήνα',
    rating: 4,
    ratingCount: 70,
    cardColor: 'blue',
  },
];

const WEEK_DAYS: DaySlots[] = [
  {
    label: 'Δευ 23',
    slots: [
      { id: 1, time: '10:30 - 11:30', isAvailable: true },
      { id: 2, time: '11:30 - 12:30', isAvailable: false },
    ],
  },
  {
    label: 'Τρι 24',
    slots: [
      { id: 3, time: '10:30 - 11:30', isAvailable: true },
      { id: 4, time: '14:00 - 15:00', isAvailable: true },
    ],
  },
  {
    label: 'Τετ 25',
    slots: [
      { id: 5, time: '10:30 - 11:30', isAvailable: false },
      { id: 6, time: '16:00 - 17:00', isAvailable: true },
    ],
  },
  {
    label: 'Παρ 26',
    slots: [{ id: 7, time: '10:30 - 11:30', isAvailable: true }],
  },
  {
    label: 'Παρ 27',
    slots: [{ id: 8, time: '10:30 - 11:30', isAvailable: true }],
  },
  { label: 'Σαβ 28', slots: [] },
  { label: 'Κυρ 29', slots: [] },
];

// ─── Star row ─────────────────────────────────────────────────────────────────
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

const COLOR_MAP = {
  yellow: 'bg-yellow-400',
  green: 'bg-green-400',
  blue: 'bg-myBlue-100',
};

// ─── Grid view ────────────────────────────────────────────────────────────────
const NutrGrid = ({ onSelect }: { onSelect: (id: number) => void }) => {
  const [query, setQuery] = useState('');
  const filtered = NUTRITIONISTS.filter(
    (n) =>
      n.name.toLowerCase().includes(query.toLowerCase()) ||
      n.city.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div className="container mx-auto py-14">
      {/* Top bar */}
      <div className="mb-8 flex flex-col items-center justify-between gap-4 md:flex-row">
        <h2 className="text-xl font-bold text-white md:text-2xl xl:text-3xl">
          Αναζητήστε τον Διατροφολόγο σας:
        </h2>
        <div className="flex w-full max-w-xs items-center gap-2 rounded-full border border-white border-opacity-20 bg-white bg-opacity-10 px-4 py-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="white"
            className="h-4 w-4 flex-shrink-0"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
            />
          </svg>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Αναζήτηση..."
            className="w-full border-none bg-transparent text-sm text-white placeholder-white placeholder-opacity-60 focus:outline-none"
          />
        </div>
      </div>

      <h3 className="mb-6 text-base font-bold text-white md:text-lg">
        Δημοφιλείς Διατροφολόγοι
      </h3>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {filtered.map((n) => (
          <div
            key={n.id}
            onClick={() => onSelect(n.id)}
            className="cursor-pointer overflow-hidden rounded-2xl bg-white shadow-3xl transition duration-300 hover:scale-105"
          >
            <div className={`h-2 w-full ${COLOR_MAP[n.cardColor]}`} />
            <div className="flex flex-col items-center gap-2 p-3">
              <div className="relative h-14 w-14 overflow-hidden rounded-full border-2 border-myGrey-100">
                <Image
                  src={n.image}
                  alt={n.name}
                  fill
                  className="object-cover object-top"
                />
              </div>
              <p className="text-center text-xs font-bold text-myGrey-200 leading-tight md:text-sm">
                {n.name}
              </p>
              <p className="text-9 text-gray-400">{n.city}</p>
              <StarRow rating={n.rating} />
              <p className="text-9 text-gray-400">
                {n.rating}/5 ({n.ratingCount})
              </p>
            </div>
          </div>
        ))}
      </div>
      {filtered.length === 0 && (
        <p className="mt-10 text-center text-myGrey-100">
          Δεν βρέθηκαν αποτελέσματα.
        </p>
      )}
    </div>
  );
};

// ─── Profile / booking view ───────────────────────────────────────────────────
const NutrProfile = ({
  nutr,
  onBack,
}: {
  nutr: NutrCard;
  onBack: () => void;
}) => {
  const [activeDayIdx, setActiveDayIdx] = useState(1);
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [dayOffset, setDayOffset] = useState(0);
  const visibleDays = 7;
  const visibleWeek = WEEK_DAYS.slice(dayOffset, dayOffset + visibleDays);

  return (
    <div className="container mx-auto max-w-3xl py-14">
      <button
        onClick={onBack}
        className="mb-6 flex items-center gap-2 text-sm font-bold text-myBlue-100 hover:text-white transition"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="h-4 w-4"
        >
          <path
            fillRule="evenodd"
            d="M7.72 12.53a.75.75 0 010-1.06l7.5-7.5a.75.75 0 111.06 1.06L9.31 12l6.97 6.97a.75.75 0 11-1.06 1.06l-7.5-7.5z"
            clipRule="evenodd"
          />
        </svg>
        Πίσω
      </button>

      {/* Profile header */}
      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-[auto_1fr_auto] md:items-start">
        <div className="relative mx-auto h-20 w-20 overflow-hidden rounded-full border-2 border-myBlue-100 md:mx-0">
          <Image
            src={nutr.image}
            alt={nutr.name}
            fill
            className="object-cover object-top"
          />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white md:text-3xl">
            {nutr.name}
          </h2>
          <p className="mt-2 text-sm text-myGrey-100 md:text-base">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Mauris
            nunc congue nisi vitae suscipit tellus mauris. Semper risus in
            hendrerit gravida rutrum quisque non tellus.
          </p>
        </div>
        <div className="flex justify-center gap-2 md:justify-start">
          <button className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-myBlue-100 text-myBlue-100 hover:bg-myBlue-200 hover:border-myBlue-200 hover:text-white transition">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-5 w-5"
            >
              <path d="M1.5 4.5a3 3 0 013-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 01-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 006.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 011.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 01-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5z" />
            </svg>
          </button>
          <button className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-myBlue-200 bg-myBlue-200 text-white hover:bg-myBlue-100 transition">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-5 w-5"
            >
              <path d="M4.913 2.658c2.075-.27 4.19-.408 6.337-.408 2.147 0 4.262.139 6.337.408 1.922.25 3.291 1.861 3.405 3.727a4.403 4.403 0 00-1.032-.211 50.89 50.89 0 00-8.42 0c-2.358.196-4.04 2.19-4.04 4.434v4.286a4.47 4.47 0 002.433 3.984L7.28 21.53A.75.75 0 016 21v-4.03a48.527 48.527 0 01-1.087-.128C2.905 16.58 1.5 14.833 1.5 12.862V6.638c0-1.97 1.405-3.718 3.413-3.979z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Slots card */}
      <div className="rounded-2xl bg-white p-5 shadow-3xl">
        <h3 className="mb-4 text-center text-base font-bold text-myGrey-200 md:text-lg">
          Διαθέσιμες ημερομηνίες και ώρες
        </h3>

        {/* Month nav */}
        <div className="mb-4 flex items-center justify-center gap-3">
          <button
            onClick={() => setDayOffset((d) => Math.max(d - 1, 0))}
            className="flex h-7 w-7 items-center justify-center rounded-full border border-myGrey-100 text-myGrey-200 hover:bg-myBlue-200 hover:text-white transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-4 w-4"
            >
              <path
                fillRule="evenodd"
                d="M7.72 12.53a.75.75 0 010-1.06l7.5-7.5a.75.75 0 111.06 1.06L9.31 12l6.97 6.97a.75.75 0 11-1.06 1.06l-7.5-7.5z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          <span className="text-sm font-bold text-myGrey-200">Αύγουστος</span>
          <button
            onClick={() =>
              setDayOffset((d) =>
                Math.min(d + 1, Math.max(WEEK_DAYS.length - visibleDays, 0)),
              )
            }
            className="flex h-7 w-7 items-center justify-center rounded-full border border-myGrey-100 text-myGrey-200 hover:bg-myBlue-200 hover:text-white transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-4 w-4"
            >
              <path
                fillRule="evenodd"
                d="M16.28 11.47a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 011.06-1.06l7.5 7.5z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        {/* Day strip */}
        <div className="mb-5 flex gap-1 overflow-x-auto">
          {visibleWeek.map((day, i) => {
            const realIdx = dayOffset + i;
            const isActive = realIdx === activeDayIdx;
            return (
              <button
                key={i}
                onClick={() => {
                  setActiveDayIdx(realIdx);
                  setSelectedSlot(null);
                }}
                className={`flex min-w-[2.8rem] flex-1 flex-col items-center rounded-xl py-2 text-xs font-bold transition md:text-sm ${
                  isActive
                    ? 'bg-myBlue-200 text-white'
                    : 'bg-myGrey-100 text-myGrey-200 hover:bg-myBlue-100'
                }`}
              >
                {day.label.split(' ').map((part, pi) => (
                  <span key={pi}>{part}</span>
                ))}
              </button>
            );
          })}
        </div>

        {/* Time slots */}
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
          {WEEK_DAYS[activeDayIdx]?.slots.map((slot) => (
            <button
              key={slot.id}
              disabled={!slot.isAvailable}
              onClick={() => setSelectedSlot(slot.id)}
              className={`rounded-full py-2 text-xs font-medium transition md:text-sm ${
                !slot.isAvailable
                  ? 'cursor-not-allowed bg-myGrey-100 text-gray-400 line-through opacity-50'
                  : selectedSlot === slot.id
                    ? 'bg-myBlue-200 text-white ring-2 ring-myBlue-100'
                    : 'bg-myGrey-100 text-myGrey-200 hover:bg-myBlue-100'
              }`}
            >
              {slot.time}
            </button>
          ))}
          {WEEK_DAYS[activeDayIdx]?.slots.length === 0 && (
            <p className="col-span-4 text-center text-sm text-gray-400">
              Δεν υπάρχουν διαθέσιμες ώρες.
            </p>
          )}
        </div>

        <button
          disabled={!selectedSlot}
          onClick={() =>
            selectedSlot && alert(`Κλείσατε ραντεβού! Slot: ${selectedSlot}`)
          }
          className={`mt-6 w-full rounded-full py-3 text-sm font-bold transition md:text-base ${
            selectedSlot
              ? 'bg-myBlue-200 text-white hover:scale-105 hover:bg-myBlue-100'
              : 'cursor-not-allowed bg-myGrey-100 text-gray-400'
          }`}
        >
          Προγραμματισμός Επίσκεψης
        </button>
      </div>
    </div>
  );
};

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function NutritionistsPage() {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const selected = NUTRITIONISTS.find((n) => n.id === selectedId) ?? null;

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 bg-myGrey-200">
        {!selected ? (
          <NutrGrid onSelect={setSelectedId} />
        ) : (
          <NutrProfile nutr={selected} onBack={() => setSelectedId(null)} />
        )}
      </main>

      <ScrollToTopButton />
    </div>
  );
}
