import fs from 'fs/promises';
import { MusicLibrary, OwnPlaylist } from 'renderer/types';
import path from 'node:path';
import { M3uTrack, createM3uFile } from './m3u-parser';

function getPlaylistPath(
  ownPlaylistDirectory: string,
  playlistName: string
): string {
  return path.join(ownPlaylistDirectory, `${playlistName}.m3u`);
}

// eslint-disable-next-line import/prefer-default-export
export async function writeOwnPlaylist(
  ownPlaylistDirectory: string,
  playlist: OwnPlaylist,
  library: MusicLibrary
) {
  const playlistPath = getPlaylistPath(ownPlaylistDirectory, playlist.name);
  const m3uFiles = playlist.trackIds.map<M3uTrack>((x) => ({
    path: library.tracks[x].url,
    title: library.tracks[x].title,
    durationInSeconds: library.tracks[x].duration,
  }));

  const content = createM3uFile(m3uFiles);
  // Creates /tmp/a/apple, regardless of whether `/tmp` and /tmp/a exist.
  await fs.mkdir(ownPlaylistDirectory, { recursive: true });
  await fs.writeFile(playlistPath, content);
}

export async function deleteOwnPlaylist(
  ownPlaylistDirectory: string,
  playlistName: string
) {
  const playlistPath = getPlaylistPath(ownPlaylistDirectory, playlistName);
  await fs.rm(playlistPath);
}
