import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type AddAppointmentInput = {
  date: Scalars['String']['input'];
  time: Scalars['String']['input'];
};

/** New Article Data */
export type AddArticleInput = {
  image?: InputMaybe<Scalars['String']['input']>;
  text: Scalars['String']['input'];
  title: Scalars['String']['input'];
};

export type Appointment = {
  __typename?: 'Appointment';
  date: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  isAvailable: Scalars['Boolean']['output'];
  nutritionistId: Scalars['Float']['output'];
  time: Scalars['String']['output'];
};

export type AppointmentRequest = {
  __typename?: 'AppointmentRequest';
  client?: Maybe<User>;
  clientId: Scalars['Float']['output'];
  comment?: Maybe<Scalars['String']['output']>;
  id: Scalars['Int']['output'];
  requestedAt: Scalars['String']['output'];
  slot?: Maybe<Appointment>;
  slotId: Scalars['Float']['output'];
  status: AppointmentStatus;
};

export type AppointmentRequestInput = {
  comment?: InputMaybe<Scalars['String']['input']>;
  slotId: Scalars['Int']['input'];
};

export type AppointmentRequestResponse = {
  __typename?: 'AppointmentRequestResponse';
  appointmentRequest?: Maybe<AppointmentRequest>;
  errors?: Maybe<Array<FieldError>>;
};

export type AppointmentResponse = {
  __typename?: 'AppointmentResponse';
  errors?: Maybe<Array<FieldError>>;
  slot?: Maybe<Appointment>;
};

export enum AppointmentStatus {
  Accepted = 'ACCEPTED',
  Pending = 'PENDING',
  Rejected = 'REJECTED'
}

export type Article = {
  __typename?: 'Article';
  createdAt: Scalars['String']['output'];
  creatorId: Scalars['Float']['output'];
  id: Scalars['Float']['output'];
  image: Scalars['String']['output'];
  text_el: Scalars['String']['output'];
  text_en: Scalars['String']['output'];
  title_el: Scalars['String']['output'];
  title_en: Scalars['String']['output'];
  updatedAt: Scalars['String']['output'];
};

export type ArticleResponse = {
  __typename?: 'ArticleResponse';
  article?: Maybe<Article>;
  errors?: Maybe<Array<FieldError>>;
};

export type ChefProfile = {
  __typename?: 'ChefProfile';
  bio?: Maybe<Scalars['String']['output']>;
  id: Scalars['Float']['output'];
  ratings?: Maybe<Array<ChefRating>>;
  recipes?: Maybe<Array<Recipe>>;
  user: User;
};

export type ChefProfileResponse = {
  __typename?: 'ChefProfileResponse';
  chefProfile?: Maybe<ChefProfile>;
  errors?: Maybe<Array<FieldError>>;
};

export type ChefRating = {
  __typename?: 'ChefRating';
  chefId: Scalars['Int']['output'];
  comment?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  score: Scalars['Int']['output'];
  updatedAt: Scalars['String']['output'];
  user?: Maybe<User>;
  userId: Scalars['Int']['output'];
};

export type Conversation = {
  __typename?: 'Conversation';
  createdAt: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  messages: Array<Message>;
  participant1: User;
  participant1Id: Scalars['Int']['output'];
  participant2: User;
  participant2Id: Scalars['Int']['output'];
  updatedAt: Scalars['String']['output'];
};

export type ConversationResponse = {
  __typename?: 'ConversationResponse';
  conversation?: Maybe<Conversation>;
  errors?: Maybe<Array<FieldError>>;
};

export type CookedRecipe = {
  __typename?: 'CookedRecipe';
  cookedAt: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  recipe?: Maybe<Recipe>;
  recipeId: Scalars['Int']['output'];
  userId: Scalars['Int']['output'];
};

export type CreateRecipeInput = {
  caloriesTotal?: InputMaybe<Scalars['Float']['input']>;
  carbs?: InputMaybe<Scalars['Float']['input']>;
  category?: InputMaybe<RecipeCategory>;
  chefComment?: InputMaybe<Scalars['String']['input']>;
  cookTime: Scalars['Int']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  difficulty: Difficulty;
  fat?: InputMaybe<Scalars['Float']['input']>;
  foodEthnicity?: InputMaybe<Scalars['String']['input']>;
  ingredients: Array<RecipeIngredientInput>;
  prepTime: Scalars['Int']['input'];
  protein?: InputMaybe<Scalars['Float']['input']>;
  recipeImage?: InputMaybe<Scalars['String']['input']>;
  restTime?: InputMaybe<Scalars['Int']['input']>;
  steps: Array<RecipeStepInput>;
  title: Scalars['String']['input'];
  utensilIds?: InputMaybe<Array<Scalars['Int']['input']>>;
};

export enum DayOfWeek {
  Friday = 'FRIDAY',
  Monday = 'MONDAY',
  Saturday = 'SATURDAY',
  Sunday = 'SUNDAY',
  Thursday = 'THURSDAY',
  Tuesday = 'TUESDAY',
  Wednesday = 'WEDNESDAY'
}

/** The difficulty level of the food preparation */
export enum Difficulty {
  Difficult = 'DIFFICULT',
  Easy = 'EASY',
  Medium = 'MEDIUM'
}

export type FieldError = {
  __typename?: 'FieldError';
  field: Scalars['String']['output'];
  message: Scalars['String']['output'];
};

export type Ingredient = {
  __typename?: 'Ingredient';
  caloriesPer100g?: Maybe<Scalars['Float']['output']>;
  category?: Maybe<IngredientsCategory>;
  id: Scalars['Float']['output'];
  name_el: Scalars['String']['output'];
  name_en: Scalars['String']['output'];
  recipeIngredients?: Maybe<Array<RecipeIngredient>>;
};

export type IngredientsCategory = {
  __typename?: 'IngredientsCategory';
  id: Scalars['Float']['output'];
  name_el: Scalars['String']['output'];
  name_en: Scalars['String']['output'];
};

export type MealPlanResponse = {
  __typename?: 'MealPlanResponse';
  errors?: Maybe<Array<FieldError>>;
  mealScheduler?: Maybe<MealScheduler>;
};

export type MealScheduler = {
  __typename?: 'MealScheduler';
  comment_el: Scalars['String']['output'];
  comment_en: Scalars['String']['output'];
  day: DayOfWeek;
  id: Scalars['Int']['output'];
  mealType: MealType;
  nutritionist: NutritionistProfile;
  user: User;
};

export enum MealType {
  Afternoon = 'AFTERNOON',
  Breakfast = 'BREAKFAST',
  Dinner = 'DINNER',
  Lunch = 'LUNCH',
  Snack = 'SNACK'
}

export type Message = {
  __typename?: 'Message';
  body: Scalars['String']['output'];
  conversationId: Scalars['Int']['output'];
  createdAt: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  sender: User;
  senderId: Scalars['Int']['output'];
};

export type MessageResponse = {
  __typename?: 'MessageResponse';
  errors?: Maybe<Array<FieldError>>;
  message?: Maybe<Message>;
};

export type Mutation = {
  __typename?: 'Mutation';
  addManyToCart: Array<ShoppingCart>;
  addToCart: ShoppingCart;
  changePassword: UserResponse;
  clearCart: Scalars['Boolean']['output'];
  createAppointment: AppointmentResponse;
  createArticle: ArticleResponse;
  createMealScheduler: MealPlanResponse;
  createRecipe: RecipeResponse;
  deleteAppointment: Scalars['Boolean']['output'];
  deleteAppointmentRequest: Scalars['Boolean']['output'];
  deleteArticle: Scalars['Boolean']['output'];
  deleteChefRating: Scalars['Boolean']['output'];
  deleteCookLog: Scalars['Boolean']['output'];
  deleteMealScheduler: MealPlanResponse;
  deleteRecipe: Scalars['Boolean']['output'];
  deleteRecipeRating: Scalars['Boolean']['output'];
  forgotPassword: Scalars['Boolean']['output'];
  logCookedRecipe: CookedRecipe;
  login: UserResponse;
  logout: Scalars['Boolean']['output'];
  rateChef: ChefRating;
  rateRecipe: RecipeRating;
  register: UserResponse;
  removeFromCart: Scalars['Boolean']['output'];
  requestAppointment: AppointmentRequestResponse;
  respondToAppointmentRequest: Scalars['Boolean']['output'];
  saveRecipe: UserFavorite;
  sendMessage: MessageResponse;
  startConversation: ConversationResponse;
  unsaveRecipe: Scalars['Boolean']['output'];
  updateAppointment?: Maybe<AppointmentResponse>;
  updateAppointmentRequest?: Maybe<AppointmentRequestResponse>;
  updateArticle: ArticleResponse;
  updateCartItem: ShoppingCart;
  updateChefProfile: ChefProfileResponse;
  updateMealScheduler?: Maybe<MealPlanResponse>;
  updateNutritionistProfile: NutritionistProfileResponse;
  updateRecipe: RecipeResponse;
  updateUser: UserResponse;
};


export type MutationAddManyToCartArgs = {
  ingredientIds: Array<Scalars['Int']['input']>;
};


export type MutationAddToCartArgs = {
  ingredientId: Scalars['Int']['input'];
  note?: InputMaybe<Scalars['String']['input']>;
  quantity?: InputMaybe<Scalars['String']['input']>;
  unit?: InputMaybe<Scalars['String']['input']>;
};


export type MutationChangePasswordArgs = {
  newPassword: Scalars['String']['input'];
  token: Scalars['String']['input'];
};


export type MutationCreateAppointmentArgs = {
  data: AddAppointmentInput;
};


export type MutationCreateArticleArgs = {
  data: AddArticleInput;
};


export type MutationCreateMealSchedulerArgs = {
  comment: Scalars['String']['input'];
  day: DayOfWeek;
  mealType: MealType;
  userId: Scalars['Float']['input'];
};


export type MutationCreateRecipeArgs = {
  data: CreateRecipeInput;
};


export type MutationDeleteAppointmentArgs = {
  slotId: Scalars['Int']['input'];
};


export type MutationDeleteAppointmentRequestArgs = {
  id: Scalars['Float']['input'];
};


export type MutationDeleteArticleArgs = {
  id: Scalars['Int']['input'];
};


export type MutationDeleteChefRatingArgs = {
  chefId: Scalars['Int']['input'];
};


export type MutationDeleteCookLogArgs = {
  id: Scalars['Int']['input'];
};


export type MutationDeleteMealSchedulerArgs = {
  id: Scalars['Int']['input'];
};


export type MutationDeleteRecipeArgs = {
  id: Scalars['Int']['input'];
};


export type MutationDeleteRecipeRatingArgs = {
  recipeId: Scalars['Int']['input'];
};


export type MutationForgotPasswordArgs = {
  email: Scalars['String']['input'];
};


export type MutationLogCookedRecipeArgs = {
  recipeId: Scalars['Int']['input'];
};


export type MutationLoginArgs = {
  password: Scalars['String']['input'];
  usernameOrEmail: Scalars['String']['input'];
};


export type MutationRateChefArgs = {
  chefId: Scalars['Int']['input'];
  comment?: InputMaybe<Scalars['String']['input']>;
  score: Scalars['Int']['input'];
};


export type MutationRateRecipeArgs = {
  comment?: InputMaybe<Scalars['String']['input']>;
  recipeId: Scalars['Int']['input'];
  score: Scalars['Int']['input'];
};


export type MutationRegisterArgs = {
  options: RegisterUserInput;
};


export type MutationRemoveFromCartArgs = {
  id: Scalars['Int']['input'];
};


export type MutationRequestAppointmentArgs = {
  data: AppointmentRequestInput;
};


export type MutationRespondToAppointmentRequestArgs = {
  requestId: Scalars['Float']['input'];
  status: AppointmentStatus;
};


export type MutationSaveRecipeArgs = {
  recipeId: Scalars['Int']['input'];
};


export type MutationSendMessageArgs = {
  body: Scalars['String']['input'];
  conversationId: Scalars['Int']['input'];
};


export type MutationStartConversationArgs = {
  participantId: Scalars['Int']['input'];
};


export type MutationUnsaveRecipeArgs = {
  recipeId: Scalars['Int']['input'];
};


export type MutationUpdateAppointmentArgs = {
  data: UpdateSlotInput;
};


export type MutationUpdateAppointmentRequestArgs = {
  data: AppointmentRequestInput;
};


export type MutationUpdateArticleArgs = {
  data: UpdateArticleInput;
};


export type MutationUpdateCartItemArgs = {
  id: Scalars['Int']['input'];
  note?: InputMaybe<Scalars['String']['input']>;
  quantity?: InputMaybe<Scalars['String']['input']>;
  unit?: InputMaybe<Scalars['String']['input']>;
};


export type MutationUpdateChefProfileArgs = {
  data: UpdateChefProfileInput;
};


export type MutationUpdateMealSchedulerArgs = {
  data: UpdateMealSchedulerInput;
};


export type MutationUpdateNutritionistProfileArgs = {
  data: UpdateNutritionistProfileInput;
};


export type MutationUpdateRecipeArgs = {
  data: UpdateRecipeInput;
};


export type MutationUpdateUserArgs = {
  data: UpdateUserInput;
};

export type NutritionalSummary = {
  __typename?: 'NutritionalSummary';
  cookCount: Scalars['Int']['output'];
  totalCalories?: Maybe<Scalars['Float']['output']>;
  totalCarbs?: Maybe<Scalars['Float']['output']>;
  totalFat?: Maybe<Scalars['Float']['output']>;
  totalProtein?: Maybe<Scalars['Float']['output']>;
};

export type NutritionistProfile = {
  __typename?: 'NutritionistProfile';
  bio?: Maybe<Scalars['String']['output']>;
  city?: Maybe<Scalars['String']['output']>;
  id: Scalars['Float']['output'];
  phone?: Maybe<Scalars['String']['output']>;
  user?: Maybe<User>;
};

export type NutritionistProfileResponse = {
  __typename?: 'NutritionistProfileResponse';
  errors?: Maybe<Array<FieldError>>;
  nutritionistProfile?: Maybe<NutritionistProfile>;
};

export type Query = {
  __typename?: 'Query';
  article?: Maybe<Article>;
  articles: Array<Article>;
  articlesByChef: Array<Article>;
  articlesByNutritionist: Array<Article>;
  availableSlots: Array<Appointment>;
  chef?: Maybe<ChefProfile>;
  chefArticles: Array<Article>;
  chefAverageRating?: Maybe<Scalars['Float']['output']>;
  chefRatings: Array<ChefRating>;
  chefs: Array<ChefProfile>;
  conversation?: Maybe<Conversation>;
  getAppointmentRequestsForNutritionist: Array<AppointmentRequest>;
  getMyAppointments: Array<Appointment>;
  getNutritionistMealPlans: Array<MealScheduler>;
  ingredientCategories: Array<IngredientsCategory>;
  ingredients: Array<Ingredient>;
  isFavorited: Scalars['Boolean']['output'];
  me?: Maybe<User>;
  myAppointmentRequests: Array<AppointmentRequest>;
  myArticles: Array<Article>;
  myCart: Array<ShoppingCart>;
  myChefProfile?: Maybe<ChefProfile>;
  myChefRating?: Maybe<ChefRating>;
  myConversations: Array<Conversation>;
  myCookedRecipes: Array<CookedRecipe>;
  myFavorites: Array<UserFavorite>;
  myMealPlan: Array<MealScheduler>;
  myNutritionPlans: Array<MealScheduler>;
  myNutritionalSummary: NutritionalSummary;
  myNutritionistProfile?: Maybe<NutritionistProfile>;
  myRecipeRating?: Maybe<RecipeRating>;
  myRecipes: Array<Recipe>;
  myRecipesByCategory: Array<Recipe>;
  nutritionist?: Maybe<NutritionistProfile>;
  nutritionists: Array<NutritionistProfile>;
  recipe?: Maybe<Recipe>;
  recipeAverageRating?: Maybe<Scalars['Float']['output']>;
  recipeRatings: Array<RecipeRating>;
  recipes: Array<Recipe>;
  recipesByCategory: Array<Recipe>;
  recipesByChef: Array<Recipe>;
  suggestedRecipes: Array<RecipeSuggestion>;
  topRatedRecipes: Array<Recipe>;
  utensils: Array<Utensil>;
};


export type QueryArticleArgs = {
  id: Scalars['Int']['input'];
};


export type QueryArticlesArgs = {
  limit?: Scalars['Int']['input'];
  offset?: Scalars['Int']['input'];
};


export type QueryArticlesByChefArgs = {
  chefId: Scalars['Int']['input'];
  limit?: Scalars['Int']['input'];
  offset?: Scalars['Int']['input'];
};


export type QueryArticlesByNutritionistArgs = {
  limit?: Scalars['Int']['input'];
  nutritionistId: Scalars['Int']['input'];
  offset?: Scalars['Int']['input'];
};


export type QueryAvailableSlotsArgs = {
  nutritionistId: Scalars['Int']['input'];
};


export type QueryChefArgs = {
  id: Scalars['Int']['input'];
};


export type QueryChefArticlesArgs = {
  limit?: Scalars['Int']['input'];
  offset?: Scalars['Int']['input'];
};


export type QueryChefAverageRatingArgs = {
  chefId: Scalars['Int']['input'];
};


export type QueryChefRatingsArgs = {
  chefId: Scalars['Int']['input'];
  limit?: Scalars['Int']['input'];
  offset?: Scalars['Int']['input'];
};


export type QueryChefsArgs = {
  limit?: Scalars['Int']['input'];
  offset?: Scalars['Int']['input'];
};


export type QueryConversationArgs = {
  id: Scalars['Int']['input'];
};


export type QueryGetAppointmentRequestsForNutritionistArgs = {
  limit?: Scalars['Int']['input'];
  offset?: Scalars['Int']['input'];
};


export type QueryGetMyAppointmentsArgs = {
  date?: InputMaybe<Scalars['String']['input']>;
  limit?: Scalars['Int']['input'];
  offset?: Scalars['Int']['input'];
};


export type QueryGetNutritionistMealPlansArgs = {
  limit?: Scalars['Int']['input'];
  offset?: Scalars['Int']['input'];
};


export type QueryIsFavoritedArgs = {
  recipeId: Scalars['Int']['input'];
};


export type QueryMyArticlesArgs = {
  limit?: Scalars['Int']['input'];
  offset?: Scalars['Int']['input'];
};


export type QueryMyCartArgs = {
  limit?: Scalars['Int']['input'];
  offset?: Scalars['Int']['input'];
};


export type QueryMyChefRatingArgs = {
  chefId: Scalars['Int']['input'];
};


export type QueryMyConversationsArgs = {
  limit?: Scalars['Int']['input'];
  offset?: Scalars['Int']['input'];
};


export type QueryMyCookedRecipesArgs = {
  limit?: Scalars['Int']['input'];
  offset?: Scalars['Int']['input'];
};


export type QueryMyFavoritesArgs = {
  limit?: Scalars['Int']['input'];
  offset?: Scalars['Int']['input'];
};


export type QueryMyRecipeRatingArgs = {
  recipeId: Scalars['Int']['input'];
};


export type QueryMyRecipesArgs = {
  limit?: Scalars['Int']['input'];
  offset?: Scalars['Int']['input'];
};


export type QueryMyRecipesByCategoryArgs = {
  category: RecipeCategory;
  limit?: Scalars['Int']['input'];
  offset?: Scalars['Int']['input'];
};


export type QueryNutritionistArgs = {
  id: Scalars['Int']['input'];
};


export type QueryNutritionistsArgs = {
  limit?: Scalars['Int']['input'];
  offset?: Scalars['Int']['input'];
};


export type QueryRecipeArgs = {
  id: Scalars['Int']['input'];
};


export type QueryRecipeAverageRatingArgs = {
  recipeId: Scalars['Int']['input'];
};


export type QueryRecipeRatingsArgs = {
  limit?: Scalars['Int']['input'];
  offset?: Scalars['Int']['input'];
  recipeId: Scalars['Int']['input'];
};


export type QueryRecipesArgs = {
  limit?: Scalars['Int']['input'];
  offset?: Scalars['Int']['input'];
};


export type QueryRecipesByCategoryArgs = {
  category: RecipeCategory;
  limit?: Scalars['Int']['input'];
  offset?: Scalars['Int']['input'];
};


export type QueryRecipesByChefArgs = {
  chefId: Scalars['Int']['input'];
  limit?: Scalars['Int']['input'];
  offset?: Scalars['Int']['input'];
};


export type QuerySuggestedRecipesArgs = {
  ingredientIds: Array<Scalars['Int']['input']>;
  maxMissing?: Scalars['Int']['input'];
  utensilIds?: Array<Scalars['Int']['input']>;
};


export type QueryTopRatedRecipesArgs = {
  limit?: Scalars['Int']['input'];
};

export type Recipe = {
  __typename?: 'Recipe';
  author?: Maybe<ChefProfile>;
  authorId: Scalars['Float']['output'];
  caloriesTotal?: Maybe<Scalars['Float']['output']>;
  carbs?: Maybe<Scalars['Float']['output']>;
  category?: Maybe<RecipeCategory>;
  chefComment_el?: Maybe<Scalars['String']['output']>;
  chefComment_en?: Maybe<Scalars['String']['output']>;
  cookTime: Scalars['Int']['output'];
  createdAt: Scalars['String']['output'];
  description_el?: Maybe<Scalars['String']['output']>;
  description_en?: Maybe<Scalars['String']['output']>;
  difficulty: Difficulty;
  fat?: Maybe<Scalars['Float']['output']>;
  foodEthnicity?: Maybe<Scalars['String']['output']>;
  id: Scalars['Int']['output'];
  prepTime: Scalars['Int']['output'];
  protein?: Maybe<Scalars['Float']['output']>;
  recipeImage?: Maybe<Scalars['String']['output']>;
  recipeIngredients?: Maybe<Array<RecipeIngredient>>;
  restTime?: Maybe<Scalars['Int']['output']>;
  steps?: Maybe<Array<Step>>;
  title_el: Scalars['String']['output'];
  title_en: Scalars['String']['output'];
  updatedAt: Scalars['String']['output'];
  utensils?: Maybe<Array<Utensil>>;
};

/** The category of the recipe */
export enum RecipeCategory {
  Appetizers = 'APPETIZERS',
  Legumes = 'LEGUMES',
  Meat = 'MEAT',
  Pasta = 'PASTA',
  Salads = 'SALADS',
  Seafood = 'SEAFOOD',
  Vegan = 'VEGAN'
}

export type RecipeIngredient = {
  __typename?: 'RecipeIngredient';
  ingredient?: Maybe<Ingredient>;
  ingredientId: Scalars['Float']['output'];
  quantity: Scalars['String']['output'];
  recipeId: Scalars['Float']['output'];
  unit: Scalars['String']['output'];
};

export type RecipeIngredientInput = {
  ingredientId: Scalars['Int']['input'];
  quantity: Scalars['String']['input'];
  unit: Scalars['String']['input'];
};

export type RecipeRating = {
  __typename?: 'RecipeRating';
  comment?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  recipeId: Scalars['Int']['output'];
  score: Scalars['Int']['output'];
  updatedAt: Scalars['String']['output'];
  user?: Maybe<User>;
  userId: Scalars['Int']['output'];
};

export type RecipeResponse = {
  __typename?: 'RecipeResponse';
  errors?: Maybe<Array<FieldError>>;
  recipe?: Maybe<Recipe>;
};

