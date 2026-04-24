import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import ChefNavbar from '../../../components/Chef/ChefNavbar';
import Footer from '../../../components/Users/Footer';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import { gql, useQuery } from '@apollo/client';
import {
  Difficulty,
  RecipeCategory,
  useUpdateRecipeMutation,
  useDeleteRecipeMutation,
  useIngredientsQuery,
} from '../../../generated/graphql';
import useIsChef from '../../../utils/useIsChef';
import { pick } from '../../../utils/pick';
import { uploadToCloudinary } from '../../../utils/uploadToCloudinary';

import {
  EditForm,
  DIFFICULTY_OPTIONS,
  CATEGORY_OPTIONS,
  buildEditForm,
} from '../../../components/Chef/recipeDetail/types';

import RecipeHeroImage from '../../../components/Chef/recipeDetail/RecipeHeroImage';
import RecipeDescriptionCard from '../../../components/Chef/recipeDetail/RecipeDescriptionCard';
import RecipeIngredientsList from '../../../components/Chef/recipeDetail/RecipeIngredientsList';
import RecipeStepsList from '../../../components/Chef/recipeDetail/RecipeStepsList';
import RecipeActionButtons from '../../../components/Chef/recipeDetail/RecipeActionButtons';
import RecipeInfoCard from '../../../components/Chef/recipeDetail/RecipeInfoCard';
import RecipeTimeBreakdown from '../../../components/Chef/recipeDetail/RecipeTimeBreakdown';
import RecipeCategoryCard from '../../../components/Chef/recipeDetail/RecipeCategoryCard';
import RecipeMacrosCard from '../../../components/Chef/recipeDetail/RecipeMacrosCard';

// ─── Stars ────────────────────────────────────────────────────────────────────

const Stars = ({ rating }: { rating: number }) => (
  <div className="flex gap-0.5">
    {Array.from({ length: 5 }).map((_, i) => (
      <svg
        key={i}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill={i < Math.round(rating) ? '#EAB308' : 'none'}
        stroke="#EAB308"
        strokeWidth={i < Math.round(rating) ? 0 : 1.5}
        className="h-5 w-5"
      >
        <path
          fillRule="evenodd"
          d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
          clipRule="evenodd"
        />
      </svg>
    ))}
  </div>
);

// ─── GQL ─────────────────────────────────────────────────────────────────────

