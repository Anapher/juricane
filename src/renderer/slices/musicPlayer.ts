import { createSlice } from '@reduxjs/toolkit';
import { Playlist, Track } from 'renderer/types';

const sampleTrack: Track = {
  artist: 'Kollegah',
  duration: 124,
  title: 'Du bist Boss',
  url: 'Users/vgriebel/Downloads/Kollegah_und_Farid_Bang-Jung_Brutal_Gutaussehend_2-Premium_Edition-DE-2013-NOiR/06-kollegah_und_farid_bang-stiernackenkommando-noir.mp3',
};

const playlist = { name: 'Test playlist', url: '', tracks: [sampleTrack] };

export type MusicPlayerState = {
  currentlyPlaying: Track | null;
  playlists: Playlist[];
  currentPlaylist: Playlist | null;
  waitlist: Track[];
};

const initialState: MusicPlayerState = {
  currentlyPlaying: sampleTrack,
  playlists: [playlist],
  currentPlaylist: playlist,
  waitlist: [sampleTrack],
};

export const musicPlayerSlice = createSlice({
  name: 'musicPlayer',
  initialState,
  reducers: {},
});

// export const {} = musicPlayerSlice.actions;

export default musicPlayerSlice.reducer;
