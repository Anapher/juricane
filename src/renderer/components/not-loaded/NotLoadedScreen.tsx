import { Box, Button, Typography } from '@mui/material';

export default function NotLoadedScreen() {
  const handleLoadFolder = () => {
    // calling IPC exposed from preload script
    window.electron.ipcRenderer.once('ipc-example', (arg) => {
      // eslint-disable-next-line no-console
      console.log(arg);
    });
    window.electron.ipcRenderer.sendMessage('open-playlists');
  };

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
        <Button onClick={handleLoadFolder}>Open playlist folder</Button>
      </Box>
    </Box>
  );
}
