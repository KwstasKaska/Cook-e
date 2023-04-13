import { NextPage } from 'next';

import React, { useState } from 'react';
import Footer from '../components/Users/Footer';
import NutrNavbar from '../components/Nutritionist/NutrNavbar';

import CalendarC from '../components/Nutritionist/CalendarC';
import NutrArticles from '../components/Nutritionist/NutrArticles';
import NutrAppointments from '../components/Nutritionist/NutrAppointments';

import { DateContext } from '../components/Context';
import NutrScheduler from '../components/Nutritionist/NutrScheduler';
import ScrollToTopButton from '../components/Helper/ScrollToTopButton';
import Image from 'next/image';
import profile from '/public/images/myphoto.jpg';

const Nutritionist: NextPage = ({}) => {
  const [selectedDate, setSelectedDate] = useState<string>('');

  // ToDO: Να φτιάξω κουμπί διαγραφής για τις ώρες
  // TODO: Να φτιάξω το κομμάτι της αποθήκευσης όταν το συνδέσω με την βάση

  return (
    <React.Fragment>
      <NutrNavbar />

      <main className="relative">
        <div className="grid grid-flow-col-dense justify-start  pt-[4em]  pb-[1.9em] pl-5 md:pl-20 xl:pl-32">
          <Image
            src={profile}
            alt={'profile'}
            className="row-span-2 max-h-[3.5em] max-w-[3.5em] justify-self-end rounded-full object-cover object-top md:max-h-[5em] md:max-w-[5em]  xl:max-h-[7em] xl:max-w-[7em]"
          ></Image>
          <h1 className="text-19 font-exo font-bold md:text-2xl xl:text-3xl">
            Καλωσήρθατε, <br></br> Dr. Kwstas Kaskantiris
          </h1>
          <p className="text-15 font-exo font-normal md:text-xl xl:text-2xl">
            Πως είναι η μέρα σας σήμερα;
          </p>
        </div>
        <div className="absolute left-[1.3em]  top-[2em] -z-[1]  h-[9em] w-[18em] -rotate-[13deg]  rounded-[1em] bg-myGrey-100 md:left-28 md:scale-125 xl:left-48 xl:scale-150 2xl:left-64 2xl:top-20 2xl:scale-[2]"></div>
        <div className="absolute  left-[5em]  top-[5em] -z-[2] h-[9em] w-[18em] -rotate-[13deg] rounded-[1em]  bg-myBlue-100 md:left-48 md:scale-125 xl:left-72 xl:scale-150 2xl:top-40 2xl:left-[22em] 2xl:scale-[2]"></div>
        <NutrArticles />

        <DateContext.Provider value={{ selectedDate, setSelectedDate }}>
          <section id="section_2" className="min-h-screen  bg-myGrey-100">
            <div className=" mx-auto max-w-[70em] ">
              <h1 className="mx-auto  pt-16 text-center text-xl font-bold   capitalize  md:text-4xl lg:text-5xl">
                αναζήτηση αιτημάτων ραντεβού
              </h1>
              <CalendarC />
            </div>
          </section>

          <NutrAppointments />

          <NutrScheduler />
        </DateContext.Provider>
        <ScrollToTopButton />
      </main>

      <Footer></Footer>
    </React.Fragment>
  );
};

export default Nutritionist;
