import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { Recipe } from '../../../generated/graphql';

const RECIPES_LIMIT = 2;

interface Props {
  recipes: Recipe[];
  loading: boolean;
  fetchingMore: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
}

export default function ChefContentGrid({
  recipes,
  loading,
  fetchingMore,
  hasMore,
  onLoadMore,
}: Props) {
  const { t } = useTranslation('common');
  const router = useRouter();
  const isEl = router.locale === 'el';

  return (
    <div>
      <h2 className="mb-4 flex justify-center text-xl font-bold text-black">
        {t('chef.profile.recipes')}
      </h2>

      {loading && !fetchingMore ? (
        <div className="flex justify-center py-8">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-myBlue-200 border-t-transparent" />
        </div>
      ) : recipes.length === 0 ? (
        <p className="text-sm text-gray-400">
          {t('chef.profile.no_recipes', 'No recipes yet.')}
        </p>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {recipes.map((recipe) => {
              const title = isEl ? recipe.title_el : recipe.title_en;
              return (
                <div
                  key={recipe.id}
                  onClick={() => router.push(`/user/recipes/${recipe.id}`)}
                  className="cursor-pointer overflow-hidden rounded-2xl shadow-lg transition hover:scale-[1.02] hover:shadow-xl"
                  style={{ backgroundColor: '#E9DEC5' }}
                >
                  <div className="relative h-36 w-full overflow-hidden">
                    {recipe.recipeImage ? (
                      <img
                        src={recipe.recipeImage}
                        alt={title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div
                        className="flex h-full w-full items-center justify-center text-4xl"
                        style={{ backgroundColor: '#B3D5F8' }}
                      >
                        🍽️
                      </div>
                    )}
                  </div>
                  <div className="px-4 py-3">
                    <p
                      className="truncate text-sm font-bold leading-tight"
                      style={{ color: '#3F4756' }}
                    >
                      {title}
                    </p>
                    {recipe.difficulty && (
                      <p className="mt-1 text-xs uppercase tracking-wide text-gray-500">
                        {recipe.difficulty}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {hasMore && (
            <div className="mt-6 flex justify-center">
              <button
                onClick={onLoadMore}
                disabled={fetchingMore}
                className="rounded-full px-8 py-2 text-sm font-bold transition hover:opacity-90 disabled:opacity-50"
                style={{ backgroundColor: '#B3D5F8', color: '#3F4756' }}
              >
                {fetchingMore ? t('common.loading') : t('chef.profile.more')}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export { RECIPES_LIMIT };
