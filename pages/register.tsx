import { NextPage } from 'next';
import Image from 'next/image';
import logo from '/public/images/6.png';

const Register: NextPage = ({}) => {
  return (
    <main className="h-screen container">
      <div className="h-full mt-[3em] bg-auto bg-scroll bg-no-repeat bg-center customImg md:bg-none md:flex  md:mt-0    md:flex-row md:content-center md:justify-center md:gap-[2em] xl:gap-[4rem]">
        <section className="flex flex-row justify-center  gap-[5em]   md:chefImg md:bg-contain md:bg-center  md:bg-no-repeat md:order-2  md:grid md:grid-cols-2 md:grid-rows-none md:content-center md:px-[1em]">
          <Image
            src={logo}
            alt={'Cook-e'}
            width="116"
            height="39.77"
            className="md:h-fit md:pb-[29em] "
          ></Image>
          <button
            type="submit"
            className=" font-exo font-bold text-15 text-white  rounded-registerLogin bg-myBlue-200 px-[2.3em] cursor-pointer  md:py-[.75em] md:h-fit "
          >
            Login
          </button>
        </section>

        <section className="mt-[9em]  grid grid-flow-row place-content-center place-items-center gap-3 md:mt-0">
          <h1 className=" font-exo font-bold text-myBlue-200 text-[1.8rem] lg:text-40">
            Δημιουργία Λογαριασμού
          </h1>
          <p className="text-15 font-normal text-center w-[20em] mb-3 lg:text-20">
            Μια μαγειρική απόλαυση σε περιμένει! Ολοκλήρωσε την εγγραφή σου
          </p>

          <form
            action="#"
            className=" grid grid-cols-1 gap-5   font-normal justify-items-center text-[.7rem] text-black lg:text-20"
          >
            <input
              className="border-none drop-shadow-2xl w-[90%] shadow-xl  "
              type="text"
              placeholder="Όνομα Χρήστη "
            />

            <input
              type="email"
              placeholder="Email "
              className="border-none w-[90%] drop-shadow-2xl shadow-xl "
            />

            <input
              type="password"
              placeholder="Kωδικός Πρόσβασης"
              className="border-none w-[90%] shadow-xl drop-shadow-2xl"
            />

            <input
              type="password"
              placeholder="Επανάληψη Κωδικού Πρόσβασης"
              className="border-none  w-[90%] shadow-xl drop-shadow-2xl"
            />

            <div className="grid grid-cols-4  items-center justify-items-center">
              <div className="font-normal justify-self-start text-base ">
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
              className="font-bold text-white text-15 bg-myBlue-200 rounded-[0.56rem] px-[3em] py-[.5em] mt-[3em] cursor-pointer lg:text-25"
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
