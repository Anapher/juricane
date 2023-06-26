import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';
import { useSelector } from 'react-redux';
import { formatSeconds } from 'renderer/utils/duration';
import { selectQueueTracks } from './selectors';

export default function Queue() {
  const queueTracks = useSelector(selectQueueTracks);

  return (
    <Box sx={{ flex: 2, display: 'flex', flexDirection: 'row' }}>
      <Box sx={{ flex: 1 }} />
      <Box sx={{ flex: 1, p: 3, display: 'flex', maxWidth: 800 }}>
        <Paper sx={{ p: 1, borderRadius: 2, flex: 1 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ opacity: 0.5 }}>
                <TableCell>No</TableCell>
                <TableCell>Cover</TableCell>
                <TableCell>Artist</TableCell>
                <TableCell>Title</TableCell>
                <TableCell>Length</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {queueTracks.map((x, i) => (
                <TableRow key={x.title}>
                  <TableCell>{i + 1}</TableCell>
                  <TableCell>Cover</TableCell>
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
