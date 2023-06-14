import { useSelector } from 'react-redux';
import GroupedTracks from '../grouped-tracks/GroupedTracks';
import { selectPlaylists } from './selectors';

export default function Playlists() {
  const playlists = useSelector(selectPlaylists);
  return (
    <GroupedTracks
      groups={playlists.map((x) => ({
        name: x.name,
        id: x.url,
        tracks: x.tracks,
      }))}
    />
  );
}
