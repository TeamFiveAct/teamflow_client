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

// store.ts
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import sessionStorage from 'redux-persist/lib/storage/session'; // sessionStorage 사용
import checkSessionReducer from './modules/checkSessionSlice';
import taskReducer from './modules/taskSlice';
import onlineUsersReducer from './modules/onlineUsersSlice';
import actionDispatcherService from '../services/actionDispatcherService';

const checkSessionPersistConfig = {
  key: 'checkSession',
  storage: sessionStorage, // 세션스토리지에 저장
};

const taskPersistConfig = {
  key: 'tasks',
  storage: sessionStorage,
};

const persistedCheckSessionReducer = persistReducer(
  checkSessionPersistConfig,
  checkSessionReducer,
);

const persistedTaskReducer = persistReducer(
  taskPersistConfig,
  taskReducer,
);

const rootReducer = combineReducers({
  checkSession: persistedCheckSessionReducer,
  tasks: persistedTaskReducer,
  onlineUsers: onlineUsersReducer,
});

const persistConfig = {
  key: 'root',
  storage: sessionStorage,
  whitelist: ['checkSession', 'tasks'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // redux-persist와 관련된 액션 무시
        ignoredActions: ['persist/REGISTER'],
      },
    }),
});

// Initialize the action dispatcher service with the store
actionDispatcherService.initStore(store);

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
