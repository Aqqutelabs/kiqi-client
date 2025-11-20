import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import campaignReducer from './slices/campaignSlice';
import smsReducer from './slices/smsSlice';
import { persistStore, persistReducer, createTransform } from 'redux-persist';
import type { PersistConfig } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from 'redux';

const rootReducer = combineReducers({
  auth: authReducer,
  campaign: campaignReducer,
  sms: smsReducer,
});

// Derive RootState from the root reducer so we can use it in persist typings
export type RootState = ReturnType<typeof rootReducer>;

const persistConfig: PersistConfig<RootState> = {
  key: 'root',
  storage,
  whitelist: ['auth'], // Only persist auth slice
  // Transforms allow us to clean transient fields when state is rehydrated
  // This prevents UI-only flags (like registration.loading) from sticking after reload
  transforms: [
    createTransform(
      // inbound: before state is persisted — keep as-is
      (inboundState: Partial<RootState> | undefined, key: string | number | symbol) => inboundState,
      // outbound: state after rehydration — clear transient registration fields
      (outboundState: Partial<RootState> | undefined, key: string | number | symbol) => {
        try {
          if (outboundState && (outboundState as any).registration) {
            return {
              ...outboundState,
              registration: {
                status: 'idle',
                error: null,
                data: null,
                message: null,
              },
            };
          }
        } catch (e) {
          // If something unexpected happens, return outboundState unchanged
        }
        return outboundState;
      },
      { whitelist: ['auth'] }
    ),
  ],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);

// RootState is exported above (derived from rootReducer)
export type AppDispatch = typeof store.dispatch;