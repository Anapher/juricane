import { RootState } from 'renderer/app/store';

export const selectCurrentTrack = (state: RootState) =>
  state.musicPlayer.currentTrack;

export const selectCurrentPlaylist = (state: RootState) =>
  state.musicPlayer.currentPlaylist;

export const selectAdminMode = (state: RootState) => state.admin.adminMode;
