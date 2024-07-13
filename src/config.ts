type Config = {
  playlistDirectory: string;
  ownPlaylistDirectory: string;
  trackDirectory: string;
  adminPassword: string;
  showNextTrackButton: boolean;
  showPlayButton: boolean;
  defaultPlaylistName: string;
  artistSeparators: string[];
  genreSeparators: string[];
  adminModeTimeoutSeconds: number | undefined;
  backToWaitlistTimeoutSeconds: number | undefined;
};

export default Config;
