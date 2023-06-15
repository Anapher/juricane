import { configureStore } from '@reduxjs/toolkit';
import musicPlayer from '../slices/music-player-slice';

export const store = configureStore({
  reducer: {
    musicPlayer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
