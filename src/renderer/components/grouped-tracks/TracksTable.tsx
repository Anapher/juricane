/* eslint-disable react/jsx-props-no-spreading */
import AddIcon from '@mui/icons-material/Add';
import {
  Chip,
  Fab,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useTheme,
} from '@mui/material';
import _ from 'lodash';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { TableComponents, TableVirtuoso } from 'react-virtuoso';
import { Track } from 'renderer/types';
import { formatSeconds } from 'renderer/utils/duration';
import CheckIcon from '@mui/icons-material/Check';

export type ColumnName = 'title' | 'artist' | 'duration' | 'album' | 'genre';

export type TrackNavigationRoute = {
  type: 'artists' | 'albums' | 'genres';
  name: string;
};

export type ConfigProps = {
  hiddenColumns?: ColumnName[];
  queuedTracks: number[];
  onAddToQueue: (track: Track) => void;
  onNavigate: (route: TrackNavigationRoute) => void;
};

type Props = ConfigProps & {
  tracks: Track[];
};

type Column = {
  name: ColumnName;
  txName: string;
  renderContent: (
    track: Track,
    onNavigate: (route: TrackNavigationRoute) => void
  ) => React.ReactNode;
  offsetHeader?: boolean;
  width?: number;
};

function renderActionCell(
  text: string | null | undefined,
  onClick: () => void
) {
  if (!text) {
    return null;
  }

  return (
    <Chip
      label={text}
      onClick={onClick}
      sx={{ backgroundColor: 'rgba(255, 255, 255, 0.03)' }}
    />
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
    renderContent: (track, onNavigate) =>
      renderActionCell(track.artist, () =>
        onNavigate({ type: 'artists', name: track.artist! })
      ),
    offsetHeader: true,
  },
  {
    name: 'album',
    txName: 'components.track_list.album',
    renderContent: (track, onNavigate) =>
      renderActionCell(track.album, () =>
        onNavigate({ type: 'albums', name: track.album! })
      ),
    offsetHeader: true,
  },
  {
    name: 'genre',
    txName: 'components.track_list.genre',
    renderContent: (track, onNavigate) =>
      renderActionCell(track.genre, () =>
        onNavigate({ type: 'genres', name: track.genre! })
      ),
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

function createFixedHeaderContent({ hiddenColumns }: ConfigProps) {
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
          .filter((x) => !hiddenColumns?.includes(x.name))
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

function rowContent(
  _index: number,
  row: Track,
  { hiddenColumns, onAddToQueue, onNavigate, queuedTracks }: ConfigProps
) {
  const queuePosition = _.indexOf(queuedTracks, row.id);
  const queued = queuePosition > -1;

  return (
    <>
      <TableCell>
        <Fab
          onClick={() => onAddToQueue(row)}
          variant="extended"
          size="small"
          color="primary"
          aria-label="add to waitlist"
          sx={{ zIndex: 0, width: 120 }}
          disabled={queued}
        >
          {queued ? <CheckIcon sx={{ mr: 1 }} /> : <AddIcon sx={{ mr: 1 }} />}
          <span style={{ flex: 1, textAlign: 'left' }}>
            {queued ? `Pos. ${queuePosition + 1}` : 'Waitlist'}
          </span>
        </Fab>
      </TableCell>

      {columns
        .filter((x) => !hiddenColumns?.includes(x.name))
        .map(({ name, renderContent }) => (
          <TableCell key={name}>{renderContent(row, onNavigate)}</TableCell>
        ))}
    </>
  );
}

export default function TracksTable({ tracks, ...configProps }: Props) {
  const theme = useTheme();

  return (
    <TableVirtuoso
      data={tracks}
      components={VirtuosoTableComponents}
      fixedHeaderContent={createFixedHeaderContent(configProps)}
      itemContent={(index, data) => rowContent(index, data, configProps)}
      style={{ borderRadius: theme.shape.borderRadius * 2 }}
    />
  );
}
