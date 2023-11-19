import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Footer from './Footer';
import Header from './Header';
import Queue from '../queue/Queue';

export default function Main() {
  return (
    <div
      style={{
        height: '100vh',
        width: '100vw',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Header />
      <Box
        flex={1}
        display="flex"
        minWidth={0}
        minHeight={0}
        overflow="auto"
        flexDirection="row"
      >
        <Box flex={3} display="flex">
          <Outlet />
        </Box>
        <Box flex={1} display="flex" p={2} pl={1}>
          <Queue />
        </Box>
      </Box>
      <Footer />
    </div>
  );
}
