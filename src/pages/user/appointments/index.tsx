import { useState } from 'react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import { el, enUS } from 'date-fns/locale';
import useIsUser from '../../../utils/useIsUser';
import Navbar from '../../../components/Users/Navbar';
import PaginationControls from '../../../components/Helper/PaginationControls';
import { useMyAppointmentRequestsQuery } from '../../../generated/graphql';
import { toDisplay, statusStyle } from '../../../utils/appointmentUtils';

const LIMIT = 6;

export async function getServerSideProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}

export default function AppointmentsPage() {
  const { loading: authLoading, isAuthorized } = useIsUser();
  if (authLoading || !isAuthorized) return null;
  return <AppointmentsContent />;
}

const AppointmentsContent = () => {
  const { t, i18n } = useTranslation('common');
  const router = useRouter();
  const dateFnsLocale = i18n.language === 'el' ? el : enUS;
  const [page, setPage] = useState(0);

  const { data, loading } = useMyAppointmentRequestsQuery();
  const all = data?.myAppointmentRequests ?? [];
  const totalPages = Math.ceil(all.length / LIMIT);
  const paginated = all.slice(page * LIMIT, page * LIMIT + LIMIT);

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="mx-auto max-w-2xl px-6 pb-16 pt-10">
        <button
          onClick={() => router.push('/user')}
          className="mb-6 text-myText-muted hover:text-cookie-400"
        >
          {t('common.back')}
        </button>

        <h1 className="mb-8 text-center">{t('settings.appointments')}</h1>

        {loading ? (
          <p className=" text-myText-muted">{t('common.loading')}</p>
        ) : all.length === 0 ? (
          <div className="py-12 text-center">
            <p className=" text-myText-muted">{t('settings.noAppointments')}</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {paginated.map((req) => {
              const nutr = req.slot?.nutritionistProfile?.user;
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
                    {nutr?.image ? (
                      <img
                        src={nutr.image}
                        alt={nutr.username}
                        className="h-10 w-10 flex-shrink-0 border-2 border-cookie-400 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-10 w-10 flex-shrink-0 rounded-full bg-cookie-200" />
                    )}
                    <div className="min-w-0">
                      <p className="truncate  ">{nutr?.username ?? '—'}</p>
                      <p className="truncate  text-myText-muted">
                        {date} · {time}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`w-fit flex-shrink-0 rounded-full px-3 py-1   ${
                      statusStyle[req.status]
                    }`}
                  >
                    {t(
                      `settings.appointmentStatus.${req.status.toLowerCase()}`,
                    )}
                  </span>
                </div>
              );
            })}

            <PaginationControls
              hasPrev={page > 0}
              hasMore={page < totalPages - 1}
              onPrev={() => setPage((p) => p - 1)}
              onNext={() => setPage((p) => p + 1)}
              prevLabel={t('pagination.prevAppointments')}
              nextLabel={t('pagination.nextAppointments')}
            />
          </div>
        )}
      </div>
    </div>
  );
};
