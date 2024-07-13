/* eslint-disable react/no-array-index-key */
/* eslint-disable react/jsx-props-no-spreading */
import {
  Paper,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  styled,
  useTheme,
} from '@mui/material';
import React, { useRef } from 'react';
import {
  TableComponents,
  TableVirtuoso,
  TableVirtuosoProps,
} from 'react-virtuoso';
import { Track } from 'renderer/types';
import AlphabeticJumpBar from './AlphabeticJumpBar';

interface Props<TItem> extends Partial<TableVirtuosoProps<TItem, any>> {
  items: TItem[];
  getItemName: (item: TItem) => string;
  disableJumpBar?: boolean;
}

const VirtuosoTableComponents: TableComponents<Track> = {
  Scroller: React.forwardRef<HTMLDivElement>((props, ref) => (
    <TableContainer component={Paper} {...props} ref={ref} />
  )),
  Table: (props) => (
    <Table
      {...props}
      sx={{
        borderCollapse: 'separate',
        tableLayout: 'fixed',
        backgroundColor: 'transparent',
      }}
    />
  ),
  TableHead,
  TableRow: ({ ...props }) => <TableRow {...props} />,
  TableBody: React.forwardRef<HTMLTableSectionElement>((props, ref) => (
    <TableBody {...props} ref={ref} />
  )),
};

function createJumpTable<T>(items: T[], getItemName: (item: T) => string) {
  const jumpTable: Record<string, number> = {};

  let lastBeginLetter = '';
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < items.length; ++i) {
    const item = items[i];

    const startLetter = getItemName(item).toUpperCase()[0];
    if (lastBeginLetter !== startLetter) {
      lastBeginLetter = startLetter;
      jumpTable[startLetter] = i;
    }
  }

  return jumpTable;
}

const NoScrollbarTable = styled(TableVirtuoso)({
  '::-webkit-scrollbar': { display: 'none' },
});

export default function VirtualizedJumpTable<T>({
  items,
  getItemName,
  disableJumpBar,
  ...other
}: Props<T>) {
  const theme = useTheme();
  const virtuoso = useRef(null);
  const jumpTable = createJumpTable(items, getItemName);

  const handleScroll = (index: number) => {
    (virtuoso.current as any)?.scrollToIndex({
      index,
    });
  };

  return (
    <Paper
      sx={{
        flex: 1,
        borderRadius: 3,
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        height: '100%',
      }}
      elevation={6}
    >
      <NoScrollbarTable
        ref={virtuoso}
        data={items}
        {...other}
        // @ts-ignore
        components={VirtuosoTableComponents}
        style={{ borderRadius: theme.shape.borderRadius * 2, flex: 1 }}
      />
      {!disableJumpBar && (
        <AlphabeticJumpBar
          groups={Object.keys(jumpTable)}
          handleScroll={(index) =>
            handleScroll(Object.values(jumpTable)[index])
          }
        />
      )}
    </Paper>
  );
}
