type Config = {
  playlistDirectory: string;
  trackDirectory: string;
  adminPassword: string;
  showNextTrackButton: boolean;
  showPlayButton: boolean;
  defaultPlaylistName: string;
  artistSeparators: string[];
  adminModeTimeoutSeconds: number | undefined;
  backToWaitlistTimeoutSeconds: number | undefined;
};

export default Config;
