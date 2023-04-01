import React, {
  InputHTMLAttributes,
  useContext,
  useEffect,
  useState,
} from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import info from '/public/images/info.png';
import { format } from 'date-fns';
import { el } from 'date-fns/locale';
import Slider from 'react-slick';
import ReadMore from '../Helper/ReadMore';
import { DateContext } from '../Context';
import { Settings } from '../Helper/SliderSettings';
const DynamicCalendar = dynamic(() => import('react-calendar'), {
  ssr: false,
});

export type Appointment = InputHTMLAttributes<HTMLInputElement> & {
  date: string;
  profile: string;
  fullname: string;
  time: string;
  comments: string;
  telephone: string;
};

export const fakeAppointments: Appointment[] = [
  {
    date: '11-Μαρτίου-2023',
    profile: require('/public/images/myphoto.jpg'),
    fullname: 'John Doe',
    time: '12:00-13:00',
    comments:
      'asdgqwergasfgasgasdgAGW ASDFAERAWG ASDFGAVA asdgawergagasfgas adfgasgasfgafsg',
    telephone: '432442626232',
  },
  {
    date: '11-Μαρτίου-2023',
    profile: require('/public/images/myphoto.jpg'),
    fullname: 'Κωνσταντίνος Κασκαντιρης',
    time: '13:00-14:00',
    comments: 'asdgqwergasfgasgas',
    telephone: '432442626232',
  },
  {
    date: '24-Μαρτίου-2023',
    profile: require('/public/images/myphoto.jpg'),
    fullname: 'Bob Johnson',
    time: '15:00-17:00',
    comments: 'asdgqwergasfgasgas',
    telephone: '432442626233',
  },
  {
    date: '12-Μαρτίου-2023',
    profile: require('/public/images/myphoto.jpg'),
    fullname: 'Bob Johnson',
    time: '15:00-17:00',
    comments: 'asdgqwergasfgasgas',
    telephone: '432442626236',
  },
  {
    date: '11-Μαρτίου-2023',
    profile: require('/public/images/myphoto.jpg'),
    fullname: 'Bob Johnson',
    time: '15:00-17:00',
    comments: 'asdgqwergasfgasgas',
    telephone: '432442626287',
  },
  {
    date: '13-Μαρτίου-2023',
    profile: require('/public/images/myphoto.jpg'),
    fullname: 'Bob Johnson',
    time: '15:00-17:00',
    comments: 'asdgqwergasfgasgas',
    telephone: '432442626298',
  },
  {
    date: '16-Μαρτίου-2023',
    profile: require('/public/images/myphoto.jpg'),
    fullname: 'Bob Johnson',
    time: '15:00-17:00',
    comments: 'asdgqwergasfgasgas',
    telephone: '4324426262233',
  },
  {
    date: '11-Μαρτίου-2023',
    profile: require('/public/images/myphoto.jpg'),
    fullname: 'Bob Johnson',
    time: '15:00-17:00',
    comments: 'asdgqwergasfgasgas',
    telephone: '4324426262233',
  },
];

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

const CalendarC: React.FC = () => {
  const [value, onChange] = useState<Date>(new Date());
  const [clients, setClients] = useState<Appointment[]>([]);
  const [isClient, setIsClient] = useState<boolean>(false);
  const [isInfo, setIsInfo] = useState<boolean>(true);
  const { selectedDate, setSelectedDate } = useContext(DateContext);

  useEffect(() => {
    setIsClient(true);
    handleApply();
  }, [selectedDate]);

  // My button functions

  const handleCancel = () => {
    setSelectedDate('');
    onChange(new Date());
  };

  const handleApply = () => {
    const formattedDate = format(value, 'dd-MMMM-yyyy', { locale: el });
    const filteredClients = fakeAppointments.filter(
      (appointment) => appointment.date === formattedDate
    );
    setClients(filteredClients);
    setSelectedDate(formattedDate);
  };

  const handleClick = () => {
    setIsInfo(!isInfo);
  };

  return isClient ? (
    <div className="mx-auto  w-full">
      {isInfo ? (
        <div className="  flex flex-col items-center gap-6">
          <DynamicCalendar onChange={onChange} className=" mt-3" />
          <div className="space-x-4 ">
            <button
              className="rounded-lg border-2 py-1 px-7 hover:scale-110 hover:bg-myRed hover:text-white "
              onClick={handleCancel}
            >
              Ακύρωση
            </button>
            <button
              className=" rounded-lg bg-black py-2 px-7 text-white hover:scale-110 hover:bg-myBlue-200"
              onClick={handleApply}
            >
              Εφαρμογή
            </button>
          </div>
        </div>
      ) : null}

      {clients.length < 1 && selectedDate && (
        <div className="mt-20  text-center font-exo text-base font-bold">
          Δεν υπάρχουν αιτήσεις για ραντεβού για την ημέρα:{' '}
          <span className=" text-red-500">{selectedDate}</span>
        </div>
      )}
      <div className="">
        <Slider {...settingsCalendar}>
          {clients.map(
            (client) =>
              selectedDate && (
                <div
                  key={`${selectedDate}_${client.fullname}`}
                  className=" rounded-xl border-2 border-myBlue-200 "
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
                        <div className=" mt-4 grid grid-flow-col items-center justify-items-center">
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
                          <button className="rounded-xl bg-myBlue-200 px-6 text-white hover:scale-110   ">
                            Αποδοχή
                          </button>
                          <button className="rounded-xl bg-myGrey-100 px-6 hover:scale-110 hover:bg-myRed hover:text-white ">
                            Απόρριψη
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-t-xl">
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
                          <button className="rounded-xl bg-myGrey-100 px-5 hover:scale-110 hover:bg-myRed hover:text-white  ">
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
    </div>
  ) : null;
};

export default CalendarC;
