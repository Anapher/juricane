import { Alert } from '@mui/material';
import { formatDistanceToNowStrict, parseISO } from 'date-fns';
import { de } from 'date-fns/locale';
import { useEffect, useState } from 'react';
import { useOwnPlaylistConfig, useOwnPlaylists } from 'renderer/app/queries';
import { getNextScheduledPlaylist } from '../playlists/useScheduledOwnPlaylist';

export default function ScheduledPlaylistInfo() {
  const { data: ownPlaylists } = useOwnPlaylists();
  const { data: ownPlaylistConfig } = useOwnPlaylistConfig();
  const [scheduledPlaylist, setScheduledPlaylist] = useState<{
    name: string;
    distance: string;
  } | null>(null);

  useEffect(() => {
    if (!ownPlaylists || !ownPlaylistConfig) {
      return;
    }

    const nextScheduledPlaylist = getNextScheduledPlaylist(
      ownPlaylists,
      ownPlaylistConfig
    );
    if (!nextScheduledPlaylist) {
      setScheduledPlaylist(null);
      return;
    }

    const token = setInterval(() => {
      setScheduledPlaylist({
        name: nextScheduledPlaylist.name,
        distance: formatDistanceToNowStrict(
          parseISO(nextScheduledPlaylist.scheduledTime),
          {
            locale: de,
          }
        ),
      });
    }, 1000);

    return () => {
      clearInterval(token);
    };
  }, [ownPlaylists, ownPlaylistConfig]);

  if (!scheduledPlaylist) {
    return null;
  }

  return (
    <Alert variant="filled" severity="info">
      Nächste Playlist: {scheduledPlaylist.name} in {scheduledPlaylist.distance}
    </Alert>
  );
}
