import GroupedTracks from '../grouped-tracks/GroupedTracks';
import { ColumnName } from '../grouped-tracks/TracksTable';
import { useGroupOfTracks } from '../grouped-tracks/selectors';

const hiddenColumns: ColumnName[] = ['genre'];

export default function Genres() {
  const groups = useGroupOfTracks((track) => track.genre);
  return <GroupedTracks groups={groups} hiddenColumns={hiddenColumns} />;
}
