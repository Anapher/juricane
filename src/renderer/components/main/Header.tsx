import styled from '@emotion/styled';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { Box, Button, ButtonGroup, Stack } from '@mui/material';
import { NavLink, useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();

  return (
    <HeaderContainer>
      <Box flex={1} display="flex" alignItems="center" sx={{ pl: 2 }}>
        <Stack direction="column" alignItems="flex-start">
          <img src={logo} width={200} alt="Lienke SounDevices" />

          <ButtonGroup
            variant="text"
            size="small"
            aria-label="navigation buttons"
          >
            <Button style={{ width: 80 }} onClick={() => navigate(-1)}>
              <ArrowBackIosIcon />
            </Button>
            <Button style={{ width: 80 }} onClick={() => navigate(1)}>
              <ArrowForwardIosIcon />
            </Button>
          </ButtonGroup>
        </Stack>
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
                backgroundColor: isActive
                  ? 'rgba(255, 255, 255, 0.04)'
                  : undefined,
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
