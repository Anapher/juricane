import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Grid,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import TrackListPreview from '../track-list-preview/TrackListPreview';
import TrackList from './TrackList';
import { ColumnName } from './TracksTable';
import { TrackGroup } from './types';

type Props = {
  groups: TrackGroup[];
  hiddenColumns?: ColumnName[];
};

export default function GroupedTracks({ groups, hiddenColumns }: Props) {
  const [openTrackGroup, setOpenTrackGroup] = useState<TrackGroup | null>(null);

  if (openTrackGroup) {
    return (
      <TrackList
        group={openTrackGroup}
        onGoBack={() => setOpenTrackGroup(null)}
        hiddenColumns={hiddenColumns}
      />
    );
  }

  return (
    <Grid
      flex={1}
      container
      spacing={2}
      columns={{ xs: 4, md: 6, xl: 8 }}
      overflow="auto"
      m={0}
      pr={2}
      pb={2}
    >
      {groups.map((group) => (
        <Grid item key={group.id} display="flex" xs={1} alignItems="flex-start">
          <Card sx={{ flex: 1, minHeight: 0 }}>
            <CardActionArea onClick={() => setOpenTrackGroup(group)}>
              <CardMedia>
                <TrackListPreview tracks={group.tracks} />
              </CardMedia>
              <CardContent>
                <Typography
                  gutterBottom
                  sx={{ fontSize: { xs: 14, xl: 18 } }}
                  component="div"
                >
                  {group.name}
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
