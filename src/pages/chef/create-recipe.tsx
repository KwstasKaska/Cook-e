import React, { useState, useRef } from 'react';
import { useRouter } from 'next/router';
import ChefNavbar from '../../components/Chef/ChefNavbar';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import {
  Difficulty,
  RecipeCategory,
  useCreateRecipeMutation,
} from '../../generated/graphql';
import useIsChef from '../../utils/useIsChef';
import {
  FormData,
  IngredientRow,
} from '../../components/Chef/createRecipe/types';
import { uploadToCloudinary } from '../../utils/uploadToCloudinary';

import StepFive from '../../components/Chef/createRecipe/stepFive';
import StepFour from '../../components/Chef/createRecipe/stepFour';
import StepOne from '../../components/Chef/createRecipe/stepOne';
import StepThree from '../../components/Chef/createRecipe/stepThree';
import StepTwo from '../../components/Chef/createRecipe/stepTwo';

export default function CreateRecipe() {
  const { loading: authLoading, isAuthorized } = useIsChef();
  if (authLoading || !isAuthorized) return null;
  return <CreateRecipeContent />;
}

const CreateRecipeContent = () => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const TOTAL_STEPS = 5;

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [createRecipe, { loading }] = useCreateRecipeMutation();
  const [selectedUtensilIds, setSelectedUtensilIds] = useState<number[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [form, setForm] = useState<FormData>({
    title: '',
    image: null,
    personalNote: '',
    prepTime: '',
    cookTime: '',
    restTime: '',
    difficulty: '',
    caloriesTotal: '',
    protein: '',
    carbs: '',
    fat: '',
    category: '',
    summary: '',
    ingredients: [
      { id: 1, ingredientId: 0, quantity: '', unit: '' },
      { id: 2, ingredientId: 0, quantity: '', unit: '' },
      { id: 3, ingredientId: 0, quantity: '', unit: '' },
    ],
    steps: [
      { id: 1, text: '' },
      { id: 2, text: '' },
      { id: 3, text: '' },
    ],
  });

  const update = (field: keyof FormData, value: unknown) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      update('image', URL.createObjectURL(file));
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setImageFile(file);
      update('image', URL.createObjectURL(file));
    }
  };

  const addIngredient = () =>
    update('ingredients', [
      ...form.ingredients,
      { id: Date.now(), ingredientId: 0, quantity: '', unit: '' },
    ]);

  const updateIngredient = (
    id: number,
    field: keyof IngredientRow,
    value: string | number,
  ) =>
    update(
      'ingredients',
      form.ingredients.map((i) => (i.id === id ? { ...i, [field]: value } : i)),
    );

  const removeIngredient = (id: number) =>
    update(
      'ingredients',
      form.ingredients.filter((i) => i.id !== id),
    );

  const addStep = () =>
    update('steps', [...form.steps, { id: Date.now(), text: '' }]);

  const updateStep = (id: number, value: string) =>
    update(
      'steps',
      form.steps.map((s) => (s.id === id ? { ...s, text: value } : s)),
    );

  const removeStep = (id: number) =>
    update(
      'steps',
      form.steps.filter((s) => s.id !== id),
    );

  const toggleUtensil = (id: number) =>
    setSelectedUtensilIds((prev) =>
      prev.includes(id) ? prev.filter((u) => u !== id) : [...prev, id],
    );

  const handleNext = () => {
    const errs: Record<string, string> = {};

    if (currentStep === 1) {
      if (!form.title.trim()) errs.title = t('error.recipe_title_required');
    }

    if (currentStep === 2) {
      if (!form.difficulty)
        errs.difficulty = t('error.recipe_difficulty_required');
      if (!form.prepTime || Number(form.prepTime) <= 0)
        errs.prepTime = t('error.recipe_prep_time_invalid');
      if (!form.cookTime || Number(form.cookTime) <= 0)
        errs.cookTime = t('error.recipe_cook_time_invalid');
    }

    if (currentStep === 4) {
      if (
        form.ingredients.filter(
          (r) => r.ingredientId > 0 && r.quantity.trim() && r.unit.trim(),
        ).length === 0
      )
        errs.ingredients = t('error.recipe_ingredients_required');
    }

    if (Object.keys(errs).length > 0) {
      setFieldErrors(errs);
      return;
    }

    setFieldErrors({});
    setCurrentStep((s) => s + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep((s) => s - 1);
  };

  const handleFinish = async () => {
    setFieldErrors({});

    const validIngredients = form.ingredients.filter(
      (r) => r.ingredientId > 0 && r.quantity.trim() && r.unit.trim(),
    );
    const validSteps = form.steps.filter((s) => s.text.trim());

    if (!form.difficulty) {
      setFieldErrors({ difficulty: t('error.recipe_difficulty_required') });
      return;
    }

    let recipeImageUrl: string | undefined;
    if (imageFile) {
      recipeImageUrl = await uploadToCloudinary(imageFile);
    }

    const res = await createRecipe({
      variables: {
        data: {
          title: form.title.trim(),
          difficulty: form.difficulty as Difficulty,
          prepTime: Number(form.prepTime),
          cookTime: Number(form.cookTime),
          ...(form.restTime &&
            Number(form.restTime) > 0 && { restTime: Number(form.restTime) }),
          ...(form.personalNote.trim() && {
            chefComment: form.personalNote.trim(),
          }),
          ...(form.summary.trim() && { description: form.summary.trim() }),
          ...(form.category && { category: form.category as RecipeCategory }),
          ...(recipeImageUrl && { recipeImage: recipeImageUrl }),
          ...(selectedUtensilIds.length > 0 && {
            utensilIds: selectedUtensilIds,
          }),
          ...(form.caloriesTotal &&
            Number(form.caloriesTotal) > 0 && {
              caloriesTotal: Number(form.caloriesTotal),
            }),
          ...(form.protein &&
            Number(form.protein) > 0 && { protein: Number(form.protein) }),
          ...(form.carbs &&
            Number(form.carbs) > 0 && { carbs: Number(form.carbs) }),
          ...(form.fat && Number(form.fat) > 0 && { fat: Number(form.fat) }),
          ingredients: validIngredients.map((r) => ({
            ingredientId: r.ingredientId,
            quantity: r.quantity,
            unit: r.unit,
          })),
          steps: validSteps.map((s) => ({ body: s.text.trim() })),
        },
      },
    });

    const result = res.data?.createRecipe;
    if (result?.errors?.length) {
      const mapped: Record<string, string> = {};
      result.errors.forEach((e) => {
        mapped[e.field] = t(e.message);
      });
      setFieldErrors(mapped);
      return;
    }
    if (result?.recipe?.id) {
      router.push(`/chef/recipes/${result.recipe.id}`);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <StepOne
            form={form}
            fieldErrors={fieldErrors}
            fileInputRef={fileInputRef}
            onUpdate={update}
            onImageUpload={handleImageUpload}
            onDrop={handleDrop}
          />
        );
      case 2:
        return (
          <StepTwo form={form} fieldErrors={fieldErrors} onUpdate={update} />
        );
      case 3:
        return <StepThree form={form} onUpdate={update} />;
      case 4:
        return (
          <StepFour
            form={form}
            fieldErrors={fieldErrors}
            onAddIngredient={addIngredient}
            onUpdateIngredient={updateIngredient}
            onRemoveIngredient={removeIngredient}
          />
        );
      case 5:
        return (
          <StepFive
            form={form}
            fieldErrors={fieldErrors}
            selectedUtensilIds={selectedUtensilIds}
            onAddStep={addStep}
            onUpdateStep={updateStep}
            onRemoveStep={removeStep}
            onToggleUtensil={toggleUtensil}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen">
      <ChefNavbar />

      <main className="flex flex-1 flex-col items-center px-4 py-8 md:px-8">
        <div className="w-full max-w-3xl lg:max-w-4xl">
          <button onClick={() => router.back()} className="mb-6   transition">
            {t('common.back')}
          </button>
          <h1 className="mb-8 text-center">
            {t('chef.create_recipe.page_title')}
          </h1>
        </div>

        <div className="w-full max-w-3xl lg:max-w-4xl rounded-2xl bg-surface shadow-xl p-7">
          <div className="overflow-y-auto">{renderStep()}</div>

          <div className="mt-8 flex items-center gap-3">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={handleBack}
                className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border-2 border-cookie-400 text-cookie-400 transition hover:bg-cookie-400 hover:text-white"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
            )}
            {currentStep < TOTAL_STEPS ? (
              <button
                type="button"
                onClick={handleNext}
                className="flex-1 rounded-xl border-2 border-cookie-400 px-5 py-1.5 hover:text-white transition hover:bg-cookie-400"
              >
                {t('chef.create_recipe.next_btn')}
              </button>
            ) : (
              <button
                type="button"
                onClick={handleFinish}
                disabled={loading}
                className="flex-1 rounded-xl border-2 border-cookie-400 px-5 py-1.5 hover:text-white transition hover:bg-cookie-400 disabled:opacity-50"
              >
                {loading
                  ? t('chef.create_recipe.saving')
                  : t('chef.create_recipe.finish_btn')}
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export async function getServerSideProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}
