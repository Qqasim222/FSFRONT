// authSlice.js
import { createSlice } from "@reduxjs/toolkit";

interface AuthSliceTypes {
  user: null;
}
const initialState: AuthSliceTypes = {
  user: null,
};

const authSlice = createSlice({
  name: "authSlice",
  initialState,
  reducers: {
    saveUserData: (state: any, action: any) => {
      return {
        ...state,
        user: action.payload,
      };
    },
  },
});

export const { saveUserData } = authSlice.actions;

export default authSlice.reducer;
export const selectSessionInfo = (state: any) => state?.auth?.user;
