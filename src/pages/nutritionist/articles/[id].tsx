import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import NutrNavbar from '../../../components/Nutritionist/NutrNavbar';
import useIsNutr from '../../../utils/useIsNutr';
import ArticleSinglePage from '../../../components/Article/ArticleSinglePage';

const NutrArticleDetail = () => {
  const { loading: authLoading, isAuthorized } = useIsNutr();
  if (authLoading || !isAuthorized) return null;

  return (
    <ArticleSinglePage
      Navbar={NutrNavbar}
      listCacheField="myArticles"
      deleteRedirect="/nutritionist/articles"
      backHref="/nutritionist/articles"
    />
  );
};

export const getServerSideProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common'])),
  },
});

export default NutrArticleDetail;
