import React, { useState } from 'react';
import { useTranslation } from 'next-i18next';
import {
  DayOfWeek,
  MealType,
  useMyMealPlanQuery,
} from '../../generated/graphql';

const DAY_ORDER: DayOfWeek[] = [
  DayOfWeek.Monday,
  DayOfWeek.Tuesday,
  DayOfWeek.Wednesday,
  DayOfWeek.Thursday,
  DayOfWeek.Friday,
  DayOfWeek.Saturday,
  DayOfWeek.Sunday,
];

const MEAL_ORDER: MealType[] = [
  MealType.Breakfast,
  MealType.Snack,
  MealType.Lunch,
  MealType.Afternoon,
  MealType.Dinner,
];

const MealPlanTab: React.FC = () => {
  const { t, i18n } = useTranslation('common');
  const { data, loading } = useMyMealPlanQuery();
  const isEl = i18n.language === 'el';
  const [openDay, setOpenDay] = useState<string | null>(null);

  const plan = data?.myMealPlan ?? [];

  const byNutritionist = React.useMemo(() => {
    const map = new Map<string, typeof plan>();
    for (const entry of plan) {
      const nutrName = entry.nutritionist?.user?.username ?? 'unknown';
      if (!map.has(nutrName)) map.set(nutrName, []);
      map.get(nutrName)!.push(entry);
    }
    return map;
  }, [plan]);

  if (loading) {
    return <p className="text-sm text-gray-400">{t('common.loading')}</p>;
  }

  if (plan.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-sm text-gray-400">{t('settings.noMealPlan')}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-10">
      {[...byNutritionist.entries()].map(([nutrName, entries]) => (
        <div key={nutrName}>
          <p className="mb-3 text-sm font-semibold text-myBlue-200">
            {t('settings.mealPlanBy')} {nutrName}
          </p>

          <div className="flex flex-col gap-2">
            {DAY_ORDER.map((day) => {
              const meals = MEAL_ORDER.map((mealType) =>
                entries.find((e) => e.day === day && e.mealType === mealType),
              ).filter(Boolean);

              if (meals.length === 0) return null;

              const key = `${nutrName}-${day}`;
              const isOpen = openDay === key;

              return (
                <div
                  key={day}
                  className="overflow-hidden rounded-2xl bg-myBlue-100"
                  style={{
                    border: isOpen
                      ? '1.5px solid #377CC3'
                      : '1.5px solid transparent',
                  }}
                >
                  <button
                    onClick={() => setOpenDay(isOpen ? null : key)}
                    className="flex w-full items-center justify-between px-5 py-3.5 text-sm font-bold text-myGrey-200 transition"
                  >
                    <span className="capitalize">{t(`day.${day}`)}</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      className="h-4 w-4 transition-transform duration-200"
                      style={{
                        transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
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
                    <div className="flex flex-col divide-y divide-myGrey-100 px-5 pb-4">
                      {MEAL_ORDER.map((mealType) => {
                        const entry = entries.find(
                          (e) => e.day === day && e.mealType === mealType,
                        );
                        if (!entry) return null;
                        const comment = isEl
                          ? entry.comment_el
                          : entry.comment_en;

                        return (
                          <div key={mealType} className="flex gap-4 py-3">
                            <span className="w-28 flex-shrink-0 text-xs font-semibold capitalize text-myBlue-200">
                              {t(`meal.${mealType}`)}
                            </span>
                            <p className="text-xs leading-relaxed text-myGrey-200">
                              {comment}
                            </p>
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
  );
};

export default MealPlanTab;
