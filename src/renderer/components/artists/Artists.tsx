import { useSelector } from 'react-redux';
import GroupedTracks from '../grouped-tracks/GroupedTracks';
import { selectArtistGroups } from './selectors';

export default function Artists() {
  const genreGroups = useSelector(selectArtistGroups);
  return <GroupedTracks groups={genreGroups} />;
}
