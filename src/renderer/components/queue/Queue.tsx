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
import { selectQueueTracks } from './selectors';
import { formatSeconds } from 'renderer/utils/duration';

// const buffer1 = new Tone.Buffer(
//   'file:////Users/vgriebel/Downloads/Kollegah_und_Farid_Bang-Jung_Brutal_Gutaussehend_2-Premium_Edition-DE-2013-NOiR/06-kollegah_und_farid_bang-stiernackenkommando-noir.mp3'
// );
// const buffer2 = new Tone.Buffer(
//   'file:////Users/vgriebel/Downloads/Kollegah_und_Farid_Bang-Jung_Brutal_Gutaussehend_2-Premium_Edition-DE-2013-NOiR/09-kollegah_und_farid_bang-dissen_aus_prinzip-noir.mp3'
// );

export default function Queue() {
  // const handlePlay = () => {
  //   const sound = new Howl({
  //     src: [
  //       'file:////Users/vgriebel/Downloads/Kollegah_und_Farid_Bang-Jung_Brutal_Gutaussehend_2-Premium_Edition-DE-2013-NOiR/09-kollegah_und_farid_bang-dissen_aus_prinzip-noir.mp3',
  //     ],
  //   });

  //   sound.play();
  //   setTimeout(() => {
  //     sound.fade(1, 0, 5000);
  //     const sound2 = new Howl({
  //       src: 'file:////Users/vgriebel/Downloads/Kollegah_und_Farid_Bang-Jung_Brutal_Gutaussehend_2-Premium_Edition-DE-2013-NOiR/06-kollegah_und_farid_bang-stiernackenkommando-noir.mp3',
  //       volume: 0,
  //     });
  //     console.log(sound2.state());
  //     sound2.play();
  //     sound2.fade(0, 1, 5000);
  //   }, 2000);
  // };

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
