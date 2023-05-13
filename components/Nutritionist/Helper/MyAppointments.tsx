import React, { useContext, useState } from 'react';
import { DateContext } from '../../Context';
import { Appointment, fakeAppointments } from '../CalendarC';
import profile from '/public/images/myphoto.jpg';
import Image from 'next/image';

interface MyAppointmentsProps {
  customClassName: string;
  customDateClassName: string;
  textColor: string;
  showAttrs: boolean;
  marginCustom: string;
  emptyAppointments: string;
}

interface GroupedAppointments {
  [date: string]: Appointment[];
}

const MyAppointments: React.FC<MyAppointmentsProps> = ({
  customClassName,
  customDateClassName,
  textColor,
  showAttrs,
  marginCustom,
  emptyAppointments,
}) => {
  const [start, setStart] = useState<number>(0);
  const [end, setEnd] = useState<number>(3);
  const { selectedDate } = useContext(DateContext);

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

  const sortedDates: string[] = Object.keys(groupedAppointments).sort(
    (a, b) => {
      return new Date(a).getTime() - new Date(b).getTime();
    }
  );

  const counterDate: number[] = Object.keys(groupedAppointments).map(
    (date: string): number => {
      if (date === selectedDate) {
        return 1;
      }
      return 0;
    }
  );

  const checkIfTrue: number = counterDate.reduce(
    (total: number, currVal: number): number => total + currVal,
    0
  );
  return (
    <div className="">
      {checkIfTrue >= 1 ? (
        sortedDates.map(
          (date, index) =>
            date === selectedDate && (
              <div key={`${date}_${index}`} className={customClassName}>
                <div className=" ">
                  <h2
                    className={`relative z-[2] w-full pb-6 text-center text-2xl font-bold text-${textColor}  `}
                  >
                    {date.replace(/-/g, '  ')}
                  </h2>

                  <span className={customDateClassName}>
                    <span className="absolute -top-[5.2em] left-3  z-[1] block h-[5em] w-[16em] -skew-y-3 bg-myBlue-200 "></span>
                  </span>
                  <div
                    className={
                      showAttrs
                        ? ''
                        : 'min-h-[20em] rounded-2xl border-2 border-black bg-black bg-opacity-80 '
                    }
                  >
                    <ul className={`${marginCustom}`}>
                      {groupedAppointments[date]
                        .slice(start, end)
                        .map((appointment, appointmentIndex) => (
                          <li
                            key={`${date}_${index}_${appointmentIndex}`}
                            className="mx-auto my-3 flex max-w-xs flex-row  items-center gap-3 rounded-lg border-2 border-black bg-white text-base font-bold leading-4 hover:scale-110 hover:bg-myBlue-200 hover:text-white hover:shadow-3xl  hover:transition hover:duration-500"
                          >
                            <Image
                              src={profile}
                              alt={''}
                              className="max-h-10 max-w-[2.5em]   rounded-full object-cover object-top"
                            ></Image>
                            <div className="grow">{appointment.fullname} </div>
                            <span className="shrink-0 ">
                              {appointment.time}
                            </span>{' '}
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
                        {end < groupedAppointments[date].length &&
                          showAttrs && (
                            <button
                              onClick={handleLoadMore}
                              className="my-5 w-full rounded-md border-2 border-black bg-white  py-1  font-bold text-black  hover:bg-myBlue-100 hover:font-bold hover:text-black hover:shadow-3xl"
                            >
                              Περισσότερα
                            </button>
                          )}
                      </div>
                    </ul>
                  </div>
                </div>
              </div>
            )
        )
      ) : (
        <div
          className={`relative z-[3]    h-[13em] w-[20em] rounded-xl ${emptyAppointments}  bg-white`}
        >
          <div className="absolute   z-[5] px-4 py-8 text-center text-xl font-bold">
            Δεν υπάρχουν διαθέσιμα ραντεβού για τις <br />
            <span className="relative inline-block">
              <span className="absolute -left-10 top-3 z-[6] block h-[3em] w-[12em] -skew-y-3 bg-myRed "></span>
              <span className="relative top-6 z-[10] text-white">
                {selectedDate}
              </span>
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyAppointments;
