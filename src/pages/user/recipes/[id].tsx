import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Navbar from '../../../components/Users/Navbar';
import useIsUser from '../../../utils/useIsUser';
import BrowseRecipeDetail from '../../../components/Recipes/BrowseRecipeDetail';

export async function getServerSideProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}

export default function RecipeDetailPage() {
  const { loading: authLoading, isAuthorized } = useIsUser();
  if (authLoading || !isAuthorized) return null;
  return <BrowseRecipeDetail navbar={<Navbar />} role="user" />;
}
