import { RootState } from 'renderer/app/store';

export const selectQueueTracks = (state: RootState) =>
  state.musicPlayer.waitlist;
