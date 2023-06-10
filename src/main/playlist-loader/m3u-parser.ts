const HEADER = '#EXTM3U';
const META_INFO = '#EXTINF:';

export type M3uTrack = {
  title: string;
  path: string;
  durationInSeconds: number;
};

function parsePlaylistEntry(lines: [string, string]): M3uTrack {
  if (!lines[0].startsWith(META_INFO)) {
    throw new Error(`Line must start with ${META_INFO}`);
  }

  const splittedInfo = lines[0].split(',', 2);
  const title = splittedInfo[1];
  const durationInSeconds = Number(splittedInfo[0].substring(META_INFO.length));

  return {
    title,
    durationInSeconds,
    path: lines[1],
  };
}

export default function parseM3uFile(content: string): M3uTrack[] {
  const lines = content.split(/\r|\n/).filter((x) => Boolean(x));

  if (lines[0] !== HEADER) {
    throw new Error(`First line must be ${HEADER}`);
  }

  return Array.from({ length: (lines.length - 1) / 2 }).map((_, i) =>
    parsePlaylistEntry([lines[i * 2 + 1], lines[i * 2 + 2]])
  );
}
