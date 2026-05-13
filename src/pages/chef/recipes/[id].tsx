import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import ChefNavbar from '../../../components/Chef/ChefNavbar';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import {
  Difficulty,
  RecipeCategory,
  useRecipeDetailQuery,
  useUpdateRecipeMutation,
  useDeleteRecipeMutation,
  useIngredientsQuery,
  useRecipeAverageRatingQuery,
  useRecipeRatingsQuery,
} from '../../../generated/graphql';
import useIsChef from '../../../utils/useIsChef';
import { uploadToCloudinary } from '../../../utils/uploadToCloudinary';

import {
  EditForm,
  DIFFICULTY_OPTIONS,
  buildEditForm,
} from '../../../components/Chef/recipeDetail/types';

import RecipeHeroImage from '../../../components/Chef/recipeDetail/RecipeHeroImage';
import RecipeDescriptionCard from '../../../components/Chef/recipeDetail/RecipeDescriptionCard';
import RecipeIngredientsList from '../../../components/Chef/recipeDetail/RecipeIngredientsList';
import RecipeStepsList from '../../../components/Chef/recipeDetail/RecipeStepsList';
import RecipeActionButtons from '../../../components/Chef/recipeDetail/RecipeActionButtons';
import RecipeTimeBreakdown from '../../../components/Chef/recipeDetail/RecipeTimeBreakdown';
import RecipeCategoryCard from '../../../components/Chef/recipeDetail/RecipeCategoryCard';
import RecipeMacrosCard from '../../../components/Chef/recipeDetail/RecipeMacrosCard';
import ScrollToTopButton from '../../../components/Helper/ScrollToTopButton';
import Stars from '../../../components/Helper/Stars';
import DeleteConfirm from '../../../components/Helper/DeleteConfirm';

