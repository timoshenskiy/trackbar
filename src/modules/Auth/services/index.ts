import { combineReducers } from "@reduxjs/toolkit";

import authService from "./auth";

const auth = combineReducers({
  authService,
});

export default auth;
