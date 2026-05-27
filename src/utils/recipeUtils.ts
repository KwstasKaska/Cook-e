import { Difficulty, RecipeCategory } from '../generated/graphql';

export const DIFFICULTY_OPTIONS: {
  value: Difficulty;
  labelEl: string;
  labelEn: string;
}[] = [
  { value: Difficulty.Easy, labelEl: 'Εύκολος', labelEn: 'Easy' },
  { value: Difficulty.Medium, labelEl: 'Μέτριος', labelEn: 'Medium' },
  { value: Difficulty.Difficult, labelEl: 'Δύσκολος', labelEn: 'Difficult' },
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
