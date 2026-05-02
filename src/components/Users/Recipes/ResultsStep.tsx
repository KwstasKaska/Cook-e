import { useTranslation } from 'next-i18next';

type Suggestion = {
  missingCount: number;
  recipe: {
    id: number;
    title_el: string;
    title_en: string;
    recipeImage?: string | null;
    difficulty?: string | null;
    author?: { user?: { username?: string | null } | null } | null;
  };
};

function SuggestionCard({
  suggestion,
  index,
  onClick,
  isEl,
}: {
  suggestion: Suggestion;
  index: number;
  onClick: () => void;
  isEl: boolean;
}) {
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
      className={`relative cursor-pointer rounded-2xl bg-white shadow-xl transition duration-300 hover:scale-105 ${topPad} px-6 pb-8 flex flex-col gap-3`}
    >
      <div
        className={`absolute left-1/2 -translate-x-1/2 ${imgTop} ${imgSize} overflow-hidden rounded-full border-4 border-white shadow-xl bg-gray-100`}
      >
        {recipe.recipeImage ? (
          <img
            src={recipe.recipeImage}
            alt={title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-3xl">
            🍽️
          </div>
        )}
      </div>

      <h3 className="text-center text-lg font-bold text-gray-800">{title}</h3>

      {recipe.difficulty && (
        <p className="text-sm text-gray-600">{recipe.difficulty}</p>
      )}

      {recipe.author?.user?.username && (
        <p className="mt-auto pt-4 text-sm text-gray-600">
          {t('recipes.by')} {recipe.author.user.username}
        </p>
      )}

      {suggestion.missingCount > 0 && (
        <p className="text-xs text-orange-500 font-semibold">
          -{suggestion.missingCount} {t('recipes.missingIngredients')}
        </p>
      )}
    </div>
  );
}

export default function ResultsStep({
  suggestions,
  loading,
  onSelectRecipe,
  onBack,
  onSearch,
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
          className="flex items-center gap-2 text-sm font-bold mb-8 transition hover:opacity-80"
          style={{ color: '#EAB308' }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-4 w-4"
          >
            <path
              fillRule="evenodd"
              d="M7.72 12.53a.75.75 0 010-1.06l7.5-7.5a.75.75 0 111.06 1.06L9.31 12l6.97 6.97a.75.75 0 11-1.06 1.06l-7.5-7.5z"
              clipRule="evenodd"
            />
          </svg>
          {t('recipes.backToSearch')}
        </button>

        <h2 className="text-center text-2xl font-bold text-white mb-24">
          {t('recipes.resultsTitle')}
        </h2>

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-white border-t-transparent" />
          </div>
        ) : suggestions.length === 0 ? (
          <p className="text-center text-white">{t('recipes.noResults')}</p>
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

        <div className="mt-16 flex justify-center">
          <button
            onClick={onSearch}
            className="rounded-full border-2 bg-gray-500 border-white px-8 py-2 text-sm font-bold text-white transition hover:bg-white hover:text-gray-800"
          >
            {t('recipes.newSearch')}
          </button>
        </div>
      </div>
    </div>
  );
}
