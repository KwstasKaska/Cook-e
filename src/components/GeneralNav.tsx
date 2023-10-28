import React from 'react';

const GeneralNav: React.FC = () => {
  return (
    <nav className="  text-black">
      <ul className=" grid  grid-flow-col justify-evenly text-9 font-bold     md:text-sm xl:text-xl">
        <li className="">
          <a href="#">Αρχική</a>
        </li>
        <li>
          <a href="#">Χρήστης</a>
        </li>
        <li>
          <a href="#">Chef</a>
        </li>
        <li>
          <a href="#">Διατροφολόγος</a>
        </li>
      </ul>
    </nav>
  );
};

export default GeneralNav;
