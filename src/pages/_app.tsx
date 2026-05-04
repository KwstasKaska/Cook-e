import '../../styles/globals.css';
import '../../styles/calendarC.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import type { AppProps } from 'next/app';
import HeadComponent from '../components/Head';
import { ApolloProvider } from '@apollo/client';
import { useApollo } from '../lib/apolloClient';
import { appWithTranslation } from 'next-i18next';
import { useMeQuery } from '../generated/graphql';
import ChatWidget from '../components/Chat/ChatWidget';
import { ChatContextProvider } from '../components/Chat/ChatContext';

function Inner({ Component, pageProps }: AppProps) {
  const { data } = useMeQuery();
  const currentUser = data?.me;

  return (
    <>
      <HeadComponent title="Cook-e" />
      <Component {...pageProps} />
      {currentUser && <ChatWidget currentUserId={Number(currentUser.id)} />}
    </>
  );
}

function MyApp(props: AppProps) {
  const apolloClient = useApollo(props.pageProps);

  return (
    <ApolloProvider client={apolloClient}>
      <ChatContextProvider>
        <Inner {...props} />
      </ChatContextProvider>
    </ApolloProvider>
  );
}

export default appWithTranslation(MyApp);
