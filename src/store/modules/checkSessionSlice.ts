// src/store/modules/checkSessionSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CheckSessionState {
  nickname: string | null;
  authProvider: string | null;
  sessionValid: boolean;
}

const initialState: CheckSessionState = {
  nickname: null,
  authProvider: null,
  sessionValid: false,
};

const checkSessionSlice = createSlice({
  name: 'checkSession',
  initialState,
  reducers: {
    login: (
      state,
      action: PayloadAction<{ nickname: string; authProvider: string }>,
    ) => {
      state.nickname = action.payload.nickname;
      state.authProvider = action.payload.authProvider;
      state.sessionValid = true;
    },
    logout: state => {
      state.nickname = null;
      state.authProvider = null;
      state.sessionValid = false;
    },
    setSessionStatus: (state, action: PayloadAction<boolean>) => {
      state.sessionValid = action.payload;
      if (!action.payload) {
        state.nickname = null;
        state.authProvider = null;
      }
    },
    setAuthProvider: (state, action: PayloadAction<string>) => {
      state.authProvider = action.payload; // 로그인 방식 설정
    },
    deleteAccount: state => {
      state.nickname = null;
      state.authProvider = null;
      state.sessionValid = false;
    },
  },
});

export const {
  login,
  logout,
  setSessionStatus,
  setAuthProvider,
  deleteAccount,
} = checkSessionSlice.actions;
export default checkSessionSlice.reducer;
