import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Provider } from 'react-redux';
import {
  Navigate,
  Route,
  MemoryRouter as Router,
  Routes,
} from 'react-router-dom';
import './app/i18n';
import { useMusicLibrary } from './app/queries';
import { store } from './app/store';
import CategoryGroupPage from './components/category/CategoryGroupPage';
import CategoryPage from './components/category/CategoryPage';
import Main from './components/main/Main';
import NotLoadedScreen from './components/not-loaded/NotLoadedScreen';
import Queue from './components/queue/Queue';
import Tracks from './components/tracks/Tracks';

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
          <Route path="playlists">
            <Route
              index
              element={
                <CategoryGroupPage categorySelector={(x) => x.playlists} />
              }
            />
            <Route path=":id" element={<CategoryPage />} />
          </Route>
          <Route path="tracks" element={<Tracks />} />
          <Route path="artists">
            <Route
              index
              element={
                <CategoryGroupPage categorySelector={(x) => x.artists} />
              }
            />
            <Route path=":id" element={<CategoryPage />} />
          </Route>
          <Route path="genres">
            <Route
              index
              element={<CategoryGroupPage categorySelector={(x) => x.genres} />}
            />
            <Route path=":id" element={<CategoryPage />} />
          </Route>
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
