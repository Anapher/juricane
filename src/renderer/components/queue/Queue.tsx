import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useConfig } from 'renderer/app/queries';
import { formatSeconds } from 'renderer/utils/duration';
import TrackImage from '../tracks/TrackImage';
import { selectQueueTracks } from './selectors';
import CurrentTrackCover from './CurrentTrackCover';

export default function Queue() {
  const queueTracks = useSelector(selectQueueTracks);
  const { data: config } = useConfig();
  const { t } = useTranslation();

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
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </Box>
    </Box>
  );
}
