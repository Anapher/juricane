import { useMusicLibrary } from 'renderer/app/queries';
import { MusicLibrary, Playlist, Track } from 'renderer/types';

export type PlaylistModel = Omit<Playlist, 'tracks'> & {
  tracks: Track[];
};

export const selectPlaylist = (
  library: MusicLibrary,
  playlist: Playlist
): PlaylistModel => {
  return {
    ...playlist,
    tracks: playlist.tracks
      .map((x) => library.tracks[x])
      .filter((x): x is Track => !!x),
  };
};

export const usePlaylists = () => {
  const { data } = useMusicLibrary();
  if (!data) return [];

  return data.playlists.map((x) => selectPlaylist(data, x));
};
