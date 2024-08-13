import { PayloadAction, createAction, createSlice } from '@reduxjs/toolkit';
import { Track } from 'renderer/types';
import { reorder } from 'renderer/utils/dragndrop';

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
    enqueueTracksAndPlayFirst(state, { payload }: PayloadAction<Track[]>) {
      if (payload.length > 0) {
        // eslint-disable-next-line prefer-destructuring
        state.currentTrack = payload[0];
        state.playedTracksHistory = [
          payload[0].id,
          ...state.playedTracksHistory,
        ];
      }
      const payloadTrackIds = new Set(payload.map((x) => x.id));
      state.waitlist = [
        ...payload.slice(1),
        ...state.waitlist.filter((x) => !payloadTrackIds.has(x.id)),
      ];
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
  enqueueTracksAndPlayFirst,
} = musicPlayerSlice.actions;

export default musicPlayerSlice.reducer;
