export type Track = {
  id: number;
  title: string;
  url: string;
  duration: number;

  hasImage: boolean;
  artist: string[];
  genre: string[];
  year?: number;
  album?: string;
};

export type CategoryInfo = {
  id: string;
  name: string;
  group?: string;
  trackIds: number[];
  previewImageTrackIds: number[];
};

export type TrackDb = {
  tracks: Track[];

  artists: Record<string, CategoryInfo>;
  genres: Record<string, CategoryInfo>;
  albums: Record<string, CategoryInfo>;
};

export type OwnPlaylist = {
  name: string;
  trackIds: number[];
};

export type ScheduledOwnPlaylist = {
  name: string;
  scheduledTime: string;
};

export type OwnPlaylistConfig = {
  scheduledPlaylists: ScheduledOwnPlaylist[];
};

export type MusicLibrary = TrackDb & { playlists: CategoryInfo[] };
