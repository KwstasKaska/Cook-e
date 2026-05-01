import React from 'react';
import { useTranslation } from 'next-i18next';
import {
  DayOfWeek,
  MealType,
  useMyMealPlanQuery,
} from '../../generated/graphql';
import ScrollToTopButton from '../Helper/ScrollToTopButton';

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

  const plan = data?.myMealPlan ?? [];

  // Group by day
  const byDay = React.useMemo(() => {
    const map = new Map<DayOfWeek, typeof plan>();
    DAY_ORDER.forEach((d) => map.set(d, []));
    plan.forEach((entry) => {
      map.get(entry.day as DayOfWeek)?.push(entry);
    });
    return map;
  }, [plan]);

  const isEl = i18n.language === 'el';

  if (loading) {
    return <p className="text-sm text-gray-400">{t('common.loading')}</p>;
  }

  if (plan.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400 text-sm">{t('settings.noMealPlan')}</p>
      </div>
    );
  }

  const nutrName = plan[0]?.nutritionist?.user?.username ?? '';

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800">
          {t('settings.mealPlan')}
        </h2>
        {nutrName && (
          <p className="text-sm text-gray-500 mt-1">
            {t('settings.mealPlanBy')} Dr. {nutrName}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-6">
        {DAY_ORDER.map((day) => {
          const meals = byDay.get(day) ?? [];
          // Skip days with no entries
          if (meals.length === 0) return null;

          return (
            <div
              key={day}
              className="rounded-xl border border-gray-100 overflow-hidden shadow-sm"
            >
              {/* Day header */}
              <div
                className="px-4 py-2.5 font-semibold text-sm text-white"
                style={{ backgroundColor: '#377CC3' }}
              >
                {t(`day.${day}`)}
              </div>

              {/* Meal rows — in canonical order */}
              <div className="divide-y divide-gray-100">
                {MEAL_ORDER.map((mealType) => {
                  const entry = meals.find((m) => m.mealType === mealType);
                  if (!entry) return null;

                  const comment = isEl ? entry.comment_el : entry.comment_en;

                  return (
                    <div
                      key={mealType}
                      className="flex items-start gap-4 px-4 py-3"
                    >
                      <span
                        className="mt-0.5 min-w-[7rem] text-xs font-semibold  tracking-wide"
                        style={{ color: '#377CC3' }}
                      >
                        {t(`meal.${mealType}`)}
                      </span>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {comment}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
      <ScrollToTopButton />
    </div>
  );
};

export default MealPlanTab;
