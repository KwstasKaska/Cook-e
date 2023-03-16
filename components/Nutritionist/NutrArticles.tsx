import React from 'react';
import Image from 'next/image';
import profile from '/public/images/myphoto.jpg';
import articleImg from '/public/images/articleImg.jpg';
import Slider from 'react-slick';

export type Settings = {
  dots: boolean;
  infinite: boolean;
  slidesToShow: number;
  slidesToScroll: number;
  initialSlide: number;
  autoplay: boolean;
  speed: number;
  autoplaySpeed: number;
  adaptiveHeight: boolean;
  pauseOnHover: boolean;
  swipeToSlide: boolean;
  className: string;
  responsive?: any[];
};

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
  className: '',
  responsive: [
    {
      breakpoint: 768,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2,
        className: '',
      },
    },

    {
      breakpoint: 500,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
        className: 'mx-auto max-w-[13em] ',
      },
    },
  ],
};

const NutrArticles: React.FC = () => {
  return (
    <section className="relative h-screen overflow-hidden ">
      <div className="mt-[4em] mb-[1.9em] grid grid-flow-col-dense justify-start pl-5">
        <Image
          src={profile}
          alt={'profile'}
          className="row-span-2 max-h-[3.5em] max-w-[3.5em] justify-self-end rounded-full object-cover object-top"
        ></Image>
        <h1 className="font-exo text-19 font-bold">
          Καλωσήρθατε, <br></br> Dr. Kwstas Kaskantiris
        </h1>
        <p className="font-exo text-15 font-normal ">
          Πως είναι η μέρα σας σήμερα;
        </p>
      </div>
      <div className="absolute left-[1.3em]  top-[2em] -z-[1]  h-[9em] w-[18em] -rotate-[13deg]  rounded-[1em] bg-myGrey-100 "></div>
      <div className="absolute  left-[5em] top-[5em] -z-[2] h-[9em] w-[18em] -rotate-[13deg]  rounded-[1em] bg-myBlue-100 "></div>

      <div className="h-full w-full bg-myGrey-200 pb-12 pt-5 ">
        <h1 className="mb-[.75em]  bg-gradient-to-r from-[#B3D5F8] to-[#FFFFFF] bg-clip-text text-center font-exo text-30 font-bold uppercase text-transparent">
          Τα αρθρα σας
        </h1>
        <div className="">
          <Slider {...settings}>
            <div className="  flex  flex-col gap-4 rounded-[10px] bg-myBlue-100 ">
              <Image
                src={articleImg}
                alt={'Eικόνα άρθρου'}
                className="rounded-t-[10px]"
                priority
              ></Image>
              <h2 className="px-[.3em] text-center text-15 font-bold">
                Η διατροφή στις μέρες μας, υπάρχει εύκολη λύση;
              </h2>
              <p className="text-right text-12 font-normal">21.11.2022</p>
            </div>
            <div className="flex   flex-col gap-4 rounded-[10px] bg-myBlue-100 ">
              <Image
                src={articleImg}
                alt={'Eικόνα άρθρου'}
                className=" rounded-t-[10px]"
                priority
              ></Image>
              <h2 className="px-[.3em] text-center text-15 font-bold">
                Η διατροφή στις μέρες μας, υπάρχει εύκολη λύση;
              </h2>
              <p className="text-right text-12 font-normal">21.11.2022</p>
            </div>
            <div className="flex   flex-col gap-4 rounded-[10px] bg-myBlue-100">
              <Image
                src={articleImg}
                alt={'Eικόνα άρθρου'}
                className="rounded-t-[10px]"
                priority
              ></Image>
              <h2 className="px-[.3em] text-center text-15 font-bold">
                Η διατροφή στις μέρες μας, υπάρχει εύκολη λύση;
              </h2>
              <p className="text-right text-12 font-normal">21.11.2022</p>
            </div>
          </Slider>
        </div>
      </div>
    </section>
  );
};

export default NutrArticles;
