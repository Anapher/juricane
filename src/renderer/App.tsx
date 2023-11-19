import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Provider, useDispatch } from 'react-redux';
import {
  Navigate,
  Route,
  MemoryRouter as Router,
  Routes,
} from 'react-router-dom';
import './app/i18n';
import { useDefaultPlaylist, useMusicLibrary } from './app/queries';
import { store } from './app/store';
import AudioPlayerContext from './components/audio-player/AudioContext';
import useAudioPlayer from './components/audio-player/useAudioPlayer';
import CategoryGroupPage from './components/category/CategoryGroupPage';
import CategoryTracksPage from './components/category/CategoryTracksPage';
import Main from './components/main/Main';
import NotLoadedScreen from './components/not-loaded/NotLoadedScreen';
import CurrentTrackCover from './components/queue/CurrentTrackCover';
import AllTracks from './components/tracks/AllTracks';
import './sagas/music-player-saga';
import { setCurrentPlaylist } from './slices/music-player-slice';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const queryClient = new QueryClient();

function AppRoutes() {
  const { isFetched, data } = useMusicLibrary();
  const dispatch = useDispatch();
  const defaultPlaylist = useDefaultPlaylist();

  useEffect(() => {
    if (!defaultPlaylist || !data) return;

    dispatch(
      setCurrentPlaylist({
        id: Number(defaultPlaylist.id),
        name: defaultPlaylist.name,
        tracks: defaultPlaylist.trackIds.map((x) => data.tracks[x]),
      })
    );
  }, [defaultPlaylist, data, dispatch]);

  const audioPlayer = useAudioPlayer();

  if (!isFetched) {
    return <NotLoadedScreen />;
  }

  return (
    <AudioPlayerContext.Provider value={audioPlayer}>
      <Router>
        <Routes>
          <Route path="/" element={<Main />}>
            <Route path="playing" element={<CurrentTrackCover />} />
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
                    playlist
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
                  />
                }
              />
            </Route>
            <Route path="genres">
              <Route
                index
                element={
                  <CategoryGroupPage categorySelector={(x) => x.genres} />
                }
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
            <Route index element={<Navigate to="/playing" replace />} />
          </Route>
        </Routes>
      </Router>
    </AudioPlayerContext.Provider>
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
