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
import CategoryTracksPage from './components/category/CategoryTracksPage';
import Main from './components/main/Main';
import NotLoadedScreen from './components/not-loaded/NotLoadedScreen';
import Queue from './components/queue/Queue';
import AllTracks from './components/tracks/AllTracks';

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
            <Route
              path=":id"
              element={
                <CategoryTracksPage
                  selectCategoryInfo={(library, id) =>
                    library.playlists[Number(id)]
                  }
                />
              }
            />
          </Route>
          <Route path="tracks" element={<AllTracks />} />
          <Route path="artists">
            <Route
              index
              element={
                <CategoryGroupPage categorySelector={(x) => x.artists} />
              }
            />
            <Route
              path=":id"
              element={
                <CategoryTracksPage
                  selectCategoryInfo={(library, id) =>
                    library.artists[encodeURIComponent(id)]
                  }
                  hiddenColumn="artist"
                />
              }
            />
          </Route>
          <Route path="genres">
            <Route
              index
              element={<CategoryGroupPage categorySelector={(x) => x.genres} />}
            />
            <Route
              path=":id"
              element={
                <CategoryTracksPage
                  selectCategoryInfo={(library, id) =>
                    library.genres[encodeURIComponent(id)]
                  }
                  hiddenColumn="genre"
                />
              }
            />
          </Route>
          <Route path="albums">
            <Route
              path=":id"
              element={
                <CategoryTracksPage
                  selectCategoryInfo={(library, id) =>
                    library.albums[encodeURIComponent(id)]
                  }
                  hiddenColumn="album"
                />
              }
            />
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
