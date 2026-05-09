import { configureStore } from '@reduxjs/toolkit';
import { authReducer } from '@/entities/session';
import { baseApi } from '@/shared/api';

// ─── Store Configuration ─────────────────────────────────────────────
export const store = configureStore({
  reducer: {
    auth: authReducer,
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
});

// ─── Type Helpers ────────────────────────────────────────────────────
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
