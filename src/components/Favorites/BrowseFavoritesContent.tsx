import { ReactNode, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import {
  useMyFavoritesQuery,
  useMyArticleFavoritesQuery,
} from '../../generated/graphql';
import PaginationControls from '../Helper/PaginationControls';

const FAV_LIMIT = 12;

type Props = {
  navbar: ReactNode;
  recipeDetailPath: string;
  articleDetailPath: string;
};

const BrowseFavoritesContent = ({
  navbar,
  recipeDetailPath,
  articleDetailPath,
}: Props) => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const isEl = router.locale === 'el';
  const [tab, setTab] = useState<'recipes' | 'articles'>('recipes');
  const [recipeOffset, setRecipeOffset] = useState(0);
  const [articleOffset, setArticleOffset] = useState(0);

  const { data: recipeData, loading: recipeLoading } = useMyFavoritesQuery({
    variables: { limit: FAV_LIMIT, offset: recipeOffset },
    fetchPolicy: 'network-only',
    skip: tab !== 'recipes',
  });

  const { data: articleData, loading: articleLoading } =
    useMyArticleFavoritesQuery({
      variables: { limit: FAV_LIMIT, offset: articleOffset },
      fetchPolicy: 'network-only',
      skip: tab !== 'articles',
    });

  const recipeFavorites = recipeData?.myFavorites ?? [];
  const articleFavorites = articleData?.myArticleFavorites ?? [];

  const loading = tab === 'recipes' ? recipeLoading : articleLoading;
  const hasPrev = tab === 'recipes' ? recipeOffset > 0 : articleOffset > 0;
  const hasMore =
    tab === 'recipes'
      ? recipeFavorites.length === FAV_LIMIT
      : articleFavorites.length === FAV_LIMIT;

  return (
    <div className="min-h-screen">
      {navbar}
      <div className="mx-auto max-w-3xl lg:max-w-4xl px-6 pb-16 pt-10">
        <button
          onClick={() => router.back()}
          className="mb-6 hover:text-cookie-400"
        >
          {t('common.back')}
        </button>

        <h1 className="mb-8 text-center">{t('nav.favorites')}</h1>

        <div className="mb-8 flex justify-center gap-3">
          <button
            onClick={() => setTab('recipes')}
            className={`rounded-full px-5 py-2 text-sm font-medium border-2 transition-colors ${
              tab === 'recipes'
                ? 'bg-cookie-400 border-cookie-400 text-white'
                : 'border-cookie-400 text-cookie-400 hover:bg-cookie-400 hover:text-white'
            }`}
          >
            {t('nav.recipes2')}
          </button>
          <button
            onClick={() => setTab('articles')}
            className={`rounded-full px-5 py-2 text-sm font-medium border-2 transition-colors ${
              tab === 'articles'
                ? 'bg-cookie-400 border-cookie-400 text-white'
                : 'border-cookie-400 text-cookie-400 hover:bg-cookie-400 hover:text-white'
            }`}
          >
            {t('nav.articles')}
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-cookie-300 border-t-transparent" />
          </div>
        ) : tab === 'recipes' ? (
          recipeFavorites.length === 0 && !hasPrev ? (
            <div className="py-12 text-center">
              <p>{t('recipes.noFavourites')}</p>
            </div>
          ) : (
            <div className="rounded-2xl bg-surface px-4 pb-8 pt-4 shadow-lg">
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {recipeFavorites.map((fav) => {
                  const recipe = fav.recipe;
                  if (!recipe) return null;
                  const title = isEl ? recipe.title_el : recipe.title_en;
                  return (
                    <div
                      key={fav.id}
                      onClick={() =>
                        router.push(`${recipeDetailPath}/${recipe.id}`)
                      }
                      className="cursor-pointer overflow-hidden rounded-2xl bg-surface shadow-xl transition duration-200 hover:scale-105 flex flex-col"
                    >
                      <div className="w-full bg-cookie-100 overflow-hidden">
                        <img
                          src={recipe.recipeImage!}
                          alt={title}
                          className="h-28 w-full object-cover"
                        />
                      </div>
                      <div className="px-3 pt-2 pb-3 flex flex-col justify-center text-center gap-1">
                        <p className="line-clamp-2 break-words">{title}</p>
                        <p className="text-xs">
                          {recipe.author?.user.username}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )
        ) : articleFavorites.length === 0 && !hasPrev ? (
          <div className="py-12 text-center">
            <p>{t('recipes.noArticleFavourites')}</p>
          </div>
        ) : (
          <div className="rounded-2xl bg-surface px-4 pb-8 pt-4 shadow-lg">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {articleFavorites.map((fav) => {
                const article = fav.article;
                if (!article) return null;
                const title = isEl ? article.title_el : article.title_en;
                return (
                  <div
                    key={fav.id}
                    onClick={() =>
                      router.push(`${articleDetailPath}/${article.id}`)
                    }
                    className="cursor-pointer overflow-hidden rounded-2xl bg-surface shadow-xl transition duration-200 hover:scale-105 flex flex-col"
                  >
                    <div className="w-full bg-cookie-100 overflow-hidden">
                      {article.image ? (
                        <img
                          src={article.image}
                          alt={title}
                          className="h-28 w-full object-cover"
                        />
                      ) : (
                        <div className="h-28 w-full" />
                      )}
                    </div>
                    <div className="px-3 pt-2 pb-3 flex flex-col justify-center text-center gap-1">
                      <p className="line-clamp-2 break-words">{title}</p>
                      <p className="text-xs">{article.creator?.username}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {!loading && (hasPrev || hasMore) && (
          <div className="mt-6">
            <PaginationControls
              hasPrev={hasPrev}
              hasMore={hasMore}
              onPrev={() => {
                if (tab === 'recipes') {
                  setRecipeOffset((o) => o - FAV_LIMIT);
                } else {
                  setArticleOffset((o) => o - FAV_LIMIT);
                }
                window.scrollTo({ top: 0 });
              }}
              onNext={() => {
                if (tab === 'recipes') {
                  setRecipeOffset((o) => o + FAV_LIMIT);
                } else {
                  setArticleOffset((o) => o + FAV_LIMIT);
                }
                window.scrollTo({ top: 0 });
              }}
              prevLabel={
                tab === 'recipes'
                  ? t('pagination.prevFavorites')
                  : t('pagination.prevArticles')
              }
              nextLabel={
                tab === 'recipes'
                  ? t('pagination.nextFavorites')
                  : t('pagination.nextArticles')
              }
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default BrowseFavoritesContent;
