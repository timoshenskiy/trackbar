import { createSlice } from "@reduxjs/toolkit";

import { AppState } from "@/services/store";

interface GameInfoState {
  accessToken: {
    data: unknown;
    loading: unknown;
    error: unknown;
  },
  lastReleasedGames: {
    data: unknown;
    loading: unknown;
    error: unknown;
  };
  upcomingGames: {
    data: unknown;
    loading: unknown;
    error: unknown;
  };
}

const initialState: GameInfoState = {
  accessToken: {
    data: null,
    loading: false,
    error: null,
  },
  lastReleasedGames: {
    data: null,
    loading: false,
    error: null,
  },
  upcomingGames: {
    data: null,
    loading: false,
    error: null,
  },
};

const slice = createSlice({
  name: "game/info",
  initialState,
  reducers: {
    getAccessTokenRequest: (state) => ({
      ...state,
      accessToken: {
        ...state.accessToken,
        loading: true,
        error: null,
      },
    }),
    getAccessTokenSuccess: (state, action) => ({
      ...state,
      accessToken: {
        ...state.accessToken,
        loading: false,
        data: action.payload,
      },
    }),
    getAccessTokenError: (state, action) => ({
      ...state,
      accessToken: {
        ...state.accessToken,
        loading: false,
        error: action.payload,
      },
    }),
    getLastReleasedGamesRequest: (state) => ({
      ...state,
      lastReleasedGames: {
        ...state.lastReleasedGames,
        loading: true,
        error: null,
      },
    }),
    getLastReleasedGamesSuccess: (state, action) => ({
      ...state,
      lastReleasedGames: {
        ...state.lastReleasedGames,
        loading: false,
        data: action.payload,
      },
    }),
    getLastReleasedGamesError: (state, action) => ({
      ...state,
      lastReleasedGames: {
        ...state.lastReleasedGames,
        loading: false,
        error: action.payload,
      },
    }),
    getUpcomingGamesRequest: (state) => ({
      ...state,
      upcomingGames: {
        ...state.upcomingGames,
        loading: true,
        error: null,
      },
    }),
    getUpcomingGamesSuccess: (state, action) => ({
      ...state,
      upcomingGames: {
        ...state.upcomingGames,
        loading: false,
        data: action.payload,
      },
    }),
    getUpcomingGamesError: (state, action) => ({
      ...state,
      upcomingGamess: {
        ...state.upcomingGames,
        loading: false,
        error: action.payload,
      },
    }),
  },
});

export const { actions: gameInfoActions } = slice;

export const gameInfoSelector = (state: AppState) => state.game.info;

export default slice.reducer;
