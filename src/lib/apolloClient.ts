import { useMemo } from 'react';
import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  from,
  NormalizedCacheObject,
} from '@apollo/client';
import merge from 'deepmerge';
import isEqual from 'lodash/isEqual';
import { AppProps } from 'next/app';
import { IncomingHttpHeaders } from 'http';

export const APOLLO_STATE_PROP_NAME = '__APOLLO_STATE__';

let apolloClient: ApolloClient<NormalizedCacheObject> | null = null;

const createApolloClient = (headers: IncomingHttpHeaders | null = null) => {
  const enhancedFetch = (url: RequestInfo, init: RequestInit) => {
    return fetch(url, {
      ...init,
      headers: {
        ...init.headers,
        'Access-Control-Allow-Origin': '*',
        Cookie: headers?.cookie ?? '',
      },
    }).then((response) => response);
  };

  const httpLink = new HttpLink({
    uri: 'http://localhost:4000/graphql',
    credentials: 'include',
    fetch: enhancedFetch,
  });

  return new ApolloClient({
    ssrMode: typeof window === 'undefined',
    link: from([httpLink]),
    cache: new InMemoryCache({
      typePolicies: {
        Query: {
          fields: {
            // posts: {
            //   // Don't cache separate results based on
            //   // any of this field's arguments.
            //   keyArgs: false,
            //   // Concatenate the incoming list items with
            //   // the existing list items.
            //   merge(
            //     existing: PaginatedPosts | undefined,
            //     incoming: PaginatedPosts
            //   ): PaginatedPosts {
            //     console.log(existing, incoming);
            //     return {
            //       ...incoming,
            //       posts: [...(existing?.posts || []), ...incoming?.posts],
            //     };
            //   },
            // },
          },
        },
      },
    }),
  });
};

// type InitialState = NormalizedCacheObject | undefined;

interface IInitializeApollo {
  initialState?: NormalizedCacheObject | null;
  headers?: IncomingHttpHeaders | null;
}

export const initializeApollo = ({
  initialState = null,
  headers = null,
}: IInitializeApollo = {}) => {
  const _apolloClient = apolloClient ?? createApolloClient(headers);

  // If your page has Next.js data fetching methods that use Apollo Client, the initial state
  // get hydrated here
  if (initialState) {
    // Get existing cache, loaded during client side data fetching
    const existingCache = _apolloClient.extract();

    // Merge the existing cache into data passed from getStaticProps/getServerSideProps
    const data = merge(initialState, existingCache, {
      // combine arrays using object equality (like in sets)
      arrayMerge: (destinationArray, sourceArray) => [
        ...sourceArray,
        ...destinationArray.filter((d) =>
          sourceArray.every((s) => !isEqual(d, s))
        ),
      ],
    });

    // Restore the cache with the merged data
    _apolloClient.cache.restore(data);
  }

  // For SSG and SSR always create a new Apollo Client
  if (typeof window === 'undefined') return _apolloClient;
  // Create the Apollo Client once in the client
  if (!apolloClient) apolloClient = _apolloClient;

  return _apolloClient;
};

export const addApolloState = (
  client: ApolloClient<NormalizedCacheObject>,
  pageProps: AppProps['pageProps']
) => {
  if (pageProps?.props) {
    pageProps.props[APOLLO_STATE_PROP_NAME] = client.cache.extract();
  }

  return pageProps;
};

export function useApollo(pageProps: AppProps['pageProps']) {
  const state = pageProps[APOLLO_STATE_PROP_NAME];
  const store = useMemo(
    () => initializeApollo({ initialState: state }),
    [state]
  );
  return store;
}
