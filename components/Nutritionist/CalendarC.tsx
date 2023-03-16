import React, { InputHTMLAttributes, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import info from '/public/images/info.png';
import { format } from 'date-fns';
import { el } from 'date-fns/locale';
import Slider from 'react-slick';
import { Settings } from './NutrArticles';

const DynamicCalendar = dynamic(() => import('react-calendar'), {
  ssr: false,
});

type Appointment = InputHTMLAttributes<HTMLInputElement> & {
  datetime: string;
  profile: string;
  fullname: string;
  time: string;
};

export const fakeAppointments: Appointment[] = [
  {
    datetime: '11-Μαρτίου-2023',
    profile: require('/public/images/myphoto.jpg'),
    fullname: 'John Doe',
    time: '12:00-13:00',
  },
  {
    datetime: '11-Μαρτίου-2023',
    profile: require('/public/images/myphoto.jpg'),
    fullname: 'Κωνσταντίνος Κασκαντιρης',
    time: '13:00-14:00',
  },
  {
    datetime: '11-Μαρτίου-2023',
    profile: require('/public/images/myphoto.jpg'),
    fullname: 'Bob Johnson',
    time: '15:00-17:00',
  },
];

// my Slider function settings
var settingsCalendar: Settings = {
  dots: true,
  infinite: true,
  slidesToShow: 1,
  slidesToScroll: 1,
  initialSlide: 0,
  autoplay: true,
  speed: 1000,
  autoplaySpeed: 8000,
  adaptiveHeight: true,
  pauseOnHover: true,
  swipeToSlide: true,
  className: 'mx-auto max-w-[16em] mt-8 mb-8',
};

const CalendarC: React.FC = () => {
  const [value, onChange] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<String>('');
  const [clients, setClients] = useState<Appointment[]>([]);
  const [isClient, setIsClient] = useState<Boolean>(false);

  useEffect(() => {
    setIsClient(true);
    handleApply();
  }, []);

  // My button functions

  const handleCancel = () => {
    const currentDate = new Date();
    onChange(currentDate);
    setSelectedDate('');
  };

  const handleApply = () => {
    const formattedDate = format(value, 'dd-MMMM-yyyy', { locale: el });
    const filteredClients = fakeAppointments.filter(
      (appointment) => appointment.datetime === formattedDate
    );
    setClients(filteredClients);
    setSelectedDate(formattedDate);
  };

  return isClient ? (
    <div>
      <div className="  flex flex-col items-center gap-6">
        <DynamicCalendar onChange={onChange} className="mx-auto mt-6" />
        <div className="space-x-4">
          <button
            className="rounded-lg border-2 py-1 px-7"
            onClick={handleCancel}
          >
            Ακύρωση
          </button>
          <button
            className="rounded-lg bg-black py-2 px-7 text-white"
            onClick={handleApply}
          >
            Εφαρμογή
          </button>
        </div>
      </div>

      {/* Todo: Να φτιάξω τα μεγέθη των γραμματοσειρών */}

      {/* ToDO: Να φτιάξω σε ξεχωριστό Component το πεδίο για τις πληροφορίες που περιέχει το Slider ώστε να χρησιμοποιήσω και τα props */}

      {clients.length < 1 && (
        <div className="mt-20  text-center font-exo text-base font-bold">
          Δεν υπάρχουν αιτήσεις για ραντεβού για την ημέρα:{' '}
          <span className=" text-red-500">{selectedDate}</span>
        </div>
      )}
      <div className="">
        <Slider {...settingsCalendar}>
          {clients.map((client) => (
            <div
              key={`${selectedDate}_${client.fullname}`}
              className="   rounded-xl border-2 border-myBlue-200 "
            >
              <div className=" rounded-t-md bg-myBlue-200 text-lg font-normal text-white">
                <h1 className="text-center">Αίτηση για Ραντεβού</h1>
                <p className="text-center">
                  {selectedDate}
                  {' : '} {client.time}
                </p>
              </div>
              <div key={client.fullname}>
                <div className=" mt-4 grid grid-flow-col items-center justify-items-center">
                  <Image
                    src={client.profile}
                    alt={'Εικόνα Προφίλ'}
                    className="max-h-[3em] max-w-[3em] rounded-lg object-cover object-top"
                  ></Image>
                  <p className="text-center text-base font-bold">
                    {client.fullname}
                  </p>
                  {/* ToDO: Να φτιάξω το κουμπί διεπαφής ώστε όταν θα πατάει τις πληροφορίες να μου δίνει το άλλο σχέδιο */}
                  <Image
                    src={info}
                    alt={''}
                    className="max-h-[2em] max-w-[2em]"
                  ></Image>
                </div>
                <div className="my-4 flex justify-center gap-4 font-exo font-normal">
                  <button className="rounded-xl bg-myBlue-200 px-6 text-white ">
                    Αποδοχή
                  </button>
                  <button className="rounded-xl bg-myGrey-100 px-6">
                    Απόρριψη
                  </button>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  ) : null;
};

export default CalendarC;
