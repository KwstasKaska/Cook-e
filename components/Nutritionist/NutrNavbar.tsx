import React, { useEffect, useState } from 'react';
import Image from 'next/image';
// import settings from '/public/images/settings.svg';
import logo from '/public/images/logo.png';
import Link from 'next/link';

const NutrNavbar: React.FC = () => {
  const [isToggle, setIsToggle] = useState<boolean>(true);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 767) {
        setIsToggle(true);
      } else {
        return;
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleNavbarClick = () => {
    setIsToggle(!isToggle);
  };

  return (
    <div>
      <header
        className={` ${
          isToggle ? ' flex w-full  bg-myBlue-100  ' : 'relative'
        }  `}
      >
        <div
          className={` ${
            isToggle
              ? 'flex w-full justify-between py-[1em] md:block md:w-fit'
              : 'absolute z-[1]  grid w-full grid-flow-col items-start justify-between   pb-[22em] pt-4'
          } bg-myBlue-100 px-[.4em] `}
        >
          <Link href="#" className="cursor-pointer">
            <Image src={logo} alt={'Cook-e logo'} className=" "></Image>
          </Link>
          <button
            onClick={handleNavbarClick}
            className="cursor-pointer md:hidden"
          >
            {isToggle ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="white"
                className=" h-8 w-8"
              >
                <path d="M3 6.75A.75.75 0 013.75 6h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 6.75zM3 12a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 12zm0 5.25a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75a.75.75 0 01-.75-.75z" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="white"
                className=" h-8 w-8"
              >
                <path d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" />
              </svg>
            )}
          </button>
        </div>

        <nav
          className={` ${
            isToggle
              ? 'hidden md:grid md:w-full md:grid-flow-col md:justify-center '
              : 'absolute z-[2] mx-auto mt-24 w-full'
          }`}
        >
          <ul
            className={` ${
              isToggle ? 'flex max-w-[1268px] ' : 'flex flex-col  '
            } items-center gap-4 text-xl font-bold capitalize text-black md:text-base lg:gap-12  xl:text-2xl`}
          >
            <li className="">
              <Link onClick={() => setIsToggle(true)} href="#section_1">
                Αρθρα
              </Link>
            </li>
            <li>
              <Link onClick={() => setIsToggle(true)} href="#section_2">
                Ημερολογιο
              </Link>
            </li>
            <li>
              <Link onClick={() => setIsToggle(true)} href="#section_3">
                Διαχειριση Ραντεβου
              </Link>
            </li>
            <li>
              <Link
                onClick={() => setIsToggle(true)}
                href="#section_4"
                className=""
              >
                Προγραμματισμος Διατροφων
              </Link>
            </li>

            <button
              className={` ${
                isToggle ? 'hidden ' : ''
              } rounded-[1.4rem] border-2  border-black bg-transparent px-4 py-1  text-15 font-bold text-black hover:bg-myRed hover:text-white md:block`}
            >
              ΕΞΟΔΟΣ
            </button>
          </ul>
        </nav>
      </header>
    </div>
  );
};

export default NutrNavbar;
