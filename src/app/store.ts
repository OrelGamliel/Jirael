import { configureStore } from '@reduxjs/toolkit';
import { baseApi } from './api/baseApi';
import { boardReducer } from '../features/board/state/boardSlice';
import { localStorageMiddleware, loadBoardState } from './localStorageMiddleware';

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    board: boardReducer,
  },
  preloadedState: loadBoardState(),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware, localStorageMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
