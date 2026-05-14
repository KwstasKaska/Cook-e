import Image from 'next/image';
import { useRouter } from 'next/router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import { useMemo } from 'react';
import {
  useMyNutritionistProfileQuery,
  useArticlesByNutritionistQuery,
  useRecipesQuery,
  useGetAppointmentRequestsForNutritionistQuery,
  AppointmentStatus,
} from '../../generated/graphql';
import useIsNutritionist from '../../utils/useIsNutr';
import { pick } from '../../utils/pick';
import NutrNavbar from '../../components/Nutritionist/NutrNavbar';
import { el, enUS } from 'date-fns/locale';
import { toDisplay } from '../../utils/appointmentUtils';
import { useChatContext } from '../../components/Chat/ChatContext';

const SNAPSHOT = 2;
const APPT_SNAPSHOT = 3;

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
  const userId = nutrProfile?.user?.id;

  const { data: articlesData, loading: articlesLoading } =
    useArticlesByNutritionistQuery({
      variables: { nutritionistId: userId!, limit: SNAPSHOT, offset: 0 },
      skip: !userId,
    });

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

  const articles = articlesData?.articlesByNutritionist ?? [];
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
          <p className="text-myText-muted">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <NutrNavbar />

      <div className="mx-auto max-w-3xl px-6 pb-16 pt-10">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="flex flex-col items-center gap-4 rounded-2xl bg-surface p-6 shadow-lg">
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
              {city && <p className="mt-0.5 text-myText-muted">{city}</p>}
              {nutrProfile?.phone && (
                <p className="mt-0.5 text-myText-muted">{nutrProfile.phone}</p>
              )}
            </div>

            <div className="w-full rounded-xl bg-cookie-100 px-5 py-4">
              <p
                className={`text-center leading-relaxed${
                  !bio ? ' text-myText-muted' : ''
                }`}
              >
                {bio || t('chef.profile.bio_placeholder')}
              </p>
            </div>
          </div>

          <div className="flex flex-col rounded-2xl bg-surface p-5 shadow-lg">
            <h3 className="mb-4">{t('nutr.acceptedAppt')}</h3>

            {apptLoading ? (
              <div className="flex flex-1 items-center justify-center py-6">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-cookie-400 border-t-transparent" />
              </div>
            ) : thisMonthAppts.length === 0 ? (
              <p className="flex-1 text-myText-muted">
                {t('nutr.noAcceptedAppt')}
              </p>
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
                        <p className="truncate text-myText-muted">
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

          <div className="flex flex-col rounded-2xl bg-surface p-5 shadow-lg">
            <h3 className="mb-4">{t('chef.profile.articles')}</h3>

            {articlesLoading ? (
              <div className="flex flex-1 items-center justify-center py-6">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-cookie-400 border-t-transparent" />
              </div>
            ) : articles.length === 0 ? (
              <p className="flex-1 text-myText-muted">
                {t('chef.profile.no_articles')}
              </p>
            ) : (
              <div className="flex flex-1 flex-col gap-3">
                {articles.map((a) => {
                  const title = pick(a.title_el, a.title_en, lang);
                  return (
                    <div
                      key={a.id}
                      onClick={() =>
                        router.push(`/nutritionist/articles/${a.id}`)
                      }
                      className="flex cursor-pointer flex-col overflow-hidden rounded-2xl bg-surface shadow-xl transition duration-300 hover:scale-105"
                    >
                      <div className="relative h-20 w-full flex-shrink-0 overflow-hidden">
                        <Image
                          src={a.image}
                          alt={title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="px-4 py-3">
                        <h6 className="text-center">{title}</h6>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <button
              onClick={() => router.push('/nutritionist/articles')}
              className="mt-4 self-end text-cookie-400 hover:underline"
            >
              {t('common.seeAll')}
            </button>
          </div>

          <div className="flex flex-col rounded-2xl bg-surface p-5 shadow-lg">
            <h3 className="mb-4">{t('nutr.nutr_recipes')}</h3>

            {recipesLoading ? (
              <div className="flex flex-1 items-center justify-center py-6">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-cookie-400 border-t-transparent" />
              </div>
            ) : recipes.length === 0 ? (
              <p className="flex-1 text-myText-muted">
                {t('chef.recipes.empty')}
              </p>
            ) : (
              <div className="flex flex-1 flex-col gap-3">
                {recipes.map((r) => {
                  const title = pick(r.title_el, r.title_en, lang);
                  return (
                    <div
                      key={r.id}
                      onClick={() =>
                        router.push(`/nutritionist/recipes/${r.id}`)
                      }
                      className="flex cursor-pointer flex-col overflow-hidden rounded-2xl bg-surface shadow-xl transition duration-300 hover:scale-105"
                    >
                      {r.recipeImage && (
                        <div className="h-20 w-full flex-shrink-0 overflow-hidden">
                          <img
                            src={r.recipeImage}
                            alt={title}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      )}
                      <div className="px-4 py-3">
                        <h6 className="text-center">{title}</h6>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <button
              onClick={() => router.push('/nutritionist/recipes')}
              className="mt-4 self-end text-cookie-400 hover:underline"
            >
              {t('common.seeAll2')}
            </button>
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
