import { Difficulty, RecipeCategory } from '../../../generated/graphql';
import { pick } from '../../../utils/pick';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface IngredientRow {
  ingredientId: number;
  quantity: string;
  unit: string;
  name_el: string;
  name_en: string;
}

export interface StepRow {
  id: number; // required — buildEditForm always provides s.id; new rows use Date.now()
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
  foodEthnicity: string;
  category: RecipeCategory | '';
  caloriesTotal: string;
  protein: string;
  carbs: string;
  fat: string;
  ingredients: IngredientRow[];
  steps: StepRow[];
}

// ─── Constants ────────────────────────────────────────────────────────────────

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

// ─── Helper ───────────────────────────────────────────────────────────────────

export function buildEditForm(recipe: any, lang: string): EditForm {
  return {
    title: pick(recipe.title_el, recipe.title_en, lang),
    description: pick(
      recipe.description_el ?? '',
      recipe.description_en ?? '',
      lang,
    ),
    chefComment: pick(
      recipe.chefComment_el ?? '',
      recipe.chefComment_en ?? '',
      lang,
    ),
    recipeImage: recipe.recipeImage ?? '',
    difficulty: recipe.difficulty ?? '',
    prepTime: String(recipe.prepTime ?? ''),
    cookTime: String(recipe.cookTime ?? ''),
    restTime: String(recipe.restTime ?? ''),
    foodEthnicity: recipe.foodEthnicity ?? '',
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
      body: pick(s.body_el, s.body_en, lang),
    })),
  };
}
