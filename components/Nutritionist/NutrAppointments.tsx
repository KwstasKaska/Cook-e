import Image from 'next/image';

import coffee from '/public/images/coffee.jpg';
import MyAppointments from './MyAppointments';
import { useEffect, useState } from 'react';

interface NutrAppointmentsProps {}

const NutrAppointments: React.FC<NutrAppointmentsProps> = ({}) => {
  const [showBackground, setShowBackground] = useState<boolean>(true);

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth >= 1279) {
        setShowBackground(false);
      } else {
        setShowBackground(true);
      }
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return (
    <section id="section_3" className=" h-screen  bg-myGrey-200">
      <h1 className="relative z-[2] pt-6 text-center text-2xl font-bold text-white  hover:text-myRed md:text-4xl xl:text-5xl">
        Σημερινά Ραντεβού
      </h1>
      <div className=" flex   h-[90vh]  items-center justify-center    lg:justify-evenly lg:gap-24">
        <MyAppointments
          customClassName={`relative w-[19em] rounded-2xl ${
            showBackground ? ' bg-white shadow-2xl' : ' bg-transparent'
          }  px-4  transition duration-500 hover:scale-110 md:scale-110 md:hover:scale-125 xl:scale-125 xl:hover:scale-[1.4]`}
          customDateClassName={'absolute'}
          textColor="white"
          showAttrs={true}
          marginCustom=""
          emptyAppointments=""
        />
        <div className="relative">
          <div className="hidden xl:absolute xl:-left-44 xl:bottom-0 xl:block">
            <MyAppointments
              customClassName={
                'relative w-[19em] rounded-[2em] pt-4 min-h-[30em]   bg-white shadow-2xl px-4  transition duration-500  border-4 border-black '
              }
              customDateClassName={'hidden'}
              textColor="black"
              showAttrs={false}
              marginCustom="20"
              emptyAppointments="hidden"
            />
          </div>
          <Image
            src={coffee}
            alt={'An coffee image'}
            className="hidden h-full w-[370px] lg:block"
          ></Image>
        </div>
      </div>
    </section>
  );
};

export default NutrAppointments;
