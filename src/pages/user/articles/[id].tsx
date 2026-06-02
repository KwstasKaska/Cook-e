import Image from 'next/image';
import { useRouter } from 'next/router';
import Navbar from '../../../components/Users/Navbar';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import {
  useArticleQuery,
  useIsArticleFavoritedQuery,
  useSaveArticleMutation,
  useUnsaveArticleMutation,
} from '../../../generated/graphql';
import useIsUser from '../../../utils/useIsUser';
import { pick } from '../../../utils/pick';

export default function ArticleDetailPage() {
  const { loading: authLoading, isAuthorized } = useIsUser();
  if (authLoading || !isAuthorized) return null;
  return <ArticleDetailContent />;
}

const ArticleDetailContent = () => {
  const { t, i18n } = useTranslation('common');
  const lang = i18n.language;
  const router = useRouter();
  const id = router.query.id ? parseInt(router.query.id as string) : undefined;

  const { data, loading } = useArticleQuery({
    variables: { id: id! },
    skip: !id,
  });

  const { data: favData, refetch: refetchFav } = useIsArticleFavoritedQuery({
    variables: { articleId: id! },
    skip: !id,
  });

  const [saveArticle] = useSaveArticleMutation();
  const [unsaveArticle] = useUnsaveArticleMutation();

  const isFavorited = favData?.isArticleFavorited ?? false;

  const handleToggleFavorite = async () => {
    if (isFavorited) {
      await unsaveArticle({ variables: { articleId: id! } });
    } else {
      await saveArticle({ variables: { articleId: id! } });
    }
    await refetchFav();
  };

  const article = data?.article;

  if (loading || !id) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <div className="flex flex-1 items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-cookie-400 border-t-transparent" />
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <div className="flex flex-1 items-center justify-center">
          <p>{t('chef.article.not_found')}</p>
        </div>
      </div>
    );
  }

  const title = pick(article.title_el, article.title_en, lang);
  const text = pick(article.text_el, article.text_en, lang);
  const heroSrc = article.image ?? '/images/food.jpg';

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex flex-1 flex-col items-center px-4 py-8 md:px-8">
        <div className="w-full max-w-2xl">
          <button
            onClick={() => router.back()}
            className="mb-6 flex items-center gap-2 transition"
          >
            {t('common.back')}
          </button>

          <div className="w-full overflow-hidden rounded-2xl bg-surface shadow-xl">
            <div className="relative h-48 w-full">
              <Image src={heroSrc} alt={title} fill className="object-cover" />
            </div>

            <div className="p-6 md:p-8">
              <div className="mb-4 flex items-center gap-3">
                {article.creator?.image ? (
                  <img
                    src={article.creator.image}
                    alt={article.creator.username}
                    className="h-9 w-9 flex-shrink-0 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-myText-heading">
                    {article.creator?.username?.[0]?.toUpperCase() ?? '?'}
                  </div>
                )}
                <div>
                  <p>{article.creator?.username ?? '—'}</p>
                  <p>
                    {new Date(parseInt(article.createdAt)).toLocaleDateString(
                      lang === 'en' ? 'en-GB' : 'el-GR',
                      { day: 'numeric', month: 'long', year: 'numeric' },
                    )}
                  </p>
                </div>
              </div>

              <button
                onClick={handleToggleFavorite}
                className={`mb-5 inline-flex rounded-xl border-2 px-4 py-1.5 transition ${
                  isFavorited
                    ? 'border-herb-200 bg-herb-200 hover:border-myRed hover:bg-myRed text-white'
                    : 'border-cookie-400 hover:bg-cookie-400 hover:text-white'
                }`}
              >
                {isFavorited
                  ? t('recipes.savedToFavorites')
                  : t('recipes.save')}
              </button>

              <h1 className="mb-5">{title}</h1>

              <p className="whitespace-pre-line">{text}</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export async function getServerSideProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}
