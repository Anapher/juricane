import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import {
  CardActionArea,
  CardContent,
  CardMedia,
  Fab,
  Typography,
} from '@mui/material';
import { CategoryInfo } from 'renderer/types';
import TrackListPreview from '../track-list-preview/TrackListPreview';

type Props = {
  group: CategoryInfo;
  onClick: () => void;
  onPlayButton?: () => void;
};

export default function TrackGroupCard({
  group,
  onClick,
  onPlayButton,
}: Props) {
  return (
    <CardActionArea sx={{ flex: 1, position: 'relative' }} onClick={onClick}>
      <CardMedia>
        <TrackListPreview images={group.previewImageTrackIds} />
      </CardMedia>
      <CardContent sx={{ mb: onPlayButton ? 2 : 0 }}>
        <Typography
          gutterBottom
          sx={{
            fontSize: { xs: 14, xl: 18 },
            mr: onPlayButton ? 4 : 0,
          }}
          component="div"
        >
          {group.name}
        </Typography>
        {onPlayButton && (
          <Fab
            sx={{ position: 'absolute', right: 8, bottom: 8 }}
            size="small"
            color="primary"
            onClick={(e) => {
              onPlayButton();
              e.stopPropagation();
            }}
          >
            <PlayArrowIcon />
          </Fab>
        )}
      </CardContent>
    </CardActionArea>
  );
}
