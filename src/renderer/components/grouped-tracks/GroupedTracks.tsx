import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Grid,
  Typography,
} from '@mui/material';
import { CategoryInfo } from 'renderer/types';
import TrackListPreview from '../track-list-preview/TrackListPreview';

type Props = {
  groups: CategoryInfo[];
  onNavigateToGroup: (group: CategoryInfo) => void;
};

export default function GroupedTracks({ groups, onNavigateToGroup }: Props) {
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
            <CardActionArea onClick={() => onNavigateToGroup(group)}>
              <CardMedia>
                <TrackListPreview images={group.previewImageTrackIds} />
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