export type RecipeStepInput = {
  body: Scalars['String']['input'];
};

export type RecipeSuggestion = {
  __typename?: 'RecipeSuggestion';
  missingCount: Scalars['Int']['output'];
  missingIngredients: Array<Ingredient>;
  missingUtensils: Array<Utensil>;
  recipe: Recipe;
};

export type RegisterUserInput = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
  role: Scalars['String']['input'];
  username: Scalars['String']['input'];
};

export type ShoppingCart = {
  __typename?: 'ShoppingCart';
  addedAt: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  ingredient?: Maybe<Ingredient>;
  ingredientId: Scalars['Int']['output'];
  note?: Maybe<Scalars['String']['output']>;
  quantity?: Maybe<Scalars['String']['output']>;
  unit?: Maybe<Scalars['String']['output']>;
  userId: Scalars['Int']['output'];
};

export type Step = {
  __typename?: 'Step';
  body_el: Scalars['String']['output'];
  body_en: Scalars['String']['output'];
  createdAt: Scalars['String']['output'];
  id: Scalars['Float']['output'];
  recipeID: Scalars['Float']['output'];
  updatedAt: Scalars['String']['output'];
};

/** Update Article Data */
export type UpdateArticleInput = {
  id: Scalars['Float']['input'];
  image?: InputMaybe<Scalars['String']['input']>;
  text?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateChefProfileInput = {
  bio?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateMealSchedulerInput = {
  comment?: InputMaybe<Scalars['String']['input']>;
  day?: InputMaybe<DayOfWeek>;
  id: Scalars['Float']['input'];
  mealType?: InputMaybe<MealType>;
};

export type UpdateNutritionistProfileInput = {
  bio?: InputMaybe<Scalars['String']['input']>;
  city?: InputMaybe<Scalars['String']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateRecipeInput = {
  caloriesTotal?: InputMaybe<Scalars['Float']['input']>;
  carbs?: InputMaybe<Scalars['Float']['input']>;
  category?: InputMaybe<RecipeCategory>;
  chefComment?: InputMaybe<Scalars['String']['input']>;
  cookTime?: InputMaybe<Scalars['Int']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  difficulty?: InputMaybe<Difficulty>;
  fat?: InputMaybe<Scalars['Float']['input']>;
  foodEthnicity?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['Int']['input'];
  ingredients?: InputMaybe<Array<RecipeIngredientInput>>;
  prepTime?: InputMaybe<Scalars['Int']['input']>;
  protein?: InputMaybe<Scalars['Float']['input']>;
  recipeImage?: InputMaybe<Scalars['String']['input']>;
  restTime?: InputMaybe<Scalars['Int']['input']>;
  steps?: InputMaybe<Array<RecipeStepInput>>;
  title?: InputMaybe<Scalars['String']['input']>;
  utensilIds?: InputMaybe<Array<Scalars['Int']['input']>>;
};

export type UpdateSlotInput = {
  date?: InputMaybe<Scalars['String']['input']>;
  isAvailable?: InputMaybe<Scalars['Boolean']['input']>;
  slotId: Scalars['Float']['input'];
  time?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateUserInput = {
  currentPassword?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  image?: InputMaybe<Scalars['String']['input']>;
  newPassword?: InputMaybe<Scalars['String']['input']>;
  phoneNumber?: InputMaybe<Scalars['String']['input']>;
  username?: InputMaybe<Scalars['String']['input']>;
};

export type User = {
  __typename?: 'User';
  createdAt: Scalars['String']['output'];
  email: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  image?: Maybe<Scalars['String']['output']>;
  phoneNumber?: Maybe<Scalars['String']['output']>;
  role: UserRole;
  updatedAt: Scalars['String']['output'];
  username: Scalars['String']['output'];
};

export type UserFavorite = {
  __typename?: 'UserFavorite';
  id: Scalars['Int']['output'];
  recipe?: Maybe<Recipe>;
  recipeId: Scalars['Int']['output'];
  savedAt: Scalars['String']['output'];
  userId: Scalars['Int']['output'];
};

export type UserResponse = {
  __typename?: 'UserResponse';
  errors?: Maybe<Array<FieldError>>;
  user?: Maybe<User>;
};

export enum UserRole {
  Chef = 'CHEF',
  Nutritionist = 'NUTRITIONIST',
  User = 'USER'
}

export type Utensil = {
  __typename?: 'Utensil';
  category_el: Scalars['String']['output'];
  category_en: Scalars['String']['output'];
  id: Scalars['Float']['output'];
  name_el: Scalars['String']['output'];
  name_en: Scalars['String']['output'];
};

export type RegularChefProfileFragment = { __typename?: 'ChefProfile', id: number, bio?: string | null, user: { __typename?: 'User', id: number, username: string, email: string, image?: string | null } };

export type RegularChefProfileResponseFragment = { __typename?: 'ChefProfileResponse', errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null, chefProfile?: { __typename?: 'ChefProfile', id: number, bio?: string | null, user: { __typename?: 'User', id: number, username: string, email: string, image?: string | null } } | null };

export type RegualarErrorFragment = { __typename?: 'FieldError', field: string, message: string };

export type RegularNutritionistProfileResponseFragment = { __typename?: 'NutritionistProfileResponse', errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null, nutritionistProfile?: { __typename?: 'NutritionistProfile', id: number, bio?: string | null, phone?: string | null, city?: string | null, user?: { __typename?: 'User', id: number, username: string, email: string, image?: string | null } | null } | null };

export type RegularUserFragment = { __typename?: 'User', id: number, username: string, email: string, role: UserRole, image?: string | null };

export type RegularUserResponseFragment = { __typename?: 'UserResponse', errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null, user?: { __typename?: 'User', id: number, username: string, email: string, role: UserRole, image?: string | null } | null };

export type RegularAppointmentFragment = { __typename?: 'Appointment', id: number, date: string, time: string, isAvailable: boolean, nutritionistId: number };

export type RegularAppointmentRequestFragment = { __typename?: 'AppointmentRequest', id: number, slotId: number, clientId: number, status: AppointmentStatus, comment?: string | null, requestedAt: string, slot?: { __typename?: 'Appointment', id: number, date: string, time: string, isAvailable: boolean, nutritionistId: number } | null, client?: { __typename?: 'User', id: number, username: string, image?: string | null } | null };

export type RegularAppointmentRequestResponseFragment = { __typename?: 'AppointmentRequestResponse', errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null, appointmentRequest?: { __typename?: 'AppointmentRequest', id: number, slotId: number, clientId: number, status: AppointmentStatus, comment?: string | null, requestedAt: string, slot?: { __typename?: 'Appointment', id: number, date: string, time: string, isAvailable: boolean, nutritionistId: number } | null, client?: { __typename?: 'User', id: number, username: string, image?: string | null } | null } | null };

export type RegularAppointmentResponseFragment = { __typename?: 'AppointmentResponse', errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null, slot?: { __typename?: 'Appointment', id: number, date: string, time: string, isAvailable: boolean, nutritionistId: number } | null };

export type RegularArticleFragment = { __typename?: 'Article', id: number, title_el: string, title_en: string, text_el: string, text_en: string, image: string, creatorId: number, createdAt: string, updatedAt: string };

export type RegularArticleResponseFragment = { __typename?: 'ArticleResponse', errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null, article?: { __typename?: 'Article', id: number, title_el: string, title_en: string, text_el: string, text_en: string, image: string, creatorId: number, createdAt: string, updatedAt: string } | null };

export type RegularCartItemFragment = { __typename?: 'ShoppingCart', id: number, userId: number, ingredientId: number, quantity?: string | null, unit?: string | null, note?: string | null, addedAt: string, ingredient?: { __typename?: 'Ingredient', id: number, name_el: string, name_en: string, caloriesPer100g?: number | null } | null };

export type RegularCookedRecipeFragment = { __typename?: 'CookedRecipe', id: number, userId: number, recipeId: number, cookedAt: string, recipe?: { __typename?: 'Recipe', id: number, title_el: string, title_en: string, recipeImage?: string | null, category?: RecipeCategory | null, prepTime: number, cookTime: number, caloriesTotal?: number | null, difficulty: Difficulty } | null };

export type RegularUserFavoriteFragment = { __typename?: 'UserFavorite', id: number, userId: number, recipeId: number, savedAt: string, recipe?: { __typename?: 'Recipe', id: number, title_el: string, title_en: string, recipeImage?: string | null, category?: RecipeCategory | null, prepTime: number, cookTime: number, difficulty: Difficulty } | null };

export type MealSchedulerWithNutritionistFragment = { __typename?: 'MealScheduler', id: number, day: DayOfWeek, mealType: MealType, comment_el: string, comment_en: string, nutritionist: { __typename?: 'NutritionistProfile', user?: { __typename?: 'User', username: string } | null } };

export type RegularMealPlanResponseFragment = { __typename?: 'MealPlanResponse', errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null, mealScheduler?: { __typename?: 'MealScheduler', id: number, day: DayOfWeek, mealType: MealType, comment_el: string, comment_en: string } | null };

export type RegularMealSchedulerFragment = { __typename?: 'MealScheduler', id: number, day: DayOfWeek, mealType: MealType, comment_el: string, comment_en: string };

export type ConversationWithParticipantsFragment = { __typename?: 'Conversation', id: number, participant1Id: number, participant2Id: number, createdAt: string, updatedAt: string, participant1: { __typename?: 'User', id: number, username: string, image?: string | null }, participant2: { __typename?: 'User', id: number, username: string, image?: string | null } };

export type ConversationWithMessagesFragment = { __typename?: 'Conversation', id: number, participant1Id: number, participant2Id: number, createdAt: string, updatedAt: string, messages: Array<{ __typename?: 'Message', id: number, conversationId: number, senderId: number, body: string, createdAt: string, sender: { __typename?: 'User', id: number, username: string } }>, participant1: { __typename?: 'User', id: number, username: string, image?: string | null }, participant2: { __typename?: 'User', id: number, username: string, image?: string | null } };

export type RegularConversationFragment = { __typename?: 'Conversation', id: number, participant1Id: number, participant2Id: number, createdAt: string, updatedAt: string };

export type RegularMessageFragment = { __typename?: 'Message', id: number, conversationId: number, senderId: number, body: string, createdAt: string };

export type RegularChefRatingFragment = { __typename?: 'ChefRating', id: number, chefId: number, userId: number, score: number, comment?: string | null, createdAt: string, user?: { __typename?: 'User', id: number, username: string, image?: string | null } | null };

export type RegularRecipeRatingFragment = { __typename?: 'RecipeRating', id: number, recipeId: number, userId: number, score: number, comment?: string | null, createdAt: string, user?: { __typename?: 'User', id: number, username: string, image?: string | null } | null };

export type TopRatedRecipeFragment = { __typename?: 'Recipe', id: number, title_el: string, title_en: string, recipeImage?: string | null, caloriesTotal?: number | null, prepTime: number, cookTime: number, difficulty: Difficulty, category?: RecipeCategory | null };

export type RegularRecipeFragment = { __typename?: 'Recipe', id: number, title_el: string, title_en: string, description_el?: string | null, description_en?: string | null, chefComment_el?: string | null, chefComment_en?: string | null, category?: RecipeCategory | null, recipeImage?: string | null, prepTime: number, cookTime: number, restTime?: number | null, difficulty: Difficulty, caloriesTotal?: number | null, protein?: number | null, carbs?: number | null, fat?: number | null, foodEthnicity?: string | null, authorId: number, createdAt: string, updatedAt: string, steps?: Array<{ __typename?: 'Step', id: number, body_el: string, body_en: string, recipeID: number }> | null, recipeIngredients?: Array<{ __typename?: 'RecipeIngredient', recipeId: number, ingredientId: number, quantity: string, unit: string, ingredient?: { __typename?: 'Ingredient', id: number, name_el: string, name_en: string, caloriesPer100g?: number | null } | null }> | null, author?: { __typename?: 'ChefProfile', user: { __typename?: 'User', username: string } } | null };

export type RegularRecipeResponseFragment = { __typename?: 'RecipeResponse', errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null, recipe?: { __typename?: 'Recipe', id: number, title_el: string, title_en: string, description_el?: string | null, description_en?: string | null, chefComment_el?: string | null, chefComment_en?: string | null, category?: RecipeCategory | null, recipeImage?: string | null, prepTime: number, cookTime: number, restTime?: number | null, difficulty: Difficulty, caloriesTotal?: number | null, protein?: number | null, carbs?: number | null, fat?: number | null, foodEthnicity?: string | null, authorId: number, createdAt: string, updatedAt: string, steps?: Array<{ __typename?: 'Step', id: number, body_el: string, body_en: string, recipeID: number }> | null, recipeIngredients?: Array<{ __typename?: 'RecipeIngredient', recipeId: number, ingredientId: number, quantity: string, unit: string, ingredient?: { __typename?: 'Ingredient', id: number, name_el: string, name_en: string, caloriesPer100g?: number | null } | null }> | null, author?: { __typename?: 'ChefProfile', user: { __typename?: 'User', username: string } } | null } | null };

export type CreateAppointmentMutationVariables = Exact<{
  data: AddAppointmentInput;
}>;


export type CreateAppointmentMutation = { __typename?: 'Mutation', createAppointment: { __typename?: 'AppointmentResponse', errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null, slot?: { __typename?: 'Appointment', id: number, date: string, time: string, isAvailable: boolean, nutritionistId: number } | null } };

export type UpdateAppointmentMutationVariables = Exact<{
  data: UpdateSlotInput;
}>;


export type UpdateAppointmentMutation = { __typename?: 'Mutation', updateAppointment?: { __typename?: 'AppointmentResponse', errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null, slot?: { __typename?: 'Appointment', id: number, date: string, time: string, isAvailable: boolean, nutritionistId: number } | null } | null };

export type DeleteAppointmentMutationVariables = Exact<{
  slotId: Scalars['Int']['input'];
}>;


export type DeleteAppointmentMutation = { __typename?: 'Mutation', deleteAppointment: boolean };

export type RequestAppointmentMutationVariables = Exact<{
  data: AppointmentRequestInput;
}>;


export type RequestAppointmentMutation = { __typename?: 'Mutation', requestAppointment: { __typename?: 'AppointmentRequestResponse', errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null, appointmentRequest?: { __typename?: 'AppointmentRequest', id: number, slotId: number, clientId: number, status: AppointmentStatus, comment?: string | null, requestedAt: string, slot?: { __typename?: 'Appointment', id: number, date: string, time: string, isAvailable: boolean, nutritionistId: number } | null, client?: { __typename?: 'User', id: number, username: string, image?: string | null } | null } | null } };

export type RespondToAppointmentRequestMutationVariables = Exact<{
  requestId: Scalars['Float']['input'];
  status: AppointmentStatus;
}>;


export type RespondToAppointmentRequestMutation = { __typename?: 'Mutation', respondToAppointmentRequest: boolean };

export type UpdateArticleMutationVariables = Exact<{
  data: UpdateArticleInput;
}>;


export type UpdateArticleMutation = { __typename?: 'Mutation', updateArticle: { __typename?: 'ArticleResponse', errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null, article?: { __typename?: 'Article', id: number, title_el: string, title_en: string, text_el: string, text_en: string, image: string, creatorId: number, createdAt: string, updatedAt: string } | null } };

export type DeleteArticleMutationVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type DeleteArticleMutation = { __typename?: 'Mutation', deleteArticle: boolean };

export type AddToCartMutationVariables = Exact<{
  ingredientId: Scalars['Int']['input'];
  quantity?: InputMaybe<Scalars['String']['input']>;
  unit?: InputMaybe<Scalars['String']['input']>;
  note?: InputMaybe<Scalars['String']['input']>;
}>;


export type AddToCartMutation = { __typename?: 'Mutation', addToCart: { __typename?: 'ShoppingCart', id: number, userId: number, ingredientId: number, quantity?: string | null, unit?: string | null, note?: string | null, addedAt: string, ingredient?: { __typename?: 'Ingredient', id: number, name_el: string, name_en: string, caloriesPer100g?: number | null } | null } };

export type AddManyToCartMutationVariables = Exact<{
  ingredientIds: Array<Scalars['Int']['input']> | Scalars['Int']['input'];
}>;


export type AddManyToCartMutation = { __typename?: 'Mutation', addManyToCart: Array<{ __typename?: 'ShoppingCart', id: number, userId: number, ingredientId: number, quantity?: string | null, unit?: string | null, note?: string | null, addedAt: string, ingredient?: { __typename?: 'Ingredient', id: number, name_el: string, name_en: string, caloriesPer100g?: number | null } | null }> };

export type UpdateCartItemMutationVariables = Exact<{
  id: Scalars['Int']['input'];
  quantity?: InputMaybe<Scalars['String']['input']>;
  unit?: InputMaybe<Scalars['String']['input']>;
  note?: InputMaybe<Scalars['String']['input']>;
}>;


export type UpdateCartItemMutation = { __typename?: 'Mutation', updateCartItem: { __typename?: 'ShoppingCart', id: number, userId: number, ingredientId: number, quantity?: string | null, unit?: string | null, note?: string | null, addedAt: string, ingredient?: { __typename?: 'Ingredient', id: number, name_el: string, name_en: string, caloriesPer100g?: number | null } | null } };

export type RemoveFromCartMutationVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type RemoveFromCartMutation = { __typename?: 'Mutation', removeFromCart: boolean };

export type ClearCartMutationVariables = Exact<{ [key: string]: never; }>;


export type ClearCartMutation = { __typename?: 'Mutation', clearCart: boolean };

export type ChangePasswordMutationVariables = Exact<{
  token: Scalars['String']['input'];
  newPassword: Scalars['String']['input'];
}>;


export type ChangePasswordMutation = { __typename?: 'Mutation', changePassword: { __typename?: 'UserResponse', errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null, user?: { __typename?: 'User', id: number, username: string, email: string, role: UserRole, image?: string | null } | null } };

export type CreateRecipeMutationVariables = Exact<{
  data: CreateRecipeInput;
}>;


export type CreateRecipeMutation = { __typename?: 'Mutation', createRecipe: { __typename?: 'RecipeResponse', errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null, recipe?: { __typename?: 'Recipe', id: number, title_el: string, title_en: string, description_el?: string | null, description_en?: string | null, chefComment_el?: string | null, chefComment_en?: string | null, category?: RecipeCategory | null, recipeImage?: string | null, prepTime: number, cookTime: number, restTime?: number | null, difficulty: Difficulty, caloriesTotal?: number | null, protein?: number | null, carbs?: number | null, fat?: number | null, foodEthnicity?: string | null, authorId: number, createdAt: string, updatedAt: string, steps?: Array<{ __typename?: 'Step', id: number, body_el: string, body_en: string, recipeID: number }> | null, recipeIngredients?: Array<{ __typename?: 'RecipeIngredient', recipeId: number, ingredientId: number, quantity: string, unit: string, ingredient?: { __typename?: 'Ingredient', id: number, name_el: string, name_en: string, caloriesPer100g?: number | null } | null }> | null, author?: { __typename?: 'ChefProfile', user: { __typename?: 'User', username: string } } | null } | null } };

export type UpdateRecipeMutationVariables = Exact<{
  data: UpdateRecipeInput;
}>;


export type UpdateRecipeMutation = { __typename?: 'Mutation', updateRecipe: { __typename?: 'RecipeResponse', errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null, recipe?: { __typename?: 'Recipe', id: number, title_el: string, title_en: string, description_el?: string | null, description_en?: string | null, chefComment_el?: string | null, chefComment_en?: string | null, category?: RecipeCategory | null, recipeImage?: string | null, prepTime: number, cookTime: number, restTime?: number | null, difficulty: Difficulty, caloriesTotal?: number | null, protein?: number | null, carbs?: number | null, fat?: number | null, foodEthnicity?: string | null, authorId: number, createdAt: string, updatedAt: string, steps?: Array<{ __typename?: 'Step', id: number, body_el: string, body_en: string, recipeID: number }> | null, recipeIngredients?: Array<{ __typename?: 'RecipeIngredient', recipeId: number, ingredientId: number, quantity: string, unit: string, ingredient?: { __typename?: 'Ingredient', id: number, name_el: string, name_en: string, caloriesPer100g?: number | null } | null }> | null, author?: { __typename?: 'ChefProfile', user: { __typename?: 'User', username: string } } | null } | null } };

export type DeleteRecipeMutationVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type DeleteRecipeMutation = { __typename?: 'Mutation', deleteRecipe: boolean };

export type RateChefMutationVariables = Exact<{
  chefId: Scalars['Int']['input'];
  score: Scalars['Int']['input'];
  comment?: InputMaybe<Scalars['String']['input']>;
}>;


export type RateChefMutation = { __typename?: 'Mutation', rateChef: { __typename?: 'ChefRating', id: number, chefId: number, userId: number, score: number, comment?: string | null, createdAt: string, user?: { __typename?: 'User', id: number, username: string, image?: string | null } | null } };

export type RateRecipeMutationVariables = Exact<{
  recipeId: Scalars['Int']['input'];
  score: Scalars['Int']['input'];
  comment?: InputMaybe<Scalars['String']['input']>;
}>;


export type RateRecipeMutation = { __typename?: 'Mutation', rateRecipe: { __typename?: 'RecipeRating', id: number, recipeId: number, userId: number, score: number, comment?: string | null, createdAt: string, user?: { __typename?: 'User', id: number, username: string, image?: string | null } | null } };

export type DeleteChefRatingMutationVariables = Exact<{
  chefId: Scalars['Int']['input'];
}>;


export type DeleteChefRatingMutation = { __typename?: 'Mutation', deleteChefRating: boolean };

export type LogCookedRecipeMutationVariables = Exact<{
  recipeId: Scalars['Int']['input'];
}>;


export type LogCookedRecipeMutation = { __typename?: 'Mutation', logCookedRecipe: { __typename?: 'CookedRecipe', id: number, userId: number, recipeId: number, cookedAt: string, recipe?: { __typename?: 'Recipe', id: number, title_el: string, title_en: string, recipeImage?: string | null, category?: RecipeCategory | null, prepTime: number, cookTime: number, caloriesTotal?: number | null, difficulty: Difficulty } | null } };

export type DeleteCookLogMutationVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type DeleteCookLogMutation = { __typename?: 'Mutation', deleteCookLog: boolean };

export type CreateArticleMutationVariables = Exact<{
  data: AddArticleInput;
}>;


export type CreateArticleMutation = { __typename?: 'Mutation', createArticle: { __typename?: 'ArticleResponse', errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null, article?: { __typename?: 'Article', id: number, title_el: string, title_en: string, text_el: string, text_en: string, image: string, creatorId: number, createdAt: string, updatedAt: string } | null } };

export type SaveRecipeMutationVariables = Exact<{
  recipeId: Scalars['Int']['input'];
}>;


export type SaveRecipeMutation = { __typename?: 'Mutation', saveRecipe: { __typename?: 'UserFavorite', id: number, userId: number, recipeId: number, savedAt: string, recipe?: { __typename?: 'Recipe', id: number, title_el: string, title_en: string, recipeImage?: string | null, category?: RecipeCategory | null, prepTime: number, cookTime: number, difficulty: Difficulty } | null } };

export type UnsaveRecipeMutationVariables = Exact<{
  recipeId: Scalars['Int']['input'];
}>;


export type UnsaveRecipeMutation = { __typename?: 'Mutation', unsaveRecipe: boolean };

export type IsFavoritedQueryVariables = Exact<{
  recipeId: Scalars['Int']['input'];
}>;


export type IsFavoritedQuery = { __typename?: 'Query', isFavorited: boolean };

export type ForgotPasswordMutationVariables = Exact<{
  email: Scalars['String']['input'];
}>;


export type ForgotPasswordMutation = { __typename?: 'Mutation', forgotPassword: boolean };

export type LoginMutationVariables = Exact<{
  usernameOrEmail: Scalars['String']['input'];
  password: Scalars['String']['input'];
}>;


export type LoginMutation = { __typename?: 'Mutation', login: { __typename?: 'UserResponse', errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null, user?: { __typename?: 'User', id: number, username: string, email: string, role: UserRole, image?: string | null } | null } };

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = { __typename?: 'Mutation', logout: boolean };

export type CreateMealSchedulerMutationVariables = Exact<{
  userId: Scalars['Float']['input'];
  day: DayOfWeek;
  mealType: MealType;
  comment: Scalars['String']['input'];
}>;


export type CreateMealSchedulerMutation = { __typename?: 'Mutation', createMealScheduler: { __typename?: 'MealPlanResponse', errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null, mealScheduler?: { __typename?: 'MealScheduler', id: number, day: DayOfWeek, mealType: MealType, comment_el: string, comment_en: string } | null } };

export type DeleteMealSchedulerMutationVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type DeleteMealSchedulerMutation = { __typename?: 'Mutation', deleteMealScheduler: { __typename?: 'MealPlanResponse', errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null, mealScheduler?: { __typename?: 'MealScheduler', id: number, day: DayOfWeek, mealType: MealType, comment_el: string, comment_en: string } | null } };

export type DeleteRecipeRatingMutationVariables = Exact<{
  recipeId: Scalars['Int']['input'];
}>;


export type DeleteRecipeRatingMutation = { __typename?: 'Mutation', deleteRecipeRating: boolean };

export type RegisterMutationVariables = Exact<{
  options: RegisterUserInput;
}>;


export type RegisterMutation = { __typename?: 'Mutation', register: { __typename?: 'UserResponse', errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null, user?: { __typename?: 'User', id: number, username: string, email: string, role: UserRole, image?: string | null } | null } };

export type SendMessageMutationVariables = Exact<{
  conversationId: Scalars['Int']['input'];
  body: Scalars['String']['input'];
}>;


export type SendMessageMutation = { __typename?: 'Mutation', sendMessage: { __typename?: 'MessageResponse', errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null, message?: { __typename?: 'Message', id: number, conversationId: number, senderId: number, body: string, createdAt: string, sender: { __typename?: 'User', id: number, username: string } } | null } };

export type StartConversationMutationVariables = Exact<{
  participantId: Scalars['Int']['input'];
}>;


export type StartConversationMutation = { __typename?: 'Mutation', startConversation: { __typename?: 'ConversationResponse', errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null, conversation?: { __typename?: 'Conversation', id: number, participant1Id: number, participant2Id: number, createdAt: string, updatedAt: string, participant1: { __typename?: 'User', id: number, username: string, image?: string | null }, participant2: { __typename?: 'User', id: number, username: string, image?: string | null } } | null } };

export type UpdateChefProfileMutationVariables = Exact<{
  data: UpdateChefProfileInput;
}>;


export type UpdateChefProfileMutation = { __typename?: 'Mutation', updateChefProfile: { __typename?: 'ChefProfileResponse', errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null, chefProfile?: { __typename?: 'ChefProfile', id: number, bio?: string | null, user: { __typename?: 'User', id: number, username: string, email: string, image?: string | null } } | null } };

export type UpdateNutritionistProfileMutationVariables = Exact<{
  data: UpdateNutritionistProfileInput;
}>;


export type UpdateNutritionistProfileMutation = { __typename?: 'Mutation', updateNutritionistProfile: { __typename?: 'NutritionistProfileResponse', errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null, nutritionistProfile?: { __typename?: 'NutritionistProfile', id: number, bio?: string | null, phone?: string | null, city?: string | null, user?: { __typename?: 'User', id: number, username: string, email: string, image?: string | null } | null } | null } };

export type UpdateUserMutationVariables = Exact<{
  data: UpdateUserInput;
}>;


export type UpdateUserMutation = { __typename?: 'Mutation', updateUser: { __typename?: 'UserResponse', errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null, user?: { __typename?: 'User', id: number, username: string, email: string, role: UserRole, image?: string | null } | null } };

export type MyArticlesQueryVariables = Exact<{
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
}>;


export type MyArticlesQuery = { __typename?: 'Query', myArticles: Array<{ __typename?: 'Article', id: number, title_el: string, title_en: string, image: string, createdAt: string }> };

export type MyMealPlanQueryVariables = Exact<{ [key: string]: never; }>;


export type MyMealPlanQuery = { __typename?: 'Query', myMealPlan: Array<{ __typename?: 'MealScheduler', id: number, day: DayOfWeek, mealType: MealType, comment_el: string, comment_en: string, nutritionist: { __typename?: 'NutritionistProfile', user?: { __typename?: 'User', username: string } | null } }> };

export type GetMyAppointmentsQueryVariables = Exact<{
  date?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetMyAppointmentsQuery = { __typename?: 'Query', getMyAppointments: Array<{ __typename?: 'Appointment', id: number, date: string, time: string, isAvailable: boolean, nutritionistId: number }> };

export type AvailableSlotsQueryVariables = Exact<{
  nutritionistId: Scalars['Int']['input'];
}>;


export type AvailableSlotsQuery = { __typename?: 'Query', availableSlots: Array<{ __typename?: 'Appointment', id: number, date: string, time: string, isAvailable: boolean, nutritionistId: number }> };

export type GetAppointmentRequestsForNutritionistQueryVariables = Exact<{
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetAppointmentRequestsForNutritionistQuery = { __typename?: 'Query', getAppointmentRequestsForNutritionist: Array<{ __typename?: 'AppointmentRequest', id: number, slotId: number, clientId: number, status: AppointmentStatus, comment?: string | null, requestedAt: string, slot?: { __typename?: 'Appointment', id: number, date: string, time: string, isAvailable: boolean, nutritionistId: number } | null, client?: { __typename?: 'User', id: number, username: string, image?: string | null } | null }> };

export type MyAppointmentRequestsQueryVariables = Exact<{ [key: string]: never; }>;


export type MyAppointmentRequestsQuery = { __typename?: 'Query', myAppointmentRequests: Array<{ __typename?: 'AppointmentRequest', id: number, status: AppointmentStatus, slot?: { __typename?: 'Appointment', id: number, nutritionistId: number } | null }> };

export type ArticleQueryVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type ArticleQuery = { __typename?: 'Query', article?: { __typename?: 'Article', id: number, title_el: string, title_en: string, text_el: string, text_en: string, image: string, creatorId: number, createdAt: string, updatedAt: string } | null };

export type ArticlesQueryVariables = Exact<{
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
}>;


export type ArticlesQuery = { __typename?: 'Query', articles: Array<{ __typename?: 'Article', id: number, title_el: string, title_en: string, text_el: string, text_en: string, image: string, creatorId: number, createdAt: string, updatedAt: string }> };

export type ArticlesByChefQueryVariables = Exact<{
  chefId: Scalars['Int']['input'];
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
}>;


export type ArticlesByChefQuery = { __typename?: 'Query', articlesByChef: Array<{ __typename?: 'Article', id: number, title_el: string, title_en: string, text_el: string, text_en: string, image: string, creatorId: number, createdAt: string, updatedAt: string }> };

export type ChefQueryVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type ChefQuery = { __typename?: 'Query', chef?: { __typename?: 'ChefProfile', id: number, bio?: string | null, user: { __typename?: 'User', id: number, username: string, image?: string | null }, recipes?: Array<{ __typename?: 'Recipe', id: number, title_el: string, title_en: string, recipeImage?: string | null, difficulty: Difficulty }> | null } | null };

export type ChefRatingsQueryVariables = Exact<{
  chefId: Scalars['Int']['input'];
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
}>;


export type ChefRatingsQuery = { __typename?: 'Query', chefRatings: Array<{ __typename?: 'ChefRating', id: number, chefId: number, userId: number, score: number, comment?: string | null, createdAt: string, user?: { __typename?: 'User', id: number, username: string, image?: string | null } | null }> };

export type ChefAverageRatingQueryVariables = Exact<{
  chefId: Scalars['Int']['input'];
}>;


export type ChefAverageRatingQuery = { __typename?: 'Query', chefAverageRating?: number | null };

export type MyChefRatingQueryVariables = Exact<{
  chefId: Scalars['Int']['input'];
}>;


export type MyChefRatingQuery = { __typename?: 'Query', myChefRating?: { __typename?: 'ChefRating', id: number, chefId: number, userId: number, score: number, comment?: string | null, createdAt: string, user?: { __typename?: 'User', id: number, username: string, image?: string | null } | null } | null };

export type ConversationQueryVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type ConversationQuery = { __typename?: 'Query', conversation?: { __typename?: 'Conversation', id: number, participant1Id: number, participant2Id: number, createdAt: string, updatedAt: string, messages: Array<{ __typename?: 'Message', id: number, conversationId: number, senderId: number, body: string, createdAt: string, sender: { __typename?: 'User', id: number, username: string } }>, participant1: { __typename?: 'User', id: number, username: string, image?: string | null }, participant2: { __typename?: 'User', id: number, username: string, image?: string | null } } | null };

export type IngredientsQueryVariables = Exact<{ [key: string]: never; }>;


export type IngredientsQuery = { __typename?: 'Query', ingredients: Array<{ __typename?: 'Ingredient', id: number, name_el: string, name_en: string, caloriesPer100g?: number | null, category?: { __typename?: 'IngredientsCategory', id: number, name_el: string, name_en: string } | null }> };

export type UtensilsQueryVariables = Exact<{ [key: string]: never; }>;


export type UtensilsQuery = { __typename?: 'Query', utensils: Array<{ __typename?: 'Utensil', id: number, name_el: string, name_en: string, category_el: string, category_en: string }> };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename?: 'Query', me?: { __typename?: 'User', id: number, username: string, email: string, role: UserRole, image?: string | null } | null };

export type GetNutritionistMealPlansQueryVariables = Exact<{
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetNutritionistMealPlansQuery = { __typename?: 'Query', getNutritionistMealPlans: Array<{ __typename?: 'MealScheduler', id: number, day: DayOfWeek, mealType: MealType, comment_el: string, comment_en: string }> };

export type MyCartQueryVariables = Exact<{ [key: string]: never; }>;


export type MyCartQuery = { __typename?: 'Query', myCart: Array<{ __typename?: 'ShoppingCart', id: number, userId: number, ingredientId: number, quantity?: string | null, unit?: string | null, note?: string | null, addedAt: string, ingredient?: { __typename?: 'Ingredient', id: number, name_el: string, name_en: string, caloriesPer100g?: number | null } | null }> };

export type MyChefProfileQueryVariables = Exact<{ [key: string]: never; }>;


export type MyChefProfileQuery = { __typename?: 'Query', myChefProfile?: { __typename?: 'ChefProfile', id: number, bio?: string | null, user: { __typename?: 'User', id: number, username: string, email: string, image?: string | null } } | null };

export type MyConversationsQueryVariables = Exact<{
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
}>;


export type MyConversationsQuery = { __typename?: 'Query', myConversations: Array<{ __typename?: 'Conversation', id: number, participant1Id: number, participant2Id: number, createdAt: string, updatedAt: string, participant1: { __typename?: 'User', id: number, username: string, image?: string | null }, participant2: { __typename?: 'User', id: number, username: string, image?: string | null } }> };

export type MyCookedRecipesQueryVariables = Exact<{
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
}>;


export type MyCookedRecipesQuery = { __typename?: 'Query', myCookedRecipes: Array<{ __typename?: 'CookedRecipe', id: number, userId: number, recipeId: number, cookedAt: string, recipe?: { __typename?: 'Recipe', id: number, title_el: string, title_en: string, recipeImage?: string | null, category?: RecipeCategory | null, prepTime: number, cookTime: number, caloriesTotal?: number | null, difficulty: Difficulty } | null }> };

export type MyFavoritesQueryVariables = Exact<{
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
}>;


export type MyFavoritesQuery = { __typename?: 'Query', myFavorites: Array<{ __typename?: 'UserFavorite', id: number, userId: number, recipeId: number, savedAt: string, recipe?: { __typename?: 'Recipe', id: number, title_el: string, title_en: string, recipeImage?: string | null, category?: RecipeCategory | null, prepTime: number, cookTime: number, difficulty: Difficulty } | null }> };

export type MyNutritionalSummaryQueryVariables = Exact<{ [key: string]: never; }>;


export type MyNutritionalSummaryQuery = { __typename?: 'Query', myNutritionalSummary: { __typename?: 'NutritionalSummary', cookCount: number, totalCalories?: number | null, totalProtein?: number | null, totalCarbs?: number | null, totalFat?: number | null } };

export type MyNutritionistProfileQueryVariables = Exact<{ [key: string]: never; }>;


export type MyNutritionistProfileQuery = { __typename?: 'Query', myNutritionistProfile?: { __typename?: 'NutritionistProfile', id: number, bio?: string | null, phone?: string | null, city?: string | null, user?: { __typename?: 'User', id: number, username: string, email: string } | null } | null };

export type MyRecipesQueryVariables = Exact<{
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
}>;


export type MyRecipesQuery = { __typename?: 'Query', myRecipes: Array<{ __typename?: 'Recipe', id: number, title_el: string, title_en: string, description_el?: string | null, description_en?: string | null, chefComment_el?: string | null, chefComment_en?: string | null, category?: RecipeCategory | null, recipeImage?: string | null, prepTime: number, cookTime: number, restTime?: number | null, difficulty: Difficulty, caloriesTotal?: number | null, protein?: number | null, carbs?: number | null, fat?: number | null, foodEthnicity?: string | null, authorId: number, createdAt: string, updatedAt: string, steps?: Array<{ __typename?: 'Step', id: number, body_el: string, body_en: string, recipeID: number }> | null, recipeIngredients?: Array<{ __typename?: 'RecipeIngredient', recipeId: number, ingredientId: number, quantity: string, unit: string, ingredient?: { __typename?: 'Ingredient', id: number, name_el: string, name_en: string, caloriesPer100g?: number | null } | null }> | null, author?: { __typename?: 'ChefProfile', user: { __typename?: 'User', username: string } } | null }> };

export type MyRecipesByCategoryQueryVariables = Exact<{
  category: RecipeCategory;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
}>;


export type MyRecipesByCategoryQuery = { __typename?: 'Query', myRecipesByCategory: Array<{ __typename?: 'Recipe', id: number, title_el: string, title_en: string, description_el?: string | null, description_en?: string | null, chefComment_el?: string | null, chefComment_en?: string | null, category?: RecipeCategory | null, recipeImage?: string | null, prepTime: number, cookTime: number, restTime?: number | null, difficulty: Difficulty, caloriesTotal?: number | null, protein?: number | null, carbs?: number | null, fat?: number | null, foodEthnicity?: string | null, authorId: number, createdAt: string, updatedAt: string, steps?: Array<{ __typename?: 'Step', id: number, body_el: string, body_en: string, recipeID: number }> | null, recipeIngredients?: Array<{ __typename?: 'RecipeIngredient', recipeId: number, ingredientId: number, quantity: string, unit: string, ingredient?: { __typename?: 'Ingredient', id: number, name_el: string, name_en: string, caloriesPer100g?: number | null } | null }> | null, author?: { __typename?: 'ChefProfile', user: { __typename?: 'User', username: string } } | null }> };

export type NutritionistQueryVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type NutritionistQuery = { __typename?: 'Query', nutritionist?: { __typename?: 'NutritionistProfile', id: number, bio?: string | null, phone?: string | null, city?: string | null, user?: { __typename?: 'User', id: number, username: string, email: string, image?: string | null } | null } | null };

export type NutritionistsQueryVariables = Exact<{
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
}>;


export type NutritionistsQuery = { __typename?: 'Query', nutritionists: Array<{ __typename?: 'NutritionistProfile', id: number, bio?: string | null, phone?: string | null, city?: string | null, user?: { __typename?: 'User', id: number, username: string, email: string, image?: string | null } | null }> };

export type RecipeQueryVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type RecipeQuery = { __typename?: 'Query', recipe?: { __typename?: 'Recipe', id: number, title_el: string, title_en: string, description_el?: string | null, description_en?: string | null, chefComment_el?: string | null, chefComment_en?: string | null, category?: RecipeCategory | null, recipeImage?: string | null, prepTime: number, cookTime: number, restTime?: number | null, difficulty: Difficulty, caloriesTotal?: number | null, protein?: number | null, carbs?: number | null, fat?: number | null, foodEthnicity?: string | null, authorId: number, createdAt: string, updatedAt: string, steps?: Array<{ __typename?: 'Step', id: number, body_el: string, body_en: string, recipeID: number }> | null, recipeIngredients?: Array<{ __typename?: 'RecipeIngredient', recipeId: number, ingredientId: number, quantity: string, unit: string, ingredient?: { __typename?: 'Ingredient', id: number, name_el: string, name_en: string, caloriesPer100g?: number | null } | null }> | null, author?: { __typename?: 'ChefProfile', user: { __typename?: 'User', username: string } } | null } | null };

export type RecipeAverageRatingQueryVariables = Exact<{
  recipeId: Scalars['Int']['input'];
}>;


export type RecipeAverageRatingQuery = { __typename?: 'Query', recipeAverageRating?: number | null };

export type MyRecipeRatingQueryVariables = Exact<{
  recipeId: Scalars['Int']['input'];
}>;


export type MyRecipeRatingQuery = { __typename?: 'Query', myRecipeRating?: { __typename?: 'RecipeRating', id: number, recipeId: number, userId: number, score: number, comment?: string | null, createdAt: string, user?: { __typename?: 'User', id: number, username: string, image?: string | null } | null } | null };

export type RecipeRatingsQueryVariables = Exact<{
  recipeId: Scalars['Int']['input'];
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
}>;


export type RecipeRatingsQuery = { __typename?: 'Query', recipeRatings: Array<{ __typename?: 'RecipeRating', id: number, recipeId: number, userId: number, score: number, comment?: string | null, createdAt: string, user?: { __typename?: 'User', id: number, username: string, image?: string | null } | null }> };

export type RecipesQueryVariables = Exact<{
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
}>;


export type RecipesQuery = { __typename?: 'Query', recipes: Array<{ __typename?: 'Recipe', id: number, title_el: string, title_en: string, description_el?: string | null, description_en?: string | null, chefComment_el?: string | null, chefComment_en?: string | null, category?: RecipeCategory | null, recipeImage?: string | null, prepTime: number, cookTime: number, restTime?: number | null, difficulty: Difficulty, caloriesTotal?: number | null, protein?: number | null, carbs?: number | null, fat?: number | null, foodEthnicity?: string | null, authorId: number, createdAt: string, updatedAt: string, steps?: Array<{ __typename?: 'Step', id: number, body_el: string, body_en: string, recipeID: number }> | null, recipeIngredients?: Array<{ __typename?: 'RecipeIngredient', recipeId: number, ingredientId: number, quantity: string, unit: string, ingredient?: { __typename?: 'Ingredient', id: number, name_el: string, name_en: string, caloriesPer100g?: number | null } | null }> | null, author?: { __typename?: 'ChefProfile', user: { __typename?: 'User', username: string } } | null }> };

export type RecipesByCategoryQueryVariables = Exact<{
  category: RecipeCategory;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
}>;


export type RecipesByCategoryQuery = { __typename?: 'Query', recipesByCategory: Array<{ __typename?: 'Recipe', id: number, title_el: string, title_en: string, description_el?: string | null, description_en?: string | null, chefComment_el?: string | null, chefComment_en?: string | null, category?: RecipeCategory | null, recipeImage?: string | null, prepTime: number, cookTime: number, restTime?: number | null, difficulty: Difficulty, caloriesTotal?: number | null, protein?: number | null, carbs?: number | null, fat?: number | null, foodEthnicity?: string | null, authorId: number, createdAt: string, updatedAt: string, steps?: Array<{ __typename?: 'Step', id: number, body_el: string, body_en: string, recipeID: number }> | null, recipeIngredients?: Array<{ __typename?: 'RecipeIngredient', recipeId: number, ingredientId: number, quantity: string, unit: string, ingredient?: { __typename?: 'Ingredient', id: number, name_el: string, name_en: string, caloriesPer100g?: number | null } | null }> | null, author?: { __typename?: 'ChefProfile', user: { __typename?: 'User', username: string } } | null }> };

export type RecipesByChefQueryVariables = Exact<{
  chefId: Scalars['Int']['input'];
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
}>;


export type RecipesByChefQuery = { __typename?: 'Query', recipesByChef: Array<{ __typename?: 'Recipe', id: number, title_el: string, title_en: string, description_el?: string | null, description_en?: string | null, chefComment_el?: string | null, chefComment_en?: string | null, category?: RecipeCategory | null, recipeImage?: string | null, prepTime: number, cookTime: number, restTime?: number | null, difficulty: Difficulty, caloriesTotal?: number | null, protein?: number | null, carbs?: number | null, fat?: number | null, foodEthnicity?: string | null, authorId: number, createdAt: string, updatedAt: string, steps?: Array<{ __typename?: 'Step', id: number, body_el: string, body_en: string, recipeID: number }> | null, recipeIngredients?: Array<{ __typename?: 'RecipeIngredient', recipeId: number, ingredientId: number, quantity: string, unit: string, ingredient?: { __typename?: 'Ingredient', id: number, name_el: string, name_en: string, caloriesPer100g?: number | null } | null }> | null, author?: { __typename?: 'ChefProfile', user: { __typename?: 'User', username: string } } | null }> };

export type SuggestedRecipesQueryVariables = Exact<{
  ingredientIds: Array<Scalars['Int']['input']> | Scalars['Int']['input'];
  utensilIds?: InputMaybe<Array<Scalars['Int']['input']> | Scalars['Int']['input']>;
  maxMissing?: InputMaybe<Scalars['Int']['input']>;
}>;


export type SuggestedRecipesQuery = { __typename?: 'Query', suggestedRecipes: Array<{ __typename?: 'RecipeSuggestion', missingCount: number, recipe: { __typename?: 'Recipe', id: number, title_el: string, title_en: string, description_el?: string | null, description_en?: string | null, chefComment_el?: string | null, chefComment_en?: string | null, category?: RecipeCategory | null, recipeImage?: string | null, prepTime: number, cookTime: number, restTime?: number | null, difficulty: Difficulty, caloriesTotal?: number | null, protein?: number | null, carbs?: number | null, fat?: number | null, foodEthnicity?: string | null, authorId: number, createdAt: string, updatedAt: string, steps?: Array<{ __typename?: 'Step', id: number, body_el: string, body_en: string, recipeID: number }> | null, recipeIngredients?: Array<{ __typename?: 'RecipeIngredient', recipeId: number, ingredientId: number, quantity: string, unit: string, ingredient?: { __typename?: 'Ingredient', id: number, name_el: string, name_en: string, caloriesPer100g?: number | null } | null }> | null, author?: { __typename?: 'ChefProfile', user: { __typename?: 'User', username: string } } | null }, missingIngredients: Array<{ __typename?: 'Ingredient', id: number, name_el: string, name_en: string }>, missingUtensils: Array<{ __typename?: 'Utensil', id: number, name_el: string, name_en: string }> }> };

export type TopRatedRecipesQueryVariables = Exact<{
  limit?: InputMaybe<Scalars['Int']['input']>;
}>;


export type TopRatedRecipesQuery = { __typename?: 'Query', topRatedRecipes: Array<{ __typename?: 'Recipe', id: number, title_el: string, title_en: string, recipeImage?: string | null, caloriesTotal?: number | null, prepTime: number, cookTime: number, difficulty: Difficulty, category?: RecipeCategory | null }> };

export const RegualarErrorFragmentDoc = gql`
    fragment RegualarError on FieldError {
  field
  message
}
    `;
export const RegularChefProfileFragmentDoc = gql`
    fragment RegularChefProfile on ChefProfile {
  id
  bio
  user {
    id
    username
    email
    image
  }
}
    `;
export const RegularChefProfileResponseFragmentDoc = gql`
    fragment RegularChefProfileResponse on ChefProfileResponse {
  errors {
    ...RegualarError
  }
  chefProfile {
    ...RegularChefProfile
  }
}
    ${RegualarErrorFragmentDoc}
${RegularChefProfileFragmentDoc}`;
export const RegularNutritionistProfileResponseFragmentDoc = gql`
    fragment RegularNutritionistProfileResponse on NutritionistProfileResponse {
  errors {
    ...RegualarError
  }
  nutritionistProfile {
    id
    bio
    phone
    city
    user {
      id
      username
      email
      image
    }
  }
}
    ${RegualarErrorFragmentDoc}`;
export const RegularUserFragmentDoc = gql`
    fragment RegularUser on User {
  id
  username
  email
  role
  image
}
    `;
export const RegularUserResponseFragmentDoc = gql`
    fragment RegularUserResponse on UserResponse {
  errors {
    ...RegualarError
  }
  user {
    ...RegularUser
  }
}
    ${RegualarErrorFragmentDoc}
${RegularUserFragmentDoc}`;
export const RegularAppointmentFragmentDoc = gql`
    fragment RegularAppointment on Appointment {
  id
  date
  time
  isAvailable
  nutritionistId
}
    `;
export const RegularAppointmentRequestFragmentDoc = gql`
    fragment RegularAppointmentRequest on AppointmentRequest {
  id
  slotId
  clientId
  status
  comment
  requestedAt
  slot {
    ...RegularAppointment
  }
  client {
    id
    username
    image
  }
}
    ${RegularAppointmentFragmentDoc}`;
export const RegularAppointmentRequestResponseFragmentDoc = gql`
    fragment RegularAppointmentRequestResponse on AppointmentRequestResponse {
  errors {
    ...RegualarError
  }
  appointmentRequest {
    ...RegularAppointmentRequest
  }
}
    ${RegualarErrorFragmentDoc}
${RegularAppointmentRequestFragmentDoc}`;
export const RegularAppointmentResponseFragmentDoc = gql`
    fragment RegularAppointmentResponse on AppointmentResponse {
  errors {
    ...RegualarError
  }
  slot {
    ...RegularAppointment
  }
}
    ${RegualarErrorFragmentDoc}
${RegularAppointmentFragmentDoc}`;
export const RegularArticleFragmentDoc = gql`
    fragment RegularArticle on Article {
  id
  title_el
  title_en
  text_el
  text_en
  image
  creatorId
  createdAt
  updatedAt
}
    `;
export const RegularArticleResponseFragmentDoc = gql`
    fragment RegularArticleResponse on ArticleResponse {
  errors {
    ...RegualarError
  }
  article {
    ...RegularArticle
  }
}
    ${RegualarErrorFragmentDoc}
${RegularArticleFragmentDoc}`;
export const RegularCartItemFragmentDoc = gql`
    fragment RegularCartItem on ShoppingCart {
  id
  userId
  ingredientId
  quantity
  unit
  note
  addedAt
  ingredient {
    id
    name_el
    name_en
    caloriesPer100g
  }
}
    `;
export const RegularCookedRecipeFragmentDoc = gql`
    fragment RegularCookedRecipe on CookedRecipe {
  id
  userId
  recipeId
  cookedAt
  recipe {
    id
    title_el
    title_en
    recipeImage
    category
    prepTime
    cookTime
    caloriesTotal
    difficulty
  }
}
    `;
export const RegularUserFavoriteFragmentDoc = gql`
    fragment RegularUserFavorite on UserFavorite {
  id
  userId
  recipeId
  savedAt
  recipe {
    id
    title_el
    title_en
    recipeImage
    category
    prepTime
    cookTime
    difficulty
  }
}
    `;
export const MealSchedulerWithNutritionistFragmentDoc = gql`
    fragment MealSchedulerWithNutritionist on MealScheduler {
  id
  day
  mealType
  comment_el
  comment_en
  nutritionist {
    user {
      username
    }
  }
}
    `;
export const RegularMealSchedulerFragmentDoc = gql`
    fragment RegularMealScheduler on MealScheduler {
  id
  day
  mealType
  comment_el
  comment_en
}
    `;
export const RegularMealPlanResponseFragmentDoc = gql`
    fragment RegularMealPlanResponse on MealPlanResponse {
  errors {
    ...RegualarError
  }
  mealScheduler {
    ...RegularMealScheduler
  }
}
    ${RegualarErrorFragmentDoc}
${RegularMealSchedulerFragmentDoc}`;
export const RegularConversationFragmentDoc = gql`
    fragment RegularConversation on Conversation {
  id
  participant1Id
  participant2Id
  createdAt
  updatedAt
}
    `;
export const ConversationWithParticipantsFragmentDoc = gql`
    fragment ConversationWithParticipants on Conversation {
  ...RegularConversation
  participant1 {
    id
    username
    image
  }
  participant2 {
    id
    username
    image
  }
}
    ${RegularConversationFragmentDoc}`;
export const RegularMessageFragmentDoc = gql`
    fragment RegularMessage on Message {
  id
  conversationId
  senderId
  body
  createdAt
}
    `;
export const ConversationWithMessagesFragmentDoc = gql`
    fragment ConversationWithMessages on Conversation {
  ...ConversationWithParticipants
  messages {
    ...RegularMessage
    sender {
      id
      username
    }
  }
}
    ${ConversationWithParticipantsFragmentDoc}
${RegularMessageFragmentDoc}`;
export const RegularChefRatingFragmentDoc = gql`
    fragment RegularChefRating on ChefRating {
  id
  chefId
  userId
  score
  comment
  createdAt
  user {
    id
    username
    image
  }
}
    `;
export const RegularRecipeRatingFragmentDoc = gql`
    fragment RegularRecipeRating on RecipeRating {
  id
  recipeId
  userId
  score
  comment
  createdAt
  user {
    id
    username
    image
  }
}
    `;
export const TopRatedRecipeFragmentDoc = gql`
    fragment TopRatedRecipe on Recipe {
  id
  title_el
  title_en
  recipeImage
  caloriesTotal
  prepTime
  cookTime
  difficulty
  category
}
    `;
export const RegularRecipeFragmentDoc = gql`
    fragment RegularRecipe on Recipe {
  id
  title_el
  title_en
  description_el
  description_en
  chefComment_el
  chefComment_en
  category
  recipeImage
  prepTime
  cookTime
  restTime
  difficulty
  caloriesTotal
  protein
  carbs
  fat
  foodEthnicity
  authorId
  createdAt
  updatedAt
  steps {
    id
    body_el
    body_en
    recipeID
  }
  recipeIngredients {
    recipeId
    ingredientId
    quantity
    unit
    ingredient {
      id
      name_el
      name_en
      caloriesPer100g
    }
  }
  author {
    user {
      username
    }
  }
}
    `;
export const RegularRecipeResponseFragmentDoc = gql`
    fragment RegularRecipeResponse on RecipeResponse {
  errors {
    ...RegualarError
  }
  recipe {
    ...RegularRecipe
  }
}
    ${RegualarErrorFragmentDoc}
${RegularRecipeFragmentDoc}`;
export const CreateAppointmentDocument = gql`
    mutation CreateAppointment($data: AddAppointmentInput!) {
  createAppointment(data: $data) {
    ...RegularAppointmentResponse
  }
}
    ${RegularAppointmentResponseFragmentDoc}`;
export type CreateAppointmentMutationFn = Apollo.MutationFunction<CreateAppointmentMutation, CreateAppointmentMutationVariables>;

/**
 * __useCreateAppointmentMutation__
 *
 * To run a mutation, you first call `useCreateAppointmentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateAppointmentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createAppointmentMutation, { data, loading, error }] = useCreateAppointmentMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useCreateAppointmentMutation(baseOptions?: Apollo.MutationHookOptions<CreateAppointmentMutation, CreateAppointmentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateAppointmentMutation, CreateAppointmentMutationVariables>(CreateAppointmentDocument, options);
      }
export type CreateAppointmentMutationHookResult = ReturnType<typeof useCreateAppointmentMutation>;
export type CreateAppointmentMutationResult = Apollo.MutationResult<CreateAppointmentMutation>;
export type CreateAppointmentMutationOptions = Apollo.BaseMutationOptions<CreateAppointmentMutation, CreateAppointmentMutationVariables>;
export const UpdateAppointmentDocument = gql`
    mutation UpdateAppointment($data: UpdateSlotInput!) {
  updateAppointment(data: $data) {
    ...RegularAppointmentResponse
  }
}
    ${RegularAppointmentResponseFragmentDoc}`;
export type UpdateAppointmentMutationFn = Apollo.MutationFunction<UpdateAppointmentMutation, UpdateAppointmentMutationVariables>;

/**
 * __useUpdateAppointmentMutation__
 *
 * To run a mutation, you first call `useUpdateAppointmentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateAppointmentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateAppointmentMutation, { data, loading, error }] = useUpdateAppointmentMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useUpdateAppointmentMutation(baseOptions?: Apollo.MutationHookOptions<UpdateAppointmentMutation, UpdateAppointmentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateAppointmentMutation, UpdateAppointmentMutationVariables>(UpdateAppointmentDocument, options);
      }
export type UpdateAppointmentMutationHookResult = ReturnType<typeof useUpdateAppointmentMutation>;
export type UpdateAppointmentMutationResult = Apollo.MutationResult<UpdateAppointmentMutation>;
export type UpdateAppointmentMutationOptions = Apollo.BaseMutationOptions<UpdateAppointmentMutation, UpdateAppointmentMutationVariables>;
export const DeleteAppointmentDocument = gql`
    mutation DeleteAppointment($slotId: Int!) {
  deleteAppointment(slotId: $slotId)
}
    `;
export type DeleteAppointmentMutationFn = Apollo.MutationFunction<DeleteAppointmentMutation, DeleteAppointmentMutationVariables>;

/**
 * __useDeleteAppointmentMutation__
 *
 * To run a mutation, you first call `useDeleteAppointmentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteAppointmentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteAppointmentMutation, { data, loading, error }] = useDeleteAppointmentMutation({
 *   variables: {
 *      slotId: // value for 'slotId'
 *   },
 * });
 */
export function useDeleteAppointmentMutation(baseOptions?: Apollo.MutationHookOptions<DeleteAppointmentMutation, DeleteAppointmentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteAppointmentMutation, DeleteAppointmentMutationVariables>(DeleteAppointmentDocument, options);
      }
export type DeleteAppointmentMutationHookResult = ReturnType<typeof useDeleteAppointmentMutation>;
export type DeleteAppointmentMutationResult = Apollo.MutationResult<DeleteAppointmentMutation>;
export type DeleteAppointmentMutationOptions = Apollo.BaseMutationOptions<DeleteAppointmentMutation, DeleteAppointmentMutationVariables>;
export const RequestAppointmentDocument = gql`
    mutation RequestAppointment($data: AppointmentRequestInput!) {
  requestAppointment(data: $data) {
    ...RegularAppointmentRequestResponse
  }
}
    ${RegularAppointmentRequestResponseFragmentDoc}`;
export type RequestAppointmentMutationFn = Apollo.MutationFunction<RequestAppointmentMutation, RequestAppointmentMutationVariables>;

/**
 * __useRequestAppointmentMutation__
 *
 * To run a mutation, you first call `useRequestAppointmentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRequestAppointmentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [requestAppointmentMutation, { data, loading, error }] = useRequestAppointmentMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useRequestAppointmentMutation(baseOptions?: Apollo.MutationHookOptions<RequestAppointmentMutation, RequestAppointmentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RequestAppointmentMutation, RequestAppointmentMutationVariables>(RequestAppointmentDocument, options);
      }
export type RequestAppointmentMutationHookResult = ReturnType<typeof useRequestAppointmentMutation>;
export type RequestAppointmentMutationResult = Apollo.MutationResult<RequestAppointmentMutation>;
export type RequestAppointmentMutationOptions = Apollo.BaseMutationOptions<RequestAppointmentMutation, RequestAppointmentMutationVariables>;
export const RespondToAppointmentRequestDocument = gql`
    mutation RespondToAppointmentRequest($requestId: Float!, $status: AppointmentStatus!) {
  respondToAppointmentRequest(requestId: $requestId, status: $status)
}
    `;
export type RespondToAppointmentRequestMutationFn = Apollo.MutationFunction<RespondToAppointmentRequestMutation, RespondToAppointmentRequestMutationVariables>;

/**
 * __useRespondToAppointmentRequestMutation__
 *
 * To run a mutation, you first call `useRespondToAppointmentRequestMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRespondToAppointmentRequestMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [respondToAppointmentRequestMutation, { data, loading, error }] = useRespondToAppointmentRequestMutation({
 *   variables: {
 *      requestId: // value for 'requestId'
 *      status: // value for 'status'
 *   },
 * });
 */
export function useRespondToAppointmentRequestMutation(baseOptions?: Apollo.MutationHookOptions<RespondToAppointmentRequestMutation, RespondToAppointmentRequestMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RespondToAppointmentRequestMutation, RespondToAppointmentRequestMutationVariables>(RespondToAppointmentRequestDocument, options);
      }
export type RespondToAppointmentRequestMutationHookResult = ReturnType<typeof useRespondToAppointmentRequestMutation>;
export type RespondToAppointmentRequestMutationResult = Apollo.MutationResult<RespondToAppointmentRequestMutation>;
export type RespondToAppointmentRequestMutationOptions = Apollo.BaseMutationOptions<RespondToAppointmentRequestMutation, RespondToAppointmentRequestMutationVariables>;
export const UpdateArticleDocument = gql`
    mutation UpdateArticle($data: UpdateArticleInput!) {
  updateArticle(data: $data) {
    ...RegularArticleResponse
  }
}
    ${RegularArticleResponseFragmentDoc}`;
export type UpdateArticleMutationFn = Apollo.MutationFunction<UpdateArticleMutation, UpdateArticleMutationVariables>;

/**
 * __useUpdateArticleMutation__
 *
 * To run a mutation, you first call `useUpdateArticleMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateArticleMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateArticleMutation, { data, loading, error }] = useUpdateArticleMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useUpdateArticleMutation(baseOptions?: Apollo.MutationHookOptions<UpdateArticleMutation, UpdateArticleMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateArticleMutation, UpdateArticleMutationVariables>(UpdateArticleDocument, options);
      }
export type UpdateArticleMutationHookResult = ReturnType<typeof useUpdateArticleMutation>;
export type UpdateArticleMutationResult = Apollo.MutationResult<UpdateArticleMutation>;
export type UpdateArticleMutationOptions = Apollo.BaseMutationOptions<UpdateArticleMutation, UpdateArticleMutationVariables>;
export const DeleteArticleDocument = gql`
    mutation DeleteArticle($id: Int!) {
  deleteArticle(id: $id)
}
    `;
export type DeleteArticleMutationFn = Apollo.MutationFunction<DeleteArticleMutation, DeleteArticleMutationVariables>;

/**
 * __useDeleteArticleMutation__
 *
 * To run a mutation, you first call `useDeleteArticleMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteArticleMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteArticleMutation, { data, loading, error }] = useDeleteArticleMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteArticleMutation(baseOptions?: Apollo.MutationHookOptions<DeleteArticleMutation, DeleteArticleMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteArticleMutation, DeleteArticleMutationVariables>(DeleteArticleDocument, options);
      }
export type DeleteArticleMutationHookResult = ReturnType<typeof useDeleteArticleMutation>;
export type DeleteArticleMutationResult = Apollo.MutationResult<DeleteArticleMutation>;
export type DeleteArticleMutationOptions = Apollo.BaseMutationOptions<DeleteArticleMutation, DeleteArticleMutationVariables>;
export const AddToCartDocument = gql`
    mutation AddToCart($ingredientId: Int!, $quantity: String, $unit: String, $note: String) {
  addToCart(
    ingredientId: $ingredientId
    quantity: $quantity
    unit: $unit
    note: $note
  ) {
    ...RegularCartItem
  }
}
    ${RegularCartItemFragmentDoc}`;
export type AddToCartMutationFn = Apollo.MutationFunction<AddToCartMutation, AddToCartMutationVariables>;

/**
 * __useAddToCartMutation__
 *
 * To run a mutation, you first call `useAddToCartMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddToCartMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addToCartMutation, { data, loading, error }] = useAddToCartMutation({
 *   variables: {
 *      ingredientId: // value for 'ingredientId'
 *      quantity: // value for 'quantity'
 *      unit: // value for 'unit'
 *      note: // value for 'note'
 *   },
 * });
 */
export function useAddToCartMutation(baseOptions?: Apollo.MutationHookOptions<AddToCartMutation, AddToCartMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddToCartMutation, AddToCartMutationVariables>(AddToCartDocument, options);
      }
export type AddToCartMutationHookResult = ReturnType<typeof useAddToCartMutation>;
export type AddToCartMutationResult = Apollo.MutationResult<AddToCartMutation>;
export type AddToCartMutationOptions = Apollo.BaseMutationOptions<AddToCartMutation, AddToCartMutationVariables>;
export const AddManyToCartDocument = gql`
    mutation AddManyToCart($ingredientIds: [Int!]!) {
  addManyToCart(ingredientIds: $ingredientIds) {
    ...RegularCartItem
  }
}
    ${RegularCartItemFragmentDoc}`;
export type AddManyToCartMutationFn = Apollo.MutationFunction<AddManyToCartMutation, AddManyToCartMutationVariables>;

/**
 * __useAddManyToCartMutation__
 *
 * To run a mutation, you first call `useAddManyToCartMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddManyToCartMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addManyToCartMutation, { data, loading, error }] = useAddManyToCartMutation({
 *   variables: {
 *      ingredientIds: // value for 'ingredientIds'
 *   },
 * });
 */
export function useAddManyToCartMutation(baseOptions?: Apollo.MutationHookOptions<AddManyToCartMutation, AddManyToCartMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddManyToCartMutation, AddManyToCartMutationVariables>(AddManyToCartDocument, options);
      }
export type AddManyToCartMutationHookResult = ReturnType<typeof useAddManyToCartMutation>;
export type AddManyToCartMutationResult = Apollo.MutationResult<AddManyToCartMutation>;
export type AddManyToCartMutationOptions = Apollo.BaseMutationOptions<AddManyToCartMutation, AddManyToCartMutationVariables>;
export const UpdateCartItemDocument = gql`
    mutation UpdateCartItem($id: Int!, $quantity: String, $unit: String, $note: String) {
  updateCartItem(id: $id, quantity: $quantity, unit: $unit, note: $note) {
    ...RegularCartItem
  }
}
    ${RegularCartItemFragmentDoc}`;
export type UpdateCartItemMutationFn = Apollo.MutationFunction<UpdateCartItemMutation, UpdateCartItemMutationVariables>;

/**
 * __useUpdateCartItemMutation__
 *
 * To run a mutation, you first call `useUpdateCartItemMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateCartItemMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateCartItemMutation, { data, loading, error }] = useUpdateCartItemMutation({
 *   variables: {
 *      id: // value for 'id'
 *      quantity: // value for 'quantity'
 *      unit: // value for 'unit'
 *      note: // value for 'note'
 *   },
 * });
 */
export function useUpdateCartItemMutation(baseOptions?: Apollo.MutationHookOptions<UpdateCartItemMutation, UpdateCartItemMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateCartItemMutation, UpdateCartItemMutationVariables>(UpdateCartItemDocument, options);
      }
export type UpdateCartItemMutationHookResult = ReturnType<typeof useUpdateCartItemMutation>;
export type UpdateCartItemMutationResult = Apollo.MutationResult<UpdateCartItemMutation>;
export type UpdateCartItemMutationOptions = Apollo.BaseMutationOptions<UpdateCartItemMutation, UpdateCartItemMutationVariables>;
export const RemoveFromCartDocument = gql`
    mutation RemoveFromCart($id: Int!) {
  removeFromCart(id: $id)
}
    `;
export type RemoveFromCartMutationFn = Apollo.MutationFunction<RemoveFromCartMutation, RemoveFromCartMutationVariables>;

/**
 * __useRemoveFromCartMutation__
 *
 * To run a mutation, you first call `useRemoveFromCartMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveFromCartMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeFromCartMutation, { data, loading, error }] = useRemoveFromCartMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useRemoveFromCartMutation(baseOptions?: Apollo.MutationHookOptions<RemoveFromCartMutation, RemoveFromCartMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RemoveFromCartMutation, RemoveFromCartMutationVariables>(RemoveFromCartDocument, options);
      }
export type RemoveFromCartMutationHookResult = ReturnType<typeof useRemoveFromCartMutation>;
export type RemoveFromCartMutationResult = Apollo.MutationResult<RemoveFromCartMutation>;
export type RemoveFromCartMutationOptions = Apollo.BaseMutationOptions<RemoveFromCartMutation, RemoveFromCartMutationVariables>;
export const ClearCartDocument = gql`
    mutation ClearCart {
  clearCart
}
    `;
export type ClearCartMutationFn = Apollo.MutationFunction<ClearCartMutation, ClearCartMutationVariables>;

/**
 * __useClearCartMutation__
 *
 * To run a mutation, you first call `useClearCartMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useClearCartMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [clearCartMutation, { data, loading, error }] = useClearCartMutation({
 *   variables: {
 *   },
 * });
 */
export function useClearCartMutation(baseOptions?: Apollo.MutationHookOptions<ClearCartMutation, ClearCartMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ClearCartMutation, ClearCartMutationVariables>(ClearCartDocument, options);
      }
export type ClearCartMutationHookResult = ReturnType<typeof useClearCartMutation>;
export type ClearCartMutationResult = Apollo.MutationResult<ClearCartMutation>;
export type ClearCartMutationOptions = Apollo.BaseMutationOptions<ClearCartMutation, ClearCartMutationVariables>;
export const ChangePasswordDocument = gql`
    mutation ChangePassword($token: String!, $newPassword: String!) {
  changePassword(token: $token, newPassword: $newPassword) {
    ...RegularUserResponse
  }
}
    ${RegularUserResponseFragmentDoc}`;
export type ChangePasswordMutationFn = Apollo.MutationFunction<ChangePasswordMutation, ChangePasswordMutationVariables>;

/**
 * __useChangePasswordMutation__
 *
 * To run a mutation, you first call `useChangePasswordMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useChangePasswordMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [changePasswordMutation, { data, loading, error }] = useChangePasswordMutation({
 *   variables: {
 *      token: // value for 'token'
 *      newPassword: // value for 'newPassword'
 *   },
 * });
 */
export function useChangePasswordMutation(baseOptions?: Apollo.MutationHookOptions<ChangePasswordMutation, ChangePasswordMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ChangePasswordMutation, ChangePasswordMutationVariables>(ChangePasswordDocument, options);
      }
export type ChangePasswordMutationHookResult = ReturnType<typeof useChangePasswordMutation>;
export type ChangePasswordMutationResult = Apollo.MutationResult<ChangePasswordMutation>;
export type ChangePasswordMutationOptions = Apollo.BaseMutationOptions<ChangePasswordMutation, ChangePasswordMutationVariables>;
export const CreateRecipeDocument = gql`
    mutation CreateRecipe($data: CreateRecipeInput!) {
  createRecipe(data: $data) {
    ...RegularRecipeResponse
  }
}
    ${RegularRecipeResponseFragmentDoc}`;
export type CreateRecipeMutationFn = Apollo.MutationFunction<CreateRecipeMutation, CreateRecipeMutationVariables>;

/**
 * __useCreateRecipeMutation__
 *
 * To run a mutation, you first call `useCreateRecipeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateRecipeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createRecipeMutation, { data, loading, error }] = useCreateRecipeMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useCreateRecipeMutation(baseOptions?: Apollo.MutationHookOptions<CreateRecipeMutation, CreateRecipeMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateRecipeMutation, CreateRecipeMutationVariables>(CreateRecipeDocument, options);
      }
export type CreateRecipeMutationHookResult = ReturnType<typeof useCreateRecipeMutation>;
export type CreateRecipeMutationResult = Apollo.MutationResult<CreateRecipeMutation>;
export type CreateRecipeMutationOptions = Apollo.BaseMutationOptions<CreateRecipeMutation, CreateRecipeMutationVariables>;
export const UpdateRecipeDocument = gql`
    mutation UpdateRecipe($data: UpdateRecipeInput!) {
  updateRecipe(data: $data) {
    ...RegularRecipeResponse
  }
}
    ${RegularRecipeResponseFragmentDoc}`;
export type UpdateRecipeMutationFn = Apollo.MutationFunction<UpdateRecipeMutation, UpdateRecipeMutationVariables>;

/**
 * __useUpdateRecipeMutation__
 *
 * To run a mutation, you first call `useUpdateRecipeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateRecipeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateRecipeMutation, { data, loading, error }] = useUpdateRecipeMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useUpdateRecipeMutation(baseOptions?: Apollo.MutationHookOptions<UpdateRecipeMutation, UpdateRecipeMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateRecipeMutation, UpdateRecipeMutationVariables>(UpdateRecipeDocument, options);
      }
export type UpdateRecipeMutationHookResult = ReturnType<typeof useUpdateRecipeMutation>;
export type UpdateRecipeMutationResult = Apollo.MutationResult<UpdateRecipeMutation>;
export type UpdateRecipeMutationOptions = Apollo.BaseMutationOptions<UpdateRecipeMutation, UpdateRecipeMutationVariables>;
export const DeleteRecipeDocument = gql`
    mutation DeleteRecipe($id: Int!) {
  deleteRecipe(id: $id)
}
    `;
export type DeleteRecipeMutationFn = Apollo.MutationFunction<DeleteRecipeMutation, DeleteRecipeMutationVariables>;

/**
 * __useDeleteRecipeMutation__
 *
 * To run a mutation, you first call `useDeleteRecipeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteRecipeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteRecipeMutation, { data, loading, error }] = useDeleteRecipeMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteRecipeMutation(baseOptions?: Apollo.MutationHookOptions<DeleteRecipeMutation, DeleteRecipeMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteRecipeMutation, DeleteRecipeMutationVariables>(DeleteRecipeDocument, options);
      }
export type DeleteRecipeMutationHookResult = ReturnType<typeof useDeleteRecipeMutation>;
export type DeleteRecipeMutationResult = Apollo.MutationResult<DeleteRecipeMutation>;
export type DeleteRecipeMutationOptions = Apollo.BaseMutationOptions<DeleteRecipeMutation, DeleteRecipeMutationVariables>;
export const RateChefDocument = gql`
    mutation RateChef($chefId: Int!, $score: Int!, $comment: String) {
  rateChef(chefId: $chefId, score: $score, comment: $comment) {
    ...RegularChefRating
  }
}
    ${RegularChefRatingFragmentDoc}`;
export type RateChefMutationFn = Apollo.MutationFunction<RateChefMutation, RateChefMutationVariables>;

/**
 * __useRateChefMutation__
 *
 * To run a mutation, you first call `useRateChefMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRateChefMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [rateChefMutation, { data, loading, error }] = useRateChefMutation({
 *   variables: {
 *      chefId: // value for 'chefId'
 *      score: // value for 'score'
 *      comment: // value for 'comment'
 *   },
 * });
 */
export function useRateChefMutation(baseOptions?: Apollo.MutationHookOptions<RateChefMutation, RateChefMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RateChefMutation, RateChefMutationVariables>(RateChefDocument, options);
      }
export type RateChefMutationHookResult = ReturnType<typeof useRateChefMutation>;
export type RateChefMutationResult = Apollo.MutationResult<RateChefMutation>;
export type RateChefMutationOptions = Apollo.BaseMutationOptions<RateChefMutation, RateChefMutationVariables>;
export const RateRecipeDocument = gql`
    mutation RateRecipe($recipeId: Int!, $score: Int!, $comment: String) {
  rateRecipe(recipeId: $recipeId, score: $score, comment: $comment) {
    ...RegularRecipeRating
  }
}
    ${RegularRecipeRatingFragmentDoc}`;
export type RateRecipeMutationFn = Apollo.MutationFunction<RateRecipeMutation, RateRecipeMutationVariables>;

/**
 * __useRateRecipeMutation__
 *
 * To run a mutation, you first call `useRateRecipeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRateRecipeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [rateRecipeMutation, { data, loading, error }] = useRateRecipeMutation({
 *   variables: {
 *      recipeId: // value for 'recipeId'
 *      score: // value for 'score'
 *      comment: // value for 'comment'
 *   },
 * });
 */
export function useRateRecipeMutation(baseOptions?: Apollo.MutationHookOptions<RateRecipeMutation, RateRecipeMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RateRecipeMutation, RateRecipeMutationVariables>(RateRecipeDocument, options);
      }
export type RateRecipeMutationHookResult = ReturnType<typeof useRateRecipeMutation>;
export type RateRecipeMutationResult = Apollo.MutationResult<RateRecipeMutation>;
export type RateRecipeMutationOptions = Apollo.BaseMutationOptions<RateRecipeMutation, RateRecipeMutationVariables>;
export const DeleteChefRatingDocument = gql`
    mutation DeleteChefRating($chefId: Int!) {
  deleteChefRating(chefId: $chefId)
}
    `;
export type DeleteChefRatingMutationFn = Apollo.MutationFunction<DeleteChefRatingMutation, DeleteChefRatingMutationVariables>;

/**
 * __useDeleteChefRatingMutation__
 *
 * To run a mutation, you first call `useDeleteChefRatingMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteChefRatingMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteChefRatingMutation, { data, loading, error }] = useDeleteChefRatingMutation({
 *   variables: {
 *      chefId: // value for 'chefId'
 *   },
 * });
 */
export function useDeleteChefRatingMutation(baseOptions?: Apollo.MutationHookOptions<DeleteChefRatingMutation, DeleteChefRatingMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteChefRatingMutation, DeleteChefRatingMutationVariables>(DeleteChefRatingDocument, options);
      }
export type DeleteChefRatingMutationHookResult = ReturnType<typeof useDeleteChefRatingMutation>;
export type DeleteChefRatingMutationResult = Apollo.MutationResult<DeleteChefRatingMutation>;
export type DeleteChefRatingMutationOptions = Apollo.BaseMutationOptions<DeleteChefRatingMutation, DeleteChefRatingMutationVariables>;
export const LogCookedRecipeDocument = gql`
    mutation LogCookedRecipe($recipeId: Int!) {
  logCookedRecipe(recipeId: $recipeId) {
    ...RegularCookedRecipe
  }
}
    ${RegularCookedRecipeFragmentDoc}`;
export type LogCookedRecipeMutationFn = Apollo.MutationFunction<LogCookedRecipeMutation, LogCookedRecipeMutationVariables>;

/**
 * __useLogCookedRecipeMutation__
 *
 * To run a mutation, you first call `useLogCookedRecipeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLogCookedRecipeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [logCookedRecipeMutation, { data, loading, error }] = useLogCookedRecipeMutation({
 *   variables: {
 *      recipeId: // value for 'recipeId'
 *   },
 * });
 */
export function useLogCookedRecipeMutation(baseOptions?: Apollo.MutationHookOptions<LogCookedRecipeMutation, LogCookedRecipeMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LogCookedRecipeMutation, LogCookedRecipeMutationVariables>(LogCookedRecipeDocument, options);
      }
export type LogCookedRecipeMutationHookResult = ReturnType<typeof useLogCookedRecipeMutation>;
export type LogCookedRecipeMutationResult = Apollo.MutationResult<LogCookedRecipeMutation>;
export type LogCookedRecipeMutationOptions = Apollo.BaseMutationOptions<LogCookedRecipeMutation, LogCookedRecipeMutationVariables>;
export const DeleteCookLogDocument = gql`
    mutation DeleteCookLog($id: Int!) {
  deleteCookLog(id: $id)
}
    `;
export type DeleteCookLogMutationFn = Apollo.MutationFunction<DeleteCookLogMutation, DeleteCookLogMutationVariables>;

/**
 * __useDeleteCookLogMutation__
 *
 * To run a mutation, you first call `useDeleteCookLogMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteCookLogMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteCookLogMutation, { data, loading, error }] = useDeleteCookLogMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteCookLogMutation(baseOptions?: Apollo.MutationHookOptions<DeleteCookLogMutation, DeleteCookLogMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteCookLogMutation, DeleteCookLogMutationVariables>(DeleteCookLogDocument, options);
      }
export type DeleteCookLogMutationHookResult = ReturnType<typeof useDeleteCookLogMutation>;
export type DeleteCookLogMutationResult = Apollo.MutationResult<DeleteCookLogMutation>;
export type DeleteCookLogMutationOptions = Apollo.BaseMutationOptions<DeleteCookLogMutation, DeleteCookLogMutationVariables>;
export const CreateArticleDocument = gql`
    mutation CreateArticle($data: AddArticleInput!) {
  createArticle(data: $data) {
    ...RegularArticleResponse
  }
}
    ${RegularArticleResponseFragmentDoc}`;
export type CreateArticleMutationFn = Apollo.MutationFunction<CreateArticleMutation, CreateArticleMutationVariables>;

/**
 * __useCreateArticleMutation__
 *
 * To run a mutation, you first call `useCreateArticleMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateArticleMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createArticleMutation, { data, loading, error }] = useCreateArticleMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useCreateArticleMutation(baseOptions?: Apollo.MutationHookOptions<CreateArticleMutation, CreateArticleMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateArticleMutation, CreateArticleMutationVariables>(CreateArticleDocument, options);
      }
export type CreateArticleMutationHookResult = ReturnType<typeof useCreateArticleMutation>;
export type CreateArticleMutationResult = Apollo.MutationResult<CreateArticleMutation>;
export type CreateArticleMutationOptions = Apollo.BaseMutationOptions<CreateArticleMutation, CreateArticleMutationVariables>;
export const SaveRecipeDocument = gql`
    mutation SaveRecipe($recipeId: Int!) {
  saveRecipe(recipeId: $recipeId) {
    ...RegularUserFavorite
  }
}
    ${RegularUserFavoriteFragmentDoc}`;
export type SaveRecipeMutationFn = Apollo.MutationFunction<SaveRecipeMutation, SaveRecipeMutationVariables>;

/**
 * __useSaveRecipeMutation__
 *
 * To run a mutation, you first call `useSaveRecipeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSaveRecipeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [saveRecipeMutation, { data, loading, error }] = useSaveRecipeMutation({
 *   variables: {
 *      recipeId: // value for 'recipeId'
 *   },
 * });
 */
export function useSaveRecipeMutation(baseOptions?: Apollo.MutationHookOptions<SaveRecipeMutation, SaveRecipeMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SaveRecipeMutation, SaveRecipeMutationVariables>(SaveRecipeDocument, options);
      }
export type SaveRecipeMutationHookResult = ReturnType<typeof useSaveRecipeMutation>;
export type SaveRecipeMutationResult = Apollo.MutationResult<SaveRecipeMutation>;
export type SaveRecipeMutationOptions = Apollo.BaseMutationOptions<SaveRecipeMutation, SaveRecipeMutationVariables>;
export const UnsaveRecipeDocument = gql`
    mutation UnsaveRecipe($recipeId: Int!) {
  unsaveRecipe(recipeId: $recipeId)
}
    `;
export type UnsaveRecipeMutationFn = Apollo.MutationFunction<UnsaveRecipeMutation, UnsaveRecipeMutationVariables>;

/**
 * __useUnsaveRecipeMutation__
 *
 * To run a mutation, you first call `useUnsaveRecipeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUnsaveRecipeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [unsaveRecipeMutation, { data, loading, error }] = useUnsaveRecipeMutation({
 *   variables: {
 *      recipeId: // value for 'recipeId'
 *   },
 * });
 */
export function useUnsaveRecipeMutation(baseOptions?: Apollo.MutationHookOptions<UnsaveRecipeMutation, UnsaveRecipeMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UnsaveRecipeMutation, UnsaveRecipeMutationVariables>(UnsaveRecipeDocument, options);
      }
export type UnsaveRecipeMutationHookResult = ReturnType<typeof useUnsaveRecipeMutation>;
export type UnsaveRecipeMutationResult = Apollo.MutationResult<UnsaveRecipeMutation>;
export type UnsaveRecipeMutationOptions = Apollo.BaseMutationOptions<UnsaveRecipeMutation, UnsaveRecipeMutationVariables>;
export const IsFavoritedDocument = gql`
    query IsFavorited($recipeId: Int!) {
  isFavorited(recipeId: $recipeId)
}
    `;

/**
 * __useIsFavoritedQuery__
 *
 * To run a query within a React component, call `useIsFavoritedQuery` and pass it any options that fit your needs.
 * When your component renders, `useIsFavoritedQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useIsFavoritedQuery({
 *   variables: {
 *      recipeId: // value for 'recipeId'
 *   },
 * });
 */
export function useIsFavoritedQuery(baseOptions: Apollo.QueryHookOptions<IsFavoritedQuery, IsFavoritedQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<IsFavoritedQuery, IsFavoritedQueryVariables>(IsFavoritedDocument, options);
      }
export function useIsFavoritedLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<IsFavoritedQuery, IsFavoritedQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<IsFavoritedQuery, IsFavoritedQueryVariables>(IsFavoritedDocument, options);
        }
export function useIsFavoritedSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<IsFavoritedQuery, IsFavoritedQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<IsFavoritedQuery, IsFavoritedQueryVariables>(IsFavoritedDocument, options);
        }
export type IsFavoritedQueryHookResult = ReturnType<typeof useIsFavoritedQuery>;
export type IsFavoritedLazyQueryHookResult = ReturnType<typeof useIsFavoritedLazyQuery>;
export type IsFavoritedSuspenseQueryHookResult = ReturnType<typeof useIsFavoritedSuspenseQuery>;
export type IsFavoritedQueryResult = Apollo.QueryResult<IsFavoritedQuery, IsFavoritedQueryVariables>;
export const ForgotPasswordDocument = gql`
    mutation ForgotPassword($email: String!) {
  forgotPassword(email: $email)
}
    `;
export type ForgotPasswordMutationFn = Apollo.MutationFunction<ForgotPasswordMutation, ForgotPasswordMutationVariables>;

/**
 * __useForgotPasswordMutation__
 *
 * To run a mutation, you first call `useForgotPasswordMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useForgotPasswordMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [forgotPasswordMutation, { data, loading, error }] = useForgotPasswordMutation({
 *   variables: {
 *      email: // value for 'email'
 *   },
 * });
 */
export function useForgotPasswordMutation(baseOptions?: Apollo.MutationHookOptions<ForgotPasswordMutation, ForgotPasswordMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ForgotPasswordMutation, ForgotPasswordMutationVariables>(ForgotPasswordDocument, options);
      }
export type ForgotPasswordMutationHookResult = ReturnType<typeof useForgotPasswordMutation>;
export type ForgotPasswordMutationResult = Apollo.MutationResult<ForgotPasswordMutation>;
export type ForgotPasswordMutationOptions = Apollo.BaseMutationOptions<ForgotPasswordMutation, ForgotPasswordMutationVariables>;
export const LoginDocument = gql`
    mutation Login($usernameOrEmail: String!, $password: String!) {
  login(usernameOrEmail: $usernameOrEmail, password: $password) {
    ...RegularUserResponse
  }
}
    ${RegularUserResponseFragmentDoc}`;
export type LoginMutationFn = Apollo.MutationFunction<LoginMutation, LoginMutationVariables>;

/**
 * __useLoginMutation__
 *
 * To run a mutation, you first call `useLoginMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLoginMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [loginMutation, { data, loading, error }] = useLoginMutation({
 *   variables: {
 *      usernameOrEmail: // value for 'usernameOrEmail'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useLoginMutation(baseOptions?: Apollo.MutationHookOptions<LoginMutation, LoginMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument, options);
      }
export type LoginMutationHookResult = ReturnType<typeof useLoginMutation>;
export type LoginMutationResult = Apollo.MutationResult<LoginMutation>;
export type LoginMutationOptions = Apollo.BaseMutationOptions<LoginMutation, LoginMutationVariables>;
export const LogoutDocument = gql`
    mutation Logout {
  logout
}
    `;
export type LogoutMutationFn = Apollo.MutationFunction<LogoutMutation, LogoutMutationVariables>;

/**
 * __useLogoutMutation__
 *
 * To run a mutation, you first call `useLogoutMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLogoutMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [logoutMutation, { data, loading, error }] = useLogoutMutation({
 *   variables: {
 *   },
 * });
 */
export function useLogoutMutation(baseOptions?: Apollo.MutationHookOptions<LogoutMutation, LogoutMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LogoutMutation, LogoutMutationVariables>(LogoutDocument, options);
      }
export type LogoutMutationHookResult = ReturnType<typeof useLogoutMutation>;
export type LogoutMutationResult = Apollo.MutationResult<LogoutMutation>;
export type LogoutMutationOptions = Apollo.BaseMutationOptions<LogoutMutation, LogoutMutationVariables>;
export const CreateMealSchedulerDocument = gql`
    mutation CreateMealScheduler($userId: Float!, $day: DayOfWeek!, $mealType: MealType!, $comment: String!) {
  createMealScheduler(
    userId: $userId
    day: $day
    mealType: $mealType
    comment: $comment
  ) {
    ...RegularMealPlanResponse
  }
}
    ${RegularMealPlanResponseFragmentDoc}`;
export type CreateMealSchedulerMutationFn = Apollo.MutationFunction<CreateMealSchedulerMutation, CreateMealSchedulerMutationVariables>;

/**
 * __useCreateMealSchedulerMutation__
 *
 * To run a mutation, you first call `useCreateMealSchedulerMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateMealSchedulerMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createMealSchedulerMutation, { data, loading, error }] = useCreateMealSchedulerMutation({
 *   variables: {
 *      userId: // value for 'userId'
 *      day: // value for 'day'
 *      mealType: // value for 'mealType'
 *      comment: // value for 'comment'
 *   },
 * });
 */
export function useCreateMealSchedulerMutation(baseOptions?: Apollo.MutationHookOptions<CreateMealSchedulerMutation, CreateMealSchedulerMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateMealSchedulerMutation, CreateMealSchedulerMutationVariables>(CreateMealSchedulerDocument, options);
      }
export type CreateMealSchedulerMutationHookResult = ReturnType<typeof useCreateMealSchedulerMutation>;
export type CreateMealSchedulerMutationResult = Apollo.MutationResult<CreateMealSchedulerMutation>;
export type CreateMealSchedulerMutationOptions = Apollo.BaseMutationOptions<CreateMealSchedulerMutation, CreateMealSchedulerMutationVariables>;
export const DeleteMealSchedulerDocument = gql`
    mutation DeleteMealScheduler($id: Int!) {
  deleteMealScheduler(id: $id) {
    ...RegularMealPlanResponse
  }
}
    ${RegularMealPlanResponseFragmentDoc}`;
export type DeleteMealSchedulerMutationFn = Apollo.MutationFunction<DeleteMealSchedulerMutation, DeleteMealSchedulerMutationVariables>;

/**
 * __useDeleteMealSchedulerMutation__
 *
 * To run a mutation, you first call `useDeleteMealSchedulerMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteMealSchedulerMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteMealSchedulerMutation, { data, loading, error }] = useDeleteMealSchedulerMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteMealSchedulerMutation(baseOptions?: Apollo.MutationHookOptions<DeleteMealSchedulerMutation, DeleteMealSchedulerMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteMealSchedulerMutation, DeleteMealSchedulerMutationVariables>(DeleteMealSchedulerDocument, options);
      }
export type DeleteMealSchedulerMutationHookResult = ReturnType<typeof useDeleteMealSchedulerMutation>;
export type DeleteMealSchedulerMutationResult = Apollo.MutationResult<DeleteMealSchedulerMutation>;
export type DeleteMealSchedulerMutationOptions = Apollo.BaseMutationOptions<DeleteMealSchedulerMutation, DeleteMealSchedulerMutationVariables>;
export const DeleteRecipeRatingDocument = gql`
    mutation DeleteRecipeRating($recipeId: Int!) {
  deleteRecipeRating(recipeId: $recipeId)
}
    `;
export type DeleteRecipeRatingMutationFn = Apollo.MutationFunction<DeleteRecipeRatingMutation, DeleteRecipeRatingMutationVariables>;

/**
 * __useDeleteRecipeRatingMutation__
 *
 * To run a mutation, you first call `useDeleteRecipeRatingMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteRecipeRatingMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteRecipeRatingMutation, { data, loading, error }] = useDeleteRecipeRatingMutation({
 *   variables: {
 *      recipeId: // value for 'recipeId'
 *   },
 * });
 */
export function useDeleteRecipeRatingMutation(baseOptions?: Apollo.MutationHookOptions<DeleteRecipeRatingMutation, DeleteRecipeRatingMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteRecipeRatingMutation, DeleteRecipeRatingMutationVariables>(DeleteRecipeRatingDocument, options);
      }
export type DeleteRecipeRatingMutationHookResult = ReturnType<typeof useDeleteRecipeRatingMutation>;
export type DeleteRecipeRatingMutationResult = Apollo.MutationResult<DeleteRecipeRatingMutation>;
export type DeleteRecipeRatingMutationOptions = Apollo.BaseMutationOptions<DeleteRecipeRatingMutation, DeleteRecipeRatingMutationVariables>;
export const RegisterDocument = gql`
    mutation Register($options: RegisterUserInput!) {
  register(options: $options) {
    ...RegularUserResponse
  }
}
    ${RegularUserResponseFragmentDoc}`;
export type RegisterMutationFn = Apollo.MutationFunction<RegisterMutation, RegisterMutationVariables>;

/**
 * __useRegisterMutation__
 *
 * To run a mutation, you first call `useRegisterMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRegisterMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [registerMutation, { data, loading, error }] = useRegisterMutation({
 *   variables: {
 *      options: // value for 'options'
 *   },
 * });
 */
export function useRegisterMutation(baseOptions?: Apollo.MutationHookOptions<RegisterMutation, RegisterMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RegisterMutation, RegisterMutationVariables>(RegisterDocument, options);
      }
export type RegisterMutationHookResult = ReturnType<typeof useRegisterMutation>;
export type RegisterMutationResult = Apollo.MutationResult<RegisterMutation>;
export type RegisterMutationOptions = Apollo.BaseMutationOptions<RegisterMutation, RegisterMutationVariables>;
export const SendMessageDocument = gql`
    mutation SendMessage($conversationId: Int!, $body: String!) {
  sendMessage(conversationId: $conversationId, body: $body) {
    errors {
      ...RegualarError
    }
    message {
      ...RegularMessage
      sender {
        id
        username
      }
    }
  }
}
    ${RegualarErrorFragmentDoc}
${RegularMessageFragmentDoc}`;
export type SendMessageMutationFn = Apollo.MutationFunction<SendMessageMutation, SendMessageMutationVariables>;

/**
 * __useSendMessageMutation__
 *
 * To run a mutation, you first call `useSendMessageMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSendMessageMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [sendMessageMutation, { data, loading, error }] = useSendMessageMutation({
 *   variables: {
 *      conversationId: // value for 'conversationId'
 *      body: // value for 'body'
 *   },
 * });
 */
export function useSendMessageMutation(baseOptions?: Apollo.MutationHookOptions<SendMessageMutation, SendMessageMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SendMessageMutation, SendMessageMutationVariables>(SendMessageDocument, options);
      }
export type SendMessageMutationHookResult = ReturnType<typeof useSendMessageMutation>;
export type SendMessageMutationResult = Apollo.MutationResult<SendMessageMutation>;
export type SendMessageMutationOptions = Apollo.BaseMutationOptions<SendMessageMutation, SendMessageMutationVariables>;
export const StartConversationDocument = gql`
    mutation StartConversation($participantId: Int!) {
  startConversation(participantId: $participantId) {
    errors {
      ...RegualarError
    }
    conversation {
      ...ConversationWithParticipants
    }
  }
}
    ${RegualarErrorFragmentDoc}
${ConversationWithParticipantsFragmentDoc}`;
export type StartConversationMutationFn = Apollo.MutationFunction<StartConversationMutation, StartConversationMutationVariables>;

/**
 * __useStartConversationMutation__
 *
 * To run a mutation, you first call `useStartConversationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useStartConversationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [startConversationMutation, { data, loading, error }] = useStartConversationMutation({
 *   variables: {
 *      participantId: // value for 'participantId'
 *   },
 * });
 */
export function useStartConversationMutation(baseOptions?: Apollo.MutationHookOptions<StartConversationMutation, StartConversationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<StartConversationMutation, StartConversationMutationVariables>(StartConversationDocument, options);
      }
export type StartConversationMutationHookResult = ReturnType<typeof useStartConversationMutation>;
export type StartConversationMutationResult = Apollo.MutationResult<StartConversationMutation>;
export type StartConversationMutationOptions = Apollo.BaseMutationOptions<StartConversationMutation, StartConversationMutationVariables>;
export const UpdateChefProfileDocument = gql`
    mutation UpdateChefProfile($data: UpdateChefProfileInput!) {
  updateChefProfile(data: $data) {
    ...RegularChefProfileResponse
  }
}
    ${RegularChefProfileResponseFragmentDoc}`;
export type UpdateChefProfileMutationFn = Apollo.MutationFunction<UpdateChefProfileMutation, UpdateChefProfileMutationVariables>;

/**
 * __useUpdateChefProfileMutation__
 *
 * To run a mutation, you first call `useUpdateChefProfileMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateChefProfileMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateChefProfileMutation, { data, loading, error }] = useUpdateChefProfileMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useUpdateChefProfileMutation(baseOptions?: Apollo.MutationHookOptions<UpdateChefProfileMutation, UpdateChefProfileMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateChefProfileMutation, UpdateChefProfileMutationVariables>(UpdateChefProfileDocument, options);
      }
export type UpdateChefProfileMutationHookResult = ReturnType<typeof useUpdateChefProfileMutation>;
export type UpdateChefProfileMutationResult = Apollo.MutationResult<UpdateChefProfileMutation>;
export type UpdateChefProfileMutationOptions = Apollo.BaseMutationOptions<UpdateChefProfileMutation, UpdateChefProfileMutationVariables>;
export const UpdateNutritionistProfileDocument = gql`
    mutation UpdateNutritionistProfile($data: UpdateNutritionistProfileInput!) {
  updateNutritionistProfile(data: $data) {
    ...RegularNutritionistProfileResponse
  }
}
    ${RegularNutritionistProfileResponseFragmentDoc}`;
export type UpdateNutritionistProfileMutationFn = Apollo.MutationFunction<UpdateNutritionistProfileMutation, UpdateNutritionistProfileMutationVariables>;

/**
 * __useUpdateNutritionistProfileMutation__
 *
 * To run a mutation, you first call `useUpdateNutritionistProfileMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateNutritionistProfileMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateNutritionistProfileMutation, { data, loading, error }] = useUpdateNutritionistProfileMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useUpdateNutritionistProfileMutation(baseOptions?: Apollo.MutationHookOptions<UpdateNutritionistProfileMutation, UpdateNutritionistProfileMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateNutritionistProfileMutation, UpdateNutritionistProfileMutationVariables>(UpdateNutritionistProfileDocument, options);
      }
export type UpdateNutritionistProfileMutationHookResult = ReturnType<typeof useUpdateNutritionistProfileMutation>;
export type UpdateNutritionistProfileMutationResult = Apollo.MutationResult<UpdateNutritionistProfileMutation>;
export type UpdateNutritionistProfileMutationOptions = Apollo.BaseMutationOptions<UpdateNutritionistProfileMutation, UpdateNutritionistProfileMutationVariables>;
export const UpdateUserDocument = gql`
    mutation UpdateUser($data: UpdateUserInput!) {
  updateUser(data: $data) {
    ...RegularUserResponse
  }
}
    ${RegularUserResponseFragmentDoc}`;
export type UpdateUserMutationFn = Apollo.MutationFunction<UpdateUserMutation, UpdateUserMutationVariables>;

/**
 * __useUpdateUserMutation__
 *
 * To run a mutation, you first call `useUpdateUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateUserMutation, { data, loading, error }] = useUpdateUserMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useUpdateUserMutation(baseOptions?: Apollo.MutationHookOptions<UpdateUserMutation, UpdateUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateUserMutation, UpdateUserMutationVariables>(UpdateUserDocument, options);
      }
export type UpdateUserMutationHookResult = ReturnType<typeof useUpdateUserMutation>;
export type UpdateUserMutationResult = Apollo.MutationResult<UpdateUserMutation>;
export type UpdateUserMutationOptions = Apollo.BaseMutationOptions<UpdateUserMutation, UpdateUserMutationVariables>;
export const MyArticlesDocument = gql`
    query MyArticles($limit: Int = 20, $offset: Int = 0) {
  myArticles(limit: $limit, offset: $offset) {
    id
    title_el
    title_en
    image
    createdAt
  }
}
    `;

/**
 * __useMyArticlesQuery__
 *
 * To run a query within a React component, call `useMyArticlesQuery` and pass it any options that fit your needs.
 * When your component renders, `useMyArticlesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMyArticlesQuery({
 *   variables: {
 *      limit: // value for 'limit'
 *      offset: // value for 'offset'
 *   },
 * });
 */
export function useMyArticlesQuery(baseOptions?: Apollo.QueryHookOptions<MyArticlesQuery, MyArticlesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MyArticlesQuery, MyArticlesQueryVariables>(MyArticlesDocument, options);
      }
export function useMyArticlesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MyArticlesQuery, MyArticlesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MyArticlesQuery, MyArticlesQueryVariables>(MyArticlesDocument, options);
        }
export function useMyArticlesSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<MyArticlesQuery, MyArticlesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<MyArticlesQuery, MyArticlesQueryVariables>(MyArticlesDocument, options);
        }
export type MyArticlesQueryHookResult = ReturnType<typeof useMyArticlesQuery>;
export type MyArticlesLazyQueryHookResult = ReturnType<typeof useMyArticlesLazyQuery>;
export type MyArticlesSuspenseQueryHookResult = ReturnType<typeof useMyArticlesSuspenseQuery>;
export type MyArticlesQueryResult = Apollo.QueryResult<MyArticlesQuery, MyArticlesQueryVariables>;
export const MyMealPlanDocument = gql`
    query MyMealPlan {
  myMealPlan {
    ...MealSchedulerWithNutritionist
  }
}
    ${MealSchedulerWithNutritionistFragmentDoc}`;

/**
 * __useMyMealPlanQuery__
 *
 * To run a query within a React component, call `useMyMealPlanQuery` and pass it any options that fit your needs.
 * When your component renders, `useMyMealPlanQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMyMealPlanQuery({
 *   variables: {
 *   },
 * });
 */
export function useMyMealPlanQuery(baseOptions?: Apollo.QueryHookOptions<MyMealPlanQuery, MyMealPlanQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MyMealPlanQuery, MyMealPlanQueryVariables>(MyMealPlanDocument, options);
      }
export function useMyMealPlanLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MyMealPlanQuery, MyMealPlanQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MyMealPlanQuery, MyMealPlanQueryVariables>(MyMealPlanDocument, options);
        }
export function useMyMealPlanSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<MyMealPlanQuery, MyMealPlanQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<MyMealPlanQuery, MyMealPlanQueryVariables>(MyMealPlanDocument, options);
        }