const RECIPE_DETAIL_QUERY = gql`
  query RecipeDetail($id: Int!) {
    recipe(id: $id) {
      id
      title_el
      title_en
      description_el
      description_en
      chefComment_el
      chefComment_en
      recipeImage
      difficulty
      prepTime
      cookTime
      restTime
      foodEthnicity
      category
      caloriesTotal
      protein
      carbs
      fat
      authorId
      author {
        user {
          id
          username
          email
        }
      }
      recipeIngredients {
        ingredientId
        quantity
        unit
        ingredient {
          id
          name_el
          name_en
        }
      }
      steps {
        id
        body_el
        body_en
      }
      utensils {
        id
        name_el
        name_en
      }
    }
  }
`;

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ChefSingleRecipe() {
  const { loading: authLoading, isAuthorized } = useIsChef();
  const { t, i18n } = useTranslation('common');
  const lang = i18n.language as 'el' | 'en';
  const router = useRouter();
  const id = router.isReady ? Number(router.query.id) : null;
  const imageInputRef = useRef<HTMLInputElement>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState('');
  const [editForm, setEditForm] = useState<EditForm | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const { data, loading } = useQuery(RECIPE_DETAIL_QUERY, {
    variables: { id },
    skip: !router.isReady || !id,
    fetchPolicy: 'network-only',
  });

  const { data: ingredientsData } = useIngredientsQuery();
  const allIngredients = ingredientsData?.ingredients ?? [];

  const recipe = data?.recipe;

  // ✅ Mutation hooks above the early return
  const [updateRecipe, { loading: saving }] = useUpdateRecipeMutation();
  const [deleteRecipe, { loading: deleting }] = useDeleteRecipeMutation();

  // Syncs editForm on initial load and language changes.
  // Does NOT run after a manual save — handleSave rebuilds from the mutation
  // response directly to avoid a race with any background refetch.
  useEffect(() => {
    if (!recipe) return;
    setEditForm(buildEditForm(recipe, lang));
  }, [recipe, lang]);

  // ✅ Early return after all hooks
  if (authLoading || !isAuthorized) return null;

  const update = (field: keyof EditForm, value: unknown) =>
    setEditForm((prev) => (prev ? { ...prev, [field]: value } : prev));

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // ── Save ───────────────────────────────────────────────────────────────────
  const handleSave = async () => {
    if (!editForm || !recipe) return;
    setFieldErrors({});
    setServerError('');

    const validIngredients = editForm.ingredients.filter(
      (r) => r.ingredientId > 0 && r.quantity.trim() && r.unit.trim(),
    );
    const validSteps = editForm.steps.filter((s) => s.body.trim());

    const errs: Record<string, string> = {};
    if (validIngredients.length < 1)
      errs.ingredients = t('chef.create_recipe.error_ingredients');
    if (validSteps.length < 1) errs.steps = t('chef.create_recipe.error_steps');
    if (!editForm.prepTime || Number(editForm.prepTime) <= 0)
      errs.prepTime = t('chef.create_recipe.error_prep_time');
    if (!editForm.cookTime || Number(editForm.cookTime) <= 0)
      errs.cookTime = t('chef.create_recipe.error_cook_time');
    if (Object.keys(errs).length > 0) {
      setFieldErrors(errs);
      return;
    }

    try {
      let recipeImageUrl: string | undefined;
      if (imageFile) {
        recipeImageUrl = await uploadToCloudinary(imageFile);
      } else if (editForm.recipeImage) {
        recipeImageUrl = editForm.recipeImage;
      }

      const res = await updateRecipe({
        variables: {
          data: {
            id: recipe.id,
            ...(editForm.title.trim() && { title: editForm.title.trim() }),
            ...(editForm.description.trim() && {
              description: editForm.description.trim(),
            }),
            ...(editForm.chefComment.trim() && {
              chefComment: editForm.chefComment.trim(),
            }),
            ...(recipeImageUrl && { recipeImage: recipeImageUrl }),
            ...(editForm.difficulty && {
              difficulty: editForm.difficulty as Difficulty,
            }),
            ...(editForm.prepTime && { prepTime: Number(editForm.prepTime) }),
            ...(editForm.cookTime && { cookTime: Number(editForm.cookTime) }),
            ...(editForm.restTime && { restTime: Number(editForm.restTime) }),
            ...(editForm.foodEthnicity.trim() && {
              foodEthnicity: editForm.foodEthnicity.trim(),
            }),
            ...(editForm.category && {
              category: editForm.category as RecipeCategory,
            }),
            ...(editForm.caloriesTotal && {
              caloriesTotal: Number(editForm.caloriesTotal),
            }),
            ...(editForm.protein && { protein: Number(editForm.protein) }),
            ...(editForm.carbs && { carbs: Number(editForm.carbs) }),
            ...(editForm.fat && { fat: Number(editForm.fat) }),
            ingredients: validIngredients.map((r) => ({
              ingredientId: r.ingredientId,
              quantity: r.quantity,
              unit: r.unit,
            })),
            steps: validSteps.map((s) => ({ body: s.body.trim() })),
          },
        },
        // ✅ No refetchQueries — we rebuild from the mutation response below
      });

      const result = res.data?.updateRecipe;

      if (result?.errors?.length) {
        const mapped: Record<string, string> = {};
        result.errors.forEach((e: { field: string; message: string }) => {
          mapped[e.field] = e.message;
        });
        setFieldErrors(mapped);
        return;
      }

      // ✅ Rebuild editForm from the mutation response, not a refetch
      if (result?.recipe) {
        setEditForm(buildEditForm(result.recipe, lang));
      }

      setImageFile(null);
      setImagePreview(null);
      setIsEditing(false);
    } catch {
      setServerError(t('chef.recipe_detail.error_server'));
    }
  };

  // ── Delete ─────────────────────────────────────────────────────────────────
  const handleDelete = async () => {
    if (!recipe) return;
    if (!window.confirm(t('chef.recipe_detail.confirm_delete'))) return;
    try {
      await deleteRecipe({ variables: { id: recipe.id } });
      router.push('/chef/recipes');
    } catch {
      setServerError(t('chef.recipe_detail.error_server'));
    }
  };

  const handleCancel = () => {
    setFieldErrors({});
    setServerError('');
    setImageFile(null);
    setImagePreview(null);
    if (recipe) setEditForm(buildEditForm(recipe, lang));
    setIsEditing(false);
  };

  // ── Derived ────────────────────────────────────────────────────────────────
  const totalTime = recipe
    ? (recipe.prepTime || 0) + (recipe.cookTime || 0) + (recipe.restTime || 0)
    : 0;

  const difficultyLabel =
    DIFFICULTY_OPTIONS.find((d) => d.value === recipe?.difficulty)?.[
      lang === 'el' ? 'labelEl' : 'labelEn'
    ] ?? '';

  const categoryLabel =
    CATEGORY_OPTIONS.find((c) => c.value === recipe?.category)?.[
      lang === 'el' ? 'labelEl' : 'labelEn'
    ] ?? '';

  // ── Loading / not found ────────────────────────────────────────────────────
  if (loading || !recipe || !editForm) {
    return (
      <div
        className="flex min-h-screen flex-col"
        style={{ backgroundColor: '#3F4756' }}
      >
        <ChefNavbar />
        <main className="flex flex-1 items-center justify-center">
          <p className="text-white text-sm">
            {loading ? t('common.loading') : t('chef.recipe_detail.not_found')}
          </p>
        </main>
        <Footer />
      </div>
    );
  }

  const timeBreakdown = [
    {
      label: t('chef.recipe_detail.prep_time'),
      field: 'prepTime' as const,
      value: recipe.prepTime,
    },
    {
      label: t('chef.recipe_detail.cook_time'),
      field: 'cookTime' as const,
      value: recipe.cookTime,
    },
    {
      label: t('chef.recipe_detail.rest_time'),
      field: 'restTime' as const,
      value: recipe.restTime,
    },
  ];

  const displayImage = imagePreview ?? recipe.recipeImage;

  return (
    <div
      className="flex min-h-screen flex-col"
      style={{ backgroundColor: '#3F4756' }}
    >
      <ChefNavbar />

      <main className="flex flex-1 flex-col items-center px-4 py-8 md:px-8">
        <div className="w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl">
          <RecipeHeroImage
            recipeImage={displayImage}
            title_el={recipe.title_el}
            title_en={recipe.title_en}
            lang={lang}
          />

          {isEditing && (
            <div className="px-6 pt-4">
              <label
                className="mb-1 block text-sm font-bold"
                style={{ color: '#3F4756' }}
              >
                {t('chef.recipe_detail.label_image')}
              </label>
              <input
                ref={imageInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="text-sm text-gray-600"
              />
            </div>
          )}

          <div className="flex flex-col gap-6 p-6 md:flex-row md:p-8">
            {/* LEFT column */}
            <div className="flex-1">
              <div className="mb-4 flex items-center gap-2">
                <Stars rating={0} />
                <span className="text-sm text-gray-400">
                  {t('chef.recipe_detail.no_ratings_yet')}
                </span>
              </div>

              <RecipeDescriptionCard
                recipe={recipe}
                lang={lang}
                isEditing={isEditing}
                editForm={editForm}
                onUpdate={update}
              />

              {isEditing && (
                <div className="mb-4">
                  <label
                    className="mb-1 block text-sm font-bold"
                    style={{ color: '#3F4756' }}
                  >
                    {t('chef.recipe_detail.label_title')}
                  </label>
                  <input
                    value={editForm.title}
                    onChange={(e) => update('title', e.target.value)}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-300"
                    style={{ color: '#3F4756' }}
                  />
                  {fieldErrors.title && (
                    <p className="mt-1 text-xs text-red-500">
                      {fieldErrors.title}
                    </p>
                  )}
                </div>
              )}

              <RecipeIngredientsList
                recipe={recipe}
                lang={lang}
                isEditing={isEditing}
                editForm={editForm}
                fieldError={fieldErrors.ingredients}
                ingredients={allIngredients}
                onUpdate={update}
              />

              {(recipe.utensils ?? []).length > 0 && (
                <div className="mb-6">
                  <h3
                    className="mb-3 text-lg font-black"
                    style={{ color: '#3F4756' }}
                  >
                    {t('chef.recipe_detail.utensils')}
                  </h3>
                  <ol className="flex flex-col gap-1.5 list-decimal list-inside">
                    {(recipe.utensils ?? []).map((u: any, i: number) => (
                      <li key={i} className="text-sm text-gray-600">
                        {pick(u.name_el, u.name_en, lang)}
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              <RecipeStepsList
                recipe={recipe}
                lang={lang}
                isEditing={isEditing}
                editForm={editForm}
                onUpdate={update}
              />

              {fieldErrors.steps && (
                <p className="mt-2 text-xs text-red-500">{fieldErrors.steps}</p>
              )}

              {(fieldErrors.prepTime || fieldErrors.cookTime) && (
                <p className="mt-2 text-xs text-red-500">
                  {fieldErrors.prepTime || fieldErrors.cookTime}
                </p>
              )}

              {serverError && (
                <p className="mt-4 text-xs text-red-500">{serverError}</p>
              )}
            </div>

            {/* RIGHT column */}
            <div className="flex flex-col gap-4 md:w-56">
              <RecipeActionButtons
                isEditing={isEditing}
                saving={saving}
                deleting={deleting}
                onEdit={() => setIsEditing(true)}
                onSave={handleSave}
                onCancel={handleCancel}
                onDelete={handleDelete}
              />

              <RecipeInfoCard
                recipe={recipe}
                lang={lang}
                isEditing={isEditing}
                editForm={editForm}
                totalTime={totalTime}
                difficultyLabel={difficultyLabel}
                onUpdate={update}
              />

              <RecipeTimeBreakdown
                timeBreakdown={timeBreakdown}
                totalTime={totalTime}
                isEditing={isEditing}
                editForm={editForm}
                onUpdate={update}
              />

              <RecipeCategoryCard
                recipe={recipe}
                lang={lang}
                isEditing={isEditing}
                editForm={editForm}
                categoryLabel={categoryLabel}
                onUpdate={update}
              />

              <RecipeMacrosCard
                recipe={recipe}
                isEditing={isEditing}
                editForm={editForm}
                onUpdate={update}
              />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export async function getServerSideProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}
