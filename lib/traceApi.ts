import { PixelModifyItem } from "@/../dotting/build/src";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { HYDRATE } from "next-redux-wrapper";

// https://redux-toolkit.js.org/rtk-query/usage/mutations
export const traceApi = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: "https://pokeapi.co/api/v2/",
  }),
  extractRehydrationInfo(action, { reducerPath }) {
    if (action.type === HYDRATE) {
      return action.payload[reducerPath];
    }
  },
  tagTypes: [],
  endpoints: (builder) => ({
    postStroke: builder.mutation<{}, { stroke: Array<PixelModifyItem> }>({
      query: (body) => ({
        url: "/api/stroke",
        method: "POST",
        body,
      }),
      // Pick out data and prevent nested properties in a hook or selector
      transformResponse: (response: { data: string }, meta, arg) =>
        response.data,
      // Pick out errors and prevent nested properties in a hook or selector
      transformErrorResponse: (
        response: { status: string | number },
        meta,
        arg
      ) => response.status,
      // onQueryStarted is useful for optimistic updates
      // The 2nd parameter is the destructured `MutationLifecycleApi`
      async onQueryStarted(
        arg,
        { dispatch, getState, queryFulfilled, requestId, extra, getCacheEntry }
      ) {},
      // The 2nd parameter is the destructured `MutationCacheLifecycleApi`
      async onCacheEntryAdded(
        arg,
        {
          dispatch,
          getState,
          extra,
          requestId,
          cacheEntryRemoved,
          cacheDataLoaded,
          getCacheEntry,
        }
      ) {},
    }),
  }),
});

// Export hooks for usage in functional components
export const {
  // useGetPokemonByNameQuery,
  // useGetPokemonListQuery,
  usePostStrokeMutation,
  util: { getRunningQueriesThunk },
} = traceApi;

// export endpoints for use in SSR
export const {} = traceApi.endpoints;
