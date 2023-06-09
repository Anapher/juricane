import { RootState } from 'renderer/app/store';

// eslint-disable-next-line import/prefer-default-export
export const selectQueueTracks = (state: RootState) =>
  state.musicPlayer.waitlist;
