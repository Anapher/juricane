import styled from '@emotion/styled';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { Box, Button, ButtonGroup, Stack } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useNavigate } from 'react-router-dom';
import { useConfig } from 'renderer/app/queries';
import { toggleAdminMode } from 'renderer/slices/admin-slice';
import to from 'renderer/utils/to';
import logo from '../../../../assets/logo.png';
import AdminKeyDialog from './AdminKeyDialog';
import UserInteractionTimeoutHandler from './UserInteractionTimeoutHandler';
import { selectAdminMode } from './selectors';

const tabs = ['Waitlist', 'Playlists', 'Tracks', 'Artists', 'Genres'];

const HeaderContainer = styled('div')({
  backgroundColor: 'rgba(63,83,182,255)',
  transition: 'background-color 0.2s ease',
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
  const [dialogOpen, setDialogOpen] = useState(false);
  const { t } = useTranslation();
  const adminMode = useSelector(selectAdminMode);
  const dispatch = useDispatch();
  const { data: config } = useConfig();

  const handleToggleAdminMode = () => {
    if (adminMode) {
      dispatch(toggleAdminMode());
    } else {
      setDialogOpen(true);
    }
  };

  const navigateBackToWaitlist = () => {
    navigate(getPathFromTab(tabs[0]));
  };

  return (
    <HeaderContainer
      style={{ backgroundColor: adminMode ? '#e74c3c' : undefined }}
    >
      <Box flex={1} display="flex" alignItems="center" sx={{ pl: 2 }}>
        <Stack direction="column" alignItems="flex-start">
          <img
            src={logo}
            width={200}
            alt="Lienke SounDevices"
            onDoubleClick={handleToggleAdminMode}
          />

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
      <Box display="flex" justifyContent="space-between" flexDirection="column">
        <Box display="flex" justifyContent="flex-end" sx={{ pr: 2, pt: 2 }}>
          <Button
            sx={{ opacity: adminMode ? 1 : 0.2 }}
            onClick={handleToggleAdminMode}
          >
            {adminMode
              ? t('components.admin_mode.button_text_disable')
              : t('components.admin_mode.button_text')}
          </Button>
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
      </Box>
      <AdminKeyDialog open={dialogOpen} onClose={() => setDialogOpen(false)} />
      {adminMode && config?.adminModeTimeoutSeconds && (
        <UserInteractionTimeoutHandler
          handler={handleToggleAdminMode}
          timeoutSeconds={config.adminModeTimeoutSeconds}
        />
      )}
      {config?.backToWaitlistTimeoutSeconds && (
        <UserInteractionTimeoutHandler
          timeoutSeconds={config.backToWaitlistTimeoutSeconds}
          handler={navigateBackToWaitlist}
        />
      )}
    </HeaderContainer>
  );
}
