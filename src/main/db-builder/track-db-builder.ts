import glob from 'fast-glob';
import fs from 'fs/promises';
import _ from 'lodash';
import path from 'node:path';
import { CategoryInfo, MusicLibrary, Track, TrackDb } from 'renderer/types';
import { TRACK_IMAGES_DIR } from '../../consts';
import loadMusicTags from '../playlist-loader/music-tag-loader';

const TRACK_DB_FILE_NAME = 'trackdb.json';

export async function loadTrackDb(dir: string): Promise<TrackDb> {
  const fileContent = await fs.readFile(`${dir}/${TRACK_DB_FILE_NAME}`, 'utf8');
  return JSON.parse(fileContent);
}

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
          previewImageTrackIds: _.chain(entries)
            .filter((x) => x.hasImage)
            .map((x) => x.id)
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

export default async function buildTrackDb(dir: string): Promise<void> {
  const trackFiles = await glob(`${dir.replaceAll(path.sep, '/')}/**/*.mp3`);
  const tracksImageDir = `${dir.replaceAll(path.sep, '/')}/${TRACK_IMAGES_DIR}`;
  try {
    await fs.mkdir(tracksImageDir);
  } catch (error) {
    // ignore
  }

  await Promise.all(
    (
      await fs.readdir(tracksImageDir)
    ).map((x) => fs.rm(`${tracksImageDir}/${x}`))
  );

  const tracks = [];

  // eslint-disable-next-line no-restricted-syntax
  for (const file of trackFiles) {
    try {
      // eslint-disable-next-line no-await-in-loop
      const [track, image] = await loadMusicTags(file, tracks.length);

      if (image) {
        fs.writeFile(`${tracksImageDir}/${tracks.length}.png`, image);
      }
      tracks.push(track);
    } catch (error) {
      // ignore
      // eslint-disable-next-line no-console
      console.error(error);
    }
  }

  // const tracks = Array.from({ length: 50000 }).map<Track>((__, id) => ({
  //   id,
  //   album: 'Whitney',
  //   artist: 'Whitney Houston',
  //   genre: 'Dance',
  //   title: 'I Wanna Dance With Somebody (Who Loves Me)',
  //   year: 1987,
  //   url: '/Users/vgriebel/Documents/github/juricane/test_music/Musik/Album_2/The White Stripes - Seven Nation Army.mp3',
  //   duration: 231,
  // }));

  const db: TrackDb = { tracks, ...generateMusicLibraryCategories(tracks) };
  await fs.writeFile(`${dir}/${TRACK_DB_FILE_NAME}`, JSON.stringify(db));
}
