import { useState } from 'react';
import { useTranslation } from 'next-i18next';
import PaginationControls from '../../Helper/PaginationControls';

type Suggestion = {
  missingCount: number;
  missingUtensils: { id: number; name_el: string; name_en: string }[];
  recipe: {
    id: number;
    title_el: string;
    title_en: string;
    recipeImage?: string | null;
    author?: { user?: { username?: string | null } | null } | null;
  };
};

const PAGE_SIZE = 3;

const SuggestionCard = ({
  suggestion,
  onClick,
  isEl,
}: {
  suggestion: Suggestion;
  onClick: () => void;
  isEl: boolean;
}) => {
  const { t } = useTranslation('common');
  const recipe = suggestion.recipe;
  const title = isEl ? recipe.title_el : recipe.title_en;

  return (
    <div
      onClick={onClick}
      className="flex cursor-pointer flex-col overflow-hidden rounded-2xl bg-cookie-100 shadow-md transition duration-300 hover:scale-[1.02] hover:shadow-xl"
    >
      {recipe.recipeImage && (
        <div className="h-28 w-full flex-shrink-0 overflow-hidden">
          <img
            src={recipe.recipeImage}
            alt={title}
            className="h-full w-full object-cover"
          />
        </div>
      )}
      <div className="flex flex-col gap-2 px-4 py-3">
        <p>{title}</p>
        {recipe.author?.user?.username && (
          <p className="text-xs">
            {t('recipes.by')} {recipe.author.user.username}
          </p>
        )}
        {suggestion.missingCount > 0 && (
          <p className="text-xs text-myYellow">
            -{suggestion.missingCount} {t('recipes.missingIngredients')}
          </p>
        )}
        {suggestion.missingUtensils.length > 0 && (
          <p className="text-xs text-myRed">
            {t('recipes.missingUtensils')}:{' '}
            {suggestion.missingUtensils
              .map((u) => (isEl ? u.name_el : u.name_en))
              .join(', ')}
          </p>
        )}
      </div>
    </div>
  );
};

export default function ResultsStep({
  suggestions,
  loading,
  searched,
  onSelectRecipe,
  isEl,
}: {
  suggestions: Suggestion[];
  loading: boolean;
  searched: boolean;
  onSelectRecipe: (id: number) => void;
  isEl: boolean;
}) {
  const { t } = useTranslation('common');
  const [page, setPage] = useState(0);

  const totalPages = Math.ceil(suggestions.length / PAGE_SIZE);
  const paginated = suggestions.slice(
    page * PAGE_SIZE,
    page * PAGE_SIZE + PAGE_SIZE,
  );

  return (
    <div className="rounded-2xl bg-surface p-5 shadow-lg">
      <h2 className="mb-4 text-center">{t('chef.recipes.page_title')}</h2>

      {loading ? (
        <div className="flex justify-center py-24">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-cookie-300 border-t-transparent" />
        </div>
      ) : !searched ? (
        <p className="text-center text-myText-muted">
          {t('recipes.recipeHint1')}
        </p>
      ) : suggestions.length === 0 ? (
        <p className="text-center text-myText-muted">
          {t('recipes.noResults')}
        </p>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-3">
            {paginated.map((s) => (
              <SuggestionCard
                key={s.recipe.id}
                suggestion={s}
                onClick={() => onSelectRecipe(s.recipe.id)}
                isEl={isEl}
              />
            ))}
          </div>

          <PaginationControls
            hasPrev={page > 0}
            hasMore={page < totalPages - 1}
            onPrev={() => setPage((p) => p - 1)}
            onNext={() => setPage((p) => p + 1)}
            prevLabel={t('pagination.prevRecipes')}
            nextLabel={t('pagination.nextRecipes')}
          />
        </>
      )}
    </div>
  );
}
