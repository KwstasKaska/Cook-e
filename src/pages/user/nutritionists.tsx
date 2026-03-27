import { useState } from 'react';
import Navbar from '../../components/Users/Navbar';

//Types
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

//Fake data
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

const CARD_COLORS = ['#EAB308', '#86EFAC', '#B3D5F8'];

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
  { id: 2, label: '10:30 - 11:30' },
  { id: 3, label: '10:30 - 11:30' },
  { id: 4, label: '10:30 - 11:30' },
  { id: 5, label: '10:30 - 11:30' },
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

//Star rating
function Stars({ rating, small = false }: { rating: number; small?: boolean }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg
          key={s}
          className={`${small ? 'w-3.5 h-3.5' : 'w-4 h-4'} ${
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

//Nutritionist card
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
      className="border-2 border-black relative rounded-2xl pt-10 pb-4 px-4 cursor-pointer hover:scale-105 transition-transform duration-200 shadow-sm"
      onClick={onClick}
    >
      {/* Avatar overlapping top */}
      <div className="absolute -top-8 left-1/2 -translate-x-1/2">
        <img
          src={nutr.avatar}
          alt={nutr.name}
          className="w-16 h-16 rounded-full object-cover border-4 border-white shadow"
        />
      </div>
      <div className="text-center">
        <p className="font-bold text-gray-800 text-sm leading-tight mb-2">
          {nutr.name}
        </p>
        <div className="flex items-center justify-center gap-1.5 text-xs text-gray-700">
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

//List view
function ListView({ onSelect }: { onSelect: (n: Nutritionist) => void }) {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0); // 0-based page, 6 per page

  const filtered = FAKE_NUTRITIONISTS.filter((n) =>
    n.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#3F4756' }}>
      <Navbar />

      {/* diagonal split */}
      <div className="relative overflow-hidden">
        <div
          className="absolute bottom-0 left-0 w-full bg-gray-100"
          style={{
            height: '72%',
            clipPath: 'polygon(0 30%, 100% 0%, 100% 100%, 0% 100%)',
          }}
        />

        <div className="relative z-10 max-w-5xl mx-auto px-6 pt-12 pb-20">
          {/* Search row */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-12">
            <h1 className="text-white text-2xl md:text-3xl font-bold">
              Αναζητήστε τον Διατροφολόγο σας:
            </h1>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Εύρεση Διατροφολόγου"
              className="bg-white text-gray-700 text-sm placeholder-gray-400 px-5 py-2.5 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-myBlue-200 w-64"
            />
          </div>

          {/* Popular heading */}
          <h2 className="text-center text-gray-800 text-2xl font-bold mb-6">
            Δημοφιλείς Διατροφολόγοι
          </h2>

          {/* White container */}
          <div className="bg-white rounded-2xl shadow-lg p-6 relative">
            {/* ΟΛΟΙ link */}
            <div className="absolute top-4 right-5">
              <button className="text-gray-500 text-sm font-semibold hover:text-gray-800 transition-colors">
                ΟΛΟΙ
              </button>
            </div>

            {/* Left arrow */}
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              className="absolute left-[-22px] top-1/2 -translate-y-1/2 w-11 h-11 rounded-full border-2 border-gray-600 bg-white flex items-center justify-center text-gray-700 hover:bg-gray-700 hover:text-white transition-colors shadow"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4"
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

            {/* Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-12 pt-8">
              {filtered.slice(0, 6).map((nutr, i) => (
                <NutrCard
                  key={nutr.id}
                  nutr={nutr}
                  colorIndex={i}
                  onClick={() => onSelect(nutr)}
                />
              ))}
            </div>

            {/* Right arrow */}
            <button
              onClick={() => setPage((p) => p + 1)}
              className="absolute right-[-22px] top-1/2 -translate-y-1/2 w-11 h-11 rounded-full border-2 border-gray-600 bg-white flex items-center justify-center text-gray-700 hover:bg-gray-700 hover:text-white transition-colors shadow"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4"
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

//Profile / booking view
function ProfileView({
  nutr,
  onBack,
}: {
  nutr: Nutritionist;
  onBack: () => void;
}) {
  const [monthIndex, setMonthIndex] = useState(7); // August = index 7
  const [selectedDay, setSelectedDay] = useState(1); // index into DAYS
  const [selectedSlot, setSelectedSlot] = useState<number | null>(2);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#3F4756' }}>
      <Navbar />

      <div className="relative overflow-hidden">
        {/* diagonal split */}
        <div
          className="absolute bottom-0 left-0 w-full bg-gray-100"
          style={{
            height: '60%',
            clipPath: 'polygon(0 35%, 100% 5%, 100% 100%, 0% 100%)',
          }}
        />

        <div className="relative z-10 max-w-4xl mx-auto px-6 pt-10 pb-20">
          {/* Back */}
          <button
            onClick={onBack}
            className="flex items-center gap-1 text-gray-300 hover:text-white text-sm mb-6 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4"
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
            Πίσω
          </button>

          {/* Name + contact */}
          <div className="flex items-start justify-between mb-4">
            <h1
              className="text-white text-3xl md:text-4xl font-bold italic"
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
            <div className="flex gap-3 flex-shrink-0 ml-4">
              <a
                href={`tel:${nutr.phone}`}
                className="w-12 h-12 rounded-full flex items-center justify-center shadow-md"
                style={{ backgroundColor: '#377CC3' }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5 text-white"
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
                className="w-12 h-12 rounded-full flex items-center justify-center shadow-md"
                style={{ backgroundColor: '#377CC3' }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5 text-white"
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

          {/* Bio */}
          <p className="text-gray-300 text-sm leading-relaxed max-w-xl mb-10">
            {nutr.bio}
          </p>

          {/* Booking section */}
          <div className="flex flex-col items-center">
            {/* Pill heading */}
            <div className="border-2 border-gray-800 bg-gray-100 rounded-full px-8 py-3 mb-6">
              <h2 className="text-gray-800 text-xl font-bold">
                Διαθέσιμες ημερομηνίες και ώρες
              </h2>
            </div>

            {/* Month navigator */}
            <div className="flex items-center gap-4 mb-6 self-start">
              <button
                onClick={() => setMonthIndex((m) => Math.max(0, m - 1))}
                className="text-gray-700 hover:text-gray-900 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
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
              <span className="text-gray-800 font-semibold text-base">
                {MONTHS[monthIndex]}
              </span>
              <button
                onClick={() => setMonthIndex((m) => Math.min(11, m + 1))}
                className="text-gray-700 hover:text-gray-900 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
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

            {/* Day pills row */}
            <div className="flex items-center gap-2 mb-6 w-full justify-center">
              {/* Left arrow */}
              <button className="w-10 h-10 rounded-full border-2 border-gray-600 flex items-center justify-center text-gray-700 hover:bg-gray-700 hover:text-white transition-colors flex-shrink-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4"
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

              <div className="flex gap-2 flex-wrap justify-center">
                {DAYS.map((day, i) => {
                  const isSelected = selectedDay === i;
                  return (
                    <button
                      key={i}
                      onClick={() => setSelectedDay(i)}
                      className="flex flex-col items-center justify-center w-14 h-16 rounded-2xl border-2 font-bold text-sm transition-all duration-150"
                      style={{
                        backgroundColor: isSelected ? '#B3D5F8' : 'white',
                        borderColor: isSelected ? '#377CC3' : '#D1D5DB',
                        color: '#3F4756',
                      }}
                    >
                      <span className="text-xs">{day.short}</span>
                      <span className="text-lg leading-tight">{day.num}</span>
                    </button>
                  );
                })}
              </div>

              {/* Right arrow */}
              <button className="w-10 h-10 rounded-full border-2 border-gray-600 flex items-center justify-center text-gray-700 hover:bg-gray-700 hover:text-white transition-colors flex-shrink-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4"
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

            {/* Time slot pills */}
            <div className="flex flex-wrap gap-3 justify-center mb-8">
              {FAKE_SLOTS.map((slot) => {
                const isSelected = selectedSlot === slot.id;
                return (
                  <button
                    key={slot.id}
                    onClick={() => setSelectedSlot(slot.id)}
                    className="px-5 py-2.5 rounded-full border-2 text-sm font-semibold transition-all duration-150"
                    style={{
                      backgroundColor: isSelected ? '#B3D5F8' : 'white',
                      borderColor: isSelected ? '#377CC3' : '#3F4756',
                      color: '#3F4756',
                    }}
                  >
                    {slot.label}
                  </button>
                );
              })}
            </div>

            {/* CTA */}
            <button
              className="px-12 py-3.5 rounded-full text-white font-bold text-base shadow-lg hover:opacity-90 transition-opacity"
              style={{ backgroundColor: '#377CC3' }}
              onClick={() => {
                // TODO: GraphQL mutation — book appointment
                alert('Η επίσκεψη προγραμματίστηκε!');
              }}
            >
              Προγραμματισμός Επίσκεψης
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
