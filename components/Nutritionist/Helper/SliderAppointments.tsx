import React, { useContext, useState } from 'react';
import { Settings } from '../../Helper/SliderSettings';
import Slider from 'react-slick';
import Image from 'next/image';
import info from '/public/images/info.png';
import ReadMore from '../../Helper/ReadMore';
import { ClientsContextType, DateContext } from '../../Context';

interface SliderAppointmentsProps {}

function SampleArrow(props: any) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{
        ...style,
        display: 'block',
        borderRadius: '9999px',
        background: 'black',
      }}
      onClick={onClick}
    />
  );
}

// my Slider function settings
var settingsCalendar: Settings = {
  dots: true,
  infinite: true,
  arrows: true,
  slidesToShow: 1,
  slidesToScroll: 1,
  initialSlide: 0,
  autoplay: true,
  speed: 1000,
  autoplaySpeed: 8000,
  adaptiveHeight: true,
  pauseOnHover: true,
  swipeToSlide: true,
  nextArrow: <SampleArrow />,
  prevArrow: <SampleArrow />,
  className: 'mx-auto max-w-[20em] my-8  h-full',
};

const SliderAppointments: React.FC<SliderAppointmentsProps> = ({}) => {
  const { clients } = useContext(ClientsContextType);
  const { selectedDate } = useContext(DateContext);
  const [isInfo, setIsInfo] = useState<boolean>(true);

  const handleClick = () => {
    setIsInfo(!isInfo);
  };

  return (
    <div>
      {clients.length < 1 && selectedDate ? (
        <div className="mt-10 mb-6  text-center font-exo text-base font-bold md:mt-0 lg:text-2xl">
          Δεν υπάρχουν αιτήσεις για ραντεβού για την ημέρα:{' '}
          <div className=" text-myBlue-200">{selectedDate}</div>
        </div>
      ) : (
        <div className="lg:mt-16 lg:scale-125 xl:mt-16 ">
          <Slider {...settingsCalendar}>
            {clients.map(
              (client) =>
                selectedDate && (
                  <div
                    key={`${selectedDate}_${client.fullname}`}
                    className="max-w-[17em] rounded-xl border-2 border-myBlue-200 "
                  >
                    {isInfo ? (
                      <div className="">
                        <div className=" rounded-t-md bg-myBlue-200 text-lg font-normal text-white">
                          <h1 className="text-center">Αίτηση για Ραντεβού</h1>
                          <p className="text-center">
                            {selectedDate.replace(/-/g, '  ')}
                            {' : '} {client.time}
                          </p>
                        </div>
                        <div key={client.fullname}>
                          <div className=" mt-4 grid grid-flow-col items-center justify-items-center px-2">
                            <Image
                              src={client.profile}
                              alt={'Εικόνα Προφίλ'}
                              className="h-[3em] w-[3em] rounded-lg object-cover object-top"
                            ></Image>
                            <p className="text-center text-base font-bold">
                              {client.fullname}
                            </p>

                            <button onClick={handleClick}>
                              <Image
                                src={info}
                                alt={''}
                                className="h-[2em] w-[2em]"
                              ></Image>
                            </button>
                          </div>
                          <div className="my-4 flex justify-center gap-4 font-exo font-normal">
                            <button className="rounded-xl bg-myBlue-200 px-6 text-white    ">
                              Αποδοχή
                            </button>
                            <button className="rounded-xl border border-black bg-myGrey-100  px-6 hover:border-myRed hover:bg-myRed hover:text-white">
                              Απόρριψη
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className=" h-full rounded-t-xl">
                        <div className="relative rounded-t-md rounded-br-[5em] bg-myBlue-200 pb-32 text-lg font-normal text-white">
                          <button onClick={handleClick}>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                              className="h-6 w-6"
                            >
                              <path d="M11.03 3.97a.75.75 0 010 1.06l-6.22 6.22H21a.75.75 0 010 1.5H4.81l6.22 6.22a.75.75 0 11-1.06 1.06l-7.5-7.5a.75.75 0 010-1.06l7.5-7.5a.75.75 0 011.06 0z" />
                            </svg>
                          </button>
                          <h1 className="absolute top-0 left-10 text-center">
                            Αίτηση για Ραντεβού
                          </h1>
                          <p className="absolute top-12 left-14 text-center font-bold">
                            {selectedDate.replace(/-/g, '  ')}
                            {' , '}
                            <br />
                            {client.time}
                          </p>
                          <Image
                            src={client.profile}
                            alt={'Εικόνα Προφίλ'}
                            className="absolute -bottom-6 left-5 h-[3em] w-[3em] rounded-lg border-2 border-white object-cover object-top"
                          ></Image>
                          <button
                            onClick={() => alert(client.telephone)}
                            className="absolute left-[5.5em] -bottom-5"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                              className=" h-10 w-10 rounded-full border-2 border-white bg-myBlue-200 p-1"
                            >
                              <path d="M1.5 4.5a3 3 0 013-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 01-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 006.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 011.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 01-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5z" />
                            </svg>
                          </button>
                        </div>
                        <div key={client.fullname}>
                          <div className=" mt-8">
                            <p className="ml-6 mt-10 max-w-[8em] text-base font-bold">
                              {client.fullname}
                            </p>
                          </div>
                          <div className="ml-6 mt-4 ">
                            <p>Σχόλια : </p>
                            <ReadMore text={client.comments} />
                          </div>
                          <div className="mt-8 mb-8  flex justify-center gap-4 font-exo font-normal">
                            <button className="rounded-xl bg-myBlue-200 px-5 text-white hover:scale-110 hover:bg-myBlue-200 hover:text-white hover:outline hover:outline-2">
                              Αποδοχή
                            </button>
                            <button className="rounded-xl border border-black bg-myGrey-100 px-5 hover:scale-110 hover:border-myRed hover:bg-myRed  hover:text-white ">
                              Απόρριψη
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )
            )}
          </Slider>
        </div>
      )}
    </div>
  );
};

export default SliderAppointments;
