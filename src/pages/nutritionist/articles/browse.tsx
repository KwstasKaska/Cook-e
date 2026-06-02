import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import useIsNutr from '../../../utils/useIsNutr';
import NutrNavbar from '../../../components/Nutritionist/NutrNavbar';
import BrowseArticlesContent from '../../../components/Article/BrowseArticlesContent';

export async function getServerSideProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}

export default function NutrBrowseArticlesPage() {
  const { loading: authLoading, isAuthorized } = useIsNutr();
  if (authLoading || !isAuthorized) return null;
  return (
    <BrowseArticlesContent
      navbar={<NutrNavbar />}
      detailPath="/nutritionist/articles/browse"
    />
  );
}
