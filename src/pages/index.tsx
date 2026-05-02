import { NextPage } from 'next';
import Link from 'next/link';
import { useState, useMemo } from 'react';
import {
  useLogoutMutation,
  useMeQuery,
  useRecipesQuery,
} from '../generated/graphql';
import { useApolloClient } from '@apollo/client';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GetServerSideProps } from 'next';
import LanguageSwitcher from '../components/Helper/LanguageSwitcher';
import { pick } from '../utils/pick';
import { recipeImageSrc } from '../utils/recipeHelpers';

function pickRandom<T>(arr: T[], count: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

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
  <div className="grid w-full cursor-pointer grid-flow-row justify-items-center gap-2 rounded-[.9em] bg-myGrey-100 pb-[1.5em] shadow-2xl drop-shadow-2xl transition duration-300 hover:scale-105 hover:ease-in">
    <img
      src={image}
      alt={title}
      className="-mt-[3em] h-[6em] w-[6em] rounded-full object-cover md:h-[7em] md:w-[7em]"
    />
    <h1 className="px-2 text-center text-xs font-bold md:text-base">{title}</h1>

    <div className="m-[0.65em] flex flex-row items-center gap-2">
      {authorImage ? (
        <img
          src={authorImage}
          alt={authorName}
          className="h-[2em] w-[2em] rounded-[.5em] object-cover md:h-[3em] md:w-[3em]"
        />
      ) : (
        <div className="flex h-[2em] w-[2em] items-center justify-center rounded-[.5em] bg-myBlue-200 text-xs font-bold text-white md:h-[3em] md:w-[3em]">
          {authorName.charAt(0).toUpperCase()}
        </div>
      )}
      <p className="text-xs leading-[.8rem] text-black md:text-sm">
        {authorName}
      </p>
    </div>
  </div>
);

const Index: NextPage = () => {
  const [slideIndex, setSlideIndex] = useState(0);
  const [logout, { loading: logoutLoading }] = useLogoutMutation();
  const apolloClient = useApolloClient();
  const { t, i18n } = useTranslation('common');
  const lang = i18n.language;

  const { loading: meLoading, data: meData } = useMeQuery();
  const { data: recipesData } = useRecipesQuery({
    variables: { limit: 10, offset: 0 },
  });

  const featuredRecipes = useMemo(() => {
    const list = recipesData?.recipes ?? [];
    return pickRandom(list, 2);
  }, [recipesData]);

  let body = null;
  if (!meLoading) {
    if (!meData?.me) {
      body = (
        <div className="flex flex-row items-center gap-3 font-bold">
          <LanguageSwitcher />
          <Link
            href="/login"
            className="rounded-full border border-white text-white text-sm font-semibold px-4 py-1.5 hover:bg-myRed hover:border-myRed transition-colors duration-150"
          >
            {t('index.login')}
          </Link>
          <Link
            href="/register"
            className="rounded-full border border-white text-white text-sm font-semibold px-4 py-1.5 hover:bg-myRed hover:border-myRed transition-colors duration-150"
          >
            {t('index.register')}
          </Link>
        </div>
      );
    } else {
      body = (
        <div className="flex flex-row items-center gap-3 font-bold">
          <LanguageSwitcher />
          <button
            onClick={async () => {
              await logout();
              await apolloClient.resetStore();
            }}
            disabled={logoutLoading}
            className="rounded-full border border-white px-[1.2em] py-[0.25em] text-sm font-bold text-white transition hover:bg-myRed hover:border-myRed disabled:opacity-60"
          >
            {t('index.logout')}
          </button>
        </div>
      );
    }
  }

  const cards = featuredRecipes.map((recipe) => {
    const href = meData?.me
      ? `/${meData.me.role.toLowerCase()}/recipes`
      : '/login';

    return (
      <Link href={href} key={recipe.id}>
        <RecipeCard
          title={pick(recipe.title_el, recipe.title_en, lang)}
          image={recipeImageSrc(recipe.recipeImage)}
          authorName={recipe.author?.user?.username ?? '—'}
          authorImage={recipe.author?.user?.image}
        />
      </Link>
    );
  });

  return (
    <>
      <div className="min-h-screen w-full bg-myGrey-100 md:grid md:grid-cols-2">
        <div className="container h-full pt-[1em]">
          <div className="flex h-full flex-col items-center justify-center gap-5 px-6 py-10 md:px-[3.5em]">
            <h1 className="text-center text-3xl font-bold leading-tight md:text-4xl">
              {t('index.hero_title')}
            </h1>

            <div className="flex flex-col gap-3 text-center text-xs md:text-sm">
              <p>
                <span className="font-semibold">
                  {t('index.role_chef_label')}
                </span>{' '}
                {t('index.role_chef_desc')}
              </p>
              <p>
                <span className="font-semibold">
                  {t('index.role_nutritionist_label')}
                </span>{' '}
                {t('index.role_nutritionist_desc')}
              </p>
              <p>
                <span className="font-semibold">
                  {t('index.role_user_label')}
                </span>{' '}
                {t('index.role_user_desc')}
              </p>
            </div>

            <Link
              href={meData?.me ? `/${meData.me.role.toLowerCase()}` : '/login'}
              className="rounded-full bg-myBlue-200 px-[3.5em] py-[.4em] text-sm font-bold text-white transition hover:bg-myRed"
            >
              {t('index.cta')}
            </Link>
          </div>
        </div>

        {/* ── Δεξιά στήλη: nav buttons + συνταγές ── */}
        <section className="container mt-[3em] grid grid-flow-row gap-4 rounded-[3em] bg-myBlue-200 font-exo font-normal md:mt-0 md:rounded-none md:rounded-bl-[6em]">
          <div className="flex flex-row items-center justify-center px-4 pt-4">
            {body}
          </div>

          <div className="my-[3.5em] px-6 md:px-3 md:py-[2em]">
            {/* Mobile slider */}
            <div className="relative flex items-center justify-center gap-3 md:hidden">
              <button
                onClick={() => setSlideIndex((i) => Math.max(i - 1, 0))}
                disabled={slideIndex === 0}
                className="px-2 text-2xl text-white disabled:opacity-30"
                aria-label="Previous"
              >
                ‹
              </button>
              <div className="mt-[3em] w-[70%]">{cards[slideIndex]}</div>
              <button
                onClick={() =>
                  setSlideIndex((i) => Math.min(i + 1, cards.length - 1))
                }
                disabled={slideIndex === cards.length - 1}
                className="px-2 text-2xl text-white disabled:opacity-30"
                aria-label="Next"
              >
                ›
              </button>
            </div>

            {/* Desktop: side by side */}
            <div className="mt-[3em] hidden md:grid md:grid-cols-2 md:gap-7">
              {cards}
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? 'el', ['common'])),
    },
  };
};

export default Index;