export type MyMealPlanQueryHookResult = ReturnType<typeof useMyMealPlanQuery>;
export type MyMealPlanLazyQueryHookResult = ReturnType<typeof useMyMealPlanLazyQuery>;
export type MyMealPlanSuspenseQueryHookResult = ReturnType<typeof useMyMealPlanSuspenseQuery>;
export type MyMealPlanQueryResult = Apollo.QueryResult<MyMealPlanQuery, MyMealPlanQueryVariables>;
export const GetMyAppointmentsDocument = gql`
    query GetMyAppointments($date: String, $limit: Int = 20, $offset: Int = 0) {
  getMyAppointments(date: $date, limit: $limit, offset: $offset) {
    ...RegularAppointment
  }
}
    ${RegularAppointmentFragmentDoc}`;

/**
 * __useGetMyAppointmentsQuery__
 *
 * To run a query within a React component, call `useGetMyAppointmentsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetMyAppointmentsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMyAppointmentsQuery({
 *   variables: {
 *      date: // value for 'date'
 *      limit: // value for 'limit'
 *      offset: // value for 'offset'
 *   },
 * });
 */
export function useGetMyAppointmentsQuery(baseOptions?: Apollo.QueryHookOptions<GetMyAppointmentsQuery, GetMyAppointmentsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetMyAppointmentsQuery, GetMyAppointmentsQueryVariables>(GetMyAppointmentsDocument, options);
      }
