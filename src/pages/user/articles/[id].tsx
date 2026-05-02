import Image from 'next/image';
import { useRouter } from 'next/router';
import Navbar from '../../../components/Users/Navbar';
import ScrollToTopButton from '../../../components/Helper/ScrollToTopButton';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import { useArticleQuery } from '../../../generated/graphql';
import useIsUser from '../../../utils/useIsUser';
import { pick } from '../../../utils/pick';

export default function ArticleDetailPage() {
  const { loading: authLoading, isAuthorized } = useIsUser();
  if (authLoading || !isAuthorized) return null;
  return <ArticleDetailContent />;
}

function ArticleDetailContent() {
  const { t, i18n } = useTranslation('common');
  const lang = i18n.language;
  const router = useRouter();
  const id = router.query.id ? parseInt(router.query.id as string) : undefined;

  const { data, loading } = useArticleQuery({
    variables: { id: id! },
    skip: !id,
  });

  const article = data?.article;

  if (loading || !id) {
    return (
      <div className="flex  min-h-screen flex-col">
        <Navbar />
        <div className="flex flex-1 items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-myBlue-200 border-t-transparent" />
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="flex  min-h-screen flex-col">
        <Navbar />
        <div className="flex flex-1 items-center justify-center">
          <p className="text-white opacity-60">{t('chef.article.not_found')}</p>
        </div>
      </div>
    );
  }

  const title = pick(article.title_el, article.title_en, lang);
  const text = pick(article.text_el, article.text_en, lang);
  const heroSrc = article.image ?? '/images/food.jpg';

  return (
    <div className="flex  min-h-screen flex-col">
      <Navbar />

      <main className="flex flex-1 flex-col items-center px-4 py-8 md:px-8">
        <div className="w-full max-w-2xl">
          {/* Back */}
          <button
            onClick={() => router.back()}
            className="mb-6 flex items-center gap-2 text-sm font-semibold transition hover:opacity-70"
            style={{ color: 'rgba(255,255,255,0.75)' }}
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
                d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
              />
            </svg>
            {t('common.back')}
          </button>

          {/* Article card */}
          <div
            className="w-full overflow-hidden rounded-2xl shadow-xl"
            style={{ backgroundColor: '#E9DEC5' }}
          >
            {/* Hero image */}
            <div className="relative h-64 w-full">
              <Image src={heroSrc} alt={title} fill className="object-cover" />
            </div>

            {/* Content */}
            <div className="p-6 md:p-8">
              {/* Author + date */}
              <div className="mb-4 flex items-center gap-3">
                {article.creator?.image ? (
                  <img
                    src={article.creator.image}
                    alt={article.creator.username}
                    className="h-9 w-9 flex-shrink-0 rounded-full object-cover"
                  />
                ) : (
                  <div
                    className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
                    style={{ backgroundColor: '#377CC3' }}
                  >
                    {article.creator?.username?.[0]?.toUpperCase() ?? '?'}
                  </div>
                )}
                <div>
                  <p className="text-sm font-bold">
                    {article.creator?.username ?? '—'}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(parseInt(article.createdAt)).toLocaleDateString(
                      lang === 'en' ? 'en-GB' : 'el-GR',
                      { day: 'numeric', month: 'long', year: 'numeric' },
                    )}
                  </p>
                </div>
              </div>

              {/* Title */}
              <h1 className="mb-5 text-2xl  font-bold leading-snug">{title}</h1>

              {/* Body */}
              <p
                className="text-sm leading-relaxed whitespace-pre-line"
                style={{ color: '#4A5568' }}
              >
                {text}
              </p>
            </div>
          </div>
        </div>
      </main>

      <ScrollToTopButton />
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
