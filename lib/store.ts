import { configureStore } from "@reduxjs/toolkit";
import { createWrapper } from "next-redux-wrapper";
import { traceApi } from "./traceApi";

export const makeStore = () =>
  configureStore({
    reducer: {
      [traceApi.reducerPath]: traceApi.reducer,
    },
    middleware: (gDM) => gDM().concat(traceApi.middleware),
  });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];

export const wrapper = createWrapper<AppStore>(makeStore, { debug: true });
