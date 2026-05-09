import { useState } from 'react';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useRecipesByChefQuery } from '../../../generated/graphql';
import PaginationControls from '../../Helper/PaginationControls';

const LIMIT = 2;

interface Props {
  chefId: number;
}

export default function ChefContentGrid({ chefId }: Props) {
  const { t } = useTranslation('common');
  const router = useRouter();
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
    <div>
      <h2 className="mb-4 flex justify-center text-xl font-bold text-white">
        {t('chef.profile.recipes')}
      </h2>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-myBlue-200 border-t-transparent" />
        </div>
      ) : recipes.length === 0 && offset === 0 ? (
        <p className="text-sm text-gray-400">{t('chef.landing.no_recipes')}</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {recipes.map((recipe) => {
            const title = isEl ? recipe.title_el : recipe.title_en;
            return (
              <div
                key={recipe.id}
                onClick={() => router.push(`/user/recipes/${recipe.id}`)}
                className="cursor-pointer overflow-hidden rounded-2xl shadow-lg transition bg-myBeige-100 hover:scale-[1.02] hover:shadow-xl"
              >
                <div className="relative h-36 w-full overflow-hidden">
                  recipe.recipeImage
                  <img
                    src={recipe.recipeImage!}
                    alt={title}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="px-4 py-3">
                  <p className="truncate text-sm font-bold leading-tight">
                    {title}
                  </p>
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
  );
}
