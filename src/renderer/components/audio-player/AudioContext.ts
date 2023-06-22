import { createContext } from 'react';
import Player from 'renderer/audio/player';

const AudioPlayerContext = createContext<Player>(new Player());
export default AudioPlayerContext;
