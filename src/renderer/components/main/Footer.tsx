import PauseCircleIcon from '@mui/icons-material/PauseCircle';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import {
  Box,
  Chip,
  IconButton,
  LinearProgress,
  Typography,
} from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useConfig } from 'renderer/app/queries';
import { playNextTrack } from 'renderer/slices/music-player-slice';
import { formatSeconds } from 'renderer/utils/duration';
import AudioPlayerContext from '../audio-player/AudioContext';
import TrackImage from '../tracks/TrackImage';
import { selectCurrentPlaylist, selectCurrentTrack } from './selectors';

export default function Footer() {
  const currentTrack = useSelector(selectCurrentTrack);
  const playlist = useSelector(selectCurrentPlaylist);
  const dispatch = useDispatch();
  const { data: config } = useConfig();

  const [position, setPosition] = useState(0);
  const [playing, setPlaying] = useState(false);

  const player = useContext(AudioPlayerContext);

  const navigate = useNavigate();

  useEffect(() => {
    const token = setInterval(() => {
      // eslint-disable-next-line react/destructuring-assignment
      setPosition(player.position);
      setPlaying(player.playing);
    }, 500);

    return () => {
      clearInterval(token);
    };
  }, [player, setPosition]);

  return (
    <Box>
      <LinearProgress
        color="primary"
        variant="determinate"
        value={(position / (player?.duration || 100)) * 100}
        sx={{
          '& .MuiLinearProgress-bar': {
            transition: 'none',
          },
        }}
      />
      <Box display="flex" alignItems="center">
        <Box flex={1} display="flex" alignItems="center" m={3}>
          <Box flex={1} display="flex" alignItems="center">
            {currentTrack && <TrackImage size={56} track={currentTrack} />}
            <Box ml={2}>
              <Typography>{currentTrack?.title}</Typography>
              <Typography variant="caption">
                {currentTrack?.artist.join(', ')}
              </Typography>
            </Box>
          </Box>
          <Box display="flex" alignItems="center">
            {config?.showNextTrackButton && (
              <IconButton
                size="large"
                onClick={() =>
                  player.playing ? player.pause() : player.play()
                }
              >
                {playing ? (
                  <PauseCircleIcon fontSize="large" />
                ) : (
                  <PlayCircleIcon fontSize="large" />
                )}
              </IconButton>
            )}
            {config?.showPlayButton && (
              <IconButton onClick={() => dispatch(playNextTrack())}>
                <SkipNextIcon />
              </IconButton>
            )}
          </Box>
        </Box>
        {currentTrack && (
          <Typography align="center">
            {formatSeconds(Math.floor(position))} /{' '}
            {formatSeconds(Math.floor(player?.duration))}
          </Typography>
        )}
        <Box
          flex={1}
          display="flex"
          justifyContent="flex-end"
          alignItems="center"
        >
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            sx={{ mx: 2 }}
          >
            <Typography>Es wird gespielt aus</Typography>
            <Chip
              sx={{ ml: 1 }}
              icon={<PlayArrowIcon />}
              label={playlist?.name}
              onClick={() => navigate(`/playlists/${playlist?.id}`)}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
