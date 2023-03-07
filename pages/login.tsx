import Image from 'next/image';
import { NextPage } from 'next';
import chef from '/public/images/chef.png';
import logo from '/public/images/5.png';
import Link from 'next/link';

const Login: NextPage = ({}) => {
  return (
    // Εδώ βρίσκεται το section με τις δύο εικόνες, δηλαδή το αριστερό section.

    <main className="h-screen flex items-center  justify-center bg-myBeige-100 text-white md:block">
      <div className="md:grid md:grid-cols-2  md:h-screen">
        <section className="hidden md:block  md:bg-myBeige-100   md:min-h-full   md:relative">
          <div className="md:grid md:grid-flow-row justify-center  rounded-l-[3.125rem] border-[5px] border-myBlue-200 bg-myBeige-100 md:absolute md:right-0   md:max-w-[600px] md:w-full md:top-[10%] ">
            <Image
              src={logo}
              alt={'logo image'}
              height="76"
              width="198"
              className=""
            ></Image>
            <Image
              src={chef}
              alt={'chef image'}
              width="342"
              height="490"
              className="md:rounded-[3.125rem]"
            ></Image>
          </div>
        </section>

        {/* Εδώ βρίσκεται το section με την φόρμα εισαγωγής στοιχείων και τα κέιμενα, δηλαδή το δεξιά section. */}

        <section className=" md:bg-myBlue-100   md:relative">
          <div className="relative grid grid-flow-row  max-w-[350px]  justify-items-center gap-[1.5em] rounded-[1.5625em] bg-myBlue-200 md:rounded-r-[3.125rem] md:rounded-l-[0px]  md:absolute md:left-0   md:max-w-[600px] md:w-full md:py-[2.2em]  lg:py-[.8em] md:top-[10%]">
            <Image
              src={logo}
              alt={'logo image'}
              height="54"
              width="143"
              className="md:hidden justify-self-start absolute"
            ></Image>
            <h1 className="font-vol font-bold text-25 mt-[2.5em] md:mt-[1.5em] md:text-[2rem] lg:text-40">
              Καλωσήρθες πίσω!
            </h1>

            <span className="font-source font-normal lg:text-20 -mt-[2em] text-15  md:text-20">
              Έτοιμος για μαγειρική;
            </span>
            <form className="grid grid-flow-row justify-items-center gap-[.8em]">
              <span className="font-vol font-bold text-25 md:text-[2rem] lg:text-40 mb-[.25em]">
                Είσοδος
              </span>
              <input
                type="email"
                className="rounded-[0.5rem] placeholder:italic  placeholder:text-myBlue-200 placeholder:text-15 lg:placeholder:text-20 text-black w-[17em] mx-[1em] "
                placeholder="Διεύθυνση Email"
              />

              <input
                type="password"
                className="rounded-[0.5rem] w-[17em] placeholder:italic  placeholder:text-myBlue-200 text-black placeholder:text-15 lg:placeholder:text-20"
                placeholder="Κωδικός Πρόσβασης"
              />

              <button
                className="font-vol  font-normal text-15 lg:text-20 py-1 bg-myRed rounded-[.5rem]  w-[14em]"
                type="submit"
              >
                Είσοδος
              </button>
              <Link
                className="font-source font-normal text-15 justify-self-center underline md:text-20 lg:text-20"
                href="#"
              >
                Ξεχάσατε τον κωδικό;
              </Link>
            </form>

            <p className="font-source  text-15 md:text-20 lg:text-20 mt-[2em] ">
              Δεν έχεις ακόμα λογαριασμό;
              <Link
                className="block font-source font-bold text-center text-xl lg:text-25 md:text-[1.8rem] underline"
                href="#"
              >
                Δημιούργησε έναν
              </Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Login;
