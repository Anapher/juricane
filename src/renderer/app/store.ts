import {
  TypedStartListening,
  configureStore,
  createListenerMiddleware,
} from '@reduxjs/toolkit';
import musicPlayer from '../slices/music-player-slice';
import admin from '../slices/admin-slice';

const listenerMiddleware = createListenerMiddleware();

export const store = configureStore({
  reducer: {
    musicPlayer,
    admin,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().prepend(listenerMiddleware.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStartListening = TypedStartListening<RootState, AppDispatch>;

export const startAppListening =
  listenerMiddleware.startListening as AppStartListening;
