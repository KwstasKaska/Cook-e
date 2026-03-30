import { useState } from 'react';
import Navbar from '../../components/Users/Navbar';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

// Types
export type Nutritionist = {
  id: number;
  name: string;
  city: string;
  rating: number;
  ratingCount: number;
  bio: string;
  phone: string;
  email: string;
  avatar: string;
};

export type TimeSlot = {
  id: number;
  label: string;
};

// Fake data
const FAKE_NUTRITIONISTS: Nutritionist[] = Array.from(
  { length: 6 },
  (_, i) => ({
    id: i + 1,
    name: 'Dr. Κασκαντίρης Κωνσταντίνος',
    city: 'Αθήνα',
    rating: 4.9,
    ratingCount: 30,
    bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Mauris nunc congue nisi vitae suscipit tellus mauris. Semper risus in hendrerit gravida rutrum quisque non tellus.',
    phone: '+30 210 0000000',
    email: 'dr.kaskantires@example.com',
    avatar: `https://randomuser.me/api/portraits/men/${30 + i}.jpg`,
  }),
);

const DAYS = [
  { short: 'Δευ', num: 23 },
  { short: 'Τρι', num: 24 },
  { short: 'Τετ', num: 25 },
  { short: 'Πεμ', num: 26 },
  { short: 'Παρ', num: 27 },
  { short: 'Σαβ', num: 28 },
  { short: 'Κυρ', num: 29 },
];

const FAKE_SLOTS: TimeSlot[] = [
  { id: 1, label: '10:30 - 11:30' },
  { id: 2, label: '11:30 - 12:30' },
  { id: 3, label: '13:00 - 14:00' },
  { id: 4, label: '15:00 - 16:00' },
  { id: 5, label: '17:00 - 18:00' },
];

const MONTHS = [
  'Ιανουάριος',
  'Φεβρουάριος',
  'Μάρτιος',
  'Απρίλιος',
  'Μάιος',
  'Ιούνιος',
  'Ιούλιος',
  'Αύγουστος',
  'Σεπτέμβριος',
  'Οκτώβριος',
  'Νοέμβριος',
  'Δεκέμβριος',
];

export async function getServerSideProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}