export function useGetMyAppointmentsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetMyAppointmentsQuery, GetMyAppointmentsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetMyAppointmentsQuery, GetMyAppointmentsQueryVariables>(GetMyAppointmentsDocument, options);
        }
export function useGetMyAppointmentsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetMyAppointmentsQuery, GetMyAppointmentsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetMyAppointmentsQuery, GetMyAppointmentsQueryVariables>(GetMyAppointmentsDocument, options);
        }
export type GetMyAppointmentsQueryHookResult = ReturnType<typeof useGetMyAppointmentsQuery>;
export type GetMyAppointmentsLazyQueryHookResult = ReturnType<typeof useGetMyAppointmentsLazyQuery>;
export type GetMyAppointmentsSuspenseQueryHookResult = ReturnType<typeof useGetMyAppointmentsSuspenseQuery>;
export type GetMyAppointmentsQueryResult = Apollo.QueryResult<GetMyAppointmentsQuery, GetMyAppointmentsQueryVariables>;
export const AvailableSlotsDocument = gql`
    query AvailableSlots($nutritionistId: Int!) {
  availableSlots(nutritionistId: $nutritionistId) {
    ...RegularAppointment
  }
}
    ${RegularAppointmentFragmentDoc}`;

/**
 * __useAvailableSlotsQuery__
 *
 * To run a query within a React component, call `useAvailableSlotsQuery` and pass it any options that fit your needs.
 * When your component renders, `useAvailableSlotsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAvailableSlotsQuery({
 *   variables: {
 *      nutritionistId: // value for 'nutritionistId'
 *   },
 * });
 */
