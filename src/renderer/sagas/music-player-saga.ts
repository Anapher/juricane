import { isAnyOf } from '@reduxjs/toolkit';
import { startAppListening } from 'renderer/app/store';
import {
  addToWaitlist,
  playNextTrack,
  setCurrentPlaylist,
  setCurrentTrack,
} from 'renderer/slices/music-player-slice';

function drawRandomItem<T>(items: T[]) {
  return items[Math.floor(Math.random() * items.length)];
}

startAppListening({
  matcher: isAnyOf(setCurrentPlaylist, addToWaitlist),
  effect: (_, api) => {
    const state = api.getState();
    if (!state.musicPlayer.currentTrack) {
      api.dispatch(playNextTrack());
    }
  },
});
startAppListening({
  actionCreator: playNextTrack,
  effect: (_, api) => {
    const state = api.getState();

    if (state.musicPlayer.waitlist.length > 0) {
      api.dispatch(setCurrentTrack(state.musicPlayer.waitlist[0]));
    } else {
      const list = state.musicPlayer.currentPlaylist?.tracks.filter(
        (x) => x.url !== state.musicPlayer.currentTrack?.url
      );
      if (!list) return;

      const nextTrack = drawRandomItem(list);
      api.dispatch(setCurrentTrack(nextTrack));
    }
  },
});
