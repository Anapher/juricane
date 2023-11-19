import { Box, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import { selectCurrentTrack } from '../main/selectors';
import TrackImage from '../tracks/TrackImage';
import ArtistChips from '../artist-chips/ArtistChips';

export default function CurrentTrackCover() {
  const currentTrack = useSelector(selectCurrentTrack);
  if (!currentTrack) return null;

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      flex={1}
      flexDirection="column"
    >
      <Box
        display="flex"
        alignItems="center"
        flexDirection="column"
        sx={{ maxWidth: 600, p: 3 }}
      >
        <TrackImage size={200} track={currentTrack} />
        <Typography variant="h5" align="center" sx={{ mt: 2 }}>
          {currentTrack.title}
        </Typography>
        <ArtistChips mt={1} artist={currentTrack.artist} />
      </Box>
    </Box>
  );
}
