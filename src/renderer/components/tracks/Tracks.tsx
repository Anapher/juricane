import { Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useMusicLibrary } from 'renderer/app/queries';
import TracksTable from '../grouped-tracks/TracksTable';

export default function Tracks() {
  const navigate = useNavigate();

  const library = useMusicLibrary();
  if (!library.data) return null;

  return (
    <Box flex={1} m={3}>
      <TracksTable
        tracks={Object.values(library.data.tracks)}
        onNavigate={({ name, type }) =>
          navigate(`/${type}/${encodeURIComponent(name)}`)
        }
        onAddToQueue={() => {}}
      />
    </Box>
  );
}
