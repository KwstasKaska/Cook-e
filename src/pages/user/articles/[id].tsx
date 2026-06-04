import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Navbar from '../../../components/Users/Navbar';
import useIsUser from '../../../utils/useIsUser';
import BrowseArticleDetail from '../../../components/Article/BrowseArticleDetail';

export default function ArticleDetailPage() {
  const { loading: authLoading, isAuthorized } = useIsUser();
  if (authLoading || !isAuthorized) return null;
  return <BrowseArticleDetail navbar={<Navbar />} />;
}

export async function getServerSideProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}
