import React, { useState } from 'react';
import Image, { StaticImageData } from 'next/image';
import Link from 'next/link';
import Navbar from '../../components/Users/Navbar';
import Footer from '../../components/Users/Footer';
import ScrollToTopButton from '../../components/Helper/ScrollToTopButton';

// ─── Types ────────────────────────────────────────────────────────────────────
interface IngredientItem {
  id: number;
  name: string;
  calories: number;
  emoji: string;
}
interface IngredientCat {
  key: string;
  label: string;
  items: IngredientItem[];
}
interface UtensilItem {
  id: number;
  name: string;
}

export interface RecipeResult {
  id: number;
  title: string;
  image: StaticImageData | string;
  mealType: string;
  difficulty: string;
  chefName: string;
  rating: number;
  ratingCount: number;
}

type Step = 'ingredients' | 'utensils' | 'results';

// ─── Fake data ────────────────────────────────────────────────────────────────
const CATEGORIES: IngredientCat[] = [
  {
    key: 'vegetables',
    label: 'Λαχανικά',
    items: [
      { id: 1, name: 'Κρεμμύδι', calories: 40, emoji: '🧅' },
      { id: 2, name: 'Πατάτες', calories: 77, emoji: '🥔' },
      { id: 3, name: 'Μαρούλι', calories: 15, emoji: '🥬' },
      { id: 4, name: 'Πάπρικα', calories: 31, emoji: '🌶️' },
    ],
  },
  {
    key: 'fruits',
    label: 'Φρούτα',
    items: [
      { id: 5, name: 'Μήλο', calories: 52, emoji: '🍎' },
      { id: 6, name: 'Αχλάδι', calories: 57, emoji: '🍐' },
      { id: 7, name: 'Σύκο', calories: 74, emoji: '🍑' },
      { id: 8, name: 'Βατόμουρο', calories: 43, emoji: '🫐' },
      { id: 9, name: 'Λεμόνια', calories: 29, emoji: '🍋' },
      { id: 10, name: 'Μπανάνες', calories: 89, emoji: '🍌' },
    ],
  },
  {
    key: 'bread',
    label: 'Ψωμί & Δημητριακά',
    items: [
      { id: 11, name: 'Ψωμί', calories: 265, emoji: '🍞' },
      { id: 12, name: 'Ρύζι', calories: 130, emoji: '🍚' },
      { id: 13, name: 'Ζυμαρικά', calories: 131, emoji: '🍝' },
    ],
  },
  {
    key: 'dairy',
    label: 'Γαλακτοκομικά',
    items: [
      { id: 14, name: 'Τυρί', calories: 402, emoji: '🧀' },
      { id: 15, name: 'Γιαούρτι', calories: 59, emoji: '🥛' },
      { id: 16, name: 'Γάλα', calories: 61, emoji: '🥛' },
    ],
  },
  {
    key: 'meat',
    label: 'Κρεατικά/Αυγά/Ψαρικά/Θαλασσινά',
    items: [
      { id: 17, name: 'Κοτόπουλο', calories: 165, emoji: '🍗' },
      { id: 18, name: 'Μοσχάρι', calories: 250, emoji: '🥩' },
      { id: 19, name: 'Αυγά', calories: 143, emoji: '🥚' },
      { id: 20, name: 'Σολομός', calories: 208, emoji: '🐟' },
    ],
  },
  {
    key: 'oils',
    label: 'Λίπη & Λάδια',
    items: [
      { id: 21, name: 'Ελαιόλαδο', calories: 884, emoji: '🫒' },
      { id: 22, name: 'Βούτυρο', calories: 717, emoji: '🧈' },
    ],
  },
  {
    key: 'legumes',
    label: 'Όσπρια',
    items: [
      { id: 23, name: 'Φακές', calories: 116, emoji: '🫘' },
      { id: 24, name: 'Ρεβίθια', calories: 164, emoji: '🫘' },
    ],
  },
  {
    key: 'snacks',
    label: 'Γλυκίσματα/Αναψυκτικά και ανακ.',
    items: [
      { id: 25, name: 'Σοκολάτα', calories: 546, emoji: '🍫' },
      { id: 26, name: 'Μέλι', calories: 304, emoji: '🍯' },
    ],
  },
];

