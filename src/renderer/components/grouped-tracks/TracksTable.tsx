/* eslint-disable react/no-array-index-key */
/* eslint-disable react/jsx-props-no-spreading */
import AddIcon from '@mui/icons-material/Add';
import CheckIcon from '@mui/icons-material/Check';
import {
  Box,
  Chip,
  Fab,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  styled,
  useTheme,
} from '@mui/material';
import { TFunction } from 'i18next';
import _ from 'lodash';
import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { TableComponents, TableVirtuoso } from 'react-virtuoso';
import { Track } from 'renderer/types';
import TrackImage from '../tracks/TrackImage';
import AlphabeticJumpBar from './AlphabeticJumpBar';

export type ColumnName = 'title' | 'artist' | 'duration' | 'album' | 'genre';

export type TrackNavigationRoute = {
  type: 'artists' | 'albums' | 'genres';
  name: string;
};

export type ConfigProps = {
  hiddenColumns?: ColumnName[];
  queuedTracks: number[];
  currentlyPlaying: number | undefined;
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

type ActionCellProps = {
  text: string | null | undefined;
  onClick: () => void;
};

function ActionCell({ text, onClick }: ActionCellProps) {
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
    name: 'artist',
    txName: 'components.track_list.artist',
    renderContent: (track, onNavigate) => (
      <>
        {track.artist.map((x, i) => (
          <ActionCell
            key={i.toString()}
            text={x}
            onClick={() => onNavigate({ type: 'artists', name: x })}
          />
        ))}
      </>
    ),
    offsetHeader: true,
  },
  {
    name: 'album',
    txName: 'components.track_list.album',
    renderContent: (track, onNavigate) => (
      <ActionCell
        text={track.album}
        onClick={() => onNavigate({ type: 'albums', name: track.album! })}
      />
    ),
    offsetHeader: true,
  },
  {
    name: 'genre',
    txName: 'components.track_list.genre',
    renderContent: (track, onNavigate) => (
      <>
        {track.genre.map((x, i) => (
          <ActionCell
            key={i.toString()}
            text={x}
            onClick={() => onNavigate({ type: 'genres', name: x })}
          />
        ))}
      </>
    ),
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
        <TableCell variant="head" style={{ backgroundColor: bgColor }}>
          {t('components.track_list.title')}
        </TableCell>
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
  {
    hiddenColumns,
    onAddToQueue,
    onNavigate,
    queuedTracks,
    currentlyPlaying,
  }: ConfigProps,
  t: TFunction
) {
  const queuePosition = _.indexOf(queuedTracks, row.id);
  const queued = queuePosition > -1;
  const playing = currentlyPlaying === row.id;
  const buttonText = (() => {
    if (queued) {
      return `${t('components.track_list.pos')} ${queuePosition + 1}`;
    }

    if (playing) {
      return t('components.track_list.playing');
    }

    return t('components.track_list.waitlist');
  })();

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
          disabled={queued || playing}
        >
          {queued ? <CheckIcon sx={{ mr: 1 }} /> : <AddIcon sx={{ mr: 1 }} />}
          <span style={{ flex: 1, textAlign: 'left' }}>{buttonText}</span>
        </Fab>
      </TableCell>

      <TableCell>
        <Box display="flex" alignItems="center">
          <TrackImage size={48} track={row} forceSize />
          <Box ml={2}>{row.title}</Box>
        </Box>
      </TableCell>

      {columns
        .filter((x) => !hiddenColumns?.includes(x.name))
        .map(({ name, renderContent }) => (
          <TableCell key={name}>{renderContent(row, onNavigate)}</TableCell>
        ))}
    </>
  );
}

const createJumpTable = (tracks: Track[]) => {
  const jumpTable: Record<string, number> = {};

  let lastBeginLetter = '';
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < tracks.length; ++i) {
    const track = tracks[i];

    const startLetter = track.title[0].toUpperCase();
    if (lastBeginLetter !== startLetter) {
      lastBeginLetter = startLetter;
      jumpTable[startLetter] = i;
    }
  }

  return jumpTable;
};

const NoScrollbarTable = styled(TableVirtuoso)({
  '::-webkit-scrollbar': { display: 'none' },
});

export default function TracksTable({ tracks, ...configProps }: Props) {
  const theme = useTheme();
  const { t } = useTranslation();
  const virtuoso = useRef(null);
  const jumpTable = createJumpTable(tracks);

  const handleScroll = (index: number) => {
    (virtuoso.current as any)?.scrollToIndex({
      index,
    });
  };

  return (
    <Box display="flex" flexDirection="row" flex={1} width="100%" height="100%">
      <NoScrollbarTable
        ref={virtuoso}
        data={tracks}
        // @ts-ignore
        components={VirtuosoTableComponents}
        fixedHeaderContent={createFixedHeaderContent(configProps)}
        // @ts-ignore
        itemContent={(index, data) => rowContent(index, data, configProps, t)}
        style={{ borderRadius: theme.shape.borderRadius * 2, flex: 1 }}
      />
      <AlphabeticJumpBar
        groups={Object.keys(jumpTable)}
        handleScroll={(index) => handleScroll(Object.values(jumpTable)[index])}
      />
    </Box>
  );
}
