import React from 'react';

const GeneralNav: React.FC = () => {
  return (
    <nav className="  text-black">
      <ul className=" grid  grid-flow-col justify-evenly text-9 font-bold uppercase    md:text-15 xl:text-20">
        <li className="">
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
