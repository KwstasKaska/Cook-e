import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import ChefNavbar from '../../components/Chef/ChefNavbar';
import Footer from '../../components/Users/Footer';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';

// ─── Types
interface Ingredient {
  id: number;
  quantity: string;
  name: string;
}

interface ExecutionStep {
  id: number;
  text: string;
}

interface FormData {
  // Step 1
  title: string;
  image: string | null;
  // Step 2
  personalNote: string;
  prepTime: string;
  cookTime: string;
  restTime: string;
  difficulty: 'easy' | 'medium' | 'hard' | '';
  // Step 3
  mealType: string;
  cuisine: string;
  occasion: string;
  summary: string;
  // Step 4
  ingredients: Ingredient[];
  // Step 5
  steps: ExecutionStep[];
}

// ─── Stars
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
        className="h-3.5 w-3.5"
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

// ─── Live Preview Panel
const LivePreview = ({
  form,
  step,
  onBack,
}: {
  form: FormData;
  step: number;
  onBack: () => void;
}) => {
  const { t } = useTranslation('common');

  const totalTime =
    (parseInt(form.prepTime) || 0) +
    (parseInt(form.cookTime) || 0) +
    (parseInt(form.restTime) || 0);

  const difficultyLabel =
    form.difficulty === 'easy'
      ? t('chef.create_recipe.easy')
      : form.difficulty === 'medium'
        ? t('chef.create_recipe.medium')
        : form.difficulty === 'hard'
          ? t('chef.create_recipe.hard')
          : '';

  // Step 1 preview: only show placeholder
  if (step === 1 && !form.title) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-sm text-gray-400 italic">
          {t('chef.create_recipe.preview_placeholder')}
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col overflow-y-auto">
      {/* Back button */}
      {step > 1 && (
        <button
          onClick={onBack}
          className="mb-3 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-white shadow transition hover:bg-gray-100"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="#3F4756"
            className="h-3.5 w-3.5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
            />
          </svg>
        </button>
      )}

      {/* Hero images */}
      <div
        className="flex gap-1 mb-3 flex-shrink-0"
        style={{ height: '130px' }}
      >
        <div className="relative flex-1 overflow-hidden rounded-xl bg-gray-200">
          {form.image ? (
            <Image src={form.image} alt="hero1" fill className="object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center text-gray-400 text-xs">
              {t('chef.create_recipe.photo_slot')}
            </div>
          )}
        </div>
        <div className="relative flex-1 overflow-hidden rounded-xl bg-gray-200">
          {form.image ? (
            <Image src={form.image} alt="hero2" fill className="object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center text-gray-400 text-xs">
              {t('chef.create_recipe.photo_slot')}
            </div>
          )}
        </div>
      </div>

      {/* Rating (shown from step 2+) */}
      {step >= 2 && (
        <div className="mb-2 flex items-center gap-1 flex-shrink-0">
          <Stars rating={4.9} />
          <span className="text-xs text-gray-500">4.9 / 5 (30)</span>
        </div>
      )}

      {/* Description + author block (step 2+) */}
      {step >= 2 && form.personalNote && (
        <div
          className="mb-3 rounded-xl p-3 flex-shrink-0"
          style={{ backgroundColor: '#B3D5F8' }}
        >
          <p className="mb-2 text-xs italic" style={{ color: '#3F4756' }}>
            "{form.personalNote}"
          </p>
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-full bg-gray-300 flex-shrink-0" />
            <span
              className="text-xs font-semibold"
              style={{ color: '#3F4756' }}
            >
              Κασκαντίρης Κωσνταντίνος
            </span>
          </div>
        </div>
      )}

      {/* Συστατικά (step 4+) */}
      {step >= 4 && form.ingredients.some((i) => i.name) && (
        <div className="mb-2 flex-shrink-0">
          <p className="text-xs font-bold mb-1" style={{ color: '#3F4756' }}>
            {t('chef.create_recipe.ingredients_label')}:
          </p>
          <ol className="flex flex-col gap-0.5 list-decimal list-inside">
            {form.ingredients
              .filter((i) => i.name)
              .map((ing) => (
                <li key={ing.id} className="text-xs text-gray-600">
                  {ing.quantity && (
                    <span className="font-semibold">{ing.quantity} </span>
                  )}
                  {ing.name}
                </li>
              ))}
          </ol>
        </div>
      )}

      {/* Εκτέλεση (step 5+) */}
      {step >= 5 && form.steps.some((s) => s.text) && (
        <div className="mb-2 flex-shrink-0">
          <p className="text-xs font-bold mb-1" style={{ color: '#3F4756' }}>
            {t('chef.create_recipe.execution_label')}:
          </p>
          <div className="flex flex-col gap-1">
            {form.steps
              .filter((s) => s.text)
              .map((s) => (
                <div key={s.id} className="flex items-start gap-1.5">
                  <div className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 rounded-full border border-gray-400" />
                  <span className="text-xs text-gray-600 leading-relaxed">
                    {s.text}
                  </span>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Right side mini cards — shown from step 2 */}
      {step >= 2 && (
        <div className="mt-auto flex flex-col gap-2 pt-2">
          {/* Recipe info mini card */}
          <div
            className="overflow-hidden rounded-xl"
            style={{ backgroundColor: '#3F4756' }}
          >
            <div className="flex gap-2 p-2">
              <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-lg bg-gray-600">
                {form.image && (
                  <Image
                    src={form.image}
                    alt="dish"
                    fill
                    className="object-cover"
                  />
                )}
              </div>
              <div>
                <p className="text-xs font-bold text-white">
                  {form.title || t('chef.create_recipe.recipe_title_preview')}
                </p>
                {form.difficulty && (
                  <p className="text-xs text-gray-300">
                    {t('chef.recipe_detail.difficulty')} {difficultyLabel}
                  </p>
                )}
                {form.personalNote && (
                  <p className="text-xs text-gray-400 line-clamp-2 mt-0.5">
                    {form.personalNote}
                  </p>
                )}
                <div className="mt-1 flex items-center justify-between">
                  <Stars rating={4.9} />
                  {totalTime > 0 && (
                    <span className="text-xs text-gray-300">
                      {t('chef.recipe_detail.time_label')} {totalTime}{' '}
                      {t('chef.create_recipe.minutes')}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Time card (step 2+) */}
          {(form.prepTime || form.cookTime || form.restTime) && (
            <div className="rounded-xl border border-gray-200 p-2 bg-white">
              <p
                className="text-center text-xs font-bold mb-1"
                style={{ color: '#3F4756' }}
              >
                {t('chef.recipe_detail.implementation_time')} {totalTime}{' '}
                {t('chef.create_recipe.minutes')}
              </p>
              {form.prepTime && (
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">
                    {t('chef.create_recipe.prep_time')}
                  </span>
                  <span className="font-semibold" style={{ color: '#377CC3' }}>
                    {form.prepTime} {t('chef.create_recipe.minutes')}
                  </span>
                </div>
              )}
              {form.cookTime && (
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">
                    {t('chef.create_recipe.cook_time')}
                  </span>
                  <span className="font-semibold" style={{ color: '#377CC3' }}>
                    {form.cookTime} {t('chef.create_recipe.minutes')}
                  </span>
                </div>
              )}
              {form.restTime && (
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">
                    {t('chef.create_recipe.rest_time')}
                  </span>
                  <span className="font-semibold" style={{ color: '#377CC3' }}>
                    {form.restTime} {t('chef.create_recipe.minutes')}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Food type card (step 3+) */}
          {step >= 3 && (form.mealType || form.cuisine || form.occasion) && (
            <div className="rounded-xl border border-gray-200 p-2 bg-white">
              <p
                className="text-center text-xs font-bold mb-1"
                style={{ color: '#3F4756' }}
              >
                {t('chef.recipe_detail.food_type')}
              </p>
              {form.mealType && (
                <div>
                  <p className="text-xs text-gray-500">
                    {t('chef.recipe_detail.dish_type')}
                  </p>
                  <p
                    className="text-xs font-medium italic border-b pb-0.5 mb-1"
                    style={{ color: '#377CC3', borderColor: '#B3D5F8' }}
                  >
                    {form.mealType}
                  </p>
                </div>
              )}
              {form.cuisine && (
                <div>
                  <p className="text-xs text-gray-500">
                    {t('chef.recipe_detail.cuisine')}
                  </p>
                  <p
                    className="text-xs font-medium italic border-b pb-0.5 mb-1"
                    style={{ color: '#377CC3', borderColor: '#B3D5F8' }}
                  >
                    {form.cuisine}
                  </p>
                </div>
              )}
              {form.occasion && (
                <div>
                  <p className="text-xs text-gray-500">
                    {t('chef.recipe_detail.occasion')}
                  </p>
                  <p
                    className="text-xs font-medium italic"
                    style={{ color: '#377CC3' }}
                  >
                    {form.occasion}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ─── Input style helpers
const inputClass =
  'w-full border-b border-gray-300 bg-transparent py-2 text-sm outline-none focus:border-myBlue-200 transition placeholder:text-gray-300';
const labelClass = 'mb-1 block text-base font-black';

// ─── Main page
export default function CreateRecipe() {
  const { t } = useTranslation('common');
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const TOTAL_STEPS = 5;

  const [form, setForm] = useState<FormData>({
    title: '',
    image: null,
    personalNote: '',
    prepTime: '',
    cookTime: '',
    restTime: '',
    difficulty: '',
    mealType: '',
    cuisine: '',
    occasion: '',
    summary: '',
    ingredients: [
      { id: 1, quantity: '', name: '' },
      { id: 2, quantity: '', name: '' },
      { id: 3, quantity: '', name: '' },
    ],
    steps: [
      { id: 1, text: '' },
      { id: 2, text: '' },
      { id: 3, text: '' },
    ],
  });

  const update = (field: keyof FormData, value: any) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      update('image', url);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      update('image', url);
    }
  };

  const addIngredient = () =>
    update('ingredients', [
      ...form.ingredients,
      { id: Date.now(), quantity: '', name: '' },
    ]);

  const updateIngredient = (
    id: number,
    field: 'quantity' | 'name',
    value: string,
  ) =>
    update(
      'ingredients',
      form.ingredients.map((i) => (i.id === id ? { ...i, [field]: value } : i)),
    );

  const addStep = () =>
    update('steps', [...form.steps, { id: Date.now(), text: '' }]);

  const updateStep = (id: number, value: string) =>
    update(
      'steps',
      form.steps.map((s) => (s.id === id ? { ...s, text: value } : s)),
    );

  const handleNext = () => {
    if (currentStep < TOTAL_STEPS) setCurrentStep((s) => s + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep((s) => s - 1);
  };

  const handleFinish = () => {
    // TODO: submit to GraphQL
    router.push('/chef/recipes');
  };

  const difficultyOptions: { value: FormData['difficulty']; label: string }[] =
    [
      { value: 'easy', label: t('chef.create_recipe.easy') },
      { value: 'medium', label: t('chef.create_recipe.medium') },
      { value: 'hard', label: t('chef.create_recipe.hard') },
    ];

  const timeFields: {
    label: string;
    field: 'prepTime' | 'cookTime' | 'restTime';
  }[] = [
    { label: t('chef.create_recipe.prep_time'), field: 'prepTime' },
    { label: t('chef.create_recipe.cook_time'), field: 'cookTime' },
    { label: t('chef.create_recipe.rest_time'), field: 'restTime' },
  ];

  const foodTypeFields: {
    label: string;
    field: 'mealType' | 'cuisine' | 'occasion';
    placeholder: string;
  }[] = [
    {
      label: t('chef.create_recipe.dish_type_label'),
      field: 'mealType',
      placeholder: t('chef.create_recipe.dish_type_placeholder'),
    },
    {
      label: t('chef.create_recipe.cuisine_label'),
      field: 'cuisine',
      placeholder: t('chef.create_recipe.cuisine_placeholder'),
    },
    {
      label: t('chef.create_recipe.occasion_label'),
      field: 'occasion',
      placeholder: t('chef.create_recipe.occasion_placeholder'),
    },
  ];

  // ─── Step forms
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div>
            <h2
              className="mb-5 text-2xl font-black"
              style={{ color: '#EAB308' }}
            >
              {t('chef.create_recipe.step1_title')}
            </h2>

            <label className={labelClass} style={{ color: '#3F4756' }}>
              {t('chef.create_recipe.recipe_name_label')}
            </label>
            <input
              type="text"
              placeholder={t('chef.create_recipe.recipe_name_placeholder')}
              value={form.title}
              onChange={(e) => update('title', e.target.value)}
              className={inputClass}
              style={{ color: '#3F4756' }}
            />

            <label
              className={`${labelClass} mt-6`}
              style={{ color: '#3F4756' }}
            >
              {t('chef.create_recipe.photo_label')}
            </label>
            <div
              className="mt-2 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-gray-300 p-10 text-center transition hover:border-gray-400"
              onClick={() => fileInputRef.current?.click()}
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
            >
              {form.image ? (
                <div className="relative h-32 w-full overflow-hidden rounded-xl">
                  <Image
                    src={form.image}
                    alt="preview"
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.2}
                    stroke="#3F4756"
                    className="h-12 w-12"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z"
                    />
                  </svg>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    {t('chef.create_recipe.photo_upload_hint')}
                  </p>
                </>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div>
            <h2
              className="mb-5 text-2xl font-black"
              style={{ color: '#EAB308' }}
            >
              {t('chef.create_recipe.step2_title')}
            </h2>

            <label className={labelClass} style={{ color: '#3F4756' }}>
              {t('chef.create_recipe.personal_tip_label')}
            </label>
            <input
              type="text"
              placeholder={t('chef.create_recipe.personal_tip_placeholder')}
              value={form.personalNote}
              onChange={(e) => update('personalNote', e.target.value)}
              className={inputClass}
              style={{ color: '#3F4756' }}
            />

            <h3
              className="mb-3 mt-6 text-base font-black"
              style={{ color: '#3F4756' }}
            >
              {t('chef.create_recipe.total_time_label')}
            </h3>
            <div className="flex flex-col gap-3">
              {timeFields.map(({ label, field }) => (
                <div
                  key={field}
                  className="flex items-center justify-between gap-4"
                >
                  <span className="text-sm" style={{ color: '#3F4756' }}>
                    {label}
                  </span>
                  <input
                    type="text"
                    value={form[field]}
                    onChange={(e) => update(field, e.target.value)}
                    placeholder={`10 ${t('chef.create_recipe.minutes')}`}
                    className="w-28 border-b border-gray-300 bg-transparent py-1 text-sm outline-none text-right font-semibold"
                    style={{ color: '#EAB308' }}
                  />
                </div>
              ))}
            </div>

            <h3
              className="mb-3 mt-6 text-base font-black"
              style={{ color: '#3F4756' }}
            >
              {t('chef.create_recipe.difficulty_label')}
            </h3>
            <div className="flex gap-3">
              {difficultyOptions.map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => update('difficulty', value)}
                  className="rounded-full px-5 py-2 text-sm font-semibold transition"
                  style={{
                    backgroundColor:
                      form.difficulty === value ? '#EAB308' : '#F5F0D8',
                    color: '#3F4756',
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        );

      case 3:
        return (
          <div>
            <h2
              className="mb-5 text-2xl font-black"
              style={{ color: '#EAB308' }}
            >
              {t('chef.create_recipe.step3_title')}
            </h2>

            <h3
              className="mb-4 text-base font-black"
              style={{ color: '#3F4756' }}
            >
              {t('chef.create_recipe.food_type_label')}
            </h3>

            {foodTypeFields.map(({ label, field, placeholder }) => (
              <div key={field} className="mb-4">
                <label
                  className="mb-1 block text-sm font-semibold"
                  style={{ color: '#3F4756' }}
                >
                  {label}
                </label>
                <input
                  type="text"
                  placeholder={placeholder}
                  value={form[field]}
                  onChange={(e) => update(field, e.target.value)}
                  className={inputClass}
                  style={{ color: '#EAB308' }}
                />
              </div>
            ))}

            <h3
              className="mb-3 mt-2 text-base font-black"
              style={{ color: '#3F4756' }}
            >
              {t('chef.create_recipe.summary_label')}
            </h3>
            <div className="flex flex-col gap-2">
              {[0, 1, 2].map((i) => (
                <div key={i} className="border-b border-gray-200" />
              ))}
              <textarea
                value={form.summary}
                onChange={(e) => update('summary', e.target.value)}
                placeholder={t('chef.create_recipe.summary_placeholder')}
                rows={3}
                className="w-full resize-none bg-transparent text-sm outline-none placeholder:text-gray-300"
                style={{ color: '#3F4756' }}
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div>
            <h2
              className="mb-5 text-2xl font-black"
              style={{ color: '#EAB308' }}
            >
              {t('chef.create_recipe.step4_title')}
            </h2>

            <h3
              className="mb-4 text-base font-black"
              style={{ color: '#3F4756' }}
            >
              {t('chef.create_recipe.ingredients_label')}
            </h3>

            <div className="flex flex-col gap-3">
              {form.ingredients.map((ing) => (
                <div
                  key={ing.id}
                  className="flex items-center gap-4 border-b border-gray-200 pb-2"
                >
                  <input
                    type="text"
                    placeholder="60g"
                    value={ing.quantity}
                    onChange={(e) =>
                      updateIngredient(ing.id, 'quantity', e.target.value)
                    }
                    className="w-16 bg-transparent text-sm font-semibold outline-none placeholder:text-gray-300"
                    style={{ color: '#3F4756' }}
                  />
                  <input
                    type="text"
                    placeholder={t('chef.create_recipe.ingredient_placeholder')}
                    value={ing.name}
                    onChange={(e) =>
                      updateIngredient(ing.id, 'name', e.target.value)
                    }
                    className="flex-1 bg-transparent text-sm italic outline-none placeholder:text-gray-300"
                    style={{ color: '#3F4756' }}
                  />
                </div>
              ))}
            </div>

            <button
              onClick={addIngredient}
              className="mt-5 rounded-full border px-5 py-2 text-sm font-semibold transition hover:bg-gray-50"
              style={{ borderColor: '#3F4756', color: '#3F4756' }}
            >
              {t('chef.create_recipe.add_ingredient')}
            </button>
          </div>
        );

      case 5:
        return (
          <div>
            <h2
              className="mb-5 text-2xl font-black"
              style={{ color: '#EAB308' }}
            >
              {t('chef.create_recipe.step5_title')}
            </h2>

            <h3
              className="mb-4 text-base font-black"
              style={{ color: '#3F4756' }}
            >
              {t('chef.create_recipe.execution_label')}
            </h3>

            <div className="flex flex-col gap-4">
              {form.steps.map((s, i) => (
                <div key={s.id}>
                  <p
                    className="mb-1 text-sm font-bold italic"
                    style={{ color: '#3F4756' }}
                  >
                    {t('chef.create_recipe.step_label', { number: i + 1 })}
                  </p>
                  <textarea
                    value={s.text}
                    onChange={(e) => updateStep(s.id, e.target.value)}
                    placeholder={t('chef.create_recipe.step_placeholder')}
                    rows={3}
                    className="w-full resize-none rounded-xl border-b border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none placeholder:text-gray-300 focus:border-gray-400"
                    style={{ color: '#3F4756' }}
                  />
                </div>
              ))}
            </div>

            <button
              onClick={addStep}
              className="mt-4 rounded-full border px-5 py-2 text-sm font-semibold transition hover:bg-gray-50"
              style={{ borderColor: '#3F4756', color: '#3F4756' }}
            >
              {t('chef.create_recipe.add_step')}
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div
      className="flex min-h-screen flex-col"
      style={{ backgroundColor: '#3F4756' }}
    >
      <ChefNavbar />

      <main className="flex flex-1 flex-col items-center px-4 py-6 md:px-8">
        {/* Page title */}
        <h1
          className="mb-6 text-3xl italic"
          style={{ color: 'white', fontFamily: 'Georgia, serif' }}
        >
          {t('chef.create_recipe.page_title')}
        </h1>

        {/* Split card wrapper */}
        <div
          className="w-full max-w-4xl overflow-hidden rounded-2xl shadow-2xl"
          style={{ minHeight: '500px' }}
        >
          <div
            className="flex flex-col md:flex-row"
            style={{ minHeight: '500px' }}
          >
            {/* LEFT — form panel */}
            <div className="flex flex-col justify-between bg-white p-7 md:w-1/2">
              <div className="flex-1 overflow-y-auto">{renderStep()}</div>

              {/* Bottom actions */}
              <div className="mt-6 flex items-center gap-3 flex-shrink-0">
                <button
                  onClick={handleBack}
                  className="rounded-full border px-5 py-2.5 text-sm font-semibold transition hover:bg-gray-50"
                  style={{ borderColor: '#3F4756', color: '#3F4756' }}
                >
                  {t('chef.create_recipe.preview_btn')}
                </button>
                {currentStep < TOTAL_STEPS ? (
                  <button
                    onClick={handleNext}
                    className="flex-1 rounded-full py-2.5 text-sm font-bold text-white transition hover:opacity-90"
                    style={{ backgroundColor: '#3F4756' }}
                  >
                    {t('chef.create_recipe.next_btn')}
                  </button>
                ) : (
                  <button
                    onClick={handleFinish}
                    className="flex-1 rounded-full py-2.5 text-sm font-bold text-white transition hover:opacity-90"
                    style={{ backgroundColor: '#3F4756' }}
                  >
                    {t('chef.create_recipe.finish_btn')}
                  </button>
                )}
              </div>
            </div>

            {/* Spine decoration */}
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

            {/* RIGHT — live preview */}
            <div
              className="flex flex-col p-5 md:w-1/2"
              style={{ backgroundColor: '#E8EEF5', minHeight: '500px' }}
            >
              <LivePreview form={form} step={currentStep} onBack={handleBack} />
            </div>
          </div>
        </div>

        {/* Step indicator dots */}
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
