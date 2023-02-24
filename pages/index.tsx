import { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import logo from '/public/images/logo.png';
import food from '/public/images/food.jpg';
import star from '/public/images/Star 1.svg';
import photo from '/public/images/myphoto.jpg';

const Index: NextPage = () => {
  return (
    <div className="">
      <Head>
        <title>Cook-e</title>
      </Head>

      <section className="bg-myBlue-200 font-exo font-normal grid grid-flow-row gap-4">
        <nav className="grid grid-flow-col items-center ">
          <Image src={logo} alt={'logo'} className="" />
          <ul className="-ml-[3em] uppercase text-white text-9 font-bold flex flex-row gap-6 ">
            <li>
              <a href="#">Αρχικη</a>
            </li>
            <li>
              <a href="#">Χρηστης</a>
            </li>
            <li>
              <a href="#">Chef</a>
            </li>
            <li>
              <a href="#">Διατροφολογος</a>
            </li>
          </ul>
        </nav>

        <div className="mt-[3.5em] grid grid-flow-col gap-7 justify-evenly">
          <div className="bg-myGrey-100 min-w-[9em] pb-[1.5em] rounded-[.9em] grid grid-flow-row justify-items-center gap-2">
            <Image
              src={food}
              alt={'Food Image'}
              className="rounded-full max-w-[6em] max-h-[6em] -mt-[3em]"
            ></Image>
            <h1 className="text-12 font-bold">Μακαρόνια με Κιμά</h1>
            <p className="text-9">Βαθμός Δυσκολίας: Εύκολο</p>
            <div className="flex flex-row items-center gap-2 m-[0.65em]">
              <Image
                src={photo}
                alt={'Profile Photo'}
                className="max-w-[2em] max-h-[2em] object-cover object-top  rounded-[.5em]"
              ></Image>
              <p className="text-black text-9 leading-[.8rem]">
                Κωνσταντίνος <br /> Κασκαντιρης
              </p>
            </div>
            <div className="flex flex-row items-center gap-1">
              <Image src={star} alt={'star'} className=""></Image>
              <p className="text-9">4.5/5(30)</p>
            </div>
          </div>

          <div className="bg-myGrey-100 min-w-[9em] pb-[1.5em] rounded-[.9em] grid grid-flow-row justify-items-center">
            <Image
              src={food}
              alt={'Food Image'}
              className="rounded-full max-w-[6em] max-h-[6em] -mt-[3em]"
            ></Image>
            <h1 className="text-12 font-bold">Μακαρόνια με Κιμά</h1>
            <p className="text-9">Βαθμός Δυσκολίας: Εύκολο</p>
            <div className="flex flex-row items-center gap-2 m-[0.65em]">
              <Image
                src={photo}
                alt={'Profile Photo'}
                className="max-w-[2em] max-h-[2em] object-cover object-top  rounded-[.5em]"
              ></Image>
              <p className="text-black text-9 leading-[.8rem]">
                Κωνσταντίνος <br /> Κασκαντιρης
              </p>
            </div>
            <div className="flex flex-row items-center gap-1">
              <Image src={star} alt={'star'} className=""></Image>
              <p className="text-9">4.5/5(30)</p>
            </div>
          </div>
        </div>

        <div className="font-bold justify-self-center my-6 flex flex-row gap-10">
          <button>
            <a
              href="/login"
              className="text-white   rounded-full  px-[1.5em] py-[0.25em] border-white border-[1px]"
            >
              Login
            </a>
          </button>
          <button>
            <a
              href="/register"
              className="text-myBlue-200 bg-myGrey-100 rounded-full  px-[.9em] py-[0.25em]"
            >
              Register
            </a>
          </button>
        </div>
      </section>

      <main>
        <div className="grid grid-flow-row  justify-items-center gap-6">
          <h1 className="font-bold max-w-[17.8em] leading-10 text-[2rem]">
            Η μαγειρική σου <br /> εμπειρία αλλάζει
          </h1>
          <p className="max-w-[17.8em] leading-4 text-[0.8rem]">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
            Condimentum id venenatis a vitae.
          </p>
          <button>
            <a
              href="/login"
              className="bg-myBlue-200 rounded-full py-[.25em] px-[3.5em] text-white"
            >
              Ξεκίνησε τώρα
            </a>
          </button>
          <div className="grid grid-cols-2  text-9 leading-3 gap-4 ">
            <div className=" ">
              <h1 className="font-bold text-3xl">85%</h1>
              <p className="max-w-[12.1em]">
                Των ανθρώπων δεν ξέρει πως να αξιοποιεί τα υλικά και σκεύη τους
              </p>
            </div>

            <div className="ml-[2em]">
              <h1 className="font-bold text-3xl">100+</h1>
              <p className="max-w-[7.1em]">Συνεργάτες Chef</p>
            </div>
            <div className=" ">
              <h1 className="font-bold text-3xl">50+</h1>
              <p className="max-w-[7.1em]">Εγκεκριμένοι Διατροφολόγοι</p>
            </div>
            <div className="ml-[2em]">
              <h1 className="font-bold text-3xl">1000+</h1>
              <p className="max-w-[7.1em]">Συνταγές βάσει των επιλογών σου</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
