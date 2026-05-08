import { useState } from 'react';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { format } from 'date-fns';
import { el, enUS } from 'date-fns/locale';
import { toast } from 'sonner';
import {
  useAvailableSlotsQuery,
  useRequestAppointmentMutation,
} from '../../../generated/graphql';
import PaginationControls from '../../Helper/PaginationControls';

interface Props {
  nutritionistProfileId: number;
  nutritionistUserId: number;
  hasAcceptedAppointment: boolean;
}

const PAGE_SIZE = 10;

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
  const [page, setPage] = useState(0);

  const { data: slotsData, loading: slotsLoading } = useAvailableSlotsQuery({
    variables: { nutritionistId: nutritionistProfileId },
    fetchPolicy: 'network-only',
  });

  const [requestAppointment] = useRequestAppointmentMutation();

  const availableSlots = slotsData?.availableSlots ?? [];

  const visibleSlots = availableSlots.filter((slot) => {
    if (!slot.date) return false;
    const slotDate = new Date(slot.date);
    return !isNaN(slotDate.getTime()) && slotDate.getMonth() === monthIndex;
  });

  const totalPages = Math.ceil(visibleSlots.length / PAGE_SIZE);
  const paginatedSlots = visibleSlots.slice(
    page * PAGE_SIZE,
    (page + 1) * PAGE_SIZE,
  );

  const monthName = new Date(2026, monthIndex).toLocaleString(
    isEl ? 'el-GR' : 'en-US',
    { month: 'long' },
  );

  const handleMonthChange = (delta: number) => {
    setMonthIndex((m) => Math.min(11, Math.max(0, m + delta)));
    setSelectedSlotId(null);
    setPage(0);
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
    toast.success(t('nutritionists.bookSuccess'));
    setSelectedSlotId(null);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="mb-6 rounded-full border-2 border-gray-800 bg-gray-100 px-6 py-3">
        <h2 className="text-center text-lg font-bold text-gray-800 md:text-xl">
          {t('nutritionists.availableTimes')}
        </h2>
      </div>

      <div className="mb-6 flex items-center gap-4 self-start text-pink-400">
        <button
          onClick={() => handleMonthChange(-1)}
          disabled={monthIndex === 0}
          className="transition-colors hover:text-gray-300 disabled:opacity-30"
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
        <span className="text-base font-semibold capitalize">{monthName}</span>
        <button
          onClick={() => handleMonthChange(1)}
          disabled={monthIndex === 11}
          className="transition-colors hover:text-gray-300 disabled:opacity-30"
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

      {slotsLoading ? (
        <div className="flex justify-center py-8">
          <div className="h-6 w-6 animate-spin rounded-full border-4 border-myBlue-200 border-t-transparent" />
        </div>
      ) : visibleSlots.length === 0 ? (
        <p className="text-sm text-gray-400">{t('nutritionists.noSlots')}</p>
      ) : (
        <>
          <div className="grid w-full grid-cols-2 gap-3 sm:grid-cols-3">
            {paginatedSlots.map((slot) => {
              const selected = selectedSlotId === slot.id;
              return (
                <button
                  key={slot.id}
                  onClick={() => setSelectedSlotId(selected ? null : slot.id)}
                  className="flex flex-col items-center rounded-2xl border-2 px-4 py-3 text-sm font-semibold transition"
                  style={{
                    borderColor: selected ? '#377CC3' : '#E5E7EB',
                    background: selected ? '#EBF4FF' : '#fff',
                    color: '#3F4756',
                  }}
                >
                  <span>{toDisplay(slot.date, dateFnsLocale)}</span>
                  <span className="mt-1 text-xs text-gray-500">
                    {slot.time}
                  </span>
                </button>
              );
            })}
          </div>

          <PaginationControls
            hasPrev={page > 0}
            hasMore={page < totalPages - 1}
            onPrev={() => {
              setPage((p) => p - 1);
              setSelectedSlotId(null);
            }}
            onNext={() => {
              setPage((p) => p + 1);
              setSelectedSlotId(null);
            }}
          />

          {selectedSlotId && (
            <button
              onClick={handleBook}
              className="mt-6 rounded-full bg-myBlue-200 px-8 py-2.5 text-sm font-bold text-white transition hover:opacity-90"
            >
              {t('nutritionists.book')}
            </button>
          )}
        </>
      )}
    </div>
  );
}
