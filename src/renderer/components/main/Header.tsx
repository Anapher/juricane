import styled from '@emotion/styled';
import { Box, Button } from '@mui/material';
import { NavLink } from 'react-router-dom';
import to from 'renderer/utils/to';
import logo from '../../../../assets/logo.png';

const tabs = ['Waitlist', 'Playlists', 'Tracks', 'Artists', 'Genres'];

const HeaderContainer = styled('div')({
  backgroundColor: 'rgba(63,83,182,255)',
  maxHeight: 140,
  minHeight: 80,
  flex: 1,
  display: 'flex',
});

export default function Header() {
  const getPathFromTab = (tabname: string) => {
    return `/${tabname.toLowerCase()}`;
  };
  return (
    <HeaderContainer>
      <Box flex={1} display="flex" alignItems="center" sx={{ pl: 3 }}>
        <img src={logo} width={240} alt="Lienke SounDevices" />
      </Box>
      <Box p={2} display="flex" alignItems="flex-end">
        <Box>
          {tabs.map((name) => (
            <Button
              key={name}
              // eslint-disable-next-line react/jsx-props-no-spreading
              {...to(getPathFromTab(name), NavLink)}
              // @ts-ignore
              style={({ isActive }) => ({
                color: isActive ? 'white' : undefined,
              })}
              sx={{
                p: 2,
                fontSize: 16,
                // color: pathname.startsWith(getPathFromTab(name))
                //   ? 'white'
                //   : undefined,
                transition: 'color 0.2s ease',
              }}
            >
              {name}
            </Button>
          ))}
        </Box>
      </Box>
    </HeaderContainer>
  );
}
