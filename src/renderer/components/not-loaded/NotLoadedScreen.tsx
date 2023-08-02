import { LoadingButton } from '@mui/lab';
import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useConfig, useMusicLibrary } from 'renderer/app/queries';

export default function NotLoadedScreen() {
  const { t } = useTranslation();

  const { refetch } = useConfig();

  const handleLoadConfig = async () => {
    refetch();
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
        <LoadingButton loading={isLoading} onClick={handleLoadConfig}>
          {t('components.not_loaded.button_text')}
        </LoadingButton>
      </Box>
    </Box>
  );
}
