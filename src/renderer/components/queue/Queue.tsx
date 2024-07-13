/* eslint-disable react/jsx-props-no-spreading */
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import { Fab, Paper } from '@mui/material';
import { OnDragEndResponder } from 'react-beautiful-dnd';
import { useDispatch, useSelector } from 'react-redux';
import { useConfig } from 'renderer/app/queries';
import { toggleAdminMode } from 'renderer/slices/admin-slice';
import {
  removeFromWaitlist,
  waitlistReorder,
} from 'renderer/slices/music-player-slice';
import { Track } from 'renderer/types';
import { selectAdminMode } from '../main/selectors';
import QueueList from './QueueList';
import { selectQueueTracks } from './selectors';

type Props = {
  setDialogOpen: (open: boolean) => void;
};

export default function Queue({ setDialogOpen }: Props) {
  const queueTracks = useSelector(selectQueueTracks);
  const { data: config } = useConfig();
  const adminMode = useSelector(selectAdminMode);
  const dispatch = useDispatch();

  const handleRemoveFromQueue = (track: Track) => {
    dispatch(removeFromWaitlist(track.id));
  };

  const handleOnDragEnd: OnDragEndResponder = (result) => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    dispatch(
      waitlistReorder({
        startIndex: result.source.index,
        endIndex: result.destination.index,
      })
    );
  };

  const handleToggleAdminMode = () => {
    if (adminMode) {
      dispatch(toggleAdminMode());
    } else if (config?.adminPassword) {
      setDialogOpen(true);
    } else {
      dispatch(toggleAdminMode());
    }
  };

  if (!config) return null;

  return (
    <div
      style={{
        position: 'relative',
        flex: 1,
        display: 'flex',
      }}
    >
      <Fab
        sx={{ position: 'absolute', right: -12, top: -12, zIndex: 1050 }}
        color="primary"
        size="small"
        onClick={handleToggleAdminMode}
      >
        {adminMode ? (
          <CloseIcon fontSize="small" />
        ) : (
          <EditIcon fontSize="small" />
        )}
      </Fab>
      <Paper
        sx={{
          p: 1,
          borderRadius: 2,
          flex: 1,
          overflowY: 'auto',
        }}
        style={{ backgroundColor: adminMode ? '#e74c3c' : undefined }}
      >
        <QueueList
          tracks={queueTracks}
          allowDelete={adminMode}
          onDelete={handleRemoveFromQueue}
          disableDragging={!adminMode}
          onDragEnd={handleOnDragEnd}
        />
      </Paper>
    </div>
  );
}
