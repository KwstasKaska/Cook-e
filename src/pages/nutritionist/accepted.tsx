import { useState, useMemo } from 'react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import { el, enUS } from 'date-fns/locale';
import { useChatContext } from '../../components/Chat/ChatContext';
import PaginationControls from '../../components/Helper/PaginationControls';
import NutrNavbar from '../../components/Nutritionist/NutrNavbar';
import {
  useGetAppointmentRequestsForNutritionistQuery,
  AppointmentStatus,
} from '../../generated/graphql';
import { toDisplay } from '../../utils/appointmentUtils';
import useIsNutritionist from '../../utils/useIsNutr';

const LIMIT = 12;

export async function getServerSideProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}

export default function AcceptedAppointmentsPage() {
  const { loading: authLoading, isAuthorized } = useIsNutritionist();
  if (authLoading || !isAuthorized) return null;
  return <AcceptedAppointmentsContent />;
}

const AcceptedAppointmentsContent = () => {
  const { t, i18n } = useTranslation('common');
  const router = useRouter();
  const dateFnsLocale = i18n.language === 'el' ? el : enUS;
  const [page, setPage] = useState(0);
  const { openConversation } = useChatContext();

  const { data, loading } = useGetAppointmentRequestsForNutritionistQuery({
    variables: { limit: 100, offset: 0 },
    fetchPolicy: 'network-only',
  });

  const all = useMemo(() => {
    return (data?.getAppointmentRequestsForNutritionist ?? [])
      .filter(
        (req) => req.status === AppointmentStatus.Accepted && req.slot?.date,
      )
      .sort((a, b) => {
        const dateCompare = a.slot!.date.localeCompare(b.slot!.date);
        if (dateCompare !== 0) return dateCompare;
        return (a.slot!.time ?? '').localeCompare(b.slot!.time ?? '');
      });
  }, [data]);

  const totalPages = Math.ceil(all.length / LIMIT);
  const paginated = all.slice(page * LIMIT, page * LIMIT + LIMIT);

  return (
    <div className="min-h-screen">
      <NutrNavbar />
      <div className="mx-auto max-w-2xl px-6 pb-16 pt-10">
        <button
          onClick={() => router.push('/nutritionist')}
          className="mb-6 text-myText-muted hover:text-cookie-400"
        >
          {t('common.back')}
        </button>

        <h1 className="mb-8 text-center">{t('nutr.acceptedAppt')}</h1>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="h-6 w-6 rounded-full border-4 border-cookie-400 border-t-transparent animate-spin" />
          </div>
        ) : all.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-myText-muted">{t('nutr.noAcceptedAppt')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {paginated.map((req) => {
              const client = req.client;
              const date = req.slot?.date
                ? toDisplay(req.slot.date, dateFnsLocale)
                : '—';
              const time = req.slot?.time ?? '—';

              return (
                <div
                  key={req.id}
                  className="flex flex-col gap-2 overflow-hidden rounded-2xl border-2 border-cookie-400 bg-surface px-4 py-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    {client?.image ? (
                      <img
                        src={client.image}
                        alt={client.username}
                        className="h-10 w-10 flex-shrink-0 rounded-full border-2 border-cookie-400 object-cover"
                      />
                    ) : (
                      <div className="h-10 w-10 flex-shrink-0 rounded-full bg-cookie-200" />
                    )}
                    <div className="min-w-0">
                      <p className="truncate">{client?.username ?? '—'}</p>
                      <p className="truncate text-myText-muted">
                        {date} · {time}
                      </p>
                    </div>
                  </div>

                  {client && (
                    <button
                      onClick={() => openConversation(client.id)}
                      className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border-2 border-cookie-400 text-cookie-400 transition hover:bg-cookie-400 hover:text-white"
                      aria-label="Open chat"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
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
              );
            })}
          </div>
        )}
        <PaginationControls
          hasPrev={page > 0}
          hasMore={page < totalPages - 1}
          onPrev={() => setPage((p) => p - 1)}
          onNext={() => setPage((p) => p + 1)}
          prevLabel={t('pagination.prevAccepted')}
          nextLabel={t('pagination.nextAccepted')}
        />
      </div>
    </div>
  );
};
