import { Box, Button, ButtonGroup, Paper, Typography } from '@mui/material';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import {
  useMusicLibrary,
  useOwnPlaylists,
  useUpdateOwnPlaylist,
} from 'renderer/app/queries';
import { replaceWaitlist } from 'renderer/slices/music-player-slice';
import Tracks from '../tracks/Tracks';
import EditOwnPlaylistDialog from './EditOwnPlaylistDialog';

export default function OwnPlaylist() {
  const { id } = useParams();

  const { data: library } = useMusicLibrary();
  const { data: ownPlaylists } = useOwnPlaylists();

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const handleEditPlaylist = () => {
    setEditDialogOpen(true);
  };

  const updatePlaylist = useUpdateOwnPlaylist();
  const dispatch = useDispatch();

  if (!ownPlaylists) {
    return null;
  }

  if (!library) {
    return null;
  }

  const ownPlaylist = ownPlaylists.find((x) => x.name === id);
  if (!ownPlaylist) {
    return null;
  }

  const handleUpdatePlaylist = (trackIds: number[]) => {
    updatePlaylist.mutate({ name: ownPlaylist.name, trackIds });
    setEditDialogOpen(false);
  };

  const tracks = ownPlaylist.trackIds
    .map((x) => library.tracks[x])
    .filter((x) => !!x);

  const handlePlay = () => {
    dispatch(
      replaceWaitlist(ownPlaylist.trackIds.map((x) => library.tracks[x]))
    );
  };

  return (
    <Box
      flex={1}
      display="flex"
      m={2}
      mr={1}
      flexDirection="column"
      position="relative"
    >
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h6" align="center">
          {ownPlaylist.name}
        </Typography>
        <ButtonGroup size="small" variant="contained">
          <Button onClick={handlePlay}>Abspielen</Button>
          <Button>Timer</Button>
          <Button onClick={handleEditPlaylist}>Bearbeiten</Button>
        </ButtonGroup>
      </Box>
      <EditOwnPlaylistDialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        playlist={ownPlaylist}
        onSave={handleUpdatePlaylist}
      />
      <Paper sx={{ flex: 1, mt: 1, borderRadius: 3 }} elevation={6}>
        <Tracks tracks={tracks} disableJumpBar />
      </Paper>
    </Box>
  );
}
