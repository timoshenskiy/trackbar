import { AppThunk } from "@/services/store";

import { apiGetAccessToken, apiGetLatestGames, apiGetUpcomingGames } from "./api";
import { gameInfoActions } from "./index";

export const getAccessToken = (): AppThunk => async (dispatch: any) => {
  try {
    dispatch(gameInfoActions.getAccessTokenRequest());

    const access_token = await apiGetAccessToken();

    dispatch(gameInfoActions.getAccessTokenSuccess(access_token));
  } catch (error) {
    dispatch(gameInfoActions.getAccessTokenError(error));
    console.error(error);
  }
};

export const getLastReleasedGames = (accessToken: string): AppThunk => async (dispatch: any) => {
  try {
    dispatch(gameInfoActions.getLastReleasedGamesRequest());

    const data = await apiGetLatestGames(accessToken);

    dispatch(gameInfoActions.getLastReleasedGamesSuccess(data));
  } catch (error) {
    dispatch(gameInfoActions.getLastReleasedGamesError(error));
    console.error(error);
  }
};

export const getUpcomingGames = (accessToken: string): AppThunk => async (dispatch: any) => {
  try {
    dispatch(gameInfoActions.getUpcomingGamesRequest());

    const data = await apiGetUpcomingGames(accessToken);

    dispatch(gameInfoActions.getUpcomingGamesSuccess(data));
  } catch (error) {
    dispatch(gameInfoActions.getUpcomingGamesError(error));
    console.error(error);
  }
};
