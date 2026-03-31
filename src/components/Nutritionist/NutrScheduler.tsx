import React, { useState } from 'react';
import { useTranslation } from 'next-i18next';
import Accordion from './Helper/Accordion';
import { TableContextType } from '../Context';

interface NutrSchedulerProps {}

export const daysOfWeek = [
  'Δευτέρα',
  'Τρίτη',
  'Τετάρτη',
  'Πέμπτη',
  'Παρασκευή',
  'Σάββατο',
  'Κυριακή',
];
export const randomFields = [
  'Πρωινό',
  'δεκατιανό',
  'μεσημεριανό',
  'απογευματινό',
  'βραδινό',
];

export type CellInfo = Record<string, string>;

const NutrScheduler: React.FC<NutrSchedulerProps> = ({}) => {
  const { t } = useTranslation('common');
  const [togglePreview, setTogglePreview] = useState<boolean>(false);
  const [selectedDay, setSelectedDay] = useState<string>('');
  const [selectedField, setSelectedField] = useState<string>('');
  const [cellInfo, setCellInfo] = useState<CellInfo>({});

  const handleSubmit = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    // TODO: connect to GraphQL mutation to persist the schedule
  };

  const handleTogglePreview = () => {
    setTogglePreview(!togglePreview);
  };

  return (
    <section
      id="section_4"
      className="flex min-h-screen w-full flex-col bg-myGrey-100"
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
          <div className="container grid flex-1 touch-pan-x grid-flow-col content-center justify-center">
            <div className="scrollbar overflow-x-auto overflow-y-hidden">
              <div className="pl-8 md:pl-0 md:text-base lg:text-lg">
                <table className="w-full border-separate border-myGrey-200 text-white">
                  <caption className="bg-myGrey-200 py-5 text-center text-base font-bold text-white md:text-lg">
                    {t('nutr.nutritionPlanFor')} testing
                  </caption>
                  <thead>
                    <tr className="snap-x snap-mandatory">
                      <th className="snap-center text-base font-bold md:text-lg">
                        {t('nutr.mealsAndDays')}
                      </th>
                      {daysOfWeek.map((day) => (
                        <th
                          key={day}
                          className="snap-center p-4 text-center text-base capitalize md:text-lg"
                        >
                          {day}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {randomFields.map((field) => (
                      <tr key={field}>
                        <th className="text-center text-base capitalize md:text-lg">
                          {field}
                        </th>
                        {daysOfWeek.map((day) => (
                          <td
                            key={`${day}-${field}`}
                            className="min-w-[18em] text-base lg:min-w-full"
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
                type="button"
                onClick={handleTogglePreview}
                className="mx-auto mt-4 block rounded-md border-2 border-myRed py-1 px-10 text-base font-bold text-black hover:scale-110 hover:bg-myRed hover:text-white hover:shadow-3xl md:px-20 md:text-lg"
              >
                {t('nutr.back')}
              </button>
            </div>
          </div>
        ) : (
          <div>
            <h2 className="mt-4 text-center text-2xl font-bold md:text-4xl">
              {t('nutr.createNutritionPlan')}
            </h2>
            <Accordion />
            <div className="mx-auto my-8 flex w-full flex-col items-center justify-center lg:my-10">
              <button
                type="button"
                onSubmit={handleSubmit}
                className="mx-auto block rounded-md border-2 border-myBlue-200 bg-myBlue-200 px-28 py-2 text-base font-bold text-white hover:scale-110 hover:shadow-3xl md:mx-6 md:px-40 md:text-lg"
              >
                {t('nutr.set')}
              </button>
              <button
                type="submit"
                onClick={handleTogglePreview}
                className="mx-auto mt-4 block rounded-md border-2 border-black py-2 px-16 text-base font-bold text-black hover:scale-110 hover:bg-myGrey-200 hover:text-white hover:shadow-3xl hover:transition hover:duration-500 md:px-20 md:text-lg"
              >
                {t('nutr.preview')}
              </button>
            </div>
          </div>
        )}
      </TableContextType.Provider>
    </section>
  );
};

export default NutrScheduler;
