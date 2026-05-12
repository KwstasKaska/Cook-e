import { DayOfWeek, MealType } from '../generated/graphql';

export const DAY_ORDER: DayOfWeek[] = [
  DayOfWeek.Monday,
  DayOfWeek.Tuesday,
  DayOfWeek.Wednesday,
  DayOfWeek.Thursday,
  DayOfWeek.Friday,
  DayOfWeek.Saturday,
  DayOfWeek.Sunday,
];

export const MEAL_ORDER: MealType[] = [
  MealType.Breakfast,
  MealType.Snack,
  MealType.Lunch,
  MealType.Afternoon,
  MealType.Dinner,
];

export const JS_DAY_TO_ENUM: DayOfWeek[] = [
  DayOfWeek.Sunday,
  DayOfWeek.Monday,
  DayOfWeek.Tuesday,
  DayOfWeek.Wednesday,
  DayOfWeek.Thursday,
  DayOfWeek.Friday,
  DayOfWeek.Saturday,
];
