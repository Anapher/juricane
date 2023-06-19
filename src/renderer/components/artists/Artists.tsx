import GroupedTracks from '../grouped-tracks/GroupedTracks';
import { ColumnName } from '../grouped-tracks/TracksTable';
import { useGroupOfTracks } from '../grouped-tracks/selectors';

const hiddenColumns: ColumnName[] = ['artist'];

export default function Artists() {
  const groups = useGroupOfTracks((track) => track.artist);
  return <GroupedTracks groups={groups} hiddenColumns={hiddenColumns} />;
}
