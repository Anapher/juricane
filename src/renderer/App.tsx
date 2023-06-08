import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { Provider } from 'react-redux';
import {
  Navigate,
  Route,
  MemoryRouter as Router,
  Routes,
} from 'react-router-dom';
import Main from './components/main/Main';
import { store } from './app/store';
import Queue from './components/queue/Queue';
import Playlists from './components/playlists/Playlists';
import Tracks from './components/tracks/Tracks';
import Artists from './components/artists/Artists';
import Genres from './components/genres/Genres';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

export default function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
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
      </ThemeProvider>
    </Provider>
  );
}
