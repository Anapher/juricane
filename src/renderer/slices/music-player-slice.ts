import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { Playlist, Track } from 'renderer/types';

export type MusicPlayerState = {
  currentlyPlaying: Track | null;
  currentPlaylist: Playlist | null;
  waitlist: Track[];
  libraryPath: string | null;
};

const initialState: MusicPlayerState = {
  currentlyPlaying: null,
  currentPlaylist: null,
  waitlist: [],
  libraryPath: null,
};

export const musicPlayerSlice = createSlice({
  name: 'musicPlayer',
  initialState,
  reducers: {
    setLibraryPath(state, { payload }: PayloadAction<string>) {
      state.libraryPath = payload;
    },
  },
});

export const { setLibraryPath } = musicPlayerSlice.actions;

export default musicPlayerSlice.reducer;
