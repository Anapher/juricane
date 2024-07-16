import { differenceInMilliseconds, parseISO } from 'date-fns';
import _ from 'lodash';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {
  useMusicLibrary,
  useOwnPlaylistConfig,
  useOwnPlaylists,
  useSaveOwnPlaylistConfig,
} from 'renderer/app/queries';
import { replaceWaitlist } from 'renderer/slices/music-player-slice';
import { OwnPlaylist, OwnPlaylistConfig } from 'renderer/types';

export function getNextScheduledPlaylist(
  ownPlaylists: OwnPlaylist[],
  ownPlaylistConfig: OwnPlaylistConfig
) {
  const scheduledPlaylists = ownPlaylistConfig.scheduledPlaylists
    .map((x) => ({
      ...x,
      playlist: ownPlaylists.find((y) => y.name === x.name),
    }))
    .filter((x) => !!x.playlist && parseISO(x.scheduledTime) > new Date());

  if (scheduledPlaylists.length === 0) {
    return null;
  }

  return _.sortBy(scheduledPlaylists, (x) => parseISO(x.scheduledTime))[0];
}

export default function useScheduledOwnPlaylist() {
  const dispatch = useDispatch();
  const { data: ownPlaylists } = useOwnPlaylists();
  const { data: ownPlaylistConfig } = useOwnPlaylistConfig();
  const { data: library } = useMusicLibrary();
  const mutateOwnPlaylistConfig = useSaveOwnPlaylistConfig();

  useEffect(() => {
    if (!ownPlaylists || !ownPlaylistConfig || !library) {
      return;
    }

    const nextScheduled = getNextScheduledPlaylist(
      ownPlaylists,
      ownPlaylistConfig
    );
    if (!nextScheduled) {
      return;
    }

    const timeoutToken = setTimeout(() => {
      mutateOwnPlaylistConfig.mutate({
        ...ownPlaylistConfig,
        scheduledPlaylists: ownPlaylistConfig.scheduledPlaylists.filter(
          (x) =>
            x.name !== nextScheduled.name &&
            parseISO(x.scheduledTime) > new Date()
        ),
      });
      dispatch(
        replaceWaitlist(
          nextScheduled.playlist!.trackIds.map((x) => library.tracks[x])
        )
      );
    }, differenceInMilliseconds(parseISO(nextScheduled.scheduledTime), new Date()));

    return () => {
      clearTimeout(timeoutToken);
    };
  }, [
    ownPlaylists,
    ownPlaylistConfig,
    dispatch,
    library,
    mutateOwnPlaylistConfig,
  ]);
}
