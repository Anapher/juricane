import { useNavigate } from 'react-router-dom';
import { Track } from 'renderer/types';
import TracksTable, { ColumnName } from '../grouped-tracks/TracksTable';

type Props = {
  tracks: Track[];
  hiddenColumn?: ColumnName;
};

export default function Tracks({ tracks, hiddenColumn }: Props) {
  const navigate = useNavigate();

  return (
    <TracksTable
      tracks={tracks}
      onNavigate={({ name, type }) =>
        navigate(`/${type}/${encodeURIComponent(name)}`)
      }
      onAddToQueue={() => {}}
      hiddenColumns={hiddenColumn && [hiddenColumn]}
    />
  );
}
