import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Fab, Stack, Typography } from '@mui/material';

type Props = {
  title: string;
  onGoBack: () => void;
};

export default function TrackListHeader({ title, onGoBack }: Props) {
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
      <Typography variant="h6">{title}</Typography>
    </Stack>
  );
}
