import React, { useState } from 'react';
import Image from 'next/image';
import settings from '/public/images/settings.svg';
import logo from '/public/images/logo.png';
import Link from 'next/link';

const NutrNavbar: React.FC = () => {
  const [isToggle, setIsToggle] = useState<boolean>(false);

  const handleNavbarClick = () => {
    setIsToggle(!isToggle);
  };

  return (
    <header className="flex w-full justify-between bg-myBlue-100 px-[.4em] py-[1em] ">
      <Link href="#" className="cursor-pointer">
        <Image src={logo} alt={'Cook-e logo'}></Image>
      </Link>
      <button onClick={handleNavbarClick} className="cursor-pointer md:hidden">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="white"
          className="h-8 w-8"
        >
          <path d="M3 6.75A.75.75 0 013.75 6h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 6.75zM3 12a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 12zm0 5.25a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75a.75.75 0 01-.75-.75z" />
        </svg>
      </button>
      <button className="hidden">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="white"
          className=" h-6 w-6"
        >
          <path d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" />
        </svg>

        <span className="hidden">Menu</span>
      </button>

      <nav className="hidden md:flex ">
        <ul className="flex items-center gap-4 uppercase">
          <li className="">
            <Link href="#">Αρθρα</Link>
          </li>
          <li>
            <Link href="#">Ημερολογιο</Link>
          </li>
          <li>
            <Link href="#">Διαχειριση Ραντεβου</Link>
          </li>
          <li>
            <Link href="#">Προγραμματισμος Διατροφων</Link>
          </li>
          <li>
            <Link href="#">
              <Image src={settings} alt={'Ρυθμίσεις'}></Image>
            </Link>
          </li>
        </ul>
      </nav>
      <button className="hidden uppercase">Εξοδος</button>
    </header>
  );
};

export default NutrNavbar;
