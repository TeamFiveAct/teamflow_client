import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice'; // ✅ authSlice가 store 폴더 안에 있을 경우

const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
