import React, { useState, useMemo } from 'react';
import { useTranslation } from 'next-i18next';
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

export const mealTypes: MealType[] = [
  MealType.Breakfast,
  MealType.Snack,
  MealType.Lunch,
  MealType.Afternoon,
  MealType.Dinner,
];

export type CellInfo = Record<string, string>;

const STICKY_W = 150;
const COL_W = 170;

const NutrScheduler: React.FC = () => {
  const { t } = useTranslation('common');

  const [cellInfo, setCellInfo] = useState<CellInfo>({});
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
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
    acceptedClients.find((c) => c.id === selectedUserId)?.username ?? '';

  const filledCells = Object.entries(cellInfo).filter(
    ([, v]) => v.trim() !== '',
  );

  const updateCell = (day: DayOfWeek, meal: MealType, value: string) => {
    setFieldError('');
    setCellInfo((prev) => ({ ...prev, [`${day}-${meal}`]: value }));
  };

  const handleSubmit = async () => {
    setFieldError('');

    if (!selectedUserId) {
      setFieldError(t('nutr.selectUserFirst'));
      return;
    }
    if (filledCells.length === 0) {
      setFieldError(t('nutr.setContentFirst'));
      return;
    }

    for (const [key, comment] of filledCells) {
      const [day, mealType] = key.split('-') as [DayOfWeek, MealType];
      const result = await createMealScheduler({
        variables: { userId: selectedUserId, day, mealType, comment },
      });
      if (result.data?.createMealScheduler.errors?.length) {
        setFieldError(result.data.createMealScheduler.errors[0].message);
        return;
      }
    }

    setCellInfo({});
  };

  const stickyCell = (bg: string) => ({
    position: 'sticky' as const,
    left: 0,
    width: STICKY_W,
    minWidth: STICKY_W,
    maxWidth: STICKY_W,
    background: bg,
    boxShadow: '2px 0 6px rgba(0,0,0,0.06)',
    zIndex: 10,
  });

  return (
    <section
      id="section_4"
      className="flex min-h-screen w-full flex-col bg-myGrey-100 py-16"
    >
      <div className="mx-auto w-full max-w-6xl px-4">
        <div className="mb-8 flex flex-col items-center gap-4 text-center">
          <h2 className="text-2xl font-bold md:text-4xl">
            {t('nutr.createNutritionPlan')}
          </h2>

          <div className="flex items-center gap-3">
            <label className="text-xs font-bold uppercase tracking-wide text-gray-500">
              {t('nutr.selectUser')}
            </label>
            <select
              value={selectedUserId ?? ''}
              onChange={(e) => {
                setSelectedUserId(
                  e.target.value ? Number(e.target.value) : null,
                );
                setFieldError('');
              }}
              className="rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-myGrey-200 focus:outline-none focus:ring-2 focus:ring-myBlue-200"
            >
              <option value="">{t('nutr.selectUser')}...</option>
              {acceptedClients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.username}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl bg-white shadow-3xl">
          <div className="bg-myGrey-200 px-6 py-4">
            <span className="font-bold text-white">
              {t('nutr.nutritionPlanFor')} {selectedUsername || '—'}
            </span>
          </div>

          <div className="relative w-full overflow-x-auto">
            <table
              className="border-collapse text-sm"
              style={{
                tableLayout: 'fixed',
                minWidth: STICKY_W + daysOfWeek.length * COL_W,
              }}
            >
              <colgroup>
                <col style={{ width: STICKY_W }} />
                {daysOfWeek.map((d) => (
                  <col key={d} style={{ width: COL_W }} />
                ))}
              </colgroup>

              <thead>
                <tr style={{ background: '#F9FAFB' }}>
                  <th
                    style={stickyCell('#F9FAFB')}
                    className="px-4 py-4 text-left text-xs font-bold uppercase tracking-wide text-gray-500"
                  >
                    {t('nutr.mealsAndDays')}
                  </th>
                  {daysOfWeek.map((day) => (
                    <th
                      key={day}
                      className="px-3 py-4 text-center text-xs font-bold uppercase tracking-wide text-myGrey-200"
                    >
                      {t(`day.${day}`)}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {mealTypes.map((meal, i) => {
                  const bg = i % 2 === 0 ? '#ffffff' : '#FAFAFA';
                  return (
                    <tr key={meal} style={{ background: bg }}>
                      <td
                        style={stickyCell(bg)}
                        className="px-4 py-4 font-bold text-myGrey-200"
                      >
                        {t(`meal.${meal}`)}
                      </td>
                      {daysOfWeek.map((day) => {
                        const key = `${day}-${meal}`;
                        const val = cellInfo[key] ?? '';
                        return (
                          <td
                            key={day}
                            className="px-3 py-3 align-top"
                            style={{ borderBottom: '1px solid #F3F4F6' }}
                          >
                            <textarea
                              value={val}
                              onChange={(e) =>
                                updateCell(day, meal, e.target.value)
                              }
                              placeholder="—"
                              rows={3}
                              className="w-full resize-none rounded-xl border px-3 py-2.5 text-xs text-myGrey-200 focus:outline-none focus:ring-2 focus:ring-myBlue-200"
                              style={{
                                borderColor: val.trim() ? '#B3D5F8' : '#E5E7EB',
                                background: val.trim() ? '#F0F7FF' : '#F9FAFB',
                              }}
                            />
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-6 flex flex-col items-center gap-3">
          {fieldError && (
            <p className="text-sm font-semibold text-myRed">{fieldError}</p>
          )}
          <div className="flex gap-3">
            {filledCells.length > 0 && (
              <button
                type="button"
                onClick={() => setCellInfo({})}
                className="rounded-xl border border-gray-300 px-5 py-2 text-sm font-bold text-gray-500 transition hover:bg-gray-100"
              >
                {t('nutr.clear')}
              </button>
            )}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={filledCells.length === 0}
              className="rounded-xl bg-myBlue-200 px-8 py-2 text-sm font-bold text-white transition hover:opacity-90 disabled:opacity-40"
            >
              {t('nutr.set')}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NutrScheduler;
