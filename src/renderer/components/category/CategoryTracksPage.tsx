import { Box, Button, Paper, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useMusicLibrary } from 'renderer/app/queries';
import { RootState } from 'renderer/app/store';
import { setCurrentPlaylist } from 'renderer/slices/music-player-slice';
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
  const dispatch = useDispatch();
  const currentPlaylist = useSelector(
    (state: RootState) => state.musicPlayer.currentPlaylist
  );

  if (!library.data) return null;
  if (!id) return null;

  const data = selectCategoryInfo(library.data, id);
  if (!data) return null;

  const tracks = data.trackIds
    .map((x) => library.data.tracks[x])
    .filter((x) => !!x);

  const setPlaylistAsCurrent = () => {
    dispatch(
      setCurrentPlaylist({
        id: Number(data.id),
        name: data.name,
        tracks,
      })
    );
  };

  const isPlaying = currentPlaylist?.id === Number(data.id);

  return (
    <Box flex={1} display="flex" m={2} flexDirection="column">
      <Box
        display="flex"
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
      >
        <Typography variant="h6">{data.name}</Typography>
        <Button
          disabled={isPlaying}
          variant="contained"
          onClick={setPlaylistAsCurrent}
        >
          Abspielen
        </Button>
      </Box>
      <Paper sx={{ flex: 1, mt: 1, borderRadius: 3 }} elevation={6}>
        <Tracks tracks={tracks} hiddenColumn={hiddenColumn} />
      </Paper>
    </Box>
  );
}
