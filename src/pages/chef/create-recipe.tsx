import React, { useState, useRef } from 'react';
import { useRouter } from 'next/router';
import ChefNavbar from '../../components/Chef/ChefNavbar';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import {
  Difficulty,
  RecipeCategory,
  useCreateRecipeMutation,
  useIngredientsQuery,
} from '../../generated/graphql';
import useIsChef from '../../utils/useIsChef';
import {
  FormData,
  IngredientRow,
} from '../../components/Chef/createRecipe/types';
import { uploadToCloudinary } from '../../utils/uploadToCloudinary';

import LivePreview from '../../components/Chef/createRecipe/livePreview';
import StepFive from '../../components/Chef/createRecipe/stepFive';
import StepFour from '../../components/Chef/createRecipe/stepFour';
import StepOne from '../../components/Chef/createRecipe/stepOne';
import StepThree from '../../components/Chef/createRecipe/stepThree';
import StepTwo from '../../components/Chef/createRecipe/stepTwo';

//  Main page

export default function CreateRecipe() {
  const { loading: authLoading, isAuthorized } = useIsChef();
  const { t, i18n } = useTranslation('common');
  const lang = i18n.language as 'el' | 'en';
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const TOTAL_STEPS = 5;

  const [serverError, setServerError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

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
    cuisine: '',
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

  if (authLoading || !isAuthorized) return null;

  // ── GraphQL ────────────────────────────────────────────────────────────────
  const { data: ingredientsData } = useIngredientsQuery();
  const [createRecipe, { loading }] = useCreateRecipeMutation();
  const [selectedUtensilIds, setSelectedUtensilIds] = useState<number[]>([]);

  const ingredientName = (id: number) => {
    const found = ingredientsData?.ingredients.find((i) => i.id === id);
    if (!found) return '';
    return lang === 'el' ? found.name_el : found.name_en;
  };

  // ── Form helpers ───────────────────────────────────────────────────────────
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

  // ── Ingredient helpers ─────────────────────────────────────────────────────
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

  // ── Step helpers ───────────────────────────────────────────────────────────
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

  // ── Utensil toggle ─────────────────────────────────────────────────────────
  const toggleUtensil = (id: number) =>
    setSelectedUtensilIds((prev) =>
      prev.includes(id) ? prev.filter((u) => u !== id) : [...prev, id],
    );

  // ── Navigation ─────────────────────────────────────────────────────────────
  const handleNext = () => {
    if (currentStep < TOTAL_STEPS) setCurrentStep((s) => s + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep((s) => s - 1);
  };

  // ── Submit ─────────────────────────────────────────────────────────────────
  const handleFinish = async () => {
    setServerError('');
    setFieldErrors({});

    const validIngredients = form.ingredients.filter(
      (r) => r.ingredientId > 0 && r.quantity.trim() && r.unit.trim(),
    );
    const validSteps = form.steps.filter((s) => s.text.trim());

    const errs: Record<string, string> = {};
    if (!form.title.trim()) errs.title = t('chef.create_recipe.error_title');
    if (!form.difficulty)
      errs.difficulty = t('chef.create_recipe.error_difficulty');
    if (!form.prepTime || Number(form.prepTime) <= 0)
      errs.prepTime = t('chef.create_recipe.error_prep_time');
    if (!form.cookTime || Number(form.cookTime) <= 0)
      errs.cookTime = t('chef.create_recipe.error_cook_time');
    if (validIngredients.length === 0)
      errs.ingredients = t('chef.create_recipe.error_ingredients');
    if (validSteps.length === 0)
      errs.steps = t('chef.create_recipe.error_steps');
    if (Object.keys(errs).length > 0) {
      setFieldErrors(errs);
      return;
    }

    try {
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
              Number(form.restTime) > 0 && {
                restTime: Number(form.restTime),
              }),
            ...(form.personalNote.trim() && {
              chefComment: form.personalNote.trim(),
            }),
            ...(form.summary.trim() && { description: form.summary.trim() }),
            ...(form.category && { category: form.category as RecipeCategory }),
            ...(form.cuisine.trim() && { foodEthnicity: form.cuisine.trim() }),
            ...(recipeImageUrl && { recipeImage: recipeImageUrl }),
            ...(selectedUtensilIds.length > 0 && {
              utensilIds: selectedUtensilIds,
            }),
            ...(form.caloriesTotal &&
              Number(form.caloriesTotal) > 0 && {
                caloriesTotal: Number(form.caloriesTotal),
              }),
            ...(form.protein &&
              Number(form.protein) > 0 && {
                protein: Number(form.protein),
              }),
            ...(form.carbs &&
              Number(form.carbs) > 0 && {
                carbs: Number(form.carbs),
              }),
            ...(form.fat &&
              Number(form.fat) > 0 && {
                fat: Number(form.fat),
              }),
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
          mapped[e.field] = e.message;
        });
        setFieldErrors(mapped);
        return;
      }
      if (result?.recipe?.id) {
        router.push(`/chef/recipes/${result.recipe.id}`);
      }
    } catch {
      setServerError(t('chef.create_recipe.error_server'));
    }
  };

  // ── Step render ────────────────────────────────────────────────────────────
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
            serverError={serverError}
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

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div
      className="flex min-h-screen flex-col"
      style={{ backgroundColor: '#3F4756' }}
    >
      <ChefNavbar />

      <main className="flex flex-1 flex-col items-center px-4 py-6 md:px-8">
        <h1
          className="mb-6 text-3xl italic"
          style={{ color: 'white', fontFamily: 'Georgia, serif' }}
        >
          {t('chef.create_recipe.page_title')}
        </h1>

        {/* Split card */}
        <div
          className="w-full max-w-4xl overflow-hidden rounded-2xl shadow-2xl"
          style={{ minHeight: '500px' }}
        >
          <div
            className="flex flex-col md:flex-row"
            style={{ minHeight: '500px' }}
          >
            {/* LEFT — form, full width on mobile, half on desktop */}
            <div className="flex flex-col justify-between bg-white p-7 md:w-1/2">
              <div className="flex-1 overflow-y-auto">{renderStep()}</div>

              <div className="mt-6 flex items-center gap-3 flex-shrink-0">
                <button
                  type="button"
                  onClick={handleBack}
                  className="rounded-full border px-5 py-2.5 text-sm font-semibold transition hover:bg-gray-50"
                  style={{ borderColor: '#3F4756', color: '#3F4756' }}
                >
                  {t('chef.create_recipe.preview_btn')}
                </button>
                {currentStep < TOTAL_STEPS ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="flex-1 rounded-full py-2.5 text-sm font-bold text-white transition hover:opacity-90"
                    style={{ backgroundColor: '#3F4756' }}
                  >
                    {t('chef.create_recipe.next_btn')}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleFinish}
                    disabled={loading}
                    className="flex-1 rounded-full py-2.5 text-sm font-bold text-white transition hover:opacity-90 disabled:opacity-50"
                    style={{ backgroundColor: '#3F4756' }}
                  >
                    {loading
                      ? t('chef.create_recipe.saving')
                      : t('chef.create_recipe.finish_btn')}
                  </button>
                )}
              </div>
            </div>

            {/* Spine — desktop only */}
            <div
              className="hidden md:flex flex-col items-center justify-center w-8 flex-shrink-0"
              style={{ backgroundColor: '#B3D5F8' }}
            >
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="my-2 h-6 w-4 rounded-full"
                  style={{ backgroundColor: '#3F4756', opacity: 0.4 }}
                />
              ))}
            </div>

            {/* RIGHT — live preview, desktop only */}
            <div
              className="hidden md:flex flex-col p-5 md:w-1/2"
              style={{ backgroundColor: '#E8EEF5', minHeight: '500px' }}
            >
              <LivePreview
                form={form}
                step={currentStep}
                onBack={handleBack}
                ingredientName={ingredientName}
              />
            </div>
          </div>
        </div>

        {/* Step dots */}
        <div className="mt-4 flex gap-2">
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <div
              key={i}
              className="h-2 rounded-full transition-all"
              style={{
                width: currentStep === i + 1 ? '24px' : '8px',
                backgroundColor:
                  currentStep === i + 1 ? '#EAB308' : 'rgba(255,255,255,0.4)',
              }}
            />
          ))}
        </div>
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
