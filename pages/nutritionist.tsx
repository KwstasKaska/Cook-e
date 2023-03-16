import { NextPage } from 'next';

import React from 'react';
import Footer from '../components/Footer';
import NutrNavbar from '../components/Nutritionist/NutrNavbar';

import CalendarC from '../components/Nutritionist/CalendarC';
import NutrArticles from '../components/Nutritionist/NutrArticles';

const Nutritionist: NextPage = () => {
  return (
    <div>
      <NutrNavbar />

      <main>
        <NutrArticles />

        <section className="grid h-screen grid-cols-fluid ">
          <div>
            <CalendarC />
          </div>

          <div className="mx-[3em] h-fit rounded-lg border-2 border-black bg-myGrey-100">
            <button className="font-bold">
              Ρύθμιση Διαθεσιμότητας ημερομηνιών και ωρών
            </button>
          </div>
        </section>

        <section className="h-screen bg-myGrey-200"></section>

        <section className="h-screen">asdfwffsdg</section>
      </main>

      <Footer></Footer>
    </div>
  );
};

export default Nutritionist;
