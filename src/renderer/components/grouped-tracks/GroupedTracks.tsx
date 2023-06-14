import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Grid,
  Typography,
} from '@mui/material';
import { Track } from 'renderer/types';
import TracksPreview from '../tracks-preview/TracksPreview';

export type TrackGroup = {
  id: any;
  name: string;
  tracks: Track[];
};

type Props = {
  groups: TrackGroup[];
};

export default function GroupedTracks({ groups }: Props) {
  return (
    <Box flex={1} display="flex" p={2} minWidth={0}>
      <Grid container flex={1} spacing={2} columns={{ xs: 4, md: 6, xl: 8 }}>
        {groups.map(({ name, tracks, id }) => (
          <Grid item key={id} display="flex" xs={1} md={1} xl={1}>
            <Card sx={{ flex: 1, minHeight: 0 }}>
              <CardActionArea>
                <CardMedia>
                  <TracksPreview tracks={tracks} />
                </CardMedia>
                <CardContent>
                  <Typography
                    gutterBottom
                    sx={{ fontSize: { xs: 14, xl: 18 } }}
                    component="div"
                  >
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
