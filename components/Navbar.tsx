import { NextPage } from 'next';
import Image from 'next/image';
import React from 'react';
import logo from '/public/images/6.png';
import menu from '/public/images/more.png';
import close from '/public/images/close.png';
import shop from '/public/images/aspro 1.png';
import set from '/public/images/settings.svg';

const Navbar: NextPage = ({}) => {
  return (
    <header className="md:relative bg-myGrey-200 w-full  ">
      <div className="md:absolute  md:w-full md:py-[17em] bg-myGrey-200 md:skew-y-[10deg] md:origin-[80%]  "></div>
      <div className="md:relative py-[2em] flex items-center justify-between md:justify-start ">
        <a href="#" className="">
          <Image src={logo} alt={'Cook-e logo'}></Image>
        </a>
        <button className="cursor-pointer md:hidden">
          <Image
            src={menu}
            alt="Menu icon"
            width={25}
            height={25}
            className="mr-3 "
          />
          <a
            href="https://www.flaticon.com/free-icons/hamburger"
            title="hamburger icons"
            className="hidden"
          >
            Hamburger icons created by feen - Flaticon
          </a>
          <Image
            src={close}
            alt="Menu icon"
            width={25}
            height={25}
            className="hidden"
          />
          <a
            href="https://www.flaticon.com/free-icons/close"
            title="close icons"
            className="hidden"
          >
            Close icons created by Fuzzee - Flaticon
          </a>
          <span className="hidden">Menu</span>
        </button>
        <nav className="hidden  max-w-[1268px] mx-auto md:block font-exo font-bold text-[.8rem] lg:text-15  ">
          <ul
            id="primary-navigation"
            className="md:grid md:gap-[2em] lg:gap-[4em] 2xl:gap-[6.5em] md:grid-flow-col md:items-center md:text-white"
          >
            <li>
              <a href="">ΑΡΧΙΚΗ</a>
            </li>
            <li>
              <a href="">ΕΥΡΕΣΗ ΣΥΝΤΑΓΗΣ</a>
            </li>
            <li>
              <a href="">ΔΙΑΤΡΟΦΟΛΟΓΟΙ</a>
            </li>
            <li>
              <a href="">PREMIUM</a>
            </li>
            <li>
              <a href="">
                <Image
                  src={shop}
                  alt={'Καλάθι Αγορών'}
                  width={30}
                  height={30}
                  className="lg:w-[40px] lg:h-[40px]"
                ></Image>
              </a>
            </li>
            <li>
              <a href="">
                <Image
                  src={set}
                  alt={'Ρυθμίσεις'}
                  width={30}
                  height={30}
                  className="lg:w-[40px] lg:h-[40px]"
                ></Image>
              </a>
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
