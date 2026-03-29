import React, { useState, useRef } from 'react';
import ScrollToTopButton from '../../components/Helper/ScrollToTopButton';
import Navbar from '../../components/Users/Navbar';

// ─── Types ────────────────────────────────────────────────────────────────────
type IngredientItem = {
  id: number;
  name: string;
  calories: number;
  emoji: string;
};
type IngredientCat = {
  key: string;
  label: string;
  items: IngredientItem[];
};
type UtensilItem = {
  id: number;
  name: string;
};
export type RecipeResult = {
  id: number;
  title: string;
  image: string;
  mealType: string;
  difficulty: string;
  chefName: string;
  rating: number;
  ratingCount: number;
};
type FavoriteRecipe = {
  id: number;
  title: string;
  image: string;
  category: string;
  rating: number;
  ratingCount: number;
  timeMinutes: number;
};

type Step = 'home' | 'ingredients' | 'utensils' | 'results';

// ─── Fake data ─────────────────────────────────────────────────────────────────
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
    label: 'Γλυκίσματα/Αναψυκτικά και σνακ',
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
  { id: 8, name: 'Λοιπά Σκεύη' },
];

const FAKE_RESULTS: RecipeResult[] = [
  {
    id: 1,
    title: 'Μοσχάρι κοκκινιστό με κριθαράκι',
    image:
      'https://images.unsplash.com/photo-1547592180-85f173990554?w=400&q=80',
    mealType: 'Μεσημεριανό',
    difficulty: 'Αρχάριος',
    chefName: 'Chef Kostas',
    rating: 4.9,
    ratingCount: 30,
  },
  {
    id: 2,
    title: 'Σπαγγέτι καρμπονάρα',
    image:
      'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400&q=80',
    mealType: 'Μεσημεριανό',
    difficulty: 'Μέτριος',
    chefName: 'Chef Maria',
    rating: 4.7,
    ratingCount: 24,
  },
  {
    id: 3,
    title: 'Σολομός με λεμόνι',
    image:
      'https://images.unsplash.com/photo-1559847844-5315695dadae?w=400&q=80',
    mealType: 'Βραδινό',
    difficulty: 'Εύκολος',
    chefName: 'Chef Nikos',
    rating: 4.8,
    ratingCount: 18,
  },
];

const FAKE_FAVORITES: FavoriteRecipe[] = [
  {
    id: 10,
    title: 'Μακαρόνια με σάλτσα ντομάτας',
    image:
      'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=300&q=80',
    category: 'Pasta',
    rating: 4.9,
    ratingCount: 30,
    timeMinutes: 25,
  },
  {
    id: 11,
    title: 'Καλαμαράκια τηγανητά',
    image:
      'https://images.unsplash.com/photo-1559847844-5315695dadae?w=300&q=80',
    category: 'Θαλασσινά',
    rating: 4.6,
    ratingCount: 18,
    timeMinutes: 30,
  },
  {
    id: 12,
    title: 'Κοτόπουλο σχάρας',
    image:
      'https://images.unsplash.com/photo-1598103442097-8b74394b95c4?w=300&q=80',
    category: 'Κυρίως',
    rating: 4.7,
    ratingCount: 22,
    timeMinutes: 40,
  },
  {
    id: 13,
    title: 'Ελληνική σαλάτα',
    image:
      'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=300&q=80',
    category: 'Σαλάτα',
    rating: 4.8,
    ratingCount: 35,
    timeMinutes: 10,
  },
];

// ─── Shared helpers ────────────────────────────────────────────────────────────
const StarRow = ({
  rating,
  ratingCount,
  small = false,
}: {
  rating: number;
  ratingCount: number;
  small?: boolean;
}) => (
  <div className="flex items-center gap-1.5">
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill={i < Math.round(rating) ? '#EAB308' : 'none'}
          stroke="#EAB308"
          strokeWidth={i < Math.round(rating) ? 0 : 1.5}
          className={small ? 'h-3.5 w-3.5' : 'h-5 w-5'}
        >
          <path
            fillRule="evenodd"
            d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
            clipRule="evenodd"
          />
        </svg>
      ))}
    </div>
    <span className={`text-yellow-400 ${small ? 'text-xs' : 'text-sm'}`}>
      {rating}/ 5 ({ratingCount})
    </span>
  </div>
);

