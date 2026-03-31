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
      className="text-yellow-500 text-sm font-semibold hover:text-yellow-800 transition-colors duration-150"
    >
      {router.locale === 'el' ? 'Change to english' : 'Αλλαγή σε ελληνικά'}
    </button>
  );
}
