import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import ChefNavbar from '../../../../components/Chef/ChefNavbar';
import useIsChef from '../../../../utils/useIsChef';
import BrowseArticleDetail from '../../../../components/Article/BrowseArticleDetail';

export async function getServerSideProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}

export default function ChefBrowseArticleDetailPage() {
  const { loading: authLoading, isAuthorized } = useIsChef();
  if (authLoading || !isAuthorized) return null;
  return <BrowseArticleDetail navbar={<ChefNavbar />} />;
}
