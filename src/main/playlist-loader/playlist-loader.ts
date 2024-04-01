import glob from 'fast-glob';
import fs from 'fs/promises';
import _ from 'lodash';
import path from 'node:path';
import { CategoryInfo, TrackDb } from 'renderer/types';
import { normalizePath } from '../path-utils';
import parseM3uFile, { M3uTrack } from './m3u-parser';

export type M3uPlaylist = {
  path: string;
  tracks: M3uTrack[];
};

export default async function loadAllPlaylistsFromDirectory(
  directory: string
): Promise<M3uPlaylist[]> {
  const playlistFiles = await glob(
    `${directory.replaceAll(path.sep, '/')}/**/*.m3u`
  );

  const playlistStrings = await Promise.all(
    playlistFiles.map(
      async (p) => [p, await fs.readFile(p, 'utf8')] as [string, string]
    )
  );

  return playlistStrings.map((x) => {
    const [filePath, content] = x;
    const tracks = parseM3uFile(content);
    const playlistDir = path.dirname(filePath);

    return {
      path: filePath,
      tracks: tracks.map((track) => ({
        ...track,
        path: normalizePath(track.path, playlistDir),
      })),
    };
  });
}

export function createCategoryInfoForPlaylists(
  playlists: M3uPlaylist[],
  db: TrackDb,
  baseDir: string
): CategoryInfo[] {
  const tracksIndex = new Map<string, [number, boolean]>();
  db.tracks.forEach((v) => {
    tracksIndex.set(normalizePath(v.url, baseDir), [v.id, v.hasImage]);
  });

  return playlists.map(({ path: p, tracks }, i) => ({
    id: i.toString(),
    name: path.basename(p, path.extname(p)),
    previewImageTrackIds: _(tracks)
      .map((x) => tracksIndex.get(x.path))
      .filter((x): x is [number, boolean] => x !== undefined && x[1])
      .map(([id]) => id)
      .take(4)
      .value(),
    trackIds: _(tracks)
      .map((x) => tracksIndex.get(x.path)?.[0])
      .filter((x): x is number => x !== undefined)
      .sortBy((x) => db.tracks[x].title)
      .value(),
    group: path.basename(path.dirname(p)),
  }));
}
