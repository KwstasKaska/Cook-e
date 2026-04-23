import React, { useContext, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { format } from 'date-fns';
import { el, enUS } from 'date-fns/locale';
import { Settings } from '../../Helper/SliderSettings';
import Slider from 'react-slick';
import { DateContext } from '../../Context';
import {
  useGetAppointmentRequestsForNutritionistQuery,
  useRespondToAppointmentRequestMutation,
  AppointmentStatus,
} from '../../../generated/graphql';

// ── Helper ────────────────────────────────────────────────────────────────────

// Slot dates are stored as ISO (YYYY-MM-DD) — format for display only
const toDisplay = (isoDate: string, locale: Locale): string => {
  const [year, month, day] = isoDate.split('-').map(Number);
  return format(new Date(year, month - 1, day), 'dd MMMM yyyy', { locale });
};

// ── Slider arrows ─────────────────────────────────────────────────────────────

function SampleArrow(props: any) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{
        ...style,
        display: 'block',
        borderRadius: '9999px',
        background: 'black',
      }}
      onClick={onClick}
    />
  );
}

const settingsCalendar: Settings = {
  dots: true,
  infinite: true,
  arrows: true,
  slidesToShow: 1,
  slidesToScroll: 1,
  initialSlide: 0,
  autoplay: true,
  speed: 1000,
  autoplaySpeed: 8000,
  adaptiveHeight: true,
  pauseOnHover: true,
  swipeToSlide: true,
  nextArrow: <SampleArrow />,
  prevArrow: <SampleArrow />,
  className: 'mx-auto max-w-[20em]',
};

// ── Component ─────────────────────────────────────────────────────────────────

