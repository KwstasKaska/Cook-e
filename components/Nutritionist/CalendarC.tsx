import React, {
  InputHTMLAttributes,
  useContext,
  useEffect,
  useState,
} from 'react';
import dynamic from 'next/dynamic';

import { format } from 'date-fns';
import { el } from 'date-fns/locale';

import { ClientsContextType, DateContext } from '../Context';
import SliderAppointments from './Helper/SliderAppointments';
const DynamicCalendar = dynamic(() => import('react-calendar'), {
  ssr: false,
});

export type Appointment = InputHTMLAttributes<HTMLInputElement> & {
  date: string;
  profile: string;
  fullname: string;
  time: string;
  comments: string;
  telephone: string;
};

export const fakeAppointments: Appointment[] = [
  {
    date: '11-Μαρτίου-2023',
    profile: require('/public/images/myphoto.jpg'),
    fullname: 'John Doe',
    time: '12:00-13:00',
    comments:
      'asdgqwergasfgasgasdgAGW ASDFAERAWG ASDFGAVA asdgawergagasfgas adfgasgasfgafsg',
    telephone: '432442626232',
  },
  {
    date: '11-Μαρτίου-2023',
    profile: require('/public/images/myphoto.jpg'),
    fullname: 'Κωνσταντίνος Κασκαντιρης',
    time: '13:00-14:00',
    comments: 'asdgqwergasfgasgas',
    telephone: '432442626232',
  },
  {
    date: '24-Μαρτίου-2023',
    profile: require('/public/images/myphoto.jpg'),
    fullname: 'Bob Johnson',
    time: '15:00-17:00',
    comments: 'asdgqwergasfgasgas',
    telephone: '432442626233',
  },
  {
    date: '12-Μαρτίου-2023',
    profile: require('/public/images/myphoto.jpg'),
    fullname: 'Bob Johnson',
    time: '15:00-17:00',
    comments: 'asdgqwergasfgasgas',
    telephone: '432442626236',
  },
  {
    date: '11-Μαρτίου-2023',
    profile: require('/public/images/myphoto.jpg'),
    fullname: 'Bob Johnson',
    time: '15:00-17:00',
    comments: 'asdgqwergasfgasgas',
    telephone: '432442626287',
  },
  {
    date: '13-Μαρτίου-2023',
    profile: require('/public/images/myphoto.jpg'),
    fullname: 'Bob Johnson',
    time: '15:00-17:00',
    comments: 'asdgqwergasfgasgas',
    telephone: '432442626298',
  },
  {
    date: '16-Μαρτίου-2023',
    profile: require('/public/images/myphoto.jpg'),
    fullname: 'Bob Johnson',
    time: '15:00-17:00',
    comments: 'asdgqwergasfgasgas',
    telephone: '4324426262233',
  },
  {
    date: '11-Μαρτίου-2023',
    profile: require('/public/images/myphoto.jpg'),
    fullname: 'Bob Johnson',
    time: '15:00-17:00',
    comments: 'asdgqwergasfgasgas',
    telephone: '4324426262233',
  },
];