export function useAvailableSlotsQuery(baseOptions: Apollo.QueryHookOptions<AvailableSlotsQuery, AvailableSlotsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<AvailableSlotsQuery, AvailableSlotsQueryVariables>(AvailableSlotsDocument, options);
      }
export function useAvailableSlotsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<AvailableSlotsQuery, AvailableSlotsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<AvailableSlotsQuery, AvailableSlotsQueryVariables>(AvailableSlotsDocument, options);
        }
export function useAvailableSlotsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<AvailableSlotsQuery, AvailableSlotsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<AvailableSlotsQuery, AvailableSlotsQueryVariables>(AvailableSlotsDocument, options);
        }
export type AvailableSlotsQueryHookResult = ReturnType<typeof useAvailableSlotsQuery>;
export type AvailableSlotsLazyQueryHookResult = ReturnType<typeof useAvailableSlotsLazyQuery>;
export type AvailableSlotsSuspenseQueryHookResult = ReturnType<typeof useAvailableSlotsSuspenseQuery>;
export type AvailableSlotsQueryResult = Apollo.QueryResult<AvailableSlotsQuery, AvailableSlotsQueryVariables>;
export const GetAppointmentRequestsForNutritionistDocument = gql`
    query GetAppointmentRequestsForNutritionist($limit: Int = 20, $offset: Int = 0) {
  getAppointmentRequestsForNutritionist(limit: $limit, offset: $offset) {
    ...RegularAppointmentRequest
    slot {
      id
      date
      time
    }
    client {
      id
      username
      image
    }
  }
}
    ${RegularAppointmentRequestFragmentDoc}`;

