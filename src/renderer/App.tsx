import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { Provider } from 'react-redux';
import { Route, MemoryRouter as Router, Routes } from 'react-router-dom';
import Main from './components/main/Main';
import { store } from './app/store';

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
            <Route path="/" element={<Main />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </Provider>
  );
}
