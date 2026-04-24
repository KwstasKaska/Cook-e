import { useMemo } from 'react';
import {
  ApolloClient,
  InMemoryCache,
  from,
  NormalizedCacheObject,
  ApolloLink,
} from '@apollo/client';
import merge from 'deepmerge';
import isEqual from 'lodash/isEqual';
import { AppProps } from 'next/app';
import { IncomingHttpHeaders } from 'http';
export const APOLLO_STATE_PROP_NAME = '__APOLLO_STATE__';
import createUploadLink from 'apollo-upload-client/createUploadLink.mjs';

let apolloClient: ApolloClient<NormalizedCacheObject> | null = null;

// For true "load more" / infinite scroll — appends incoming pages to existing.
const appendPaginatedField = (): {
  keyArgs: false;
  merge(existing: any[] | undefined, incoming: any[]): any[];
} => ({
  keyArgs: false,
  merge(existing = [], incoming) {
    return [...existing, ...incoming];
  },
});

// For filtered / re-fetchable lists — always replaces, never appends.
// keyArgs includes all variables so each unique combination gets its own slot.
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
    uri: 'http://localhost:4000/graphql',
    credentials: 'include',
    fetch: enhancedFetch as any,
    headers: { 'Apollo-Require-Preflight': 'true' },
  });

  return new ApolloClient({
    ssrMode: typeof window === 'undefined',
    link: from([httpLink as unknown as ApolloLink]),
    cache: new InMemoryCache({
      typePolicies: {
        Query: {
          fields: {
            // ── Recipes (filtered — replace) ──────────────────────────
            myRecipes: replaceField(['limit', 'offset']),
            myRecipesByCategory: replaceField(['category', 'limit', 'offset']),
            recipes: replaceField(['limit', 'offset']),
            recipesByCategory: replaceField(['category', 'limit', 'offset']),

            // ── Favorites (filtered — replace) ────────────────────────
            myFavorites: replaceField(['limit', 'offset']),

            // ── Articles (filtered — replace) ─────────────────────────
            myArticles: replaceField(['limit', 'offset']),
            articles: replaceField(['limit', 'offset']),
            chefArticles: replaceField(['limit', 'offset']),
            articlesByNutritionist: replaceField([
              'nutritionistId',
              'limit',
              'offset',
            ]),
            articlesByChef: replaceField(['chefId', 'limit', 'offset']),

            // ── Ratings (per-entity — replace) ────────────────────────
            chefRatings: replaceField(['chefId', 'limit', 'offset']),
            recipeRatings: replaceField(['recipeId', 'limit', 'offset']),

            // ── Cooked recipes (append — grows over time) ─────────────
            myCookedRecipes: appendPaginatedField(),

            // ── Messaging (append — load older messages) ──────────────
            // ── Messaging (replace — inbox always shows current state) ──────────────
            myConversations: replaceField(['limit', 'offset']),

            // ── Appointments (date-filtered — replace) ────────────────
            getMyAppointments: replaceField(['limit', 'offset']),
            getAppointmentRequestsForNutritionist: replaceField([
              'limit',
              'offset',
            ]),

            // ── Meal plans (filtered — replace) ───────────────────────
            getNutritionistMealPlans: replaceField([
              'userId',
              'limit',
              'offset',
            ]),

            // ── Directory lists (search/filter — replace) ─────────────
            chefs: replaceField(['limit', 'offset']),
            nutritionists: replaceField(['limit', 'offset']),

            // ── Cart (single fetch — replace) ─────────────────────────
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
