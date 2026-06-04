import { useTranslation } from 'next-i18next';
import BaseNavbar, { NavLink } from '../Helper/BaseNavbar';

const ChefNavbar = () => {
  const { t } = useTranslation('common');

  const links: NavLink[] = [
    { href: '/chef', label: t('chefnav.chef_index') },
    { href: '/chef/create-recipe', label: t('chefnav.chef_create') },
    { href: '/chef/favorites', label: t('nav.favorites') },
  ];

  return <BaseNavbar links={links} />;
};

export default ChefNavbar;
