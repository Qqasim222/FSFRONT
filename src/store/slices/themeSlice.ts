import { createSlice } from "@reduxjs/toolkit";

// Define a type for the slice state
interface ThemeSliceTypes {
  isDark: boolean;
}

// Define the initial state using that type
const initialState: ThemeSliceTypes = {
  isDark: false,
};

export const themeSlice = createSlice({
  name: "themeSlice",
  initialState,
  reducers: {
    setIsDarkTheme: (state: any, action: any) => {
      return {
        ...state,
        isDark: action.payload,
      };
    },
  },
});

export const { setIsDarkTheme } = themeSlice.actions;
export default themeSlice.reducer;
