import { useRouter } from 'next/router';

interface Props {
  dark?: boolean;
}

const LanguageSwitcher = ({ dark = false }: Props) => {
  const router = useRouter();

  const switchTo = (locale: string) => {
    router.push(router.pathname, router.asPath, { locale });
  };

  const activeClass = dark
    ? 'font-bold text-myText-base border-b border-myText-base'
    : 'font-bold text-white border-b border-white';

  const inactiveClass = dark
    ? 'text-myText-muted hover:text-myText-base transition-colors duration-150'
    : 'text-white/60 hover:text-white transition-colors duration-150';

  return (
    <div className="flex items-center gap-1 text-sm">
      <button
        onClick={() => switchTo('en')}
        className={router.locale === 'en' ? activeClass : inactiveClass}
      >
        EN
      </button>
      <span className={dark ? 'text-myText-muted' : 'text-white/40'}>|</span>
      <button
        onClick={() => switchTo('el')}
        className={router.locale === 'el' ? activeClass : inactiveClass}
      >
        ΕΛ
      </button>
    </div>
  );
};

export default LanguageSwitcher;