export default function ChefSingleRecipe() {
  const { loading: authLoading, isAuthorized } = useIsChef();
  const { t, i18n } = useTranslation('common');
  const lang = i18n.language as 'el' | 'en';
  const router = useRouter();
  const id = router.isReady ? Number(router.query.id) : null;
  const imageInputRef = useRef<HTMLInputElement>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [editForm, setEditForm] = useState<EditForm | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const initializedRef = useRef(false);

  const { data, loading } = useRecipeDetailQuery({
    variables: { id: id! },
    skip: !router.isReady || !id,
    fetchPolicy: 'network-only',
  });

  const { data: avgData } = useRecipeAverageRatingQuery({
    variables: { recipeId: id! },
    skip: !id,
    fetchPolicy: 'network-only',
  });

  const { data: ratingsData } = useRecipeRatingsQuery({
    variables: { recipeId: id!, limit: 50, offset: 0 },
    skip: !id,
    fetchPolicy: 'network-only',
  });

  const avgRating = avgData?.recipeAverageRating ?? 0;
  const totalRatings = ratingsData?.recipeRatings?.length ?? 0;

  const { data: ingredientsData } = useIngredientsQuery();
  const allIngredients = ingredientsData?.ingredients ?? [];

  const recipe = data?.recipe;

  const [updateRecipe, { loading: saving }] = useUpdateRecipeMutation();
  const [deleteRecipe, { loading: deleting }] = useDeleteRecipeMutation();

  useEffect(() => {
    if (!recipe || initializedRef.current) return;
    setEditForm(buildEditForm(recipe, lang));
    initializedRef.current = true;
  }, [recipe]);

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

  const handleSave = async () => {
    if (!editForm || !recipe) return;
    setFieldErrors({});

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

    let recipeImageUrl: string | undefined;
    if (imageFile) {
      recipeImageUrl = await uploadToCloudinary(imageFile);
    } else if (editForm.recipeImage) {
      recipeImageUrl = editForm.recipeImage;
    }

    const titleChanged =
      editForm.title.trim() !==
      (lang === 'en' ? recipe.title_en : recipe.title_el);
    const descChanged =
      editForm.description.trim() !==
      (lang === 'en'
        ? recipe.description_en ?? ''
        : recipe.description_el ?? '');
    const commentChanged =
      editForm.chefComment.trim() !==
      (lang === 'en'
        ? recipe.chefComment_en ?? ''
        : recipe.chefComment_el ?? '');
    const stepsChanged =
      validSteps.length !== (recipe.steps ?? []).length ||
      validSteps.some(
        (s, i) =>
          s.body.trim() !==
          ((recipe.steps ?? [])[i]?.[lang === 'en' ? 'body_en' : 'body_el'] ??
            ''),
      );

    const res = await updateRecipe({
      variables: {
        data: {
          id: recipe.id,
          ...(titleChanged && { title: editForm.title.trim() }),
          ...(descChanged && { description: editForm.description.trim() }),
          ...(commentChanged && { chefComment: editForm.chefComment.trim() }),
          ...(recipeImageUrl && { recipeImage: recipeImageUrl }),
          ...(editForm.difficulty && {
            difficulty: editForm.difficulty as Difficulty,
          }),
          ...(editForm.prepTime && { prepTime: Number(editForm.prepTime) }),
          ...(editForm.cookTime && { cookTime: Number(editForm.cookTime) }),
          ...(editForm.restTime && { restTime: Number(editForm.restTime) }),
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
          ...(stepsChanged && {
            steps: validSteps.map((s) => ({ body: s.body.trim() })),
          }),
          utensilIds: editForm.utensilIds,
        },
      },
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

    if (result?.recipe) {
      setEditForm(buildEditForm(result.recipe, lang));
    }

    setImageFile(null);
    setImagePreview(null);
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (!recipe) return;
    await deleteRecipe({ variables: { id: recipe.id } });
    router.push('/chef/recipes');
  };

  const handleCancel = () => {
    setFieldErrors({});
    setImageFile(null);
    setImagePreview(null);
    if (recipe) setEditForm(buildEditForm(recipe, lang));
    setIsEditing(false);
  };

  const totalTime = recipe
    ? (recipe.prepTime || 0) + (recipe.cookTime || 0) + (recipe.restTime || 0)
    : 0;

  const difficultyLabel =
    DIFFICULTY_OPTIONS.find((d) => d.value === recipe?.difficulty)?.[
      lang === 'el' ? 'labelEl' : 'labelEn'
    ] ?? '';

  if (loading || !recipe || !editForm) {
    return (
      <div className="flex min-h-screen flex-col">
        <ChefNavbar />
        <main className="flex flex-1 items-center justify-center">
          <p className="text-myText-muted">
            {loading ? t('common.loading') : t('chef.recipe_detail.not_found')}
          </p>
        </main>
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
      value: recipe.restTime ?? null,
    },
  ];

  const displayImage = imagePreview ?? recipe.recipeImage;

  return (
    <div className="flex min-h-screen flex-col">
      <ChefNavbar />

      {showDeleteModal && (
        <DeleteConfirm
          title={t('chef.recipe_detail.confirm_delete')}
          confirmLabel={t('common.delete')}
          cancelLabel={t('common.cancel')}
          loading={deleting}
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}

      <main className="flex flex-1 flex-col items-center px-4 py-8 md:px-8">
        <div className="w-full max-w-3xl overflow-hidden rounded-2xl bg-surface shadow-2xl">
          <RecipeHeroImage
            recipeImage={displayImage}
            title_el={recipe.title_el}
            title_en={recipe.title_en}
            lang={lang}
            backHref="/chef/recipes"
          />

          <div className="px-6 pb-2 pt-4">
            <RecipeActionButtons
              isEditing={isEditing}
              saving={saving}
              deleting={deleting}
              onEdit={() => setIsEditing(true)}
              onSave={handleSave}
              onCancel={handleCancel}
              onDelete={() => setShowDeleteModal(true)}
            />
          </div>

          {isEditing && (
            <div className="px-6 pb-2">
              <label className="mb-1 block ">
                {t('chef.article.image_label')}
              </label>
              <div>
                <label
                  htmlFor="recipe-image"
                  className="inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-cookie-300 px-4 py-1.5  text-white transition hover:bg-cookie-400"
                >
                  {t('chef.article.image_label')}
                </label>
                <input
                  id="recipe-image"
                  ref={imageInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>
              {imageFile && (
                <p className="mt-1  text-myText-muted">{imageFile.name}</p>
              )}
            </div>
          )}

          <div className="flex flex-col gap-6 p-6 md:flex-row md:p-8">
            <div className="min-w-0 flex-1">
              {!isEditing && (
                <div className="mb-4 flex items-center gap-2">
                  <Stars rating={avgRating} />
                  <span className="text-myText-muted">
                    {totalRatings > 0
                      ? `${avgRating.toFixed(1)} (${totalRatings})`
                      : t('chef.recipe_detail.no_ratings_yet')}
                  </span>
                </div>
              )}

              <RecipeDescriptionCard
                recipe={recipe}
                lang={lang}
                isEditing={isEditing}
                editForm={editForm}
                difficultyLabel={difficultyLabel}
                onUpdate={update}
              />

              <RecipeIngredientsList
                recipe={recipe}
                lang={lang}
                isEditing={isEditing}
                editForm={editForm}
                fieldError={fieldErrors.ingredients}
                ingredients={allIngredients}
                onUpdate={update}
              />

              <RecipeStepsList
                recipe={recipe}
                lang={lang}
                isEditing={isEditing}
                editForm={editForm}
                onUpdate={update}
              />

              {fieldErrors.steps && (
                <p className="mt-2 text-myRed">{fieldErrors.steps}</p>
              )}

              {(fieldErrors.prepTime || fieldErrors.cookTime) && (
                <p className="mt-2 text-myRed">
                  {fieldErrors.prepTime || fieldErrors.cookTime}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-4 md:w-56 md:flex-shrink-0">
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
        <ScrollToTopButton />
      </main>
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
