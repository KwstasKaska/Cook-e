import { useState, useMemo } from 'react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import NutrNavbar from '../../components/Nutritionist/NutrNavbar';
import useIsNutr from '../../utils/useIsNutr';
import {
  DayOfWeek,
  MealType,
  useGetAppointmentRequestsForNutritionistQuery,
  useGetNutritionistMealPlansQuery,
  useCreateMealSchedulerMutation,
  AppointmentStatus,
} from '../../generated/graphql';
import { DAY_ORDER, MEAL_ORDER } from '../../utils/mealUtils';
import { useRouter } from 'next/router';

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

const NutrSchedulerPage = () => {
  const { loading: authLoading, isAuthorized } = useIsNutr();
  if (authLoading || !isAuthorized) return null;
  return <NutrSchedulerContent />;
};

const NutrSchedulerContent = () => {
  const { t, i18n } = useTranslation('common');
  const isEl = i18n.language === 'el';
  const router = useRouter();
  const [cellInfo, setCellInfo] = useState<CellInfo>({});
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [fieldError, setFieldError] = useState('');
  const [openDay, setOpenDay] = useState<string | null>(null);

  const { data: reqData } = useGetAppointmentRequestsForNutritionistQuery();
  const { data: plansData, loading: plansLoading } =
    useGetNutritionistMealPlansQuery({
      variables: { limit: 100, offset: 0 },
      fetchPolicy: 'network-only',
    });
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

  const byUser = useMemo(() => {
    const map = new Map<string, typeof entries>();
    const entries = plansData?.getNutritionistMealPlans ?? [];
    for (const entry of entries) {
      const username = entry.user?.username ?? 'unknown';
      if (!map.has(username)) map.set(username, []);
      map.get(username)!.push(entry);
    }
    return map;
  }, [plansData]);

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
    zIndex: 10,
  });

  const headerBg = '#EDD4B0';

  return (
    <div className="min-h-screen ">
      <NutrNavbar />

      <main className="flex flex-1 flex-col items-center px-4 py-8 md:px-8">
        <div className="w-full max-w-6xl">
          <button
            onClick={() => router.back()}
            className="mb-6 text-myText-muted hover:opacity-70 transition"
          >
            {t('common.back')}
          </button>
          <h1 className="mb-8 text-center">{t('nutrnav.mealplans')}</h1>
        </div>
        <div className="w-full max-w-6xl">
          <h2 className="mb-8 text-center">{t('nutr.createNutritionPlan')}</h2>

          <div className="mb-6 flex items-center justify-center gap-3">
            <label className="uppercase tracking-wide text-myText-muted">
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
              className="rounded-full border-2 border-cookie-400 bg-surface px-4 py-0.5 focus:outline-none focus:ring-2 focus:ring-cookie-300"
            >
              <option value="">{t('nutr.selectUser')}...</option>
              {acceptedClients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.username}
                </option>
              ))}
            </select>
          </div>

          <div className="overflow-hidden rounded-2xl bg-surface shadow-lg">
            <div className="relative w-full overflow-x-auto">
              <table
                className="border-collapse"
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
                  <tr>
                    <th
                      style={stickyCell(headerBg)}
                      className="px-4 py-4 text-left tracking-wide text-myText-muted"
                    >
                      {t('nutr.mealsAndDays')}
                    </th>
                    {daysOfWeek.map((day) => (
                      <th
                        key={day}
                        className="px-3 py-4 text-center tracking-wide"
                        style={{ background: headerBg }}
                      >
                        {t(`day.${day}`)}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {mealTypes.map((meal) => {
                    const bg = '#EDD4B0';
                    return (
                      <tr key={meal} className="bg-surface">
                        <td
                          style={stickyCell(bg)}
                          className="px-4 py-4 font-bold"
                        >
                          {t(`meal.${meal}`)}
                        </td>
                        {daysOfWeek.map((day) => {
                          const key = `${day}-${meal}`;
                          const val = cellInfo[key] ?? '';
                          return (
                            <td
                              key={day}
                              className="px-3 py-3 align-top border-b border-cookie-400"
                            >
                              <textarea
                                value={val}
                                onChange={(e) =>
                                  updateCell(day, meal, e.target.value)
                                }
                                placeholder="—"
                                rows={3}
                                className="w-full resize-none rounded-xl border border-cookie-400 bg-surface px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cookie-300"
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
            {fieldError && <p className="text-myRed">{fieldError}</p>}
            <div className="flex gap-3">
              {filledCells.length > 0 && (
                <button
                  type="button"
                  onClick={() => setCellInfo({})}
                  className="rounded-xl border-2 border-cookie-400 px-4 py-0.5  transition hover:bg-cookie-400 hover:text-white"
                >
                  {t('nutr.clear')}
                </button>
              )}
              <button
                type="button"
                onClick={handleSubmit}
                className={`rounded-xl border-2 border-cookie-400 px-8 py-2.5  shadow-lg transition-opacity   ${
                  filledCells.length === 0
                    ? 'cursor-not-allowed'
                    : 'hover:text-white hover:bg-cookie-400'
                }`}
              >
                {t('nutr.set')}
              </button>
            </div>
          </div>

          <div className="my-12 border-t border-cookie-200" />

          <h2 className="mb-8 text-center">{t('nutr.plansPerClient')}</h2>

          {plansLoading ? (
            <div className="flex justify-center py-8">
              <div className="h-6 w-6 animate-spin rounded-full border-4 border-nutr-200 border-t-transparent" />
            </div>
          ) : byUser.size === 0 ? (
            <div className="py-8 text-center">
              <p className="text-myText-muted">{t('nutr.noPlansYet')}</p>
            </div>
          ) : (
            <div className="flex flex-col gap-10">
              {[...byUser.entries()].map(([username, entries]) => (
                <div key={username}>
                  <p className="mb-3 text-nutr-200">{username}</p>

                  <div className="flex flex-col gap-2">
                    {DAY_ORDER.map((day) => {
                      const meals = MEAL_ORDER.map((mealType) =>
                        entries.find(
                          (e) => e.day === day && e.mealType === mealType,
                        ),
                      ).filter(Boolean);

                      if (meals.length === 0) return null;

                      const key = `${username}-${day}`;
                      const isOpen = openDay === key;

                      return (
                        <div
                          key={day}
                          className="overflow-hidden rounded-2xl bg-surface"
                          style={{
                            border: isOpen
                              ? '1.5px solid #5B9EC9'
                              : '1.5px solid transparent',
                          }}
                        >
                          <button
                            onClick={() => setOpenDay(isOpen ? null : key)}
                            className="flex w-full items-center justify-between px-5 py-3.5 transition"
                          >
                            <span className="capitalize">
                              {t(`day.${day}`)}
                            </span>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth={2}
                              className="h-4 w-4 transition-transform duration-200"
                              style={{
                                transform: isOpen
                                  ? 'rotate(180deg)'
                                  : 'rotate(0deg)',
                              }}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                              />
                            </svg>
                          </button>

                          {isOpen && (
                            <div className="flex flex-col divide-y divide-cookie-200 px-5 pb-4">
                              {MEAL_ORDER.map((mealType) => {
                                const entry = entries.find(
                                  (e) =>
                                    e.day === day && e.mealType === mealType,
                                );
                                if (!entry) return null;
                                const comment = isEl
                                  ? entry.comment_el
                                  : entry.comment_en;

                                return (
                                  <div
                                    key={mealType}
                                    className="flex gap-4 py-3"
                                  >
                                    <span className="w-28 flex-shrink-0 capitalize text-nutr-200">
                                      {t(`meal.${mealType}`)}
                                    </span>
                                    <p>{comment}</p>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export const getServerSideProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common'])),
  },
});

export default NutrSchedulerPage;
