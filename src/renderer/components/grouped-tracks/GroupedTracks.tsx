import {
  Box,
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
import { TrackGroup } from './types';
import { ColumnName } from './TracksTable';

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
    <Box flex={1} display="flex" p={2} minWidth={0}>
      <Grid container flex={1} spacing={2} columns={{ xs: 4, md: 6, xl: 8 }}>
        {groups.map((group) => (
          <Grid item key={group.id} display="flex" xs={1} md={1} xl={1}>
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
    </Box>
  );
}
