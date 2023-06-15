import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Provider } from 'react-redux';
import {
  Navigate,
  Route,
  MemoryRouter as Router,
  Routes,
} from 'react-router-dom';
import { useMusicLibrary } from './app/queries';
import { store } from './app/store';
import Artists from './components/artists/Artists';
import Genres from './components/genres/Genres';
import Main from './components/main/Main';
import NotLoadedScreen from './components/not-loaded/NotLoadedScreen';
import Playlists from './components/playlists/Playlists';
import Queue from './components/queue/Queue';
import Tracks from './components/tracks/Tracks';
import './app/i18n';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const queryClient = new QueryClient();

function AppRoutes() {
  const { isFetched } = useMusicLibrary();
  if (!isFetched) {
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
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={darkTheme}>
          <CssBaseline />
          <AppRoutes />
        </ThemeProvider>
      </QueryClientProvider>
    </Provider>
  );
}
