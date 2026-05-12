import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import {
  useMyArticlesQuery,
  useArticlesByChefQuery,
} from '../../generated/graphql';
import { pick } from '../../utils/pick';
import ArticleForm from './ArticleForm';
import PaginationControls from '../Helper/PaginationControls';

const LIMIT = 6;

type Props =
  | {
      mode: 'chef';
      chefUserId: number;
      articleHrefBase: string;
      cacheEvictFields: string[];
    }
  | {
      mode: 'nutr';
      articleHrefBase: string;
      cacheEvictFields: string[];
    };

const ArticlesSection = (props: Props) => {
  const { t, i18n } = useTranslation('common');
  const lang = i18n.language;
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [offset, setOffset] = useState(0);

  const chefQuery = useArticlesByChefQuery({
    variables:
      props.mode === 'chef'
        ? { chefId: props.chefUserId, limit: LIMIT, offset }
        : { chefId: 0, limit: LIMIT, offset: 0 },
    skip: props.mode !== 'chef',
  });

  const nutrQuery = useMyArticlesQuery({
    variables: { limit: LIMIT, offset },
    fetchPolicy: 'cache-and-network',
    skip: props.mode !== 'nutr',
  });

  const articles =
    props.mode === 'chef'
      ? chefQuery.data?.articlesByChef ?? []
      : nutrQuery.data?.myArticles ?? [];

  const loading = props.mode === 'chef' ? chefQuery.loading : nutrQuery.loading;
  const hasMore = articles.length === LIMIT;
  const hasPrev = offset > 0;

  return (
    <div className="flex flex-col items-center">
      {loading && (
        <p className="text-center  text-myText-muted">{t('common.loading')}</p>
      )}

      {!loading && articles.length === 0 && (
        <p className="text-center  text-myText-muted">
          {t('chef.profile.no_articles')}
        </p>
      )}

      {!loading && articles.length > 0 && (
        <div className="w-full grid grid-cols-2 gap-4 md:grid-cols-3">
          {articles.map((article) => (
            <Link
              key={article.id}
              href={`${props.articleHrefBase}/${article.id}`}
              className="cursor-pointer overflow-hidden rounded-xl bg-cookie-100 transition hover:scale-105 hover:shadow-lg"
            >
              <div className="relative h-28 w-full overflow-hidden">
                <Image
                  src={article.image}
                  alt={pick(article.title_el, article.title_en, lang)}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-2">
                <p className="line-clamp-2 leading-tight">
                  {pick(article.title_el, article.title_en, lang)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}

      {!loading && (hasMore || hasPrev) && (
        <div className="mt-4 w-full">
          <PaginationControls
            hasPrev={hasPrev}
            hasMore={hasMore}
            onPrev={() => setOffset((o) => o - LIMIT)}
            onNext={() => setOffset((o) => o + LIMIT)}
          />
        </div>
      )}

      {showCreateForm && (
        <div className="mt-6 w-full rounded-2xl bg-cookie-100 p-5">
          <ArticleForm
            rows={6}
            onSuccess={() => setShowCreateForm(false)}
            onCancel={() => setShowCreateForm(false)}
            cacheEvictFields={props.cacheEvictFields}
          />
        </div>
      )}

      {!showCreateForm && (
        <button
          onClick={() => setShowCreateForm(true)}
          className="mt-6 flex items-center gap-1.5 rounded-full bg-cookie-300 px-4 py-0.5   transition hover:bg-cookie-400"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            stroke="currentColor"
            className="h-3.5 w-3.5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
          {t('chef.profile.create_article')}
        </button>
      )}
    </div>
  );
};

export default ArticlesSection;
