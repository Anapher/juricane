import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Grid,
  Typography,
} from '@mui/material';
import { useSelector } from 'react-redux';
import { selectPlaylists } from './selectors';
import TracksPreview from '../tracks-preview/TracksPreview';

export default function Playlists() {
  const playlists = useSelector(selectPlaylists);
  return (
    <Box flex={1} display="flex" p={2} minWidth={0}>
      <Grid container flex={1} spacing={2}>
        {playlists.map(({ name, tracks, url }) => (
          <Grid item xs={2} key={url} display="flex" alignItems="flex-start">
            <Card style={{ height: 'auto' }}>
              <CardActionArea>
                <CardMedia>
                  <TracksPreview tracks={tracks} />
                </CardMedia>
                <CardContent>
                  <Typography gutterBottom variant="h6" component="div">
                    {name}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
