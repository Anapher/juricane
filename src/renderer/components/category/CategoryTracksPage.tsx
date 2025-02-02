import EjectIcon from '@mui/icons-material/Eject';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { Box, Fab, Paper, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useDefaultPlaylist, useMusicLibrary } from 'renderer/app/queries';
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
  playlist?: boolean;
};

export default function CategoryTracksPage({
  selectCategoryInfo,
  hiddenColumn,
  playlist,
}: Props) {
  const { id } = useParams();
  const playlistUrl = `/playlists/${id}`;

  const library = useMusicLibrary();
  const dispatch = useDispatch();
  const defaultPlaylist = useDefaultPlaylist();

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
        url: playlistUrl,
        name: data.name,
        tracks,
      })
    );
  };

  const resetToDefaultPlaylist = () => {
    if (!defaultPlaylist) {
      return;
    }
    dispatch(
      setCurrentPlaylist({
        url: `/playlists/${defaultPlaylist.id}`,
        name: defaultPlaylist.name,
        tracks: defaultPlaylist.trackIds.map((x) => library.data.tracks[x]),
      })
    );
  };

  const isPlaying = currentPlaylist?.url === playlistUrl;
  const isDefaultPlaylist = defaultPlaylist?.id === data.id;

  return (
    <Box
      flex={1}
      display="flex"
      m={2}
      mr={1}
      flexDirection="column"
      position="relative"
    >
      <Box
        display="flex"
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
      >
        <Box display="flex" alignItems="center">
          {isPlaying && <PlayArrowIcon fontSize="small" sx={{ mr: 1 }} />}
          <Typography variant="h6" align="center">
            {data.name}
          </Typography>
        </Box>
        {playlist &&
          (isPlaying ? (
            <Fab
              color="primary"
              disabled={isDefaultPlaylist}
              aria-label="play default playlist"
              size="medium"
              onClick={resetToDefaultPlaylist}
              sx={{ position: 'absolute', left: 16, top: 44 }}
            >
              <EjectIcon />
            </Fab>
          ) : (
            <Fab
              color="primary"
              aria-label="play"
              onClick={setPlaylistAsCurrent}
              size="medium"
              sx={{ position: 'absolute', left: 16, top: 44 }}
            >
              <PlayArrowIcon />
            </Fab>
          ))}
      </Box>
      <Paper sx={{ flex: 1, mt: 1, borderRadius: 3 }} elevation={6}>
        <Tracks tracks={tracks} hiddenColumn={hiddenColumn} />
      </Paper>
    </Box>
  );
}
