/* eslint-disable react/jsx-props-no-spreading */
import {
  Box,
  Button,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
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
import { formatSeconds } from 'renderer/utils/duration';
import { selectAdminMode } from '../main/selectors';
import TrackImage from '../tracks/TrackImage';
import CurrentTrackCover from './CurrentTrackCover';
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
    <Box sx={{ flex: 2, display: 'flex', flexDirection: 'row' }}>
      <Box sx={{ flex: 1, display: 'flex' }}>
        <CurrentTrackCover />
      </Box>
      <Box sx={{ flex: 1, p: 3, display: 'flex', maxWidth: 800 }}>
        <Paper sx={{ p: 1, borderRadius: 2, flex: 1, overflowY: 'auto' }}>
          <DragDropContext onDragEnd={handleOnDragEnd}>
            <Table>
              <TableHead>
                <TableRow sx={{ opacity: 0.5 }}>
                  <TableCell>{t('components.queue.no')}</TableCell>
                  <TableCell>{t('components.queue.title')}</TableCell>
                  <TableCell>{t('components.queue.artist')}</TableCell>
                  <TableCell>{t('components.queue.length')}</TableCell>
                  {adminMode && <TableCell />}
                </TableRow>
              </TableHead>
              <Droppable droppableId="droppable">
                {(provided) => (
                  <TableBody
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                  >
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
                                <span>{x.title}</span>
                              </Stack>
                            </TableCell>
                            <TableCell>{x.artist}</TableCell>
                            <TableCell>{formatSeconds(x.duration)}</TableCell>
                            {adminMode && (
                              <TableCell>
                                <Button
                                  onClick={() => handleRemoveFromQueue(x)}
                                >
                                  {t('components.queue.remove')}
                                </Button>
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
      </Box>
    </Box>
  );
}
