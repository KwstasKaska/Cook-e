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

  const filtered = recipes.filter((r) =>
    pick(r.title_el, r.title_en, lang).toLowerCase(),
  );

  return (
    <div className="min-h-screen bg-cookie-100">
      <NutrNavbar />

      <div className="mx-auto max-w-5xl px-6 pb-16 pt-10">
        <button
          onClick={() => router.back()}
          className="mb-6 flex items-center gap-2 text-myText-muted transition hover:text-cookie-400"
        >
          {t('common.back')}
        </button>

        <div className="mb-8 text-center">
          <h1>{t('nutr.nutr_recipes')}</h1>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-cookie-400 border-t-transparent" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-myText-muted">{t('chef.recipes.empty')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
            {filtered.map((recipe) => {
              const title = pick(recipe.title_el, recipe.title_en, lang);
              const author = recipe.author?.user?.username ?? '';
              return (
                <button
                  key={recipe.id}
                  onClick={() =>
                    router.push(`/nutritionist/recipes/${recipe.id}`)
                  }
                  className="group flex flex-col overflow-hidden rounded-2xl bg-surface text-left shadow-lg transition hover:scale-105 hover:shadow-xl"
                >
                  <div className="relative h-40 w-full overflow-hidden">
                    <img
                      src={recipe.recipeImage ?? undefined}
                      alt={title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>
                  <div className="flex flex-col gap-1 p-3">
                    <p className="line-clamp-2 ">{title}</p>
                    {author && <p className="text-myText-muted">by {author}</p>}
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {!loading && (hasMore || hasPrev) && (
          <div className="mt-6">
            <PaginationControls
              hasPrev={hasPrev}
              hasMore={hasMore}
              onPrev={() => setOffset((o) => o - LIMIT)}
              onNext={() => setOffset((o) => o + LIMIT)}
              prevLabel={t('pagination.prevRecipes')}
              nextLabel={t('pagination.nextRecipes')}
            />
          </div>
        )}
      </div>
    </div>
  );
};
