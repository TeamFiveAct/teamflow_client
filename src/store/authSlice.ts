import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  isLoggedIn: boolean;
  nickname: string | null;
  authProvider: string | null;
}

const initialState: AuthState = {
  isLoggedIn: sessionStorage.getItem('session_valid') === 'true', // ✅ 세션 유지
  nickname: sessionStorage.getItem('nickname') || null,
  // authProvider: sessionStorage.getItem('auth_provider') || null,
  authProvider: 'kakao', // ✅ 카카오 로그인 상태로 변경- 테스트용
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (
      state,
      action: PayloadAction<{ nickname: string; authProvider: string }>,
    ) => {
      state.isLoggedIn = true;
      state.nickname = action.payload.nickname;
      state.authProvider = action.payload.authProvider;

      // ✅ 세션 저장
      sessionStorage.setItem('session_valid', 'true');
      sessionStorage.setItem('nickname', action.payload.nickname);
      sessionStorage.setItem('auth_provider', action.payload.authProvider);
    },
    logout: state => {
      state.isLoggedIn = false;
      state.nickname = null;
      state.authProvider = null;

      // ✅ 세션 삭제
      sessionStorage.removeItem('session_valid');
      sessionStorage.removeItem('nickname');
      sessionStorage.removeItem('auth_provider');
    },
    deleteAccount: state => {
      state.isLoggedIn = false;
      state.nickname = null;
      state.authProvider = null;

      // ✅ 세션 삭제
      sessionStorage.removeItem('session_valid');
      sessionStorage.removeItem('nickname');
      sessionStorage.removeItem('auth_provider');
    },
  },
});

export const { login, logout, deleteAccount } = authSlice.actions;
export const selectIsLoggedIn = (state: { auth: AuthState }) =>
  state.auth.isLoggedIn;
export const selectNickname = (state: { auth: AuthState }) =>
  state.auth.nickname;
export const selectAuthProvider = (state: { auth: AuthState }) =>
  state.auth.authProvider;
export default authSlice.reducer;
