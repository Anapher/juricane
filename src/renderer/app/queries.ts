import { useMutation, useQuery, useQueryClient } from 'react-query';
import { OwnPlaylist } from 'renderer/types';

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

export const useUpdateOwnPlaylist = () => {
  const { data: config } = useConfig();
  const { data: library } = useMusicLibrary();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: OwnPlaylist) => {
      if (!config) {
        throw new Error('no config');
      }
      if (!library) {
        throw new Error('no library');
      }
      return window.electron.ipcRenderer.updateOwnPlaylist(
        config,
        data,
        library
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries('ownPlaylists');
    },
  });
};

export const useOwnPlaylists = () => {
  const { data: config } = useConfig();
  const { data: library } = useMusicLibrary();

  return useQuery(
    ['ownPlaylists'],
    () => {
      if (!config) {
        throw new Error('no config');
      }
      if (!library) {
        throw new Error('no library');
      }
      return window.electron.ipcRenderer.loadOwnPlaylists(config, library);
    },
    {
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      enabled: !!config && !!library,
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
