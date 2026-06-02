import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import ChefNavbar from '../../../components/Chef/ChefNavbar';
import useIsChef from '../../../utils/useIsChef';
import BrowseArticlesContent from '../../../components/Article/BrowseArticlesContent';

export async function getServerSideProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}

export default function ChefBrowseArticlesPage() {
  const { loading: authLoading, isAuthorized } = useIsChef();
  if (authLoading || !isAuthorized) return null;
  return (
    <BrowseArticlesContent
      navbar={<ChefNavbar />}
      detailPath="/chef/articles/browse"
    />
  );
}
