import { NextPage } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import Footer from '../../components/Users/Footer';
import photo from '/public/images/myphoto.jpg';
import Navbar from '../../components/Users/Navbar';

const Settings: NextPage = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="container  w-full py-6 md:mx-auto md:grid md:max-w-[1268px] md:grid-cols-2 md:gap-8">
        <section className="mx-auto  max-w-[20em] rounded-[3em]  bg-myBlue-100 pt-[4em] pb-[10em]  shadow-2xl drop-shadow-2xl md:mx-0  md:my-[4em]">
          <div className="grid justify-items-center gap-5">
            <h1 className="font-exo text-2xl font-bold lg:text-3xl">
              Ρυθμίσεις
            </h1>
            <ul className="flex cursor-pointer flex-col gap-4 font-source text-lg font-normal lg:text-2xl">
              <li>
                <Link href="">Προσωπικά στοιχεία</Link>
              </li>
              <li>
                <Link href="">Ιατρικά στοιχεία</Link>
              </li>
              <li>
                <Link href="">Διατροφικές συνήθειες</Link>
              </li>
              <li>
                <Link href="">Ειδοποιήσεις</Link>
              </li>
              <li>
                <Link href="">Πληροφορίες πληρωμής</Link>
              </li>
              <li>
                <Link href="">Πληροφορίες εφαρμογής</Link>
              </li>
            </ul>
          </div>
        </section>

        <section className="hidden md:my-[4em] md:block  md:max-w-[35em]  md:justify-self-end  md:rounded-[3em]  md:bg-myGrey-100 md:px-4 md:shadow-2xl  md:drop-shadow-2xl">
          <div className="grid grid-cols-2 grid-rows-2 items-center justify-items-center py-5">
            <Image
              src={photo}
              alt={'profile picture'}
              className="md:row-span-2 md:max-h-[5em] md:max-w-[5em] md:rounded-full md:border-4  md:border-white md:object-cover md:object-top lg:max-h-[7em] lg:max-w-[7em] "
              priority
            ></Image>
            <h1 className="justify-self-start font-exo text-lg font-bold lg:text-xl">
              Προσωπικά στοιχεία
            </h1>
            <p className="max-w-[80%] justify-self-start font-source text-sm font-normal lg:text-base">
              Ανανέωσε την εικόνα προφίλ σου και τα προσωπικά σου στοιχεία
            </p>
          </div>
          <form className="grid grid-flow-row justify-center  gap-3 text-lg">
            <span className="grid grid-cols-2  items-center">
              <label htmlFor="">Όνομα χρήστη</label>
              <input type="text" />
            </span>

            <span className="grid grid-cols-2  items-center">
              <label htmlFor="">Κωδικός</label>
              <input type="text" />
            </span>

            <span className="grid grid-cols-2  items-center">
              <label htmlFor="">Νέος κωδικός</label>
              <input type="text" />
            </span>

            <span className="grid grid-cols-2  items-center">
              <label htmlFor="">Επανάληψη νέου κωδικού</label>
              <input type="password" />
            </span>

            <span className="grid grid-cols-2  items-center">
              <label htmlFor="">Email</label>
              <input type="email" />
            </span>

            <button
              type="submit"
              className="mt-[.75em] mb-4 w-[40%] justify-self-center rounded-[5px] bg-myBlue-100 py-[.5em]"
            >
              Αποθήκευση
            </button>
          </form>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Settings;
