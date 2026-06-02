import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import BrowseRecipesContent from '../../../components/Article/BrowseRecipesContent';
import ChefNavbar from '../../../components/Chef/ChefNavbar';
import useIsChef from '../../../utils/useIsChef';

export async function getServerSideProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}

export default function ChefBrowseRecipesPage() {
  const { loading: authLoading, isAuthorized } = useIsChef();
  if (authLoading || !isAuthorized) return null;
  const { t } = useTranslation('common');
  return (
    <BrowseRecipesContent
      navbar={<ChefNavbar />}
      detailPath="/chef/recipes/browse"
      title={t('chef.overview.allRecipes')}
    />
  );
}
