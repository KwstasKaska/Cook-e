import Image from 'next/image';
import React, { useState } from 'react';
import { Appointment, fakeAppointments } from './CalendarC';
import profile from '/public/images/myphoto.jpg';

interface NutrAppointmentsProps {}

interface GroupedAppointments {
  [date: string]: Appointment[];
}

const NutrAppointments: React.FC<NutrAppointmentsProps> = ({}) => {
  const [start, setStart] = useState<number>(0);
  const [end, setEnd] = useState<number>(3);
  const groupedAppointments: GroupedAppointments = {};

  fakeAppointments.forEach((appointment) => {
    const date = appointment.date;

    if (!groupedAppointments[date]) {
      groupedAppointments[date] = [appointment];
    } else {
      groupedAppointments[date].push(appointment);
    }
  });

  const handleLoadMore = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    setStart(start + 3);
    setEnd(end + 3);
  };

  const handleBack = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    setStart(Math.max(start - 3, 0));
    setEnd(Math.max(end - 3, 3));
  };

  const arrayLength = Object.values(groupedAppointments).map(
    (array) => array.length
  );
  const numberArrayLength = arrayLength[0];

  return (
    <section className="h-screen bg-myGrey-200">
      <div className="">
        <h1 className="text-2xl font-bold text-white">Σημερινά Ραντεβού</h1>
        <div className="tex rounded-md bg-white">
          {Object.entries(groupedAppointments).map(([date, appointments]) => (
            <div key={date}>
              <h2 className="text-lg font-bold">{date}</h2>
              <ul>
                {appointments.slice(start, end).map((appointment, index) => (
                  <li
                    key={index}
                    className="mx-auto my-3 flex max-w-xs   flex-row items-center gap-3 rounded-lg border-2 border-black text-base font-bold leading-4"
                  >
                    <Image
                      src={profile}
                      alt={''}
                      className="max-h-10 max-w-[2.5em]   rounded-full object-cover object-top"
                    ></Image>
                    <div className="grow">{appointment.fullname} </div>
                    <span className="shrink-0 ">{appointment.time}</span>{' '}
                  </li>
                ))}
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
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NutrAppointments;
