import { NextPage } from 'next';
import Image from 'next/image';
import logo from '/public/images/logo.png';
import food from '/public/images/food.jpg';
import star from '/public/images/Star 1.svg';
import photo from '/public/images/myphoto.jpg';
import GeneralNav from '../components/GeneralNav';
import Link from 'next/link';
import { useState } from 'react';

const Index: NextPage = () => {
  const [isHovered, setIsHovered] = useState<boolean>(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };
  return (
    <div className="h-screen md:grid md:grid-cols-2 ">
      <main className="container mt-[1em] overflow-y-hidden">
        <GeneralNav />

        <div className="mt-12 grid  grid-flow-row justify-items-center gap-4 ">
          <h1 className="px-[1.5em] text-center text-[2rem] font-bold leading-10 md:mt-[3em]  md:px-[1em] md:text-40 xl:mt-[1.5em] xl:text-[4.375rem] xl:leading-[4.5rem]">
            Η μαγειρική σου εμπειρία αλλάζει
          </h1>
          <p className=" px-[6em] text-center text-[0.8rem] leading-4 md:px-[3.5em] md:text-20 md:leading-6 xl:text-[1.75rem] xl:leading-[2rem]">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
            Condimentum id venenatis a vitae.
          </p>
          <button className="hover:scale-125 hover:transition hover:duration-300 hover:ease-in  md:mt-8">
            <Link
              href="/login"
              className="rounded-full bg-myBlue-200 py-[.25em] px-[3.5em] text-white hover:bg-myRed md:text-20 xl:text-[2rem]"
            >
              Ξεκίνησε τώρα
            </Link>
          </button>
        </div>
      </main>

      <section className="container mt-[2em] grid grid-flow-row gap-4 rounded-[3em] bg-myBlue-200 font-exo font-normal  md:mt-0 md:rounded-none md:rounded-bl-[6em] ">
        <div className="grid grid-flow-col items-center justify-around  ">
          <Image
            src={logo}
            alt={'logo'}
            className="xl:min-h-[2em] xl:min-w-[5em]"
          />
          <div className="my-3  flex flex-row gap-6 font-bold">
            <button className="transition duration-300 hover:scale-110 hover:ease-in">
              <Link
                href="/login"
                className="rounded-full   border-[1px] border-white px-[1.5em] py-[0.25em] text-white hover:bg-myRed md:text-15 xl:text-25  "
              >
                Login
              </Link>
            </button>
            <button className="transition duration-300 hover:scale-110 hover:ease-in">
              <Link
                href="/register"
                className="rounded-full bg-myGrey-100 px-[.9em] py-[0.25em]  text-myBlue-200   hover:outline hover:outline-2 hover:outline-black md:text-15 xl:text-25"
              >
                Register
              </Link>
            </button>
          </div>
        </div>

        <div className="my-[3.5em] grid grid-flow-col justify-evenly gap-7  md:py-[5em] md:px-3">
          <div
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className=" grid min-w-[9em] cursor-pointer  grid-flow-row justify-items-center gap-2 rounded-[.9em] bg-myGrey-100 pb-[1.5em] shadow-2xl drop-shadow-2xl transition duration-300 hover:scale-110 hover:ease-in"
          >
            <Image
              src={food}
              alt={'Food Image'}
              className="-mt-[3em] max-h-[6em] max-w-[6em] rounded-full md:max-h-[8em] md:max-w-[8em] xl:-mt-[4.5em] xl:max-h-[12em] xl:max-w-[12em]"
            ></Image>
            <h1 className="text-12 font-bold md:px-2 md:text-center md:text-20 md:leading-6 xl:text-[2rem]">
              Μακαρόνια με Κιμά
            </h1>
            <p className="text-9 md:text-12 xl:text-20">
              Βαθμός Δυσκολίας: Εύκολο
            </p>
            <div className="m-[0.65em] flex flex-row items-center gap-2">
              <Image
                src={photo}
                alt={'Profile Photo'}
                className="max-h-[2em] max-w-[2em] rounded-[.5em] object-cover  object-top md:max-h-[3em] md:max-w-[3em] xl:max-h-[4em] xl:max-w-[4em] "
              ></Image>
              <p className="text-9 leading-[.8rem] text-black md:text-12 xl:text-[2rem] xl:leading-8">
                Κωνσταντίνος <br /> Κασκαντιρης
              </p>
            </div>
            <div className="flex flex-row items-center gap-1">
              <Image
                src={star}
                alt={'star'}
                className="md:min-h-[1.5em] md:min-w-[1.5em] xl:min-h-[2.5em] xl:min-w-[2.5em]"
              ></Image>
              <p className="text-9 md:text-12 xl:text-[2rem] xl:leading-8">
                4.5/5(30)
              </p>
            </div>
          </div>

          <div
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="grid min-w-[9em] cursor-pointer  grid-flow-row justify-items-center gap-2 rounded-[.9em] bg-myGrey-100 pb-[1.5em] shadow-2xl drop-shadow-2xl transition duration-300 hover:scale-110 hover:ease-in"
          >
            <Image
              src={food}
              alt={'Food Image'}
              className="-mt-[3em] max-h-[6em] max-w-[6em] rounded-full md:max-h-[8em] md:max-w-[8em] xl:-mt-[4.5em] xl:max-h-[12em] xl:max-w-[12em]"
            ></Image>
            <h1 className="text-12 font-bold md:px-2 md:text-center md:text-20 md:leading-6 xl:text-[2rem]">
              Μακαρόνια με Κιμά
            </h1>
            <p className="text-9 md:text-12 xl:text-20">
              Βαθμός Δυσκολίας: Εύκολο
            </p>
            <div className="m-[0.65em] flex flex-row items-center gap-2">
              <Image
                src={photo}
                alt={'Profile Photo'}
                className="max-h-[2em] max-w-[2em] rounded-[.5em] object-cover  object-top md:max-h-[3em] md:max-w-[3em] xl:max-h-[4em] xl:max-w-[4em]"
              ></Image>
              <p className="text-9 leading-[.8rem] text-black md:text-12 xl:text-[2rem] xl:leading-8">
                Κωνσταντίνος <br /> Κασκαντιρης
              </p>
            </div>
            <div className="flex flex-row items-center gap-1">
              <Image
                src={star}
                alt={'star'}
                className="md:min-h-[1.5em] md:min-w-[1.5em] xl:min-h-[2.5em] xl:min-w-[2.5em]"
              ></Image>
              <p className="text-9 md:text-12 xl:text-[2rem] xl:leading-8">
                4.5/5(30)
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="container mt-7 grid grid-flow-col justify-items-center gap-4  text-9 leading-3 md:col-span-2 md:mt-[12em] md:leading-4 xl:mt-[10em] xl:leading-5 ">
        <div className="xl:space-y-4">
          <h1 className="text-3xl font-bold md:text-40 xl:text-[4.375rem]">
            85%
          </h1>
          <p className="max-w-[12.1em] md:text-15 xl:text-20">
            Των ανθρώπων δεν ξέρει πως να αξιοποιεί τα υλικά και σκεύη τους
          </p>
        </div>

        <div className="xl:space-y-4">
          <h1 className="text-3xl font-bold md:text-40 xl:text-[4.375rem]">
            100+
          </h1>
          <p className="max-w-[7.1em] md:text-15 xl:text-20">Συνεργάτες Chef</p>
        </div>
        <div className="xl:space-y-4 ">
          <h1 className="text-3xl font-bold md:text-40 xl:text-[4.375rem]">
            50+
          </h1>
          <p className="max-w-[7.1em] md:text-15 xl:text-20">
            Εγκεκριμένοι Διατροφολόγοι
          </p>
        </div>
        {isHovered && (
          <div className="xl:space-y-4">
            <h1 className="text-3xl font-bold md:text-40 xl:text-[4.375rem]">
              1000+
            </h1>
            <p className="max-w-[7.1em] md:text-15 xl:text-20">
              Συνταγές βάσει των επιλογών σου
            </p>
          </div>
        )}
      </section>
    </div>
  );
};

export default Index;
