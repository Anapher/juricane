import _ from 'lodash';
import path from 'node:path';
import { CategoryInfo, MusicLibrary, Track } from 'renderer/types';
import loadMusicTags from './music-tag-loader';
import { M3uPlaylist } from './playlist-loader';

function generateCategory(
  tracks: Track[],
  property: keyof Track
): Record<string, CategoryInfo> {
  return Object.fromEntries(
    _.chain(tracks)
      .groupBy(property)
      .entries()
      .filter(([name]) => !!name)
      .map<[string, CategoryInfo]>(([name, entries]) => [
        encodeURIComponent(name),
        {
          id: encodeURIComponent(name),
          name,
          trackIds: entries.map((x) => x.id),
          previewImageBase64: _.chain(entries)
            .map((x) => x.imageBase64)
            .filter((x): x is string => !!x)
            .take(4)
            .value(),
        },
      ])
      .value()
  );
}

function generateMusicLibraryCategories(
  tracks: Track[]
): Omit<MusicLibrary, 'tracks' | 'playlists'> {
  return {
    albums: generateCategory(tracks, 'album'),
    genres: generateCategory(tracks, 'genre'),
    artists: generateCategory(tracks, 'artist'),
  };
}

export default function buildMusicLibrary(
  playlists: M3uPlaylist[]
): MusicLibrary {
  const allTracks = playlists.flatMap((x) => x.tracks);

  const tracks: Track[] = [];
  const processedTracks = new Map<string, number>();

  allTracks.forEach((track) => {
    if (processedTracks.has(track.path)) return;

    try {
      const id = tracks.length;
      tracks.push(loadMusicTags(track, id));
      processedTracks.set(track.path, id);
    } catch (error) {
      console.warn(`Error on loading '${track.path}': ${error}`);
      processedTracks.set(track.path, -1);
    }
  });

  return {
    tracks,
    playlists: playlists.map((playlist, id) => ({
      name: path.basename(playlist.path, path.extname(playlist.path)),
      trackIds: playlist.tracks
        .map((t) => processedTracks.get(t.path))
        .filter((x): x is number => x !== -1),
      id: id.toString(),
      previewImageBase64: _.chain(playlist.tracks)
        .map((x) => {
          const t = processedTracks.get(x.path);
          console.log(t);

          return t && t > -1 && tracks[t].imageBase64;
        })
        .filter((x): x is string => !!x)
        .take(4)
        .value(),
    })),
    ...generateMusicLibraryCategories(tracks),
  };
}
