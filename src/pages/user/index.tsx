import Image from 'next/image';
import Link from 'next/link';
import { useMemo } from 'react';
import Navbar from '../../components/Users/Navbar';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import { el, enUS } from 'date-fns/locale';
import {
  useMyAppointmentRequestsQuery,
  useMyMealPlanQuery,
  useMyNutritionalSummaryQuery,
  useRecipesQuery,
  useChefArticlesQuery,
  useArticlesQuery,
  AppointmentStatus,
} from '../../generated/graphql';
import useIsUser from '../../utils/useIsUser';
import { toDisplay, statusStyle } from '../../utils/appointmentUtils';
import { JS_DAY_TO_ENUM, DAY_ORDER, MEAL_ORDER } from '../../utils/mealUtils';
import SnapshotBox from '../../components/Helper/SnapshotBox';
import { pick } from '../../utils/pick';

const SNAPSHOT = 2;
const APPT_SNAPSHOT = 2;

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
  const { t, i18n } = useTranslation('common');
  const router = useRouter();
  const isEl = router.locale === 'el';
  const lang = i18n.language;
  const dateFnsLocale = router.locale === 'el' ? el : enUS;

  const { data: summaryData, loading: summaryLoading } =
    useMyNutritionalSummaryQuery({ fetchPolicy: 'network-only' });

  const { data: apptData, loading: apptLoading } =
    useMyAppointmentRequestsQuery({ fetchPolicy: 'network-only' });

  const { data: planData, loading: planLoading } = useMyMealPlanQuery({
    fetchPolicy: 'network-only',
  });

  const { data: recipesData, loading: recipesLoading } = useRecipesQuery({
    variables: { limit: SNAPSHOT, offset: 0 },
  });

  const { data: chefArticlesData, loading: chefArticlesLoading } =
    useChefArticlesQuery({ variables: { limit: SNAPSHOT, offset: 0 } });

  const { data: nutrArticlesData, loading: nutrArticlesLoading } =
    useArticlesQuery({ variables: { limit: SNAPSHOT, offset: 0 } });

  const summary = summaryData?.myNutritionalSummary;

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

  const snapshotMeals = useMemo(() => {
    const plan = planData?.myMealPlan ?? [];
    if (plan.length === 0) return [];

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
      if (meals.length > 0) return meals;
    }

    return [];
  }, [planData]);

  const recipes = recipesData?.recipes ?? [];
  const allArticles = [
    ...(chefArticlesData?.chefArticles ?? []),
    ...(nutrArticlesData?.articles ?? []),
  ].slice(0, SNAPSHOT);

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
              <p className="flex-1">{t('settings.noAppointments')}</p>
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
                        <p className="truncate">
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
              <p className="flex-1">{t('settings.noMealPlan')}</p>
            ) : (
              <div className="flex flex-1 flex-col gap-1">
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
                      <p className="line-clamp-1">{comment}</p>
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
          <div className="flex flex-col rounded-2xl bg-surface p-6 shadow-lg">
            <h3 className="mb-3">{t('nav.chat')}</h3>
            <p className="flex-1">{t('landing.chatDesc')}</p>
            <button
              onClick={() => router.push('/user/chat')}
              className="mt-4 self-end text-cookie-400 hover:underline"
            >
              {t('common.open')}
            </button>
          </div>

          <div className="flex flex-col rounded-2xl bg-surface p-5 shadow-lg">
            <h3 className="mb-3">{t('landing.nutritionTitle')}</h3>

            {summaryLoading ? (
              <div className="flex flex-1 items-center justify-center py-8">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-cookie-400 border-t-transparent" />
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                {stats.map((s) => (
                  <div key={s.labelKey} className="flex  flex-col gap-0">
                    <span className="text-cookie-400">{t(s.labelKey)}</span>
                    <span className="">{s.value}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
          <SnapshotBox
            title={t('nav.recipes2')}
            loading={recipesLoading}
            emptyLabel={t('chef.profile.no_recipes')}
            onSeeAll={() => router.push('/user/recipes')}
            seeAllLabel={t('common.seeAll2')}
          >
            {recipes.map((r) => {
              const title = pick(r.title_el, r.title_en, lang);
              return (
                <div
                  key={r.id}
                  onClick={() => router.push(`/user/recipes/${r.id}`)}
                  className="cursor-pointer overflow-hidden rounded-2xl bg-surface shadow-xl transition duration-200 hover:scale-105 flex flex-col"
                >
                  <div className="w-full bg-cookie-100 overflow-hidden">
                    {r.recipeImage ? (
                      <img
                        src={r.recipeImage}
                        alt={title}
                        className="h-24 w-full object-cover"
                      />
                    ) : (
                      <div className="h-24 w-full" />
                    )}
                  </div>
                  <div className="px-3 pt-3 pb-1 h-14 flex flex-col items-center justify-center text-center">
                    <p className="line-clamp-2 break-words">{title}</p>
                    <p className="text-xs">{r.author?.user.username}</p>
                  </div>
                </div>
              );
            })}
          </SnapshotBox>

          <SnapshotBox
            title={t('chef.overview.allArticles')}
            loading={chefArticlesLoading || nutrArticlesLoading}
            emptyLabel={t('chef.profile.no_articles')}
            onSeeAll={() => router.push('/user/articles')}
            seeAllLabel={t('common.seeAll')}
          >
            {allArticles.map((a) => {
              const title = pick(a.title_el, a.title_en, lang);
              return (
                <Link
                  key={a.id}
                  href={`/user/articles/${a.id}`}
                  className="overflow-hidden rounded-2xl bg-surface shadow-xl transition duration-200 hover:scale-105 flex flex-col"
                >
                  <div className="w-full bg-cookie-100 overflow-hidden">
                    <div className="relative h-24 w-full">
                      <Image
                        src={a.image}
                        alt={title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                  <div className="px-3 pt-3 pb-1 h-14 flex flex-col items-center justify-center text-center">
                    <p className="line-clamp-2 break-words">{title}</p>
                    <p className="text-xs">{a.creator?.username}</p>
                  </div>
                </Link>
              );
            })}
          </SnapshotBox>
        </div>
      </div>
    </div>
  );
};
