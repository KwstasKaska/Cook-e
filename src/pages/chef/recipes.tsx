import React, { useState } from 'react';
import Image from 'next/image';
import ChefNavbar from '../../components/Chef/ChefNavbar';
import RecipeSummaryModal, {
  RecipeSummaryData,
} from '../../components/Chef/RecipeSummary';
import Footer from '../../components/Users/Footer';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

// ─── Types
interface Recipe {
  id: number;
  title: string;
  description: string;
  category: string;
  image: string;
  persons: number;
  duration: number;
  ingredientsCount: number;
  calories: number;
  tags: string[];
}

// ─── Fake data
const CATEGORIES = [
  'Κρέας',
  'Όσπρια',
  'Θαλασσινά',
  'Σαλάτες',
  'Ζυμαρικά',
  'Ορεκτικά',
  'Vegan',
];

const FAKE_RECIPES: Recipe[] = [
  {
    id: 1,
    title: 'Μακαρόνια με κιμά',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    category: 'Ζυμαρικά',
    image: '/images/food.jpg',
    persons: 2,
    duration: 25,
    ingredientsCount: 7,
    calories: 220,
    tags: ['Μακαρονια', 'Μακαρονια', 'Μακαρονια', 'Μακαρονια', 'Μακαρονια'],
  },
  {
    id: 2,
    title: 'Μακαρόνια με κιμά',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    category: 'Ζυμαρικά',
    image: '/images/food.jpg',
    persons: 2,
    duration: 150,
    ingredientsCount: 5,
    calories: 310,
    tags: ['Μακαρονια', 'Ζυμαρικά'],
  },
  {
    id: 3,
    title: 'Μακαρόνια με κιμά',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    category: 'Κρέας',
    image: '/images/food.jpg',
    persons: 2,
    duration: 150,
    ingredientsCount: 8,
    calories: 450,
    tags: ['Κρέας', 'Μακαρονια'],
  },
  {
    id: 4,
    title: 'Σαλάτα Καίσαρα',
    description: 'Lorem ipsum dolor sit amet.',
    category: 'Σαλάτες',
    image: '/images/food.jpg',
    persons: 4,
    duration: 15,
    ingredientsCount: 6,
    calories: 180,
    tags: ['Σαλάτα', 'Vegan'],
  },
];

