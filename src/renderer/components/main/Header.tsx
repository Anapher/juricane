import styled from '@emotion/styled';
import { Box, Button, Typography } from '@mui/material';

const tabs = ['Waitlist', 'Playlists', 'Tracks', 'Artists', 'Genres'];

const HeaderContainer = styled('div')({
  backgroundColor: 'rgba(63,83,182,255)',
  maxHeight: 140,
  minHeight: 80,
  flex: 1,
  display: 'flex',
});

export default function Header() {
  return (
    <HeaderContainer>
      <Box flex={1}>
        <Typography>LOGO</Typography>
      </Box>
      <Box p={2} display="flex" alignItems="flex-end">
        <Box>
          {tabs.map((x) => (
            <Button
              key={x}
              sx={{
                p: 2,
                fontSize: 16,
                color: x === 'Waitlist' ? 'white' : undefined,
              }}
            >
              {x}
            </Button>
          ))}
        </Box>
      </Box>
    </HeaderContainer>
  );
}
