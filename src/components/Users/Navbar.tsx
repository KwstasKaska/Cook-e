import { useTranslation } from 'next-i18next';
import BaseNavbar, { NavLink } from '../Helper/BaseNavbar';

const Navbar = () => {
  const { t } = useTranslation('common');

  const links: NavLink[] = [
    { href: '/user', label: t('nav.home') },
    { href: '/user/search-recipes', label: t('nav.recipes') },
    { href: '/user/nutritionists', label: t('nav.nutritionists') },
    { href: '/user/cart', label: t('nav.cart') },
    { href: '/user/favorites', label: t('nav.favorites') },
  ];

  return <BaseNavbar links={links} />;
};

export default Navbar;
