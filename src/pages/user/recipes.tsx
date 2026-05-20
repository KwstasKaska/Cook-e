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

  const [selectedIngredientIds, setSelectedIngredientIds] = useState<number[]>(
    [],
  );
  const [selectedUtensilIds, setSelectedUtensilIds] = useState<number[]>([]);
  const [ingredientError, setIngredientError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);

  const { data: ingredientsData, loading: ingredientsLoading } =
    useIngredientsQuery({ fetchPolicy: 'network-only' });

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
      skip: !searched || selectedIngredientIds.length === 0,
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

  const toggleIngredient = (id: number) => {
    setSelectedIngredientIds((p) =>
      p.includes(id) ? p.filter((i) => i !== id) : [...p, id],
    );
    setSearched(false);
  };

  const toggleUtensil = (id: number) => {
    setSelectedUtensilIds((p) =>
      p.includes(id) ? p.filter((i) => i !== id) : [...p, id],
    );
    setSearched(false);
  };

  const handleSearch = () => {
    if (selectedIngredientIds.length < 3) {
      setIngredientError(t('recipes.minIngredientsError'));
      return;
    }
    setIngredientError(null);
    setSearched(true);
  };

  const goToDetail = (id: number) => router.push(`/user/recipes/${id}`);

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="mx-auto max-w-7xl px-6 pb-24 pt-10">
        <button
          onClick={() => router.back()}
          className="mb-6 text-myText-muted hover:text-cookie-400"
        >
          {t('common.back')}
        </button>

        <h1 className="mb-2 text-center">{t('recipes.title')}</h1>
        <div className="mb-8 ">
          <p className="">{t('recipes.recipeHint1')}</p>
        </div>

        <div className="flex flex-col gap-10 lg:grid lg:grid-cols-[2fr_1fr] lg:items-start lg:gap-10">
          <div className="w-full  lg:flex-1">
            <h2 className="mb-3 text-center">
              {t('ingredientCategories.title')}
            </h2>
            <IngredientStep
              categoryKeys={categoryKeys}
              ingredientsByCategory={ingredientsByCategory}
              selectedIds={selectedIngredientIds}
              onToggle={toggleIngredient}
              loading={ingredientsLoading}
              isEl={isEl}
              error={ingredientError}
              onClearError={() => setIngredientError(null)}
              allIngredients={allIngredients}
            />

            <h2 className="mb-3 mt-8 text-center">{t('utensils.title')}</h2>
            <UtensilStep
              utensils={allUtensils}
              selectedIds={selectedUtensilIds}
              onToggle={toggleUtensil}
              loading={utensilsLoading}
              isEl={isEl}
            />

            <div className="mt-8 flex justify-center">
              <button
                onClick={handleSearch}
                className="rounded-xl bg-cookie-300 px-10 py-2.5 text-white transition hover:bg-cookie-400"
              >
                {t('recipes.search')}
              </button>
            </div>
          </div>

          <div className="min-w-0 flex-1 lg:sticky lg:top-6">
            <ResultsStep
              suggestions={suggestions}
              loading={suggestedLoading}
              searched={searched}
              onSelectRecipe={goToDetail}
              isEl={isEl}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
