import '../../styles/globals.css';
import '../../styles/calendarC.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import type { AppProps } from 'next/app';
import HeadComponent from '../components/Head';
import { ApolloProvider } from '@apollo/client';
import { useApollo } from '../lib/apolloClient';
import { appWithTranslation } from 'next-i18next';

function MyApp({ Component, pageProps }: AppProps) {
  const apolloClient = useApollo(pageProps);

  return (
    <ApolloProvider client={apolloClient}>
      <HeadComponent title="Cook-e" />
      <Component {...pageProps} />
    </ApolloProvider>
  );
}

export default appWithTranslation(MyApp);
