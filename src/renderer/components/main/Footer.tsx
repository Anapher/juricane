import { Box, LinearProgress, Typography } from '@mui/material';

export default function Footer() {
  return (
    <Box sx={{ pb: 3 }}>
      <LinearProgress color="primary" variant="determinate" value={40} />
      <Typography align="center" sx={{ mt: 2 }}>
        01:40 / 02:57
      </Typography>
    </Box>
  );
}
