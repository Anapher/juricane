import { M3uTrack } from './m3u-parser';

export type M3uPlaylist = {
  path: string;
  tracks: M3uTrack[];
};

export default async function loadAllPlaylistsFromDirectory(
  directory: string
): Promise<M3uPlaylist[]> {
  console.log(directory);
  return [];
  // const playlistFiles = await glob(`${directory}/**/*.m3u`);

  // const playlistStrings = await Promise.all(
  //   playlistFiles.map(
  //     async (p) => [p, await fs.readFile(p, 'utf8')] as [string, string]
  //   )
  // );

  // return playlistStrings.map((x) => {
  //   const [filePath, content] = x;
  //   const tracks = parseM3uFile(content);
  //   const playlistDir = path.dirname(filePath);

  //   return {
  //     path: filePath,
  //     tracks: tracks.map((track) => ({
  //       ...track,
  //       path: path.isAbsolute(track.path)
  //         ? track.path
  //         : path.normalize(
  //             `${playlistDir}/${track.path.replaceAll('\\', '/')}`
  //           ),
  //     })),
  //   };
  // });
}
