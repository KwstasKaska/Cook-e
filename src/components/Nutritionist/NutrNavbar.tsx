import { useTranslation } from 'next-i18next';
import BaseNavbar, { NavLink } from '../Helper/BaseNavbar';

const NutrNavbar = () => {
  const { t } = useTranslation('common');

  const links: NavLink[] = [
    { href: '/nutritionist', label: t('nutrnav.overview') },
    { href: '/nutritionist/appointments', label: t('nutrnav.appointments') },
    { href: '/nutritionist/mealplans', label: t('nutrnav.mealplans') },
    { href: '/nutritionist/favorites', label: t('nav.favorites') },
  ];

  return <BaseNavbar links={links} />;
};

export default NutrNavbar;
