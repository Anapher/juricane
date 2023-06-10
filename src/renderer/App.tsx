import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { Provider, useSelector } from 'react-redux';
import {
  Navigate,
  Route,
  MemoryRouter as Router,
  Routes,
} from 'react-router-dom';
import Main from './components/main/Main';
import { RootState, store } from './app/store';
import Queue from './components/queue/Queue';
import Playlists from './components/playlists/Playlists';
import Tracks from './components/tracks/Tracks';
import Artists from './components/artists/Artists';
import Genres from './components/genres/Genres';
import NotLoadedScreen from './components/not-loaded/NotLoadedScreen';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

function AppRoutes() {
  const loaded = useSelector((state: RootState) => state.musicPlayer.loaded);
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
      </Routes>{' '}
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
