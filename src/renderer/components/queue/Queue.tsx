/* eslint-disable react/jsx-props-no-spreading */
import DeleteIcon from '@mui/icons-material/Delete';
import {
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
import {
  removeFromWaitlist,
  waitlistReorder,
} from 'renderer/slices/music-player-slice';
import { Track } from 'renderer/types';
import ArtistChips from '../artist-chips/ArtistChips';
import { selectAdminMode } from '../main/selectors';
import TrackImage from '../tracks/TrackImage';
import { selectQueueTracks } from './selectors';

export default function Queue() {
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

  if (!config) return null;

  return (
    <Paper sx={{ p: 1, borderRadius: 2, flex: 1, overflowY: 'auto' }}>
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
  );
}
