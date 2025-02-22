import { combineReducers } from "@reduxjs/toolkit";

import info from "./info";

const game = combineReducers({
  info,
});

export default game;
