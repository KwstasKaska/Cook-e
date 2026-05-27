import { useState } from 'react';
import { useRouter } from 'next/router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import NutrNavbar from '../../../components/Nutritionist/NutrNavbar';
import useIsNutritionist from '../../../utils/useIsNutr';
import { useRecipesQuery } from '../../../generated/graphql';
import PaginationControls from '../../../components/Helper/PaginationControls';
import { pick } from '../../../utils/pick';

export async function getServerSideProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}

const LIMIT = 9;

export default function NutrRecipesPage() {
  const { loading: authLoading, isAuthorized } = useIsNutritionist();
  if (authLoading || !isAuthorized) return null;
  return <NutrRecipesContent />;
}

const NutrRecipesContent = () => {
  const { t, i18n } = useTranslation('common');
  const router = useRouter();
  const lang = i18n.language;

  const [offset, setOffset] = useState(0);

  const { data, loading } = useRecipesQuery({
    variables: { limit: LIMIT, offset },
    fetchPolicy: 'cache-and-network',
  });

  const recipes = data?.recipes ?? [];
  const hasMore = recipes.length === LIMIT;
  const hasPrev = offset > 0;

  return (
    <div className="min-h-screen">
      <NutrNavbar />

      <div className="mx-auto max-w-3xl lg:max-w-4xl px-6 pb-16 pt-10">
        <button
          onClick={() => router.back()}
          className="mb-6 hover:text-cookie-400"
        >
          {t('common.back')}
        </button>

        <h1 className="mb-8 text-center">{t('nutr.nutr_recipes')}</h1>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-cookie-400 border-t-transparent" />
          </div>
        ) : recipes.length === 0 ? (
          <div className="py-12 text-center">
            <p>{t('chef.recipes.empty')}</p>
          </div>
        ) : (
          <div className="rounded-2xl bg-surface px-4 pb-8 pt-4 shadow-lg">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {recipes.map((recipe) => {
                const title = pick(recipe.title_el, recipe.title_en, lang);
                return (
                  <div
                    key={recipe.id}
                    onClick={() =>
                      router.push(`/nutritionist/recipes/${recipe.id}`)
                    }
                    className="cursor-pointer overflow-hidden rounded-2xl bg-surface shadow-xl transition duration-200 hover:scale-105 flex flex-col"
                  >
                    <div className="w-full bg-cookie-100 overflow-hidden">
                      {recipe.recipeImage ? (
                        <img
                          src={recipe.recipeImage}
                          alt={title}
                          className="h-28 w-full object-cover"
                        />
                      ) : (
                        <div className="h-28 w-full" />
                      )}
                    </div>
                    <div className="px-3 pt-2 pb-3 flex flex-col justify-center text-center">
                      <p className="line-clamp-2 break-words">{title}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {!loading && (hasMore || hasPrev) && (
          <div className="mt-6">
            <PaginationControls
              hasPrev={hasPrev}
              hasMore={hasMore}
              onPrev={() => {
                setOffset((o) => o - LIMIT);
                window.scrollTo({ top: 0 });
              }}
              onNext={() => {
                setOffset((o) => o + LIMIT);
                window.scrollTo({ top: 0 });
              }}
              prevLabel={t('pagination.prevRecipes')}
              nextLabel={t('pagination.nextRecipes')}
            />
          </div>
        )}
      </div>
    </div>
  );
};
