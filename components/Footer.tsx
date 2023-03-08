import { NextPage } from 'next';
import React from 'react';

interface FooterProps {}

const Footer: NextPage<FooterProps> = ({}) => {
  return (
    <footer className=" bg-myGrey-200  py-[4em]  w-full">
      <div className="max-w-[1268px] w-full  grid grid-flow-row gap-8 md:grid-cols-2 md:mx-auto">
        <div className="grid grid-flow-row justify-center gap-4 md:grid-cols-2 md:grid-rows-2 md:justify-items-center">
          <h3 className="text-white font-normal col-span-2 text-19">
            Find Us on Social Media
          </h3>
          <div className="cursor-pointer">
            {/* <span>
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
          </span> */}
          </div>
        </div>
        <div className="text-white font-normal text-19">
          <ul className="grid grid-flow-row justify-items-center gap-2 md:gap-0 md:grid-rows-3 md:grid-cols-2 cursor-pointer">
            <h1 className="col-span-2 mb-[1.5em]">Χρήσιμες Πληροφορίες</h1>
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
