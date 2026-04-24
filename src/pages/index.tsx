import { NextPage } from 'next';
import Image from 'next/image';
import logo from '/public/images/logo.png';
import star from '/public/images/Star 1.svg';
import GeneralNav from '../components/GeneralNav';
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

// ─── Shuffle helper ───────────────────────────────────────────────────────────

function pickRandom<T>(arr: T[], count: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

// ─── Recipe card ──────────────────────────────────────────────────────────────

interface RecipeCardProps {
  title: string;
  image: string;
  authorName: string;
  difficulty: string;
}

const RecipeCard = ({
  title,
  image,
  authorName,
  difficulty,
}: RecipeCardProps) => (
  <div className="grid min-w-[9em] cursor-pointer grid-flow-row justify-items-center gap-2 rounded-[.9em] bg-myGrey-100 pb-[1.5em] shadow-2xl drop-shadow-2xl transition duration-300 hover:scale-110 hover:ease-in xl:px-4">
    <img
      src={image}
      alt={title}
      className="-mt-[3em] max-h-[6em] max-w-[6em] rounded-full object-cover md:max-h-[7em] md:max-w-[7em] xl:-mt-[4.5em] xl:max-h-[12em] xl:max-w-[12em]"
    />
    <h1 className="text-xs font-bold md:px-2 md:text-center md:text-xl xl:text-2xl">
      {title}
    </h1>
    <p className="text-9 md:text-xs xl:text-xl">{difficulty}</p>
    <div className="m-[0.65em] flex flex-row items-center gap-2">
      <div className="max-h-[2em] max-w-[2em] rounded-[.5em] bg-gray-300 md:max-h-[3em] md:max-w-[3em]" />
      <p className="text-9 leading-[.8rem] text-black md:text-sm xl:text-2xl">
        {authorName}
      </p>
    </div>
    <div className="flex flex-row items-center gap-1">
      <Image
        src={star}
        alt="star"
        className="md:min-h-[1.5em] md:min-w-[1.5em] xl:min-h-[2.5em] xl:min-w-[2.5em]"
      />
      <p className="text-9 md:text-xs xl:text-2xl">—</p>
    </div>
  </div>
);

// ─── Page

const Index: NextPage = () => {
  const [isHovered] = useState<boolean>(false);
  const [logout, { loading: logoutLoading }] = useLogoutMutation();
  const apolloClient = useApolloClient();
  const { t, i18n } = useTranslation('common');
  const lang = i18n.language;

  const { loading: meLoading, data: meData } = useMeQuery();
  const { data: recipesData } = useRecipesQuery({
    variables: { limit: 10, offset: 0 },
  });

  // Pick 2 random recipes — stable across re-renders until recipes change
  const featuredRecipes = useMemo(() => {
    const list = recipesData?.recipes ?? [];
    return pickRandom(list, 2);
  }, [recipesData]);

  const difficultyLabel = (d?: string) => {
    if (!d) return '';
    const map: Record<string, string> = {
      easy: lang === 'el' ? 'Εύκολο' : 'Easy',
      medium: lang === 'el' ? 'Μέτριο' : 'Medium',
      difficult: lang === 'el' ? 'Δύσκολο' : 'Difficult',
    };
    return map[d.toLowerCase()] ?? d;
  };

  let body = null;
  if (!meLoading) {
    if (!meData?.me) {
      body = (
        <div className="my-3 flex flex-row items-center gap-6 font-bold">
          <LanguageSwitcher />
          <button className="transition duration-300 hover:scale-110 hover:ease-in">
            <Link
              href="/login"
              className="rounded-full border-[1px] border-white px-[1.5em] py-[0.25em] text-white hover:bg-myRed md:text-base xl:text-2xl"
            >
              {t('index.login')}
            </Link>
          </button>
          <button className="transition duration-300 hover:scale-110 hover:ease-in">
            <Link
              href="/register"
              className="rounded-full bg-myGrey-100 px-[.9em] py-[0.25em] text-myBlue-200 hover:outline hover:outline-2 hover:outline-black md:text-base xl:text-2xl"
            >
              {t('index.register')}
            </Link>
          </button>
        </div>
      );
    } else {
      body = (
        <div className="my-3 flex flex-row items-center gap-6 font-bold">
          <LanguageSwitcher />
          <button
            onClick={async () => {
              await logout();
              await apolloClient.clearStore();
            }}
            disabled={logoutLoading}
            className="rounded-full border-[1px] border-white px-[1.5em] py-[0.25em] text-white transition duration-300 hover:scale-110 hover:bg-myRed hover:ease-in md:text-base xl:text-2xl"
          >
            {t('index.logout')}
          </button>
        </div>
      );
    }
  }

  return (
    <>
      <div className="min-h-screen w-full bg-myGrey-100 md:grid md:grid-cols-2">
        <div className="container h-full pt-[1em]">
          <GeneralNav />

          <div className="mt-12 grid h-full grid-flow-row justify-items-center gap-4 md:mt-0 md:items-center md:gap-0">
            <h1 className="px-[1.5em] text-center text-3xl font-bold leading-10 md:mt-10 md:px-[1em] md:text-4xl xl:text-7xl">
              {t('index.hero_title')}
            </h1>
            <p className="px-[6em] text-center text-xs md:px-[3.5em] md:text-xl xl:text-3xl">
              {t('index.hero_subtitle')}
            </p>
            <button className="mb-2 hover:scale-125 hover:transition hover:duration-300 hover:ease-in">
              <Link
                href={
                  meData?.me ? `/${meData.me.role.toLowerCase()}` : '/login'
                }
                className="rounded-full bg-myBlue-200 px-[3.5em] py-[.25em] text-white hover:bg-myRed md:text-xl xl:text-3xl"
              >
                {t('index.cta')}
              </Link>
            </button>
          </div>
        </div>

        <section className="container mt-[3em] grid grid-flow-row gap-4 rounded-[3em] bg-myBlue-200 font-exo font-normal md:mt-0 md:rounded-none md:rounded-bl-[6em]">
          <div className="grid grid-flow-col items-center justify-around">
            <Image
              src={logo}
              alt="logo"
              className="xl:min-h-[2em] xl:min-w-[5em]"
            />
            {body}
          </div>

          <div className="my-[3.5em] grid grid-flow-col justify-evenly gap-7 md:px-3 md:py-[5em]">
            {featuredRecipes.length > 0
              ? featuredRecipes.map((recipe) => (
                  <RecipeCard
                    key={recipe.id}
                    title={pick(recipe.title_el, recipe.title_en, lang)}
                    image={recipeImageSrc(recipe.recipeImage)}
                    authorName={recipe.author?.user?.username ?? '—'}
                    difficulty={difficultyLabel(recipe.difficulty)}
                  />
                ))
              : // Skeleton placeholders while loading
                [0, 1].map((i) => (
                  <div
                    key={i}
                    className="grid min-w-[9em] grid-flow-row justify-items-center gap-2 rounded-[.9em] bg-myGrey-100 pb-[1.5em] shadow-2xl opacity-40 animate-pulse xl:px-4"
                  >
                    <div className="-mt-[3em] max-h-[6em] max-w-[6em] rounded-full bg-gray-300 md:max-h-[7em] md:max-w-[7em]" />
                    <div className="mt-2 h-3 w-24 rounded bg-gray-300" />
                    <div className="h-2 w-16 rounded bg-gray-200" />
                  </div>
                ))}
          </div>
        </section>

        <section className="container mt-7 grid grid-flow-col justify-items-center gap-4 overflow-y-hidden text-9 leading-3 md:col-span-2 md:leading-4 xl:leading-5">
          <div>
            <h1 className="text-2xl font-bold md:text-4xl xl:text-6xl">85%</h1>
            <p className="max-w-[12.1em] md:text-base xl:text-xl">
              {t('index.stat_85')}
            </p>
          </div>
          <div>
            <h1 className="text-2xl font-bold md:text-4xl xl:text-6xl">100+</h1>
            <p className="max-w-[7.1em] md:text-base xl:text-xl">
              {t('index.stat_100')}
            </p>
          </div>
          <div>
            <h1 className="text-2xl font-bold md:text-4xl xl:text-6xl">50+</h1>
            <p className="max-w-[7.1em] md:text-base xl:text-xl">
              {t('index.stat_50')}
            </p>
          </div>
          {isHovered && (
            <div>
              <h1 className="text-2xl font-bold md:text-4xl xl:text-6xl">
                1000+
              </h1>
              <p className="max-w-[7.1em] md:text-base xl:text-xl">
                {t('index.stat_1000')}
              </p>
            </div>
          )}
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
