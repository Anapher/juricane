import { Box, Paper } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { useMusicLibrary } from 'renderer/app/queries';
import { CategoryInfo, MusicLibrary } from 'renderer/types';
import Tracks from '../tracks/Tracks';
import TrackListHeader from './TrackListHeader';
import { ColumnName } from '../grouped-tracks/TracksTable';

type Props = {
  selectCategoryInfo: (
    library: MusicLibrary,
    id: string
  ) => CategoryInfo | undefined;
  hiddenColumn?: ColumnName;
};

export default function CategoryTracksPage({
  selectCategoryInfo,
  hiddenColumn,
}: Props) {
  const { id } = useParams();
  const library = useMusicLibrary();
  const navigate = useNavigate();

  if (!library.data) return null;
  if (!id) return null;

  const data = selectCategoryInfo(library.data, id);
  if (!data) return null;

  const tracks = data.trackIds
    .map((x) => library.data.tracks[x])
    .filter((x) => !!x);

  return (
    <Box flex={1} display="flex" m={2} flexDirection="column">
      <TrackListHeader title={data.name} onGoBack={() => navigate(-1)} />
      <Paper sx={{ flex: 1, mt: 2, borderRadius: 3 }} elevation={6}>
        <Tracks tracks={tracks} hiddenColumn={hiddenColumn} />
      </Paper>
    </Box>
  );
}
