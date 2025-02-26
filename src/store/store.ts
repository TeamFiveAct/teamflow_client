// import { configureStore } from '@reduxjs/toolkit';
// // import authReducer from './authSlice'; // ✅ authSlice가 store 폴더 안에 있을 경우
// import checkSessionReducer from './modules/checkSessionSlice';

// const store = configureStore({
//   reducer: {
//     checkSession: checkSessionReducer,
//     // auth: authReducer,
//   },
// });

// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;

// export default store;

// store.ts에서 CheckSessionState import 삭제
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import sessionStorage from 'redux-persist/lib/storage/session'; // sessionStorage 사용
import checkSessionReducer from './modules/checkSessionSlice';
import taskReducer from './modules/taskSlice';

const checkSessionPersistConfig = {
  key: 'checkSession',
  storage: sessionStorage, // 세션스토리지에 저장
};

const persistedCheckSessionReducer = persistReducer(
  checkSessionPersistConfig,
  checkSessionReducer,
);

const rootReducer = combineReducers({
  checkSession: persistedCheckSessionReducer,
  tasks: taskReducer,
});

const persistConfig = {
  key: 'root',
  storage: sessionStorage,
  whitelist: ['checkSession'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
