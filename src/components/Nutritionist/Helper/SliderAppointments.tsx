import React, { useContext, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { format } from 'date-fns';
import { el, enUS } from 'date-fns/locale';
import { DateContext } from '../../Context';
import {
  useGetAppointmentRequestsForNutritionistQuery,
  useRespondToAppointmentRequestMutation,
  AppointmentStatus,
} from '../../../generated/graphql';

const toDisplay = (isoDate: string, locale: Locale): string => {
  const [year, month, day] = isoDate.split('-').map(Number);
  return format(new Date(year, month - 1, day), 'dd MMMM yyyy', { locale });
};

const SliderAppointments: React.FC = () => {
  const { t, i18n } = useTranslation('common');
  const { selectedDate } = useContext(DateContext);
  const [activeIndex, setActiveIndex] = useState(0);

  const dateFnsLocale = i18n.language === 'el' ? el : enUS;

  const { data, loading, refetch } =
    useGetAppointmentRequestsForNutritionistQuery({
      fetchPolicy: 'cache-and-network',
    });

  const [respondToAppointmentRequest] =
    useRespondToAppointmentRequestMutation();

  const pendingRequests = (
    data?.getAppointmentRequestsForNutritionist ?? []
  ).filter(
    (r) =>
      r.status === AppointmentStatus.Pending && r.slot?.date === selectedDate,
  );

  const handleRespond = async (
    requestId: number,
    status: AppointmentStatus,
  ) => {
    await respondToAppointmentRequest({ variables: { requestId, status } });
    setActiveIndex(0);
    await refetch();
  };

  if (loading) return null;

  const displayDate = selectedDate
    ? toDisplay(selectedDate, dateFnsLocale)
    : '';

  const count = pendingRequests.length;
  const request = pendingRequests[activeIndex];

  if (count === 0) {
    return (
      <div className="mt-10 mb-6 text-center text-base font-bold leading-relaxed md:mt-0 md:text-lg">
        {t('nutr.noAppointmentRequestsFor')}
        <div className="text-myBlue-200">{displayDate}</div>
      </div>
    );
  }

  const slotDisplay = request.slot?.date
    ? toDisplay(request.slot.date, dateFnsLocale)
    : '';

  return (
    <div className="lg:mt-16 lg:scale-125 xl:mt-16 flex items-center justify-center gap-2">
      {count > 1 ? (
        <button
          onClick={() => setActiveIndex((i) => (i - 1 + count) % count)}
          className="text-myGrey-200 hover:text-myBlue-200 transition-colors"
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
      ) : (
        <div className="w-5" />
      )}

      <div className="max-w-[17em] rounded-xl border-2 border-myBlue-200">
        <div className="h-full rounded-t-xl">
          <div className="relative rounded-t-md rounded-br-[5em] bg-myBlue-200 pb-32 text-base font-normal text-white">
            <h2 className="absolute top-0 left-10 text-center font-bold">
              {t('nutr.appointmentRequest')}
            </h2>
            <p className="absolute top-12 left-14 text-center font-bold">
              {slotDisplay}
              {' , '}
              <br />
              {request.slot?.time}
            </p>
            <div className="absolute -bottom-6 left-5 flex items-center justify-center text-lg font-bold text-white">
              <img
                className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full"
                src={request.client?.image ?? undefined}
                alt={request.client?.username}
              />
            </div>
          </div>

          <div className="mt-8">
            <p className="ml-6 mt-10 max-w-[8em] text-base font-bold">
              {request.client?.username}
            </p>
          </div>

          <div className="mt-8 mb-8 flex justify-center px-6 gap-3 font-normal">
            <button
              onClick={() =>
                handleRespond(request.id, AppointmentStatus.Accepted)
              }
              className="rounded-xl bg-myBlue-200 px-2 text-white hover:scale-110 hover:outline hover:outline-2"
            >
              {t('nutr.accept')}
            </button>
            <button
              onClick={() =>
                handleRespond(request.id, AppointmentStatus.Rejected)
              }
              className="rounded-xl border border-black bg-myGrey-100 px-2 hover:scale-110 hover:border-myRed hover:bg-myRed hover:text-white"
            >
              {t('nutr.reject')}
            </button>
          </div>
        </div>
      </div>

      {count > 1 ? (
        <button
          onClick={() => setActiveIndex((i) => (i + 1) % count)}
          className="text-myGrey-200 hover:text-myBlue-200 transition-colors"
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
      ) : (
        <div className="w-5" />
      )}
    </div>
  );
};

export default SliderAppointments;
