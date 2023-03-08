import '../styles/globals.css';
import '../styles/calendarC.css';
import type { AppProps } from 'next/app';
import HeadComponent from '../components/Head';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <HeadComponent />
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
