import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Fab, Stack, Typography } from '@mui/material';
import { TrackGroup } from './types';

type Props = {
  group: TrackGroup;
  onGoBack: () => void;
};

export default function TrackListHeader({ group, onGoBack }: Props) {
  return (
    <Stack direction="row" spacing={2} alignItems="center">
      <Fab
        size="medium"
        color="default"
        aria-label="go back"
        variant="extended"
        onClick={onGoBack}
      >
        <ArrowBackIcon sx={{ mr: 2 }} />
        Back
      </Fab>
      <Typography variant="h6">{group.name}</Typography>
    </Stack>
  );
}
