import { Box } from '@mui/material';
import { useMusicLibrary } from 'renderer/app/queries';
import Tracks from './Tracks';

export default function AllTracks() {
  const library = useMusicLibrary();
  if (!library.data) return null;

  return (
    <Box flex={1} m={3}>
      <Tracks tracks={library.data.tracks} />
    </Box>
  );
}
