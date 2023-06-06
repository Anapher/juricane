import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';

const tracks = [{ artist: 'Apache 207', title: 'Roller', duration: '02:13' }];

export default function Queue() {
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
              {tracks.map((x, i) => (
                <TableRow key={x.title}>
                  <TableCell>{i + 1}</TableCell>
                  <TableCell>Cover</TableCell>
                  <TableCell>{x.artist}</TableCell>
                  <TableCell>{x.title}</TableCell>
                  <TableCell>{x.duration}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </Box>
    </Box>
  );
}
