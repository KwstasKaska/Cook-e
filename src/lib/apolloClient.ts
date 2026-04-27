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
// Resets when offset is 0 (fresh navigation), deduplicates by __ref.
const appendPaginatedField = (): {
  keyArgs: false;
  merge(existing: any[] | undefined, incoming: any[], options: any): any[];
} => ({
  keyArgs: false,
  merge(existing = [], incoming, { args }) {
    // Fresh fetch (offset 0 or no args) — reset instead of append
    if (!args || !args.offset || args.offset === 0) {
      return incoming;
    }
    // Load more — append, deduplicate by __ref
    const existingRefs = new Set(existing.map((e: any) => e.__ref));
    const newItems = incoming.filter((i: any) => !existingRefs.has(i.__ref));
    return [...existing, ...newItems];
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
    uri: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/graphql',
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
            // ── Recipes ───────────────────────────────────────────────
            // append: load more accumulates results
            myRecipes: appendPaginatedField(),
            recipes: replaceField(['limit', 'offset']),
            recipesByChef: appendPaginatedField(),
            // replace: filter/category change resets the list
            myRecipesByCategory: replaceField(['category', 'limit', 'offset']),
            recipesByCategory: replaceField(['category', 'limit', 'offset']),

            // ── Favorites ─────────────────────────────────────────────
            myFavorites: appendPaginatedField(),

            // ── Articles ──────────────────────────────────────────────
            myArticles: replaceField(['limit', 'offset']),
            articles: appendPaginatedField(),
            chefArticles: appendPaginatedField(),
            articlesByNutritionist: appendPaginatedField(),
            articlesByChef: appendPaginatedField(),

            // ── Ratings ───────────────────────────────────────────────
            chefRatings: appendPaginatedField(),
            recipeRatings: appendPaginatedField(),

            // ── Cooked recipes ────────────────────────────────────────
            myCookedRecipes: appendPaginatedField(),

            // ── Directory lists ───────────────────────────────────────
            chefs: appendPaginatedField(),
            nutritionists: appendPaginatedField(),

            // ── Messaging ─────────────────────────────────────────────
            // replace: inbox always shows current state
            myConversations: replaceField(['limit', 'offset']),

            // ── Appointments ──────────────────────────────────────────
            // replace: date-filtered, always show current state
            getMyAppointments: replaceField(['limit', 'offset']),
            getAppointmentRequestsForNutritionist: replaceField([
              'limit',
              'offset',
            ]),

            // ── Meal plans ────────────────────────────────────────────
            // replace: user-filtered
            getNutritionistMealPlans: replaceField([
              'userId',
              'limit',
              'offset',
            ]),

            // ── Cart ──────────────────────────────────────────────────
            // replace: single fetch, always current state
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
