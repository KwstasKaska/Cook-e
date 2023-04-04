import React from 'react';
import Image from 'next/image';

import articleImg from '/public/images/articleImg.jpg';
import Slider from 'react-slick';
import { Settings } from '../Helper/SliderSettings';

// My articles slider settings
var settings: Settings = {
  dots: true,
  infinite: true,
  slidesToShow: 3,
  slidesToScroll: 3,
  initialSlide: 0,
  autoplay: true,
  speed: 1000,
  autoplaySpeed: 8000,
  adaptiveHeight: true,
  pauseOnHover: true,
  swipeToSlide: true,
  className: 'max-w-[58em] ',
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2,
        className: 'max-w-[43em]',
      },
    },
    {
      breakpoint: 767,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
        className: 'w-[18em]  ',
      },
    },
  ],
};

const NutrArticles: React.FC = () => {
  return (
    <section id="section_1" className=" flex min-h-screen flex-col ">
      <div className="flex  w-full flex-1 flex-col items-center justify-center gap-6 bg-myGrey-200 py-10">
        <h1 className="bg-gradient-to-r from-[#B3D5F8]  to-[#FFFFFF]  bg-clip-text pb-[.75em] font-exo text-3xl font-bold uppercase text-transparent md:text-5xl lg:text-6xl">
          Τα αρθρα σας
        </h1>
        <div className="flex   items-center ">
          <Slider {...settings}>
            <div className="flex   flex-col gap-4 rounded-[10px] bg-myBlue-100">
              <Image
                src={articleImg}
                alt={'Eικόνα άρθρου'}
                className="rounded-t-[10px] "
              ></Image>
              <h2 className="px-[.3em] text-center text-sm font-bold md:text-xl lg:text-2xl">
                Η διατροφή στις μέρες μας, υπάρχει εύκολη λύση;
              </h2>
              <p className="text-right text-xs font-normal md:text-base">
                21.11.2022
              </p>
            </div>
            <div className="flex  flex-col gap-4 rounded-[10px] bg-myBlue-100 ">
              <Image
                src={articleImg}
                alt={'Eικόνα άρθρου'}
                className=" rounded-t-[10px]"
              ></Image>
              <h2 className="px-[.3em] text-center text-sm font-bold md:text-xl lg:text-2xl">
                Η διατροφή στις μέρες μας, υπάρχει εύκολη λύση;
              </h2>
              <p className="text-right text-xs font-normal md:text-base">
                21.11.2022
              </p>
            </div>
            <div className="flex  flex-col gap-4 rounded-[10px] bg-myBlue-100">
              <Image
                src={articleImg}
                alt={'Eικόνα άρθρου'}
                className="rounded-t-[10px]"
              ></Image>
              <h2 className="px-[.3em] text-center text-sm font-bold md:text-xl lg:text-2xl">
                Η διατροφή στις μέρες μας, υπάρχει εύκολη λύση;
              </h2>
              <p className="text-right text-xs font-normal md:text-base">
                21.11.2022
              </p>
            </div>
            <div className="flex  flex-col gap-4 rounded-[10px] bg-myBlue-100">
              <Image
                src={articleImg}
                alt={'Eικόνα άρθρου'}
                className="rounded-t-[10px]"
              ></Image>
              <h2 className="px-[.3em] text-center text-sm font-bold md:text-xl lg:text-2xl">
                Η διατροφή στις μέρες μας, υπάρχει εύκολη λύση;
              </h2>
              <p className="text-right text-xs font-normal md:text-base">
                21.11.2022
              </p>
            </div>
            <div className="flex  flex-col gap-4 rounded-[10px] bg-myBlue-100">
              <Image
                src={articleImg}
                alt={'Eικόνα άρθρου'}
                className="rounded-t-[10px]"
              ></Image>
              <h2 className="px-[.3em] text-center text-sm font-bold md:text-xl lg:text-2xl">
                Η διατροφή στις μέρες μας, υπάρχει εύκολη λύση;
              </h2>
              <p className="text-right text-xs font-normal md:text-base">
                21.11.2022
              </p>
            </div>
          </Slider>
        </div>
      </div>
    </section>
  );
};

export default NutrArticles;
