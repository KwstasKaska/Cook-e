import React, { useState } from 'react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import useIsUser from '../../../utils/useIsUser';
import Navbar from '../../../components/Users/Navbar';
import { useMyMealPlanQuery } from '../../../generated/graphql';
import { DAY_ORDER, MEAL_ORDER } from '../../../utils/mealUtils';

export async function getServerSideProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}

export default function MealPlanPage() {
  const { loading: authLoading, isAuthorized } = useIsUser();
  if (authLoading || !isAuthorized) return null;
  return <MealPlanContent />;
}

const MealPlanContent = () => {
  const { t, i18n } = useTranslation('common');
  const router = useRouter();
  const isEl = i18n.language === 'el';
  const [openDay, setOpenDay] = useState<string | null>(null);

  const { data } = useMyMealPlanQuery();
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

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="mx-auto max-w-3xl lg:max-w-4xl px-6 pb-16 pt-10">
        <button
          onClick={() => router.push('/user')}
          className="mb-6 text-myText-muted hover:text-cookie-400"
        >
          {t('common.back')}
        </button>

        <h1 className="mb-8 text-center">{t('settings.mealPlan')}</h1>

        {plan.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-myText-muted">{t('settings.noMealPlan')}</p>
          </div>
        ) : (
          <div className="flex flex-col gap-10">
            {[...byNutritionist.entries()].map(([nutrName, entries]) => (
              <div
                key={nutrName}
                className="overflow-hidden rounded-2xl bg-surface shadow-lg"
              >
                <div className="border-b border-cookie-200 px-6 py-4">
                  <p className="text-nutr-200">
                    {t('settings.mealPlanBy')} {nutrName}
                  </p>
                </div>

                <div className="flex flex-col gap-2 p-4">
                  {DAY_ORDER.map((day) => {
                    const meals = MEAL_ORDER.map((mealType) =>
                      entries.find(
                        (e) => e.day === day && e.mealType === mealType,
                      ),
                    ).filter(Boolean);

                    if (meals.length === 0) return null;

                    const key = `${nutrName}-${day}`;
                    const isOpen = openDay === key;

                    return (
                      <div
                        key={day}
                        className="overflow-hidden rounded-xl bg-cookie-100"
                        style={{
                          border: isOpen
                            ? '1.5px solid #C9955A'
                            : '1.5px solid transparent',
                        }}
                      >
                        <button
                          onClick={() => setOpenDay(isOpen ? null : key)}
                          className="flex w-full items-center justify-between px-5 py-3.5 transition"
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
                                (e) => e.day === day && e.mealType === mealType,
                              );
                              if (!entry) return null;
                              const comment = isEl
                                ? entry.comment_el
                                : entry.comment_en;

                              return (
                                <div key={mealType} className="flex gap-4 py-3">
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
    </div>
  );
};
