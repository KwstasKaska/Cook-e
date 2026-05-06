import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import NutrNavbar from '../../../components/Nutritionist/NutrNavbar';
import useIsNutr from '../../../utils/useIsNutr';
import ArticleSinglePage from '../../../components/Article/ArticleSinglePage';

export default function NutrArticleDetail() {
  useIsNutr();

  return (
    <ArticleSinglePage
      Navbar={NutrNavbar}
      listCacheField="myArticles"
      deleteRedirect="/nutritionist"
    />
  );
}

export async function getServerSideProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}
