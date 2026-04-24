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
