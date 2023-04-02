import React from 'react';
import Image from 'next/image';
import profile from '/public/images/myphoto.jpg';
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
  className: 'max-w-[60em]',
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
    <section id="section_1" className="relative flex min-h-screen flex-col ">
      <div className="mt-[4em] mb-[1.9em] grid  grid-flow-col-dense  justify-start pl-5 md:pl-20 xl:pl-32">
        <Image
          src={profile}
          alt={'profile'}
          className="row-span-2 max-h-[3.5em] max-w-[3.5em] justify-self-end rounded-full object-cover object-top md:max-h-[5em] md:max-w-[5em]  xl:max-h-[7em] xl:max-w-[7em]"
        ></Image>
        <h1 className="font-exo text-19 font-bold md:text-2xl xl:text-3xl">
          Καλωσήρθατε, <br></br> Dr. Kwstas Kaskantiris
        </h1>
        <p className="font-exo text-15 font-normal md:text-xl xl:text-2xl">
          Πως είναι η μέρα σας σήμερα;
        </p>
      </div>
      <div className="absolute left-[1.3em]  top-[2em] -z-[1]  h-[9em] w-[18em] -rotate-[13deg]  rounded-[1em] bg-myGrey-100 md:left-28 md:scale-125 xl:left-48 xl:scale-150 2xl:left-64 2xl:top-20 2xl:scale-[2]"></div>
      <div className="absolute  left-[5em]  top-[5em] -z-[2] h-[9em] w-[18em] -rotate-[13deg] rounded-[1em]  bg-myBlue-100 md:left-48 md:scale-125 xl:left-72 xl:scale-150 2xl:top-40 2xl:left-[22em] 2xl:scale-[2]"></div>

      <div className="flex w-full  flex-1 flex-col items-center justify-center gap-6 bg-myGrey-200 ">
        <h1 className="bg-gradient-to-r from-[#B3D5F8]  to-[#FFFFFF]  bg-clip-text pb-[.75em] font-exo text-3xl font-bold uppercase text-transparent md:text-5xl lg:text-6xl">
          Τα αρθρα σας
        </h1>
        <div className=" flex h-full items-center ">
          <Slider {...settings}>
            <div className="flex  flex-col gap-4 rounded-[10px] bg-myBlue-100">
              <Image
                src={articleImg}
                alt={'Eικόνα άρθρου'}
                className="rounded-t-[10px] "
              ></Image>
              <h2 className="px-[.3em] text-center text-15 font-bold md:text-xl lg:text-2xl">
                Η διατροφή στις μέρες μας, υπάρχει εύκολη λύση;
              </h2>
              <p className="text-right text-12 font-normal md:text-base">
                21.11.2022
              </p>
            </div>
            <div className="flex  flex-col gap-4 rounded-[10px] bg-myBlue-100 ">
              <Image
                src={articleImg}
                alt={'Eικόνα άρθρου'}
                className=" rounded-t-[10px]"
              ></Image>
              <h2 className="px-[.3em] text-center text-15 font-bold md:text-xl lg:text-2xl">
                Η διατροφή στις μέρες μας, υπάρχει εύκολη λύση;
              </h2>
              <p className="text-right text-12 font-normal md:text-base">
                21.11.2022
              </p>
            </div>
            <div className="flex  flex-col gap-4 rounded-[10px] bg-myBlue-100">
              <Image
                src={articleImg}
                alt={'Eικόνα άρθρου'}
                className="rounded-t-[10px]"
              ></Image>
              <h2 className="px-[.3em] text-center text-15 font-bold md:text-xl lg:text-2xl">
                Η διατροφή στις μέρες μας, υπάρχει εύκολη λύση;
              </h2>
              <p className="text-right text-12 font-normal md:text-base">
                21.11.2022
              </p>
            </div>
            <div className="flex  flex-col gap-4 rounded-[10px] bg-myBlue-100">
              <Image
                src={articleImg}
                alt={'Eικόνα άρθρου'}
                className="rounded-t-[10px]"
              ></Image>
              <h2 className="px-[.3em] text-center text-15 font-bold md:text-xl lg:text-2xl">
                Η διατροφή στις μέρες μας, υπάρχει εύκολη λύση;
              </h2>
              <p className="text-right text-12 font-normal md:text-base">
                21.11.2022
              </p>
            </div>
            <div className="flex  flex-col gap-4 rounded-[10px] bg-myBlue-100">
              <Image
                src={articleImg}
                alt={'Eικόνα άρθρου'}
                className="rounded-t-[10px]"
              ></Image>
              <h2 className="px-[.3em] text-center text-15 font-bold md:text-xl lg:text-2xl">
                Η διατροφή στις μέρες μας, υπάρχει εύκολη λύση;
              </h2>
              <p className="text-right text-12 font-normal md:text-base">
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
