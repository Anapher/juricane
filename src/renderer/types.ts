export type Track = {
  title: string;
  url: string;
  duration: number;

  artist?: string;
  genre?: string;
  year?: number;
  album?: string;
  imageBase64?: string;
};

export type Playlist = {
  tracks: string[]; // paths
  name: string;
  url: string;
};

export type MusicLibrary = {
  tracks: Record<string, Track>;
  playlists: Playlist[];
};
