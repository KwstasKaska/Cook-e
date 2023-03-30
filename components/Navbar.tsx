import Image from 'next/image';
import React, { useState } from 'react';
import logo from '/public/images/6.png';
import shop from '/public/images/aspro 1.png';
import set from '/public/images/settings.svg';
import Link from 'next/link';

const Navbar: React.FC = ({}) => {
  const [isToggle, setIsToggle] = useState<boolean>(true);

  const handleNavbarClick = () => {
    setIsToggle(!isToggle);
  };
  return (
    <div>
      {isToggle ? (
        <header className="w-full bg-myGrey-200 md:relative">
          <div className="bg-myGrey-200  md:absolute md:w-full md:origin-[80%] md:skew-y-[10deg] md:py-[17em]  "></div>
          <div className="flex items-center justify-between py-[2em] md:relative md:justify-start ">
            <Link href="#" className="">
              <Image src={logo} alt={'Cook-e logo'}></Image>
            </Link>
            <button
              onClick={handleNavbarClick}
              className="cursor-pointer md:hidden"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="white"
                className="mr-3 h-8 w-8"
              >
                <path
                  fillRule="evenodd"
                  d="M3 6.75A.75.75 0 013.75 6h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 6.75zM3 12a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 12zm0 5.25a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75a.75.75 0 01-.75-.75z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            <nav className="mx-auto  hidden max-w-[1268px] font-exo text-[.8rem] font-bold md:block lg:text-15  ">
              <ul
                id="primary-navigation"
                className="md:grid md:grid-flow-col md:items-center md:gap-[2em] md:text-white lg:gap-[4em] 2xl:gap-[6.5em]"
              >
                <li>
                  <Link href="">ΑΡΧΙΚΗ</Link>
                </li>
                <li>
                  <Link href="">ΕΥΡΕΣΗ ΣΥΝΤΑΓΗΣ</Link>
                </li>
                <li>
                  <Link href="">ΔΙΑΤΡΟΦΟΛΟΓΟΙ</Link>
                </li>
                <li>
                  <Link href="">PREMIUM</Link>
                </li>
                <li>
                  <Link href="">
                    <Image
                      src={shop}
                      alt={'Καλάθι Αγορών'}
                      width={30}
                      height={30}
                      className="lg:h-[40px] lg:w-[40px]"
                    ></Image>
                  </Link>
                </li>
                <li>
                  <Link href="">
                    <Image
                      src={set}
                      alt={'Ρυθμίσεις'}
                      width={30}
                      height={30}
                      className="lg:h-[40px] lg:w-[40px]"
                    ></Image>
                  </Link>
                </li>
              </ul>
            </nav>
            <button className="mr-3 hidden rounded-[1.4rem] bg-[#6F7788] px-[0.8em] py-1 font-exo  text-15 font-normal text-white md:block">
              ΕΞΟΔΟΣ
            </button>
          </div>
        </header>
      ) : (
        <header className="relative ">
          <div className="md:absolute  md:w-full md:origin-[80%] md:skew-y-[10deg] md:bg-myGrey-200 md:py-[17em]"></div>
          <div className="absolute z-[1] grid w-full  grid-flow-col items-start justify-between   bg-myGrey-200 pb-[26em] pt-4 md:relative md:z-0  md:items-center md:py-[2em]">
            <Link href="#" className="">
              <Image src={logo} alt={'Cook-e logo'}></Image>
            </Link>
            <button onClick={handleNavbarClick} className=" ">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="white"
                className="mr-3 h-8 w-8 md:hidden"
              >
                <path
                  fillRule="evenodd"
                  d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            <nav className="absolute z-[2] mx-auto mt-28 w-full font-bold md:relative md:z-0  md:mt-0   md:text-[.8rem] lg:text-15">
              <ul
                id="primary-navigation"
                className=" flex flex-col  items-center gap-4 text-lg font-bold capitalize text-white md:grid md:w-full  md:grid-flow-col  md:gap-[2em] md:text-base  lg:gap-[4em] 2xl:gap-[6.5em]"
              >
                <li>
                  <Link href="">αρχικη</Link>
                </li>
                <li>
                  <Link href="">ευρεση συνταγης</Link>
                </li>
                <li>
                  <Link href="">διατροφολογοι</Link>
                </li>
                <li>
                  <Link href="">premium</Link>
                </li>
                <li>
                  <Link className="md:hidden" href="">
                    Καλαθι αγορων
                  </Link>
                  <Link className="hidden md:block" href="">
                    <Image
                      src={shop}
                      alt={'Καλάθι Αγορών'}
                      width={30}
                      height={30}
                      className=" lg:h-[40px] lg:w-[40px]"
                    ></Image>
                  </Link>
                </li>
                <li>
                  <Link className="md:hidden" href="">
                    Ρυθμισεις
                  </Link>
                  <Link className="hidden md:block" href="">
                    <Image
                      src={set}
                      alt={'Ρυθμίσεις'}
                      width={30}
                      height={30}
                      className="lg:h-[40px] lg:w-[40px]"
                    ></Image>
                  </Link>
                </li>
                <button className=" rounded-[1.4rem] border-2  border-white bg-myGrey-200 px-8 py-1   text-15 font-bold text-white hover:bg-myRed hover:text-white md:block">
                  Εξοδος
                </button>
              </ul>
            </nav>
          </div>
        </header>
      )}
    </div>
  );
};

export default Navbar;
