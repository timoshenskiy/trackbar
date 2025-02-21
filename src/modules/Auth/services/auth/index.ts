import { createSlice } from "@reduxjs/toolkit";

import { AppState } from "@/services/store";

interface AuthState {
  data: unknown;
  loading: unknown;
  error: unknown;
}

const initialState: AuthState = {
  data: null,
  loading: false,
  error: null,
};

const slice = createSlice({
  name: "auth/info",
  initialState,
  reducers: {
    getAuthRequest: (state) => ({
      ...state,
      loading: true,
      error: null,
    }),
    getAuthSuccess: (state, action) => ({
      ...state,
      loading: false,
      data: action.payload,
    }),
    getAuthError: (state, action) => ({
      ...state,
      loading: false,
      error: action.payload,
    }),
  },
});

export const { actions: authActions } = slice;

export const authSelector = (state: AppState) =>
  state.auth.authService;

export default slice.reducer;
