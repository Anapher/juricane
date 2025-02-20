import {
  Box,
  Button,
  ButtonGroup,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Fab,
  Paper,
  Typography,
} from '@mui/material';
import { StaticTimePicker } from '@mui/x-date-pickers';
import {
  addDays,
  addHours,
  addSeconds,
  formatDistanceToNow,
  formatDistanceToNowStrict,
  formatISO,
  isPast,
  parseISO,
} from 'date-fns';
import { de } from 'date-fns/locale';
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  useConfig,
  useDeleteOwnPlaylist,
  useMusicLibrary,
  useOwnPlaylistConfig,
  useOwnPlaylists,
  useSaveOwnPlaylistConfig,
  useUpdateOwnPlaylist,
} from 'renderer/app/queries';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentPlaylist } from 'renderer/slices/music-player-slice';
import { RootState } from 'renderer/app/store';
import Tracks from '../tracks/Tracks';
import EditOwnPlaylistDialog from './EditOwnPlaylistDialog';

function getTimeInFuture(date: Date) {
  if (isPast(date)) {
    return addDays(date, 1);
  }
  return date;
}

function RelativeTime({ scheduledTime }: { scheduledTime: string }) {
  const [result, setResult] = useState(
    formatDistanceToNowStrict(parseISO(scheduledTime), {
      locale: de,
    })
  );

  useEffect(() => {
    const token = setInterval(() => {
      setResult(
        formatDistanceToNowStrict(parseISO(scheduledTime), {
          locale: de,
        })
      );
    }, 1000);
    return () => {
      clearInterval(token);
    };
  }, [scheduledTime]);

  return result;
}