/**
 * __useGetAppointmentRequestsForNutritionistQuery__
 *
 * To run a query within a React component, call `useGetAppointmentRequestsForNutritionistQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAppointmentRequestsForNutritionistQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAppointmentRequestsForNutritionistQuery({
 *   variables: {
 *      limit: // value for 'limit'
 *      offset: // value for 'offset'
 *   },
 * });
 */
export function useGetAppointmentRequestsForNutritionistQuery(baseOptions?: Apollo.QueryHookOptions<GetAppointmentRequestsForNutritionistQuery, GetAppointmentRequestsForNutritionistQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAppointmentRequestsForNutritionistQuery, GetAppointmentRequestsForNutritionistQueryVariables>(GetAppointmentRequestsForNutritionistDocument, options);
      }
export function useGetAppointmentRequestsForNutritionistLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAppointmentRequestsForNutritionistQuery, GetAppointmentRequestsForNutritionistQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAppointmentRequestsForNutritionistQuery, GetAppointmentRequestsForNutritionistQueryVariables>(GetAppointmentRequestsForNutritionistDocument, options);
        }
export function useGetAppointmentRequestsForNutritionistSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetAppointmentRequestsForNutritionistQuery, GetAppointmentRequestsForNutritionistQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetAppointmentRequestsForNutritionistQuery, GetAppointmentRequestsForNutritionistQueryVariables>(GetAppointmentRequestsForNutritionistDocument, options);
        }
export type GetAppointmentRequestsForNutritionistQueryHookResult = ReturnType<typeof useGetAppointmentRequestsForNutritionistQuery>;
export type GetAppointmentRequestsForNutritionistLazyQueryHookResult = ReturnType<typeof useGetAppointmentRequestsForNutritionistLazyQuery>;
export type GetAppointmentRequestsForNutritionistSuspenseQueryHookResult = ReturnType<typeof useGetAppointmentRequestsForNutritionistSuspenseQuery>;
export type GetAppointmentRequestsForNutritionistQueryResult = Apollo.QueryResult<GetAppointmentRequestsForNutritionistQuery, GetAppointmentRequestsForNutritionistQueryVariables>;
export const MyAppointmentRequestsDocument = gql`
    query MyAppointmentRequests {
  myAppointmentRequests {
    id
    status
    slot {
      id
      nutritionistId
    }
  }
}
    `;

/**
 * __useMyAppointmentRequestsQuery__
 *
 * To run a query within a React component, call `useMyAppointmentRequestsQuery` and pass it any options that fit your needs.
 * When your component renders, `useMyAppointmentRequestsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMyAppointmentRequestsQuery({
 *   variables: {
 *   },
 * });
 */
export function useMyAppointmentRequestsQuery(baseOptions?: Apollo.QueryHookOptions<MyAppointmentRequestsQuery, MyAppointmentRequestsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MyAppointmentRequestsQuery, MyAppointmentRequestsQueryVariables>(MyAppointmentRequestsDocument, options);
      }
export function useMyAppointmentRequestsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MyAppointmentRequestsQuery, MyAppointmentRequestsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MyAppointmentRequestsQuery, MyAppointmentRequestsQueryVariables>(MyAppointmentRequestsDocument, options);
        }
export function useMyAppointmentRequestsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<MyAppointmentRequestsQuery, MyAppointmentRequestsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<MyAppointmentRequestsQuery, MyAppointmentRequestsQueryVariables>(MyAppointmentRequestsDocument, options);
        }
export type MyAppointmentRequestsQueryHookResult = ReturnType<typeof useMyAppointmentRequestsQuery>;
export type MyAppointmentRequestsLazyQueryHookResult = ReturnType<typeof useMyAppointmentRequestsLazyQuery>;
export type MyAppointmentRequestsSuspenseQueryHookResult = ReturnType<typeof useMyAppointmentRequestsSuspenseQuery>;
export type MyAppointmentRequestsQueryResult = Apollo.QueryResult<MyAppointmentRequestsQuery, MyAppointmentRequestsQueryVariables>;
export const ArticleDocument = gql`
    query Article($id: Int!) {
  article(id: $id) {
    ...RegularArticle
  }
}
    ${RegularArticleFragmentDoc}`;

/**
 * __useArticleQuery__
 *
 * To run a query within a React component, call `useArticleQuery` and pass it any options that fit your needs.
 * When your component renders, `useArticleQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useArticleQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useArticleQuery(baseOptions: Apollo.QueryHookOptions<ArticleQuery, ArticleQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ArticleQuery, ArticleQueryVariables>(ArticleDocument, options);
      }
export function useArticleLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ArticleQuery, ArticleQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ArticleQuery, ArticleQueryVariables>(ArticleDocument, options);
        }
export function useArticleSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<ArticleQuery, ArticleQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<ArticleQuery, ArticleQueryVariables>(ArticleDocument, options);
        }
export type ArticleQueryHookResult = ReturnType<typeof useArticleQuery>;
export type ArticleLazyQueryHookResult = ReturnType<typeof useArticleLazyQuery>;
export type ArticleSuspenseQueryHookResult = ReturnType<typeof useArticleSuspenseQuery>;
export type ArticleQueryResult = Apollo.QueryResult<ArticleQuery, ArticleQueryVariables>;
export const ArticlesDocument = gql`
    query Articles($limit: Int = 10, $offset: Int = 0) {
  articles(limit: $limit, offset: $offset) {
    ...RegularArticle
  }
}
    ${RegularArticleFragmentDoc}`;

/**
 * __useArticlesQuery__
 *
 * To run a query within a React component, call `useArticlesQuery` and pass it any options that fit your needs.
 * When your component renders, `useArticlesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useArticlesQuery({
 *   variables: {
 *      limit: // value for 'limit'
 *      offset: // value for 'offset'
 *   },
 * });
 */
export function useArticlesQuery(baseOptions?: Apollo.QueryHookOptions<ArticlesQuery, ArticlesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ArticlesQuery, ArticlesQueryVariables>(ArticlesDocument, options);
      }
export function useArticlesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ArticlesQuery, ArticlesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ArticlesQuery, ArticlesQueryVariables>(ArticlesDocument, options);
        }
export function useArticlesSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<ArticlesQuery, ArticlesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<ArticlesQuery, ArticlesQueryVariables>(ArticlesDocument, options);
        }
export type ArticlesQueryHookResult = ReturnType<typeof useArticlesQuery>;
export type ArticlesLazyQueryHookResult = ReturnType<typeof useArticlesLazyQuery>;
export type ArticlesSuspenseQueryHookResult = ReturnType<typeof useArticlesSuspenseQuery>;
export type ArticlesQueryResult = Apollo.QueryResult<ArticlesQuery, ArticlesQueryVariables>;
export const ArticlesByChefDocument = gql`
    query ArticlesByChef($chefId: Int!, $limit: Int = 10, $offset: Int = 0) {
  articlesByChef(chefId: $chefId, limit: $limit, offset: $offset) {
    ...RegularArticle
  }
}
    ${RegularArticleFragmentDoc}`;

/**
 * __useArticlesByChefQuery__
 *
 * To run a query within a React component, call `useArticlesByChefQuery` and pass it any options that fit your needs.
 * When your component renders, `useArticlesByChefQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useArticlesByChefQuery({
 *   variables: {
 *      chefId: // value for 'chefId'
 *      limit: // value for 'limit'
 *      offset: // value for 'offset'
 *   },
 * });
 */
export function useArticlesByChefQuery(baseOptions: Apollo.QueryHookOptions<ArticlesByChefQuery, ArticlesByChefQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ArticlesByChefQuery, ArticlesByChefQueryVariables>(ArticlesByChefDocument, options);
      }
export function useArticlesByChefLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ArticlesByChefQuery, ArticlesByChefQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ArticlesByChefQuery, ArticlesByChefQueryVariables>(ArticlesByChefDocument, options);
        }
export function useArticlesByChefSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<ArticlesByChefQuery, ArticlesByChefQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<ArticlesByChefQuery, ArticlesByChefQueryVariables>(ArticlesByChefDocument, options);
        }
export type ArticlesByChefQueryHookResult = ReturnType<typeof useArticlesByChefQuery>;
export type ArticlesByChefLazyQueryHookResult = ReturnType<typeof useArticlesByChefLazyQuery>;
export type ArticlesByChefSuspenseQueryHookResult = ReturnType<typeof useArticlesByChefSuspenseQuery>;
export type ArticlesByChefQueryResult = Apollo.QueryResult<ArticlesByChefQuery, ArticlesByChefQueryVariables>;
export const ChefDocument = gql`
    query Chef($id: Int!) {
  chef(id: $id) {
    id
    bio
    user {
      id
      username
      image
    }
    recipes {
      id
      title_el
      title_en
      recipeImage
      difficulty
    }
  }
}
    `;

