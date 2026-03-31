import React from 'react';
import { useTranslation } from 'next-i18next';

const GeneralNav: React.FC = () => {
  const { t } = useTranslation('common');

  return (
    <nav className="text-black">
      <ul className=" grid  grid-flow-col justify-evenly text-9 font-bold     md:text-sm xl:text-xl">
        <li className="">
          <a href="#">{t('general_nav.home')}</a>
        </li>
        <li>
          <a href="#">{t('general_nav.user')}</a>
        </li>
        <li>
          <a href="#">{t('general_nav.chef')}</a>
        </li>
        <li>
          <a href="#">{t('general_nav.nutritionist')}</a>
        </li>
      </ul>
    </nav>
  );
};

export default GeneralNav;
