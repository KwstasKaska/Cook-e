import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import NutrNavbar from '../../../components/Nutritionist/NutrNavbar';
import useIsNutr from '../../../utils/useIsNutr';
import BrowseFavoritesContent from '../../../components/Favorites/BrowseFavoritesContent';

export async function getServerSideProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}

export default function NutrFavoritesPage() {
  const { loading: authLoading, isAuthorized } = useIsNutr();
  if (authLoading || !isAuthorized) return null;
  return (
    <BrowseFavoritesContent
      navbar={<NutrNavbar />}
      recipeDetailPath="/nutritionist/recipes"
      articleDetailPath="/nutritionist/articles/browse"
      homeRoute="/nutritionist"
    />
  );
}
