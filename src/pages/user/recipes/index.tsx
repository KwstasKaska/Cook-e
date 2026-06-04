import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import Navbar from '../../../components/Users/Navbar';
import useIsUser from '../../../utils/useIsUser';
import BrowseRecipesContent from '../../../components/Recipes/BrowseRecipesContent';

export async function getServerSideProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}

export default function UserBrowseRecipesPage() {
  const { loading: authLoading, isAuthorized } = useIsUser();
  if (authLoading || !isAuthorized) return null;
  const { t } = useTranslation('common');
  return (
    <BrowseRecipesContent
      navbar={<Navbar />}
      detailPath="/user/recipes"
      title={t('chef.overview.allRecipes')}
    />
  );
}
