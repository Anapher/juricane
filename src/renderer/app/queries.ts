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

export default null;
