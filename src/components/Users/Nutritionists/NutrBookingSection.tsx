import { useMemo, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { format } from 'date-fns';
import { el, enUS } from 'date-fns/locale';
import { toast } from 'sonner';
import {
  useAvailableSlotsQuery,
  useRequestAppointmentMutation,
  AppointmentStatus,
} from '../../../generated/graphql';

interface SlotRequest {
  slotId: number;
  status: AppointmentStatus;
}

interface Props {
  nutritionistProfileId: number;
  nutritionistUserId: number;
  hasAcceptedAppointment: boolean;
  myRequests: SlotRequest[];
  onRequestSuccess: () => void;
}

const toDisplay = (isoDate: string, locale: Locale): string => {
  const [year, month, day] = isoDate.split('-').map(Number);
  return format(new Date(year, month - 1, day), 'dd MMMM yyyy', { locale });
};

export default function NutrBookingSection({
  nutritionistProfileId,
  myRequests,
  onRequestSuccess,
}: Props) {
  const { t, i18n } = useTranslation('common');
  const { locale } = useRouter();
  const isEl = locale === 'el';
  const dateFnsLocale = i18n.language === 'el' ? el : enUS;

  const [monthIndex, setMonthIndex] = useState(new Date().getMonth());
  const [selectedSlotId, setSelectedSlotId] = useState<number | null>(null);

  const { data: slotsData, loading: slotsLoading } = useAvailableSlotsQuery({
    variables: { nutritionistId: nutritionistProfileId },
    skip: !nutritionistProfileId,
    fetchPolicy: 'network-only',
  });

  const [requestAppointment, { loading: requesting }] =
    useRequestAppointmentMutation();

  const today = new Date().toISOString().split('T')[0];

  const availableSlots = slotsData?.availableSlots ?? [];

  const requestMap = useMemo(() => {
    const map = new Map<number, AppointmentStatus>();
    myRequests.forEach((r) => map.set(r.slotId, r.status));
    return map;
  }, [myRequests]);

  const visibleSlots = availableSlots.filter((slot) => {
    if (!slot.date) return false;
    const slotDate = new Date(slot.date);
    return (
      !isNaN(slotDate.getTime()) &&
      slotDate.getMonth() === monthIndex &&
      slot.date >= today
    );
  });

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

    const result = await requestAppointment({
      variables: { data: { slotId: selectedSlotId } },
    });

    if (result.errors) {
      toast.error(t('nutritionists.bookError'));
      return;
    }
    const gqlErrors = (result.data?.requestAppointment as any)?.errors;
    if (gqlErrors?.length) {
      toast.error(gqlErrors[0].message);
      return;
    }
    setSelectedSlotId(null);
    onRequestSuccess();
  };

  return (
    <div className="flex flex-col items-center">
      <h1 className="mb-6">{t('nutritionists.availableTimes')}</h1>

      <div className="mb-4 flex flex-wrap items-center gap-4 self-start">
        <button
          onClick={() => handleMonthChange(-1)}
          disabled={monthIndex === 0}
          className="transition-colors hover:text-cookie-400 "
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
        <span className="">{monthName}</span>
        <button
          onClick={() => handleMonthChange(1)}
          disabled={monthIndex === 11}
          className="transition-colors hover:text-cookie-400 "
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

      <div className="mb-6 flex items-center gap-4 self-start">
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-cookie-300" />
          <span className="">{t('settings.appointmentStatus.pending')}</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-myRed" />
          <span className="">{t('settings.appointmentStatus.rejected')}</span>
        </span>
      </div>

      {slotsLoading ? (
        <div className="flex justify-center py-8">
          <div className="h-6 w-6  rounded-full border-4 border-cookie-300 border-t-transparent" />
        </div>
      ) : visibleSlots.length === 0 ? (
        <p className="mb-8  ">{t('nutritionists.noSlots')}</p>
      ) : (
        <>
          <div className="mb-8 flex flex-wrap justify-center gap-3">
            {visibleSlots.map((slot) => {
              const reqStatus = requestMap.get(slot.id);
              const isPending = reqStatus === AppointmentStatus.Pending;
              const isRejected = reqStatus === AppointmentStatus.Rejected;
              const isBlocked = isPending || isRejected;
              const isSelected = selectedSlotId === slot.id;

              return (
                <button
                  key={slot.id}
                  onClick={() =>
                    !isBlocked && setSelectedSlotId(isSelected ? null : slot.id)
                  }
                  disabled={isBlocked}
                  className={`rounded-full text-myText-base border-2 px-5 py-2.5 transition-all duration-150 ${
                    isPending
                      ? 'cursor-not-allowed border-cookie-300 bg-cookie-300 text-white'
                      : isRejected
                        ? 'cursor-not-allowed border-myRed bg-myRed text-white '
                        : isSelected
                          ? 'border-cookie-400 bg-cookie-200'
                          : 'border-cookie-400 bg-surface'
                  }`}
                >
                  {toDisplay(slot.date, dateFnsLocale)} {slot.time}
                </button>
              );
            })}
          </div>
        </>
      )}

      <button
        onClick={handleBook}
        disabled={!selectedSlotId || requesting}
        className={`mt-6 rounded-xl border-2 border-cookie-400 px-8 py-2.5  shadow-lg  ${
          !selectedSlotId || requesting
            ? 'cursor-not-allowed    '
            : 'hover:text-white hover:bg-cookie-400'
        }`}
      >
        {requesting ? '...' : t('nutritionists.bookAppointment')}
      </button>
    </div>
  );
}
