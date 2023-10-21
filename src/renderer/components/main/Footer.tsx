import { Box, Button, LinearProgress, Typography } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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

  const player = useContext(AudioPlayerContext);

  useEffect(() => {
    const token = setInterval(() => {
      // eslint-disable-next-line react/destructuring-assignment
      setPosition(player.position);
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
          {currentTrack && <TrackImage size={56} track={currentTrack} />}
          <Box ml={2}>
            <Typography>{currentTrack?.title}</Typography>
            <Typography variant="caption">{currentTrack?.artist}</Typography>
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
          {config?.showNextTrackButton && (
            <Button onClick={() => dispatch(playNextTrack())}>
              Song überspringen
            </Button>
          )}
          {config?.showPlayButton && (
            <Button
              onClick={() => (player.playing ? player.pause() : player.play())}
            >
              Play / Pause
            </Button>
          )}
          <Typography sx={{ mr: 3 }} color="GrayText">
            {playlist?.name}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
