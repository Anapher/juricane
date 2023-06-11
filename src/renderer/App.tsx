import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { useEffect } from 'react';
import { Provider, useDispatch, useSelector } from 'react-redux';
import {
  Navigate,
  Route,
  MemoryRouter as Router,
  Routes,
} from 'react-router-dom';
import { RootState, store } from './app/store';
import Artists from './components/artists/Artists';
import Genres from './components/genres/Genres';
import Main from './components/main/Main';
import NotLoadedScreen from './components/not-loaded/NotLoadedScreen';
import Playlists from './components/playlists/Playlists';
import Queue from './components/queue/Queue';
import Tracks from './components/tracks/Tracks';
import { musicLibraryLoaded } from './slices/musicPlayer';
import { MusicLibrary } from './types';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

function AppRoutes() {
  const dispatch = useDispatch();

  useEffect(() => {
    const handler = (arg: unknown) => {
      const library = arg as MusicLibrary;
      dispatch(musicLibraryLoaded(library));
    };

    window.electron.ipcRenderer.on('open-playlists', handler);
  }, [dispatch]);

  const loaded = useSelector((state: RootState) => !!state.musicPlayer.library);
  if (!loaded) {
    return <NotLoadedScreen />;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Main />}>
          <Route path="waitlist" element={<Queue />} />
          <Route path="playlists" element={<Playlists />}>
            <Route path=":id" />
          </Route>
          <Route path="tracks" element={<Tracks />} />
          <Route path="artists" element={<Artists />} />
          <Route path="genres" element={<Genres />} />
          <Route index element={<Navigate to="/waitlist" replace />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <AppRoutes />
      </ThemeProvider>
    </Provider>
  );
}
