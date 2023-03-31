import Image from 'next/image';
import { NextPage } from 'next';
import chef from '/public/images/chef.png';
import logo from '/public/images/5.png';
import Link from 'next/link';

const Login: NextPage = ({}) => {
  return (
    // Εδώ βρίσκεται το section με τις δύο εικόνες, δηλαδή το αριστερό section.

    <main className="flex h-screen items-center justify-center  bg-myBeige-100 text-white md:block">
      <div className="md:grid md:h-screen  md:grid-cols-2">
        <section className="hidden md:relative  md:block   md:min-h-full   md:bg-myBeige-100">
          <div className="justify-center rounded-l-[3.125rem] border-[5px]  border-myBlue-200 bg-myBeige-100 md:absolute md:right-0 md:top-[10%] md:grid   md:w-full md:max-w-[600px] md:grid-flow-row ">
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

        <section className=" md:relative   md:bg-myBlue-100">
          <div className="relative grid max-w-[350px]  grid-flow-row  justify-items-center gap-[1.5em] rounded-[1.5625em] bg-myBlue-200 md:absolute md:left-0  md:top-[10%] md:w-full   md:max-w-[600px] md:rounded-r-[3.125rem] md:rounded-l-[0px]  md:py-[2.2em] lg:py-[.8em]">
            <Image
              src={logo}
              alt={'logo image'}
              height="54"
              width="143"
              className="absolute justify-self-start md:hidden"
            ></Image>
            <h1 className="font-vol mt-[2.5em] text-25 font-bold md:mt-[1.5em] md:text-[2rem] lg:text-40">
              Καλωσήρθες πίσω!
            </h1>

            <span className="-mt-[2em] font-source text-15 font-normal md:text-20  lg:text-20">
              Έτοιμος για μαγειρική;
            </span>
            <form className="grid grid-flow-row justify-items-center gap-[.8em]">
              <span className="font-vol mb-[.25em] text-25 font-bold md:text-[2rem] lg:text-40">
                Είσοδος
              </span>
              <input
                type="email"
                className="mx-[1em] w-[17em]  rounded-[0.5rem] text-black placeholder:text-15 placeholder:italic placeholder:text-myBlue-200 lg:placeholder:text-20 "
                placeholder="Διεύθυνση Email"
              />

              <input
                type="password"
                className="w-[17em] rounded-[0.5rem] text-black  placeholder:text-15 placeholder:italic placeholder:text-myBlue-200 lg:placeholder:text-20"
                placeholder="Κωδικός Πρόσβασης"
              />

              <button
                className="font-vol  w-[14em] rounded-[.5rem] bg-myRed py-1 text-15 font-normal  lg:text-20"
                type="submit"
              >
                Είσοδος
              </button>
              <Link
                className="justify-self-center font-source text-15 font-normal underline md:text-20 lg:text-20"
                href="#"
              >
                Ξεχάσατε τον κωδικό;
              </Link>
            </form>

            <p className="mt-[2em]  font-source text-15 md:text-20 lg:text-20 ">
              Δεν έχεις ακόμα λογαριασμό;
              <Link
                className="block text-center font-source text-xl font-bold underline md:text-[1.8rem] lg:text-25"
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
