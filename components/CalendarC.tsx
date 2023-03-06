import { NextPage } from 'next';
import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

import 'react-calendar/dist/Calendar.css';

const DynamicCalendar = dynamic(() => import('react-calendar'), {
  ssr: false,
});

const CalendarC: NextPage = () => {
  const [value, onChange] = useState(new Date());

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient ? (
    <DynamicCalendar onChange={onChange} value={value} />
  ) : null;
};

export default CalendarC;
