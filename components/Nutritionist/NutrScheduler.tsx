import React, { useState } from 'react';
import Accordion from './Helper/Accordion';
import { TableContextType } from '../Context';

interface NutrSchedulerProps {}

export const daysOfWeek = [
  'Δευτερα',
  'Τριτη',
  'Τεταρτη',
  'πεμπτη',
  'παρασκευη',
  'σαββατο',
  'κυριακη',
];
export const randomFields = [
  'Πρωινο',
  'δεκατιανο',
  'μεσημεριανο',
  'απογευματινο',
  'βραδινο',
];

export type CellInfo = Record<string, string>;

const NutrScheduler: React.FC<NutrSchedulerProps> = ({}) => {
  const [togglePreview, setTogglePreview] = useState<boolean>(false);
  const [selectedDay, setSelectedDay] = useState<string>('');
  const [selectedField, setSelectedField] = useState<string>('');
  const [cellInfo, setCellInfo] = useState<CellInfo>({});

  // A function that
  const handleSubmit = (event: React.FormEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  // A function in order to toggle my table for phone screen media
  const handleTogglePreview = () => {
    setTogglePreview(!togglePreview);
  };

  return (
    <section
      id="section_4"
      className="flex min-h-screen  w-full flex-col  bg-myGrey-100"
    >
      <TableContextType.Provider
        value={{
          selectedDay,
          selectedField,
          cellInfo,
          setSelectedDay,
          setSelectedField,
          setCellInfo,
        }}
      >
        {togglePreview ? (
          <div className=" container grid flex-1 touch-pan-x   grid-flow-col content-center justify-center   ">
            <div className="scrollbar overflow-x-auto overflow-y-hidden">
              <div className="pl-8 md:pl-0 md:text-xl  lg:text-2xl ">
                <table className="w-full border-separate border-myGrey-200 text-white">
                  <caption className="bg-myGrey-200 py-5 text-center font-bold capitalize text-white">
                    Πρόγραμμα Διατροφής για τον Xρήστη testing
                  </caption>
                  <thead>
                    <tr className="snap-x snap-mandatory">
                      <th className="snap-center">Γεύματα / Ημέρες</th>
                      {daysOfWeek.map((day) => (
                        <th
                          key={day}
                          className=" snap-center p-4 text-center capitalize"
                        >
                          {day}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {randomFields.map((field) => (
                      <tr key={field}>
                        <th className="text-center capitalize">{field}</th>

                        {daysOfWeek.map((day) => (
                          <td
                            key={`${day}-${field}`}
                            className="min-w-[18em] lg:min-w-full"
                          >
                            {cellInfo[`${day}-${field}`]}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <button
                type="submit"
                onClick={handleTogglePreview}
                className="mx-auto mt-4 block  rounded-md border-2 border-myRed py-1 px-10 font-bold   text-black hover:scale-110 hover:bg-myRed hover:font-bold  hover:text-white hover:shadow-3xl md:px-20  md:text-xl lg:px-40 lg:text-2xl  "
              >
                {togglePreview ? 'Πίσω' : 'Preview'}
              </button>
            </div>
          </div>
        ) : (
          <div>
            <h1 className="mt-4 text-center text-2xl font-bold lg:text-4xl">
              Δημιουργία Προγράμματος Διατροφής
            </h1>
            <Accordion />
            <div className="mx-auto my-8 flex w-full flex-col items-center justify-center lg:my-10">
              <button
                type="submit"
                onSubmit={handleSubmit}
                className="mx-auto  block  rounded-md border-2 border-myBlue-200 bg-myBlue-200 px-28 py-2 font-bold  text-white hover:scale-110  hover:font-bold  hover:shadow-3xl md:mx-6 md:px-40 md:text-lg lg:px-60  lg:text-2xl "
              >
                Ορισμός
              </button>
              <button
                type="submit"
                onClick={handleTogglePreview}
                className="mx-auto mt-4 block  rounded-md border-2 border-black py-2 px-16 font-bold   text-black hover:scale-110 hover:bg-myGrey-200 hover:font-bold hover:text-white hover:shadow-3xl hover:transition   hover:duration-500 md:px-20 md:text-lg lg:px-40 lg:text-2xl "
              >
                {togglePreview ? 'Πίσω' : 'Preview'}
              </button>
            </div>
          </div>
        )}
      </TableContextType.Provider>
    </section>
  );
};

export default NutrScheduler;
