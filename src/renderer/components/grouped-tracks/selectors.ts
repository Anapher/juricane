import _ from 'lodash';
import { RootState } from 'renderer/app/store';
import { Track } from 'renderer/types';

export function createGroupOfTracksByProp<TProp>(
  propSelector: (t: Track) => TProp
) {
  return (state: RootState) => {
    if (!state.musicPlayer.library) return [];
    return _.chain(state.musicPlayer.library.tracks)
      .entries()
      .map((x) => x[1])
      .filter((x) => !!propSelector(x))
      .groupBy(propSelector)
      .entries()
      .map((x) => ({ name: x[0], id: x[0], tracks: x[1] }))
      .value();
  };
}

export default null;
