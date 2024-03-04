import nodeid3 from 'node-id3';
import { Track } from 'renderer/types';

export function splitStr(str: string, separators: string[]) {
  return str.split(new RegExp(separators.join('|'), 'g')).map((x) => x.trim());
}

export default async function loadMusicTags(
  path: string,
  id: number,
  artistSeparators: string[],
  genreSeparators: string[]
): Promise<[Track, Buffer | undefined]> {
  const tags = nodeid3.read(path);

  const imageBuffer =
    (tags.image !== undefined &&
      typeof tags.image === 'object' &&
      tags.image.imageBuffer) ||
    undefined;

  return [
    {
      album: tags.album,
      artist: tags.artist ? splitStr(tags.artist, artistSeparators) : [],
      genre: tags.genre ? splitStr(tags.genre, genreSeparators) : [],
      title: tags.title || path,
      year: tags.year !== undefined ? Number(tags.year) : undefined,
      duration: 0,
      url: path,
      hasImage: Boolean(imageBuffer),
      id,
    },
    imageBuffer,
  ];
}
