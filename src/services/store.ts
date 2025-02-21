// eslint-disable-next-line import/no-extraneous-dependencies
import { configureStore, Action, ThunkAction } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import axios from "axios";

import rootReducer from "./reducers";
import rootSaga from "./sagas";

// Create axios instance without baseURL
export const axiosInstance = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
});

const makeStore = () => {
  const sagaMiddleware = createSagaMiddleware();

  const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }).concat(sagaMiddleware),
  });

  sagaMiddleware.run(rootSaga);

  return store;
};

type AppStore = ReturnType<typeof makeStore>;

export type AppState = ReturnType<AppStore["getState"]>;

export type AppDispatch = AppStore["dispatch"];

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  AppState,
  unknown,
  Action
>;
export const store = makeStore();
