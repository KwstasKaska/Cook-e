import { useState } from 'react';
import Navbar from '../../components/Users/Navbar';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import {
  useNutritionistsQuery,
  useAvailableSlotsQuery,
  useRequestAppointmentMutation,
} from '../../generated/graphql';
import useIsUser from '../../utils/useIsUser';

// ── Types
type SelectedNutritionist = {
  id: number;
  username: string;
  email: string;
  bio?: string | null;
  phone?: string | null;
  city?: string | null;
};

export async function getServerSideProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}

export default function NutritionistsPage() {
  const { loading: authLoading, isAuthorized } = useIsUser();
  if (authLoading || !isAuthorized) return null;

  return <NutritionistsContent />;
}

function NutritionistsContent() {
  const [selected, setSelected] = useState<SelectedNutritionist | null>(null);

  if (selected) {
    return <ProfileView nutr={selected} onBack={() => setSelected(null)} />;
  }

  return <ListView onSelect={setSelected} />;
}

// ── List view
function ListView({
  onSelect,
}: {
  onSelect: (n: SelectedNutritionist) => void;
}) {
  const { t } = useTranslation('common');
  const [search, setSearch] = useState('');

  const { data, loading } = useNutritionistsQuery({
    variables: { limit: 50, offset: 0 },
    fetchPolicy: 'network-only',
  });

  const nutritionists = data?.nutritionists ?? [];

  const filtered = nutritionists.filter((n) =>
    (n.user?.username ?? '').toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#3F4756' }}>
      <Navbar />
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

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-myBlue-200 border-t-transparent" />
          </div>
        ) : (
          <div className="relative mx-auto md:px-8">
            <div className="rounded-2xl bg-white px-4 pb-8 pt-2 shadow-lg">
              <div className="flex justify-end pr-1 pt-3 pb-1">
                <span className="text-sm text-gray-400">
                  {filtered.length} {t('nutritionists.showAll')}
                </span>
              </div>
              {filtered.length === 0 ? (
                <div className="py-12 text-center text-gray-400 text-sm">
                  {t('nutritionists.noResults')}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-x-4 gap-y-14 pt-6 md:grid-cols-3">
                  {filtered.map((nutr) => (
                    <NutrCard
                      key={nutr.id}
                      id={nutr.id}
                      username={nutr.user?.username ?? '—'}
                      city={nutr.city}
                      onClick={() =>
                        onSelect({
                          id: nutr.id,
                          username: nutr.user?.username ?? '—',
                          email: nutr.user?.email ?? '',
                          bio: nutr.bio,
                          phone: nutr.phone,
                          city: nutr.city,
                        })
                      }
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Nutritionist card
function NutrCard({
  id,
  username,
  city,
  onClick,
}: {
  id: number;
  username: string;
  city?: string | null;
  onClick: () => void;
}) {
  const avatarUrl = `https://randomuser.me/api/portraits/men/${
    30 + (id % 20)
  }.jpg`;

  return (
    <div
      className="relative cursor-pointer rounded-2xl border-2 border-black px-4 pb-4 pt-10 shadow-sm transition-transform duration-200 hover:scale-105"
      onClick={onClick}
    >
      <div className="absolute -top-8 left-1/2 -translate-x-1/2">
        <img
          src={avatarUrl}
          alt={username}
          className="h-16 w-16 rounded-full border-4 border-white object-cover shadow"
        />
      </div>
      <div className="text-center">
        <p className="mb-1 text-sm font-bold leading-tight text-gray-800">
          {username}
        </p>
        {city && <p className="text-xs text-gray-500">{city}</p>}
      </div>
    </div>
  );
}

// ── Profile view
function ProfileView({
  nutr,
  onBack,
}: {
  nutr: SelectedNutritionist;
  onBack: () => void;
}) {
  const { t } = useTranslation('common');
  const { locale } = useRouter();
  const isEl = locale === 'el';

  const [monthIndex, setMonthIndex] = useState(new Date().getMonth());
  const [selectedSlotId, setSelectedSlotId] = useState<number | null>(null);
  const [serverError, setServerError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const { data: slotsData, loading: slotsLoading } = useAvailableSlotsQuery({
    variables: { nutritionistId: nutr.id },
    fetchPolicy: 'network-only',
  });

  const [requestAppointment, { loading: requesting }] =
    useRequestAppointmentMutation();

  const availableSlots = slotsData?.availableSlots ?? [];

  // ── Filter slots by selected month and reset selection on change
  const visibleSlots = availableSlots.filter((slot) => {
    if (!slot.date) return false;
    const slotDate = new Date(slot.date);
    return !isNaN(slotDate.getTime()) && slotDate.getMonth() === monthIndex;
  });

  // ── Locale-aware month name — no hardcoded array needed
  const monthName = new Date(2026, monthIndex).toLocaleString(
    isEl ? 'el-GR' : 'en-US',
    { month: 'long' },
  );

  const handleMonthChange = (delta: number) => {
    setMonthIndex((m) => Math.min(11, Math.max(0, m + delta)));
    setSelectedSlotId(null);
  };

  const handleBook = async () => {
    if (!selectedSlotId) return;
    setServerError('');
    setSuccessMsg('');
    try {
      const result = await requestAppointment({
        variables: { data: { slotId: selectedSlotId } },
      });
      if (result.errors) {
        setServerError(t('nutritionists.bookError'));
        return;
      }
      setSuccessMsg(t('nutritionists.bookSuccess'));
      setSelectedSlotId(null);
    } catch {
      setServerError(t('nutritionists.bookError'));
    }
  };

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
          {/* Back */}
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

          {/* Header */}
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <h1
              className="text-2xl font-bold italic text-white md:text-4xl"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              {nutr.username}
            </h1>
            <div className="flex gap-3 sm:ml-4 sm:flex-shrink-0">
              {nutr.phone && (
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
              )}
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

          {nutr.city && (
            <p className="mb-2 text-sm text-gray-300">📍 {nutr.city}</p>
          )}

          {nutr.bio && (
            <p className="mb-10 max-w-xl text-sm leading-relaxed text-gray-300">
              {nutr.bio}
            </p>
          )}

          {/* Booking section */}
          <div className="flex flex-col items-center">
            <div className="mb-6 rounded-full border-2 border-gray-800 bg-gray-100 px-6 py-3">
              <h2 className="text-center text-lg font-bold text-gray-800 md:text-xl">
                {t('nutritionists.availableTimes')}
              </h2>
            </div>

            {/* Month selector */}
            <div className="mb-6 flex items-center gap-4 self-start">
              <button
                onClick={() => handleMonthChange(-1)}
                disabled={monthIndex === 0}
                className="text-white transition-colors hover:text-gray-300 disabled:opacity-30"
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
              <span className="text-base font-semibold text-white capitalize">
                {monthName}
              </span>
              <button
                onClick={() => handleMonthChange(1)}
                disabled={monthIndex === 11}
                className="text-white transition-colors hover:text-gray-300 disabled:opacity-30"
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

            {/* Slots */}
            {slotsLoading ? (
              <div className="flex justify-center py-8">
                <div className="h-6 w-6 animate-spin rounded-full border-4 border-myBlue-200 border-t-transparent" />
              </div>
            ) : visibleSlots.length === 0 ? (
              <p className="mb-8 text-sm text-gray-300">
                {t('nutritionists.noSlots')}
              </p>
            ) : (
              <div className="mb-8 flex flex-wrap justify-center gap-3">
                {visibleSlots.map((slot) => {
                  const isSelected = selectedSlotId === slot.id;
                  return (
                    <button
                      key={slot.id}
                      onClick={() =>
                        setSelectedSlotId(isSelected ? null : slot.id)
                      }
                      className="rounded-full border-2 px-5 py-2.5 text-sm font-semibold transition-all duration-150"
                      style={{
                        backgroundColor: isSelected ? '#B3D5F8' : 'white',
                        borderColor: isSelected ? '#377CC3' : '#3F4756',
                        color: '#3F4756',
                      }}
                    >
                      {slot.date} {slot.time}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Feedback */}
            {serverError && (
              <p className="mb-3 text-sm font-semibold text-red-400">
                {serverError}
              </p>
            )}
            {successMsg && (
              <p className="mb-3 text-sm font-semibold text-green-400">
                {successMsg}
              </p>
            )}

            <button
              onClick={handleBook}
              disabled={!selectedSlotId || requesting}
              className="rounded-full px-12 py-3.5 text-base font-bold text-white shadow-lg transition-opacity"
              style={{
                backgroundColor: '#377CC3',
                opacity: !selectedSlotId || requesting ? 0.5 : 1,
                cursor:
                  !selectedSlotId || requesting ? 'not-allowed' : 'pointer',
              }}
            >
              {requesting ? '...' : t('nutritionists.bookAppointment')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