const SliderAppointments: React.FC = () => {
  const { t, i18n } = useTranslation('common');
  const { selectedDate } = useContext(DateContext);
  const [respondError, setRespondError] = useState<string>('');
  const [expandedCardId, setExpandedCardId] = useState<number | null>(null);

  const dateFnsLocale = i18n.language === 'el' ? el : enUS;

  const { data, loading, refetch } =
    useGetAppointmentRequestsForNutritionistQuery({
      fetchPolicy: 'cache-and-network',
    });

  const [respondToAppointmentRequest] =
    useRespondToAppointmentRequestMutation();

  // selectedDate is ISO — slot.date is ISO — direct comparison always works
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
    setRespondError('');
    try {
      const result = await respondToAppointmentRequest({
        variables: { requestId, status },
      });
      if (!result.data?.respondToAppointmentRequest) {
        setRespondError(t('nutr.respondError'));
        return;
      }
      setExpandedCardId(null);
      await refetch();
    } catch {
      setRespondError(t('nutr.serverError'));
    }
  };

  if (loading) return null;

  const displayDate = selectedDate
    ? toDisplay(selectedDate, dateFnsLocale)
    : '';

  return (
    <div>
      {respondError && (
        <p className="mb-4 text-center text-sm font-semibold text-myRed">
          {respondError}
        </p>
      )}

      {pendingRequests.length === 0 ? (
        <div className="mt-10 mb-6 text-center font-exo text-base font-bold leading-relaxed md:mt-0 md:text-lg">
          {t('nutr.noAppointmentRequestsFor')}
          <div className="text-myBlue-200">{displayDate}</div>
        </div>
      ) : (
        <div className="lg:mt-16 lg:scale-125 xl:mt-16">
          <Slider {...settingsCalendar}>
            {pendingRequests.map((request) => {
              const isExpanded = expandedCardId === request.id;
              const slotDisplay = request.slot?.date
                ? toDisplay(request.slot.date, dateFnsLocale)
                : '';

              return (
                <div
                  key={request.id}
                  className="max-w-[17em] rounded-xl border-2 border-myBlue-200"
                >
                  {!isExpanded ? (
                    // ── Front ──────────────────────────────────────────────
                    <div>
                      <div className="rounded-t-md bg-myBlue-200 text-base font-normal text-white">
                        <h2 className="text-center font-bold">
                          {t('nutr.appointmentRequest')}
                        </h2>
                        <p className="text-center">
                          {slotDisplay} {' : '} {request.slot?.time}
                        </p>
                      </div>

                      <div className="mt-4 grid grid-flow-col items-center justify-items-center px-2">
                        <div className="flex h-[3em] w-[3em] items-center justify-center rounded-lg bg-myGrey-100 text-lg font-bold text-myGrey-200">
                          {request.client?.username?.charAt(0).toUpperCase()}
                        </div>
                        <p className="text-center text-base font-bold">
                          {request.client?.username}
                        </p>
                        <button onClick={() => setExpandedCardId(request.id)}>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="h-8 w-8 animate-bounce text-myBlue-200"
                          >
                            <path
                              fillRule="evenodd"
                              d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      </div>

                      <div className="my-4 flex justify-center gap-4 font-exo font-normal">
                        <button
                          onClick={() =>
                            handleRespond(
                              request.id,
                              AppointmentStatus.Accepted,
                            )
                          }
                          className="rounded-xl bg-myBlue-200 px-6 text-white hover:scale-110 hover:outline hover:outline-2"
                        >
                          {t('nutr.accept')}
                        </button>
                        <button
                          onClick={() =>
                            handleRespond(
                              request.id,
                              AppointmentStatus.Rejected,
                            )
                          }
                          className="rounded-xl border border-black bg-myGrey-100 px-6 hover:scale-110 hover:border-myRed hover:bg-myRed hover:text-white"
                        >
                          {t('nutr.reject')}
                        </button>
                      </div>
                    </div>
                  ) : (
                    // ── Back (expanded info) ───────────────────────────────
                    <div className="h-full rounded-t-xl">
                      <div className="relative rounded-t-md rounded-br-[5em] bg-myBlue-200 pb-32 text-base font-normal text-white">
                        <button onClick={() => setExpandedCardId(null)}>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="h-6 w-6"
                          >
                            <path d="M11.03 3.97a.75.75 0 010 1.06l-6.22 6.22H21a.75.75 0 010 1.5H4.81l6.22 6.22a.75.75 0 11-1.06 1.06l-7.5-7.5a.75.75 0 010-1.06l7.5-7.5a.75.75 0 011.06 0z" />
                          </svg>
                        </button>
                        <h2 className="absolute top-0 left-10 text-center font-bold">
                          {t('nutr.appointmentRequest')}
                        </h2>
                        <p className="absolute top-12 left-14 text-center font-bold">
                          {slotDisplay}
                          {' , '}
                          <br />
                          {request.slot?.time}
                        </p>
                        <div className="absolute -bottom-6 left-5 flex h-[3em] w-[3em] items-center justify-center rounded-lg border-2 border-white bg-myBlue-100 text-lg font-bold text-white">
                          {request.client?.username?.charAt(0).toUpperCase()}
                        </div>
                      </div>

                      <div className="mt-8">
                        <p className="ml-6 mt-10 max-w-[8em] text-base font-bold">
                          {request.client?.username}
                        </p>
                      </div>

                      {request.comment && (
                        <div className="ml-6 mt-4">
                          <p className="text-base leading-relaxed">
                            {t('nutr.comments')}
                          </p>
                          <p className="mt-1 text-sm leading-relaxed text-gray-600">
                            {request.comment}
                          </p>
                        </div>
                      )}

                      <div className="mt-8 mb-8 flex justify-center gap-4 font-exo font-normal">
                        <button
                          onClick={() =>
                            handleRespond(
                              request.id,
                              AppointmentStatus.Accepted,
                            )
                          }
                          className="rounded-xl bg-myBlue-200 px-5 text-white hover:scale-110 hover:outline hover:outline-2"
                        >
                          {t('nutr.accept')}
                        </button>
                        <button
                          onClick={() =>
                            handleRespond(
                              request.id,
                              AppointmentStatus.Rejected,
                            )
                          }
                          className="rounded-xl border border-black bg-myGrey-100 px-5 hover:scale-110 hover:border-myRed hover:bg-myRed hover:text-white"
                        >
                          {t('nutr.reject')}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </Slider>
        </div>
      )}
    </div>
  );
};

export default SliderAppointments;
