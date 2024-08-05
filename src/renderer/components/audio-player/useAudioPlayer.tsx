import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Player from 'renderer/audio/player';
import { playNextTrack } from 'renderer/slices/music-player-slice';
import { selectCurrentTrack } from '../main/selectors';

export default function useAudioPlayer() {
  const player = useRef(new Player());
  const dispatch = useDispatch();
  const currentTrack = useSelector(selectCurrentTrack);

  useEffect(() => {
    const p = player.current;
    const handler = () => {
      dispatch(playNextTrack());
    };
    p.on('requestNextSong', handler);

    return () => {
      p.off('requestNextSong', handler);
    };
  }, [dispatch]);

  useEffect(() => {
    const p = player.current;

    return () => {
      p.destroy();
    };
  }, []);

  useEffect(() => {
    if (!currentTrack) return;

    player.current.nextTrack(
      `file://${encodeURI(currentTrack.url).replace('#', '%23')}`
    );
  }, [currentTrack]);

  return player.current;
}
