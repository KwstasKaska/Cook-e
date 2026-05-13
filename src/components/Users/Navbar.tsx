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
  ];

  return <BaseNavbar links={links} />;
};

export default Navbar;
