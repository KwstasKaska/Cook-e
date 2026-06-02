import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import NutrNavbar from '../../../components/Nutritionist/NutrNavbar';
import useIsNutr from '../../../utils/useIsNutr';
import BrowseRecipesContent from '../../../components/Article/BrowseRecipesContent';

export async function getServerSideProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}

export default function NutrBrowseRecipesPage() {
  const { loading: authLoading, isAuthorized } = useIsNutr();
  if (authLoading || !isAuthorized) return null;
  const { t } = useTranslation('common');
  return (
    <BrowseRecipesContent
      navbar={<NutrNavbar />}
      detailPath="/nutritionist/recipes"
      title={t('nutr.nutr_recipes')}
    />
  );
}
