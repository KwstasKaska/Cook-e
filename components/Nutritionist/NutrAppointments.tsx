import Image from 'next/image';
import React, { useContext, useState } from 'react';
import { DateContext } from '../Context';
import { Appointment, fakeAppointments } from './CalendarC';
import profile from '/public/images/myphoto.jpg';

interface NutrAppointmentsProps {}

interface GroupedAppointments {
  [date: string]: Appointment[];
}

const NutrAppointments: React.FC<NutrAppointmentsProps> = ({}) => {
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
    <section id="section_3" className="grid min-h-screen  bg-myGrey-200">
      <div className="">
        <h1 className="relative z-[2] pt-6 text-center text-2xl font-bold text-white  hover:text-myRed">
          Σημερινά Ραντεβού
        </h1>
        <div className="relative mx-auto   max-w-[19em]  content-center rounded-2xl bg-white px-4 shadow-2xl transition duration-500 hover:scale-110">
          {checkIfTrue >= 1 ? (
            sortedDates.map(
              (date, index) =>
                date === selectedDate && (
                  <div key={`${date}_${index}`} className="">
                    <h2 className="relative z-[2] w-full pb-6 text-center text-2xl font-bold text-white">
                      {date.replace(/-/g, '  ')}
                    </h2>
                    <span className="absolute">
                      <span className="absolute -top-[5.2em] left-3  z-[1] block h-[5em] w-[16em] -skew-y-3 bg-myRed "></span>
                    </span>
                    {/* <h3 className="w-full text-center text-sm ">
                      Eπιστροφή στην τωρινή
                    </h3> */}

                    <ul>
                      {groupedAppointments[date]
                        .slice(start, end)
                        .map((appointment, appointmentIndex) => (
                          <li
                            key={`${date}_${index}_${appointmentIndex}`}
                            className="mx-auto my-3 flex max-w-xs   flex-row items-center gap-3 rounded-lg border-2 border-black text-base font-bold leading-4 hover:scale-110 hover:bg-myRed hover:shadow-3xl "
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
                        {end < groupedAppointments[date].length && (
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
                )
            )
          ) : (
            // ToDO: να προσθέσω animations και transitions
            <div className="relative ">
              {/* <div className="absolute  top-32 -left-5 z-[2] h-[10em] w-[20em] -rotate-[6deg] bg-myGrey-100"></div> */}
              <div className="absolute  -left-5 z-[3] h-[10em] w-[20em] rounded-xl  bg-myBlue-100"></div>

              <div className="absolute top-4  z-[5]  text-center text-xl font-bold">
                Δεν έχετε διαθέσιμα ραντεβού για τις <br />
                <span className="relative">
                  <span className="absolute -left-10 top-3 z-[6] block h-[3em] w-[12em] -skew-y-3 bg-myRed "></span>
                  <span className="relative top-6 z-[10] text-white">
                    {selectedDate}
                  </span>
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default NutrAppointments;