export default function OwnPlaylist() {
  const { id } = useParams();
  const playlistUrl = `/playlists/own/${id}`;

  const { data: config } = useConfig();
  const { data: library } = useMusicLibrary();
  const { data: ownPlaylists } = useOwnPlaylists();

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const handleEditPlaylist = () => {
    setEditDialogOpen(true);
  };

  const updatePlaylist = useUpdateOwnPlaylist();
  const deletePlaylist = useDeleteOwnPlaylist();
  const { data: playlistConfig } = useOwnPlaylistConfig();
  const playlistConfigMutation = useSaveOwnPlaylistConfig();
  const [playDialogOpen, setPlayDialogOpen] = useState(false);
  const [scheduledPlaylistOpen, setScheduledPlaylistOpen] = useState(false);
  const [selectedScheduledDate, setSelectedScheduledDate] =
    useState<Date | null>(new Date());

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const currentPlaylist = useSelector(
    (state: RootState) => state.musicPlayer.currentPlaylist
  );

  const ownPlaylist = ownPlaylists?.find((x) => x.name === id);
  const ownPlaylistRef = useRef(ownPlaylist);
  ownPlaylistRef.current = ownPlaylist;

  useEffect(() => {
    return () => {
      if (ownPlaylistRef.current?.trackIds.length === 0) {
        deletePlaylist.mutate(ownPlaylistRef.current.name);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!ownPlaylists || !library || !playlistConfig || !ownPlaylist) {
    return null;
  }

  const scheduleConfig = playlistConfig.scheduledPlaylists.find(
    (x) => x.name === ownPlaylist.name
  );

  const handleUpdatePlaylist = (trackIds: number[]) => {
    updatePlaylist.mutate({ name: ownPlaylist.name, trackIds });
    setEditDialogOpen(false);
  };

  const tracks = ownPlaylist.trackIds
    .map((x) => library.tracks[x])
    .filter((x) => !!x);

  const handlePlay = (playAt: Date) => {
    playlistConfigMutation.mutate({
      ...playlistConfig,
      scheduledPlaylists: [
        ...playlistConfig.scheduledPlaylists.filter(
          (x) => x.name !== ownPlaylist.name
        ),
        {
          name: ownPlaylist.name,
          scheduledTime: formatISO(playAt),
        },
      ],
    });
    navigate('/');
  };

  const handleRemoveFromSchedule = () => {
    playlistConfigMutation.mutate({
      ...playlistConfig,
      scheduledPlaylists: [
        ...playlistConfig.scheduledPlaylists.filter(
          (x) => x.name !== ownPlaylist.name
        ),
      ],
    });
  };

  const handleOpenTimerDialog = () => {
    setScheduledPlaylistOpen(true);
    setSelectedScheduledDate(addHours(new Date(), 1));
  };

  const setPlaylistAsCurrent = () => {
    dispatch(
      setCurrentPlaylist({
        url: playlistUrl,
        name: ownPlaylist.name,
        tracks,
      })
    );
  };

  return (
    <Box
      flex={1}
      display="flex"
      m={2}
      mr={1}
      flexDirection="column"
      position="relative"
    >
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h6" align="center">
          {ownPlaylist.name}
        </Typography>
        {scheduleConfig && (
          <Typography variant="caption">
            Spielt automatisch in{' '}
            <RelativeTime scheduledTime={scheduleConfig.scheduledTime} />
          </Typography>
        )}
        <ButtonGroup size="small" variant="contained">
          <Button onClick={() => setPlayDialogOpen(true)}>
            Abspielen durch Warteschlange
          </Button>
          <Button onClick={handleOpenTimerDialog}>Timer</Button>
          <Button onClick={handleEditPlaylist}>Bearbeiten</Button>
          {scheduleConfig && (
            <Button color="secondary" onClick={handleRemoveFromSchedule}>
              Timer löschen
            </Button>
          )}
        </ButtonGroup>
      </Box>
      <Fab
        color="primary"
        aria-label="play"
        onClick={setPlaylistAsCurrent}
        disabled={currentPlaylist?.url === playlistUrl}
        size="medium"
        sx={{ position: 'absolute', left: 16, top: 44 }}
      >
        <PlayArrowIcon />
      </Fab>
      <EditOwnPlaylistDialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        playlist={ownPlaylist}
        onSave={handleUpdatePlaylist}
      />
      <Paper sx={{ flex: 1, mt: 1, borderRadius: 3 }} elevation={6}>
        <Tracks tracks={tracks} disableJumpBar />
      </Paper>
      <Dialog open={playDialogOpen} onClose={() => setPlayDialogOpen(false)}>
        <DialogTitle>Playlist an Warteschlange anhängen</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Sind Sie sicher, dass Sie in{' '}
            <b>{config?.playOwnPlaylistNowDelaySeconds} Sekunden</b> alle Songs
            der Playlist {ownPlaylist.name} vorne an die Warteschlange anfügen,
            und den ersten Song automatisch abspielen wollen?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPlayDialogOpen(false)}>Abbrechen</Button>
          <Button
            onClick={() =>
              handlePlay(
                addSeconds(
                  new Date(),
                  config?.playOwnPlaylistNowDelaySeconds ?? 10
                )
              )
            }
            autoFocus
          >
            Abspielen
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={scheduledPlaylistOpen}
        onClose={() => setScheduledPlaylistOpen(false)}
      >
        <DialogTitle>Playlist planen (Warteschlange ersetzen)</DialogTitle>
        <DialogContent>
          <StaticTimePicker
            autoFocus
            sx={{ backgroundColor: 'transparent' }}
            ampm={false}
            localeText={{ toolbarTitle: '' }}
            slots={{ actionBar: () => null }}
            value={selectedScheduledDate}
            onChange={(value) => setSelectedScheduledDate(value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setScheduledPlaylistOpen(false)}>
            Abbrechen
          </Button>
          <Button
            onClick={() =>
              handlePlay(getTimeInFuture(selectedScheduledDate || new Date()))
            }
            disabled={!selectedScheduledDate}
          >
            In{' '}
            {selectedScheduledDate &&
              formatDistanceToNow(getTimeInFuture(selectedScheduledDate), {
                locale: de,
              })}{' '}
            abspielen
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
