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

// ── Helper

// Slot dates are stored as ISO (YYYY-MM-DD) — format for display only
const toDisplay = (isoDate: string, locale: Locale): string => {
  const [year, month, day] = isoDate.split('-').map(Number);
  return format(new Date(year, month - 1, day), 'dd MMMM yyyy', { locale });
};

// ── Slider arrows

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

const SliderAppointments: React.FC = () => {
  const { t, i18n } = useTranslation('common');
  const { selectedDate } = useContext(DateContext);
  const [respondError, setRespondError] = useState<string>('');

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
              const slotDisplay = request.slot?.date
                ? toDisplay(request.slot.date, dateFnsLocale)
                : '';

              return (
                <div
                  key={request.id}
                  className="max-w-[17em] rounded-xl border-2 border-myBlue-200"
                >
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
                      <div className="absolute -bottom-6 left-5 flex   items-center justify-center text-lg font-bold text-white">
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

                    <div className="mt-8 mb-8 flex justify-center gap-4 font-exo font-normal">
                      <button
                        onClick={() =>
                          handleRespond(request.id, AppointmentStatus.Accepted)
                        }
                        className="rounded-xl bg-myBlue-200 px-5 text-white hover:scale-110 hover:outline hover:outline-2"
                      >
                        {t('nutr.accept')}
                      </button>
                      <button
                        onClick={() =>
                          handleRespond(request.id, AppointmentStatus.Rejected)
                        }
                        className="rounded-xl border border-black bg-myGrey-100 px-5 hover:scale-110 hover:border-myRed hover:bg-myRed hover:text-white"
                      >
                        {t('nutr.reject')}
                      </button>
                    </div>
                  </div>
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
