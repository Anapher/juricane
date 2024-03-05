import { Box } from '@mui/material';
import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Queue from '../queue/Queue';
import AdminKeyDialog from './AdminKeyDialog';
import Footer from './Footer';
import Header from './Header';

export default function Main() {
  const [dialogOpen, setDialogOpen] = useState(false);

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
          <Queue setDialogOpen={setDialogOpen} />
        </Box>
      </Box>
      <Footer />
      <AdminKeyDialog open={dialogOpen} onClose={() => setDialogOpen(false)} />
    </div>
  );
}
