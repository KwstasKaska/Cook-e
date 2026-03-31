import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'next-i18next';

import dynamic from 'next/dynamic';

import { format } from 'date-fns';
import { el } from 'date-fns/locale';
import { Value } from 'react-calendar/dist/cjs/shared/types';

import { ClientsContextType, DateContext } from '../Context';
import SliderAppointments from './Helper/SliderAppointments';
const DynamicCalendar = dynamic(() => import('react-calendar'), {
  ssr: false,
});

export interface Appointment {
  date: string;
  profile: string;
  fullname: string;
  time: string;
  comments: string;
  telephone: string;
}

export const fakeAppointments: Appointment[] = [
  {
    date: '12-Ιουλίου-2025',
    profile: require('/public/images/myphoto.jpg'),
    fullname: 'John Doe',
    time: '12:00-13:00',
    comments:
      'asdgqwergasfgasgasdgAGW ASDFAERAWG ASDFGAVA asdgawergagasfgas adfgasgasfgafsg',
    telephone: '432442626232',
  },
  {
    date: '11-Ιουλίου-2025',
    profile: require('/public/images/myphoto.jpg'),
    fullname: 'Κωνσταντίνος Κασκαντιρης',
    time: '13:00-14:00',
    comments: 'asdgqwergasfgasgas',
    telephone: '432442626232',
  },
  {
    date: '12-Ιουλίου-2025',
    profile: require('/public/images/myphoto.jpg'),
    fullname: 'Bob Johnson',
    time: '15:00-17:00',
    comments: 'asdgqwergasfgasgas',
    telephone: '432442626233',
  },
  {
    date: '12-Ιουλίου-2025',
    profile: require('/public/images/myphoto.jpg'),
    fullname: 'Bob Johnson',
    time: '15:00-17:00',
    comments: 'asdgqwergasfgasgas',
    telephone: '432442626236',
  },
  {
    date: '13-Ιουλίου-2025',
    profile: require('/public/images/myphoto.jpg'),
    fullname: 'Bob Johnson',
    time: '15:00-17:00',
    comments: 'asdgqwergasfgasgas',
    telephone: '432442626287',
  },
  {
    date: '12-Ιουλίου-2025',
    profile: require('/public/images/myphoto.jpg'),
    fullname: 'Bob Johnson',
    time: '15:00-17:00',
    comments: 'asdgqwergasfgasgas',
    telephone: '432442626298',
  },
  {
    date: '12-Ιουλίου-2025',
    profile: require('/public/images/myphoto.jpg'),
    fullname: 'Bob Johnson',
    time: '15:00-17:00',
    comments: 'asdgqwergasfgasgas',
    telephone: '4324426262233',
  },
  {
    date: '12-Ιουλίου-2025',
    profile: require('/public/images/myphoto.jpg'),
    fullname: 'Bob Johnson',
    time: '15:00-17:00',
    comments: 'asdgqwergasfgasgas',
    telephone: '4324426262233',
  },
];