// ─── Diagonal background wrapper ──────────────────────────────────────────────
function DiagonalLayout({
  children,
  whiteStart = '15%',
}: {
  children: React.ReactNode;
  whiteStart?: string;
}) {
  return (
    <div
      className="relative overflow-hidden min-h-screen"
      style={{ backgroundColor: '#3F4756' }}
    >
      <div
        className="absolute bottom-0 left-0 w-full bg-gray-100"
        style={{
          height: '78%',
          clipPath: `polygon(0 ${whiteStart}, 100% 0%, 100% 100%, 0% 100%)`,
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}

// ─── HOME step: favorites + centered CTA ──────────────────────────────────────
function HomeStep({ onStartPicker }: { onStartPicker: () => void }) {
  return (
    <DiagonalLayout whiteStart="18%">
      <div className="max-w-5xl mx-auto px-6 pt-10 pb-20">
        {/* ── Page title ── */}
        <div className="mb-10">
          <h1 className="text-white text-3xl md:text-4xl font-bold mb-1">
            Συνταγές
          </h1>
          <p className="text-gray-300 text-sm">
            Βρες συνταγές με βάση τα υλικά σου ή ανακάλυψε αγαπημένες.
          </p>
        </div>

        {/* ── Favorite recipes ── */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-white text-xl font-bold">
              Αγαπημένες Συνταγές
            </h2>
            <button
              className="text-sm font-semibold hover:underline"
              style={{ color: '#B3D5F8' }}
            >
              Όλες →
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {FAKE_FAVORITES.map((fav) => (
              <div
                key={fav.id}
                className="bg-white rounded-2xl shadow-md overflow-hidden hover:scale-105 transition-transform duration-200 cursor-pointer"
              >
                <div className="relative h-32 w-full">
                  <img
                    src={fav.image}
                    alt={fav.title}
                    className="w-full h-full object-cover"
                  />
                  <button className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/80 flex items-center justify-center hover:bg-white transition">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-4 h-4 text-yellow-400"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
                    </svg>
                  </button>
                </div>
                <div className="p-3">
                  <span
                    className="text-xs font-semibold px-2 py-0.5 rounded-full mb-2 inline-block"
                    style={{ backgroundColor: '#B3D5F8', color: '#3F4756' }}
                  >
                    {fav.category}
                  </span>
                  <h3 className="text-sm font-bold text-gray-800 leading-tight mb-2">
                    {fav.title}
                  </h3>
                  <div className="flex items-center justify-between">
                    <StarRow
                      rating={fav.rating}
                      ratingCount={fav.ratingCount}
                      small
                    />
                    <span className="text-xs text-gray-400">
                      {fav.timeMinutes} λεπτά
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Centered CTA ── */}
        <div className="flex flex-col items-center gap-3 pt-4">
          <p className="text-gray-500 text-sm">
            Θέλεις να ανακαλύψεις νέες συνταγές;
          </p>
          <button
            onClick={onStartPicker}
            className="flex items-center gap-3 px-10 py-4 rounded-full font-bold text-base text-gray-800 hover:scale-105 transition-transform shadow-xl"
            style={{ backgroundColor: '#EAB308' }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z"
              />
            </svg>
            Ανακάλυψε Συνταγές
          </button>
          <p className="text-gray-400 text-xs">
            Πρόσθεσε υλικά και σκεύη για εξατομικευμένες προτάσεις
          </p>
        </div>
      </div>
    </DiagonalLayout>
  );
}

// ─── Step 1: Ingredient picker ─────────────────────────────────────────────────
function IngredientStep({
  selectedIds,
  onToggle,
  onNext,
}: {
  selectedIds: number[];
  onToggle: (id: number) => void;
  onNext: () => void;
}) {
  const [activeCat, setActiveCat] = useState(CATEGORIES[0].key);
  const items = CATEGORIES.find((c) => c.key === activeCat)?.items ?? [];

  return (
    <DiagonalLayout whiteStart="50%">
      <div className="max-w-2xl mx-auto px-6 pt-10 pb-24">
        {/* Centered card */}
        <div className="bg-gray-100 rounded-2xl shadow-xl p-6 mb-8">
          <h2 className="text-center text-xl font-bold text-gray-800 mb-5">
            Συστατικά
          </h2>
          <div className="flex flex-col gap-2.5">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setActiveCat(cat.key)}
                className="w-full rounded-full py-2.5 text-sm font-bold transition-all duration-150"
                style={{
                  backgroundColor:
                    activeCat === cat.key ? '#EAB308' : '#377CC3',
                  color: 'white',
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Selected ingredient rows */}
        {items.length > 0 && (
          <div className="mb-6">
            <h3 className="text-gray-800 text-sm font-bold mb-3 ml-1">
              {CATEGORIES.find((c) => c.key === activeCat)?.label}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {items.map((item) => {
                const sel = selectedIds.includes(item.id);
                return (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 rounded-xl px-4 py-3 transition"
                    style={{ backgroundColor: sel ? '#377CC3' : '#2a3240' }}
                  >
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-white/20 text-base">
                      {item.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-sm font-bold text-white">
                        {item.name}
                      </p>
                      <p className="text-xs text-gray-300">
                        {item.calories} Kcal
                      </p>
                    </div>
                    <button
                      onClick={() => onToggle(item.id)}
                      className="flex-shrink-0 rounded-lg p-1.5 transition"
                      style={{
                        backgroundColor: sel
                          ? 'white'
                          : 'rgba(255,255,255,0.1)',
                        color: sel ? '#377CC3' : 'white',
                      }}
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
          </div>
        )}

        {selectedIds.length > 0 && (
          <p className="text-center text-sm mb-4" style={{ color: '#B3D5F8' }}>
            {selectedIds.length} υλικά επιλεγμένα
          </p>
        )}

        <div className="flex justify-center">
          <button
            onClick={onNext}
            className="rounded-full px-12 py-3 text-sm font-bold text-gray-800 transition hover:scale-105"
            style={{ backgroundColor: '#EAB308' }}
          >
            Επόμενο
          </button>
        </div>
      </div>
    </DiagonalLayout>
  );
}

// ─── Step 2: Utensil picker ────────────────────────────────────────────────────
function UtensilStep({
  selectedIds,
  onToggle,
  onBack,
  onSearch,
}: {
  selectedIds: number[];
  onToggle: (id: number) => void;
  onBack: () => void;
  onSearch: () => void;
}) {
  const selected = UTENSILS.filter((u) => selectedIds.includes(u.id));

  return (
    <DiagonalLayout whiteStart="50%">
      <div className="max-w-2xl mx-auto px-6 pt-10 pb-24">
        {/* Centered card */}
        <div className="bg-gray-100 rounded-2xl shadow-xl p-6 mb-8">
          <div className="flex items-center gap-3 mb-5">
            <button
              onClick={onBack}
              className="flex h-7 w-7 items-center justify-center rounded-full transition"
              style={{ backgroundColor: '#EAEAEA', color: '#3F4756' }}
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
            <h2 className="text-xl font-bold text-gray-800">Σκεύη</h2>
          </div>
          <div className="flex flex-col gap-2.5">
            {UTENSILS.map((u) => {
              const sel = selectedIds.includes(u.id);
              return (
                <button
                  key={u.id}
                  onClick={() => onToggle(u.id)}
                  className="w-full rounded-full py-2.5 text-sm font-bold transition-all duration-150"
                  style={{
                    backgroundColor: sel ? '#EAB308' : '#377CC3',
                    color: 'white',
                  }}
                >
                  {u.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected utensils list */}
        {selected.length > 0 && (
          <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {selected.map((u) => (
              <div
                key={u.id}
                className="flex items-center gap-3 rounded-xl px-4 py-3"
                style={{ backgroundColor: '#2a3240' }}
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-sm">
                  🍳
                </div>
                <span className="text-sm font-bold text-white">{u.name}</span>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-center">
          <button
            onClick={onSearch}
            className="rounded-full px-12 py-3 text-sm font-bold text-gray-800 transition hover:scale-105"
            style={{ backgroundColor: '#EAB308' }}
          >
            Αναζήτηση
          </button>
        </div>
      </div>
    </DiagonalLayout>
  );
}

// ─── Recipe result card ────────────────────────────────────────────────────────
const RecipeCard = ({
  recipe,
  index,
  onClick,
}: {
  recipe: RecipeResult;
  index: number;
  onClick: () => void;
}) => {
  const topPad = index === 0 ? 'pt-24' : index === 1 ? 'pt-16' : 'pt-10';
  const imgSize =
    index === 0 ? 'h-40 w-40' : index === 1 ? 'h-36 w-36' : 'h-32 w-32';
  const imgTop = index === 0 ? '-top-20' : index === 1 ? '-top-16' : '-top-14';

  return (
    <div
      onClick={onClick}
      className={`relative cursor-pointer rounded-2xl bg-white shadow-xl transition duration-300 hover:scale-105 ${topPad} px-6 pb-8 flex flex-col gap-3`}
    >
      <div
        className={`absolute left-1/2 -translate-x-1/2 ${imgTop} ${imgSize} overflow-hidden rounded-full border-4 border-white shadow-xl`}
      >
        <img
          src={recipe.image}
          alt={recipe.title}
          className="w-full h-full object-cover"
        />
      </div>
      <h3 className="text-center text-lg font-bold text-gray-800">
        {recipe.title}
      </h3>
      <StarRow rating={recipe.rating} ratingCount={recipe.ratingCount} />
      <p className="text-sm text-gray-600">{recipe.mealType}</p>
      <p className="text-sm text-gray-600">{recipe.difficulty}</p>
      <p className="mt-auto pt-4 text-sm text-gray-600">
        Από: {recipe.chefName}
      </p>
    </div>
  );
};

// ─── Step 3: Results ───────────────────────────────────────────────────────────
function ResultsStep({
  recipes,
  onSelectRecipe,
  onBack,
}: {
  recipes: RecipeResult[];
  onSelectRecipe: (id: number) => void;
  onBack: () => void;
}) {
  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{ backgroundColor: '#3F4756' }}
    >
      <div
        className="absolute bottom-0 left-0 w-full bg-gray-100"
        style={{
          height: '72%',
          clipPath: 'polygon(0 15%, 100% 0%, 100% 100%, 0% 100%)',
        }}
      />
      <div className="relative z-10 max-w-5xl mx-auto px-6 pt-10 pb-20">
        {/* Back button */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm font-bold mb-8 transition hover:opacity-80"
          style={{ color: '#EAB308' }}
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
          Πίσω στην αναζήτηση
        </button>

        <h2 className="text-center text-2xl font-bold text-white mb-24">
          Διάλεξε ανάμεσα στις προτεινόμενες συνταγές
        </h2>

        {/* Mobile */}
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

        {/* Desktop: staggered */}
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
            className="rounded-full border-2 bg-gray-500 border-white px-8 py-2 text-sm font-bold text-white transition hover:bg-white hover:text-gray-800"
          >
            Νέα αναζήτηση
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Recipe detail
type IngredientLine = { id: number; name: string; checked: boolean };
type Review = {
  id: number;
  author: string;
  rating: number;
  text: string;
  authorImage: string;
};
type DetailTab = 'ingredients' | 'reviews';

function RecipeDetailPage({
  recipeId: _recipeId,
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
      authorImage: 'https://randomuser.me/api/portraits/men/32.jpg',
    },
    {
      id: 2,
      author: 'Μαρία Παπαδοπούλου',
      rating: 4.9,
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor malesuada fames ac turpis egestas integer.',
      authorImage: 'https://randomuser.me/api/portraits/women/44.jpg',
    },
    {
      id: 3,
      author: 'Νίκος Αντωνίου',
      rating: 4.9,
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor malesuada fames ac turpis egestas integer.',
      authorImage: 'https://randomuser.me/api/portraits/men/55.jpg',
    },
  ];

  const STEPS = [
    'Ζεσταίνουμε το λάδι σε μια κατσαρόλα και σοτάρουμε το κρεμμύδι μέχρι να μαλακώσει.',
    'Προσθέτουμε το μοσχάρι και το τσιγαρίζουμε από όλες τις πλευρές μέχρι να ροδίσει.',
    'Σβήνουμε με το κρασί και αφήνουμε να εξατμιστεί για 2-3 λεπτά.',
    'Προσθέτουμε τις ντομάτες, τον πελτέ, αλάτι, πιπέρι και νερό. Σκεπάζουμε και σιγοβράζουμε για 45 λεπτά.',
    'Προσθέτουμε το κριθαράκι και ανακατεύουμε καλά.',
    'Συμπληρώνουμε νερό αν χρειαστεί και μαγειρεύουμε για άλλα 15 λεπτά μέχρι να γίνει το κριθαράκι.',
    'Αποσύρουμε από τη φωτιά και αφήνουμε να σταθεί 5 λεπτά πριν σερβίρουμε.',
    'Σερβίρουμε ζεστό, προαιρετικά με τριμμένο τυρί από πάνω.',
  ];

  const stepsRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  const handleScroll = () => {
    if (!stepsRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = stepsRef.current;
    const pct =
      scrollHeight > clientHeight
        ? scrollTop / (scrollHeight - clientHeight)
        : 0;
    setScrollProgress(pct);
  };

  const currentStep = Math.min(
    Math.round(scrollProgress * (STEPS.length - 1)) + 1,
    STEPS.length,
  );

  const toggleIngredient = (id: number) =>
    setIngredients((p) =>
      p.map((i) => (i.id === id ? { ...i, checked: !i.checked } : i)),
    );

  const StarRowSmall = ({ rating }: { rating: number }) => (
    <div className="flex gap-0.5">
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
    <div
      className="flex min-h-screen flex-col"
      style={{ backgroundColor: '#3F4756' }}
    >
      <Navbar />
      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-4 py-10 md:px-8 md:py-16">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-[1fr_360px] md:items-start">
            {/* LEFT */}
            <div className="flex flex-col gap-6">
              <button
                onClick={onBack}
                className="flex w-fit items-center gap-2 text-sm font-bold transition hover:opacity-80"
                style={{ color: '#EAB308' }}
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

              <div className="relative">
                <p
                  className="mb-2 text-base font-bold"
                  style={{ color: '#EAB308' }}
                >
                  Μεσημεριανό
                </p>
                <div className="flex items-start justify-between gap-4">
                  <h1 className="text-3xl font-bold text-white md:text-4xl xl:text-5xl max-w-lg">
                    Μοσχάρι κοκκινιστό με κριθαράκι
                  </h1>
                  <div className="relative hidden h-48 w-48 flex-shrink-0 overflow-hidden rounded-full border-4 border-white shadow-xl md:block">
                    <img
                      src="https://images.unsplash.com/photo-1547592180-85f173990554?w=400&q=80"
                      alt="recipe"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div className="relative mx-auto mt-4 h-40 w-40 overflow-hidden rounded-full border-4 border-white shadow-xl md:hidden">
                  <img
                    src="https://images.unsplash.com/photo-1547592180-85f173990554?w=400&q=80"
                    alt="recipe"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <StarRow rating={4.9} ratingCount={30} />

              <div>
                <h2 className="mb-6 text-2xl font-bold text-white md:text-3xl">
                  Εκτέλεση
                </h2>
                <div className="flex gap-4">
                  <div
                    ref={stepsRef}
                    onScroll={handleScroll}
                    className="flex flex-1 flex-col gap-6"
                    style={{
                      maxHeight: 480,
                      overflowY: 'auto',
                      scrollbarWidth: 'none',
                    }}
                  >
                    {STEPS.map((step, i) => (
                      <div key={i} className="flex gap-4">
                        <div className="flex w-8 flex-shrink-0 flex-col items-center">
                          <div
                            className="flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold"
                            style={{
                              backgroundColor: '#EAB308',
                              color: '#3F4756',
                            }}
                          >
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
                  {/* Progress bar */}
                  <div className="hidden flex-col items-center gap-2 md:flex">
                    <div className="flex-1 w-1 rounded-full bg-white/20">
                      <div
                        className="w-1 rounded-full transition-all duration-150"
                        style={{
                          height: `${scrollProgress * 100}%`,
                          backgroundColor: '#EAB308',
                        }}
                      />
                    </div>
                    <span className="text-xs text-white">
                      {currentStep} από {STEPS.length}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT panel */}
            <div className="rounded-2xl bg-white shadow-xl overflow-hidden sticky top-6">
              {activeTab === 'ingredients' ? (
                <div className="p-5">
                  <div className="mb-5 flex flex-col gap-2 border-b border-gray-100 pb-5">
                    {[
                      { icon: '⏱', label: '40 λεπτά' },
                      { icon: '🔥', label: '325 kcal' },
                      { icon: '👨‍🍳', label: 'Αρχάριος' },
                    ].map((m) => (
                      <div
                        key={m.label}
                        className="flex items-center gap-3 text-sm"
                        style={{ color: '#3F4756' }}
                      >
                        <span className="text-lg">{m.icon}</span>
                        <span>{m.label}</span>
                      </div>
                    ))}
                  </div>
                  <h3
                    className="mb-1 text-xl font-bold"
                    style={{ color: '#3F4756' }}
                  >
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
                            className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border-2 transition"
                            style={{
                              borderColor: ing.checked ? '#EAB308' : '#D1D5DB',
                              backgroundColor: ing.checked
                                ? '#EAB308'
                                : 'transparent',
                            }}
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
                          <span
                            className="text-sm"
                            style={{ color: '#3F4756' }}
                          >
                            {ing.name}
                          </span>
                        </div>
                        <button className="flex-shrink-0 text-gray-300 hover:text-blue-400 transition">
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
                  <h3
                    className="mb-5 text-xl font-bold"
                    style={{ color: '#3F4756' }}
                  >
                    Αξιολογήσεις
                  </h3>
                  <div
                    className="flex flex-col gap-5"
                    style={{ maxHeight: 420, overflowY: 'auto' }}
                  >
                    {REVIEWS.map((review) => (
                      <div
                        key={review.id}
                        className="border-b border-gray-100 pb-5 last:border-0"
                      >
                        <div className="mb-2 flex items-center gap-3">
                          <img
                            src={review.authorImage}
                            alt={review.author}
                            className="h-10 w-10 rounded-full object-cover flex-shrink-0"
                          />
                          <div>
                            <p
                              className="text-sm font-bold"
                              style={{ color: '#3F4756' }}
                            >
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
                        <p className="text-xs text-gray-500 leading-relaxed">
                          {review.text}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Bottom action bar */}
              <div className="flex items-center justify-around border-t border-gray-100 px-4 py-3">
                {[
                  {
                    tab: 'ingredients' as DetailTab,
                    icon: 'M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25',
                    title: 'Συνταγή',
                  },
                  {
                    tab: 'reviews' as DetailTab,
                    icon: 'M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z',
                    title: 'Αξιολογήσεις',
                  },
                ].map(({ tab, icon, title }) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className="flex h-10 w-10 items-center justify-center rounded-full transition"
                    style={{
                      backgroundColor:
                        activeTab === tab ? '#EAB308' : 'transparent',
                      color: activeTab === tab ? 'white' : '#9CA3AF',
                    }}
                    title={title}
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
                        d={icon}
                      />
                    </svg>
                  </button>
                ))}
                {[
                  {
                    icon: 'M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z',
                    title: 'Καλάθι',
                  },
                  {
                    icon: 'M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z',
                    title: 'Αποθήκευση',
                  },
                ].map(({ icon, title }) => (
                  <button
                    key={title}
                    className="flex h-10 w-10 items-center justify-center rounded-full text-gray-400 hover:text-gray-600 transition"
                    title={title}
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
                        d={icon}
                      />
                    </svg>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      <ScrollToTopButton />
    </div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────
export default function RecipesPage() {
  const [step, setStep] = useState<Step>('home');
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
    setStep('home');
    setSelectedIngredients([]);
    setSelectedUtensils([]);
    setSelectedRecipeId(null);
  };

  // Recipe detail view
  if (selectedRecipeId !== null) {
    return (
      <RecipeDetailPage
        recipeId={selectedRecipeId}
        onBack={() => setSelectedRecipeId(null)}
      />
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#3F4756' }}>
      <Navbar />

      {step === 'home' && (
        <HomeStep onStartPicker={() => setStep('ingredients')} />
      )}
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
    </div>
  );
}
