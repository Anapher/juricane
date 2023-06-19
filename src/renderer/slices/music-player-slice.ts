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
    addToWaitlist(state, { payload }: PayloadAction<Track>) {
      state.waitlist.push(payload);
    },
  },
});

export const { setLibraryPath, addToWaitlist } = musicPlayerSlice.actions;

export default musicPlayerSlice.reducer;
