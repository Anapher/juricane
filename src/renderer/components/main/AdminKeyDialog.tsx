import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from '@mui/material';
import { KeyboardEventHandler, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useConfig } from 'renderer/app/queries';
import { toggleAdminMode } from 'renderer/slices/admin-slice';

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function AdminKeyDialog({ open, onClose }: Props) {
  const { t } = useTranslation();
  const { data: config } = useConfig();
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();

  const handleActivate = () => {
    if (password !== config?.adminPassword) return;

    dispatch(toggleAdminMode());
    onClose();
  };

  useEffect(() => {
    if (open) {
      setPassword('');
    }
  }, [open]);

  const handleOnKeyDown: KeyboardEventHandler = (ev) => {
    if (ev.key === 'Enter') {
      handleActivate();
      ev.preventDefault();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{t('components.admin_mode.dialog_title')}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {t('components.admin_mode.dialog_description')}
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          id="password"
          label={t('components.admin_mode.password')}
          type="password"
          fullWidth
          variant="standard"
          value={password}
          onChange={(ev) => setPassword(ev.target.value)}
          onKeyDown={handleOnKeyDown}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t('components.admin_mode.cancel')}</Button>
        <Button
          onClick={handleActivate}
          disabled={password !== config?.adminPassword}
        >
          {t('components.admin_mode.activate')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
