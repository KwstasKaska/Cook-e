import { NextPage } from 'next';
import Image from 'next/image';

import React from 'react';
import Footer from '../components/Footer';
import NutrNavbar from '../components/NutrNavbar';
import profile from '/public/images/myphoto.jpg';
import backbtn from '/public/images/backbtn.png';
import articleImg from '/public/images/articleImg.jpg';
import CalendarC from '../components/CalendarC';
import info from '/public/images/info.png';

const Nutritionist: NextPage = () => {
  return (
    <div>
      <NutrNavbar />

      <main>
        <section className="h-screen relative overflow-hidden">
          <div className="mt-[4em] mb-[1.9em] grid grid-flow-col-dense justify-start pl-5">
            <Image
              src={profile}
              alt={'profile'}
              className="rounded-full max-w-[3.5em] max-h-[3.5em] object-cover object-top row-span-2 justify-self-end"
            ></Image>
            <h1 className="font-exo font-bold text-19">
              Καλωσήρθατε, <br></br> Dr. Kwstas Kaskantiris
            </h1>
            <p className="font-normal font-exo text-15 ">
              Πως είναι η μέρα σας σήμερα;
            </p>
          </div>
          <div className="bg-myGrey-100  w-[18em] h-[9em] rounded-[1em] -rotate-[13deg] absolute -z-[1]  left-[1.3em] top-[2em] "></div>
          <div className="bg-myBlue-100  w-[18em] h-[9em] rounded-[1em] -rotate-[13deg] absolute -z-[2]  left-[5em] top-[5em] "></div>

          <div className="bg-myGrey-200 w-full pb-12 pt-5 ">
            <h1 className="mb-[.75em]  text-center text-30 font-exo font-bold uppercase text-transparent bg-gradient-to-r bg-clip-text from-[#B3D5F8] to-[#FFFFFF]">
              Τα αρθρα σας
            </h1>
            <div className="grid grid-flow-col gap-8 mx-6 touch-pan-x overflow-x-auto snap-x scrollbar  md:justify-evenly">
              <button className="hidden md:block">
                <Image
                  src={backbtn}
                  alt={'Κουμπί εμπρός'}
                  className="w-[2em]"
                ></Image>
              </button>
              <div className="bg-myBlue-100 flex flex-col max-w-[12em] gap-4 rounded-[10px] snap-center">
                <Image
                  src={articleImg}
                  alt={'Eικόνα άρθρου'}
                  className="max-w-[12em] max-h-[12em] self-center rounded-t-[10px]"
                ></Image>
                <h2 className="text-center font-bold text-15 px-[.3em]">
                  Η διατροφή στις μέρες μας, υπάρχει εύκολη λύση;
                </h2>
                <p className="text-right font-normal text-12">21.11.2022</p>
              </div>
              <div className="bg-myBlue-100 flex flex-col max-w-[12em] gap-4 rounded-[10px] snap-center">
                <Image
                  src={articleImg}
                  alt={'Eικόνα άρθρου'}
                  className="max-w-[12em] max-h-[12em] self-center rounded-t-[10px]"
                ></Image>
                <h2 className="text-center font-bold text-15 px-[.3em]">
                  Η διατροφή στις μέρες μας, υπάρχει εύκολη λύση;
                </h2>
                <p className="text-right font-normal text-12">21.11.2022</p>
              </div>
              <div className="bg-myBlue-100 flex flex-col max-w-[12em] gap-4 rounded-[10px] snap-center">
                <Image
                  src={articleImg}
                  alt={'Eικόνα άρθρου'}
                  className="max-w-[12em] max-h-[12em] self-center rounded-t-[10px]"
                ></Image>
                <h2 className="text-center font-bold text-15 px-[.3em]">
                  Η διατροφή στις μέρες μας, υπάρχει εύκολη λύση;
                </h2>
                <p className="text-right font-normal text-12">21.11.2022</p>
              </div>
              <button className="hidden md:block">
                <Image
                  src={backbtn}
                  alt={'Κουμπί πίσω'}
                  className="w-[2em] rotate-180"
                ></Image>
              </button>
            </div>
          </div>
        </section>

        <section className="h-screen grid grid-cols-fluid ">
          <div>
            <CalendarC />
            <button></button>
            <button>Εφαρμογή</button>
          </div>
          <div>
            <div className="bg-myBlue-200 text-white">
              <h1>Αίτηση για Ραντεβού</h1>
              <p>8 Αυγούστου 2023, 15:00-16:00</p>
            </div>
            <div>
              <Image
                src={profile}
                alt={'Εικόνα Προφίλ'}
                className="max-w-[3em] max-h-[3em] object-cover object-top rounded-lg"
              ></Image>
              <p>
                Κωνσταντίνος <br /> Κασκαντίρης
              </p>
              <Image
                src={info}
                alt={''}
                className="max-w-[3em] max-h-[3em]"
              ></Image>
            </div>
            <div>
              <button className="bg-myBlue-200 text-white">Αποδοχή</button>
              <button>Απόρριψη</button>
            </div>
          </div>
          <div className="bg-myGrey-100 border-2 border-black rounded-lg">
            <button className="font-bold">
              Ρύθμιση Διαθεσιμότητας ημερομηνιών και ωρών
            </button>
          </div>
        </section>

        <section className="h-screen bg-myGrey-200">fgafg</section>

        <section className="h-screen">asdfwffsdg</section>
      </main>

      <Footer></Footer>
    </div>
  );
};

export default Nutritionist;
