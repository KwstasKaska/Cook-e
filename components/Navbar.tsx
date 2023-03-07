import { NextPage } from 'next';
import Image from 'next/image';
import React from 'react';
import logo from '/public/images/6.png';
import menu from '/public/images/more.png';
import close from '/public/images/close.png';
import shop from '/public/images/aspro 1.png';
import set from '/public/images/settings.svg';
import Link from 'next/link';

const Navbar: NextPage = ({}) => {
  return (
    <header className="md:relative bg-myGrey-200 w-full">
      <div className="md:absolute  md:w-full md:py-[17em] bg-myGrey-200 md:skew-y-[10deg] md:origin-[80%]  "></div>
      <div className="md:relative py-[2em] flex items-center justify-between md:justify-start ">
        <Link href="#" className="">
          <Image src={logo} alt={'Cook-e logo'}></Image>
        </Link>
        <button className="cursor-pointer md:hidden">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="white"
            className="w-8 h-8 mr-3"
          >
            <path
              fillRule="evenodd"
              d="M3 6.75A.75.75 0 013.75 6h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 6.75zM3 12a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 12zm0 5.25a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75a.75.75 0 01-.75-.75z"
              clipRule="evenodd"
            />
          </svg>

          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-6 h-6 hidden"
          >
            <path
              fillRule="evenodd"
              d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z"
              clipRule="evenodd"
            />
          </svg>
          <span className="hidden">Menu</span>
        </button>
        <nav className="hidden  max-w-[1268px] mx-auto md:block font-exo font-bold text-[.8rem] lg:text-15  ">
          <ul
            id="primary-navigation"
            className="md:grid md:gap-[2em] lg:gap-[4em] 2xl:gap-[6.5em] md:grid-flow-col md:items-center md:text-white"
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
                  className="lg:w-[40px] lg:h-[40px]"
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
                  className="lg:w-[40px] lg:h-[40px]"
                ></Image>
              </Link>
            </li>
          </ul>
        </nav>
        <button className="hidden text-white font-exo font-normal text-15 bg-[#6F7788] rounded-[1.4rem]  md:block px-[0.8em] py-1 mr-3">
          ΕΞΟΔΟΣ
        </button>
      </div>
    </header>
  );
};

export default Navbar;
