import { NextPage } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import logo from '/public/images/6.png';

const Register: NextPage = ({}) => {
  return (
    <main className="container h-screen">
      <div className="customImg h-full bg-auto bg-fixed  bg-center  bg-no-repeat pt-[3em] md:mt-0 md:flex  md:flex-row    md:content-center md:justify-center md:gap-[2em] md:bg-none xl:gap-[4rem]">
        <section className="md:chefImg flex flex-row  justify-center   gap-[5em] md:order-2 md:grid  md:grid-cols-2 md:grid-rows-none  md:content-center md:bg-contain md:bg-center md:bg-no-repeat md:px-[1em]">
          <Image
            src={logo}
            alt={'Cook-e'}
            width="116"
            height="39.77"
            className="md:h-fit md:pb-[29em] "
          ></Image>
          <button
            type="submit"
            className=" cursor-pointer rounded-registerLogin bg-myBlue-200 px-[2.3em]  font-exo text-15 font-bold text-white  md:h-fit md:py-[.75em] "
          >
            <Link href="/login">Login</Link>
          </button>
        </section>

        <section className="mt-[9em]  grid grid-flow-row place-content-center place-items-center gap-3 md:mt-0">
          <h1 className=" font-exo text-[1.8rem] font-bold text-myBlue-200 lg:text-40">
            Δημιουργία Λογαριασμού
          </h1>
          <p className="mb-3 w-[20em] text-center text-15 font-normal lg:text-20">
            Μια μαγειρική απόλαυση σε περιμένει! Ολοκλήρωσε την εγγραφή σου
          </p>

          <form
            action="#"
            className=" grid grid-cols-1 justify-items-center   gap-5 text-[.7rem] font-normal text-black lg:text-20"
          >
            <input
              className="w-[90%] border-none shadow-xl drop-shadow-2xl  "
              type="text"
              placeholder="Όνομα Χρήστη "
            />

            <input
              type="email"
              placeholder="Email "
              className="w-[90%] border-none shadow-xl drop-shadow-2xl "
            />

            <input
              type="password"
              placeholder="Kωδικός Πρόσβασης"
              className="w-[90%] border-none shadow-xl drop-shadow-2xl"
            />

            <input
              type="password"
              placeholder="Επανάληψη Κωδικού Πρόσβασης"
              className="w-[90%]  border-none shadow-xl drop-shadow-2xl"
            />

            <div className="grid grid-cols-4  items-center justify-items-center">
              <div className="justify-self-start text-base font-normal ">
                Ιδιότητα:
              </div>
              <label htmlFor="Χρήστης" className="">
                Χρήστης &nbsp;
                <input type="checkbox" id="Χρήστης" className="text-base" />
              </label>
              <label htmlFor="Chef">
                Chef &nbsp;
                <input type="checkbox" id="Chef" className="" />
              </label>
              <label htmlFor="Διατροφολόγος">
                Διατροφολόγος &nbsp;
                <input type="checkbox" id="Διατροφολόγος" className=" " />
              </label>
            </div>

            <button
              type="submit"
              className="mt-[3em] cursor-pointer rounded-[0.56rem] bg-myBlue-200 px-[3em] py-[.5em] text-15 font-bold text-white lg:text-25"
            >
              Δημιουργία Λογαριασμού
            </button>
          </form>
        </section>
      </div>
    </main>
  );
};

export default Register;
