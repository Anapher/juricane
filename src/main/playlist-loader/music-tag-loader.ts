import nodeid3 from 'node-id3';
import { Track } from 'renderer/types';

const artistSeparators = [
  ' featuring ',
  ' ft\\. ',
  ' ft ',
  ' feat\\. ',
  ' feat ',
  ' & ',
];

export function splitArtist(artist: string) {
  return artist
    .split(new RegExp(artistSeparators.join('|'), 'g'))
    .map((x) => x.trim());
}

export default async function loadMusicTags(
  path: string,
  id: number
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
      artist: tags.artist ? splitArtist(tags.artist) : [],
      genre: tags.genre,
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