const UTENSILS: UtensilItem[] = [
  { id: 1, name: 'Κατσαρόλα' },
  { id: 2, name: 'Τηγάνι' },
  { id: 3, name: 'Γάστρα' },
  { id: 4, name: 'Γουόκ' },
  { id: 5, name: 'Γουδί' },
  { id: 6, name: 'Μαχαίρια' },
  { id: 7, name: 'Χύτρα ταχύτητας' },
  { id: 8, name: 'Λεπτά Σκεύη' },
];

const FAKE_RESULTS: RecipeResult[] = [
  {
    id: 1,
    title: 'Μοσχάρι κοκκινιστό με κριθαράκι',
    image: '/images/food.jpg',
    mealType: 'Μεσημεριανό',
    difficulty: 'Αρχάριος',
    chefName: 'Chef Kostas',
    rating: 4.9,
    ratingCount: 30,
  },
  {
    id: 2,
    title: 'Μοσχάρι κοκκινιστό με κριθαράκι',
    image: '/images/food.jpg',
    mealType: 'Μεσημεριανό',
    difficulty: 'Αρχάριος',
    chefName: 'Chef Kostas',
    rating: 4.9,
    ratingCount: 30,
  },
  {
    id: 3,
    title: 'Μοσχάρι κοκκινιστό με κριθαράκι',
    image: '/images/food.jpg',
    mealType: 'Μεσημεριανό',
    difficulty: 'Αρχάριος',
    chefName: 'Chef Kostas',
    rating: 4.9,
    ratingCount: 30,
  },
];

// ─── Star row ─────────────────────────────────────────────────────────────────
const StarRow = ({
  rating,
  ratingCount,
}: {
  rating: number;
  ratingCount: number;
}) => (
  <div className="flex items-center gap-2">
    <div className="flex gap-1">
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
    <span className="text-sm text-yellow-400">
      {rating}/ 5 ({ratingCount})
    </span>
  </div>
);

// ─── Recipe result card — tall card with circular image overlapping top ────────
const RecipeCard = ({
  recipe,
  index,
  onClick,
}: {
  recipe: RecipeResult;
  index: number;
  onClick: () => void;
}) => {
  // Staggered top padding: left card shows most, right card shows least (cascade effect)
  const topPad = index === 0 ? 'pt-24' : index === 1 ? 'pt-16' : 'pt-10';
  const imgSize =
    index === 0 ? 'h-40 w-40' : index === 1 ? 'h-36 w-36' : 'h-32 w-32';
  const imgTop = index === 0 ? '-top-20' : index === 1 ? '-top-16' : '-top-14';

  return (
    <div
      onClick={onClick}
      className={`relative cursor-pointer rounded-2xl bg-white shadow-3xl transition duration-300 hover:scale-105 hover:shadow-3xl ${topPad} px-6 pb-8 flex flex-col gap-3`}
    >
      {/* Circular dish image — overlaps top */}
      <div
        className={`absolute left-1/2 -translate-x-1/2 ${imgTop} ${imgSize} overflow-hidden rounded-full border-4 border-white shadow-3xl`}
      >
        <Image
          src={recipe.image}
          alt={recipe.title}
          fill
          className="object-cover"
        />
      </div>

      <h3 className="text-center text-lg font-bold text-myGrey-200 md:text-xl">
        {recipe.title}
      </h3>

      <StarRow rating={recipe.rating} ratingCount={recipe.ratingCount} />

      <p className="text-sm text-myGrey-200">{recipe.mealType}</p>
      <p className="text-sm text-myGrey-200">{recipe.difficulty}</p>
      <p className="mt-auto pt-4 text-sm text-myGrey-200">
        Απο: {recipe.chefName}
      </p>
    </div>
  );
};

