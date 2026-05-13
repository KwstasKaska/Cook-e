import { useTranslation } from 'next-i18next';
import BaseNavbar, { NavLink } from '../Helper/BaseNavbar';

const ChefNavbar = () => {
  const { t } = useTranslation('common');

  const links: NavLink[] = [
    { kind: 'href', href: '/chef', label: t('chefnav.chef_index') },
    {
      kind: 'href',
      href: '/chef/create-recipe',
      label: t('chefnav.chef_create'),
    },
  ];

  return <BaseNavbar links={links} />;
};

export default ChefNavbar;
