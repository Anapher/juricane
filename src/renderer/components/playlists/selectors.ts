import { RootState } from 'renderer/app/store';
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

export const selectPlaylists = (state: RootState) => {
  if (!state.musicPlayer.library) return [];
  const { library } = state.musicPlayer;

  return state.musicPlayer.library.playlists.map((x) =>
    selectPlaylist(library, x)
  );
};
