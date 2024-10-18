/* eslint-disable react-hooks/rules-of-hooks */
import { createAction, createReducer, createSlice } from '@reduxjs/toolkit';

export const setUser = createAction<any>(`user/setUser`);

const userSlice = createReducer({
  token: null,
  email: null,
  username: null,
  name: null,
  address: null,
  designation: null,
  scholarUrl: null,
  isDemo: false,
  metamaskAddress: null,
},
  {
    [setUser.toString()]: (state, action) => {
      state.token = action.payload.token;
      state.email = action.payload.email;
      state.username = action.payload.username;
      state.name = action.payload.name;
      state.address = action.payload.address;
      state.designation = action.payload.designation;
      state.scholarUrl = action.payload.scholarUrl;
      state.isDemo= action.payload.isDemo ?? false;
      state.metamaskAddress = action.payload.metamaskAddress ?? null;
    }
  });

export default userSlice;