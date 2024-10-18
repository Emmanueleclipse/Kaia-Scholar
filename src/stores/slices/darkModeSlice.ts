import { createSlice } from "@reduxjs/toolkit";

interface InitialState {
  isDarkMode: boolean;
}

const initialState: InitialState = {
  isDarkMode: false,
};

const darkModeSlice = createSlice({
  name: "darkMode",
  initialState,
  reducers: {
    toggleDarkMode: (state) => {
      state.isDarkMode = !state.isDarkMode;
    },
  },
  extraReducers: (builder) => {},
});

export const {toggleDarkMode} = darkModeSlice.actions;
export default darkModeSlice.reducer;
