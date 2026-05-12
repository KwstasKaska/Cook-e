import { useTranslation } from 'next-i18next';
import BaseNavbar, { NavLink } from '../Helper/BaseNavbar';

const NutrNavbar = () => {
  const { t } = useTranslation('common');

  const links: NavLink[] = [
    { kind: 'href', href: '/nutritionist', label: t('nutrnav.nutr_home') },
    { kind: 'href', href: '/nutritionist/articles', label: t('nav.articles') },
    {
      kind: 'href',
      href: '/nutritionist/mealplans',
      label: t('nutrnav.nutr_scheduler'),
    },
  ];

  return <BaseNavbar links={links} bg="bg-cookie-100" />;
};

export default NutrNavbar;
