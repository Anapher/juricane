import GroupedTracks from '../grouped-tracks/GroupedTracks';
import { useGroupOfTracks } from '../grouped-tracks/selectors';

export default function Artists() {
  const groups = useGroupOfTracks((track) => track.artist);
  return <GroupedTracks groups={groups} />;
}
