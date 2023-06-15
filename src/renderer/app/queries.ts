import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import { RootState } from './store';

export const useMusicLibrary = () => {
  const libraryPath = useSelector(
    (state: RootState) => state.musicPlayer.libraryPath
  );

  return useQuery(
    ['musicLibrary', libraryPath],
    () => {
      if (!libraryPath) {
        throw new Error('library path is empty');
      }

      return window.electron.ipcRenderer.loadMusicLibrary(libraryPath);
    },
    {
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      enabled: !!libraryPath,
    }
  );
};

export default null;
