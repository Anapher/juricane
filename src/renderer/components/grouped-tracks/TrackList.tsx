/* eslint-disable react/jsx-props-no-spreading */
import { Box, Paper } from '@mui/material';
import TrackListHeader from './TrackListHeader';
import TracksTable, { ColumnName, ConfigProps } from './TracksTable';
import { TrackGroup } from './types';

type Props = ConfigProps & {
  group: TrackGroup;
  onGoBack: () => void;
  hiddenColumns?: ColumnName[];
};

export default function TrackList({ group, onGoBack, ...props }: Props) {
  return (
    <Box flex={1} display="flex" m={2} flexDirection="column">
      <TrackListHeader group={group} onGoBack={onGoBack} />
      <Paper sx={{ flex: 1, mt: 2, borderRadius: 3 }} elevation={6}>
        <TracksTable tracks={group.tracks} {...props} />
      </Paper>
    </Box>
  );
}
