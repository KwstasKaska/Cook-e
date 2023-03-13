import { NextPage } from 'next';
import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import info from '/public/images/info.png';
import { format } from 'date-fns';
import { el } from 'date-fns/locale';

const DynamicCalendar = dynamic(() => import('react-calendar'), {
  ssr: false,
});

interface Appointment {
  datetime: string;
  profile: string;
  fullname: string;
  time: string;
}

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
    fullname: 'Jane Smith',
    time: '13:00-14:00',
  },
  {
    datetime: '11-Μαρτίου-2023',
    profile: require('/public/images/myphoto.jpg'),
    fullname: 'Bob Johnson',
    time: '15:00-17:00',
  },
];

const CalendarC: NextPage = ({}) => {
  const [value, onChange] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState('');
  const [clients, setClients] = useState<Appointment[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleCancel = () => {
    const currentDate = new Date();
    onChange(currentDate);
    setSelectedDate('');
  };

  const handleApply = () => {
    const formattedDate = format(value, 'dd-MMMM-yyyy', { locale: el });
    console.log(formattedDate);
    const filteredClients = fakeAppointments.filter(
      (appointment) => appointment.datetime === formattedDate
    );
    setClients(filteredClients);
    setSelectedDate(formattedDate);
  };

  return isClient ? (
    <div>
      <div className=" flex flex-col items-center gap-6">
        <DynamicCalendar onChange={onChange} className="mx-auto" />
        <div className="space-x-4">
          <button
            className="border-2 rounded-lg py-1 px-7"
            onClick={handleCancel}
          >
            Ακύρωση
          </button>
          <button
            className="bg-black text-white rounded-lg py-2 px-7"
            onClick={handleApply}
          >
            Εφαρμογή
          </button>
        </div>
      </div>

      {/* ToDo: Να κάνω validation στην περίπτωση που δεν εχει ραντεβού να πετάει το αντίστοιχο μήνυμα */}
      {clients.map(
        (client) =>
          selectedDate && (
            <div className="border-2 border-green-400 rounded-xl">
              <div className="bg-myBlue-200 text-white font-normal text-lg rounded-t-xl">
                <h1 className="text-center">Αίτηση για Ραντεβού</h1>
                <p className="text-center">
                  {selectedDate}
                  {' : '} {client.time}
                </p>
              </div>
              <div key={client.fullname}>
                <div className="shadow-2xl">
                  <Image
                    src={client.profile}
                    alt={'Εικόνα Προφίλ'}
                    className="max-w-[3em] max-h-[3em] object-cover object-top rounded-lg"
                  ></Image>
                  {client.fullname}
                  <Image
                    src={info}
                    alt={''}
                    className="max-w-[3em] max-h-[3em]"
                  ></Image>
                  <div>
                    <button className="bg-myBlue-200 text-white">
                      Αποδοχή
                    </button>
                    <button className="bg-myGrey-100">Απόρριψη</button>
                  </div>
                </div>
              </div>
            </div>
          )
      )}
    </div>
  ) : null;
};

export default CalendarC;
