import { useTranslation } from 'next-i18next';

type Suggestion = {
  missingCount: number;
  missingUtensils: { id: number; name_el: string; name_en: string }[];
  recipe: {
    id: number;
    title_el: string;
    title_en: string;
    recipeImage?: string | null;
    difficulty?: string | null;
    author?: { user?: { username?: string | null } | null } | null;
  };
};

const SuggestionCard = ({
  suggestion,
  index,
  onClick,
  isEl,
}: {
  suggestion: Suggestion;
  index: number;
  onClick: () => void;
  isEl: boolean;
}) => {
  const { t } = useTranslation('common');
  const recipe = suggestion.recipe;
  const title = isEl ? recipe.title_el : recipe.title_en;
  const topPad = index === 0 ? 'pt-28' : index === 1 ? 'pt-24' : 'pt-20';
  const imgSize =
    index === 0 ? 'h-40 w-40' : index === 1 ? 'h-36 w-36' : 'h-32 w-32';
  const imgTop = index === 0 ? '-top-20' : index === 1 ? '-top-16' : '-top-14';

  return (
    <div
      onClick={onClick}
      className={`relative cursor-pointer rounded-2xl bg-surface shadow-xl transition duration-300 hover:scale-105 ${topPad} px-6 pb-8 flex flex-col gap-3`}
    >
      <div
        className={`absolute left-1/2 -translate-x-1/2 ${imgTop} ${imgSize} overflow-hidden rounded-full border-4 border-cookie-100 shadow-xl bg-cookie-100`}
      >
        <img
          src={recipe.recipeImage!}
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>

      <h3 className="text-center text-lg font-bold">{title}</h3>

      {recipe.difficulty && (
        <p className="text-sm text-myText-muted">{recipe.difficulty}</p>
      )}

      {recipe.author?.user?.username && (
        <p className="mt-auto pt-4 text-sm text-myText-muted">
          {t('recipes.by')} {recipe.author.user.username}
        </p>
      )}

      {suggestion.missingCount > 0 && (
        <p className="text-xs text-myYellow font-semibold">
          -{suggestion.missingCount} {t('recipes.missingIngredients')}
        </p>
      )}

      {suggestion.missingUtensils.length > 0 && (
        <p className="text-xs text-myRed font-semibold">
          {t('recipes.missingUtensils')}:{' '}
          {suggestion.missingUtensils
            .map((u) => (isEl ? u.name_el : u.name_en))
            .join(', ')}
        </p>
      )}
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
          className="flex items-center gap-2 text-sm font-bold mb-8 transition hover:opacity-80 text-cookie-300"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="h-4 w-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
            />
          </svg>
          {t('recipes.backToSearch')}
        </button>

        <h2 className="text-center text-2xl font-bold mb-24">
          {t('recipes.resultsTitle')}
        </h2>

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
            <div className="flex flex-col gap-16 md:hidden">
              {suggestions.slice(0, 6).map((s) => (
                <SuggestionCard
                  key={s.recipe.id}
                  suggestion={s}
                  index={1}
                  onClick={() => onSelectRecipe(s.recipe.id)}
                  isEl={isEl}
                />
              ))}
            </div>
            <div className="hidden md:grid md:grid-cols-3 md:items-end md:gap-6">
              {suggestions.slice(0, 3).map((s, i) => (
                <SuggestionCard
                  key={s.recipe.id}
                  suggestion={s}
                  index={i}
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