const CalendarC: React.FC = () => {
  const [value, onChange] = useState<Date>(new Date());
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
    handleApply();
  }, [selectedDate]);

  // My button functions

  const handleCancel = () => {
    setSelectedDate('');
    onChange(new Date());
  };

  const handleApply = () => {
    const formattedDate = format(value, 'dd-MMMM-yyyy', { locale: el });
    const filteredClients = fakeAppointments.filter(
      (appointment) => appointment.date === formattedDate
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
      'time'
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
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
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

  const arrayLength = Object.values(selectedTimes).map((array) => array.length);
  const numberArrayLength = arrayLength[0];

  return isClient ? (
    <ClientsContextType.Provider value={{ clients, setClients }}>
      <div className="mx-auto  w-full  md:grid md:grid-cols-2  md:items-center md:justify-evenly md:gap-4 md:px-3">
        <div className=" flex  flex-col items-center gap-4 pt-16 lg:gap-10 xl:mt-16 xl:gap-20">
          <DynamicCalendar
            onChange={onChange}
            className="lg:mt-12  lg:scale-125 xl:scale-150"
          />
          <div className="mt-3 space-x-4 lg:scale-125 ">
            <button
              className="rounded-lg border-2 border-black py-1 px-7 hover:scale-110 hover:border-myRed hover:bg-myRed hover:text-white "
              onClick={handleCancel}
            >
              Ακύρωση
            </button>
            <button
              className=" rounded-lg bg-myGrey-200 py-2 px-7 text-white hover:scale-110 hover:bg-myBlue-200"
              onClick={handleApply}
            >
              Εφαρμογή
            </button>
          </div>
          <div className="mx-auto my-8 max-w-[16em] rounded-lg border-2 border-black bg-myGrey-100 hover:scale-110 hover:border-myBlue-200 hover:bg-myBlue-200 hover:text-white hover:transition hover:duration-300 hover:ease-in">
            <button className="font-bold " onClick={handleSet}>
              Ρύθμιση Διαθεσιμότητας Hμερομηνιών και Ωρών
            </button>
          </div>
        </div>

        {isShowCalendar ? (
          <SliderAppointments />
        ) : (
          <div className="lg:mt-24  xl:mt-0">
            <div className="mx-auto my-6 min-h-fit max-w-[20em] rounded-xl border-2 border-myBlue-200 ">
              <div className=" rounded-t-xl">
                <div className="relative rounded-t-md rounded-br-[5em] bg-myBlue-200 pb-48 text-lg font-normal text-white">
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
                  <h1 className="absolute left-20 top-5  font-bold lg:text-2xl">
                    Επιλεγμένη <br /> Ημερομηνία:
                  </h1>
                  <p className="absolute top-20 left-20 text-center font-normal lg:text-xl">
                    {selectedDate.replace(/-/g, '  ')}
                  </p>
                  <h2 className="absolute left-20 top-32 font-bold lg:text-2xl">
                    Καταχώρηση <br />
                    Διαθέσιμων ωρών
                  </h2>
                </div>
                <div>
                  <form
                    onSubmit={handleSubmit}
                    className="mt-4 flex flex-col items-center gap-3"
                  >
                    <label
                      htmlFor="time"
                      className="text-base font-bold lg:text-lg"
                    >
                      Διαλέξτε ώρα {''} {':'} {''}
                      <input
                        type="time"
                        className="form-input ml-2 cursor-pointer rounded-[14px]  border-none  outline outline-2 outline-myGrey-200  hover:shadow-3xl hover:outline-4"
                        name="time"
                        id="time"
                      />
                    </label>
                    <button
                      type="submit"
                      className="rounded-md bg-myBlue-200 px-5 py-1  text-white   hover:bg-myBlue-100 hover:font-bold hover:text-black hover:shadow-3xl"
                    >
                      Καταχώρηση
                    </button>
                  </form>
                </div>
                {selectedTimes && (
                  <div>
                    {Object.entries(selectedTimes).map(
                      ([date, times], index) => (
                        <ul
                          key={`${date}_${index}`}
                          className="grid  grid-flow-row items-center divide-y-2 divide-black text-center"
                        >
                          {times.slice(start, end).map((time, index) => (
                            <li
                              key={index}
                              className=" mt-4 h-full w-full p-3 hover:bg-myBlue-100  hover:shadow-3xl lg:text-lg"
                            >
                              {time}
                            </li>
                          ))}
                        </ul>
                      )
                    )}
                    <div className="mx-2 flex flex-row gap-2">
                      {start > 0 && (
                        <button
                          onClick={handleBack}
                          className="my-5  w-full rounded-md bg-black  py-1  text-white hover:shadow-3xl"
                        >
                          Πίσω
                        </button>
                      )}
                      {end < numberArrayLength && (
                        <button
                          onClick={handleLoadMore}
                          className="my-5 w-full rounded-md bg-myBlue-200  py-1  text-white  hover:bg-myBlue-100 hover:font-bold hover:text-black hover:shadow-3xl"
                        >
                          Περισσότερα
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
