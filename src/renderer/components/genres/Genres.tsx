import GroupedTracks from '../grouped-tracks/GroupedTracks';
import { useGroupOfTracks } from '../grouped-tracks/selectors';

export default function Genres() {
  const groups = useGroupOfTracks((track) => track.genre);
  return <GroupedTracks groups={groups} />;
}
