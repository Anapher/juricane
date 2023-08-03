import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addToWaitlist } from 'renderer/slices/music-player-slice';
import { Track } from 'renderer/types';
import TracksTable, { ColumnName } from '../grouped-tracks/TracksTable';
import { selectCurrentTrack } from '../main/selectors';
import { selectQueueTracks } from '../queue/selectors';

type Props = {
  tracks: Track[];
  hiddenColumn?: ColumnName;
};

export default function Tracks({ tracks, hiddenColumn }: Props) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const queuedTracks = useSelector(selectQueueTracks).map((x) => x.id);
  const currentTrackId = useSelector(selectCurrentTrack)?.id;

  return (
    <TracksTable
      tracks={tracks}
      queuedTracks={queuedTracks}
      onNavigate={({ name, type }) =>
        navigate(`/${type}/${encodeURIComponent(name)}`)
      }
      onAddToQueue={(track) => dispatch(addToWaitlist(track))}
      hiddenColumns={hiddenColumn && [hiddenColumn]}
      currentlyPlaying={currentTrackId}
    />
  );
}
