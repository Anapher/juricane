import nodeid3 from 'node-id3';
import { Track } from 'renderer/types';
import { M3uTrack } from './m3u-parser';

export default function loadMusicTags(m3uTrack: M3uTrack, id: number): Track {
  const tags = nodeid3.read(m3uTrack.path);

  const imageBase64 =
    tags.image !== undefined &&
    typeof tags.image === 'object' &&
    tags.image.imageBuffer.toString('base64');

  return {
    album: tags.album,
    artist: tags.artist,
    genre: tags.genre,
    title: tags.title || m3uTrack.title,
    year: tags.year !== undefined ? Number(tags.year) : undefined,
    imageBase64: imageBase64 || undefined,
    duration: m3uTrack.durationInSeconds,
    url: m3uTrack.path,
    id,
  };
}
