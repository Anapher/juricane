/* eslint-disable react/no-unstable-nested-components */
import {
  Box,
  ButtonBase,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
} from '@mui/material';
import _ from 'lodash';
import { useMemo, useRef } from 'react';
import { GroupedVirtuoso } from 'react-virtuoso';
import { CategoryInfo } from 'renderer/types';
import TrackListPreview from '../track-list-preview/TrackListPreview';

const GROUPS_PER_ROW = 6;

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

type Props = {
  items: CategoryInfo[];
  onNavigateToGroup: (group: CategoryInfo) => void;
};

const createData = (items: CategoryInfo[]) => {
  const sortedItems = _.sortBy(items, (x) => x.name);
  const groupedItems = _.groupBy(sortedItems, (x) => x.name[0]);
  const groupedChunks = Object.fromEntries(
    Object.entries(groupedItems).map(([k, v]) => [
      k,
      _.chunk(v, GROUPS_PER_ROW),
    ])
  );

  const groupCounts = Object.values(groupedChunks).map((x) => x.length);
  const groups = Object.keys(groupedChunks);

  return {
    groupedChunks: _.flatMap(Object.values(groupedChunks), (x) => x),
    groupCounts,
    groups,
  };
};

export default function GroupedTracks({ items, onNavigateToGroup }: Props) {
  const { groupedChunks, groupCounts, groups } = useMemo(
    () => createData(items),
    [items]
  );

  const virtuoso = useRef(null);
  const handleScroll = (index: number) => () => {
    (virtuoso.current as any)?.scrollToIndex({
      index,
    });
  };

  const { firstItemsIndexes } = groupCounts.reduce(
    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-shadow
    ({ firstItemsIndexes, offset }, count) => ({
      firstItemsIndexes: [...firstItemsIndexes, offset],
      offset: offset + count,
    }),
    { firstItemsIndexes: [], offset: 0 }
  ) as any;

  return (
    <Box flex={1} display="flex" width="100%" my={2}>
      <GroupedVirtuoso
        ref={virtuoso}
        groupCounts={groupCounts}
        style={{ flex: 1, width: '100%' }}
        groupContent={(index) => {
          return (
            <Box
              sx={(theme) => ({
                backgroundColor: theme.palette.background.paper,
              })}
            >
              <Typography sx={{ ml: 1 }} variant="h6">
                {groups[index]}
              </Typography>
            </Box>
          );
        }}
        itemContent={(index) => {
          const chunk = groupedChunks[index];
          return (
            <Box display="flex" flexDirection="row">
              {chunk.map((group) => (
                <Card
                  key={group.id}
                  sx={{
                    flex: 1,
                    minHeight: 0,
                    m: 1,
                    mt: index === 0 ? 2 : 1,
                    mb: index === groupedChunks.length - 1 ? 2 : 1,
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
          );
        }}
      />
      <Box display="flex" flexDirection="column" width={32}>
        {alphabet.map((x) => {
          const groupIndex = groups.indexOf(x);
          return (
            <ButtonBase
              disabled={groupIndex === -1}
              key={x}
              onClick={handleScroll(firstItemsIndexes[groupIndex])}
              sx={(theme) => ({
                flex: 1,
                opacity: groupIndex === -1 ? 0.2 : 1,
                borderTopRightRadius: theme.shape.borderRadius,
                borderBottomRightRadius: theme.shape.borderRadius,
              })}
            >
              {x}
            </ButtonBase>
          );
        })}
      </Box>
    </Box>
  );
}