/**
 * __useChefQuery__
 *
 * To run a query within a React component, call `useChefQuery` and pass it any options that fit your needs.
 * When your component renders, `useChefQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useChefQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useChefQuery(baseOptions: Apollo.QueryHookOptions<ChefQuery, ChefQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ChefQuery, ChefQueryVariables>(ChefDocument, options);
      }
export function useChefLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ChefQuery, ChefQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ChefQuery, ChefQueryVariables>(ChefDocument, options);
        }
export function useChefSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<ChefQuery, ChefQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<ChefQuery, ChefQueryVariables>(ChefDocument, options);
        }
export type ChefQueryHookResult = ReturnType<typeof useChefQuery>;
export type ChefLazyQueryHookResult = ReturnType<typeof useChefLazyQuery>;
export type ChefSuspenseQueryHookResult = ReturnType<typeof useChefSuspenseQuery>;
export type ChefQueryResult = Apollo.QueryResult<ChefQuery, ChefQueryVariables>;
export const ChefRatingsDocument = gql`
    query ChefRatings($chefId: Int!, $limit: Int = 10, $offset: Int = 0) {
  chefRatings(chefId: $chefId, limit: $limit, offset: $offset) {
    ...RegularChefRating
  }
}
    ${RegularChefRatingFragmentDoc}`;

/**
 * __useChefRatingsQuery__
 *
 * To run a query within a React component, call `useChefRatingsQuery` and pass it any options that fit your needs.
 * When your component renders, `useChefRatingsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useChefRatingsQuery({
 *   variables: {
 *      chefId: // value for 'chefId'
 *      limit: // value for 'limit'
 *      offset: // value for 'offset'
 *   },
 * });
 */
export function useChefRatingsQuery(baseOptions: Apollo.QueryHookOptions<ChefRatingsQuery, ChefRatingsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ChefRatingsQuery, ChefRatingsQueryVariables>(ChefRatingsDocument, options);
      }
export function useChefRatingsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ChefRatingsQuery, ChefRatingsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ChefRatingsQuery, ChefRatingsQueryVariables>(ChefRatingsDocument, options);
        }
export function useChefRatingsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<ChefRatingsQuery, ChefRatingsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<ChefRatingsQuery, ChefRatingsQueryVariables>(ChefRatingsDocument, options);
        }
export type ChefRatingsQueryHookResult = ReturnType<typeof useChefRatingsQuery>;
export type ChefRatingsLazyQueryHookResult = ReturnType<typeof useChefRatingsLazyQuery>;
export type ChefRatingsSuspenseQueryHookResult = ReturnType<typeof useChefRatingsSuspenseQuery>;
export type ChefRatingsQueryResult = Apollo.QueryResult<ChefRatingsQuery, ChefRatingsQueryVariables>;
export const ChefAverageRatingDocument = gql`
    query ChefAverageRating($chefId: Int!) {
  chefAverageRating(chefId: $chefId)
}
    `;

/**
 * __useChefAverageRatingQuery__
 *
 * To run a query within a React component, call `useChefAverageRatingQuery` and pass it any options that fit your needs.
 * When your component renders, `useChefAverageRatingQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useChefAverageRatingQuery({
 *   variables: {
 *      chefId: // value for 'chefId'
 *   },
 * });
 */
export function useChefAverageRatingQuery(baseOptions: Apollo.QueryHookOptions<ChefAverageRatingQuery, ChefAverageRatingQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ChefAverageRatingQuery, ChefAverageRatingQueryVariables>(ChefAverageRatingDocument, options);
      }
export function useChefAverageRatingLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ChefAverageRatingQuery, ChefAverageRatingQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ChefAverageRatingQuery, ChefAverageRatingQueryVariables>(ChefAverageRatingDocument, options);
        }
export function useChefAverageRatingSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<ChefAverageRatingQuery, ChefAverageRatingQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<ChefAverageRatingQuery, ChefAverageRatingQueryVariables>(ChefAverageRatingDocument, options);
        }
export type ChefAverageRatingQueryHookResult = ReturnType<typeof useChefAverageRatingQuery>;
export type ChefAverageRatingLazyQueryHookResult = ReturnType<typeof useChefAverageRatingLazyQuery>;
export type ChefAverageRatingSuspenseQueryHookResult = ReturnType<typeof useChefAverageRatingSuspenseQuery>;
export type ChefAverageRatingQueryResult = Apollo.QueryResult<ChefAverageRatingQuery, ChefAverageRatingQueryVariables>;
export const MyChefRatingDocument = gql`
    query MyChefRating($chefId: Int!) {
  myChefRating(chefId: $chefId) {
    ...RegularChefRating
  }
}
    ${RegularChefRatingFragmentDoc}`;

/**
 * __useMyChefRatingQuery__
 *
 * To run a query within a React component, call `useMyChefRatingQuery` and pass it any options that fit your needs.
 * When your component renders, `useMyChefRatingQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMyChefRatingQuery({
 *   variables: {
 *      chefId: // value for 'chefId'
 *   },
 * });
 */
export function useMyChefRatingQuery(baseOptions: Apollo.QueryHookOptions<MyChefRatingQuery, MyChefRatingQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MyChefRatingQuery, MyChefRatingQueryVariables>(MyChefRatingDocument, options);
      }
export function useMyChefRatingLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MyChefRatingQuery, MyChefRatingQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MyChefRatingQuery, MyChefRatingQueryVariables>(MyChefRatingDocument, options);
        }
export function useMyChefRatingSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<MyChefRatingQuery, MyChefRatingQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<MyChefRatingQuery, MyChefRatingQueryVariables>(MyChefRatingDocument, options);
        }
export type MyChefRatingQueryHookResult = ReturnType<typeof useMyChefRatingQuery>;
export type MyChefRatingLazyQueryHookResult = ReturnType<typeof useMyChefRatingLazyQuery>;
export type MyChefRatingSuspenseQueryHookResult = ReturnType<typeof useMyChefRatingSuspenseQuery>;
export type MyChefRatingQueryResult = Apollo.QueryResult<MyChefRatingQuery, MyChefRatingQueryVariables>;
export const ConversationDocument = gql`
    query Conversation($id: Int!) {
  conversation(id: $id) {
    ...ConversationWithMessages
  }
}
    ${ConversationWithMessagesFragmentDoc}`;

/**
 * __useConversationQuery__
 *
 * To run a query within a React component, call `useConversationQuery` and pass it any options that fit your needs.
 * When your component renders, `useConversationQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useConversationQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useConversationQuery(baseOptions: Apollo.QueryHookOptions<ConversationQuery, ConversationQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ConversationQuery, ConversationQueryVariables>(ConversationDocument, options);
      }
export function useConversationLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ConversationQuery, ConversationQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ConversationQuery, ConversationQueryVariables>(ConversationDocument, options);
        }
export function useConversationSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<ConversationQuery, ConversationQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<ConversationQuery, ConversationQueryVariables>(ConversationDocument, options);
        }
export type ConversationQueryHookResult = ReturnType<typeof useConversationQuery>;
export type ConversationLazyQueryHookResult = ReturnType<typeof useConversationLazyQuery>;
export type ConversationSuspenseQueryHookResult = ReturnType<typeof useConversationSuspenseQuery>;
export type ConversationQueryResult = Apollo.QueryResult<ConversationQuery, ConversationQueryVariables>;
export const IngredientsDocument = gql`
    query Ingredients {
  ingredients {
    id
    name_el
    name_en
    caloriesPer100g
    category {
      id
      name_el
      name_en
    }
  }
}
    `;

/**
 * __useIngredientsQuery__
 *
 * To run a query within a React component, call `useIngredientsQuery` and pass it any options that fit your needs.
 * When your component renders, `useIngredientsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useIngredientsQuery({
 *   variables: {
 *   },
 * });
 */
export function useIngredientsQuery(baseOptions?: Apollo.QueryHookOptions<IngredientsQuery, IngredientsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<IngredientsQuery, IngredientsQueryVariables>(IngredientsDocument, options);
      }
export function useIngredientsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<IngredientsQuery, IngredientsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<IngredientsQuery, IngredientsQueryVariables>(IngredientsDocument, options);
        }
export function useIngredientsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<IngredientsQuery, IngredientsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<IngredientsQuery, IngredientsQueryVariables>(IngredientsDocument, options);
        }
export type IngredientsQueryHookResult = ReturnType<typeof useIngredientsQuery>;
export type IngredientsLazyQueryHookResult = ReturnType<typeof useIngredientsLazyQuery>;
export type IngredientsSuspenseQueryHookResult = ReturnType<typeof useIngredientsSuspenseQuery>;
export type IngredientsQueryResult = Apollo.QueryResult<IngredientsQuery, IngredientsQueryVariables>;
export const UtensilsDocument = gql`
    query Utensils {
  utensils {
    id
    name_el
    name_en
    category_el
    category_en
  }
}
    `;

/**
 * __useUtensilsQuery__
 *
 * To run a query within a React component, call `useUtensilsQuery` and pass it any options that fit your needs.
 * When your component renders, `useUtensilsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUtensilsQuery({
 *   variables: {
 *   },
 * });
 */
export function useUtensilsQuery(baseOptions?: Apollo.QueryHookOptions<UtensilsQuery, UtensilsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<UtensilsQuery, UtensilsQueryVariables>(UtensilsDocument, options);
      }
export function useUtensilsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<UtensilsQuery, UtensilsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<UtensilsQuery, UtensilsQueryVariables>(UtensilsDocument, options);
        }
export function useUtensilsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<UtensilsQuery, UtensilsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<UtensilsQuery, UtensilsQueryVariables>(UtensilsDocument, options);
        }
export type UtensilsQueryHookResult = ReturnType<typeof useUtensilsQuery>;
export type UtensilsLazyQueryHookResult = ReturnType<typeof useUtensilsLazyQuery>;
export type UtensilsSuspenseQueryHookResult = ReturnType<typeof useUtensilsSuspenseQuery>;
export type UtensilsQueryResult = Apollo.QueryResult<UtensilsQuery, UtensilsQueryVariables>;
export const MeDocument = gql`
    query Me {
  me {
    ...RegularUser
  }
}
    ${RegularUserFragmentDoc}`;

/**
 * __useMeQuery__
 *
 * To run a query within a React component, call `useMeQuery` and pass it any options that fit your needs.
 * When your component renders, `useMeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMeQuery({
 *   variables: {
 *   },
 * });
 */
export function useMeQuery(baseOptions?: Apollo.QueryHookOptions<MeQuery, MeQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MeQuery, MeQueryVariables>(MeDocument, options);
      }
export function useMeLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MeQuery, MeQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MeQuery, MeQueryVariables>(MeDocument, options);
        }
export function useMeSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<MeQuery, MeQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<MeQuery, MeQueryVariables>(MeDocument, options);
        }
export type MeQueryHookResult = ReturnType<typeof useMeQuery>;
export type MeLazyQueryHookResult = ReturnType<typeof useMeLazyQuery>;
export type MeSuspenseQueryHookResult = ReturnType<typeof useMeSuspenseQuery>;
export type MeQueryResult = Apollo.QueryResult<MeQuery, MeQueryVariables>;
export const GetNutritionistMealPlansDocument = gql`
    query GetNutritionistMealPlans($limit: Int = 20, $offset: Int = 0) {
  getNutritionistMealPlans(limit: $limit, offset: $offset) {
    ...RegularMealScheduler
  }
}
    ${RegularMealSchedulerFragmentDoc}`;

/**
 * __useGetNutritionistMealPlansQuery__
 *
 * To run a query within a React component, call `useGetNutritionistMealPlansQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetNutritionistMealPlansQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetNutritionistMealPlansQuery({
 *   variables: {
 *      limit: // value for 'limit'
 *      offset: // value for 'offset'
 *   },
 * });
 */
export function useGetNutritionistMealPlansQuery(baseOptions?: Apollo.QueryHookOptions<GetNutritionistMealPlansQuery, GetNutritionistMealPlansQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetNutritionistMealPlansQuery, GetNutritionistMealPlansQueryVariables>(GetNutritionistMealPlansDocument, options);
      }
export function useGetNutritionistMealPlansLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetNutritionistMealPlansQuery, GetNutritionistMealPlansQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetNutritionistMealPlansQuery, GetNutritionistMealPlansQueryVariables>(GetNutritionistMealPlansDocument, options);
        }
export function useGetNutritionistMealPlansSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetNutritionistMealPlansQuery, GetNutritionistMealPlansQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetNutritionistMealPlansQuery, GetNutritionistMealPlansQueryVariables>(GetNutritionistMealPlansDocument, options);
        }
export type GetNutritionistMealPlansQueryHookResult = ReturnType<typeof useGetNutritionistMealPlansQuery>;
export type GetNutritionistMealPlansLazyQueryHookResult = ReturnType<typeof useGetNutritionistMealPlansLazyQuery>;
export type GetNutritionistMealPlansSuspenseQueryHookResult = ReturnType<typeof useGetNutritionistMealPlansSuspenseQuery>;
export type GetNutritionistMealPlansQueryResult = Apollo.QueryResult<GetNutritionistMealPlansQuery, GetNutritionistMealPlansQueryVariables>;
export const MyCartDocument = gql`
    query MyCart {
  myCart {
    ...RegularCartItem
  }
}
    ${RegularCartItemFragmentDoc}`;

/**
 * __useMyCartQuery__
 *
 * To run a query within a React component, call `useMyCartQuery` and pass it any options that fit your needs.
 * When your component renders, `useMyCartQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMyCartQuery({
 *   variables: {
 *   },
 * });
 */
export function useMyCartQuery(baseOptions?: Apollo.QueryHookOptions<MyCartQuery, MyCartQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MyCartQuery, MyCartQueryVariables>(MyCartDocument, options);
      }
export function useMyCartLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MyCartQuery, MyCartQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MyCartQuery, MyCartQueryVariables>(MyCartDocument, options);
        }
export function useMyCartSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<MyCartQuery, MyCartQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<MyCartQuery, MyCartQueryVariables>(MyCartDocument, options);
        }
export type MyCartQueryHookResult = ReturnType<typeof useMyCartQuery>;
export type MyCartLazyQueryHookResult = ReturnType<typeof useMyCartLazyQuery>;
export type MyCartSuspenseQueryHookResult = ReturnType<typeof useMyCartSuspenseQuery>;
export type MyCartQueryResult = Apollo.QueryResult<MyCartQuery, MyCartQueryVariables>;
export const MyChefProfileDocument = gql`
    query MyChefProfile {
  myChefProfile {
    ...RegularChefProfile
  }
}
    ${RegularChefProfileFragmentDoc}`;

/**
 * __useMyChefProfileQuery__
 *
 * To run a query within a React component, call `useMyChefProfileQuery` and pass it any options that fit your needs.
 * When your component renders, `useMyChefProfileQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMyChefProfileQuery({
 *   variables: {
 *   },
 * });
 */
export function useMyChefProfileQuery(baseOptions?: Apollo.QueryHookOptions<MyChefProfileQuery, MyChefProfileQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MyChefProfileQuery, MyChefProfileQueryVariables>(MyChefProfileDocument, options);
      }
export function useMyChefProfileLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MyChefProfileQuery, MyChefProfileQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MyChefProfileQuery, MyChefProfileQueryVariables>(MyChefProfileDocument, options);
        }
export function useMyChefProfileSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<MyChefProfileQuery, MyChefProfileQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<MyChefProfileQuery, MyChefProfileQueryVariables>(MyChefProfileDocument, options);
        }
export type MyChefProfileQueryHookResult = ReturnType<typeof useMyChefProfileQuery>;
export type MyChefProfileLazyQueryHookResult = ReturnType<typeof useMyChefProfileLazyQuery>;
export type MyChefProfileSuspenseQueryHookResult = ReturnType<typeof useMyChefProfileSuspenseQuery>;
export type MyChefProfileQueryResult = Apollo.QueryResult<MyChefProfileQuery, MyChefProfileQueryVariables>;
export const MyConversationsDocument = gql`
    query MyConversations($limit: Int = 20, $offset: Int = 0) {
  myConversations(limit: $limit, offset: $offset) {
    ...ConversationWithParticipants
  }
}
    ${ConversationWithParticipantsFragmentDoc}`;

/**
 * __useMyConversationsQuery__
 *
 * To run a query within a React component, call `useMyConversationsQuery` and pass it any options that fit your needs.
 * When your component renders, `useMyConversationsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMyConversationsQuery({
 *   variables: {
 *      limit: // value for 'limit'
 *      offset: // value for 'offset'
 *   },
 * });
 */
export function useMyConversationsQuery(baseOptions?: Apollo.QueryHookOptions<MyConversationsQuery, MyConversationsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MyConversationsQuery, MyConversationsQueryVariables>(MyConversationsDocument, options);
      }
export function useMyConversationsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MyConversationsQuery, MyConversationsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MyConversationsQuery, MyConversationsQueryVariables>(MyConversationsDocument, options);
        }
export function useMyConversationsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<MyConversationsQuery, MyConversationsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<MyConversationsQuery, MyConversationsQueryVariables>(MyConversationsDocument, options);
        }
export type MyConversationsQueryHookResult = ReturnType<typeof useMyConversationsQuery>;
export type MyConversationsLazyQueryHookResult = ReturnType<typeof useMyConversationsLazyQuery>;
export type MyConversationsSuspenseQueryHookResult = ReturnType<typeof useMyConversationsSuspenseQuery>;
export type MyConversationsQueryResult = Apollo.QueryResult<MyConversationsQuery, MyConversationsQueryVariables>;
export const MyCookedRecipesDocument = gql`
    query MyCookedRecipes($limit: Int = 3, $offset: Int = 0) {
  myCookedRecipes(limit: $limit, offset: $offset) {
    ...RegularCookedRecipe
  }
}
    ${RegularCookedRecipeFragmentDoc}`;

/**
 * __useMyCookedRecipesQuery__
 *
 * To run a query within a React component, call `useMyCookedRecipesQuery` and pass it any options that fit your needs.
 * When your component renders, `useMyCookedRecipesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMyCookedRecipesQuery({
 *   variables: {
 *      limit: // value for 'limit'
 *      offset: // value for 'offset'
 *   },
 * });
 */
export function useMyCookedRecipesQuery(baseOptions?: Apollo.QueryHookOptions<MyCookedRecipesQuery, MyCookedRecipesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MyCookedRecipesQuery, MyCookedRecipesQueryVariables>(MyCookedRecipesDocument, options);
      }
export function useMyCookedRecipesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MyCookedRecipesQuery, MyCookedRecipesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MyCookedRecipesQuery, MyCookedRecipesQueryVariables>(MyCookedRecipesDocument, options);
        }
export function useMyCookedRecipesSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<MyCookedRecipesQuery, MyCookedRecipesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<MyCookedRecipesQuery, MyCookedRecipesQueryVariables>(MyCookedRecipesDocument, options);
        }
export type MyCookedRecipesQueryHookResult = ReturnType<typeof useMyCookedRecipesQuery>;
export type MyCookedRecipesLazyQueryHookResult = ReturnType<typeof useMyCookedRecipesLazyQuery>;
export type MyCookedRecipesSuspenseQueryHookResult = ReturnType<typeof useMyCookedRecipesSuspenseQuery>;
export type MyCookedRecipesQueryResult = Apollo.QueryResult<MyCookedRecipesQuery, MyCookedRecipesQueryVariables>;
export const MyFavoritesDocument = gql`
    query MyFavorites($limit: Int = 10, $offset: Int = 0) {
  myFavorites(limit: $limit, offset: $offset) {
    ...RegularUserFavorite
  }
}
    ${RegularUserFavoriteFragmentDoc}`;

/**
 * __useMyFavoritesQuery__
 *
 * To run a query within a React component, call `useMyFavoritesQuery` and pass it any options that fit your needs.
 * When your component renders, `useMyFavoritesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMyFavoritesQuery({
 *   variables: {
 *      limit: // value for 'limit'
 *      offset: // value for 'offset'
 *   },
 * });
 */
export function useMyFavoritesQuery(baseOptions?: Apollo.QueryHookOptions<MyFavoritesQuery, MyFavoritesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MyFavoritesQuery, MyFavoritesQueryVariables>(MyFavoritesDocument, options);
      }
export function useMyFavoritesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MyFavoritesQuery, MyFavoritesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MyFavoritesQuery, MyFavoritesQueryVariables>(MyFavoritesDocument, options);
        }
export function useMyFavoritesSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<MyFavoritesQuery, MyFavoritesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<MyFavoritesQuery, MyFavoritesQueryVariables>(MyFavoritesDocument, options);
        }
export type MyFavoritesQueryHookResult = ReturnType<typeof useMyFavoritesQuery>;
export type MyFavoritesLazyQueryHookResult = ReturnType<typeof useMyFavoritesLazyQuery>;
export type MyFavoritesSuspenseQueryHookResult = ReturnType<typeof useMyFavoritesSuspenseQuery>;
export type MyFavoritesQueryResult = Apollo.QueryResult<MyFavoritesQuery, MyFavoritesQueryVariables>;
export const MyNutritionalSummaryDocument = gql`
    query MyNutritionalSummary {
  myNutritionalSummary {
    cookCount
    totalCalories
    totalProtein
    totalCarbs
    totalFat
  }
}
    `;

/**
 * __useMyNutritionalSummaryQuery__
 *
 * To run a query within a React component, call `useMyNutritionalSummaryQuery` and pass it any options that fit your needs.
 * When your component renders, `useMyNutritionalSummaryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMyNutritionalSummaryQuery({
 *   variables: {
 *   },
 * });
 */
export function useMyNutritionalSummaryQuery(baseOptions?: Apollo.QueryHookOptions<MyNutritionalSummaryQuery, MyNutritionalSummaryQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MyNutritionalSummaryQuery, MyNutritionalSummaryQueryVariables>(MyNutritionalSummaryDocument, options);
      }
export function useMyNutritionalSummaryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MyNutritionalSummaryQuery, MyNutritionalSummaryQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MyNutritionalSummaryQuery, MyNutritionalSummaryQueryVariables>(MyNutritionalSummaryDocument, options);
        }
export function useMyNutritionalSummarySuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<MyNutritionalSummaryQuery, MyNutritionalSummaryQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<MyNutritionalSummaryQuery, MyNutritionalSummaryQueryVariables>(MyNutritionalSummaryDocument, options);
        }
export type MyNutritionalSummaryQueryHookResult = ReturnType<typeof useMyNutritionalSummaryQuery>;
export type MyNutritionalSummaryLazyQueryHookResult = ReturnType<typeof useMyNutritionalSummaryLazyQuery>;
export type MyNutritionalSummarySuspenseQueryHookResult = ReturnType<typeof useMyNutritionalSummarySuspenseQuery>;
export type MyNutritionalSummaryQueryResult = Apollo.QueryResult<MyNutritionalSummaryQuery, MyNutritionalSummaryQueryVariables>;
export const MyNutritionistProfileDocument = gql`
    query MyNutritionistProfile {
  myNutritionistProfile {
    id
    bio
    phone
    city
    user {
      id
      username
      email
    }
  }
}
    `;

/**
 * __useMyNutritionistProfileQuery__
 *
 * To run a query within a React component, call `useMyNutritionistProfileQuery` and pass it any options that fit your needs.
 * When your component renders, `useMyNutritionistProfileQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMyNutritionistProfileQuery({
 *   variables: {
 *   },
 * });
 */
export function useMyNutritionistProfileQuery(baseOptions?: Apollo.QueryHookOptions<MyNutritionistProfileQuery, MyNutritionistProfileQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MyNutritionistProfileQuery, MyNutritionistProfileQueryVariables>(MyNutritionistProfileDocument, options);
      }
export function useMyNutritionistProfileLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MyNutritionistProfileQuery, MyNutritionistProfileQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MyNutritionistProfileQuery, MyNutritionistProfileQueryVariables>(MyNutritionistProfileDocument, options);
        }
