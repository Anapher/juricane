import ClearIcon from '@mui/icons-material/Clear';
import {
  Box,
  IconButton,
  InputAdornment,
  TextField,
  useTheme,
} from '@mui/material';
import _ from 'lodash';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useMusicLibrary } from 'renderer/app/queries';
import useFilteredTracks from 'renderer/utils/useFilteredTracks';
import Tracks from './Tracks';

export default function AllTracks() {
  const [searchText, setSearchText] = useState('');
  const [focusSearch, setFocusSearch] = useState(false);
  const theme = useTheme();

  const library = useMusicLibrary();
  const sortedTracks = useMemo(
    () =>
      library.data?.tracks && _.sortBy(library.data?.tracks, (x) => x.title),
    [library.data?.tracks]
  );
  const filteredTracks = useFilteredTracks(sortedTracks, searchText);
  const location = useLocation();
  const searchFieldRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (location.search === '?search') {
      setFocusSearch(true);
      searchFieldRef.current?.focus();
    }
  }, [location.search]);

  if (!library.data) return null;

  return (
    <Box flex={1} m={2} mr={1} display="flex" flexDirection="column">
      <TextField
        inputRef={searchFieldRef}
        size="small"
        focused={focusSearch}
        sx={{ mb: 1 }}
        value={searchText}
        placeholder="Songsuche..."
        onChange={(ev) => setSearchText(ev.target.value)}
        style={{ backgroundColor: theme.palette.grey[900] }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={() => setSearchText('')}>
                <ClearIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      <Box flex={1}>
        <Tracks tracks={filteredTracks} />
      </Box>
    </Box>
  );
}
