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

// τυχαία επιλογή N στοιχείων από πίνακα
function pickRandom<T>(arr: T[], count: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

interface RecipeCardProps {
  title: string;
  image: string;
  authorName: string;
  authorImage?: string | null;
  difficulty: string;
}

const RecipeCard = ({
  title,
  image,
  authorName,
  authorImage,
  difficulty,
}: RecipeCardProps) => (
  <div className="grid w-full cursor-pointer grid-flow-row justify-items-center gap-2 rounded-[.9em] bg-myGrey-100 pb-[1.5em] shadow-2xl drop-shadow-2xl transition duration-300 hover:scale-105 hover:ease-in xl:px-4">
    <img
      src={image}
      alt={title}
      className="-mt-[3em] h-[6em] w-[6em] rounded-full object-cover md:h-[7em] md:w-[7em] xl:-mt-[4.5em] xl:h-[12em] xl:w-[12em]"
    />
    <h1 className="px-2 text-center text-xs font-bold md:text-xl xl:text-2xl">
      {title}
    </h1>
    <p className="text-xs md:text-xs xl:text-xl">{difficulty}</p>

    {/* Author */}
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
      <p className="text-xs leading-[.8rem] text-black md:text-sm xl:text-2xl">
        {authorName}
      </p>
    </div>
  </div>
);

// skeleton card ενώ φορτώνουν οι συνταγές
const SkeletonCard = () => (
  <div className="grid w-full animate-pulse grid-flow-row justify-items-center gap-2 rounded-[.9em] bg-myGrey-100 pb-[1.5em] opacity-40 shadow-2xl xl:px-4">
    <div className="-mt-[3em] h-[6em] w-[6em] rounded-full bg-gray-300 md:h-[7em] md:w-[7em]" />
    <div className="mt-2 h-3 w-24 rounded bg-gray-300" />
    <div className="h-2 w-16 rounded bg-gray-200" />
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

  // 2 τυχαίες συνταγές για την αρχική σελίδα
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

  // κουμπιά login/register ή logout ανάλογα με το αν είναι συνδεδεμένος
  let body = null;
  if (!meLoading) {
    if (!meData?.me) {
      body = (
        <div className="my-3 flex flex-row items-center gap-3 font-bold md:gap-6">
          <LanguageSwitcher />
          <Link
            href="/login"
            className="rounded-full border-[1px] border-white px-[1.2em] py-[0.25em] text-sm text-white hover:bg-myRed md:text-base xl:text-2xl"
          >
            {t('index.login')}
          </Link>
          <Link
            href="/register"
            className="rounded-full bg-myGrey-100 px-[.9em] py-[0.25em] text-sm text-myBlue-200 hover:outline hover:outline-2 hover:outline-black md:text-base xl:text-2xl"
          >
            {t('index.register')}
          </Link>
        </div>
      );
    } else {
      body = (
        <div className="my-3 flex flex-row items-center gap-6 font-bold">
          <LanguageSwitcher />
          <button
            onClick={async () => {
              await logout();
              await apolloClient.resetStore();
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

  const cards =
    featuredRecipes.length > 0
      ? featuredRecipes.map((recipe) => {
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
                difficulty={difficultyLabel(recipe.difficulty)}
              />
            </Link>
          );
        })
      : [<SkeletonCard key={0} />, <SkeletonCard key={1} />];

  return (
    <>
      <div className="min-h-screen w-full bg-myGrey-100 md:grid md:grid-cols-2">
        {/* ── Αριστερή στήλη: hero text ── */}
        <div className="container h-full pt-[1em]">
          <div className="mt-12 grid h-full grid-flow-row justify-items-center gap-4 md:mt-0 md:items-center md:gap-0">
            <h1 className="px-6 text-center text-3xl font-bold leading-10 md:mt-10 md:px-[1em] md:text-4xl xl:text-7xl">
              {t('index.hero_title')}
            </h1>
            <p className="px-6 text-center text-xs md:px-[3.5em] md:text-xl xl:text-3xl">
              {t('index.hero_subtitle')}
            </p>
            <Link
              href={meData?.me ? `/${meData.me.role.toLowerCase()}` : '/login'}
              className="mb-2 rounded-full bg-myBlue-200 px-[3.5em] py-[.25em] text-white hover:bg-myRed md:text-xl xl:text-3xl"
            >
              {t('index.cta')}
            </Link>
          </div>
        </div>

        {/* ── Δεξιά στήλη: logo + συνταγές ── */}
        <section className="container mt-[3em] grid grid-flow-row gap-4 rounded-[3em] bg-myBlue-200 font-exo font-normal md:mt-0 md:rounded-none md:rounded-bl-[6em]">
          <div className="grid grid-flow-col items-center justify-around px-2">
            {body}
          </div>

          {/* Mobile: slider με 1 κάρτα — Desktop: 2 κάρτες side by side */}
          <div className="my-[3.5em] px-6 md:px-3 md:py-[5em]">
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
