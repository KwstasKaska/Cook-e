import { Difficulty, RecipeCategory } from '../../../generated/graphql';

export interface IngredientRow {
  ingredientId: number;
  quantity: string;
  unit: string;
  name_el: string;
  name_en: string;
}

export interface StepRow {
  id: number;
  body: string;
}

export interface EditForm {
  title: string;
  description: string;
  chefComment: string;
  recipeImage: string;
  difficulty: Difficulty | '';
  prepTime: string;
  cookTime: string;
  restTime: string;
  category: RecipeCategory | '';
  caloriesTotal: string;
  protein: string;
  carbs: string;
  fat: string;
  ingredients: IngredientRow[];
  steps: StepRow[];
  utensilIds: number[];
}

export const DIFFICULTY_OPTIONS: {
  value: Difficulty;
  labelEl: string;
  labelEn: string;
}[] = [
  { value: Difficulty.Easy, labelEl: 'Εύκολο', labelEn: 'Easy' },
  { value: Difficulty.Medium, labelEl: 'Μέτριο', labelEn: 'Medium' },
  { value: Difficulty.Difficult, labelEl: 'Δύσκολο', labelEn: 'Difficult' },
];

export const CATEGORY_OPTIONS: {
  value: RecipeCategory;
  labelEl: string;
  labelEn: string;
}[] = [
  { value: RecipeCategory.Meat, labelEl: 'Κρέας', labelEn: 'Meat' },
  { value: RecipeCategory.Legumes, labelEl: 'Όσπρια', labelEn: 'Legumes' },
  { value: RecipeCategory.Seafood, labelEl: 'Θαλασσινά', labelEn: 'Seafood' },
  { value: RecipeCategory.Salads, labelEl: 'Σαλάτες', labelEn: 'Salads' },
  { value: RecipeCategory.Pasta, labelEl: 'Ζυμαρικά', labelEn: 'Pasta' },
  {
    value: RecipeCategory.Appetizers,
    labelEl: 'Ορεκτικά',
    labelEn: 'Appetizers',
  },
  { value: RecipeCategory.Vegan, labelEl: 'Vegan', labelEn: 'Vegan' },
];

export const MACRO_FIELDS: {
  field: 'caloriesTotal' | 'protein' | 'carbs' | 'fat';
  unit: string;
  labelKey: string;
}[] = [
  {
    field: 'caloriesTotal',
    unit: 'kcal',
    labelKey: 'chef.create_recipe.calories',
  },
  { field: 'protein', unit: 'g', labelKey: 'chef.create_recipe.protein' },
  { field: 'carbs', unit: 'g', labelKey: 'chef.create_recipe.carbs' },
  { field: 'fat', unit: 'g', labelKey: 'chef.create_recipe.fat' },
];

export const buildEditForm = (
  recipe: any,
  lang: 'el' | 'en' = 'el',
): EditForm => ({
  title: lang === 'en' ? recipe.title_en || recipe.title_el : recipe.title_el,
  description:
    lang === 'en'
      ? recipe.description_en ?? recipe.description_el ?? ''
      : recipe.description_el ?? '',
  chefComment:
    lang === 'en'
      ? recipe.chefComment_en ?? recipe.chefComment_el ?? ''
      : recipe.chefComment_el ?? '',
  recipeImage: recipe.recipeImage ?? '',
  difficulty: recipe.difficulty ?? '',
  prepTime: String(recipe.prepTime ?? ''),
  cookTime: String(recipe.cookTime ?? ''),
  restTime: String(recipe.restTime ?? ''),
  category: recipe.category ?? '',
  caloriesTotal:
    recipe.caloriesTotal != null ? String(recipe.caloriesTotal) : '',
  protein: recipe.protein != null ? String(recipe.protein) : '',
  carbs: recipe.carbs != null ? String(recipe.carbs) : '',
  fat: recipe.fat != null ? String(recipe.fat) : '',
  ingredients: (recipe.recipeIngredients ?? []).map((ri: any) => ({
    ingredientId: ri.ingredientId,
    quantity: ri.quantity ?? '',
    unit: ri.unit ?? '',
    name_el: ri.ingredient?.name_el ?? '',
    name_en: ri.ingredient?.name_en ?? '',
  })),
  steps: (recipe.steps ?? []).map((s: any) => ({
    id: s.id,
    body: lang === 'en' ? s.body_en || s.body_el : s.body_el,
  })),
  utensilIds: (recipe.utensils ?? []).map((u: any) => u.id),
});