// ─── Step 1: Ingredient picker ────────────────────────────────────────────────
const IngredientStep = ({
  selectedIds,
  onToggle,
  onNext,
}: {
  selectedIds: number[];
  onToggle: (id: number) => void;
  onNext: () => void;
}) => {
  const [activeCat, setActiveCat] = useState(CATEGORIES[0].key);
  const items = CATEGORIES.find((c) => c.key === activeCat)?.items ?? [];

  return (
    <div className="container mx-auto max-w-3xl py-14">
      <h2 className="mb-2 text-center text-2xl font-bold text-white md:text-3xl">
        Ανακάλυψε συνταγές
      </h2>
      <p className="mb-8 text-center text-xs text-myGrey-100 md:text-sm">
        Πρόσθεσε τα υλικά και τα σκεύη που έχεις στη διάθεσή σου, και αφέστε να
        σου βρούμε τις καλύτερες συνταγές.
      </p>
      <p className="mb-3 text-center text-sm font-bold text-white">Συστατικά</p>

      {/* Category pills */}
      <div className="mb-6 flex flex-wrap justify-center gap-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setActiveCat(cat.key)}
            className={`rounded-full px-4 py-2 text-xs font-bold transition md:text-sm ${
              activeCat === cat.key
                ? 'bg-yellow-400 text-myGrey-200'
                : 'bg-myGrey-100 text-myGrey-200 hover:bg-yellow-300'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Ingredient rows */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {items.map((item) => {
          const sel = selectedIds.includes(item.id);
          return (
            <div
              key={item.id}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 transition ${
                sel ? 'bg-myBlue-200' : 'bg-[#2a3240]'
              }`}
            >
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-white bg-opacity-20 text-base">
                {item.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-bold text-white">
                  {item.name}
                </p>
                <p className="text-xs text-myGrey-100">{item.calories} Kcal</p>
              </div>
              <button
                onClick={() => onToggle(item.id)}
                className={`flex-shrink-0 rounded-lg p-1.5 transition ${
                  sel
                    ? 'bg-white text-myBlue-200'
                    : 'bg-white bg-opacity-10 text-white hover:bg-yellow-400 hover:text-myGrey-200'
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  className="h-4 w-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
                  />
                </svg>
              </button>
            </div>
          );
        })}
      </div>

      {selectedIds.length > 0 && (
        <p className="mt-4 text-center text-sm text-myBlue-100">
          {selectedIds.length} υλικά επιλεγμένα
        </p>
      )}
      <div className="mt-8 flex justify-center">
        <button
          onClick={onNext}
          className="rounded-full bg-yellow-400 px-12 py-3 text-sm font-bold text-myGrey-200 transition hover:scale-105 hover:bg-yellow-300"
        >
          Επόμενο
        </button>
      </div>
    </div>
  );
};

// ─── Step 2: Utensil picker ───────────────────────────────────────────────────
const UtensilStep = ({
  selectedIds,
  onToggle,
  onBack,
  onSearch,
}: {
  selectedIds: number[];
  onToggle: (id: number) => void;
  onBack: () => void;
  onSearch: () => void;
}) => {
  const selected = UTENSILS.filter((u) => selectedIds.includes(u.id));
  return (
    <div className="container mx-auto max-w-2xl py-14">
      <h2 className="mb-2 text-center text-2xl font-bold text-white md:text-3xl">
        Ανακάλυψε συνταγές
      </h2>
      <p className="mb-8 text-center text-xs text-myGrey-100 md:text-sm">
        Επίλεξε τα σκεύη που έχεις διαθέσιμα.
      </p>

      <div className="mx-auto w-full max-w-xs rounded-2xl bg-white p-5 shadow-3xl">
        <div className="mb-4 flex items-center gap-3">
          <button
            onClick={onBack}
            className="flex h-7 w-7 items-center justify-center rounded-full bg-myGrey-100 text-myGrey-200 hover:bg-myBlue-200 hover:text-white transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-4 w-4"
            >
              <path
                fillRule="evenodd"
                d="M7.72 12.53a.75.75 0 010-1.06l7.5-7.5a.75.75 0 111.06 1.06L9.31 12l6.97 6.97a.75.75 0 11-1.06 1.06l-7.5-7.5z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          <h3 className="text-lg font-bold text-myGrey-200">Σκεύη</h3>
        </div>
        <div className="flex flex-col gap-2">
          {UTENSILS.map((u) => {
            const sel = selectedIds.includes(u.id);
            return (
              <button
                key={u.id}
                onClick={() => onToggle(u.id)}
                className={`w-full rounded-full py-2 text-sm font-bold transition ${
                  sel
                    ? 'bg-myBlue-200 text-white'
                    : 'bg-yellow-400 text-myGrey-200 hover:bg-yellow-300'
                }`}
              >
                {u.name}
              </button>
            );
          })}
        </div>
      </div>

      {selected.length > 0 && (
        <div className="mx-auto mt-5 w-full max-w-xs">
          {selected.map((u) => (
            <div
              key={u.id}
              className="mb-2 flex items-center gap-3 rounded-xl bg-[#2a3240] px-4 py-3"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white bg-opacity-10 text-sm">
                🍳
              </div>
              <span className="text-sm font-bold text-white">{u.name}</span>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 flex justify-center">
        <button
          onClick={onSearch}
          className="rounded-full bg-yellow-400 px-12 py-3 text-sm font-bold text-myGrey-200 transition hover:scale-105 hover:bg-yellow-300"
        >
          Αναζήτηση
        </button>
      </div>
    </div>
  );
};

// ─── Step 3: Results — staggered tall cards matching design 12 ─────────────────
const ResultsStep = ({
  recipes,
  onSelectRecipe,
  onBack,
}: {
  recipes: RecipeResult[];
  onSelectRecipe: (id: number) => void;
  onBack: () => void;
}) => (
  <div className="relative min-h-screen">
    {/* Background: dark grey full + white diagonal right */}
    <div className="absolute inset-0 bg-myGrey-200" />
    <div
      className="absolute inset-0 hidden bg-white md:block"
      style={{ clipPath: 'polygon(60% 0%, 100% 0%, 100% 100%, 25% 100%)' }}
    />

    <div className="relative z-10 container mx-auto px-6 py-16">
      <h2 className="mb-20 text-center text-2xl font-bold text-white md:text-3xl xl:text-4xl">
        Διάλεξε ανάμεσα στις προτεινόμενες συνταγές
      </h2>

      {/* Mobile: stacked */}
      <div className="flex flex-col gap-16 md:hidden">
        {recipes.map((r) => (
          <RecipeCard
            key={r.id}
            recipe={r}
            index={1}
            onClick={() => onSelectRecipe(r.id)}
          />
        ))}
      </div>

      {/* Desktop: 3 staggered cards side by side */}
      <div className="hidden md:grid md:grid-cols-3 md:items-end md:gap-6">
        {recipes.map((r, i) => (
          <RecipeCard
            key={r.id}
            recipe={r}
            index={i}
            onClick={() => onSelectRecipe(r.id)}
          />
        ))}
      </div>

      <div className="mt-16 flex justify-center">
        <button
          onClick={onBack}
          className="rounded-full border-2 border-white px-8 py-2 text-sm font-bold text-white transition hover:bg-white hover:text-myGrey-200"
        >
          Νέα αναζήτηση
        </button>
      </div>
    </div>
  </div>
);

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function RecipesPage() {
  const [step, setStep] = useState<Step>('ingredients');
  const [selectedIngredients, setSelectedIngredients] = useState<number[]>([]);
  const [selectedUtensils, setSelectedUtensils] = useState<number[]>([]);
  const [selectedRecipeId, setSelectedRecipeId] = useState<number | null>(null);

  const toggleIngredient = (id: number) =>
    setSelectedIngredients((p) =>
      p.includes(id) ? p.filter((i) => i !== id) : [...p, id],
    );
  const toggleUtensil = (id: number) =>
    setSelectedUtensils((p) =>
      p.includes(id) ? p.filter((i) => i !== id) : [...p, id],
    );
  const reset = () => {
    setStep('ingredients');
    setSelectedIngredients([]);
    setSelectedUtensils([]);
    setSelectedRecipeId(null);
  };

  // If a recipe is selected → go to detail page
  if (selectedRecipeId !== null) {
    return (
      <RecipeDetailPage
        recipeId={selectedRecipeId}
        onBack={() => setSelectedRecipeId(null)}
      />
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className={`flex-1 ${step !== 'results' ? 'bg-myGrey-200' : ''}`}>
        {step === 'ingredients' && (
          <IngredientStep
            selectedIds={selectedIngredients}
            onToggle={toggleIngredient}
            onNext={() => setStep('utensils')}
          />
        )}
        {step === 'utensils' && (
          <UtensilStep
            selectedIds={selectedUtensils}
            onToggle={toggleUtensil}
            onBack={() => setStep('ingredients')}
            onSearch={() => setStep('results')}
          />
        )}
        {step === 'results' && (
          <ResultsStep
            recipes={FAKE_RESULTS}
            onSelectRecipe={(id) => setSelectedRecipeId(id)}
            onBack={reset}
          />
        )}
      </main>
      <Footer />
      <ScrollToTopButton />
    </div>
  );
}

// ─── Recipe detail — matching designs 13 & 14 ─────────────────────────────────
interface IngredientLine {
  id: number;
  name: string;
  checked: boolean;
}
interface Review {
  id: number;
  author: string;
  rating: number;
  text: string;
  authorImage: string;
}
type DetailTab = 'ingredients' | 'reviews';

function RecipeDetailPage({
  recipeId,
  onBack,
}: {
  recipeId: number;
  onBack: () => void;
}) {
  const [activeTab, setActiveTab] = useState<DetailTab>('ingredients');
  const [ingredients, setIngredients] = useState<IngredientLine[]>([
    { id: 1, name: '2 φιλέτα μοσχάρι', checked: true },
    { id: 2, name: '7ml λάδι', checked: false },
    { id: 3, name: '3 τομάτες', checked: false },
    { id: 4, name: '200ml κρασί λευκό', checked: true },
    { id: 5, name: '100g κριθαράκι', checked: true },
    { id: 6, name: '1 κουταλιά της σούπας πελτέ', checked: false },
    { id: 7, name: '7g Αλάτι και Πιπέρι', checked: true },
  ]);

  const REVIEWS: Review[] = [
    {
      id: 1,
      author: 'Κωνσταντίνος Κασκαντίρης',
      rating: 4.9,
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor malesuada fames ac turpis egestas integer.',
      authorImage: '/images/myphoto.jpg',
    },
    {
      id: 2,
      author: 'Κωνσταντίνος Κασκαντίρης',
      rating: 4.9,
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor malesuada fames ac turpis egestas integer.',
      authorImage: '/images/myphoto.jpg',
    },
    {
      id: 3,
      author: 'Κωνσταντίνος Κασκαντίρης',
      rating: 4.9,
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor malesuada fames ac turpis egestas integer.',
      authorImage: '/images/myphoto.jpg',
    },
  ];

  const STEPS = [
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Turpis egestas integer eget aliquet nibh praesent. Et netus et malesuada fames ac turpis egestas integer.',
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Turpis egestas integer eget aliquet nibh praesent. Et netus et malesuada fames ac turpis egestas integer.',
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Turpis egestas integer eget aliquet nibh praesent. Et netus et malesuada fames ac turpis egestas integer.',
  ];

  const toggleIngredient = (id: number) =>
    setIngredients((p) =>
      p.map((i) => (i.id === id ? { ...i, checked: !i.checked } : i)),
    );

  const StarRowSmall = ({ rating }: { rating: number }) => (
    <div className="flex gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill={i < Math.round(rating) ? '#EAB308' : 'none'}
          stroke="#EAB308"
          strokeWidth={i < Math.round(rating) ? 0 : 1.5}
          className="h-4 w-4"
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

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 bg-myGrey-200">
        <div className="container mx-auto px-4 py-10 md:px-8 md:py-16">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-[1fr_360px] md:items-start">
            {/* LEFT — recipe info */}
            <div className="flex flex-col gap-6">
              {/* Back */}
              <button
                onClick={onBack}
                className="flex w-fit items-center gap-2 text-sm font-bold text-yellow-400 hover:text-white transition"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-4 w-4"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.72 12.53a.75.75 0 010-1.06l7.5-7.5a.75.75 0 111.06 1.06L9.31 12l6.97 6.97a.75.75 0 11-1.06 1.06l-7.5-7.5z"
                    clipRule="evenodd"
                  />
                </svg>
                Πίσω στα αποτελέσματα
              </button>

              {/* Category badge + title + image */}
              <div className="relative">
                <p className="mb-2 text-base font-bold text-yellow-400">
                  Μεσημεριανό
                </p>
                <div className="flex items-start justify-between gap-4">
                  <h1 className="text-3xl font-bold text-white md:text-4xl xl:text-5xl max-w-lg">
                    Μοσχάρι κοκκινιστό με κριθαράκι
                  </h1>
                  {/* Circular dish image — floats right */}
                  <div className="relative hidden h-48 w-48 flex-shrink-0 overflow-hidden rounded-full border-4 border-white shadow-3xl md:block xl:h-56 xl:w-56">
                    <Image
                      src="/images/food.jpg"
                      alt="recipe"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>

                {/* Mobile image */}
                <div className="relative mx-auto mt-4 h-40 w-40 overflow-hidden rounded-full border-4 border-white shadow-3xl md:hidden">
                  <Image
                    src="/images/food.jpg"
                    alt="recipe"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              {/* Stars */}
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg
                      key={i}
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill={i < 5 ? '#EAB308' : 'none'}
                      stroke="#EAB308"
                      strokeWidth={0}
                      className="h-6 w-6"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ))}
                </div>
                <span className="text-base text-yellow-400">4.9/ 5 (30)</span>
              </div>

              {/* Εκτέλεση steps */}
              <div>
                <h2 className="mb-6 text-2xl font-bold text-white md:text-3xl">
                  Εκτέλεση
                </h2>
                <div className="flex gap-4">
                  {/* Steps list */}
                  <div className="flex flex-1 flex-col gap-6">
                    {STEPS.map((step, i) => (
                      <div key={i} className="flex gap-4">
                        {/* Vertical step label — yellow rotated text */}
                        <div className="flex w-8 flex-shrink-0 flex-col items-center">
                          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-yellow-400 text-xs font-bold text-myGrey-200">
                            {i + 1}
                          </div>
                          {i < STEPS.length - 1 && (
                            <div className="mt-2 flex-1 w-0.5 bg-yellow-400 opacity-30" />
                          )}
                        </div>
                        <div className="flex-1 pb-2">
                          <p className="text-sm text-white leading-relaxed md:text-base">
                            {step}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  {/* Progress bar — right side */}
                  <div className="hidden flex-col items-center gap-2 md:flex">
                    <div className="flex-1 w-1 rounded-full bg-white bg-opacity-20">
                      <div
                        className="w-1 rounded-full bg-yellow-400"
                        style={{ height: '12%' }}
                      />
                    </div>
                    <span className="text-xs text-white">1 από 8</span>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT — floating white panel */}
            <div className="rounded-2xl bg-white shadow-3xl overflow-hidden">
              {/* Panel content — toggles between ingredients and reviews */}
              {activeTab === 'ingredients' ? (
                <div className="p-5">
                  {/* Meta info */}
                  <div className="mb-5 flex flex-col gap-2 border-b border-gray-100 pb-5">
                    {[
                      { icon: '⏱', label: '40 λεπτά' },
                      { icon: '🔥', label: '325 kcal' },
                      { icon: '👨‍🍳', label: 'Αρχάριος' },
                    ].map((m) => (
                      <div
                        key={m.label}
                        className="flex items-center gap-3 text-sm text-myGrey-200 md:text-base"
                      >
                        <span className="text-lg">{m.icon}</span>
                        <span>{m.label}</span>
                      </div>
                    ))}
                  </div>

                  {/* Υλικά */}
                  <h3 className="mb-1 text-xl font-bold text-myGrey-200 md:text-2xl">
                    Υλικά
                  </h3>
                  <p className="mb-4 text-xs text-gray-400">Μερίδα: 2 Ατόμων</p>

                  <ul className="flex flex-col gap-3">
                    {ingredients.map((ing) => (
                      <li
                        key={ing.id}
                        className="flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => toggleIngredient(ing.id)}
                            className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border-2 transition ${
                              ing.checked
                                ? 'border-yellow-400 bg-yellow-400'
                                : 'border-gray-300 bg-transparent'
                            }`}
                          >
                            {ing.checked && (
                              <svg
                                viewBox="0 0 16 16"
                                fill="none"
                                className="h-3 w-3"
                              >
                                <path
                                  d="M3 8l3.5 3.5L13 4"
                                  stroke="white"
                                  strokeWidth="2.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            )}
                          </button>
                          <span className="text-sm text-myGrey-200 md:text-base">
                            {ing.name}
                          </span>
                        </div>
                        <button className="flex-shrink-0 text-gray-300 hover:text-myBlue-200 transition">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={1.5}
                            className="h-4 w-4"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
                            />
                          </svg>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className="p-5">
                  <h3 className="mb-5 text-xl font-bold text-myGrey-200 md:text-2xl">
                    Αξιολογήσεις
                  </h3>
                  <div className="flex flex-col gap-5">
                    {REVIEWS.map((review) => (
                      <div
                        key={review.id}
                        className="border-b border-gray-100 pb-5 last:border-0"
                      >
                        <div className="mb-2 flex items-center gap-3">
                          <div className="relative h-10 w-10 overflow-hidden rounded-full flex-shrink-0">
                            <Image
                              src={review.authorImage}
                              alt={review.author}
                              fill
                              className="object-cover object-top"
                            />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-myGrey-200">
                              {review.author}
                            </p>
                            <div className="flex items-center gap-1">
                              <StarRowSmall rating={review.rating} />
                              <span className="text-xs text-yellow-500">
                                {review.rating}/ 5 (30)
                              </span>
                            </div>
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 leading-relaxed md:text-sm">
                          {review.text}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Bottom action bar — 4 icons, toggles tabs */}
              <div className="flex items-center justify-around border-t border-gray-100 px-4 py-3">
                <button
                  onClick={() => setActiveTab('ingredients')}
                  className={`flex h-10 w-10 items-center justify-center rounded-full transition ${
                    activeTab === 'ingredients'
                      ? 'bg-yellow-400 text-white'
                      : 'text-gray-400 hover:text-myGrey-200'
                  }`}
                  title="Συνταγή"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="h-5 w-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => setActiveTab('reviews')}
                  className={`flex h-10 w-10 items-center justify-center rounded-full transition ${
                    activeTab === 'reviews'
                      ? 'bg-yellow-400 text-white'
                      : 'text-gray-400 hover:text-myGrey-200'
                  }`}
                  title="Αξιολογήσεις"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="h-5 w-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
                    />
                  </svg>
                </button>
                <button
                  className="flex h-10 w-10 items-center justify-center rounded-full text-gray-400 transition hover:text-myGrey-200"
                  title="Καλάθι"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="h-5 w-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
                    />
                  </svg>
                </button>
                <button
                  className="flex h-10 w-10 items-center justify-center rounded-full text-gray-400 transition hover:text-myGrey-200"
                  title="Αποθήκευση"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="h-5 w-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <ScrollToTopButton />
    </div>
  );
}
