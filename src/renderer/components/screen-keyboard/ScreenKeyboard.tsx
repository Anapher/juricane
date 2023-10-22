import BackspaceIcon from '@mui/icons-material/Backspace';
import {
  Box,
  BoxProps,
  ButtonBase,
  IconButton,
  InputAdornment,
  TextField,
} from '@mui/material';

const alphabet = 'abcdefghijklmnopqrstuvwxyz '.toUpperCase();

type Props = {
  onChange: (text: string) => void;
  value: string;
  placeholder?: string;
  sx: BoxProps['sx'];
};

export default function ScreenKeyboard({
  value,
  onChange,
  placeholder,
  sx,
}: Props) {
  return (
    <Box display="flex" sx={sx}>
      <TextField
        size="small"
        placeholder={placeholder}
        sx={{ flex: 1, mr: 2 }}
        value={value}
        onChange={(ev) => onChange(ev.target.value)}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={() => onChange(value.substring(0, value.length - 1))}
              >
                <BackspaceIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      <Box>
        {alphabet.split('').map((x) => (
          <ButtonBase
            onClick={() => onChange(value + x)}
            sx={(theme) => ({
              p: 1.5,
              width: 40,
              height: 40,
              fontWeight: 'bold',
              fontSize: 16,
              backgroundColor: theme.palette.grey[800],
              borderRadius: 2,
              mx: 0.2,
            })}
            key={x}
          >
            {x !== ' ' ? x : '_'}
          </ButtonBase>
        ))}
      </Box>
    </Box>
  );
}
