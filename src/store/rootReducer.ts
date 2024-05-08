/*
 * combines all th existing reducers
 */
import { combineReducers } from "@reduxjs/toolkit";
import themeSlice from "./slices/themeSlice";
import authSlice from "./slices/authSlice";
import collectionSlice from "./slices/collectionSlice";

const reducers = {
  theme: themeSlice,
  auth: authSlice,
  collection: collectionSlice,
};

// Exports

const rootReducer = combineReducers(reducers);
export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
