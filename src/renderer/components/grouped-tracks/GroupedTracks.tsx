/* eslint-disable react/no-unstable-nested-components */
import styled from '@emotion/styled';
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
} from '@mui/material';
import _ from 'lodash';
import { useMemo, useRef, ReactNode } from 'react';
import { GroupedVirtuoso } from 'react-virtuoso';
import { CategoryInfo } from 'renderer/types';
import TrackListPreview from '../track-list-preview/TrackListPreview';
import AlphabeticJumpBar from './AlphabeticJumpBar';

const GROUPS_PER_ROW = 6;

type Props = {
  items: CategoryInfo[];
  onNavigateToGroup: (group: CategoryInfo) => void;
  groupSelector: _.ValueIteratee<CategoryInfo>;
  showJumpBar?: boolean;
  mapCustomCardContent?: (id: string) => ReactNode | undefined;
  sortGroupsBy?: _.Many<_.ListIteratee<[string, CategoryInfo[][][]]>>;
};

export const createData = (
  items: CategoryInfo[],
  propSelector: _.ValueIteratee<CategoryInfo>,
  sortGroupsBy: _.Many<_.ListIteratee<[string, CategoryInfo[][][]]>>
) => {
  const sortedItems = _.sortBy(items, (x) => x.name);
  const groupedItems = _.groupBy(sortedItems, propSelector);

  // @ts-ignore
  const groupedChunks = _.sortBy(
    Object.entries(groupedItems).map(([k, v]) => [
      k,
      _.chunk(v, GROUPS_PER_ROW),
    ]) as [string, CategoryInfo[][][]],
    sortGroupsBy
  );

  const groupCounts = groupedChunks.map((x) => x[1].length);
  const groups = groupedChunks.map((x) => x[0] as string);

  return {
    groupedChunks: _.flatMap(
      groupedChunks.map((x) => x[1] as CategoryInfo[][]),
      (x) => x
    ),
    groupCounts,
    groups,
  };
};

const NoScrollBarGroupedVirtuoso = styled(GroupedVirtuoso)({
  '::-webkit-scrollbar': { display: 'none' },
});

export default function GroupedTracks({
  items,
  onNavigateToGroup,
  groupSelector,
  showJumpBar,
  mapCustomCardContent,
  sortGroupsBy = (x) => x[0],
}: Props) {
  const { groupedChunks, groupCounts, groups } = useMemo(
    () => createData(items, groupSelector, sortGroupsBy),
    [items, groupSelector, sortGroupsBy]
  );

  const virtuoso = useRef(null);
  const handleScroll = (index: number) => {
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

  const ListComponent = showJumpBar
    ? NoScrollBarGroupedVirtuoso
    : GroupedVirtuoso;

  return (
    <Box flex={1} display="flex" width="100%" my={2} mx={1}>
      <ListComponent
        ref={virtuoso}
        groupCounts={groupCounts}
        style={{
          flex: 1,
          width: '100%',
        }}
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
                  {mapCustomCardContent?.(group.id) || (
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
                  )}
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
      {showJumpBar && (
        <AlphabeticJumpBar
          groups={groups}
          handleScroll={(index) => handleScroll(firstItemsIndexes[index])}
        />
      )}
    </Box>
  );
}
