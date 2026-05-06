import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import NutrNavbar from '../../components/Nutritionist/NutrNavbar';
import useIsNutr from '../../utils/useIsNutr';
import ArticleForm from '../../components/Article/ArticleForm';

const CreateArticle: NextPage = () => {
  const { t } = useTranslation('common');
  const router = useRouter();
  useIsNutr();

  return (
    <div className="flex min-h-screen flex-col">
      <NutrNavbar />

      <main className="flex flex-1 flex-col items-center px-4 py-8 md:px-8">
        <div className="w-full max-w-2xl">
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

          <div className="w-full bg-myBeige-100 overflow-hidden rounded-2xl shadow-xl p-6 md:p-8">
            <ArticleForm
              rows={10}
              onSuccess={() => router.push('/nutritionist')}
              onCancel={() => router.back()}
              cacheEvictFields={['myArticles', 'articles']}
            />
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

export default CreateArticle;
