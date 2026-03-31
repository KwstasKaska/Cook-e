import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import ChefNavbar from '../../../components/Chef/ChefNavbar';
import Footer from '../../../components/Users/Footer';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';

// ─── Types
interface RecipeDetail {
  id: number;
  title: string;
  description: string;
  author: string;
  authorAvatar: string;
  rating: number;
  ratingCount: number;
  difficulty: string;
  prepTime: number;
  cookTime: number;
  restTime: number;
  totalTime: number;
  persons: number;
  heroImage1: string;
  heroImage2: string;
  dishImage: string;
  ingredients: string[];
  utensils: string[];
  steps: string[];
  mealType: string;
  cuisine: string;
  occasion: string;
}

// ─── Fake data
const FAKE_RECIPE: RecipeDetail = {
  id: 1,
  title: 'Μακαρόνια με κιμά',
  description:
    'Lorem ipsum dolor sit amet, consectetur eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  author: 'Κασκαντίρης Κωσνταντίνος',
  authorAvatar: '/images/chef-avatar.jpg',
  rating: 4.9,
  ratingCount: 30,
  difficulty: 'Εύκολο',
  prepTime: 10,
  cookTime: 10,
  restTime: 5,
  totalTime: 25,
  persons: 2,
  heroImage1: '/images/food.jpg',
  heroImage2: '/images/food.jpg',
  dishImage: '/images/food.jpg',
  ingredients: [
    'in arcu cursus euismod quis viverra nibh',
    'in arcu cursus euismod quis viverra nibh',
    'in arcu cursus euismod quis viverra nibh',
    'in arcu cursus euismod quis viverra nibh',
    'in arcu cursus euismod quis viverra nibh',
    'in arcu cursus euismod quis viverra nibh',
  ],
  utensils: [
    'in arcu cursus euismod quis viverra nibh',
    'in arcu cursus euismod quis viverra nibh',
  ],
  steps: [
    'in arcu cursus euismod quis viverra nibh',
    'in arcu cursus euismod quis viverra nibh',
    'in arcu cursus euismod quis viverra nibh',
    'in arcu cursus euismod quis viverra nibh',
    'in arcu cursus euismod quis viverra nibh',
    'in arcu cursus euismod quis viverra nibh',
    'in arcu cursus euismod quis viverra nibh',
    'in arcu cursus euismod quis viverra nibh',
    'in arcu cursus euismod quis viverra nibh',
  ],
  mealType: 'Μεσημεριανό',
  cuisine: 'Ιταλική',
  occasion: 'Δείπνο με σύντροφο',
};

// ─── Stars
const Stars = ({
  rating,
  size = 'md',
}: {
  rating: number;
  size?: 'sm' | 'md';
}) => {
  const sz = size === 'md' ? 'h-5 w-5' : 'h-3.5 w-3.5';
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill={i < Math.round(rating) ? '#EAB308' : 'none'}
          stroke="#EAB308"
          strokeWidth={i < Math.round(rating) ? 0 : 1.5}
          className={sz}
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
};

