import _ from 'lodash';
import { useMusicLibrary } from 'renderer/app/queries';
import { Track } from 'renderer/types';

export function useGroupOfTracks<TProp>(propSelector: (t: Track) => TProp) {
  const { data: library } = useMusicLibrary();
  if (!library) return [];

  return _.chain(library.tracks)
    .entries()
    .map((x) => x[1])
    .filter((x) => !!propSelector(x))
    .groupBy(propSelector)
    .entries()
    .map((x) => ({ name: x[0], id: x[0], tracks: x[1] }))
    .value();
}

export default null;
