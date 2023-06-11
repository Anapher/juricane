import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { MusicLibrary, Playlist, Track } from 'renderer/types';

export type MusicPlayerState = {
  currentlyPlaying: Track | null;
  currentPlaylist: Playlist | null;
  waitlist: Track[];
  library: MusicLibrary | null;
};

const initialState: MusicPlayerState = {
  currentlyPlaying: null,
  currentPlaylist: null,
  waitlist: [],
  library: null,
};

export const musicPlayerSlice = createSlice({
  name: 'musicPlayer',
  initialState,
  reducers: {
    musicLibraryLoaded(state, { payload }: PayloadAction<MusicLibrary>) {
      state.library = payload;
    },
  },
});

export const { musicLibraryLoaded } = musicPlayerSlice.actions;

export default musicPlayerSlice.reducer;
