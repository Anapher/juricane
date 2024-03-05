/* eslint-disable react/jsx-props-no-spreading */
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import {
  Fab,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Tooltip,
} from '@mui/material';
import {
  DragDropContext,
  Draggable,
  Droppable,
  OnDragEndResponder,
} from 'react-beautiful-dnd';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useConfig } from 'renderer/app/queries';
import { toggleAdminMode } from 'renderer/slices/admin-slice';
import {
  removeFromWaitlist,
  waitlistReorder,
} from 'renderer/slices/music-player-slice';
import { Track } from 'renderer/types';
import ArtistChips from '../artist-chips/ArtistChips';
import { selectAdminMode } from '../main/selectors';
import TrackImage from '../tracks/TrackImage';
import { selectQueueTracks } from './selectors';

type Props = {
  setDialogOpen: (open: boolean) => void;
};

export default function Queue({ setDialogOpen }: Props) {
  const queueTracks = useSelector(selectQueueTracks);
  const { data: config } = useConfig();
  const { t } = useTranslation();
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
        sx={{ position: 'absolute', right: -12, top: -12, zIndex: 1000000 }}
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
        <DragDropContext onDragEnd={handleOnDragEnd}>
          <Table>
            <Droppable droppableId="droppable">
              {(provided) => (
                <TableBody ref={provided.innerRef} {...provided.droppableProps}>
                  {queueTracks.map((x, i) => (
                    <Draggable
                      key={x.id.toString()}
                      draggableId={x.title}
                      index={i}
                      isDragDisabled={!adminMode}
                    >
                      {(provided2) => (
                        <TableRow
                          ref={provided2.innerRef}
                          {...provided2.draggableProps}
                          {...provided2.dragHandleProps}
                        >
                          <TableCell>{i + 1}</TableCell>
                          <TableCell sx={{ p: 1 }}>
                            <Stack
                              direction="row"
                              alignItems="center"
                              spacing={2}
                            >
                              <TrackImage size={48} forceSize track={x} />
                              <div>
                                <span>{x.title}</span>
                                <ArtistChips
                                  sx={{ ml: -1, mt: 0.5 }}
                                  artist={x.artist}
                                  small
                                />
                              </div>
                            </Stack>
                          </TableCell>

                          {adminMode && (
                            <TableCell>
                              <Tooltip title={t('components.queue.remove')}>
                                <IconButton
                                  onClick={() => handleRemoveFromQueue(x)}
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </Tooltip>
                            </TableCell>
                          )}
                        </TableRow>
                      )}
                    </Draggable>
                  ))}
                </TableBody>
              )}
            </Droppable>
          </Table>
        </DragDropContext>
      </Paper>
    </div>
  );
}
