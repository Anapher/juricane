/* eslint-disable react/jsx-props-no-spreading */
import { Box, BoxProps, Chip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Track } from 'renderer/types';

type Props = BoxProps & {
  artist?: Track['artist'];
  small?: boolean;
};

export default function ArtistChips({ artist, small, ...boxProps }: Props) {
  const navigate = useNavigate();

  return (
    <Box {...boxProps}>
      {artist?.map((x) => (
        <Chip
          size={small ? 'small' : 'medium'}
          key={x}
          label={x}
          onClick={() => navigate(`/artists/${encodeURIComponent(x)}`)}
          sx={{
            backgroundColor: 'rgba(255, 255, 255, 0.03)',
          }}
        />
      ))}
    </Box>
  );
}
