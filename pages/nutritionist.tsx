import { NextPage } from 'next';

import React, { useState } from 'react';
import Footer from '../components/Footer';
import NutrNavbar from '../components/Nutritionist/NutrNavbar';

import CalendarC from '../components/Nutritionist/CalendarC';
import NutrArticles from '../components/Nutritionist/NutrArticles';
import NutrAppointments from '../components/Nutritionist/NutrAppointments';

import { DateContext } from '../components/Context';
import NutrScheduler from '../components/Nutritionist/NutrScheduler';
import ScrollToTopButton from '../components/Helper/ScrollToTopButton';

const Nutritionist: NextPage = ({}) => {
  const [isShowCalendar, setIsShowCalendar] = useState<boolean>(true);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTimes, setSelectedTimes] = useState<{
    [key: string]: string[];
  }>({});
  const [start, setStart] = useState<number>(0);
  const [end, setEnd] = useState<number>(4);

  const handleSet = () => {
    setIsShowCalendar(!isShowCalendar);
    setSelectedTimes({});
  };

  // ToDO: Να φτιάξω κουμπί διαγραφής για τις ώρες
  // TODO: Να φτιάξω το κομμάτι της αποθήκευσης όταν το συνδέσω με την βάση

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

  return (
    <React.Fragment>
      <NutrNavbar />

      <main>
        <NutrArticles />

        <DateContext.Provider value={{ selectedDate, setSelectedDate }}>
          <section id="section_2" className=" min-h-screen ">
            {isShowCalendar ? (
              <div className="h-full">
                <CalendarC />
                <div className="mx-auto mt-12 max-w-[16em] rounded-lg border-2 border-black bg-myGrey-100 hover:scale-110 hover:bg-myBlue-200 hover:text-white hover:transition hover:duration-300 hover:ease-in">
                  <button className="font-bold " onClick={handleSet}>
                    Ρύθμιση Διαθεσιμότητας Hμερομηνιών και Ωρών
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="mx-auto mt-6 min-h-fit max-w-[20em] rounded-xl border-2 border-myBlue-200 ">
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
                      <h1 className="absolute left-20 top-5  font-bold">
                        Επιλεγμένη <br /> Ημερομηνία:
                      </h1>
                      <p className="absolute top-20 left-20 text-center font-normal">
                        {selectedDate.replace(/-/g, '  ')}
                      </p>
                      <h2 className="absolute left-20 top-32 font-bold">
                        Καταχώρηση <br />
                        Διαθέσιμων ωρών
                      </h2>
                    </div>
                    <div>
                      <form
                        onSubmit={handleSubmit}
                        className="mt-4 flex flex-col items-center gap-3"
                      >
                        <label htmlFor="time" className="text-base font-bold">
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
                                  className=" mt-4 h-full w-full p-3 hover:bg-myBlue-100  hover:shadow-3xl "
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
          </section>

          <NutrAppointments />
        </DateContext.Provider>

        <NutrScheduler />
        <ScrollToTopButton />
      </main>

      <Footer></Footer>
    </React.Fragment>
  );
};

export default Nutritionist;
