import { PayloadAction, createAction, createSlice } from '@reduxjs/toolkit';
import { Track } from 'renderer/types';

type CurrentPlaylist = {
  id: number;
  name: string;
  tracks: Track[];
};

export type MusicPlayerState = {
  currentTrack: Track | null;
  currentPlaylist: CurrentPlaylist | null;
  playedTracksHistory: number[];
  waitlist: Track[];
  libraryPath: string | null;
};

const initialState: MusicPlayerState = {
  currentTrack: null,
  currentPlaylist: null,
  playedTracksHistory: [],
  waitlist: [],
  libraryPath: null,
};

const reorder = (list: Track[], startIndex: number, endIndex: number) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
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
    setCurrentTrack(state, { payload }: PayloadAction<Track>) {
      state.currentTrack = payload;

      if (state.waitlist.length > 0 && state.waitlist[0].id === payload.id) {
        state.waitlist = state.waitlist.slice(1);
      }

      state.playedTracksHistory = [payload.id, ...state.playedTracksHistory];
    },
    setCurrentPlaylist(state, { payload }: PayloadAction<CurrentPlaylist>) {
      state.currentPlaylist = payload;
    },
    removeFromWaitlist(state, { payload }: PayloadAction<number>) {
      state.waitlist = state.waitlist.filter((x) => x.id !== payload);
    },
    waitlistReorder(
      state,
      {
        payload: { startIndex, endIndex },
      }: PayloadAction<{ startIndex: number; endIndex: number }>
    ) {
      state.waitlist = reorder(state.waitlist, startIndex, endIndex);
    },
  },
});

export const playNextTrack = createAction('musicPlayer/playNextTrack');

export const {
  setLibraryPath,
  addToWaitlist,
  setCurrentPlaylist,
  setCurrentTrack,
  removeFromWaitlist,
  waitlistReorder,
} = musicPlayerSlice.actions;

export default musicPlayerSlice.reducer;
