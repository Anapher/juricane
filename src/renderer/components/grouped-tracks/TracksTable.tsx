/* eslint-disable react/jsx-props-no-spreading */
import AddIcon from '@mui/icons-material/Add';
import {
  ButtonBase,
  Fab,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useTheme,
} from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { TableComponents, TableVirtuoso } from 'react-virtuoso';
import { Track } from 'renderer/types';
import { formatSeconds } from 'renderer/utils/duration';

export type ColumnName = 'title' | 'artist' | 'duration' | 'album' | 'genre';

type Column = {
  name: ColumnName;
  txName: string;
  renderContent: (track: Track) => React.ReactNode;
  offsetHeader?: boolean;
  width?: number;
};

function renderActionCell(text?: string | null) {
  if (!text) {
    return null;
  }
  return (
    <ButtonBase
      sx={() => ({
        py: 1,
        px: 2,
        backgroundColor: 'action.hover',
        borderRadius: 8,
        justifyContent: 'flex-start',
        boxShadow: 1,
      })}
    >
      <Typography variant="body2">{text}</Typography>
    </ButtonBase>
  );
}

const columns: Column[] = [
  {
    name: 'title',
    txName: 'components.track_list.title',
    renderContent: (track) => track.title,
  },
  {
    name: 'artist',
    txName: 'components.track_list.artist',
    renderContent: (track) => renderActionCell(track.artist),
    offsetHeader: true,
  },
  {
    name: 'album',
    txName: 'components.track_list.album',
    renderContent: (track) => renderActionCell(track.album),
    offsetHeader: true,
  },
  {
    name: 'genre',
    txName: 'components.track_list.genre',
    renderContent: (track) => renderActionCell(track.genre),
    width: 160,
    offsetHeader: true,
  },
  {
    name: 'duration',
    txName: 'components.track_list.duration',
    renderContent: (track) => formatSeconds(track.duration),
    width: 160,
    offsetHeader: true,
  },
];

function createFixedHeaderContent(hiddenColumns: ColumnName[]) {
  // eslint-disable-next-line react/function-component-definition
  return () => {
    const { t } = useTranslation();
    const bgColor = 'rgb(51 51 51)';

    return (
      <TableRow>
        <TableCell
          variant="head"
          style={{ width: 140, backgroundColor: bgColor }}
        />
        {columns
          .filter((x) => !hiddenColumns.includes(x.name))
          .map(({ name, txName, width, offsetHeader }) => (
            <TableCell
              key={name}
              variant="head"
              style={{ width, backgroundColor: bgColor }}
            >
              <span style={{ marginLeft: offsetHeader ? 16 : 0 }}>
                {t(txName as any)}
              </span>
            </TableCell>
          ))}
      </TableRow>
    );
  };
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

function rowContent(_index: number, row: Track, hiddenColumns: ColumnName[]) {
  return (
    <>
      <TableCell>
        <Fab
          variant="extended"
          size="small"
          color="primary"
          aria-label="add"
          sx={{ zIndex: 0 }}
        >
          <AddIcon sx={{ mr: 1 }} />
          Waitlist
        </Fab>
      </TableCell>

      {columns
        .filter((x) => !hiddenColumns.includes(x.name))
        .map(({ name, renderContent }) => (
          <TableCell key={name}>{renderContent(row)}</TableCell>
        ))}
    </>
  );
}

type ConfigProps = {
  hiddenColumns?: ColumnName[];
};

type Props = ConfigProps & {
  tracks: Track[];
};

export default function TracksTable({ tracks, hiddenColumns = [] }: Props) {
  const theme = useTheme();

  return (
    <TableVirtuoso
      data={tracks}
      components={VirtuosoTableComponents}
      fixedHeaderContent={createFixedHeaderContent(hiddenColumns)}
      itemContent={(index, data) => rowContent(index, data, hiddenColumns)}
      style={{ borderRadius: theme.shape.borderRadius * 2 }}
    />
  );
}
