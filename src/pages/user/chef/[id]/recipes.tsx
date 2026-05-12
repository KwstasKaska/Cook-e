import { useState } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Navbar from '../../../../components/Users/Navbar';
import PaginationControls from '../../../../components/Helper/PaginationControls';
import { useRecipesByChefQuery } from '../../../../generated/graphql';
import useIsUser from '../../../../utils/useIsUser';

const LIMIT = 12;

export async function getServerSideProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}

export default function ChefRecipesPage() {
  const { loading: authLoading, isAuthorized } = useIsUser();
  if (authLoading || !isAuthorized) return null;
  return <ChefRecipesContent />;
}

const ChefRecipesContent = () => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const { id } = router.query;
  const chefId = parseInt(id as string, 10);
  const isEl = router.locale === 'el';
  const [offset, setOffset] = useState(0);

  const { data, loading } = useRecipesByChefQuery({
    variables: { chefId, limit: LIMIT, offset },
    skip: isNaN(chefId),
    fetchPolicy: 'network-only',
  });

  const recipes = data?.recipesByChef ?? [];
  const hasMore = recipes.length === LIMIT;
  const hasPrev = offset > 0;

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="mx-auto max-w-3xl px-6 pb-16 pt-10">
        <button
          onClick={() => router.back()}
          className="mb-6 text-myText-muted hover:text-cookie-400"
        >
          ← {t('common.back')}
        </button>

        <h1 className="mb-8 text-center">{t('chef.profile.recipes')}</h1>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-cookie-400 border-t-transparent" />
          </div>
        ) : recipes.length === 0 && offset === 0 ? (
          <div className="py-12 text-center">
            <p className="text-myText-muted">{t('chef.landing.no_recipes')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {recipes.map((recipe) => {
              const title = isEl ? recipe.title_el : recipe.title_en;
              return (
                <div
                  key={recipe.id}
                  onClick={() => router.push(`/user/recipes/${recipe.id}`)}
                  className="cursor-pointer overflow-hidden rounded-2xl bg-surface shadow-lg transition hover:scale-[1.02] hover:shadow-xl"
                >
                  <div className="relative h-32 w-full overflow-hidden">
                    <img
                      src={recipe.recipeImage!}
                      alt={title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="px-4 py-3">
                    <p className="font-medium">{title}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {!loading && (
          <PaginationControls
            hasPrev={hasPrev}
            hasMore={hasMore && recipes.length > 0}
            onPrev={() => setOffset((o) => o - LIMIT)}
            onNext={() => setOffset((o) => o + LIMIT)}
          />
        )}
      </div>
    </div>
  );
};
