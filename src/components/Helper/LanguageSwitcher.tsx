// components/LanguageSwitcher.tsx
import { useRouter } from 'next/router';

export default function LanguageSwitcher() {
  const router = useRouter();

  const toggleLanguage = () => {
    router.push(router.pathname, router.asPath, {
      locale: router.locale === 'el' ? 'en' : 'el', //αν είναι ελληνικά δώσμου αγγλικά, αλλιώς δώσμου ελληνικά
    });
  };

  return (
    <button
      onClick={toggleLanguage}
      className="rounded-full border-[1px] border-white px-[1.2em] py-[0.25em] text-sm font-bold text-white hover:bg-myRed md:text-base xl:text-2xl"
    >
      {router.locale === 'el' ? 'English' : 'Ελληνικά'}
    </button>
  );
}
