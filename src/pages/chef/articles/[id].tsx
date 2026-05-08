import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import ChefNavbar from '../../../components/Chef/ChefNavbar';
import useIsChef from '../../../utils/useIsChef';
import ArticleSinglePage from '../../../components/Article/ArticleSinglePage';

export default function ArticleDetail() {
  const { loading: authLoading, isAuthorized } = useIsChef();
  if (authLoading || !isAuthorized) return null;

  return (
    <ArticleSinglePage
      Navbar={ChefNavbar}
      listCacheField="articlesByChef"
      deleteRedirect="/chef/profile"
      backHref="/chef/articles"
      showDate
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
