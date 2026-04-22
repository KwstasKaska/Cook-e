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
      className="text-white bg-myGrey-200 text-sm font-semibold  transition-colors duration-150 rounded-3xl border-white border-2 p-2 hover:bg-white hover:text-black hover:border-black"
    >
      {router.locale === 'el' ? 'English' : 'Ελληνικά'}
    </button>
  );
}
