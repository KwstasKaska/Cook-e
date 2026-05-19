import { useTranslation } from 'next-i18next';

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
      className="cursor-pointer rounded-2xl bg-surface shadow-xl transition duration-300 hover:scale-105 overflow-hidden flex flex-col"
    >
      <div className="h-28 w-full overflow-hidden flex-shrink-0">
        <img
          src={recipe.recipeImage!}
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex flex-col gap-3 px-6 py-4">
        <h3 className="text-center">{title}</h3>

        {recipe.author?.user?.username && (
          <p className="mt-auto text-myText-muted">
            {t('recipes.by')} {recipe.author.user.username}
          </p>
        )}

        {suggestion.missingCount > 0 && (
          <p className="text-myYellow ">
            -{suggestion.missingCount} {t('recipes.missingIngredients')}
          </p>
        )}

        {suggestion.missingUtensils.length > 0 && (
          <p className="text-myRed ">
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
  onSelectRecipe,
  onBack,
  isEl,
}: {
  suggestions: Suggestion[];
  loading: boolean;
  onSelectRecipe: (id: number) => void;
  onBack: () => void;
  onSearch: () => void;
  isEl: boolean;
}) {
  const { t } = useTranslation('common');

  return (
    <div className="min-h-screen">
      <div className="max-w-5xl mx-auto px-6 pt-10 pb-20">
        <button
          onClick={onBack}
          className="flex items-center gap-2  mb-8 transition hover:opacity-80 text-myText-muted"
        >
          {t('recipes.backToSearch')}
        </button>

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-cookie-300 border-t-transparent" />
          </div>
        ) : suggestions.length === 0 ? (
          <p className="text-center text-myText-muted">
            {t('recipes.noResults')}
          </p>
        ) : (
          <>
            <h2 className="text-center mb-10">{t('recipes.resultsTitle')}</h2>

            <div className="flex flex-col gap-16 md:hidden">
              {suggestions.slice(0, 6).map((s) => (
                <SuggestionCard
                  key={s.recipe.id}
                  suggestion={s}
                  onClick={() => onSelectRecipe(s.recipe.id)}
                  isEl={isEl}
                />
              ))}
            </div>
            <div className="hidden md:grid md:grid-cols-3 md:gap-6">
              {suggestions.slice(0, 3).map((s) => (
                <SuggestionCard
                  key={s.recipe.id}
                  suggestion={s}
                  onClick={() => onSelectRecipe(s.recipe.id)}
                  isEl={isEl}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
