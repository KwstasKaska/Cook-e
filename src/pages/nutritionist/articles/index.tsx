import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import ArticlesSection from '../../../components/Article/ArticleSection';
import NutrNavbar from '../../../components/Nutritionist/NutrNavbar';
import useIsNutr from '../../../utils/useIsNutr';

const NutrArticlesPage = () => {
  const { loading: authLoading, isAuthorized } = useIsNutr();
  if (authLoading || !isAuthorized) return null;
  return <NutrArticlesContent />;
};

const NutrArticlesContent = () => {
  const { t } = useTranslation('common');

  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <NutrNavbar />

      <main className="flex flex-1 flex-col items-center px-4 py-8 md:px-8">
        <div className="w-full max-w-5xl">
          <h1 className="mb-6 text-center">{t('nutr.yourArticles')}</h1>
          <ArticlesSection
            mode="nutr"
            articleHrefBase="/nutritionist/articles"
            cacheEvictFields={['myArticles', 'articles']}
          />
        </div>
      </main>
    </div>
  );
};

export const getServerSideProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common'])),
  },
});

export default NutrArticlesPage;
