import _ from 'lodash';
import { useMemo } from 'react';
import { Track } from 'renderer/types';

export default function useFilteredTracks(
  tracks: Track[] | undefined,
  searchText: string
) {
  return useMemo(() => {
    if (!tracks) {
      return [];
    }

    const normalizedSearchText = searchText.trim().toUpperCase();
    if (!normalizedSearchText) {
      return tracks;
    }

    return tracks.filter((track) => {
      if (track.title.toUpperCase().includes(normalizedSearchText)) {
        return true;
      }
      if (
        _.some(track.artist, (x) =>
          x.toUpperCase().includes(normalizedSearchText)
        )
      ) {
        return true;
      }

      return false;
    });
  }, [tracks, searchText]);
}
