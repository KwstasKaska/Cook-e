export function recipeImageSrc(recipeImage?: string | null): string {
  if (!recipeImage) return '/images/food.jpg';
  return recipeImage;
}

export function totalDuration(
  prepTime: number,
  cookTime: number,
  restTime?: number | null,
): number {
  return prepTime + cookTime + (restTime ?? 0);
}

export const getDifficultyLabel = (
  difficulty: string | null | undefined,
  t: (key: string) => string,
): string => {
  if (!difficulty) return '';
  const map: Record<string, string> = {
    easy: t('chef.create_recipe.easy'),
    medium: t('chef.create_recipe.medium'),
    difficult: t('chef.create_recipe.hard'),
    EASY: t('chef.create_recipe.easy'),
    MEDIUM: t('chef.create_recipe.medium'),
    DIFFICULT: t('chef.create_recipe.hard'),
  };
  return map[difficulty] ?? difficulty;
};
