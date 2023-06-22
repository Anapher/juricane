import { Box, Paper, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import { useMusicLibrary } from 'renderer/app/queries';
import { CategoryInfo, MusicLibrary } from 'renderer/types';
import { ColumnName } from '../grouped-tracks/TracksTable';
import Tracks from '../tracks/Tracks';

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

  if (!library.data) return null;
  if (!id) return null;

  const data = selectCategoryInfo(library.data, id);
  if (!data) return null;

  const tracks = data.trackIds
    .map((x) => library.data.tracks[x])
    .filter((x) => !!x);

  return (
    <Box flex={1} display="flex" m={2} flexDirection="column">
      <Typography variant="h6">{data.name}</Typography>
      <Paper sx={{ flex: 1, mt: 1, borderRadius: 3 }} elevation={6}>
        <Tracks tracks={tracks} hiddenColumn={hiddenColumn} />
      </Paper>
    </Box>
  );
}
