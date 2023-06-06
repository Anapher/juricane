export type Track = {
  title: string;
  url: string;
  artist: string;
  duration: number;
};

export type Playlist = {
  tracks: Track[];
  name: string;
  url: string;
};
