import { LoadingButton } from '@mui/lab';
import { Box, Typography } from '@mui/material';
import { useDispatch } from 'react-redux';
import { useMusicLibrary } from 'renderer/app/queries';
import { setLibraryPath } from 'renderer/slices/music-player-slice';

export default function NotLoadedScreen() {
  // const { isLoading, error, data } = useQuery('repoData', () =>
  //   fetch('https://api.github.com/repos/tannerlinsley/react-query').then(
  //     (res) => res.json()
  //   )
  // );
  const dispatch = useDispatch();

  const handleLoadFolder = async () => {
    const folder = await window.electron.ipcRenderer.openPlaylistDirectory();
    if (!folder) return;
    dispatch(setLibraryPath(folder));
  };

  const { isLoading } = useMusicLibrary();

  return (
    <Box
      height="100%"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Box display="flex" alignItems="center" flexDirection="column">
        <Typography gutterBottom>
          Please open a folder which contains playlist files (m3us)
        </Typography>
        <LoadingButton loading={isLoading} onClick={handleLoadFolder}>
          Open playlist folder
        </LoadingButton>
      </Box>
    </Box>
  );
}
