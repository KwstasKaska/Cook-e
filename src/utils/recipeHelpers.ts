import { Recipe } from '../generated/graphql';

export function recipeImageSrc(recipeImage?: string | null): string {
  if (!recipeImage) return '/images/food.jpg';
  if (recipeImage.startsWith('data:')) return recipeImage;
  return `http://localhost:4000${recipeImage}`;
}

export function totalDuration(
  recipe: Pick<Recipe, 'prepTime' | 'cookTime' | 'restTime'>,
): number {
  return (
    (recipe.prepTime ?? 0) + (recipe.cookTime ?? 0) + (recipe.restTime ?? 0)
  );
}