// ─── Editable list
const EditableList = ({
  items,
  onChange,
  addLabel,
  numbered = false,
}: {
  items: string[];
  onChange: (items: string[]) => void;
  addLabel: string;
  numbered?: boolean;
}) => (
  <div className="flex flex-col gap-2">
    {items.map((item, i) => (
      <div key={i} className="flex items-start gap-2">
        {numbered ? (
          <span className="mt-2 w-4 flex-shrink-0 text-xs font-bold text-gray-400">
            {i + 1}.
          </span>
        ) : (
          <div className="mt-2.5 h-4 w-4 flex-shrink-0 rounded-full border-2 border-gray-300" />
        )}
        <textarea
          value={item}
          onChange={(e) => {
            const u = [...items];
            u[i] = e.target.value;
            onChange(u);
          }}
          rows={2}
          className="flex-1 resize-none rounded-lg border border-gray-200 bg-gray-50 px-2 py-1.5 text-sm outline-none focus:border-blue-300 transition"
          style={{ color: '#3F4756' }}
        />
        <button
          onClick={() => onChange(items.filter((_, idx) => idx !== i))}
          className="mt-1.5 flex-shrink-0 text-gray-300 transition hover:text-red-400"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="h-4 w-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    ))}
    <button
      onClick={() => onChange([...items, ''])}
      className="mt-1 self-start rounded-full border px-4 py-1.5 text-xs font-semibold transition hover:bg-gray-50"
      style={{ borderColor: '#3F4756', color: '#3F4756' }}
    >
      + {addLabel}
    </button>
  </div>
);

// ─── Main page
export default function ChefSingleRecipe() {
  const { t } = useTranslation('common');
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState<RecipeDetail>({ ...FAKE_RECIPE });

  const update = (field: keyof RecipeDetail, value: any) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSave = () => {
    // TODO: GraphQL mutation with `form`
    setIsEditing(false);
  };

  const handleCancel = () => {
    setForm({ ...FAKE_RECIPE });
    setIsEditing(false);
  };

  const totalTime =
    (parseInt(String(form.prepTime)) || 0) +
    (parseInt(String(form.cookTime)) || 0) +
    (parseInt(String(form.restTime)) || 0);

  const difficultyOptions = [
    t('chef.create_recipe.easy'),
    t('chef.create_recipe.medium'),
    t('chef.create_recipe.hard'),
  ];

  const timeBreakdown = [
    { label: t('chef.recipe_detail.prep_time'), field: 'prepTime' as const },
    { label: t('chef.recipe_detail.cook_time'), field: 'cookTime' as const },
    { label: t('chef.recipe_detail.rest_time'), field: 'restTime' as const },
  ];

  const foodTypeFields = [
    { label: t('chef.recipe_detail.dish_type'), field: 'mealType' as const },
    { label: t('chef.recipe_detail.cuisine'), field: 'cuisine' as const },
    { label: t('chef.recipe_detail.occasion'), field: 'occasion' as const },
  ];

  return (
    <div
      className="flex min-h-screen flex-col"
      style={{ backgroundColor: '#3F4756' }}
    >
      <ChefNavbar />

      <main className="flex flex-1 flex-col items-center px-4 py-8 md:px-8">
        <div className="w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl">
          {/* ── Hero ──────────────────────────────────────────────── */}
          <div className="relative flex h-56 md:h-72">
            <button
              onClick={() => router.back()}
              className="absolute left-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white shadow transition hover:bg-gray-100"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="#3F4756"
                className="h-4 w-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
                />
              </svg>
            </button>
            <div className="relative w-1/2 overflow-hidden">
              <Image
                src={form.heroImage1}
                alt="Recipe"
                fill
                className="object-cover"
              />
            </div>
            <div className="relative w-1/2 overflow-hidden">
              <Image
                src={form.heroImage2}
                alt="Recipe"
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* ── Body ──────────────────────────────────────────────── */}
          <div className="flex flex-col gap-6 p-6 md:flex-row md:p-8">
            {/* LEFT column */}
            <div className="flex-1">
              {/* Rating */}
              <div className="mb-4 flex items-center gap-2">
                <Stars rating={form.rating} size="md" />
                <span className="text-sm text-gray-600">
                  {form.rating}/ 5 ({form.ratingCount})
                </span>
              </div>

              {/* Description + author */}
              <div
                className="mb-6 rounded-xl p-4"
                style={{ backgroundColor: '#B3D5F8' }}
              >
                {isEditing ? (
                  <textarea
                    value={form.description}
                    onChange={(e) => update('description', e.target.value)}
                    rows={4}
                    className="mb-2 w-full resize-none rounded-lg border border-blue-200 bg-white px-3 py-2 text-sm outline-none"
                    style={{ color: '#3F4756' }}
                  />
                ) : (
                  <p
                    className="mb-4 text-sm leading-relaxed"
                    style={{ color: '#3F4756' }}
                  >
                    {form.description}
                  </p>
                )}
                <div className="mt-1 flex items-center gap-3">
                  <div className="relative h-9 w-9 flex-shrink-0 overflow-hidden rounded-full border-2 border-white">
                    {/* <Image
                      src={form.authorAvatar}
                      alt={form.author}
                      fill
                      className="object-cover object-top"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'https://api.dicebear.com/7.x/initials/svg?seed=KK';
                      }}
                    /> */}
                  </div>
                  <span
                    className="text-sm font-semibold"
                    style={{ color: '#3F4756' }}
                  >
                    {form.author}
                  </span>
                </div>
              </div>

              {/* Συστατικά */}
              <div className="mb-6">
                <h3
                  className="mb-3 text-lg font-black"
                  style={{ color: '#3F4756' }}
                >
                  {t('chef.recipe_detail.ingredients')}
                </h3>
                {isEditing ? (
                  <EditableList
                    items={form.ingredients}
                    onChange={(v) => update('ingredients', v)}
                    addLabel={t('chef.create_recipe.add_ingredient')}
                    numbered
                  />
                ) : (
                  <ol className="flex flex-col gap-1.5 list-decimal list-inside">
                    {form.ingredients.map((ing, i) => (
                      <li key={i} className="text-sm text-gray-600">
                        {ing}
                      </li>
                    ))}
                  </ol>
                )}
              </div>

              {/* Σκεύη */}
              <div className="mb-6">
                <h3
                  className="mb-3 text-lg font-black"
                  style={{ color: '#3F4756' }}
                >
                  {t('chef.recipe_detail.utensils')}
                </h3>
                {isEditing ? (
                  <EditableList
                    items={form.utensils}
                    onChange={(v) => update('utensils', v)}
                    addLabel={t('chef.recipe_detail.add_utensil')}
                    numbered
                  />
                ) : (
                  <ol className="flex flex-col gap-1.5 list-decimal list-inside">
                    {form.utensils.map((ut, i) => (
                      <li key={i} className="text-sm text-gray-600">
                        {ut}
                      </li>
                    ))}
                  </ol>
                )}
              </div>

              {/* Εκτέλεση */}
              <div>
                <h3
                  className="mb-3 text-lg font-black"
                  style={{ color: '#3F4756' }}
                >
                  {t('chef.recipe_detail.execution')}
                </h3>
                {isEditing ? (
                  <EditableList
                    items={form.steps}
                    onChange={(v) => update('steps', v)}
                    addLabel={t('chef.create_recipe.add_step')}
                  />
                ) : (
                  <div className="flex flex-col gap-3">
                    {form.steps.map((step, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div
                          className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2"
                          style={{ borderColor: '#3F4756' }}
                        />
                        <span className="text-sm text-gray-600">{step}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT column */}
            <div className="flex flex-col gap-4 md:w-56">
              {/* ── Edit / Save / Cancel ── */}
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center justify-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-bold text-white transition hover:opacity-90"
                  style={{ backgroundColor: '#EAB308' }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="h-4 w-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                    />
                  </svg>
                  {t('chef.recipe_detail.edit')}
                </button>
              ) : (
                <div className="flex flex-col gap-2">
                  <button
                    onClick={handleSave}
                    className="flex items-center justify-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-bold text-white transition hover:opacity-90"
                    style={{ backgroundColor: '#377CC3' }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="h-4 w-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4.5 12.75l6 6 9-13.5"
                      />
                    </svg>
                    {t('chef.recipe_detail.save')}
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex items-center justify-center gap-2 rounded-2xl border px-4 py-2.5 text-sm font-bold transition hover:bg-gray-50"
                    style={{ borderColor: '#3F4756', color: '#3F4756' }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="h-4 w-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                    {t('chef.recipe_detail.cancel')}
                  </button>
                </div>
              )}

              {/* Recipe info card (dark) */}
              <div
                className="overflow-hidden rounded-2xl"
                style={{ backgroundColor: '#3F4756' }}
              >
                <div className="relative h-28 w-full overflow-hidden">
                  <Image
                    src={form.dishImage}
                    alt={form.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  {isEditing ? (
                    <input
                      value={form.title}
                      onChange={(e) => update('title', e.target.value)}
                      className="mb-1 w-full rounded border border-gray-600 bg-gray-700 px-2 py-1 text-sm font-bold text-white outline-none"
                    />
                  ) : (
                    <h4 className="mb-1 font-bold text-white">{form.title}</h4>
                  )}
                  {isEditing ? (
                    <select
                      value={form.difficulty}
                      onChange={(e) => update('difficulty', e.target.value)}
                      className="mb-2 w-full rounded border border-gray-600 bg-gray-700 px-2 py-1 text-xs text-gray-300 outline-none"
                    >
                      {difficultyOptions.map((d) => (
                        <option key={d}>{d}</option>
                      ))}
                    </select>
                  ) : (
                    <p className="mb-2 text-xs text-gray-300">
                      {t('chef.recipe_detail.difficulty')} {form.difficulty}
                    </p>
                  )}
                  <p className="mb-3 text-xs leading-relaxed text-gray-400 line-clamp-3">
                    {form.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Stars rating={form.rating} size="sm" />
                      <span className="text-xs text-gray-300">
                        {form.rating}
                      </span>
                    </div>
                    <span className="text-xs text-gray-300">
                      {t('chef.recipe_detail.time_label')} {totalTime}{' '}
                      {t('chef.recipe_detail.minutes')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Time breakdown card */}
              <div className="rounded-2xl border border-gray-200 p-4">
                <h4
                  className="mb-3 text-center text-sm font-bold"
                  style={{ color: '#3F4756' }}
                >
                  {t('chef.recipe_detail.implementation_time')} {totalTime}{' '}
                  {t('chef.recipe_detail.minutes')}
                </h4>
                <div className="flex flex-col gap-2">
                  {timeBreakdown.map(({ label, field }) => (
                    <div
                      key={field}
                      className="flex items-center justify-between gap-2"
                    >
                      <span className="text-xs" style={{ color: '#3F4756' }}>
                        {label}
                      </span>
                      {isEditing ? (
                        <input
                          type="number"
                          value={form[field]}
                          onChange={(e) =>
                            update(field, parseInt(e.target.value) || 0)
                          }
                          className="w-16 rounded border border-gray-200 px-2 py-0.5 text-right text-xs font-semibold outline-none"
                          style={{ color: '#377CC3' }}
                        />
                      ) : (
                        <span
                          className="flex-shrink-0 text-xs font-semibold"
                          style={{ color: '#377CC3' }}
                        >
                          {form[field]} {t('chef.recipe_detail.minutes')}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Food type card */}
              <div className="rounded-2xl border border-gray-200 p-4">
                <h4
                  className="mb-3 text-center text-sm font-bold"
                  style={{ color: '#3F4756' }}
                >
                  {t('chef.recipe_detail.food_type')}
                </h4>
                <div className="flex flex-col gap-3">
                  {foodTypeFields.map(({ label, field }) => (
                    <div key={field}>
                      <p className="text-xs text-gray-500">{label}</p>
                      {isEditing ? (
                        <input
                          value={form[field]}
                          onChange={(e) => update(field, e.target.value)}
                          className="mt-0.5 w-full border-b pb-1 text-sm font-medium italic outline-none"
                          style={{ color: '#377CC3', borderColor: '#B3D5F8' }}
                        />
                      ) : (
                        <p
                          className="mt-0.5 border-b pb-1 text-sm font-medium italic"
                          style={{ color: '#377CC3', borderColor: '#B3D5F8' }}
                        >
                          {form[field]}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Delete — only in edit mode */}
              {isEditing && (
                <button
                  onClick={() => router.push('/chef/recipes')}
                  className="flex items-center justify-center gap-2 rounded-2xl border border-red-200 px-4 py-2.5 text-sm font-bold text-red-400 transition hover:bg-red-50"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="h-4 w-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                    />
                  </svg>
                  {t('chef.recipe_detail.delete')}
                </button>
              )}
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
