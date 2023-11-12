import { Box } from '@mui/material';
import _ from 'lodash';
import { useMemo, useState } from 'react';
import { useMusicLibrary } from 'renderer/app/queries';
import { Track } from 'renderer/types';
import ScreenKeyboard from '../screen-keyboard/ScreenKeyboard';
import Tracks from './Tracks';

function useFilteredTracks(tracks: Track[] | undefined, searchText: string) {
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

export default function AllTracks() {
  const [searchText, setSearchText] = useState('');

  const library = useMusicLibrary();
  const sortedTracks = useMemo(
    () =>
      library.data?.tracks && _.sortBy(library.data?.tracks, (x) => x.title),
    [library.data?.tracks]
  );
  const filteredTracks = useFilteredTracks(sortedTracks, searchText);

  if (!library.data) return null;

  return (
    <Box flex={1} m={3} display="flex" flexDirection="column">
      <ScreenKeyboard
        value={searchText}
        onChange={setSearchText}
        sx={{ mb: 1 }}
      />
      <Box flex={1}>
        <Tracks tracks={filteredTracks} />
      </Box>
    </Box>
  );
}
