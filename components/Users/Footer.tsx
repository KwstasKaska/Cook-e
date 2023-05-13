import React from 'react';

const Footer: React.FC = ({}) => {
  return (
    <footer className="mt-auto  w-full  bg-myGrey-200  py-[4em]">
      <div className="grid w-full  max-w-[1268px] grid-flow-row gap-8 md:mx-auto md:grid-cols-2">
        <div className="grid grid-flow-row justify-center gap-4 md:grid-cols-2 md:grid-rows-2 md:justify-items-center">
          <h3 className="col-span-2 text-lg font-normal text-white">
            Find us on social media
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
        <div className="text-lg font-normal text-white">
          <ul className="grid cursor-pointer grid-flow-row justify-items-center gap-2 md:grid-cols-2 md:grid-rows-3 md:gap-0">
            <h1 className="col-span-2 mb-[1.5em]">Χρήσιμες πληροφορίες</h1>
            <li>
              <a href="">Ρυθμίσεις</a>
            </li>
            <li>
              <a href="">Ποιοί είμαστε</a>
            </li>

            <li>
              <a href="">Επικοινωνία</a>
            </li>
            <li>
              <a href="">Συχνές ερωτήσεις</a>
            </li>
            <li>
              <a href="">Όροι χρήσης</a>
            </li>
            <li>
              <a href="">Πολιτική απορρήτου</a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
