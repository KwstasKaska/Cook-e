import React, { useContext, useState } from 'react';
import Image from 'next/image';
import { useTranslation } from 'next-i18next';
import { format } from 'date-fns';
import { el, enUS } from 'date-fns/locale';
import { DateContext } from '../../Context';
import {
  useGetAppointmentRequestsForNutritionistQuery,
  AppointmentStatus,
} from '../../../generated/graphql';

// ── Helper ────────────────────────────────────────────────────────────────────

const toDisplay = (isoDate: string, locale: Locale): string => {
  const [year, month, day] = isoDate.split('-').map(Number);
  return format(new Date(year, month - 1, day), 'dd MMMM yyyy', { locale });
};

// ── Types ─────────────────────────────────────────────────────────────────────

interface GroupedAppointments {
  [isoDate: string]: {
    clientUsername: string;
    clientImage?: string | null;
    time: string;
  }[];
}

interface MyAppointmentsProps {
  customClassName: string;
  textColor: string;
  showAttrs: boolean;
  marginCustom: string;
  emptyAppointments: string;
}

// ── Component ─────────────────────────────────────────────────────────────────

const MyAppointments: React.FC<MyAppointmentsProps> = ({
  customClassName,
  textColor,
  showAttrs,
  marginCustom,
  emptyAppointments,
}) => {
  const { t, i18n } = useTranslation('common');
  const { selectedDate } = useContext(DateContext);
  const [start, setStart] = useState<number>(0);
  const [end, setEnd] = useState<number>(3);

  const dateFnsLocale = i18n.language === 'el' ? el : enUS;

  const { data } = useGetAppointmentRequestsForNutritionistQuery({
    fetchPolicy: 'cache-and-network',
  });

  // Group accepted requests by ISO date
  const groupedAppointments: GroupedAppointments = {};
  (data?.getAppointmentRequestsForNutritionist ?? [])
    .filter((r) => r.status === AppointmentStatus.Accepted)
    .forEach((r) => {
      const date = r.slot?.date ?? '';
      if (!date) return;
      if (!groupedAppointments[date]) groupedAppointments[date] = [];
      groupedAppointments[date].push({
        clientUsername: r.client?.username ?? '',
        clientImage: r.client?.image,
        time: r.slot?.time ?? '',
      });
    });

  const sortedDates = Object.keys(groupedAppointments).sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime(),
  );

  const hasAppointmentsForDate = sortedDates.includes(selectedDate);

  const handleLoadMore = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setStart(start + 3);
    setEnd(end + 3);
  };

  const handleBack = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setStart(Math.max(start - 3, 0));
    setEnd(Math.max(end - 3, 3));
  };

  return (
    <div>
      {hasAppointmentsForDate ? (
        sortedDates.map(
          (date, index) =>
            date === selectedDate && (
              <div key={`${date}_${index}`} className={customClassName}>
                {/* Date header */}
                <h2
                  className={`relative z-[2] w-full pb-6 pt-2 text-center text-2xl font-bold text-${textColor}`}
                >
                  {toDisplay(date, dateFnsLocale)}
                </h2>

                {/* ── Fix: min-h-fit instead of min-h-[20em] so no empty space */}
                <div
                  className={
                    showAttrs
                      ? ''
                      : 'min-h-fit rounded-2xl border-2 border-black bg-black bg-opacity-80'
                  }
                >
                  <ul className={marginCustom}>
                    {groupedAppointments[date]
                      .slice(start, end)
                      .map((appt, apptIndex) => (
                        <li
                          key={`${date}_${index}_${apptIndex}`}
                          className="mx-auto my-3 flex max-w-xs flex-row items-center gap-3 rounded-lg border-2 border-black bg-white text-base font-bold leading-4 hover:scale-110 hover:bg-myBlue-200 hover:text-white hover:shadow-3xl hover:transition hover:duration-500"
                        >
                          {appt.clientImage ? (
                            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full">
                              <Image
                                src={appt.clientImage}
                                alt={appt.clientUsername}
                                fill
                                className="object-cover"
                              />
                            </div>
                          ) : (
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-myGrey-100 text-base font-bold text-myGrey-200">
                              {appt.clientUsername.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <div className="grow">{appt.clientUsername}</div>
                          <span className="shrink-0 pr-2">{appt.time}</span>
                        </li>
                      ))}

                    <div className="mx-2 flex flex-row gap-2">
                      {start > 0 && (
                        <button
                          onClick={handleBack}
                          className="my-5 w-full rounded-md bg-black py-1 text-white hover:shadow-3xl"
                        >
                          {t('nutr.back')}
                        </button>
                      )}
                      {end < groupedAppointments[date].length && (
                        <button
                          onClick={handleLoadMore}
                          className="my-5 w-full rounded-md border-2 border-black bg-white py-1 font-bold text-black hover:bg-myBlue-100 hover:shadow-3xl"
                        >
                          {t('nutr.loadMore')}
                        </button>
                      )}
                    </div>
                  </ul>
                </div>
              </div>
            ),
        )
      ) : (
        <div
          className={`relative z-[3] h-[13em] w-[20em] rounded-xl ${emptyAppointments} bg-white`}
        >
          <div className="absolute z-[5] px-4 py-8 text-center text-base font-bold leading-relaxed md:text-lg">
            {t('nutr.noAppointmentsFor')} <br />
            <span className="relative inline-block">
              <span className="absolute -left-10 top-3 z-[6] block h-[3em] w-[12em] -skew-y-3 bg-myRed" />
              <span className="relative top-6 z-[10] text-white">
                {selectedDate ? toDisplay(selectedDate, dateFnsLocale) : ''}
              </span>
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyAppointments;