export function useMyNutritionistProfileSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<MyNutritionistProfileQuery, MyNutritionistProfileQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<MyNutritionistProfileQuery, MyNutritionistProfileQueryVariables>(MyNutritionistProfileDocument, options);
        }
export type MyNutritionistProfileQueryHookResult = ReturnType<typeof useMyNutritionistProfileQuery>;
export type MyNutritionistProfileLazyQueryHookResult = ReturnType<typeof useMyNutritionistProfileLazyQuery>;
export type MyNutritionistProfileSuspenseQueryHookResult = ReturnType<typeof useMyNutritionistProfileSuspenseQuery>;
export type MyNutritionistProfileQueryResult = Apollo.QueryResult<MyNutritionistProfileQuery, MyNutritionistProfileQueryVariables>;
export const MyRecipesDocument = gql`
    query MyRecipes($limit: Int = 10, $offset: Int = 0) {
  myRecipes(limit: $limit, offset: $offset) {
    ...RegularRecipe
  }
}
    ${RegularRecipeFragmentDoc}`;

/**
 * __useMyRecipesQuery__
 *
 * To run a query within a React component, call `useMyRecipesQuery` and pass it any options that fit your needs.
 * When your component renders, `useMyRecipesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMyRecipesQuery({
 *   variables: {
 *      limit: // value for 'limit'
 *      offset: // value for 'offset'
 *   },
 * });
 */
export function useMyRecipesQuery(baseOptions?: Apollo.QueryHookOptions<MyRecipesQuery, MyRecipesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MyRecipesQuery, MyRecipesQueryVariables>(MyRecipesDocument, options);
      }
export function useMyRecipesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MyRecipesQuery, MyRecipesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MyRecipesQuery, MyRecipesQueryVariables>(MyRecipesDocument, options);
        }
export function useMyRecipesSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<MyRecipesQuery, MyRecipesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<MyRecipesQuery, MyRecipesQueryVariables>(MyRecipesDocument, options);
        }
export type MyRecipesQueryHookResult = ReturnType<typeof useMyRecipesQuery>;
export type MyRecipesLazyQueryHookResult = ReturnType<typeof useMyRecipesLazyQuery>;
export type MyRecipesSuspenseQueryHookResult = ReturnType<typeof useMyRecipesSuspenseQuery>;
export type MyRecipesQueryResult = Apollo.QueryResult<MyRecipesQuery, MyRecipesQueryVariables>;
export const MyRecipesByCategoryDocument = gql`
    query MyRecipesByCategory($category: RecipeCategory!, $limit: Int = 10, $offset: Int = 0) {
  myRecipesByCategory(category: $category, limit: $limit, offset: $offset) {
    ...RegularRecipe
  }
}
    ${RegularRecipeFragmentDoc}`;

/**
 * __useMyRecipesByCategoryQuery__
 *
 * To run a query within a React component, call `useMyRecipesByCategoryQuery` and pass it any options that fit your needs.
 * When your component renders, `useMyRecipesByCategoryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMyRecipesByCategoryQuery({
 *   variables: {
 *      category: // value for 'category'
 *      limit: // value for 'limit'
 *      offset: // value for 'offset'
 *   },
 * });
 */
export function useMyRecipesByCategoryQuery(baseOptions: Apollo.QueryHookOptions<MyRecipesByCategoryQuery, MyRecipesByCategoryQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MyRecipesByCategoryQuery, MyRecipesByCategoryQueryVariables>(MyRecipesByCategoryDocument, options);
      }
export function useMyRecipesByCategoryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MyRecipesByCategoryQuery, MyRecipesByCategoryQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MyRecipesByCategoryQuery, MyRecipesByCategoryQueryVariables>(MyRecipesByCategoryDocument, options);
        }
export function useMyRecipesByCategorySuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<MyRecipesByCategoryQuery, MyRecipesByCategoryQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<MyRecipesByCategoryQuery, MyRecipesByCategoryQueryVariables>(MyRecipesByCategoryDocument, options);
        }
export type MyRecipesByCategoryQueryHookResult = ReturnType<typeof useMyRecipesByCategoryQuery>;
export type MyRecipesByCategoryLazyQueryHookResult = ReturnType<typeof useMyRecipesByCategoryLazyQuery>;
export type MyRecipesByCategorySuspenseQueryHookResult = ReturnType<typeof useMyRecipesByCategorySuspenseQuery>;
export type MyRecipesByCategoryQueryResult = Apollo.QueryResult<MyRecipesByCategoryQuery, MyRecipesByCategoryQueryVariables>;
export const NutritionistDocument = gql`
    query Nutritionist($id: Int!) {
  nutritionist(id: $id) {
    id
    bio
    phone
    city
    user {
      id
      username
      email
      image
    }
  }
}
    `;

/**
 * __useNutritionistQuery__
 *
 * To run a query within a React component, call `useNutritionistQuery` and pass it any options that fit your needs.
 * When your component renders, `useNutritionistQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useNutritionistQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useNutritionistQuery(baseOptions: Apollo.QueryHookOptions<NutritionistQuery, NutritionistQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<NutritionistQuery, NutritionistQueryVariables>(NutritionistDocument, options);
      }
export function useNutritionistLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<NutritionistQuery, NutritionistQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<NutritionistQuery, NutritionistQueryVariables>(NutritionistDocument, options);
        }
export function useNutritionistSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<NutritionistQuery, NutritionistQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<NutritionistQuery, NutritionistQueryVariables>(NutritionistDocument, options);
        }
export type NutritionistQueryHookResult = ReturnType<typeof useNutritionistQuery>;
export type NutritionistLazyQueryHookResult = ReturnType<typeof useNutritionistLazyQuery>;
export type NutritionistSuspenseQueryHookResult = ReturnType<typeof useNutritionistSuspenseQuery>;
export type NutritionistQueryResult = Apollo.QueryResult<NutritionistQuery, NutritionistQueryVariables>;
export const NutritionistsDocument = gql`
    query Nutritionists($limit: Int = 10, $offset: Int = 0) {
  nutritionists(limit: $limit, offset: $offset) {
    id
    bio
    phone
    city
    user {
      id
      username
      email
      image
    }
  }
}
    `;

/**
 * __useNutritionistsQuery__
 *
 * To run a query within a React component, call `useNutritionistsQuery` and pass it any options that fit your needs.
 * When your component renders, `useNutritionistsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useNutritionistsQuery({
 *   variables: {
 *      limit: // value for 'limit'
 *      offset: // value for 'offset'
 *   },
 * });
 */
export function useNutritionistsQuery(baseOptions?: Apollo.QueryHookOptions<NutritionistsQuery, NutritionistsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<NutritionistsQuery, NutritionistsQueryVariables>(NutritionistsDocument, options);
      }
export function useNutritionistsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<NutritionistsQuery, NutritionistsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<NutritionistsQuery, NutritionistsQueryVariables>(NutritionistsDocument, options);
        }
export function useNutritionistsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<NutritionistsQuery, NutritionistsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<NutritionistsQuery, NutritionistsQueryVariables>(NutritionistsDocument, options);
        }
export type NutritionistsQueryHookResult = ReturnType<typeof useNutritionistsQuery>;
export type NutritionistsLazyQueryHookResult = ReturnType<typeof useNutritionistsLazyQuery>;
export type NutritionistsSuspenseQueryHookResult = ReturnType<typeof useNutritionistsSuspenseQuery>;
export type NutritionistsQueryResult = Apollo.QueryResult<NutritionistsQuery, NutritionistsQueryVariables>;
export const RecipeDocument = gql`
    query Recipe($id: Int!) {
  recipe(id: $id) {
    ...RegularRecipe
  }
}
    ${RegularRecipeFragmentDoc}`;

/**
 * __useRecipeQuery__
 *
 * To run a query within a React component, call `useRecipeQuery` and pass it any options that fit your needs.
 * When your component renders, `useRecipeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useRecipeQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useRecipeQuery(baseOptions: Apollo.QueryHookOptions<RecipeQuery, RecipeQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<RecipeQuery, RecipeQueryVariables>(RecipeDocument, options);
      }
export function useRecipeLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<RecipeQuery, RecipeQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<RecipeQuery, RecipeQueryVariables>(RecipeDocument, options);
        }
export function useRecipeSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<RecipeQuery, RecipeQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<RecipeQuery, RecipeQueryVariables>(RecipeDocument, options);
        }
export type RecipeQueryHookResult = ReturnType<typeof useRecipeQuery>;
export type RecipeLazyQueryHookResult = ReturnType<typeof useRecipeLazyQuery>;
export type RecipeSuspenseQueryHookResult = ReturnType<typeof useRecipeSuspenseQuery>;
export type RecipeQueryResult = Apollo.QueryResult<RecipeQuery, RecipeQueryVariables>;
export const RecipeAverageRatingDocument = gql`
    query RecipeAverageRating($recipeId: Int!) {
  recipeAverageRating(recipeId: $recipeId)
}
    `;

/**
 * __useRecipeAverageRatingQuery__
 *
 * To run a query within a React component, call `useRecipeAverageRatingQuery` and pass it any options that fit your needs.
 * When your component renders, `useRecipeAverageRatingQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useRecipeAverageRatingQuery({
 *   variables: {
 *      recipeId: // value for 'recipeId'
 *   },
 * });
 */
export function useRecipeAverageRatingQuery(baseOptions: Apollo.QueryHookOptions<RecipeAverageRatingQuery, RecipeAverageRatingQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<RecipeAverageRatingQuery, RecipeAverageRatingQueryVariables>(RecipeAverageRatingDocument, options);
      }
export function useRecipeAverageRatingLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<RecipeAverageRatingQuery, RecipeAverageRatingQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<RecipeAverageRatingQuery, RecipeAverageRatingQueryVariables>(RecipeAverageRatingDocument, options);
        }
export function useRecipeAverageRatingSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<RecipeAverageRatingQuery, RecipeAverageRatingQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<RecipeAverageRatingQuery, RecipeAverageRatingQueryVariables>(RecipeAverageRatingDocument, options);
        }
export type RecipeAverageRatingQueryHookResult = ReturnType<typeof useRecipeAverageRatingQuery>;
export type RecipeAverageRatingLazyQueryHookResult = ReturnType<typeof useRecipeAverageRatingLazyQuery>;
export type RecipeAverageRatingSuspenseQueryHookResult = ReturnType<typeof useRecipeAverageRatingSuspenseQuery>;
export type RecipeAverageRatingQueryResult = Apollo.QueryResult<RecipeAverageRatingQuery, RecipeAverageRatingQueryVariables>;
export const MyRecipeRatingDocument = gql`
    query MyRecipeRating($recipeId: Int!) {
  myRecipeRating(recipeId: $recipeId) {
    ...RegularRecipeRating
  }
}
    ${RegularRecipeRatingFragmentDoc}`;

/**
 * __useMyRecipeRatingQuery__
 *
 * To run a query within a React component, call `useMyRecipeRatingQuery` and pass it any options that fit your needs.
 * When your component renders, `useMyRecipeRatingQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMyRecipeRatingQuery({
 *   variables: {
 *      recipeId: // value for 'recipeId'
 *   },
 * });
 */
export function useMyRecipeRatingQuery(baseOptions: Apollo.QueryHookOptions<MyRecipeRatingQuery, MyRecipeRatingQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MyRecipeRatingQuery, MyRecipeRatingQueryVariables>(MyRecipeRatingDocument, options);
      }
export function useMyRecipeRatingLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MyRecipeRatingQuery, MyRecipeRatingQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MyRecipeRatingQuery, MyRecipeRatingQueryVariables>(MyRecipeRatingDocument, options);
        }
export function useMyRecipeRatingSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<MyRecipeRatingQuery, MyRecipeRatingQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<MyRecipeRatingQuery, MyRecipeRatingQueryVariables>(MyRecipeRatingDocument, options);
        }
export type MyRecipeRatingQueryHookResult = ReturnType<typeof useMyRecipeRatingQuery>;
export type MyRecipeRatingLazyQueryHookResult = ReturnType<typeof useMyRecipeRatingLazyQuery>;
export type MyRecipeRatingSuspenseQueryHookResult = ReturnType<typeof useMyRecipeRatingSuspenseQuery>;
export type MyRecipeRatingQueryResult = Apollo.QueryResult<MyRecipeRatingQuery, MyRecipeRatingQueryVariables>;
export const RecipeRatingsDocument = gql`
    query RecipeRatings($recipeId: Int!, $limit: Int = 10, $offset: Int = 0) {
  recipeRatings(recipeId: $recipeId, limit: $limit, offset: $offset) {
    ...RegularRecipeRating
  }
}
    ${RegularRecipeRatingFragmentDoc}`;

/**
 * __useRecipeRatingsQuery__
 *
 * To run a query within a React component, call `useRecipeRatingsQuery` and pass it any options that fit your needs.
 * When your component renders, `useRecipeRatingsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useRecipeRatingsQuery({
 *   variables: {
 *      recipeId: // value for 'recipeId'
 *      limit: // value for 'limit'
 *      offset: // value for 'offset'
 *   },
 * });
 */
export function useRecipeRatingsQuery(baseOptions: Apollo.QueryHookOptions<RecipeRatingsQuery, RecipeRatingsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<RecipeRatingsQuery, RecipeRatingsQueryVariables>(RecipeRatingsDocument, options);
      }
export function useRecipeRatingsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<RecipeRatingsQuery, RecipeRatingsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<RecipeRatingsQuery, RecipeRatingsQueryVariables>(RecipeRatingsDocument, options);
        }
export function useRecipeRatingsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<RecipeRatingsQuery, RecipeRatingsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<RecipeRatingsQuery, RecipeRatingsQueryVariables>(RecipeRatingsDocument, options);
        }
export type RecipeRatingsQueryHookResult = ReturnType<typeof useRecipeRatingsQuery>;
export type RecipeRatingsLazyQueryHookResult = ReturnType<typeof useRecipeRatingsLazyQuery>;
export type RecipeRatingsSuspenseQueryHookResult = ReturnType<typeof useRecipeRatingsSuspenseQuery>;
export type RecipeRatingsQueryResult = Apollo.QueryResult<RecipeRatingsQuery, RecipeRatingsQueryVariables>;
export const RecipesDocument = gql`
    query Recipes($limit: Int = 10, $offset: Int = 0) {
  recipes(limit: $limit, offset: $offset) {
    ...RegularRecipe
  }
}
    ${RegularRecipeFragmentDoc}`;

/**
 * __useRecipesQuery__
 *
 * To run a query within a React component, call `useRecipesQuery` and pass it any options that fit your needs.
 * When your component renders, `useRecipesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useRecipesQuery({
 *   variables: {
 *      limit: // value for 'limit'
 *      offset: // value for 'offset'
 *   },
 * });
 */
export function useRecipesQuery(baseOptions?: Apollo.QueryHookOptions<RecipesQuery, RecipesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<RecipesQuery, RecipesQueryVariables>(RecipesDocument, options);
      }
export function useRecipesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<RecipesQuery, RecipesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<RecipesQuery, RecipesQueryVariables>(RecipesDocument, options);
        }
export function useRecipesSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<RecipesQuery, RecipesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<RecipesQuery, RecipesQueryVariables>(RecipesDocument, options);
        }
export type RecipesQueryHookResult = ReturnType<typeof useRecipesQuery>;
export type RecipesLazyQueryHookResult = ReturnType<typeof useRecipesLazyQuery>;
export type RecipesSuspenseQueryHookResult = ReturnType<typeof useRecipesSuspenseQuery>;
export type RecipesQueryResult = Apollo.QueryResult<RecipesQuery, RecipesQueryVariables>;
export const RecipesByCategoryDocument = gql`
    query RecipesByCategory($category: RecipeCategory!, $limit: Int = 10, $offset: Int = 0) {
  recipesByCategory(category: $category, limit: $limit, offset: $offset) {
    ...RegularRecipe
  }
}
    ${RegularRecipeFragmentDoc}`;

/**
 * __useRecipesByCategoryQuery__
 *
 * To run a query within a React component, call `useRecipesByCategoryQuery` and pass it any options that fit your needs.
 * When your component renders, `useRecipesByCategoryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useRecipesByCategoryQuery({
 *   variables: {
 *      category: // value for 'category'
 *      limit: // value for 'limit'
 *      offset: // value for 'offset'
 *   },
 * });
 */
export function useRecipesByCategoryQuery(baseOptions: Apollo.QueryHookOptions<RecipesByCategoryQuery, RecipesByCategoryQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<RecipesByCategoryQuery, RecipesByCategoryQueryVariables>(RecipesByCategoryDocument, options);
      }
export function useRecipesByCategoryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<RecipesByCategoryQuery, RecipesByCategoryQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<RecipesByCategoryQuery, RecipesByCategoryQueryVariables>(RecipesByCategoryDocument, options);
        }
export function useRecipesByCategorySuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<RecipesByCategoryQuery, RecipesByCategoryQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<RecipesByCategoryQuery, RecipesByCategoryQueryVariables>(RecipesByCategoryDocument, options);
        }
export type RecipesByCategoryQueryHookResult = ReturnType<typeof useRecipesByCategoryQuery>;
export type RecipesByCategoryLazyQueryHookResult = ReturnType<typeof useRecipesByCategoryLazyQuery>;
export type RecipesByCategorySuspenseQueryHookResult = ReturnType<typeof useRecipesByCategorySuspenseQuery>;
export type RecipesByCategoryQueryResult = Apollo.QueryResult<RecipesByCategoryQuery, RecipesByCategoryQueryVariables>;
export const RecipesByChefDocument = gql`
    query RecipesByChef($chefId: Int!, $limit: Int = 6, $offset: Int = 0) {
  recipesByChef(chefId: $chefId, limit: $limit, offset: $offset) {
    ...RegularRecipe
  }
}
    ${RegularRecipeFragmentDoc}`;

/**
 * __useRecipesByChefQuery__
 *
 * To run a query within a React component, call `useRecipesByChefQuery` and pass it any options that fit your needs.
 * When your component renders, `useRecipesByChefQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useRecipesByChefQuery({
 *   variables: {
 *      chefId: // value for 'chefId'
 *      limit: // value for 'limit'
 *      offset: // value for 'offset'
 *   },
 * });
 */
export function useRecipesByChefQuery(baseOptions: Apollo.QueryHookOptions<RecipesByChefQuery, RecipesByChefQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<RecipesByChefQuery, RecipesByChefQueryVariables>(RecipesByChefDocument, options);
      }
export function useRecipesByChefLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<RecipesByChefQuery, RecipesByChefQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<RecipesByChefQuery, RecipesByChefQueryVariables>(RecipesByChefDocument, options);
        }
export function useRecipesByChefSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<RecipesByChefQuery, RecipesByChefQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<RecipesByChefQuery, RecipesByChefQueryVariables>(RecipesByChefDocument, options);
        }
export type RecipesByChefQueryHookResult = ReturnType<typeof useRecipesByChefQuery>;
export type RecipesByChefLazyQueryHookResult = ReturnType<typeof useRecipesByChefLazyQuery>;
export type RecipesByChefSuspenseQueryHookResult = ReturnType<typeof useRecipesByChefSuspenseQuery>;
export type RecipesByChefQueryResult = Apollo.QueryResult<RecipesByChefQuery, RecipesByChefQueryVariables>;
export const SuggestedRecipesDocument = gql`
    query SuggestedRecipes($ingredientIds: [Int!]!, $utensilIds: [Int!], $maxMissing: Int) {
  suggestedRecipes(
    ingredientIds: $ingredientIds
    utensilIds: $utensilIds
    maxMissing: $maxMissing
  ) {
    recipe {
      ...RegularRecipe
    }
    missingCount
    missingIngredients {
      id
      name_el
      name_en
    }
    missingUtensils {
      id
      name_el
      name_en
    }
  }
}
    ${RegularRecipeFragmentDoc}`;

/**
 * __useSuggestedRecipesQuery__
 *
 * To run a query within a React component, call `useSuggestedRecipesQuery` and pass it any options that fit your needs.
 * When your component renders, `useSuggestedRecipesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSuggestedRecipesQuery({
 *   variables: {
 *      ingredientIds: // value for 'ingredientIds'
 *      utensilIds: // value for 'utensilIds'
 *      maxMissing: // value for 'maxMissing'
 *   },
 * });
 */
export function useSuggestedRecipesQuery(baseOptions: Apollo.QueryHookOptions<SuggestedRecipesQuery, SuggestedRecipesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<SuggestedRecipesQuery, SuggestedRecipesQueryVariables>(SuggestedRecipesDocument, options);
      }
export function useSuggestedRecipesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SuggestedRecipesQuery, SuggestedRecipesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<SuggestedRecipesQuery, SuggestedRecipesQueryVariables>(SuggestedRecipesDocument, options);
        }
export function useSuggestedRecipesSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<SuggestedRecipesQuery, SuggestedRecipesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<SuggestedRecipesQuery, SuggestedRecipesQueryVariables>(SuggestedRecipesDocument, options);
        }
export type SuggestedRecipesQueryHookResult = ReturnType<typeof useSuggestedRecipesQuery>;
export type SuggestedRecipesLazyQueryHookResult = ReturnType<typeof useSuggestedRecipesLazyQuery>;
export type SuggestedRecipesSuspenseQueryHookResult = ReturnType<typeof useSuggestedRecipesSuspenseQuery>;
export type SuggestedRecipesQueryResult = Apollo.QueryResult<SuggestedRecipesQuery, SuggestedRecipesQueryVariables>;
export const TopRatedRecipesDocument = gql`
    query TopRatedRecipes($limit: Int) {
  topRatedRecipes(limit: $limit) {
    ...TopRatedRecipe
  }
}
    ${TopRatedRecipeFragmentDoc}`;

/**
 * __useTopRatedRecipesQuery__
 *
 * To run a query within a React component, call `useTopRatedRecipesQuery` and pass it any options that fit your needs.
 * When your component renders, `useTopRatedRecipesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTopRatedRecipesQuery({
 *   variables: {
 *      limit: // value for 'limit'
 *   },
 * });
 */
export function useTopRatedRecipesQuery(baseOptions?: Apollo.QueryHookOptions<TopRatedRecipesQuery, TopRatedRecipesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<TopRatedRecipesQuery, TopRatedRecipesQueryVariables>(TopRatedRecipesDocument, options);
      }
export function useTopRatedRecipesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TopRatedRecipesQuery, TopRatedRecipesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<TopRatedRecipesQuery, TopRatedRecipesQueryVariables>(TopRatedRecipesDocument, options);
        }
export function useTopRatedRecipesSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<TopRatedRecipesQuery, TopRatedRecipesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<TopRatedRecipesQuery, TopRatedRecipesQueryVariables>(TopRatedRecipesDocument, options);
        }
export type TopRatedRecipesQueryHookResult = ReturnType<typeof useTopRatedRecipesQuery>;
export type TopRatedRecipesLazyQueryHookResult = ReturnType<typeof useTopRatedRecipesLazyQuery>;
export type TopRatedRecipesSuspenseQueryHookResult = ReturnType<typeof useTopRatedRecipesSuspenseQuery>;
export type TopRatedRecipesQueryResult = Apollo.QueryResult<TopRatedRecipesQuery, TopRatedRecipesQueryVariables>;