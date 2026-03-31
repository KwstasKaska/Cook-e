import Image from 'next/image';
import { useTranslation } from 'next-i18next';

import coffee from '/public/images/coffee.jpg';
import MyAppointments from './Helper/MyAppointments';
import { useEffect, useState } from 'react';

interface NutrAppointmentsProps {}

const NutrAppointments: React.FC<NutrAppointmentsProps> = ({}) => {
  const { t } = useTranslation('common');
  const [showBackground, setShowBackground] = useState<boolean>(
    typeof window !== 'undefined' ? window.innerWidth < 1279 : true,
  );

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
    <section
      id="section_3"
      className="flex min-h-screen w-full flex-col bg-myGrey-200"
    >
      <h1 className="relative z-[2] pt-6 text-center text-2xl font-bold text-white hover:text-myRed md:text-4xl">
        {t('nutr.todayAppointments')}
      </h1>
      <div className="flex flex-1 items-center justify-center lg:justify-evenly lg:gap-24">
        <MyAppointments
          customClassName={`relative w-[19em] rounded-2xl ${
            showBackground ? ' bg-white shadow-2xl' : ' bg-transparent'
          } px-4 transition duration-500 hover:scale-110 md:scale-110 md:hover:scale-125 xl:scale-125 xl:hover:scale-[1.4]`}
          customDateClassName={'absolute'}
          textColor="white"
          showAttrs={true}
          marginCustom={''}
          emptyAppointments=""
        />
        <div className="relative">
          <div className="hidden xl:absolute xl:-left-44 xl:bottom-0 xl:block xl:py-10">
            <MyAppointments
              customClassName={
                'relative w-[19em] rounded-[2em] pt-4 min-h-[30em] bg-white shadow-2xl px-4 xl:bg-myGrey-100 transition duration-500 border-4 border-black'
              }
              customDateClassName={'hidden'}
              textColor="black"
              showAttrs={false}
              marginCustom={'py-20'}
              emptyAppointments="hidden"
            />
          </div>
          <Image
            src={coffee}
            alt={t('nutr.coffeeImageAlt')}
            priority
            className="hidden h-full max-w-[380px] py-10 lg:block"
          />
        </div>
      </div>
    </section>
  );
};

export default NutrAppointments;
