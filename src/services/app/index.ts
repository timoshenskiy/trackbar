// eslint-disable-next-line import/no-extraneous-dependencies
import { createSlice } from "@reduxjs/toolkit";
import { AppState } from "../store";

const initialState: any = {};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    resetState: () => ({
      ...initialState,
    }),
  },
});

export const { resetState } = appSlice.actions;
export const appSelector = (state: AppState) => state.appService;
export default appSlice.reducer;
