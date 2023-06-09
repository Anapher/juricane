import { Box, Button, LinearProgress, Typography } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { playNextTrack } from 'renderer/slices/music-player-slice';
import { formatSeconds } from 'renderer/utils/duration';
import AudioPlayerContext from '../audio-player/AudioContext';
import { selectCurrentPlaylist, selectCurrentTrack } from './selectors';

export default function Footer() {
  const currentTrack = useSelector(selectCurrentTrack);
  const playlist = useSelector(selectCurrentPlaylist);
  const dispatch = useDispatch();

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

  const debugSeekUntilEnd = () => {
    player.position = player.duration - 10;
  };

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
          <div>
            <Typography>{currentTrack?.title}</Typography>
            <Typography variant="caption">{currentTrack?.artist}</Typography>
          </div>
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
          <Button onClick={() => dispatch(playNextTrack())}>Next track</Button>
          <Button onClick={() => debugSeekUntilEnd()}>
            Jump 10 sec before end
          </Button>
          <Typography sx={{ mr: 3 }} color="GrayText">
            {playlist?.name}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
