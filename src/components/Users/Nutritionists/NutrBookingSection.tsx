import { useState } from 'react';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { format } from 'date-fns';
import { el, enUS } from 'date-fns/locale';
import {
  useAvailableSlotsQuery,
  useRequestAppointmentMutation,
} from '../../../generated/graphql';

interface Props {
  nutritionistProfileId: number; // NutritionistProfile.id — used to query slots
  nutritionistUserId: number; // User.id — used for accepted appointment gate check
  hasAcceptedAppointment: boolean;
}

const toDisplay = (isoDate: string, locale: Locale): string => {
  const [year, month, day] = isoDate.split('-').map(Number);
  return format(new Date(year, month - 1, day), 'dd MMMM yyyy', { locale });
};

export default function NutrBookingSection({ nutritionistProfileId }: Props) {
  const { t, i18n } = useTranslation('common');
  const { locale } = useRouter();
  const isEl = locale === 'el';
  const dateFnsLocale = i18n.language === 'el' ? el : enUS;

  const [monthIndex, setMonthIndex] = useState(new Date().getMonth());
  const [selectedSlotId, setSelectedSlotId] = useState<number | null>(null);
  const [serverError, setServerError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const { data: slotsData, loading: slotsLoading } = useAvailableSlotsQuery({
    variables: { nutritionistId: nutritionistProfileId },
    fetchPolicy: 'network-only',
  });

  const [requestAppointment, { loading: requesting }] =
    useRequestAppointmentMutation();

  const availableSlots = slotsData?.availableSlots ?? [];

  const visibleSlots = availableSlots.filter((slot) => {
    if (!slot.date) return false;
    const slotDate = new Date(slot.date);
    return !isNaN(slotDate.getTime()) && slotDate.getMonth() === monthIndex;
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
    setServerError('');
    setSuccessMsg('');
    try {
      const result = await requestAppointment({
        variables: { data: { slotId: selectedSlotId } },
      });
      if (result.errors) {
        setServerError(t('nutritionists.bookError'));
        return;
      }
      const gqlErrors = (result.data?.requestAppointment as any)?.errors;
      if (gqlErrors?.length) {
        setServerError(gqlErrors[0].message);
        return;
      }
      setSuccessMsg(t('nutritionists.bookSuccess'));
      setSelectedSlotId(null);
    } catch {
      setServerError(t('nutritionists.bookError'));
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="mb-6 rounded-full border-2 border-gray-800 bg-gray-100 px-6 py-3">
        <h2 className="text-center text-lg font-bold text-gray-800 md:text-xl">
          {t('nutritionists.availableTimes')}
        </h2>
      </div>

      {/* Month selector */}
      <div className="mb-6 flex items-center gap-4 self-start text-pink-400">
        <button
          onClick={() => handleMonthChange(-1)}
          disabled={monthIndex === 0}
          className=" transition-colors hover:text-gray-300 disabled:opacity-30"
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
        <span className="text-base font-semibold capitalize  ">
          {monthName}
        </span>
        <button
          onClick={() => handleMonthChange(1)}
          disabled={monthIndex === 11}
          className=" transition-colors hover:text-gray-300 disabled:opacity-30"
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

      {/* Slots */}
      {slotsLoading ? (
        <div className="flex justify-center py-8">
          <div className="h-6 w-6 animate-spin rounded-full border-4 border-myBlue-200 border-t-transparent" />
        </div>
      ) : visibleSlots.length === 0 ? (
        <p className="mb-8 text-sm text-gray-300">
          {t('nutritionists.noSlots')}
        </p>
      ) : (
        <div className="mb-8 flex flex-wrap justify-center gap-3">
          {visibleSlots.map((slot) => {
            const isSelected = selectedSlotId === slot.id;
            return (
              <button
                key={slot.id}
                onClick={() => setSelectedSlotId(isSelected ? null : slot.id)}
                className="rounded-full border-2 px-5 py-2.5 text-sm font-semibold transition-all duration-150"
                style={{
                  backgroundColor: isSelected ? '#B3D5F8' : 'white',
                  borderColor: isSelected ? '#377CC3' : '#3F4756',
                  color: '#3F4756',
                }}
              >
                {toDisplay(slot.date, dateFnsLocale)} {slot.time}
              </button>
            );
          })}
        </div>
      )}

      {serverError && (
        <p className="mb-3 text-sm font-semibold text-red-400">{serverError}</p>
      )}
      {successMsg && (
        <p className="mb-3 text-sm font-semibold text-green-400">
          {successMsg}
        </p>
      )}

      <button
        onClick={handleBook}
        disabled={!selectedSlotId || requesting}
        className="rounded-full px-12 py-3.5 text-base font-bold text-white shadow-lg transition-opacity"
        style={{
          backgroundColor: '#377CC3',
          opacity: !selectedSlotId || requesting ? 0.5 : 1,
          cursor: !selectedSlotId || requesting ? 'not-allowed' : 'pointer',
        }}
      >
        {requesting ? '...' : t('nutritionists.bookAppointment')}
      </button>
    </div>
  );
}
