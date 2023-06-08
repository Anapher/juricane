import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Footer from './Footer';
import Header from './Header';

export default function Main() {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Header />
      <Box flex={1} display="flex">
        <Outlet />
      </Box>
      <Footer />
    </div>
  );
}
