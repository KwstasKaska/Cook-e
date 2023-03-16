import '../styles/globals.css';
import '../styles/calendarC.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import type { AppProps } from 'next/app';
import HeadComponent from '../components/Head';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <HeadComponent title="Cook-e" />
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
