import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useConfig } from 'renderer/app/queries';
import { removeFromWaitlist } from 'renderer/slices/music-player-slice';
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

  if (!config) return null;

  return (
    <Box sx={{ flex: 2, display: 'flex', flexDirection: 'row' }}>
      <Box sx={{ flex: 1, display: 'flex' }}>
        <CurrentTrackCover />
      </Box>
      <Box sx={{ flex: 1, p: 3, display: 'flex', maxWidth: 800 }}>
        <Paper sx={{ p: 1, borderRadius: 2, flex: 1 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ opacity: 0.5 }}>
                <TableCell>{t('components.queue.no')}</TableCell>
                <TableCell>{t('components.queue.cover')}</TableCell>
                <TableCell>{t('components.queue.artist')}</TableCell>
                <TableCell>{t('components.queue.title')}</TableCell>
                <TableCell>{t('components.queue.length')}</TableCell>
                {adminMode && <TableCell />}
              </TableRow>
            </TableHead>
            <TableBody>
              {queueTracks.map((x, i) => (
                <TableRow key={x.title}>
                  <TableCell>{i + 1}</TableCell>
                  <TableCell sx={{ p: 1 }}>
                    <TrackImage size={48} forceSize track={x} />
                  </TableCell>
                  <TableCell>{x.artist}</TableCell>
                  <TableCell>{x.title}</TableCell>
                  <TableCell>{formatSeconds(x.duration)}</TableCell>
                  {adminMode && (
                    <TableCell>
                      <Button onClick={() => handleRemoveFromQueue(x)}>
                        {t('components.queue.remove')}
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </Box>
    </Box>
  );
}
