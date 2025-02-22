import { AppThunk } from "@/services/store";

import { apiGetAuth } from "./api";
import { authActions } from "./index";
import { AuthInterface } from "./interface";

export const getAuth =
  (lat: string, lon: string): AppThunk =>
  async (dispatch: any) => {
    try {
      dispatch(authActions.getAuthRequest());

      const { data }: AuthInterface | any = await apiGetAuth(
        lat,
        lon
      );

      dispatch(authActions.getAuthSuccess(data));
    } catch (error) {
      dispatch(authActions.getAuthError(error));
      console.error(error);
    }
  };
