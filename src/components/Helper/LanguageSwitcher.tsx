import { useRouter } from 'next/router';

interface Props {
  dark?: boolean;
}

export default function LanguageSwitcher({ dark = false }: Props) {
  const router = useRouter();

  const toggleLanguage = () => {
    router.push(router.pathname, router.asPath, {
      locale: router.locale === 'el' ? 'en' : 'el',
    });
  };

  return (
    <button
      onClick={toggleLanguage}
      className={`rounded-full border px-[1.2em] py-[0.25em] text-sm font-bold transition hover:bg-myBlue-200 hover:text-white hover:border-myBlue-200 ${
        dark ? 'border-myGrey-200 text-myGrey-200' : 'border-white text-white'
      }`}
    >
      {router.locale === 'el' ? 'EN' : 'ΕΛ'}
    </button>
  );
}
