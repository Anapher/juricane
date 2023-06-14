import { useSelector } from 'react-redux';
import { selectGenreGroups } from './selectors';
import GroupedTracks from '../grouped-tracks/GroupedTracks';

export default function Genres() {
  const genreGroups = useSelector(selectGenreGroups);
  return <GroupedTracks groups={genreGroups} />;
}
