import path from 'node:path';
import { MusicLibrary, Track } from 'renderer/types';
import loadMusicTags from './music-tag-loader';
import { M3uPlaylist } from './playlist-loader';

export default function buildMusicLibrary(
  playlists: M3uPlaylist[]
): MusicLibrary {
  const allTracks = playlists.flatMap((x) => x.tracks);
  const trackMap: Record<string, Track> = {};

  allTracks.forEach((track) => {
    if (trackMap[track.path]) return;

    try {
      trackMap[track.path] = loadMusicTags(track);
    } catch (error) {
      console.warn(`Error on loading '${track.path}': ${error}`);
    }
  });

  return {
    tracks: trackMap,
    playlists: playlists.map((x) => ({
      name: path.basename(x.path, path.extname(x.path)),
      tracks: x.tracks.map((t) => t.path),
      url: x.path,
    })),
  };
}
