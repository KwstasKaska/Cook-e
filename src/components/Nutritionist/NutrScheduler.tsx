import React, { useState, useMemo } from 'react';
import { useTranslation } from 'next-i18next';
import Accordion from './Helper/Accordion';
import { TableContextType } from '../Context';
import {
  AppointmentStatus,
  DayOfWeek,
  MealType,
  useCreateMealSchedulerMutation,
  useGetAppointmentRequestsForNutritionistQuery,
} from '../../generated/graphql';

export const daysOfWeek: DayOfWeek[] = [
  DayOfWeek.Monday,
  DayOfWeek.Tuesday,
  DayOfWeek.Wednesday,
  DayOfWeek.Thursday,
  DayOfWeek.Friday,
  DayOfWeek.Saturday,
  DayOfWeek.Sunday,
];

export const randomFields: MealType[] = [
  MealType.Breakfast,
  MealType.Snack,
  MealType.Lunch,
  MealType.Afternoon,
  MealType.Dinner,
];

export type CellInfo = Record<string, string>;

const NutrScheduler: React.FC = () => {
  const { t } = useTranslation('common');

  const [togglePreview, setTogglePreview] = useState(false);
  const [selectedDay, setSelectedDay] = useState<DayOfWeek | ''>('');
  const [selectedField, setSelectedField] = useState<MealType | ''>('');
  const [cellInfo, setCellInfo] = useState<CellInfo>({});
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [serverError, setServerError] = useState('');
  const [fieldError, setFieldError] = useState('');

  const { data: reqData } = useGetAppointmentRequestsForNutritionistQuery();
  const [createMealScheduler] = useCreateMealSchedulerMutation();

  const acceptedClients = useMemo(() => {
    const seen = new Set<number>();
    const clients: { id: number; username: string }[] = [];
    (reqData?.getAppointmentRequestsForNutritionist ?? []).forEach((r) => {
      if (
        r.status === AppointmentStatus.Accepted &&
        r.client &&
        !seen.has(r.client.id)
      ) {
        seen.add(r.client.id);
        clients.push({ id: r.client.id, username: r.client.username });
      }
    });
    return clients;
  }, [reqData]);

  const selectedUsername =
    acceptedClients.find((c) => c.id === selectedUserId)?.username ?? 'testing';

  const handleSubmit = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setServerError('');
    setFieldError('');

    if (!selectedUserId) {
      setFieldError(t('nutr.selectUserFirst'));
      return;
    }
    if (!selectedDay) {
      setFieldError(t('nutr.selectDayFirst'));
      return;
    }
    if (!selectedField) {
      setFieldError(t('nutr.selectMealFirst'));
      return;
    }
    const comment = cellInfo[`${selectedDay}-${selectedField}`] ?? '';
    if (!comment.trim()) {
      setFieldError(t('nutr.setContentFirst'));
      return;
    }

    try {
      const result = await createMealScheduler({
        variables: {
          userId: selectedUserId,
          day: selectedDay,
          mealType: selectedField,
          comment,
        },
      });

      if (result.data?.createMealScheduler.errors?.length) {
        setFieldError(result.data.createMealScheduler.errors[0].message);
        return;
      }

      // Clear the submitted cell
      setCellInfo((prev) => {
        const next = { ...prev };
        delete next[`${selectedDay}-${selectedField}`];
        return next;
      });
    } catch {
      setServerError(t('nutr.serverError'));
    }
  };

  return (
    <section
      id="section_4"
      className="flex min-h-screen w-full flex-col bg-myGrey-100"
    >
      <TableContextType.Provider
        value={{
          selectedDay,
          setSelectedDay: setSelectedDay as (d: string) => void,
          selectedField,
          setSelectedField: setSelectedField as (f: string) => void,
          cellInfo,
          setCellInfo,
          selectedUserId,
          setSelectedUserId,
        }}
      >
        {togglePreview ? (
          <div className="container grid flex-1 touch-pan-x grid-flow-col content-center justify-center">
            <div className="scrollbar overflow-x-auto overflow-y-hidden">
              <div className="pl-8 md:pl-0 md:text-base lg:text-lg">
                <table className="w-full border-separate border-myGrey-200 text-white">
                  <caption className="bg-myGrey-200 py-5 text-center text-base font-bold text-white md:text-lg">
                    {t('nutr.nutritionPlanFor')} {selectedUsername}
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
                          {t(`day.${day}`)}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {randomFields.map((field) => (
                      <tr key={field}>
                        <th className="text-center text-base capitalize md:text-lg">
                          {t(`meal.${field}`)}
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
                onClick={() => setTogglePreview(false)}
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

            <Accordion acceptedClients={acceptedClients} />

            <div className="mx-auto my-8 flex w-full flex-col items-center justify-center lg:my-10">
              {fieldError && (
                <p className="mb-2 text-sm text-myRed">{fieldError}</p>
              )}
              {serverError && (
                <p className="mb-2 text-sm text-myRed">{serverError}</p>
              )}

              <button
                type="button"
                onClick={handleSubmit}
                className="mx-auto block rounded-md border-2 border-myBlue-200 bg-myBlue-200 px-28 py-2 text-base font-bold text-white hover:scale-110 hover:shadow-3xl md:mx-6 md:px-40 md:text-lg"
              >
                {t('nutr.set')}
              </button>
              <button
                type="button"
                onClick={() => setTogglePreview(true)}
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
