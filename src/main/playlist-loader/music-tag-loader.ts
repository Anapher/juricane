import nodeid3 from 'node-id3';

export default function loadMusicTags(path: string) {
  const tags = nodeid3.read(path);
  console.log(tags);
}
