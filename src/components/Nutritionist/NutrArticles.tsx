import React, { useState } from 'react';
import Image from 'next/image';

import articleImg from '/public/images/articleImg.jpg';
import Slider from 'react-slick';
import { Settings } from '../Helper/SliderSettings';
// import { useArticlesQuery } from '../../generated/graphql';
import moment from 'moment';
import 'moment/locale/el';

// FIX: set locale explicitly so Greek date formatting is guaranteed
moment.locale('el');

// TODO: replace with useArticlesQuery() when backend is connected
const FAKE_ARTICLES = [
  {
    id: '1',
    title: 'Η διατροφή στις μέρες μας, υπάρχει εύκολη λύση;',
    createdAt: '1669852800000',
  },
  {
    id: '2',
    title: 'Πώς να τρως υγιεινά χωρίς να ξοδεύεις πολλά',
    createdAt: '1670457600000',
  },
  {
    id: '3',
    title: 'Βιταμίνες και μέταλλα: ο οδηγός για αρχάριους',
    createdAt: '1671062400000',
  },
  {
    id: '4',
    title: 'Μεσογειακή διατροφή: γιατί είναι τόσο σημαντική',
    createdAt: '1671667200000',
  },
  {
    id: '5',
    title: 'Σωστή ενυδάτωση: πόσο νερό χρειάζεσαι πραγματικά;',
    createdAt: '1672272000000',
  },
];

// FIX: infinite must be true when autoplay is enabled — react-slick throws a
// warning and behaves erratically when autoplay:true + infinite:false are combined
var settings: Settings = {
  dots: false,
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
  className: 'max-w-[58em] cursor-pointer',
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
        className: 'w-[18em]',
      },
    },
  ],
};

const NutrArticles: React.FC = () => {
  // TODO: swap FAKE_ARTICLES for useArticlesQuery() when backend is connected
  // const { data } = useArticlesQuery();
  const articles = FAKE_ARTICLES;

  const [isHovered, setIsHovered] = useState<boolean>(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <section id="section_1" className="flex min-h-screen flex-col">
      <div className="relative flex w-full flex-1 flex-col items-center justify-center gap-6 bg-myGrey-200 py-10">
        <h1 className="absolute top-6 bg-gradient-to-r from-[#B3D5F8] to-[#FFFFFF] bg-clip-text pb-[.75em] font-exo text-3xl font-bold text-transparent md:text-5xl lg:text-6xl">
          Τα άρθρα σου
        </h1>
        <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
          <Slider {...settings}>
            {articles.map((article) => (
              <div
                key={article.id}
                className="rounded-3xl border-2 border-white p-6 transition duration-500 ease-in hover:bg-myGrey-100"
              >
                <div className="flex flex-col gap-4 rounded-[10px] bg-transparent text-white hover:text-black">
                  <p className="flex flex-col gap-2 text-left text-lg font-bold lg:text-lg">
                    <span>
                      {moment(parseInt(article.createdAt)).format('ll')}
                    </span>
                    <span
                      className={`h-1 w-20 ${
                        isHovered ? 'bg-black' : 'bg-myGrey-100'
                      }`}
                    ></span>
                  </p>
                  <h2 className="px-[.3em] text-center text-lg font-bold md:text-xl lg:text-2xl">
                    {article.title}
                  </h2>
                  <Image
                    src={articleImg}
                    alt={'Εικόνα άρθρου'}
                    className="aspect-[5/4] rounded-[10px]"
                  ></Image>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </section>
  );
};

export default NutrArticles;
