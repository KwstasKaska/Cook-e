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
}

const RecipeCard = ({
  title,
  image,
  authorName,
  authorImage,
}: RecipeCardProps) => (
  <div className="grid w-full grid-flow-row justify-items-center gap-2 overflow-hidden rounded-[.9em] bg-surface pb-[1.5em] shadow-2xl drop-shadow-2xl">
    <img
      src={image}
      alt={title}
      className="h-24  w-full object-cover md:h-[10em]"
    />
    <h4 className="px-2 text-center">{title}</h4>

    <div className="m-[0.65em] flex items-center gap-2">
      {authorImage ? (
        <img
          src={authorImage}
          alt={authorName}
          className="h-[2em] w-[2em] rounded-[.5em] object-cover md:h-[3em] md:w-[3em]"
        />
      ) : (
        <div className="flex h-[2em] w-[2em] items-center justify-center rounded-[.5em] bg-cookie-200 text-white md:h-[3em] md:w-[3em]">
          {authorName.charAt(0).toUpperCase()}
        </div>
      )}
      <p className="leading-[.8rem]">{authorName}</p>
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

  const cards = featuredRecipes.map((recipe) => (
    <RecipeCard
      key={recipe.id}
      title={pick(recipe.title_el, recipe.title_en, lang)}
      image={recipe.recipeImage!}
      authorName={recipe.author?.user?.username ?? '—'}
      authorImage={recipe.author?.user?.image}
    />
  ));

  return (
    <div className="min-h-screen w-full bg-cookie-100 md:grid md:grid-cols-2">
      <div className="container h-full pt-[1em]">
        <div className="flex h-full flex-col items-center justify-center gap-5 px-6 py-10 md:px-[3.5em]">
          <Logo />

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

          <button
            onClick={() =>
              router.push(
                meData?.me ? `/${meData.me.role.toLowerCase()}` : '/login',
              )
            }
            className="rounded-full border border-cookie-200 bg-cookie-200 px-4 py-0.5 text-myText-base"
          >
            {t('index.cta')}
          </button>
        </div>
      </div>

      <section className="container mt-[3em] grid grid-flow-row gap-4 rounded-[3em] bg-cookie-200 md:mt-0 md:rounded-none md:rounded-bl-[6em]">
        <div className="flex items-center justify-center px-4 pt-4">
          {!meLoading && (
            <div className="flex items-center gap-3">
              <LanguageSwitcher dark />
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
                <button
                  onClick={async () => {
                    await logout();
                    await apolloClient.resetStore();
                  }}
                  disabled={logoutLoading}
                  className="rounded-full border border-surface bg-surface px-4 py-0.5 text-myText-base disabled:opacity-60"
                >
                  {t('index.logout')}
                </button>
              )}
            </div>
          )}
        </div>

        <div className="my-[3.5em] px-6 md:px-3 md:py-[2em]">
          <div className="mb-6 text-center">
            <h3>{t('index.top_recipes_title')}</h3>
          </div>

          <div className="relative flex items-center justify-center gap-3 md:hidden">
            <div
              onClick={() => setSlideIndex((i) => Math.max(i - 1, 0))}
              className="px-2 text-white disabled:opacity-30"
            >
              ‹
            </div>
            <div className="mt-[3em] w-[70%]">{cards[slideIndex]}</div>
            <div
              onClick={() =>
                setSlideIndex((i) => Math.min(i + 1, cards.length - 1))
              }
              className="px-2 text-white disabled:opacity-30"
            >
              ›
            </div>
          </div>

          <div className="mt-[3em] hidden md:grid md:grid-cols-2 md:gap-7">
            {cards}
          </div>
        </div>
      </section>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? 'el', ['common'])),
  },
});

export default Index;
