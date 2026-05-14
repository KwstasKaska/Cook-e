import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import {
  useMyChefProfileQuery,
  useChefAverageRatingQuery,
  useChefRatingsQuery,
  useArticlesByChefQuery,
  useMyRecipesQuery,
} from '../../generated/graphql';
import useIsChef from '../../utils/useIsChef';
import { pick } from '../../utils/pick';
import Stars from '../../components/Helper/Stars';
import ChefNavbar from '../../components/Chef/ChefNavbar';

const SNAPSHOT = 2;

export default function ChefOverview() {
  const { loading: authLoading, isAuthorized } = useIsChef();
  if (authLoading || !isAuthorized) return null;
  return <ChefOverviewContent />;
}

const ChefOverviewContent = () => {
  const { t, i18n } = useTranslation('common');
  const lang = i18n.language;
  const router = useRouter();

  const { data: profileData, loading: profileLoading } =
    useMyChefProfileQuery();
  const chefProfile = profileData?.myChefProfile;
  const chefProfileId = chefProfile?.id;
  const userId = chefProfile?.user?.id;

  const { data: avgData } = useChefAverageRatingQuery({
    variables: { chefId: chefProfileId! },
    skip: !chefProfileId,
  });

  const { data: ratingsData } = useChefRatingsQuery({
    variables: { chefId: chefProfileId!, limit: 50, offset: 0 },
    skip: !chefProfileId,
  });

  const { data: recipesData, loading: recipesLoading } = useMyRecipesQuery({
    variables: { limit: SNAPSHOT, offset: 0 },
    fetchPolicy: 'network-only',
  });

  const { data: articlesData, loading: articlesLoading } =
    useArticlesByChefQuery({
      variables: { chefId: userId!, limit: SNAPSHOT, offset: 0 },
      skip: !userId,
    });

  const averageRating = avgData?.chefAverageRating ?? 0;
  const ratings = ratingsData?.chefRatings ?? [];
  const totalRatings = ratings.length;
  const recipes = recipesData?.myRecipes ?? [];
  const articles = articlesData?.articlesByChef ?? [];

  if (profileLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <ChefNavbar />
        <div className="flex flex-1 items-center justify-center">
          <p className="text-myText-muted">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen ">
      <ChefNavbar />

      <div className="mx-auto max-w-3xl px-6 pb-16 pt-10 ">
        <div className="mb-8 flex flex-col items-center gap-4 rounded-2xl bg-surface p-6 shadow-lg">
          <div className="h-24 w-24 overflow-hidden rounded-full border-2 border-cookie-400  shadow-lg">
            {chefProfile?.user?.image ? (
              <img
                src={chefProfile.user.image}
                alt={chefProfile.user.username ?? ''}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <span className=" ">
                  {chefProfile?.user?.username?.[0]?.toUpperCase() ?? '?'}
                </span>
              </div>
            )}
          </div>

          <div className="text-center">
            <h2>{chefProfile?.user?.username ?? ''}</h2>
            {averageRating > 0 ? (
              <div className="mt-1 flex items-center justify-center gap-2">
                <Stars rating={averageRating} size="sm" />
                <span className="text-myText-muted">
                  {averageRating.toFixed(1)} ({totalRatings})
                </span>
              </div>
            ) : (
              <p className="mt-1 text-myText-muted">
                {t('chef.profile.no_ratings')}
              </p>
            )}
          </div>

          {(chefProfile?.bio_el || chefProfile?.bio_en) && (
            <div className="w-full rounded-xl bg-cookie-100 px-5 py-4">
              <p className="text-center leading-relaxed">
                {pick(chefProfile.bio_el ?? '', chefProfile.bio_en ?? '', lang)}
              </p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="flex flex-col rounded-2xl bg-surface p-5 shadow-lg">
            <h3 className="mb-4">{t('chef.profile.recipes')}</h3>

            {recipesLoading ? (
              <div className="flex flex-1 items-center justify-center py-6">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-cookie-400 border-t-transparent" />
              </div>
            ) : recipes.length === 0 ? (
              <p className="flex-1 text-myText-muted">
                {t('chef.profile.no_recipes')}
              </p>
            ) : (
              <div className="flex flex-1 flex-col gap-3">
                {recipes.map((r) => {
                  const title = pick(r.title_el, r.title_en, lang);
                  return (
                    <div
                      key={r.id}
                      onClick={() => router.push(`/chef/recipes/${r.id}`)}
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
              onClick={() => router.push('/chef/recipes')}
              className="mt-4 self-end text-cookie-400 hover:underline"
            >
              {t('common.seeAll2')} →
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
                    <Link
                      key={a.id}
                      href={`/chef/articles/${a.id}`}
                      className="flex flex-col overflow-hidden rounded-2xl bg-surface shadow-xl transition duration-300 hover:scale-105"
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
                    </Link>
                  );
                })}
              </div>
            )}

            <button
              onClick={() => router.push('/chef/articles')}
              className="mt-4 self-end text-cookie-400 hover:underline"
            >
              {t('common.seeAll')} →
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
