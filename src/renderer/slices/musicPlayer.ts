import { createSlice } from '@reduxjs/toolkit';
import { Playlist, Track } from 'renderer/types';

export type MusicPlayerState = {
  currentlyPlaying: Track | null;
  playlists: Playlist[];
  currentPlaylist: Playlist | null;
};

const initialState: MusicPlayerState = {
  currentlyPlaying: null,
  playlists: [],
  currentPlaylist: null,
};

export const musicPlayerSlice = createSlice({
  name: 'musicPlayer',
  initialState,
  reducers: {},
});

// export const {} = musicPlayerSlice.actions;

export default musicPlayerSlice.reducer;
