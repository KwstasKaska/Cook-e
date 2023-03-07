import { NextPage } from 'next';
import React from 'react';

const GeneralNav: NextPage = () => {
  return (
    <nav className=" text-black ">
      <ul className=" uppercase  text-9 font-bold grid grid-flow-col justify-evenly  md:text-15  xl:text-20 ">
        <li>
          <a href="#">Αρχικη</a>
        </li>
        <li>
          <a href="#">Χρηστης</a>
        </li>
        <li>
          <a href="#">Chef</a>
        </li>
        <li>
          <a href="#">Διατροφολογος</a>
        </li>
      </ul>
    </nav>
  );
};

export default GeneralNav;
