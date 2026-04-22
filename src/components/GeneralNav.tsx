import React from 'react';
import { useTranslation } from 'next-i18next';

const GeneralNav: React.FC = () => {
  const { t } = useTranslation('common');

  return (
    <nav className="text-black">
      <ul className="grid grid-flow-col justify-evenly text-9 font-bold md:text-sm xl:text-xl">
        <li>{t('general_nav.home')}</li>
        <li>{t('general_nav.user')}</li>
        <li>{t('general_nav.chef')}</li>
        <li>{t('general_nav.nutritionist')}</li>
      </ul>
    </nav>
  );
};

export default GeneralNav;
