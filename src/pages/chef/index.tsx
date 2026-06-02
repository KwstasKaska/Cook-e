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
  useRecipesQuery,
  useChefArticlesQuery,
  useArticlesQuery,
} from '../../generated/graphql';
import useIsChef from '../../utils/useIsChef';
import { pick } from '../../utils/pick';
import Stars from '../../components/Helper/Stars';
import ChefNavbar from '../../components/Chef/ChefNavbar';
import SnapshotBox from '../../components/Helper/SnapshotBox';

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

  const { data: allRecipesData, loading: allRecipesLoading } = useRecipesQuery({
    variables: { limit: SNAPSHOT, offset: 0 },
  });

  const { data: chefArticlesData, loading: chefArticlesLoading } =
    useChefArticlesQuery({ variables: { limit: SNAPSHOT, offset: 0 } });

  const { data: nutrArticlesData, loading: nutrArticlesLoading } =
    useArticlesQuery({ variables: { limit: SNAPSHOT, offset: 0 } });

  const averageRating = avgData?.chefAverageRating ?? 0;
  const ratings = ratingsData?.chefRatings ?? [];
  const totalRatings = ratings.length;
  const recipes = recipesData?.myRecipes ?? [];
  const articles = articlesData?.articlesByChef ?? [];
  const allRecipes = allRecipesData?.recipes ?? [];
  const allArticles = [
    ...(chefArticlesData?.chefArticles ?? []),
    ...(nutrArticlesData?.articles ?? []),
  ].slice(0, SNAPSHOT);

  if (profileLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <ChefNavbar />
        <div className="flex flex-1 items-center justify-center">
          <p>{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  const bio = pick(chefProfile?.bio_el ?? '', chefProfile?.bio_en ?? '', lang);

  return (
    <div className="min-h-screen">
      <ChefNavbar />

      <div className="mx-auto max-w-3xl lg:max-w-4xl px-6 pb-16 pt-10">
        <div className="mb-8 flex flex-col items-center gap-4 rounded-2xl bg-surface p-6 shadow-lg">
          <div className="h-24 w-24 overflow-hidden rounded-full border-2 border-cookie-400 shadow-lg">
            {chefProfile?.user?.image ? (
              <img
                src={chefProfile.user.image}
                alt={chefProfile.user.username ?? ''}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <span>
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
                <span>
                  {averageRating.toFixed(1)} ({totalRatings})
                </span>
              </div>
            ) : (
              <p className="mt-1">{t('chef.profile.no_ratings')}</p>
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
            <SnapshotBox
              title={t('chef.overview.myRecipes')}
              loading={recipesLoading}
              emptyLabel={t('chef.profile.no_recipes')}
              onSeeAll={() => router.push('/chef/recipes')}
              seeAllLabel={t('common.seeAll2')}
            >
              {recipes.map((r) => {
                const title = pick(r.title_el, r.title_en, lang);
                return (
                  <div
                    key={r.id}
                    onClick={() => router.push(`/chef/recipes/${r.id}`)}
                    className="cursor-pointer overflow-hidden rounded-2xl bg-surface shadow-xl transition duration-200 hover:scale-105 flex flex-col"
                  >
                    <div className="w-full bg-cookie-100 flex justify-center overflow-hidden">
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
                    <div className="px-3 pt-3 pb-1 h-14 flex items-center justify-center text-center">
                      <p className="line-clamp-2 break-words">{title}</p>
                    </div>
                  </div>
                );
              })}
            </SnapshotBox>

            <SnapshotBox
              title={t('chef.overview.myArticles')}
              loading={articlesLoading}
              emptyLabel={t('chef.profile.no_articles')}
              onSeeAll={() => router.push('/chef/articles')}
              seeAllLabel={t('common.seeAll')}
            >
              {articles.map((a) => {
                const title = pick(a.title_el, a.title_en, lang);
                return (
                  <Link
                    key={a.id}
                    href={`/chef/articles/${a.id}`}
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
              title={t('chef.overview.allRecipes')}
              loading={allRecipesLoading}
              emptyLabel={t('chef.profile.no_recipes')}
              onSeeAll={() => router.push('/chef/recipes/browse')}
              seeAllLabel={t('common.seeAll2')}
            >
              {allRecipes.map((r) => {
                const title = pick(r.title_el, r.title_en, lang);
                return (
                  <div
                    key={r.id}
                    onClick={() => router.push(`/chef/recipes/browse/${r.id}`)}
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
                    <div className="px-3 pt-3 pb-1 h-20 flex flex-col items-center justify-center text-center">
                      <p className="line-clamp-2 break-words">{title}</p>
                      {r.author?.user?.username && (
                        <p className="mt-0.5 text-xs">
                          {r.author.user.username}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </SnapshotBox>

            <SnapshotBox
              title={t('chef.overview.allArticles')}
              loading={chefArticlesLoading || nutrArticlesLoading}
              emptyLabel={t('chef.profile.no_articles')}
              onSeeAll={() => router.push('/chef/articles/browse')}
              seeAllLabel={t('common.seeAll')}
            >
              {allArticles.map((a) => {
                const title = pick(a.title_el, a.title_en, lang);
                return (
                  <Link
                    key={a.id}
                    href={`/chef/articles/browse/${a.id}`}
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
                    <div className="px-3 pt-3 pb-1 h-20 flex flex-col items-center justify-center text-center">
                      <p className="line-clamp-2 break-words">{title}</p>
                      {a.creator?.username && (
                        <p className="mt-0.5 text-xs">{a.creator.username}</p>
                      )}
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
