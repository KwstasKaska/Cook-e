import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Navbar from '../../../components/Users/Navbar';
import useIsUser from '../../../utils/useIsUser';
import BrowseFavoritesContent from '../../../components/Favorites/BrowseFavoritesContent';

export async function getServerSideProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}

export default function FavoritesPage() {
  const { loading: authLoading, isAuthorized } = useIsUser();
  if (authLoading || !isAuthorized) return null;
  return (
    <BrowseFavoritesContent
      navbar={<Navbar />}
      recipeDetailPath="/user/recipes"
      articleDetailPath="/user/articles"
    />
  );
}
