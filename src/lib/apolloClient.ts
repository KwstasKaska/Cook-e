import { useMemo } from 'react';
import {
  ApolloClient,
  InMemoryCache,
  from,
  NormalizedCacheObject,
  ApolloLink,
} from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import merge from 'deepmerge';
import isEqual from 'lodash/isEqual';
import { AppProps } from 'next/app';
import { IncomingHttpHeaders } from 'http';
import { toast } from 'sonner';
export const APOLLO_STATE_PROP_NAME = '__APOLLO_STATE__';
import createUploadLink from 'apollo-upload-client/createUploadLink.mjs';

let apolloClient: ApolloClient<NormalizedCacheObject> | null = null;

const appendPaginatedField = (): {
  keyArgs: false;
  merge(existing: any[] | undefined, incoming: any[], options: any): any[];
} => ({
  keyArgs: false,
  merge(existing = [], incoming, { args }) {
    if (!args || !args.offset || args.offset === 0) {
      return incoming;
    }
    const existingRefs = new Set(existing.map((e: any) => e.__ref));
    const newItems = incoming.filter((i: any) => !existingRefs.has(i.__ref));
    return [...existing, ...newItems];
  },
});

const replaceField = (
  keyArgs: string[] = [],
): {
  keyArgs: string[];
  merge(_existing: any, incoming: any): any;
} => ({
  keyArgs,
  merge(_existing, incoming) {
    return incoming;
  },
});

const appendPaginatedFieldKeyed = (
  keyArgs: string[],
): {
  keyArgs: string[];
  merge(existing: any[] | undefined, incoming: any[], options: any): any[];
} => ({
  keyArgs,
  merge(existing = [], incoming, { args }) {
    if (!args || !args.offset || args.offset === 0) {
      return incoming;
    }
    const existingRefs = new Set(existing.map((e: any) => e.__ref));
    const newItems = incoming.filter((i: any) => !existingRefs.has(i.__ref));
    return [...existing, ...newItems];
  },
});

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message }) => {
      toast.error(message);
    });
  }
  if (networkError) {
    toast.error('Πρόβλημα δικτύου');
  }
});

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

  const httpLink = createUploadLink({
    uri: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/graphql',
    credentials: 'include',
    fetch: enhancedFetch as any,
    headers: { 'Apollo-Require-Preflight': 'true' },
  });

  return new ApolloClient({
    ssrMode: typeof window === 'undefined',
    link: from([errorLink, httpLink as unknown as ApolloLink]),
    cache: new InMemoryCache({
      typePolicies: {
        Query: {
          fields: {
            myRecipes: replaceField(['limit', 'offset']),
            recipes: replaceField(['limit', 'offset']),
            recipesByChef: replaceField(['chefId', 'limit', 'offset']),
            myRecipesByCategory: replaceField(['category', 'limit', 'offset']),
            recipesByCategory: replaceField(['category', 'limit', 'offset']),
            myFavorites: replaceField(['limit', 'offset']),
            myArticles: replaceField(['limit', 'offset']),
            articlesByNutritionist: replaceField([
              'nutritionistId',
              'limit',
              'offset',
            ]),
            articlesByChef: replaceField(['chefId', 'limit', 'offset']),
            chefRatings: appendPaginatedFieldKeyed(['chefId']),
            recipeRatings: appendPaginatedFieldKeyed(['recipeId']),
            nutritionists: appendPaginatedField(),
            myConversations: replaceField(['limit', 'offset']),
            getMyAppointments: replaceField(['limit', 'offset']),
            getAppointmentRequestsForNutritionist: replaceField([
              'limit',
              'offset',
            ]),
            getNutritionistMealPlans: replaceField([
              'userId',
              'limit',
              'offset',
            ]),
            myCart: replaceField([]),
          },
        },
      },
    }),
  });
};

interface IInitializeApollo {
  initialState?: NormalizedCacheObject | null;
  headers?: IncomingHttpHeaders | null;
}

export const initializeApollo = ({
  initialState = null,
  headers = null,
}: IInitializeApollo = {}) => {
  const _apolloClient = apolloClient ?? createApolloClient(headers);

  if (initialState) {
    const existingCache = _apolloClient.extract();

    const data = merge(initialState, existingCache, {
      arrayMerge: (destinationArray, sourceArray) => [
        ...sourceArray,
        ...destinationArray.filter((d) =>
          sourceArray.every((s) => !isEqual(d, s)),
        ),
      ],
    });

    _apolloClient.cache.restore(data);
  }

  if (typeof window === 'undefined') return _apolloClient;
  if (!apolloClient) apolloClient = _apolloClient;

  return _apolloClient;
};

export const addApolloState = (
  client: ApolloClient<NormalizedCacheObject>,
  pageProps: AppProps['pageProps'],
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
    [state],
  );
  return store;
}
