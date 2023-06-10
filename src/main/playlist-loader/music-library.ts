import loadMusicTags from './music-tag-loader';
import { M3uPlaylist } from './playlist-loader';

export default function buildMusicLibrary(playlists: M3uPlaylist[]) {
  const allTracks = playlists.flatMap((x) => x.tracks);
  const trackMap: { [path: string]: any } = {};

  allTracks.forEach((track) => {
    if (trackMap[track.path]) return;

    trackMap[track.path] = loadMusicTags(track.path);
  });
}
