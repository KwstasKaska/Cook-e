import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import NutrNavbar from '../../../../components/Nutritionist/NutrNavbar';
import useIsNutr from '../../../../utils/useIsNutr';
import BrowseArticleDetail from '../../../../components/Article/BrowseArticleDetail';

export async function getServerSideProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}

export default function NutrBrowseArticleDetailPage() {
  const { loading: authLoading, isAuthorized } = useIsNutr();
  if (authLoading || !isAuthorized) return null;
  return <BrowseArticleDetail navbar={<NutrNavbar />} />;
}
