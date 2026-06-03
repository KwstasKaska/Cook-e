import Image from 'next/image';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { useArticleQuery } from '../../generated/graphql';
import { pick } from '../../utils/pick';
import ShareButton from '../Helper/ShareButton';

type Props = {
  navbar: React.ReactNode;
};

const BrowseArticleDetail = ({ navbar }: Props) => {
  const { t, i18n } = useTranslation('common');
  const lang = i18n.language;
  const router = useRouter();
  const articleId = router.isReady ? Number(router.query.id) : null;

  const { data, loading } = useArticleQuery({
    variables: { id: articleId! },
    skip: !articleId,
    fetchPolicy: 'network-only',
  });

  const article = data?.article;
  const title = article ? pick(article.title_el, article.title_en, lang) : '';
  const text = article ? pick(article.text_el, article.text_en, lang) : '';

  if (loading) {
    return (
      <div className="min-h-screen">
        {navbar}
        <div className="flex justify-center pt-24">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-cookie-400 border-t-transparent" />
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen">
        {navbar}
        <p className="pt-24 text-center">{t('chef.recipe_detail.not_found')}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {navbar}

      <main className="mx-auto w-full max-w-3xl px-6 pb-20 pt-8">
        <button
          onClick={() => router.back()}
          className="mb-6 hover:text-cookie-400"
        >
          {t('common.back')}
        </button>

        <div className="overflow-hidden rounded-2xl bg-surface shadow-xl">
          <div className="relative h-56 w-full">
            <Image
              src={article.image}
              alt={title}
              fill
              sizes="(max-width: 768px) 100vw, 672px"
              className="object-cover"
            />
          </div>

          <div className="p-6 md:p-8">
            <h1 className="mb-4">{title}</h1>

            {article.creator && (
              <div className="mb-4 flex items-center gap-3">
                {article.creator.image ? (
                  <img
                    src={article.creator.image}
                    alt={article.creator.username}
                    className="h-9 w-9 rounded-full border-2 border-cookie-400 object-cover"
                  />
                ) : (
                  <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-cookie-400 bg-cookie-200">
                    {article.creator.username?.[0]?.toUpperCase() ?? '?'}
                  </div>
                )}
                <span>{article.creator.username}</span>
              </div>
            )}

            <div className="mb-6">
              <ShareButton
                dark
                url={
                  typeof window !== 'undefined'
                    ? `${window.location.origin}/user/articles/${articleId}`
                    : ''
                }
              />
            </div>

            <p className="whitespace-pre-line">{text}</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BrowseArticleDetail;
