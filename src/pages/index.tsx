import { NextPage, GetServerSideProps } from 'next';
import { useState } from 'react';
import { useApolloClient } from '@apollo/client';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import {
  useLogoutMutation,
  useMeQuery,
  useTopRatedRecipesQuery,
} from '../generated/graphql';
import LanguageSwitcher from '../components/Helper/LanguageSwitcher';
import Logo from '../components/Helper/Logo';
import { pick } from '../utils/pick';
import { useRouter } from 'next/router';

interface RecipeCardProps {
  title: string;
  image: string;
  authorName: string;
  authorImage?: string | null;
  onClick?: () => void;
}

const RecipeCard = ({ title, image, onClick }: RecipeCardProps) => (
  <div
    onClick={onClick}
    className="w-full overflow-hidden rounded-2xl bg-surface shadow-2xl drop-shadow-2xl cursor-pointer flex flex-col h-full"
  >
    <img
      src={image}
      alt={title}
      className="h-28 w-full object-cover flex-shrink-0"
    />
    <div className="h-24 flex flex-col items-center justify-center gap-1.5 px-3 py-2">
      <h4 className="text-center">{title}</h4>
    </div>
  </div>
);

const Index: NextPage = () => {
  const router = useRouter();
  const [slideIndex, setSlideIndex] = useState(0);
  const [logout, { loading: logoutLoading }] = useLogoutMutation();
  const apolloClient = useApolloClient();
  const { t, i18n } = useTranslation('common');
  const lang = i18n.language;

  const { loading: meLoading, data: meData } = useMeQuery();
  const { data: topRatedData } = useTopRatedRecipesQuery({
    variables: { limit: 2 },
  });

  const featuredRecipes = topRatedData?.topRatedRecipes ?? [];

  const role = meData?.me?.role?.toLowerCase();

  const getRecipeRedirect = (recipeId: number) => {
    if (!meData?.me) return '/login';
    if (role === 'chef') return `/chef/recipes/browse/${recipeId}`;
    if (role === 'nutritionist') return `/nutritionist/recipes/${recipeId}`;
    return `/user/recipes/${recipeId}`;
  };

  const cards = featuredRecipes.map((recipe) => (
    <RecipeCard
      key={recipe.id}
      title={pick(recipe.title_el, recipe.title_en, lang)}
      image={recipe.recipeImage!}
      authorName={recipe.author?.user?.username ?? '—'}
      authorImage={recipe.author?.user?.image}
      onClick={() => router.push(getRecipeRedirect(recipe.id))}
    />
  ));

  return (
    <div className="min-h-screen w-full md:grid md:grid-cols-2">
      <section className="container mt-12 grid grid-flow-row gap-4 rounded-[3rem] bg-cookie-200 md:mt-0 md:rounded-none md:rounded-br-[6rem]">
        <div className="flex flex-col items-center gap-3 px-4 pt-4">
          <div className="flex w-full items-center mb-8 mt-2 justify-between">
            <Logo />
            <LanguageSwitcher dark />
          </div>
          {!meLoading && (
            <div className="flex items-center gap-3">
              {!meData?.me ? (
                <>
                  <button
                    onClick={() => router.push('/login')}
                    className="rounded-full border border-surface bg-surface px-4 py-0.5 text-myText-base"
                  >
                    {t('index.login')}
                  </button>
                  <button
                    onClick={() => router.push('/register')}
                    className="rounded-full border border-surface bg-surface px-4 py-0.5 text-myText-base"
                  >
                    {t('index.register')}
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() =>
                      router.push(`/${meData.me!.role.toLowerCase()}`)
                    }
                    className="rounded-full border border-surface bg-surface px-4 py-0.5 text-myText-base"
                  >
                    {t('nav.home')}
                  </button>
                  <button
                    onClick={async () => {
                      await logout();
                      await apolloClient.resetStore();
                    }}
                    disabled={logoutLoading}
                    className="rounded-full border border-surface bg-surface px-4 py-0.5 text-myText-base"
                  >
                    {t('index.logout')}
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        <div className="my-14 px-6 md:px-3 md:py-8">
          <div className="mb-6 text-center">
            <h3>{t('index.top_recipes_title')}</h3>
          </div>

          <div className="relative flex items-center justify-center gap-3 lg:hidden">
            <div
              onClick={() => setSlideIndex((i) => Math.max(i - 1, 0))}
              className="px-2 text-white"
            >
              ‹
            </div>
            <div className="mt-12 w-[70%] h-52">{cards[slideIndex]}</div>
            <div
              onClick={() =>
                setSlideIndex((i) => Math.min(i + 1, cards.length - 1))
              }
              className="px-2 text-white"
            >
              ›
            </div>
          </div>

          <div className="mt-12 hidden lg:grid lg:grid-cols-2 lg:gap-7">
            {cards}
          </div>
        </div>
      </section>

      <div className="container h-full pt-4">
        <div className="flex h-full flex-col items-center justify-center gap-5 px-6 py-10 md:px-14">
          <h1 className="text-center leading-tight">{t('index.hero_title')}</h1>

          <div className="flex flex-col gap-3 text-center">
            <p>
              <span className="font-bold">{t('index.role_user_label')}</span>{' '}
              {t('index.role_user_desc')}
            </p>
            <p>
              <span className="font-bold">{t('index.role_chef_label')}</span>{' '}
              {t('index.role_chef_desc')}
            </p>
            <p>
              <span className="font-bold">
                {t('index.role_nutritionist_label')}
              </span>{' '}
              {t('index.role_nutritionist_desc')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? 'el', ['common'])),
  },
});

export default Index;
