/* eslint-disable no-await-in-loop */
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
  const groups = new Map<string, Track[]>();

  tracks.forEach((track) => {
    const value = track[property];

    const addTrackToGroup = (group: string) => {
      let groupTracks = groups.get(group);
      if (!groupTracks) {
        groups.set(group, (groupTracks = []));
      }
      groupTracks.push(track);
    };

    if (Array.isArray(value)) {
      value.forEach((val) => {
        addTrackToGroup(val);
      });
    } else {
      addTrackToGroup(value as string);
    }
  });

  return Object.fromEntries(
    _.chain([...groups.entries()])
      .filter(([name]) => !!name)
      .map<[string, CategoryInfo]>(([name, entries]) => [
        encodeURIComponent(name),
        {
          id: encodeURIComponent(name),
          name,
          trackIds: _(entries)
            .orderBy((x) => x.title)
            .map((x) => x.id)
            .value(),
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

export default async function buildTrackDb(
  dir: string,
  artistSeparators: string[],
  genreSeparators: string[]
): Promise<void> {
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
      const id = tracks.length;

      const [track, image] = await loadMusicTags(
        file,
        id,
        artistSeparators,
        genreSeparators
      );

      if (image) {
        await fs.writeFile(`${tracksImageDir}/${id}.png`, image);
      }
      tracks.push(track);
    } catch (error) {
      // ignore
      // eslint-disable-next-line no-console
      console.error(`Error while trying to load file ${file}`);
      console.error(error);
    }
  }

  const db: TrackDb = { tracks, ...generateMusicLibraryCategories(tracks) };
  await fs.writeFile(`${dir}/${TRACK_DB_FILE_NAME}`, JSON.stringify(db));
}
