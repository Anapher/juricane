export type Track = {
  id: number;
  title: string;
  url: string;
  duration: number;

  artist?: string;
  genre?: string;
  year?: number;
  album?: string;
  imageBase64?: string;
};

export type CategoryInfo = {
  id: string;
  name: string;
  trackIds: number[];
  previewImageBase64: string[];
};

export type MusicLibrary = {
  tracks: Track[];

  playlists: CategoryInfo[];
  artists: Record<string, CategoryInfo>;
  genres: Record<string, CategoryInfo>;
  albums: Record<string, CategoryInfo>;
};
