import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import NutrNavbar from '../../../components/Nutritionist/NutrNavbar';
import useIsNutr from '../../../utils/useIsNutr';
import BrowseRecipeDetail from '../../../components/Recipes/BrowseRecipeDetail';

export async function getServerSideProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}

export default function NutrRecipeDetailPage() {
  const { loading: authLoading, isAuthorized } = useIsNutr();
  if (authLoading || !isAuthorized) return null;
  return <BrowseRecipeDetail navbar={<NutrNavbar />} role="nutritionist" />;
}
