import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import ChefNavbar from '../../../components/Chef/ChefNavbar';
import useIsChef from '../../../utils/useIsChef';
import ArticleDetailView from '../../../components/Article/ArticleDetailView';

export default function ArticleDetail() {
  const { loading: authLoading, isAuthorized } = useIsChef();
  if (authLoading || !isAuthorized) return null;

  return (
    <ArticleDetailView
      Navbar={ChefNavbar}
      listCacheField="articlesByChef"
      deleteRedirect="/chef/profile"
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
