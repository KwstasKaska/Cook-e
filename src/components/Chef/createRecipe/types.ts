import { Difficulty, RecipeCategory } from '../../../generated/graphql';

export interface IngredientRow {
  id: number;
  ingredientId: number;
  quantity: string;
  unit: string;
}

export interface ExecutionStep {
  id: number;
  text: string;
}

export interface FormData {
  title: string;
  image: string | null;
  personalNote: string;
  prepTime: string;
  cookTime: string;
  restTime: string;
  difficulty: Difficulty | '';
  caloriesTotal: string;
  protein: string;
  carbs: string;
  fat: string;
  category: RecipeCategory | '';
  summary: string;
  ingredients: IngredientRow[];
  steps: ExecutionStep[];
}

export const UNIT_OPTIONS = [
  'g',
  'kg',
  'ml',
  'l',
  'τεμ.',
  'φλ.',
  'κ.σ.',
  'κ.γ.',
];

export { CATEGORY_OPTIONS } from '../../../utils/recipeUtils';

export const inputClass =
  'w-full border-2 border-cookie-400  py-2 outline-none focus:border-cookie-400 transition placeholder:text-myText-muted';
