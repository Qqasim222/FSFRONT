import { createSlice } from "@reduxjs/toolkit";

const collectionSlice = createSlice({
  name: "collection",
  initialState: null,
  reducers: {
    setSingleCollection: (state, action) => action.payload,
  },
});

export const { setSingleCollection } = collectionSlice.actions;

export default collectionSlice.reducer;
