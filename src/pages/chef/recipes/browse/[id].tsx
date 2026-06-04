import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import ChefNavbar from '../../../../components/Chef/ChefNavbar';
import useIsChef from '../../../../utils/useIsChef';
import BrowseRecipeDetail from '../../../../components/Recipes/BrowseRecipeDetail';

export async function getServerSideProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}

export default function ChefBrowseRecipeDetailPage() {
  const { loading: authLoading, isAuthorized } = useIsChef();
  if (authLoading || !isAuthorized) return null;
  return <BrowseRecipeDetail navbar={<ChefNavbar />} role="chef" />;
}
