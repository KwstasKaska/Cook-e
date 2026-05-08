import React, { useState } from 'react';
import { useTranslation } from 'next-i18next';
import { format } from 'date-fns';
import { el, enUS } from 'date-fns/locale';
import {
  useMyAppointmentRequestsQuery,
  AppointmentStatus,
} from '../../generated/graphql';
import PaginationControls from '../Helper/PaginationControls';

const LIMIT = 6;

const toDisplay = (isoDate: string, locale: Locale): string => {
  const [year, month, day] = isoDate.split('-').map(Number);
  return format(new Date(year, month - 1, day), 'dd MMMM yyyy', { locale });
};

const statusStyle: Record<AppointmentStatus, string> = {
  [AppointmentStatus.Accepted]: 'bg-green-100 text-green-700',
  [AppointmentStatus.Pending]: 'bg-myBlue-100 text-myBlue-200',
  [AppointmentStatus.Rejected]: 'bg-red-100 text-myRed',
};

const AppointmentsTab: React.FC = () => {
  const { t, i18n } = useTranslation('common');
  const dateFnsLocale = i18n.language === 'el' ? el : enUS;
  const [page, setPage] = useState(0);

  const { data, loading } = useMyAppointmentRequestsQuery({
    fetchPolicy: 'network-only',
  });
  const all = data?.myAppointmentRequests ?? [];

  const totalPages = Math.ceil(all.length / LIMIT);
  const paginated = all.slice(page * LIMIT, page * LIMIT + LIMIT);

  if (loading) {
    return <p className="text-sm text-gray-400">{t('common.loading')}</p>;
  }

  if (all.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-sm text-gray-400">{t('settings.noAppointments')}</p>
      </div>
    );
  }

  return (
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
            className="flex flex-col gap-2 overflow-hidden rounded-2xl border-2 border-myGrey-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex min-w-0 items-center gap-3">
              {nutr?.image ? (
                <img
                  src={nutr.image}
                  alt={nutr.username}
                  className="h-10 w-10 flex-shrink-0 rounded-full object-cover"
                />
              ) : (
                <div className="h-10 w-10 flex-shrink-0 rounded-full bg-myBlue-100" />
              )}
              <div className="min-w-0">
                <p className="truncate text-sm font-bold">
                  {nutr?.username ?? '—'}
                </p>
                <p className="truncate text-xs text-gray-500">
                  {date} · {time}
                </p>
              </div>
            </div>

            <span
              className={`w-fit flex-shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
                statusStyle[req.status]
              }`}
            >
              {t(`settings.appointmentStatus.${req.status.toLowerCase()}`)}
            </span>
          </div>
        );
      })}

      <PaginationControls
        hasPrev={page > 0}
        hasMore={page < totalPages - 1}
        onPrev={() => setPage((p) => p - 1)}
        onNext={() => setPage((p) => p + 1)}
      />
    </div>
  );
};

export default AppointmentsTab;
