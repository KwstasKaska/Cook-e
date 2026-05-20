import { useState } from 'react';
import Navbar from '../../../../components/Users/Navbar';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import {
  useNutritionistQuery,
  useMyAppointmentRequestsQuery,
  useArticlesByNutritionistQuery,
} from '../../../../generated/graphql';
import useIsUser from '../../../../utils/useIsUser';
import { useChatContext } from '../../../../components/Chat/ChatContext';
import { pick } from '../../../../utils/pick';
import NutrBookingSection from '../../../../components/Users/Nutritionists/NutrBookingSection';
import ShareButton from '../../../../components/Helper/ShareButton';
import PaginationControls from '../../../../components/Helper/PaginationControls';

const LIMIT = 6;

export async function getServerSideProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}

export default function NutritionistProfilePage() {
  const { loading: authLoading, isAuthorized } = useIsUser();
  if (authLoading || !isAuthorized) return null;
  return <ProfileContent />;
}

const ProfileContent = () => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const lang = (router.locale ?? 'el') as 'el' | 'en';
  const { openConversation } = useChatContext();
  const [showArticles, setShowArticles] = useState(false);
  const [offset, setOffset] = useState(0);

  const id = Number(router.query.id);

  const { data, loading } = useNutritionistQuery({
    variables: { id },
    skip: !id,
    fetchPolicy: 'network-only',
  });

  const { data: requestsData } = useMyAppointmentRequestsQuery({
    fetchPolicy: 'network-only',
  });

  const nutr = data?.nutritionist;
  const myRequests = requestsData?.myAppointmentRequests ?? [];

  const hasAcceptedAppointment = myRequests.some(
    (req) => req.status === 'ACCEPTED' && req.slot?.nutritionistId === nutr?.id,
  );

  const userId = nutr?.user?.id ?? 0;

  const { data: articlesData, loading: articlesLoading } =
    useArticlesByNutritionistQuery({
      variables: { nutritionistId: userId, limit: LIMIT, offset },
      skip: !showArticles || !userId,
      fetchPolicy: 'network-only',
    });

  const articles = articlesData?.articlesByNutritionist ?? [];
  const hasMore = articles.length === LIMIT;
  const hasPrev = offset > 0;

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="flex justify-center pt-32">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-cookie-300 border-t-transparent" />
        </div>
      </div>
    );
  }

  if (!nutr) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <p className="pt-32 text-center text-myText-muted">
          {t('nutritionists.noResults')}
        </p>
      </div>
    );
  }

  const cityText = pick(nutr.city_el ?? '', nutr.city_en ?? '', lang);
  const bioText = pick(nutr.bio_el ?? '', nutr.bio_en ?? '', lang);
  const username = nutr.user?.username ?? '—';
  const image = nutr.user?.image ?? null;

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="mx-auto max-w-3xl lg:max-w-4xl px-6 pb-20 pt-10">
        <button
          onClick={() => router.back()}
          className="mb-8 flex items-center gap-2 text-myText-muted transition hover:"
        >
          {t('common.back')}
        </button>

        <div className="mb-6 flex flex-col gap-5 rounded-2xl bg-surface p-6 shadow-lg">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-full border-2 border-cookie-400 shadow-lg">
              {image ? (
                <img
                  src={image}
                  alt={username}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-cookie-200">
                  <span className="">{username[0]?.toUpperCase() ?? '?'}</span>
                </div>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <h3 className="truncate">{username}</h3>
              {cityText && <p className="mt-0.5  ">{cityText}</p>}
              {nutr.phone && <p className="mt-0.5  ">{nutr.phone}</p>}
            </div>

            {hasAcceptedAppointment && userId > 0 && (
              <button
                onClick={() => openConversation(userId)}
                className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border-2 border-cookie-400  transition hover:bg-cookie-400 hover:text-white"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
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

          {bioText && <p className="">{bioText}</p>}

          <div className="flex justify-between border-t border-cookie-400 pt-4">
            <ShareButton
              url={typeof window !== 'undefined' ? window.location.href : ''}
              dark
            />
            <button
              onClick={() => {
                setShowArticles((prev) => !prev);
                setOffset(0);
              }}
              className="rounded-xl border-2 border-cookie-400 px-4 py-1.5 transition hover:bg-cookie-400 hover:text-white"
            >
              {t('chef.profile.articles')}
            </button>
          </div>
        </div>

        {showArticles && (
          <div className="mb-6 rounded-2xl bg-surface p-6 shadow-lg">
            <h3 className="mb-4">{t('chef.profile.articles')}</h3>

            {articlesLoading ? (
              <div className="flex justify-center py-12">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-cookie-300 border-t-transparent" />
              </div>
            ) : articles.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-myText-muted">
                  {t('chef.profile.no_articles')}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {articles.map((article) => {
                  const title = pick(article.title_el, article.title_en, lang);
                  return (
                    <div
                      key={article.id}
                      onClick={() =>
                        router.push(`/user/articles/${article.id}`)
                      }
                      className="cursor-pointer overflow-hidden rounded-2xl bg-cookie-100 shadow-lg transition hover:scale-[1.02] hover:shadow-xl"
                    >
                      <div className="relative h-32 w-full overflow-hidden">
                        <img
                          src={article.image}
                          alt={title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="px-4 py-3">
                        <p className="">{title}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {!articlesLoading && (hasPrev || hasMore) && (
              <PaginationControls
                hasPrev={hasPrev}
                hasMore={hasMore}
                onPrev={() => setOffset((o) => o - LIMIT)}
                onNext={() => setOffset((o) => o + LIMIT)}
                prevLabel={t('pagination.prevArticles')}
                nextLabel={t('pagination.nextArticles')}
              />
            )}
          </div>
        )}

        <NutrBookingSection
          nutritionistProfileId={nutr.id}
          nutritionistUserId={userId}
          hasAcceptedAppointment={hasAcceptedAppointment}
        />
      </div>
    </div>
  );
};
