import { Box, Chip, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ArtistChips from '../artist-chips/ArtistChips';
import { selectCurrentTrack } from '../main/selectors';
import TrackImage from '../tracks/TrackImage';

export default function CurrentTrackCover() {
  const currentTrack = useSelector(selectCurrentTrack);
  const navigate = useNavigate();

  if (!currentTrack) return null;

  const navigateToAlbum = () => {
    if (!currentTrack.album) {
      return;
    }

    navigate(`/albums/${encodeURIComponent(currentTrack.album)}`);
  };

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
        {currentTrack.album && (
          <Box
            display="flex"
            sx={{ mt: 4 }}
            flexDirection="column"
            alignItems="center"
          >
            <Typography variant="caption">Album: </Typography>
            <Chip
              size="small"
              label={currentTrack.album}
              onClick={navigateToAlbum}
              sx={{ ml: 1, backgroundColor: 'rgba(255, 255, 255, 0.03)' }}
            />
          </Box>
        )}
      </Box>
    </Box>
  );
}