// ─── Compact recipe row card
const CompactCard = ({
  recipe,
  onClick,
}: {
  recipe: Recipe;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className="flex w-full items-center gap-3 rounded-2xl bg-white p-3 text-left shadow transition hover:shadow-md hover:-translate-y-0.5"
  >
    <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-full">
      <Image
        src={recipe.image}
        alt={recipe.title}
        fill
        className="object-cover"
      />
    </div>
    <div className="flex-1 min-w-0">
      <p className="font-bold text-sm truncate" style={{ color: '#3F4756' }}>
        {recipe.title}
      </p>
      <div className="mt-1 flex items-center gap-3 text-xs text-gray-500">
        <span>
          Άτομα{' '}
          <span className="font-bold text-gray-700">{recipe.persons}</span>
        </span>
        <span className="text-gray-300">|</span>
        <span>
          Χρονική διάρκεια{' '}
          <span className="font-bold text-gray-700">{recipe.duration}</span>
        </span>
      </div>
    </div>
  </button>
);

// ─── Featured (big) card ──────────────────────────────────────────────────────
const FeaturedCard = ({
  recipe,
  onClick,
}: {
  recipe: Recipe;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className="flex w-full flex-col overflow-hidden rounded-2xl bg-white text-left shadow-lg transition hover:shadow-xl hover:-translate-y-1"
  >
    <div className="relative h-52 w-full overflow-hidden">
      <Image
        src={recipe.image}
        alt={recipe.title}
        fill
        className="object-cover"
      />
    </div>
    <div className="p-4">
      <h3 className="text-lg font-bold" style={{ color: '#3F4756' }}>
        {recipe.title}
      </h3>
      <p className="mt-1 text-sm leading-relaxed text-gray-500 line-clamp-4">
        {recipe.description}
      </p>
      <div className="mt-3 flex items-center gap-4 text-sm text-gray-500">
        <span>
          Άτομα{' '}
          <span className="font-bold text-gray-700">{recipe.persons}</span>
        </span>
        <span className="text-gray-300">|</span>
        <span>
          Χρονική διάρκεια{' '}
          <span className="font-bold text-gray-700">
            {recipe.duration} λεπτά
          </span>
        </span>
      </div>
    </div>
  </button>
);

// ─── Main page ─────────────────────────────────────────────────────────────────
export default function ChefRecipes() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('Νεότερα');
  const [selectedRecipe, setSelectedRecipe] =
    useState<RecipeSummaryData | null>(null);

  const openModal = (recipe: Recipe) => {
    setSelectedRecipe({
      id: recipe.id,
      title: recipe.title,
      image: recipe.image,
      description: recipe.description,
      duration: recipe.duration,
      ingredientsCount: recipe.ingredientsCount,
      calories: recipe.calories,
      tags: recipe.tags,
    });
  };

  const filtered = FAKE_RECIPES.filter((r) => {
    const matchCat = !activeCategory || r.category === activeCategory;
    const matchSearch = r.title.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const featured = filtered[0] || null;
  const rest = filtered.slice(1);

  return (
    <div
      className="flex min-h-screen flex-col"
      style={{ backgroundColor: '#3F4756' }}
    >
      <ChefNavbar />

      {/* Recipe summary modal */}
      {selectedRecipe && (
        <RecipeSummaryModal
          recipe={selectedRecipe}
          onClose={() => setSelectedRecipe(null)}
        />
      )}

      <main className="relative flex flex-1 flex-col items-center px-4 py-8 md:px-8">
        {/* Decorative diamond shapes */}
        <div
          className="pointer-events-none absolute hidden md:block"
          style={{
            left: '60px',
            top: '80px',
            width: '120px',
            height: '120px',
            backgroundColor: '#B3D5F8',
            transform: 'rotate(45deg)',
            borderRadius: '12px',
            opacity: 0.7,
          }}
        />
        <div
          className="pointer-events-none absolute hidden md:block"
          style={{
            right: '60px',
            top: '80px',
            width: '120px',
            height: '120px',
            backgroundColor: '#B3D5F8',
            transform: 'rotate(45deg)',
            borderRadius: '12px',
            opacity: 0.7,
          }}
        />
        <div
          className="pointer-events-none absolute hidden md:block"
          style={{
            left: '30px',
            bottom: '200px',
            width: '90px',
            height: '90px',
            backgroundColor: '#B3D5F8',
            transform: 'rotate(45deg)',
            borderRadius: '10px',
            opacity: 0.5,
          }}
        />
        <div
          className="pointer-events-none absolute hidden md:block"
          style={{
            right: '30px',
            bottom: '200px',
            width: '90px',
            height: '90px',
            backgroundColor: '#B3D5F8',
            transform: 'rotate(45deg)',
            borderRadius: '10px',
            opacity: 0.5,
          }}
        />

        {/* Title */}
        <h1
          className="relative z-10 mb-8 text-3xl italic"
          style={{
            color: 'rgba(255,255,255,0.85)',
            fontFamily: 'Georgia, serif',
          }}
        >
          Οι <em>συνταγές μου</em>
        </h1>

        {/* Main card */}
        <div
          className="relative z-10 w-full max-w-4xl rounded-2xl p-6 md:p-8"
          style={{ backgroundColor: 'white' }}
        >
          {/* Top bar: categories title + search + sort */}
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <h2 className="text-2xl font-bold" style={{ color: '#3F4756' }}>
              Είδη
            </h2>
            <div className="flex flex-1 items-center gap-3 md:justify-end">
              <input
                type="text"
                placeholder="Εύρεση συνταγών..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 rounded-full border border-gray-200 px-4 py-2 text-sm outline-none focus:border-myBlue-200 md:max-w-xs"
              />
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="rounded-full border border-gray-200 px-3 py-2 text-sm outline-none"
              >
                <option>Νεότερα</option>
                <option>Παλαιότερα</option>
                <option>Αλφαβητικά</option>
              </select>
            </div>
          </div>

          {/* Body: sidebar + content */}
          <div className="flex flex-col gap-6 md:flex-row">
            {/* Category pills sidebar */}
            <div className="flex flex-row flex-wrap gap-2 md:flex-col md:w-36 md:flex-none">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() =>
                    setActiveCategory(activeCategory === cat ? null : cat)
                  }
                  className="rounded-full border px-4 py-2 text-sm font-medium transition"
                  style={{
                    backgroundColor:
                      activeCategory === cat ? '#3F4756' : 'white',
                    borderColor: '#3F4756',
                    color: activeCategory === cat ? 'white' : '#3F4756',
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Recipes area */}
            <div className="flex-1">
              {filtered.length === 0 ? (
                <p className="text-center text-gray-400 py-12">
                  Δεν βρέθηκαν συνταγές.
                </p>
              ) : (
                <div className="flex flex-col gap-4 md:flex-row">
                  {/* Featured big card */}
                  {featured && (
                    <div className="md:w-1/2">
                      <FeaturedCard
                        recipe={featured}
                        onClick={() => openModal(featured)}
                      />
                    </div>
                  )}

                  {/* Compact list */}
                  {rest.length > 0 && (
                    <div className="flex flex-col gap-3 md:w-1/2">
                      {/* First compact: dark bg (highlighted) */}
                      {rest.map((recipe, i) => (
                        <div
                          key={recipe.id}
                          className={`overflow-hidden rounded-2xl ${
                            i === 0 ? '' : ''
                          }`}
                          style={i === 0 ? { backgroundColor: '#3F4756' } : {}}
                        >
                          {i === 0 ? (
                            <button
                              onClick={() => openModal(recipe)}
                              className="flex w-full items-center gap-3 p-3 text-left transition hover:opacity-90"
                            >
                              <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-full">
                                <Image
                                  src={recipe.image}
                                  alt={recipe.title}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-bold text-sm text-white truncate">
                                  {recipe.title}
                                </p>
                                <div className="mt-1 flex items-center gap-3 text-xs text-gray-300">
                                  <span>
                                    Άτομα{' '}
                                    <span className="font-bold text-white">
                                      {recipe.persons}
                                    </span>
                                  </span>
                                  <span className="text-gray-500">|</span>
                                  <span>
                                    Χρονική διάρκεια{' '}
                                    <span className="font-bold text-white">
                                      {recipe.duration}
                                    </span>
                                  </span>
                                </div>
                              </div>
                            </button>
                          ) : (
                            <CompactCard
                              recipe={recipe}
                              onClick={() => openModal(recipe)}
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Περισσότερα */}
              <div className="mt-8 flex justify-center">
                <button
                  className="rounded-full px-10 py-3 text-sm font-bold text-white transition hover:opacity-90"
                  style={{ backgroundColor: '#3F4756' }}
                >
                  Περισσότερα
                </button>
              </div>
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
