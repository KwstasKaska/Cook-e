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
  // Step 1
  title: string;
  image: string | null;
  // Step 2
  personalNote: string;
  prepTime: string;
  cookTime: string;
  restTime: string;
  difficulty: Difficulty | '';
  caloriesTotal: string;
  protein: string;
  carbs: string;
  fat: string;
  // Step 3
  category: RecipeCategory | '';
  cuisine: string;
  summary: string;
  // Step 4
  ingredients: IngredientRow[];
  // Step 5
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

export const inputClass =
  'w-full border-b border-gray-300 bg-transparent py-2 text-sm outline-none focus:border-myBlue-200 transition placeholder:text-gray-300';

export const labelClass = 'mb-1 block text-base font-black';
