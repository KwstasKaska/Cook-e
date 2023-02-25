import { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import logo from '/public/images/logo.png';
import food from '/public/images/food.jpg';
import star from '/public/images/Star 1.svg';
import photo from '/public/images/myphoto.jpg';

const Index: NextPage = () => {
  return (
    <div className="md:grid md:grid-cols-2  ">
      <Head>
        <title>Cook-e</title>
      </Head>

      <main className="mt-[1em] container">
        <nav className=" text-black ">
          <ul className=" uppercase  text-9 font-bold grid grid-flow-col justify-evenly  md:text-15  xl:text-20 ">
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

        <div className="grid grid-flow-row  justify-items-center gap-4 mt-12 ">
          <h1 className="font-bold text-center px-[1.5em] leading-10 text-[2rem] md:px-[1em]  md:mt-[3em] md:text-40 xl:text-[4.375rem] xl:leading-[4.5rem] xl:mt-[1.5em]">
            Η μαγειρική σου εμπειρία αλλάζει
          </h1>
          <p className=" leading-4 text-[0.8rem] text-center px-[6em] md:px-[3.5em] md:text-20 md:leading-6 xl:text-[1.75rem] xl:leading-[2rem]">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
            Condimentum id venenatis a vitae.
          </p>
          <button className="md:mt-8">
            <a
              href="/login"
              className="bg-myBlue-200 rounded-full py-[.25em] px-[3.5em] text-white md:text-20 xl:text-[2rem]"
            >
              Ξεκίνησε τώρα
            </a>
          </button>
        </div>
      </main>

      <section className="bg-myBlue-200 container rounded-[3em] mt-[2em] font-exo font-normal grid grid-flow-row gap-4  md:rounded-bl-[6em] md:mt-0 md:rounded-none ">
        <div className="grid grid-flow-col items-center justify-around  ">
          <Image
            src={logo}
            alt={'logo'}
            className="xl:min-w-[5em] xl:min-h-[2em]"
          />
          <div className="font-bold  my-3 flex flex-row gap-2">
            <button>
              <a
                href="/login"
                className="text-white   rounded-full  px-[1.5em] py-[0.25em] border-white border-[1px] md:text-15 xl:text-25  "
              >
                Login
              </a>
            </button>
            <button>
              <a
                href="/register"
                className="text-myBlue-200 bg-myGrey-100 rounded-full  px-[.9em] py-[0.25em] md:text-15 xl:text-25"
              >
                Register
              </a>
            </button>
          </div>
        </div>

        <div className="my-[3.5em] grid grid-flow-col gap-7 justify-evenly  md:py-[5em] md:px-3">
          <div className="bg-myGrey-100 min-w-[9em]  pb-[1.5em] rounded-[.9em] grid grid-flow-row justify-items-center gap-2 shadow-2xl drop-shadow-2xl">
            <Image
              src={food}
              alt={'Food Image'}
              className="rounded-full max-w-[6em] max-h-[6em] -mt-[3em] md:max-w-[8em] md:max-h-[8em] xl:max-w-[12em] xl:max-h-[12em] xl:-mt-[4.5em]"
            ></Image>
            <h1 className="text-12 font-bold md:text-20 md:text-center md:px-2 md:leading-6 xl:text-[2rem]">
              Μακαρόνια με Κιμά
            </h1>
            <p className="text-9 md:text-12 xl:text-20">
              Βαθμός Δυσκολίας: Εύκολο
            </p>
            <div className="flex flex-row items-center gap-2 m-[0.65em]">
              <Image
                src={photo}
                alt={'Profile Photo'}
                className="max-w-[2em] max-h-[2em] object-cover object-top  rounded-[.5em] md:max-w-[3em] md:max-h-[3em] xl:max-w-[4em] xl:max-h-[4em] "
              ></Image>
              <p className="text-black text-9 leading-[.8rem] md:text-12 xl:text-[2rem] xl:leading-8">
                Κωνσταντίνος <br /> Κασκαντιρης
              </p>
            </div>
            <div className="flex flex-row items-center gap-1">
              <Image
                src={star}
                alt={'star'}
                className="md:min-w-[1.5em] md:min-h-[1.5em] xl:min-w-[2.5em] xl:min-h-[2.5em]"
              ></Image>
              <p className="text-9 md:text-12 xl:text-[2rem] xl:leading-8">
                4.5/5(30)
              </p>
            </div>
          </div>

          <div className="bg-myGrey-100 min-w-[9em]  pb-[1.5em] rounded-[.9em] grid grid-flow-row justify-items-center gap-2 shadow-2xl drop-shadow-2xl">
            <Image
              src={food}
              alt={'Food Image'}
              className="rounded-full max-w-[6em] max-h-[6em] -mt-[3em] md:max-w-[8em] md:max-h-[8em] xl:max-w-[12em] xl:max-h-[12em] xl:-mt-[4.5em]"
            ></Image>
            <h1 className="text-12 font-bold md:text-20 md:text-center md:px-2 md:leading-6 xl:text-[2rem]">
              Μακαρόνια με Κιμά
            </h1>
            <p className="text-9 md:text-12 xl:text-20">
              Βαθμός Δυσκολίας: Εύκολο
            </p>
            <div className="flex flex-row items-center gap-2 m-[0.65em]">
              <Image
                src={photo}
                alt={'Profile Photo'}
                className="max-w-[2em] max-h-[2em] object-cover object-top  rounded-[.5em] md:max-w-[3em] md:max-h-[3em] xl:max-w-[4em] xl:max-h-[4em]"
              ></Image>
              <p className="text-black text-9 leading-[.8rem] md:text-12 xl:text-[2rem] xl:leading-8">
                Κωνσταντίνος <br /> Κασκαντιρης
              </p>
            </div>
            <div className="flex flex-row items-center gap-1">
              <Image
                src={star}
                alt={'star'}
                className="md:min-w-[1.5em] md:min-h-[1.5em] xl:min-w-[2.5em] xl:min-h-[2.5em]"
              ></Image>
              <p className="text-9 md:text-12 xl:text-[2rem] xl:leading-8">
                4.5/5(30)
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-flow-col justify-items-center text-9 leading-3 container  gap-4 mt-7 md:col-span-2 md:mt-[12em] md:leading-4 xl:mt-[10em] xl:leading-5 ">
        <div className="xl:space-y-4">
          <h1 className="font-bold text-3xl md:text-40 xl:text-[4.375rem]">
            85%
          </h1>
          <p className="max-w-[12.1em] md:text-15 xl:text-20">
            Των ανθρώπων δεν ξέρει πως να αξιοποιεί τα υλικά και σκεύη τους
          </p>
        </div>

        <div className="xl:space-y-4">
          <h1 className="font-bold text-3xl md:text-40 xl:text-[4.375rem]">
            100+
          </h1>
          <p className="max-w-[7.1em] md:text-15 xl:text-20">Συνεργάτες Chef</p>
        </div>
        <div className="xl:space-y-4 ">
          <h1 className="font-bold text-3xl md:text-40 xl:text-[4.375rem]">
            50+
          </h1>
          <p className="max-w-[7.1em] md:text-15 xl:text-20">
            Εγκεκριμένοι Διατροφολόγοι
          </p>
        </div>
        <div className="xl:space-y-4">
          <h1 className="font-bold text-3xl md:text-40 xl:text-[4.375rem]">
            1000+
          </h1>
          <p className="max-w-[7.1em] md:text-15 xl:text-20">
            Συνταγές βάσει των επιλογών σου
          </p>
        </div>
      </section>
    </div>
  );
};

export default Index;
