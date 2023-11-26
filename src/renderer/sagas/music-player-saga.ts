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
      if (!state.musicPlayer.currentPlaylist) {
        return;
      }

      const playlistTrackIds = new Set(
        state.musicPlayer.currentPlaylist.tracks.map((x) => x.id)
      );

      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < state.musicPlayer.playedTracksHistory.length; i++) {
        const trackId = state.musicPlayer.playedTracksHistory[i];

        if (playlistTrackIds.size === 1) {
          break;
        }

        playlistTrackIds.delete(trackId);
      }

      const trackIdList = Array.from(playlistTrackIds);

      const trackId = drawRandomItem(trackIdList);
      const track = state.musicPlayer.currentPlaylist.tracks.find(
        (x) => x.id === trackId
      )!;

      api.dispatch(setCurrentTrack(track));
    }
  },
});
