import fs from 'fs/promises';
import { glob } from 'glob';
import path from 'node:path';
import parseM3uFile from './m3u-parser';

export default async function loadAllPlaylistsFromDirectory(directory: string) {
  const playlistFiles = await glob(`${directory}/**/*.m3u`);

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
        path: path.isAbsolute(track.path)
          ? track.path
          : path.normalize(
              `${playlistDir}/${track.path.replaceAll('\\', '/')}`
            ),
      })),
    };
  });
}
