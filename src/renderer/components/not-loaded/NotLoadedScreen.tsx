import { LoadingButton } from '@mui/lab';
import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useMusicLibrary } from 'renderer/app/queries';
import { setLibraryPath } from 'renderer/slices/music-player-slice';

export default function NotLoadedScreen() {
  const dispatch = useDispatch();
  const { t } = useTranslation();

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
        <Typography gutterBottom>{t('components.not_loaded.text')}</Typography>
        <LoadingButton loading={isLoading} onClick={handleLoadFolder}>
          {t('components.not_loaded.button_text')}
        </LoadingButton>
      </Box>
    </Box>
  );
}