const CalendarC: React.FC = () => {
  const { t } = useTranslation('common');
  const [value, setValue] = useState<Value>(new Date());
  const [isShowCalendar, setIsShowCalendar] = useState<boolean>(true);
  const [clients, setClients] = useState<Appointment[]>([]);
  const [isClient, setIsClient] = useState<boolean>(false);
  const { selectedDate, setSelectedDate } = useContext(DateContext);
  const [selectedTimes, setSelectedTimes] = useState<{
    [key: string]: string[];
  }>({});
  const [start, setStart] = useState<number>(0);
  const [end, setEnd] = useState<number>(4);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!(value instanceof Date)) return;

    const formattedDate = format(value, 'dd-MMMM-yyyy', { locale: el });
    const filteredClients = fakeAppointments.filter(
      (appointment) => appointment.date === formattedDate,
    );
    setClients(filteredClients);
    setSelectedDate(formattedDate);
  }, [value]);

  const handleDateChange = (val: Value) => {
    if (val instanceof Date) {
      setValue(val);
    } else if (Array.isArray(val)) {
      setValue(val[0]);
    } else {
      setValue(null);
    }
  };

  const handleCancel = () => {
    setSelectedDate('');
    setValue(new Date());
  };

  const handleApply = () => {
    if (!(value instanceof Date)) return;

    const formattedDate = format(value, 'dd-MMMM-yyyy', { locale: el });
    const filteredClients = fakeAppointments.filter(
      (appointment) => appointment.date === formattedDate,
    );
    setClients(filteredClients);
    setSelectedDate(formattedDate);
  };

  const handleSet = () => {
    setIsShowCalendar(!isShowCalendar);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const element = e.currentTarget.elements.namedItem(
      'time',
    ) as HTMLInputElement;
    const value = element.value;

    setSelectedTimes((prevTimes) => {
      const timesForSelectedDate = prevTimes[selectedDate] || [];
      return {
        ...prevTimes,
        [selectedDate]: [...timesForSelectedDate, value],
      };
    });
  };

  const handleLoadMore = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.preventDefault();
    setStart(start + 4);
    setEnd(end + 4);
  };

  const handleBack = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    setStart(Math.max(start - 4, 0));
    setEnd(Math.max(end - 4, 4));
  };

  const handleDelete = (date: string, indexToRemove: number) => {
    setSelectedTimes((prevTimes) => {
      const updatedTimes = prevTimes[date].filter(
        (_, i) => i !== indexToRemove,
      );
      // If no times remain for that date, remove the date key entirely
      if (updatedTimes.length === 0) {
        const { [date]: _, ...rest } = prevTimes;
        return rest;
      }
      return { ...prevTimes, [date]: updatedTimes };
    });
    // Pull pagination back if the current page becomes empty after deletion
    setStart((prev) => Math.max(prev - 1 < 0 ? 0 : prev, 0));
  };

  const arrayLength = Object.values(selectedTimes).map((array) => array.length);
  const numberArrayLength = arrayLength[0];

  return isClient ? (
    <ClientsContextType.Provider value={{ clients, setClients }}>
      <div className="mx-auto flex w-full flex-col md:grid md:grid-cols-2 md:items-center md:justify-evenly md:gap-4 md:px-3">
        <div className="flex flex-col items-center gap-4 pt-16 lg:gap-10 xl:mt-16 xl:gap-20">
          <DynamicCalendar
            onChange={handleDateChange}
            value={value}
            className="lg:mt-12 lg:scale-125 xl:scale-150"
          />
          <div className="mt-3 space-x-4 lg:scale-125">
            <button
              className="rounded-lg border-2 border-black py-1 px-7 hover:scale-110 hover:border-myRed hover:bg-myRed hover:text-white"
              onClick={handleCancel}
            >
              {t('nutr.cancel')}
            </button>
            <button
              className="rounded-lg bg-myGrey-200 py-2 px-7 text-white hover:scale-110 hover:bg-myBlue-200"
              onClick={handleApply}
            >
              {t('nutr.apply')}
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

        {isShowCalendar ? (
          <div className="mt-8 md:mt-0">
            <SliderAppointments />
          </div>
        ) : (
          <div className="mt-8 lg:mt-24 xl:mt-0">
            <div className="mx-auto my-6 min-h-fit max-w-[20em] rounded-xl border-2 border-myBlue-200">
              <div className="rounded-t-xl">
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
                  <p className="absolute top-20 left-20 text-center font-normal">
                    {selectedDate.replace(/-/g, '  ')}
                  </p>
                  <h2 className="absolute left-20 top-32 text-base font-bold md:text-lg">
                    {t('nutr.registerAvailableHours')}
                  </h2>
                </div>
                <div>
                  <form
                    onSubmit={handleSubmit}
                    className="mt-4 flex flex-col items-center gap-3"
                  >
                    <label htmlFor="time" className="text-base font-bold">
                      {t('nutr.selectTime')}
                      {':'}{' '}
                      <input
                        type="time"
                        className="form-input ml-2 cursor-pointer rounded-[14px] border-none outline outline-2 outline-myGrey-200 hover:shadow-3xl hover:outline-4"
                        name="time"
                        id="time"
                      />
                    </label>
                    <button
                      type="submit"
                      className="rounded-md bg-myBlue-200 px-5 py-1 text-white hover:bg-myBlue-100 hover:font-bold hover:text-black hover:shadow-3xl"
                    >
                      {t('nutr.register')}
                    </button>
                  </form>
                </div>
                {selectedTimes && (
                  <div>
                    {Object.entries(selectedTimes).map(
                      ([date, times], index) => (
                        <ul
                          key={`${date}_${index}`}
                          className="grid grid-flow-row items-center divide-y-2 divide-black text-center"
                        >
                          {times.slice(start, end).map((time, index) => (
                            <li
                              key={index}
                              className="mt-4 flex h-full w-full items-center justify-between p-3 text-base hover:bg-myBlue-100 hover:shadow-3xl"
                            >
                              <span className="flex-1 text-center">{time}</span>
                              <button
                                onClick={() =>
                                  handleDelete(date, start + index)
                                }
                                className="ml-2 shrink-0 rounded-full p-1 text-myGrey-200 hover:bg-myRed hover:text-white hover:transition hover:duration-300"
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
                            </li>
                          ))}
                        </ul>
                      ),
                    )}
                    <div className="mx-2 flex flex-row gap-2">
                      {start > 0 && (
                        <button
                          onClick={handleBack}
                          className="my-5 w-full rounded-md bg-black py-1 text-white hover:shadow-3xl"
                        >
                          {t('nutr.back')}
                        </button>
                      )}
                      {end < numberArrayLength && (
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
    </ClientsContextType.Provider>
  ) : null;
};

export default CalendarC;
