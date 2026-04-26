import { useState, useMemo } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../../components/Users/Navbar';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import HomeStep from '../../components/Users/Recipes/HomeStep';
import IngredientStep from '../../components/Users/Recipes/IngredientStep';
import UtensilStep from '../../components/Users/Recipes/UtensilStep';
import ResultsStep from '../../components/Users/Recipes/ResultsStep';
import {
  useIngredientsQuery,
  useUtensilsQuery,
  useMyFavoritesQuery,
  useSuggestedRecipesQuery,
  useUnsaveRecipeMutation,
} from '../../generated/graphql';
import useIsUser from '../../utils/useIsUser';

type Step = 'home' | 'ingredients' | 'utensils' | 'results';

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

function RecipesContent() {
  const router = useRouter();
  const isEl = router.locale === 'el';

  const [step, setStep] = useState<Step>('home');
  const [selectedIngredientIds, setSelectedIngredientIds] = useState<number[]>(
    [],
  );
  const [selectedUtensilIds, setSelectedUtensilIds] = useState<number[]>([]);

  // ── Queries
  const { data: ingredientsData, loading: ingredientsLoading } =
    useIngredientsQuery({ fetchPolicy: 'network-only' });

  const { data: utensilsData, loading: utensilsLoading } = useUtensilsQuery({
    fetchPolicy: 'network-only',
  });

  const {
    data: favData,
    loading: favLoading,
    refetch: refetchFavs,
    fetchMore: fetchMoreFavs,
    networkStatus: favNetworkStatus,
  } = useMyFavoritesQuery({
    variables: { limit: 4, offset: 0 },
    fetchPolicy: 'network-only',
    notifyOnNetworkStatusChange: true,
  });

  const { data: suggestedData, loading: suggestedLoading } =
    useSuggestedRecipesQuery({
      variables: {
        ingredientIds: selectedIngredientIds,
        utensilIds: selectedUtensilIds,
        maxMissing: 1,
      },
      skip: step !== 'results' || selectedIngredientIds.length === 0,
      fetchPolicy: 'network-only',
    });

  const [unsaveRecipe] = useUnsaveRecipeMutation();

  // ── Derived data
  const allIngredients = ingredientsData?.ingredients ?? [];
  const allUtensils = utensilsData?.utensils ?? [];
  const favorites = favData?.myFavorites ?? [];
  const suggestions = suggestedData?.suggestedRecipes ?? [];

  const loadingMoreFavorites = favNetworkStatus === 4;
  const hasMoreFavorites = favorites.length > 0 && favorites.length % 4 === 0;

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

  // ── Handlers
  const toggleIngredient = (id: number) =>
    setSelectedIngredientIds((p) =>
      p.includes(id) ? p.filter((i) => i !== id) : [...p, id],
    );

  const toggleUtensil = (id: number) =>
    setSelectedUtensilIds((p) =>
      p.includes(id) ? p.filter((i) => i !== id) : [...p, id],
    );

  const reset = () => {
    setStep('home');
    setSelectedIngredientIds([]);
    setSelectedUtensilIds([]);
  };

  const handleUnsave = async (recipeId: number) => {
    await unsaveRecipe({ variables: { recipeId } });
    await refetchFavs();
  };

  const handleLoadMoreFavorites = () => {
    fetchMoreFavs({
      variables: { limit: 4, offset: favorites.length },
    });
  };

  const goToDetail = (id: number) => router.push(`/user/recipes/${id}`);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#3F4756' }}>
      <Navbar />

      {step === 'home' && (
        <HomeStep
          favorites={favorites}
          favLoading={favLoading && !loadingMoreFavorites}
          hasMoreFavorites={hasMoreFavorites}
          loadingMoreFavorites={loadingMoreFavorites}
          onLoadMoreFavorites={handleLoadMoreFavorites}
          onStartPicker={() => setStep('ingredients')}
          onUnsave={handleUnsave}
          onSelectRecipe={goToDetail}
          isEl={isEl}
        />
      )}

      {step === 'ingredients' && (
        <IngredientStep
          categoryKeys={categoryKeys}
          ingredientsByCategory={ingredientsByCategory}
          selectedIds={selectedIngredientIds}
          onToggle={toggleIngredient}
          onNext={() => setStep('utensils')}
          onBack={() => setStep('home')}
          loading={ingredientsLoading}
          isEl={isEl}
        />
      )}

      {step === 'utensils' && (
        <UtensilStep
          utensils={allUtensils}
          selectedIds={selectedUtensilIds}
          onToggle={toggleUtensil}
          onBack={() => setStep('ingredients')}
          onSearch={() => setStep('results')}
          loading={utensilsLoading}
          isEl={isEl}
        />
      )}

      {step === 'results' && (
        <ResultsStep
          suggestions={suggestions}
          loading={suggestedLoading}
          onSelectRecipe={goToDetail}
          onBack={reset}
          isEl={isEl}
        />
      )}
    </div>
  );
}
