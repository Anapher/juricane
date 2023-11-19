/* eslint-disable react/no-unstable-nested-components */
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
} from '@mui/material';
import _ from 'lodash';
import { useMemo } from 'react';
import { Virtuoso } from 'react-virtuoso';
import { CategoryInfo } from 'renderer/types';
import TrackListPreview from '../track-list-preview/TrackListPreview';

const GROUPS_PER_ROW = 6;

type Props = {
  groups: CategoryInfo[];
  onNavigateToGroup: (group: CategoryInfo) => void;
};

export default function GroupedTracks({ groups, onNavigateToGroup }: Props) {
  const chunks = useMemo(
    () =>
      _.chunk(
        _.sortBy(groups, (x) => x.name),
        GROUPS_PER_ROW
      ),
    [groups]
  );

  return (
    <Virtuoso
      style={{ flex: 1, width: '100%' }}
      data={chunks}
      itemContent={(__, chunk) => (
        <Box display="flex" flexDirection="row">
          {chunk.map((group) => (
            <Card
              key={group.id}
              sx={{
                flex: 1,
                minHeight: 0,
                m: 1,
                display: 'flex',
              }}
            >
              <CardActionArea
                sx={{ flex: 1 }}
                onClick={() => onNavigateToGroup(group)}
              >
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
          ))}
          {chunk.length !== GROUPS_PER_ROW && (
            <Box
              sx={{
                flex: GROUPS_PER_ROW - chunk.length,
                mx: GROUPS_PER_ROW - chunk.length,
              }}
            />
          )}
        </Box>
      )}
    />
  );
}
