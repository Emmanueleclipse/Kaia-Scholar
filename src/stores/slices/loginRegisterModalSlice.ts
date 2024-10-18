/* eslint-disable react-hooks/rules-of-hooks */
import { createAction, createReducer, PayloadAction } from '@reduxjs/toolkit';

// Actions to control login/register modal state and type
export const setLoginRegisterModal = createAction<boolean>('user/setLoginRegisterModal');
export const setModalName = createAction<'login' | 'register' | 'scholar'>('user/setModalName');
export const updateScholarUrl = createAction<string>('user/updateScholarUrl');

// Initial state to manage modal control
const initialState = {
  isLoginRegisterModalOpen: false, // State to control the modal visibility
  modalName: 'login' as 'login' | 'register' | 'scholar', // State to control the type of modal ('login' or 'register')
  registerScholarUrl: "",
};

// Reducer to manage the modal state and type
const loginRegisterModalSlice = createReducer(initialState, {
  [setLoginRegisterModal.toString()]: (state, action: PayloadAction<boolean>) => {
    state.isLoginRegisterModalOpen = action.payload; // Toggle modal state
  },
  [setModalName.toString()]: (state, action: PayloadAction<'login' | 'register' | 'scholar'>) => {
    state.modalName = action.payload; // Set the modal type (login or register)
  },

  [updateScholarUrl.toString()]: (state, action: PayloadAction<string>) => {
    state.registerScholarUrl = action.payload; // Set the modal type (login or register)
  },
});

export default loginRegisterModalSlice;
