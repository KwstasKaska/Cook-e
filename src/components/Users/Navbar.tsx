import { useTranslation } from 'next-i18next';
import BaseNavbar, { NavLink } from '../Helper/BaseNavbar';

const Navbar = () => {
  const { t } = useTranslation('common');

  const links: NavLink[] = [
    { kind: 'href', href: '/user', label: t('nav.home') },
    { kind: 'href', href: '/user/recipes', label: t('nav.recipes') },
    {
      kind: 'href',
      href: '/user/nutritionists',
      label: t('nav.nutritionists'),
    },
    { kind: 'href', href: '/user/chat', label: t('nav.chat') },
    { kind: 'href', href: '/user/cart', label: t('nav.cart') },
  ];

  return <BaseNavbar links={links} bg="bg-cookie-200" />;
};

export default Navbar;
