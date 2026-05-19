import { useState, useMemo } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../../components/Users/Navbar';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import IngredientStep from '../../components/Users/Recipes/IngredientStep';
import UtensilStep from '../../components/Users/Recipes/UtensilStep';
import ResultsStep from '../../components/Users/Recipes/ResultsStep';
import {
  useIngredientsQuery,
  useUtensilsQuery,
  useSuggestedRecipesQuery,
} from '../../generated/graphql';
import useIsUser from '../../utils/useIsUser';

type Step = 'picker' | 'results';

export async function getServerSideProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}

export default function RecipesPage() {
  const { loading: authLoading, isAuthorized } = useIsUser();
  if (authLoading || !isAuthorized) return null;
  return <RecipesContent />;
}

const RecipesContent = () => {
  const router = useRouter();
  const { t } = useTranslation('common');
  const isEl = router.locale === 'el';

  const [step, setStep] = useState<Step>('picker');
  const [selectedIngredientIds, setSelectedIngredientIds] = useState<number[]>(
    [],
  );
  const [selectedUtensilIds, setSelectedUtensilIds] = useState<number[]>([]);
  const [ingredientError, setIngredientError] = useState<string | null>(null);

  const { data: ingredientsData, loading: ingredientsLoading } =
    useIngredientsQuery({
      fetchPolicy: 'network-only',
    });

  const { data: utensilsData, loading: utensilsLoading } = useUtensilsQuery({
    fetchPolicy: 'network-only',
  });

  const { data: suggestedData, loading: suggestedLoading } =
    useSuggestedRecipesQuery({
      variables: {
        ingredientIds: selectedIngredientIds,
        utensilIds: selectedUtensilIds,
        maxMissing: 3,
      },
      skip: step !== 'results' || selectedIngredientIds.length === 0,
      fetchPolicy: 'network-only',
    });

  const allIngredients = ingredientsData?.ingredients ?? [];
  const allUtensils = utensilsData?.utensils ?? [];
  const suggestions = suggestedData?.suggestedRecipes ?? [];

  const ingredientsByCategory = useMemo(() => {
    const map = new Map<string, typeof allIngredients>();
    for (const ing of allIngredients) {
      const catName = isEl
        ? ing.category?.name_el ?? 'Άλλα'
        : ing.category?.name_en ?? 'Other';
      if (!map.has(catName)) map.set(catName, []);
      map.get(catName)!.push(ing);
    }
    return map;
  }, [allIngredients, isEl]);

  const categoryKeys = Array.from(ingredientsByCategory.keys());

  const toggleIngredient = (id: number) =>
    setSelectedIngredientIds((p) =>
      p.includes(id) ? p.filter((i) => i !== id) : [...p, id],
    );

  const toggleUtensil = (id: number) =>
    setSelectedUtensilIds((p) =>
      p.includes(id) ? p.filter((i) => i !== id) : [...p, id],
    );

  const handleSearch = () => {
    if (selectedIngredientIds.length < 3) {
      setIngredientError(t('recipes.minIngredientsError'));
      return;
    }
    setIngredientError(null);
    setStep('results');
  };

  const goToDetail = (id: number) => router.push(`/user/recipes/${id}`);

  return (
    <div className="min-h-screen">
      <Navbar />

      {step === 'picker' && (
        <div className="mx-auto max-w-3xl px-6 pb-24 pt-10 lg:max-w-5xl">
          <div className="mb-10">
            <button
              onClick={() => router.back()}
              className="mb-6 text-myText-muted hover:text-cookie-400"
            >
              {t('common.back')}
            </button>
            <h1 className="mb-2">{t('recipes.title')}</h1>
            <p className="opacity-80 ">{t('recipes.recipeHint1')}</p>
            <p className="mt-1 opacity-80 ">{t('recipes.recipeHint2')}</p>
          </div>

          <h2 className="mb-4">{t('ingredientCategories.title')}</h2>
          <IngredientStep
            categoryKeys={categoryKeys}
            ingredientsByCategory={ingredientsByCategory}
            selectedIds={selectedIngredientIds}
            onToggle={toggleIngredient}
            loading={ingredientsLoading}
            isEl={isEl}
            error={ingredientError}
            onClearError={() => setIngredientError(null)}
          />

          <h2 className="mb-4 mt-10">{t('utensils.title')}</h2>
          <UtensilStep
            utensils={allUtensils}
            selectedIds={selectedUtensilIds}
            onToggle={toggleUtensil}
            loading={utensilsLoading}
            isEl={isEl}
          />

          <div className="mt-10 flex justify-center">
            <button
              onClick={handleSearch}
              className="rounded-xl border-2 border-cookie-400 px-8 py-2.5 shadow-xl transition hover:bg-cookie-400 hover:text-white"
            >
              {t('recipes.search')}
            </button>
          </div>
        </div>
      )}

      {step === 'results' && (
        <ResultsStep
          suggestions={suggestions}
          loading={suggestedLoading}
          onSelectRecipe={goToDetail}
          onBack={() => setStep('picker')}
          onSearch={() => setStep('picker')}
          isEl={isEl}
        />
      )}
    </div>
  );
};
