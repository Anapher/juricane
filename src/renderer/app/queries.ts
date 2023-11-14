import { useQuery } from 'react-query';

export const useConfig = () => {
  return useQuery(
    ['config'],
    () => {
      return window.electron.ipcRenderer.loadConfig();
    },
    {
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    }
  );
};

export const useMusicLibrary = () => {
  const { data: config } = useConfig();

  return useQuery(
    ['musicLibrary', config],
    () => {
      if (!config) {
        throw new Error('no config');
      }

      return window.electron.ipcRenderer.loadMusicLibrary(config);
    },
    {
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      enabled: !!config,
    }
  );
};

export const useDefaultPlaylist = () => {
  const { data } = useMusicLibrary();
  const { data: config } = useConfig();

  if (!data) {
    return undefined;
  }

  let defaultPlaylist = data.playlists.find(
    (x) => x.name === config?.defaultPlaylistName
  );
  if (!defaultPlaylist) {
    // eslint-disable-next-line prefer-destructuring
    defaultPlaylist = data.playlists[0];
  }

  return defaultPlaylist;
};

export default null;
