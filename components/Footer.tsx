import { NextPage } from 'next';
import React from 'react';
import Image from 'next/image';

interface FooterProps {}

const Footer: NextPage<FooterProps> = ({}) => {
  return (
    <footer className="hidden md:block md:bg-myGrey-200  py-[4em]  w-full   ">
      <div className="max-w-[1268px] mx-auto  grid grid-cols-2">
        <div className="grid grid-cols-2 grid-rows-2 justify-items-center">
          <h3 className="text-white font-normal col-span-2 text-19">
            Find Us on Social Media
          </h3>
          <span>
            <Image src={''} alt={'Instagram'}></Image>
          </span>
          <span>
            <Image src={''} alt={'Facebook'}></Image>
          </span>
          <span>
            <Image src={''} alt={'Linkedln'}></Image>
          </span>
          <span>
            <Image src={''} alt={'TikTok'}></Image>
          </span>
        </div>
        <div className="text-white font-normal text-19">
          <ul className="grid grid-rows-3 grid-cols-2 justify-items-center">
            <h1 className="col-span-2 ">Χρήσιμες Πληροφορίες</h1>
            <li>
              <a href="">Ρυθμίσεις</a>
            </li>
            <li>
              <a href="">Ποιοί Είμαστε</a>
            </li>

            <li>
              <a href="">Επικοινωνία</a>
            </li>
            <li>
              <a href="">Συχνές Ερωτήσεις</a>
            </li>
            <li>
              <a href="">Όροι Χρήσης</a>
            </li>
            <li>
              <a href="">Πολιτική Απορρήτου</a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
