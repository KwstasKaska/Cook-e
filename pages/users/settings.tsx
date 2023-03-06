import { NextPage } from 'next';
import Image from 'next/image';
import Footer from '../../components/Footer';
import Navbar from '../../components/Navbar';
import photo from '/public/images/myphoto.jpg';

const Settings: NextPage = () => {
  return (
    <div className="md:min-h-screen md:flex md:flex-col">
      <Navbar />

      <main className="md:max-w-[1268px] md:w-full md:mx-auto md:px-[6em] md:grid md:grid-cols-2 md:gap-8">
        <section className="bg-myBlue-100 rounded-[3em]  shadow-2xl drop-shadow-2xl  pt-[4em] pb-[10em] max-w-[18em]  mx-auto md:mx-0 mt-[2em]  md:my-[4em]">
          <div className="grid justify-items-center gap-5">
            <h1 className="font-exo font-bold text-25">Ρυθμίσεις</h1>
            <ul className="font-source font-normal text-19 flex flex-col cursor-pointer gap-4 ">
              <li>
                <a href="">Προσωπικά Στοιχεία</a>
              </li>
              <li>
                <a href="">Ιατρικά Στοιχεία</a>
              </li>
              <li>
                <a href="">Διατροφικές Συνήθειες</a>
              </li>
              <li>
                <a href="">Ειδοποιήσεις</a>
              </li>
              <li>
                <a href="">Πληροφορίες Πληρωμής</a>
              </li>
              <li>
                <a href="">Πληροφορίες Εφαρμογής</a>
              </li>
            </ul>
          </div>
        </section>

        <section className="hidden md:block  md:bg-myGrey-100  md:rounded-[3em]  md:max-w-[35em]  md:shadow-2xl md:drop-shadow-2xl md:justify-self-end  md:my-[4em]">
          <div className="grid grid-cols-2 grid-rows-2 justify-items-center items-center py-5">
            <Image
              src={photo}
              alt={'profile picture'}
              className="md:rounded-full md:border-4 md:border-white md:max-w-[7.5em] md:max-h-[7em]  md:object-cover md:object-top md:row-span-2 "
            ></Image>
            <h1 className="font-exo font-bold text-20 justify-self-start">
              Προσωπικά στοιχεία
            </h1>
            <p className="font-source font-normal text-15 justify-self-start max-w-[80%] ">
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
              className="rounded-[5px] bg-myBlue-100 mt-[.75em] py-[.5em] w-[40%] justify-self-center"
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
