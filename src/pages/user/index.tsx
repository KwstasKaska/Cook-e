import { useMemo } from 'react';
import Navbar from '../../components/Users/Navbar';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import { el, enUS } from 'date-fns/locale';
import {
  useMyAppointmentRequestsQuery,
  useMyFavoritesQuery,
  useMyMealPlanQuery,
  useMyNutritionalSummaryQuery,
  AppointmentStatus,
} from '../../generated/graphql';
import useIsUser from '../../utils/useIsUser';
import { toDisplay, statusStyle } from '../../utils/appointmentUtils';
import { JS_DAY_TO_ENUM, DAY_ORDER, MEAL_ORDER } from '../../utils/mealUtils';

const FAV_SNAPSHOT = 2;
const APPT_SNAPSHOT = 3;

export async function getServerSideProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}

export default function UserHomePage() {
  const { loading: authLoading, isAuthorized } = useIsUser();
  if (authLoading || !isAuthorized) return null;
  return <HomeContent />;
}

const HomeContent = () => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const isEl = router.locale === 'el';
  const dateFnsLocale = router.locale === 'el' ? el : enUS;

  const { data: summaryData, loading: summaryLoading } =
    useMyNutritionalSummaryQuery({ fetchPolicy: 'network-only' });

  const { data: favData, loading: favLoading } = useMyFavoritesQuery({
    variables: { limit: FAV_SNAPSHOT, offset: 0 },
    fetchPolicy: 'network-only',
  });

  const { data: apptData, loading: apptLoading } =
    useMyAppointmentRequestsQuery({ fetchPolicy: 'network-only' });

  const { data: planData, loading: planLoading } = useMyMealPlanQuery({
    fetchPolicy: 'network-only',
  });

  const summary = summaryData?.myNutritionalSummary;
  const favorites = favData?.myFavorites ?? [];

  const stats = [
    {
      labelKey: 'landing.energy',
      value: `${Math.round(summary?.totalCalories ?? 0)} kcal`,
    },
    {
      labelKey: 'landing.fat',
      value: `${Math.round(summary?.totalFat ?? 0)}g`,
    },
    {
      labelKey: 'landing.protein',
      value: `${Math.round(summary?.totalProtein ?? 0)}g`,
    },
    {
      labelKey: 'landing.carbs',
      value: `${Math.round(summary?.totalCarbs ?? 0)}g`,
    },
    { labelKey: 'landing.cookCount', value: `${summary?.cookCount ?? 0}` },
  ];

  const today = new Date().toISOString().split('T')[0];

  const recentAppts = useMemo(() => {
    return (apptData?.myAppointmentRequests ?? [])
      .filter((req) => {
        if (req.status === AppointmentStatus.Pending) {
          return req.slot?.date && req.slot.date >= today;
        }
        return true;
      })
      .slice(0, APPT_SNAPSHOT);
  }, [apptData, today]);

  const { snapshotMeals, snapshotNutrName } = useMemo(() => {
    const plan = planData?.myMealPlan ?? [];
    if (plan.length === 0) return { snapshotMeals: [], snapshotNutrName: null };

    const nutrName = plan[0].nutritionist?.user?.username ?? null;
    const nutrEntries = plan.filter(
      (e) => (e.nutritionist?.user?.username ?? null) === nutrName,
    );

    const todayEnum = JS_DAY_TO_ENUM[new Date().getDay()];
    const todayIdx = DAY_ORDER.indexOf(todayEnum);

    for (let i = 0; i < DAY_ORDER.length; i++) {
      const day = DAY_ORDER[(todayIdx + i) % DAY_ORDER.length];
      const meals = MEAL_ORDER.map((mt) =>
        nutrEntries.find((e) => e.day === day && e.mealType === mt),
      ).filter(Boolean) as typeof nutrEntries;
      if (meals.length > 0)
        return { snapshotMeals: meals, snapshotNutrName: nutrName };
    }

    return { snapshotMeals: [], snapshotNutrName: nutrName };
  }, [planData]);

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="mx-auto max-w-3xl lg:max-w-4xl px-6 pb-16 pt-10">
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="flex flex-col rounded-2xl bg-surface p-5 shadow-lg">
            <h3 className="mb-4">{t('settings.appointments')}</h3>

            {apptLoading ? (
              <div className="flex flex-1 items-center justify-center py-8">
                <div className="h-6 w-6 rounded-full border-2 border-cookie-400 border-t-transparent" />
              </div>
            ) : recentAppts.length === 0 ? (
              <p className="flex-1 ">{t('settings.noAppointments')}</p>
            ) : (
              <div className="flex flex-1 flex-col gap-2">
                {recentAppts.map((req) => {
                  const nutr = req.slot?.nutritionistProfile?.user;
                  return (
                    <div
                      key={req.id}
                      className="flex items-center gap-3 rounded-2xl border-2 border-cookie-400 bg-surface px-4 py-3"
                    >
                      {nutr?.image ? (
                        <img
                          src={nutr.image}
                          alt={nutr.username}
                          className="h-9 w-9 flex-shrink-0 rounded-full object-cover"
                        />
                      ) : (
                        <div className="h-9 w-9 flex-shrink-0 rounded-full bg-cookie-200" />
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="truncate">{nutr?.username ?? '—'}</p>
                        <p className="truncate ">
                          {req.slot?.date
                            ? toDisplay(req.slot.date, dateFnsLocale)
                            : '—'}
                        </p>
                      </div>
                      <span
                        className={`flex-shrink-0 rounded-full px-2 py-0.5 ${
                          statusStyle[req.status]
                        }`}
                      >
                        {t(
                          `settings.appointmentStatus.${req.status.toLowerCase()}`,
                        )}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}

            <button
              onClick={() => router.push('/user/appointments')}
              className="mt-4 self-end text-cookie-400 hover:underline"
            >
              {t('common.seeAll')}
            </button>
          </div>

          <div className="flex flex-col rounded-2xl bg-surface p-5 shadow-lg">
            <h3 className="mb-4">{t('settings.mealPlan')}</h3>

            {planLoading ? (
              <div className="flex flex-1 items-center justify-center py-8">
                <div className="h-6 w-6 rounded-full border-2 border-cookie-400 border-t-transparent" />
              </div>
            ) : snapshotMeals.length === 0 ? (
              <p className="flex-1 ">{t('settings.noMealPlan')}</p>
            ) : (
              <div className="flex flex-1 flex-col gap-1">
                {snapshotNutrName && (
                  <p className="mb-2 text-cookie-400">
                    {t('settings.mealPlanBy')} {snapshotNutrName}
                  </p>
                )}
                {snapshotMeals.map((entry) => {
                  const comment = isEl ? entry.comment_el : entry.comment_en;
                  return (
                    <div
                      key={entry.id}
                      className="flex gap-2 border-b border-cookie-100 py-1.5 last:border-0"
                    >
                      <span className="flex-shrink-0 text-cookie-400">
                        {t(`meal.${entry.mealType}`)}
                      </span>
                      <p className="line-clamp-1 text-myText-base">{comment}</p>
                    </div>
                  );
                })}
              </div>
            )}

            <button
              onClick={() => router.push('/user/mealplan')}
              className="mt-4 self-end text-cookie-400 hover:underline"
            >
              {t('common.seeAll')}
            </button>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div
            onClick={() => router.push('/user/chat')}
            className="flex cursor-pointer flex-col rounded-2xl bg-surface p-6 shadow-lg transition hover:scale-[1.02] hover:shadow-xl"
          >
            <div className="mb-3">
              <h3>{t('nav.chat')}</h3>
            </div>
            <p className="flex-1 ">{t('landing.chatDesc')}</p>
            <button className="mt-4 self-end ">{t('common.open')} </button>
          </div>
          <div
            onClick={() => router.push('/user/cart')}
            className="flex cursor-pointer flex-col rounded-2xl bg-surface p-6 shadow-lg transition hover:scale-[1.02] hover:shadow-xl"
          >
            <div className="mb-3 flex items-center justify-between">
              <h3>{t('nav.cart')}</h3>
            </div>
            <p className="flex-1 ">{t('landing.cartDesc')}</p>
            <button className="mt-4 self-end">{t('common.open')}</button>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="flex flex-col rounded-2xl bg-surface p-5 shadow-lg">
            <h3 className="mb-4">{t('recipes.favourites')}</h3>

            {favLoading ? (
              <div className="flex flex-1 items-center justify-center py-8">
                <div className="h-6 w-6 rounded-full border-2 border-cookie-400 border-t-transparent" />
              </div>
            ) : favorites.length === 0 ? (
              <p className="flex-1">{t('recipes.noFavourites')}</p>
            ) : (
              <div className="grid flex-1 grid-cols-2 gap-3">
                {favorites.map((fav) => {
                  const recipe = fav.recipe;
                  if (!recipe) return null;
                  const title = isEl ? recipe.title_el : recipe.title_en;

                  return (
                    <div
                      key={fav.id}
                      onClick={() => router.push(`/user/recipes/${recipe.id}`)}
                      className="cursor-pointer overflow-hidden rounded-2xl bg-surface shadow-xl transition duration-200 hover:scale-105 flex flex-col"
                    >
                      <div className="w-full bg-cookie-100 overflow-hidden">
                        {recipe.recipeImage ? (
                          <img
                            src={recipe.recipeImage}
                            alt={title}
                            className="h-28 w-full object-cover"
                          />
                        ) : (
                          <div className="h-28 w-full" />
                        )}
                      </div>
                      <div className="px-3 pt-3 pb-1 h-14 flex items-center justify-center text-center">
                        <p className="line-clamp-2 break-words">{title}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <button
              onClick={() => router.push('/user/favorites')}
              className="mt-4 self-end text-cookie-400 hover:underline"
            >
              {t('common.seeAll2')}
            </button>
          </div>

          <div className="flex flex-col rounded-2xl bg-surface p-5 shadow-lg">
            <h3 className="mb-3">{t('landing.nutritionTitle')}</h3>
            <p className="mb-3 text-sm">{t('landing.nutritionDesc')}</p>

            {summaryLoading ? (
              <div className="flex flex-1 items-center justify-center py-8">
                <div className="h-8 w-8 rounded-full border-4 border-cookie-400 border-t-transparent" />
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                {stats.map((s) => (
                  <div key={s.labelKey} className="flex flex-col gap-0">
                    <span className="text-sm">{t(s.labelKey)}</span>
                    <span className="text-sm text-myText-heading">
                      {s.value}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
