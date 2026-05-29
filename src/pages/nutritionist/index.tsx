import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import { useMemo } from 'react';
import {
  useMyNutritionistProfileQuery,
  useArticlesByNutritionistQuery,
  useChefArticlesQuery,
  useArticlesQuery,
  useRecipesQuery,
  useGetAppointmentRequestsForNutritionistQuery,
  AppointmentStatus,
} from '../../generated/graphql';
import useIsNutritionist from '../../utils/useIsNutr';
import { pick } from '../../utils/pick';
import NutrNavbar from '../../components/Nutritionist/NutrNavbar';
import SnapshotBox from '../../components/Helper/SnapshotBox';
import { StarRow } from '../../components/Helper/Stars';
import { useNutritionistAverageRatingQuery } from '../../generated/graphql';
import { el, enUS } from 'date-fns/locale';
import { toDisplay } from '../../utils/appointmentUtils';
import { useChatContext } from '../../components/Chat/ChatContext';

const SNAPSHOT = 2;
const APPT_SNAPSHOT = 2;

export default function NutritionistOverview() {
  const { loading: authLoading, isAuthorized } = useIsNutritionist();
  if (authLoading || !isAuthorized) return null;
  return <NutritionistOverviewContent />;
}

const NutritionistOverviewContent = () => {
  const { t, i18n } = useTranslation('common');
  const lang = i18n.language;
  const router = useRouter();
  const dateFnsLocale = lang === 'el' ? el : enUS;
  const { openConversation } = useChatContext();

  const { data: profileData, loading: profileLoading } =
    useMyNutritionistProfileQuery();
  const nutrProfile = profileData?.myNutritionistProfile;
  const nutrProfileId = nutrProfile?.id;
  const userId = nutrProfile?.user?.id;

  const { data: avgData } = useNutritionistAverageRatingQuery({
    variables: { nutritionistId: nutrProfileId! },
    skip: !nutrProfileId,
  });
  const avgRating = avgData?.nutritionistAverageRating ?? 0;

  const { data: myArticlesData, loading: myArticlesLoading } =
    useArticlesByNutritionistQuery({
      variables: { nutritionistId: userId!, limit: SNAPSHOT, offset: 0 },
      skip: !userId,
    });

  const { data: chefArticlesData, loading: chefArticlesLoading } =
    useChefArticlesQuery({ variables: { limit: SNAPSHOT, offset: 0 } });

  const { data: nutrArticlesData, loading: nutrArticlesLoading } =
    useArticlesQuery({ variables: { limit: SNAPSHOT, offset: 0 } });

  const { data: recipesData, loading: recipesLoading } = useRecipesQuery({
    variables: { limit: SNAPSHOT, offset: 0 },
    fetchPolicy: 'cache-and-network',
  });

  const { data: requestsData, loading: apptLoading } =
    useGetAppointmentRequestsForNutritionistQuery({
      variables: { limit: 100, offset: 0 },
      fetchPolicy: 'network-only',
    });

  const thisMonthAppts = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    return (requestsData?.getAppointmentRequestsForNutritionist ?? [])
      .filter((req) => {
        if (req.status !== AppointmentStatus.Accepted) return false;
        if (!req.slot?.date) return false;
        return req.slot.date >= today;
      })
      .sort((a, b) => {
        const dateCompare = a.slot!.date.localeCompare(b.slot!.date);
        if (dateCompare !== 0) return dateCompare;
        return (a.slot!.time ?? '').localeCompare(b.slot!.time ?? '');
      })
      .slice(0, APPT_SNAPSHOT);
  }, [requestsData]);

  const myArticles = myArticlesData?.articlesByNutritionist ?? [];
  const allArticles = [
    ...(chefArticlesData?.chefArticles ?? []),
    ...(nutrArticlesData?.articles ?? []),
  ].slice(0, SNAPSHOT);
  const recipes = recipesData?.recipes ?? [];

  const bio = pick(nutrProfile?.bio_el ?? '', nutrProfile?.bio_en ?? '', lang);
  const city = pick(
    nutrProfile?.city_el ?? '',
    nutrProfile?.city_en ?? '',
    lang,
  );

  if (profileLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <NutrNavbar />
        <div className="flex flex-1 items-center justify-center">
          <p>{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <NutrNavbar />

      <div className="mx-auto max-w-3xl lg:max-w-4xl px-6 pb-16 pt-10">
        <div className="mb-8 flex flex-col items-center gap-4 rounded-2xl bg-surface p-6 shadow-lg">
          <div className="h-24 w-24 overflow-hidden rounded-full border-2 border-cookie-400 shadow-lg">
            {nutrProfile?.user?.image ? (
              <img
                src={nutrProfile.user.image}
                alt={nutrProfile.user.username ?? ''}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-cookie-100">
                <span>
                  {nutrProfile?.user?.username?.[0]?.toUpperCase() ?? '?'}
                </span>
              </div>
            )}
          </div>

          <div className="text-center">
            <h2>{nutrProfile?.user?.username ?? ''}</h2>
            {city && <p className="mt-0.5">{city}</p>}
            {nutrProfile?.phone && (
              <p className="mt-0.5">{nutrProfile.phone}</p>
            )}
            {avgRating > 0 && (
              <div className="mt-0.5 flex justify-center">
                <StarRow rating={avgRating} />
              </div>
            )}
          </div>

          <div className="w-full rounded-xl bg-cookie-100 px-5 py-4">
            <p className="text-center leading-relaxed">
              {bio || t('chef.profile.bio_placeholder')}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="flex flex-col rounded-2xl bg-surface p-5 shadow-lg">
              <h3 className="mb-4 text-center">{t('nutr.acceptedAppt')}</h3>
              {apptLoading ? (
                <div className="flex flex-1 items-center justify-center py-6">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-cookie-400 border-t-transparent" />
                </div>
              ) : thisMonthAppts.length === 0 ? (
                <p className="flex-1">{t('nutr.noAcceptedAppt')}</p>
              ) : (
                <div className="flex flex-1 flex-col gap-3">
                  {thisMonthAppts.map((req) => {
                    const client = req.client;
                    const date = req.slot?.date
                      ? toDisplay(req.slot.date, dateFnsLocale)
                      : '—';
                    const time = req.slot?.time ?? '—';
                    return (
                      <div
                        key={req.id}
                        className="flex items-center gap-3 rounded-2xl border-2 border-cookie-400 bg-surface px-4 py-3"
                      >
                        {client?.image ? (
                          <img
                            src={client.image}
                            alt={client.username}
                            className="h-9 w-9 flex-shrink-0 rounded-full border-2 border-cookie-400 object-cover"
                          />
                        ) : (
                          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-cookie-200">
                            <span>
                              {client?.username?.[0]?.toUpperCase() ?? '?'}
                            </span>
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="truncate">{client?.username ?? '—'}</p>
                          <p className="truncate">
                            {date} · {time}
                          </p>
                        </div>
                        {client?.id && (
                          <button
                            onClick={() => openConversation(client.id)}
                            className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border-2 border-cookie-400 text-cookie-400 transition hover:bg-cookie-400 hover:text-white"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={1.8}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M8 10h.01M12 10h.01M16 10h.01M21 16c0 1.1-.9 2-2 2H7l-4 4V6a2 2 0 012-2h14a2 2 0 012 2v10z"
                              />
                            </svg>
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
              <button
                onClick={() => router.push('/nutritionist/accepted')}
                className="mt-4 self-end text-cookie-400 hover:underline"
              >
                {t('common.seeAll')}
              </button>
            </div>

            <SnapshotBox
              title={t('chef.overview.myArticles')}
              loading={myArticlesLoading}
              emptyLabel={t('chef.profile.no_articles')}
              onSeeAll={() => router.push('/nutritionist/articles')}
              seeAllLabel={t('common.seeAll')}
            >
              {myArticles.map((a) => {
                const title = pick(a.title_el, a.title_en, lang);
                return (
                  <Link
                    key={a.id}
                    href={`/nutritionist/articles/${a.id}`}
                    className="overflow-hidden rounded-2xl bg-surface shadow-xl transition duration-200 hover:scale-105 flex flex-col"
                  >
                    <div className="w-full bg-cookie-100 overflow-hidden">
                      <div className="relative h-28 w-full">
                        <Image
                          src={a.image}
                          alt={title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>
                    <div className="px-3 pt-3 pb-1 h-14 flex items-center justify-center text-center">
                      <p className="line-clamp-2 break-words">{title}</p>
                    </div>
                  </Link>
                );
              })}
            </SnapshotBox>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <SnapshotBox
              title={t('nutr.nutr_recipes')}
              loading={recipesLoading}
              emptyLabel={t('chef.recipes.empty')}
              onSeeAll={() => router.push('/nutritionist/recipes')}
              seeAllLabel={t('common.seeAll2')}
            >
              {recipes.map((r) => {
                const title = pick(r.title_el, r.title_en, lang);
                return (
                  <div
                    key={r.id}
                    onClick={() => router.push(`/nutritionist/recipes/${r.id}`)}
                    className="cursor-pointer overflow-hidden rounded-2xl bg-surface shadow-xl transition duration-200 hover:scale-105 flex flex-col"
                  >
                    <div className="w-full bg-cookie-100 overflow-hidden">
                      {r.recipeImage ? (
                        <img
                          src={r.recipeImage}
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
            </SnapshotBox>

            <SnapshotBox
              title={t('chef.overview.allArticles')}
              loading={chefArticlesLoading || nutrArticlesLoading}
              emptyLabel={t('chef.profile.no_articles')}
              onSeeAll={() => router.push('/nutritionist/articles/browse')}
              seeAllLabel={t('common.seeAll')}
            >
              {allArticles.map((a) => {
                const title = pick(a.title_el, a.title_en, lang);
                return (
                  <Link
                    key={a.id}
                    href={`/nutritionist/articles/browse/${a.id}`}
                    className="overflow-hidden rounded-2xl bg-surface shadow-xl transition duration-200 hover:scale-105 flex flex-col"
                  >
                    <div className="w-full bg-cookie-100 overflow-hidden">
                      <div className="relative h-28 w-full">
                        <Image
                          src={a.image}
                          alt={title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>
                    <div className="px-3 pt-3 pb-1 h-14 flex items-center justify-center text-center">
                      <p className="line-clamp-2 break-words">{title}</p>
                    </div>
                  </Link>
                );
              })}
            </SnapshotBox>
          </div>
        </div>
      </div>
    </div>
  );
};

export async function getServerSideProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}