// Star rating
function Stars({ rating, small = false }: { rating: number; small?: boolean }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg
          key={s}
          className={`${small ? 'h-3.5 w-3.5' : 'h-4 w-4'} ${
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

// Nutritionist card
function NutrCard({
  nutr,
  onClick,
}: {
  nutr: Nutritionist;
  colorIndex: number;
  onClick: () => void;
}) {
  return (
    <div
      className="relative cursor-pointer rounded-2xl border-2 border-black px-4 pb-4 pt-10 shadow-sm transition-transform duration-200 hover:scale-105"
      onClick={onClick}
    >
      {/* Avatar overlapping top */}
      <div className="absolute -top-8 left-1/2 -translate-x-1/2">
        <img
          src={nutr.avatar}
          alt={nutr.name}
          className="h-16 w-16 rounded-full border-4 border-white object-cover shadow"
        />
      </div>
      <div className="text-center">
        <p className="mb-2 text-sm font-bold leading-tight text-gray-800">
          {nutr.name}
        </p>
        {/* FIX: stack on mobile, row on sm+ to prevent overflow */}
        <div className="flex flex-col items-center gap-1 text-xs text-gray-700 sm:flex-row sm:justify-center sm:gap-1.5">
          <span>{nutr.city}</span>
          <Stars rating={nutr.rating} small />
          <span className="font-semibold">
            {nutr.rating}/ 5 ({nutr.ratingCount})
          </span>
        </div>
      </div>
    </div>
  );
}

function ListView({ onSelect }: { onSelect: (n: Nutritionist) => void }) {
  const { t } = useTranslation('common');
  const [search, setSearch] = useState('');
  const [_page, setPage] = useState(0);

  const filtered = FAKE_NUTRITIONISTS.filter((n) =>
    n.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#3F4756' }}>
      <Navbar />
      <div className="flex flex-col" style={{ backgroundColor: '#3F4756' }}>
        <div className="relative z-10 mx-auto w-full max-w-5xl px-6 pb-20 pt-12">
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <h1 className="text-2xl font-bold text-white md:text-3xl">
              {t('nutritionists.searchTitle')}
            </h1>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('nutritionists.searchPlaceholder')}
              className="w-full rounded-full border border-gray-200 bg-white px-5 py-2.5 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-myBlue-200 md:w-64"
            />
          </div>

          <h2 className="mb-6 text-center text-2xl font-bold text-white">
            {t('nutritionists.popularTitle')}
          </h2>

          <div className="relative mx-auto md:px-8">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              className="absolute left-0 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white bg-transparent text-white shadow transition-colors hover:bg-white hover:text-gray-700 md:flex"
              aria-label="Προηγούμενη σελίδα"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
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

            <div className="rounded-2xl bg-white px-4 pb-8 pt-2 shadow-lg">
              <div className="flex justify-end pr-1 pt-3 pb-1">
                <button className="text-sm font-semibold text-gray-500 transition-colors hover:text-gray-800">
                  {t('nutritionists.showAll')}
                </button>
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-14 pt-6 md:grid-cols-3">
                {filtered.slice(0, 6).map((nutr, i) => (
                  <NutrCard
                    key={nutr.id}
                    nutr={nutr}
                    colorIndex={i}
                    onClick={() => onSelect(nutr)}
                  />
                ))}
              </div>
            </div>

            <button
              onClick={() => setPage((p) => p + 1)}
              className="absolute right-0 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white bg-transparent text-white shadow transition-colors hover:bg-white hover:text-gray-700 md:flex"
              aria-label="Επόμενη σελίδα"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
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
          </div>

          <div className="mt-6 flex justify-center gap-4 md:hidden">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white text-white transition-colors hover:bg-white hover:text-gray-700"
              aria-label="Προηγούμενη σελίδα"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
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
            <button
              onClick={() => setPage((p) => p + 1)}
              className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white text-white transition-colors hover:bg-white hover:text-gray-700"
              aria-label="Επόμενη σελίδα"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
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
          </div>
        </div>
      </div>
    </div>
  );
}

function ProfileView({
  nutr,
  onBack,
}: {
  nutr: Nutritionist;
  onBack: () => void;
}) {
  const { t } = useTranslation('common');
  const [monthIndex, setMonthIndex] = useState(7);
  const [selectedDay, setSelectedDay] = useState(1);
  const [selectedSlot, setSelectedSlot] = useState<number | null>(2);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#3F4756' }}>
      <Navbar />
      <div className="relative overflow-hidden">
        <div
          className="absolute bottom-0 left-0 w-full bg-gray-100"
          style={{
            height: '60%',
            clipPath: 'polygon(0 35%, 100% 5%, 100% 100%, 0% 100%)',
          }}
        />
        <div className="relative z-10 mx-auto max-w-4xl px-6 pb-20 pt-10">
          <button
            onClick={onBack}
            className="mb-6 flex items-center gap-1 text-sm text-gray-300 transition-colors hover:text-white"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19l-7-7 7-7"
              />
            </svg>
            {t('nutritionists.back')}
          </button>

          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <h1
              className="text-2xl font-bold italic text-white md:text-4xl"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              {nutr.name
                .split(' ')
                .map((word, i) =>
                  i === 1 ? (
                    <em key={i}>{word} </em>
                  ) : (
                    <span key={i}>{word} </span>
                  ),
                )}
            </h1>
            <div className="flex gap-3 sm:ml-4 sm:flex-shrink-0">
              <a
                href={`tel:${nutr.phone}`}
                className="flex h-12 w-12 items-center justify-center rounded-full shadow-md"
                style={{ backgroundColor: '#377CC3' }}
                aria-label="Κλήση"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
              </a>
              <a
                href={`mailto:${nutr.email}`}
                className="flex h-12 w-12 items-center justify-center rounded-full shadow-md"
                style={{ backgroundColor: '#377CC3' }}
                aria-label="Αποστολή email"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </a>
            </div>
          </div>

          <p className="mb-10 max-w-xl text-sm leading-relaxed text-gray-300">
            {nutr.bio}
          </p>

          <div className="flex flex-col items-center">
            <div className="mb-6 rounded-full border-2 border-gray-800 bg-gray-100 px-6 py-3">
              <h2 className="text-center text-lg font-bold text-gray-800 md:text-xl">
                {t('nutritionists.availableTimes')}
              </h2>
            </div>

            <div className="mb-6 flex items-center gap-4 self-start">
              <button
                onClick={() => setMonthIndex((m) => Math.max(0, m - 1))}
                className="text-white transition-colors hover:text-gray-900"
                aria-label="Προηγούμενος μήνας"
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
              <span className="text-base font-semibold text-white">
                {MONTHS[monthIndex]}
              </span>
              <button
                onClick={() => setMonthIndex((m) => Math.min(11, m + 1))}
                className="text-white transition-colors hover:text-gray-900"
                aria-label="Επόμενος μήνας"
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
            </div>

            <div className="mb-6 flex w-full items-center justify-center gap-2">
              <button
                className="hidden h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border-2 border-gray-600 text-gray-700 transition-colors hover:bg-gray-700 hover:text-white sm:flex"
                aria-label="Προηγούμενες ημέρες"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
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
              <div className="flex gap-2 overflow-x-auto pb-1 sm:flex-wrap sm:justify-center sm:overflow-visible sm:pb-0">
                {DAYS.map((day, i) => {
                  const isSelected = selectedDay === i;
                  return (
                    <button
                      key={i}
                      onClick={() => setSelectedDay(i)}
                      className="flex h-16 w-14 flex-shrink-0 flex-col items-center justify-center rounded-2xl border-2 text-sm font-bold transition-all duration-150"
                      style={{
                        backgroundColor: isSelected ? '#B3D5F8' : 'white',
                        borderColor: isSelected ? '#377CC3' : '#D1D5DB',
                        color: '#3F4756',
                      }}
                      aria-pressed={isSelected}
                      aria-label={`${day.short} ${day.num}`}
                    >
                      <span className="text-xs">{day.short}</span>
                      <span className="text-lg leading-tight">{day.num}</span>
                    </button>
                  );
                })}
              </div>
              <button
                className="hidden h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border-2 border-gray-600 text-gray-700 transition-colors hover:bg-gray-700 hover:text-white sm:flex"
                aria-label="Επόμενες ημέρες"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
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
            </div>

            <div className="mb-8 flex flex-wrap justify-center gap-3">
              {FAKE_SLOTS.map((slot) => {
                const isSelected = selectedSlot === slot.id;
                return (
                  <button
                    key={slot.id}
                    onClick={() => setSelectedSlot(slot.id)}
                    className="rounded-full border-2 px-5 py-2.5 text-sm font-semibold transition-all duration-150"
                    style={{
                      backgroundColor: isSelected ? '#B3D5F8' : 'white',
                      borderColor: isSelected ? '#377CC3' : '#3F4756',
                      color: '#3F4756',
                    }}
                    aria-pressed={isSelected}
                  >
                    {slot.label}
                  </button>
                );
              })}
            </div>

            <button
              className="rounded-full px-12 py-3.5 text-base font-bold text-white shadow-lg transition-opacity hover:opacity-90"
              style={{ backgroundColor: '#377CC3' }}
              onClick={() => alert('Η επίσκεψη προγραμματίστηκε!')}
            >
              {t('nutritionists.bookAppointment')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
// Main page
export default function NutritionistsPage() {
  const [selected, setSelected] = useState<Nutritionist | null>(null);

  if (selected) {
    return <ProfileView nutr={selected} onBack={() => setSelected(null)} />;
  }

  return <ListView onSelect={setSelected} />;
}
