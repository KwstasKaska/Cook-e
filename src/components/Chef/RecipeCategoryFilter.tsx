import { RecipeCategory } from '../../generated/graphql';
import { getCategoryLabel } from '../../utils/categoryLabel';
import { useRouter } from 'next/router';

const CATEGORIES: RecipeCategory[] = [
  RecipeCategory.Meat,
  RecipeCategory.Legumes,
  RecipeCategory.Seafood,
  RecipeCategory.Salads,
  RecipeCategory.Pasta,
  RecipeCategory.Appetizers,
  RecipeCategory.Vegan,
];

interface Props {
  activeCategory: RecipeCategory | null;
  onChange: (category: RecipeCategory | null) => void;
}

export default function RecipeCategoryFilter({
  activeCategory,
  onChange,
}: Props) {
  const router = useRouter();
  const lang = (router.locale ?? 'el') as 'el' | 'en';

  return (
    <div className="flex flex-row flex-wrap gap-2 md:flex-col md:w-36 md:flex-none">
      {CATEGORIES.map((cat) => (
        <button
          key={cat}
          onClick={() => onChange(activeCategory === cat ? null : cat)}
          className={`rounded-full border-2 px-4 py-2 transition ${
            activeCategory === cat
              ? 'border-cookie-400 bg-cookie-400 text-white'
              : 'border-cookie-400 text-cookie-400 hover:bg-cookie-400 hover:text-white'
          }`}
        >
          {getCategoryLabel(cat, lang)}
        </button>
      ))}
    </div>
  );
}
