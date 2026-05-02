import { useState } from 'react';
import Navbar from '../../components/Users/Navbar';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import {
  useNutritionistsQuery,
  useMyAppointmentRequestsQuery,
} from '../../generated/graphql';
import useIsUser from '../../utils/useIsUser';
import { useChatContext } from '../../components/Chat/ChatContext';
import { pick } from '../../utils/pick';
import NutrArticlesGrid from '../../components/Users/Nutritionists/NutrArticlesGrid';
import NutrBookingSection from '../../components/Users/Nutritionists/NutrBookingSection';

type SelectedNutritionist = {
  id: number;
  userId: number;
  username: string;
  email: string;
  bio_el?: string | null;
  bio_en?: string | null;
  phone?: string | null;
  city_el?: string | null;
  city_en?: string | null;
  image?: string | null;
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

  const { data: requestsData } = useMyAppointmentRequestsQuery({
    fetchPolicy: 'network-only',
  });

  const myRequests = requestsData?.myAppointmentRequests ?? [];

  if (selected) {
    return (
      <ProfileView
        nutr={selected}
        myRequests={myRequests}
        onBack={() => setSelected(null)}
      />
    );
  }
  return <ListView onSelect={setSelected} />;
}

function ListView({
  onSelect,
}: {
  onSelect: (n: SelectedNutritionist) => void;
}) {
  const { t } = useTranslation('common');
  const { locale } = useRouter();
  const lang = locale ?? 'el';
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
              <div className="flex justify-end pr-1 pb-1 pt-3">
                <span className="text-sm text-gray-400">
                  {filtered.length} {t('nutritionists.showAll')}
                </span>
              </div>
              {filtered.length === 0 ? (
                <div className="py-12 text-center text-sm text-gray-400">
                  {t('nutritionists.noResults')}
                </div>
              ) : (
                <div className="grid grid-cols-2  md:grid-cols-3 gap-x-4 gap-y-14 pt-6 lg:grid-cols-4">
                  {filtered.map((nutr) => (
                    <NutrCard
                      key={nutr.id}
                      id={nutr.id}
                      username={nutr.user?.username ?? '—'}
                      city={pick(nutr.city_el ?? '', nutr.city_en ?? '', lang)}
                      image={nutr.user?.image ?? null}
                      onClick={() =>
                        onSelect({
                          id: nutr.id,
                          userId: nutr.user?.id ?? 0,
                          username: nutr.user?.username ?? '—',
                          email: nutr.user?.email ?? '',
                          bio_el: nutr.bio_el,
                          bio_en: nutr.bio_en,
                          phone: nutr.phone,
                          city_el: nutr.city_el,
                          city_en: nutr.city_en,
                          image: nutr.user?.image ?? null,
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

function NutrCard({
  username,
  city,
  image,
  onClick,
}: {
  id: number;
  username: string;
  image?: string | null;
  city?: string | null;
  onClick: () => void;
}) {
  return (
    <div
      className="relative cursor-pointer rounded-2xl border-2 border-black px-4 pb-4 pt-10 shadow-sm transition-transform duration-200 hover:scale-105"
      onClick={onClick}
    >
      <div className="absolute -top-8 left-1/2 -translate-x-1/2">
        <img
          src={image ?? undefined}
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
  myRequests,
  onBack,
}: {
  nutr: SelectedNutritionist;
  myRequests: Array<{
    id: number;
    status: string;
    slot?: { id: number; nutritionistId: number } | null;
  }>;
  onBack: () => void;
}) {
  const { t, i18n } = useTranslation('common');
  const lang = i18n.language as 'el' | 'en';
  const { openConversation } = useChatContext();

  const hasAcceptedAppointment = myRequests.some(
    (req) => req.status === 'ACCEPTED' && req.slot?.nutritionistId === nutr.id,
  );

  const cityText = pick(nutr.city_el ?? '', nutr.city_en ?? '', lang);
  const bioText = pick(nutr.bio_el ?? '', nutr.bio_en ?? '', lang);

  return (
    <div className="min-h-screen bg-myGrey-200">
      <Navbar />
      <div className="relative overflow-hidden">
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

          {/* Header */}
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <h1 className="text-2xl font-bold italic text-white md:text-4xl">
              {nutr.username}
            </h1>
            <div className="flex gap-3 sm:ml-4 sm:flex-shrink-0">
              {nutr.phone && (
                <a
                  href={`tel:${nutr.phone}`}
                  className="flex h-12 w-12 items-center justify-center rounded-full shadow-md"
                  style={{ backgroundColor: '#377CC3' }}
                  aria-label="Call"
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
              {nutr.userId && (
                <button
                  onClick={() => openConversation(nutr.userId)}
                  className="flex h-12 w-12 items-center justify-center rounded-full shadow-md transition hover:opacity-90"
                  style={{ backgroundColor: '#377CC3' }}
                  aria-label="Send message"
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
                      d="M8 10h.01M12 10h.01M16 10h.01M21 16c0 1.1-.9 2-2 2H7l-4 4V6a2 2 0 012-2h14a2 2 0 012 2v10z"
                    />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {cityText && <p className="mb-2 text-sm text-gray-300">{cityText}</p>}
          {bioText && (
            <p className="mb-10 max-w-xl text-sm leading-relaxed text-gray-300">
              {bioText}
            </p>
          )}

          {/* Articles — self-contained grid */}
          <NutrArticlesGrid nutritionistId={nutr.userId} />

          {/* Booking */}
          <NutrBookingSection
            nutritionistProfileId={nutr.id}
            nutritionistUserId={nutr.userId}
            hasAcceptedAppointment={hasAcceptedAppointment}
          />
        </div>
      </div>
    </div>
  );
}
