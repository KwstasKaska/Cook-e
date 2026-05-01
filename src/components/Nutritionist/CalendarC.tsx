import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'next-i18next';
import dynamic from 'next/dynamic';
import { format } from 'date-fns';
import { el, enUS } from 'date-fns/locale';
type Value = Date | [Date | null, Date | null] | null;
import { DateContext } from '../Context';
import SliderAppointments from './Helper/SliderAppointments';
import {
  useGetMyAppointmentsQuery,
  useCreateAppointmentMutation,
  useDeleteAppointmentMutation,
} from '../../generated/graphql';

const DynamicCalendar = dynamic(() => import('react-calendar'), { ssr: false });

export interface Appointment {
  id: number;
  date: string; // ISO: YYYY-MM-DD
  time: string;
  isAvailable: boolean;
  nutritionistId: number;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

// What goes to DB and into DateContext — always ISO
const toISO = (d: Date): string => format(d, 'yyyy-MM-dd');

// What the user sees — locale-aware
const toDisplay = (isoDate: string, locale: Locale): string => {
  const [year, month, day] = isoDate.split('-').map(Number);
  return format(new Date(year, month - 1, day), 'dd MMMM yyyy', { locale });
};

// ── Component ────────────────────────────────────────────────────────────────

const CalendarC: React.FC = () => {
  const { t, i18n } = useTranslation('common');
  const { selectedDate, setSelectedDate } = useContext(DateContext);

  const isGreek = i18n.language === 'el';
  const calendarLocale = isGreek ? 'el-GR' : 'en-US';
  const dateFnsLocale = isGreek ? el : enUS;

  const [value, setValue] = useState<Value>(new Date());
  const [isShowCalendar, setIsShowCalendar] = useState<boolean>(true);
  const [isClient, setIsClient] = useState<boolean>(false);
  const [serverError, setServerError] = useState<string>('');
  const [start, setStart] = useState<number>(0);
  const [end, setEnd] = useState<number>(4);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!(value instanceof Date)) return;
    // Store ISO in context — language-independent
    setSelectedDate(toISO(value));
  }, [value]);

  // ── Queries & Mutations ───────────────────────────────────────────────────

  const { data: slotsData, refetch: refetchSlots } = useGetMyAppointmentsQuery({
    fetchPolicy: 'cache-and-network',
  });

  const [createAppointment] = useCreateAppointmentMutation();
  const [deleteAppointment] = useDeleteAppointmentMutation();

  const slotsForDate = (slotsData?.getMyAppointments ?? []).filter(
    (s) => s.date === selectedDate,
  );

  // ── Handlers ─────────────────────────────────────────────────────────────

  const handleDateChange = (val: Value) => {
    if (val instanceof Date) setValue(val);
    else if (Array.isArray(val)) setValue(val[0]);
    else setValue(null);
  };

  const handleCancel = () => {
    setSelectedDate('');
    setValue(new Date());
  };

  const handleSet = () => setIsShowCalendar((prev) => !prev);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setServerError('');

    const element = e.currentTarget.elements.namedItem(
      'time',
    ) as HTMLInputElement;
    const time = element.value;

    if (!selectedDate) {
      setServerError(t('nutr.selectDateFirst'));
      return;
    }
    if (!time) {
      setServerError(t('nutr.selectTimeFirst'));
      return;
    }

    try {
      const result = await createAppointment({
        variables: { data: { date: selectedDate, time } },
      });
      const errors = result.data?.createAppointment?.errors;
      if (errors?.length) {
        setServerError(errors[0].message);
        return;
      }
      element.value = '';
      setStart(0);
      setEnd(4);
      await refetchSlots();
    } catch {
      setServerError(t('nutr.serverError'));
    }
  };

  const handleDelete = async (slotId: number) => {
    setServerError('');
    try {
      await deleteAppointment({ variables: { slotId } });
      setStart((prev) => Math.max(prev - 1, 0));
      await refetchSlots();
    } catch {
      setServerError(t('nutr.serverError'));
    }
  };

  const handleLoadMore = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setStart(start + 4);
    setEnd(end + 4);
  };

  const handleBack = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setStart(Math.max(start - 4, 0));
    setEnd(Math.max(end - 4, 4));
  };

  // ── Render ────────────────────────────────────────────────────────────────

  if (!isClient) return null;

  // Display version of selectedDate for the UI
  const displayDate = selectedDate
    ? toDisplay(selectedDate, dateFnsLocale)
    : '';

  return (
    <div className="mx-auto flex w-full flex-col md:grid md:grid-cols-2 md:items-center md:justify-evenly md:gap-4 md:px-3">
      {/* Left column — calendar + controls */}
      <div className="flex flex-col items-center gap-4 pt-16 px-4 lg:px-0 lg:gap-10 xl:mt-16 xl:gap-20">
        <DynamicCalendar
          onChange={handleDateChange}
          value={value}
          locale={calendarLocale}
          className="lg:mt-12 lg:scale-125 xl:scale-150"
        />
        <div className="mt-3 space-x-4 lg:scale-125">
          <button
            className="rounded-lg border-2 border-black py-1 px-7 hover:scale-110 hover:border-myRed hover:bg-myRed hover:text-white"
            onClick={handleCancel}
          >
            {t('nutr.cancel')}
          </button>
        </div>
        <div className="mx-auto my-8 max-w-[16em] rounded-lg border-2 border-black bg-myGrey-100 hover:scale-110 hover:border-myBlue-200 hover:bg-myBlue-200 hover:text-white hover:transition hover:duration-300 hover:ease-in">
          <button
            className="text-base font-bold leading-relaxed md:text-lg"
            onClick={handleSet}
          >
            {t('nutr.setAvailability')}
          </button>
        </div>
      </div>

      {/* Right column — slider OR slot manager */}
      {isShowCalendar ? (
        <div className="mt-8 md:mt-0">
          <SliderAppointments />
        </div>
      ) : (
        <div className="mt-8 lg:mt-24 xl:mt-0">
          <div className="mx-auto my-6 min-h-fit max-w-[20em] rounded-xl border-2 border-myBlue-200">
            <div className="rounded-t-xl">
              {/* Header */}
              <div className="relative rounded-t-md rounded-br-[5em] bg-myBlue-200 pb-48 text-base font-normal text-white">
                <button onClick={handleSet}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="absolute top-5 left-4 h-6 w-6"
                  >
                    <path d="M11.03 3.97a.75.75 0 010 1.06l-6.22 6.22H21a.75.75 0 010 1.5H4.81l6.22 6.22a.75.75 0 11-1.06 1.06l-7.5-7.5a.75.75 0 010-1.06l7.5-7.5a.75.75 0 011.06 0z" />
                  </svg>
                </button>
                <h2 className="absolute left-20 top-5 text-base font-bold md:text-lg">
                  {t('nutr.selectedDate')}
                </h2>
                {/* Show locale-formatted date to user, but ISO is what's in context */}
                <p className="absolute top-20 left-20 text-center font-normal">
                  {displayDate}
                </p>
                <h2 className="absolute left-20 top-32 text-base font-bold md:text-lg">
                  {t('nutr.registerAvailableHours')}
                </h2>
              </div>

              {/* Time input form */}
              <form
                onSubmit={handleSubmit}
                className="mt-4 flex flex-col items-center gap-3"
              >
                <label htmlFor="time" className="text-base font-bold">
                  {t('nutr.selectTime')}:{' '}
                  <input
                    type="time"
                    className="form-input ml-2 cursor-pointer rounded-[14px] border-none outline outline-2 outline-myGrey-200 hover:shadow-3xl hover:outline-4"
                    name="time"
                    id="time"
                  />
                </label>
                {serverError && (
                  <p className="text-sm font-semibold text-myRed">
                    {serverError}
                  </p>
                )}
                <button
                  type="submit"
                  className="rounded-md bg-myBlue-200 px-5 py-1 text-white hover:bg-myBlue-100 hover:font-bold hover:text-black hover:shadow-3xl"
                >
                  {t('nutr.register')}
                </button>
              </form>

              {/* Slots list for selected date */}
              {slotsForDate.length > 0 && (
                <div>
                  <ul className="grid grid-flow-row items-center divide-y-2 divide-black text-center">
                    {slotsForDate.slice(start, end).map((slot) => (
                      <li
                        key={slot.id}
                        className="mt-4 flex h-full w-full items-center justify-between p-3 text-base hover:bg-myBlue-100 hover:shadow-3xl"
                      >
                        <span className="flex-1 text-center">{slot.time}</span>
                        {slot.isAvailable ? (
                          <button
                            onClick={() => handleDelete(slot.id)}
                            className="ml-2 shrink-0 rounded-full p-1  hover:bg-myRed hover:text-white hover:transition hover:duration-300"
                            title={t('nutr.deleteTime')}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                              className="h-4 w-4"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.5 4.478v.227a48.816 48.816 0 013.878.512.75.75 0 11-.256 1.478l-.209-.035-1.005 13.07a3 3 0 01-2.991 2.77H8.084a3 3 0 01-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 01-.256-1.478A48.567 48.567 0 017.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 013.369 0c1.603.051 2.815 1.387 2.815 2.951zm-6.136-1.452a51.196 51.196 0 013.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 00-6 0v-.113c0-.794.609-1.428 1.364-1.452zm-.355 5.945a.75.75 0 10-1.5.058l.347 9a.75.75 0 101.499-.058l-.346-9zm5.48.058a.75.75 0 10-1.498-.058l-.347 9a.75.75 0 001.5.058l.345-9z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                        ) : (
                          <span className="ml-2 shrink-0 rounded-full bg-myBlue-200 px-2 py-0.5 text-xs text-white">
                            {t('nutr.booked')}
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                  <div className="mx-2 flex flex-row gap-2">
                    {start > 0 && (
                      <button
                        onClick={handleBack}
                        className="my-5 w-full rounded-md bg-black py-1 text-white hover:shadow-3xl"
                      >
                        {t('nutr.back')}
                      </button>
                    )}
                    {end < slotsForDate.length && (
                      <button
                        onClick={handleLoadMore}
                        className="my-5 w-full rounded-md bg-myBlue-200 py-1 text-white hover:bg-myBlue-100 hover:font-bold hover:text-black hover:shadow-3xl"
                      >
                        {t('nutr.loadMore')}
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarC;
