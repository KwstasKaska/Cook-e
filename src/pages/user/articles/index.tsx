import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Navbar from '../../../components/Users/Navbar';
import useIsUser from '../../../utils/useIsUser';
import BrowseArticlesContent from '../../../components/Article/BrowseArticlesContent';

export async function getServerSideProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}

export default function UserArticlesPage() {
  const { loading: authLoading, isAuthorized } = useIsUser();
  if (authLoading || !isAuthorized) return null;
  return (
    <BrowseArticlesContent navbar={<Navbar />} detailPath="/user/articles" />
  );
}
