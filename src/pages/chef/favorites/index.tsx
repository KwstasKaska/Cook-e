import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import ChefNavbar from '../../../components/Chef/ChefNavbar';
import useIsChef from '../../../utils/useIsChef';
import BrowseFavoritesContent from '../../../components/Favorites/BrowseFavoritesContent';

export async function getServerSideProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}

export default function ChefFavoritesPage() {
  const { loading: authLoading, isAuthorized } = useIsChef();
  if (authLoading || !isAuthorized) return null;
  return (
    <BrowseFavoritesContent
      navbar={<ChefNavbar />}
      recipeDetailPath="/chef/recipes/browse"
      articleDetailPath="/chef/articles/browse"
    />
  );
}
