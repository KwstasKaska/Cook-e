import Navbar from '../../../components/Users/Navbar';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import {
  useNutritionistQuery,
  useMyAppointmentRequestsQuery,
} from '../../../generated/graphql';
import useIsUser from '../../../utils/useIsUser';
import { useChatContext } from '../../../components/Chat/ChatContext';
import { pick } from '../../../utils/pick';
import NutrArticlesGrid from '../../../components/Users/Nutritionists/NutrArticlesGrid';
import NutrBookingSection from '../../../components/Users/Nutritionists/NutrBookingSection';
import ShareButton from '../../../components/Helper/ShareButton';

export async function getServerSideProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}

export default function NutritionistProfilePage() {
  const { loading: authLoading, isAuthorized } = useIsUser();
  if (authLoading || !isAuthorized) return null;
  return <ProfileContent />;
}

const ProfileContent = () => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const lang = (router.locale ?? 'el') as 'el' | 'en';
  const { openConversation } = useChatContext();

  const id = Number(router.query.id);

  const { data, loading } = useNutritionistQuery({
    variables: { id },
    skip: !id,
    fetchPolicy: 'network-only',
  });

  const { data: requestsData } = useMyAppointmentRequestsQuery({
    fetchPolicy: 'network-only',
  });

  const nutr = data?.nutritionist;
  const myRequests = requestsData?.myAppointmentRequests ?? [];

  const hasAcceptedAppointment = myRequests.some(
    (req) => req.status === 'ACCEPTED' && req.slot?.nutritionistId === nutr?.id,
  );

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="flex justify-center pt-32">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-cookie-300 border-t-transparent" />
        </div>
      </div>
    );
  }

  if (!nutr) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <p className="pt-32 text-center  text-myText-muted">
          {t('nutritionists.noResults')}
        </p>
      </div>
    );
  }

  const cityText = pick(nutr.city_el ?? '', nutr.city_en ?? '', lang);
  const bioText = pick(nutr.bio_el ?? '', nutr.bio_en ?? '', lang);
  const username = nutr.user?.username ?? '—';
  const userId = nutr.user?.id ?? 0;
  const image = nutr.user?.image ?? null;

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="relative overflow-hidden">
        <div className="relative z-10 mx-auto max-w-4xl px-6 pb-20 pt-10">
          <button
            onClick={() => router.push('/user/nutritionists')}
            className="mb-6 flex items-center gap-1  text-myText-muted transition-colors hover:text-myText-base"
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

          <div className="mb-4 flex items-center gap-4">
            <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-full border-2 border-cookie-400 shadow-lg ">
              {image ? (
                <img
                  src={image}
                  alt={username}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <span className="  text-myText-heading">
                    {username[0]?.toUpperCase() ?? '?'}
                  </span>
                </div>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <h1 className="truncate">{username}</h1>
              {cityText && <p className="mt-0.5 ">{cityText}</p>}
              {nutr.phone && <p className="mt-0.5  ">{nutr.phone}</p>}
            </div>

            {hasAcceptedAppointment && userId > 0 && (
              <button
                onClick={() => openConversation(userId)}
                className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-cookie-300 shadow-md transition hover:opacity-90"
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

          {bioText && <p className="mb-4 max-w-xl">{bioText}</p>}

          <div className="mb-8">
            <ShareButton
              url={typeof window !== 'undefined' ? window.location.href : ''}
              dark
            />
          </div>

          <NutrBookingSection
            nutritionistProfileId={nutr.id}
            nutritionistUserId={userId}
            hasAcceptedAppointment={hasAcceptedAppointment}
          />
          <NutrArticlesGrid nutritionistId={userId} />
        </div>
      </div>
    </div>
  );
};
