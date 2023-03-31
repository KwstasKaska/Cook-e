import { NextPage } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import Footer from '../../components/Footer';
import Navbar from '../../components/Navbar';
import photo from '/public/images/myphoto.jpg';

const Settings: NextPage = () => {
  return (
    <div className="md:flex md:min-h-screen md:flex-col">
      <Navbar />

      <main className="py-6 md:mx-auto md:grid md:w-full md:max-w-[1268px] md:grid-cols-2 md:gap-8 md:px-[6em]">
        <section className="mx-auto  max-w-[18em] rounded-[3em]  bg-myBlue-100 pt-[4em] pb-[10em]  shadow-2xl drop-shadow-2xl md:mx-0  md:my-[4em]">
          <div className="grid justify-items-center gap-5">
            <h1 className="font-exo text-25 font-bold">Ρυθμίσεις</h1>
            <ul className="flex cursor-pointer flex-col gap-4 font-source text-19 font-normal ">
              <li>
                <Link href="">Προσωπικά Στοιχεία</Link>
              </li>
              <li>
                <Link href="">Ιατρικά Στοιχεία</Link>
              </li>
              <li>
                <Link href="">Διατροφικές Συνήθειες</Link>
              </li>
              <li>
                <Link href="">Ειδοποιήσεις</Link>
              </li>
              <li>
                <Link href="">Πληροφορίες Πληρωμής</Link>
              </li>
              <li>
                <Link href="">Πληροφορίες Εφαρμογής</Link>
              </li>
            </ul>
          </div>
        </section>

        <section className="hidden md:my-[4em]  md:block  md:max-w-[35em]  md:justify-self-end  md:rounded-[3em] md:bg-myGrey-100 md:shadow-2xl  md:drop-shadow-2xl">
          <div className="grid grid-cols-2 grid-rows-2 items-center justify-items-center py-5">
            <Image
              src={photo}
              alt={'profile picture'}
              className="md:row-span-2 md:max-h-[7em] md:max-w-[7.5em] md:rounded-full md:border-4  md:border-white md:object-cover md:object-top "
            ></Image>
            <h1 className="justify-self-start font-exo text-20 font-bold">
              Προσωπικά στοιχεία
            </h1>
            <p className="max-w-[80%] justify-self-start font-source text-15 font-normal ">
              Ανανεώστε την εικόνα προφίλ σας και τα προσωπικά σας στοιχεία
            </p>
          </div>
          <form className="grid grid-flow-row justify-center  gap-3 text-19">
            <span className="grid grid-cols-2  items-center">
              <label htmlFor="">Όνομα Χρήστη</label>
              <input type="text" />
            </span>

            <span className="grid grid-cols-2  items-center">
              <label htmlFor="">Κωδικός</label>
              <input type="text" />
            </span>

            <span className="grid grid-cols-2  items-center">
              <label htmlFor="">Νέος Κωδικός</label>
              <input type="text" />
            </span>

            <span className="grid grid-cols-2  items-center">
              <label htmlFor="">Επανάληψη Νέου Κωδικού</label>
              <input type="password" />
            </span>

            <span className="grid grid-cols-2  items-center">
              <label htmlFor="">Email</label>
              <input type="email" />
            </span>

            <button
              type="submit"
              className="mt-[.75em] w-[40%] justify-self-center rounded-[5px] bg-myBlue-100 py-[.5em]"
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
