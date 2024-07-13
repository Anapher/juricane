import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  Typography,
} from '@mui/material';
import _ from 'lodash';
import { useEffect, useMemo, useState } from 'react';
import { OnDragEndResponder } from 'react-beautiful-dnd';
import { useMusicLibrary } from 'renderer/app/queries';
import { OwnPlaylist, Track } from 'renderer/types';
import { reorder } from 'renderer/utils/dragndrop';
import QueueList from '../queue/QueueList';
import EditOwnPlaylistTrackSelection from './EditOwnPlaylistTrackSelection';

type Props = {
  onClose: () => void;
  onSave: (tracks: number[]) => void;
  open: boolean;
  playlist: OwnPlaylist;
};

export default function EditOwnPlaylistDialog({
  onClose,
  open,
  playlist,
  onSave,
}: Props) {
  const { data: library } = useMusicLibrary();
  const [tracks, setTracks] = useState(playlist.trackIds);

  useEffect(() => {
    setTracks(playlist.trackIds);
  }, [open, playlist]);

  const sortedTracks = useMemo(
    () => library?.tracks && _.sortBy(library?.tracks, (x) => x.title),
    [library?.tracks]
  );

  if (!library) {
    return null;
  }

  const handleDelete = (__: Track, index: number) => {
    setTracks((t) => t.filter((___, i) => i !== index));
  };

  const handleOnDragEnd: OnDragEndResponder = (result) => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    setTracks((t) =>
      reorder(t, result.source.index, result.destination!.index)
    );
  };

  const handleAddTrack = (track: Track) => {
    setTracks((t) => [...t, track.id]);
  };

  return (
    <Dialog
      onClose={onClose}
      open={open}
      fullWidth
      maxWidth="xl"
      PaperProps={{ sx: { height: '90vh' } }}
    >
      <DialogTitle>
        <Typography>Playlist {`"${playlist.name}"`} bearbeiten</Typography>
      </DialogTitle>
      <DialogContent
        sx={{ display: 'flex', flexDirection: 'row', flex: 1, height: '100%' }}
      >
        <Box flex={2}>
          <EditOwnPlaylistTrackSelection
            tracks={sortedTracks || []}
            onAddTrack={handleAddTrack}
            addedTracks={tracks}
          />
        </Box>
        <Paper
          sx={{
            p: 1,
            borderRadius: 2,
            flex: 1,
            overflowY: 'auto',
            ml: 2,
          }}
        >
          <QueueList
            tracks={tracks.map((x) => library.tracks[x])}
            allowDelete
            onDelete={handleDelete}
            onDragEnd={handleOnDragEnd}
          />
        </Paper>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Abbrechen</Button>
        <Button onClick={() => onSave(tracks)} autoFocus>
          Speichern
        </Button>
      </DialogActions>
    </Dialog>
  );
}
