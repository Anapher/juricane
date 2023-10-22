import { Box } from '@mui/material';
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

    return tracks.filter((x) => {
      if (x.title.toUpperCase().includes(normalizedSearchText)) {
        return true;
      }
      if (x.artist?.toUpperCase().includes(normalizedSearchText)) {
        return true;
      }

      return false;
    });
  }, [tracks, searchText]);
}

export default function AllTracks() {
  const [searchText, setSearchText] = useState('');

  const library = useMusicLibrary();
  const filteredTracks = useFilteredTracks(library.data?.tracks, searchText);

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
