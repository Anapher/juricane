import GroupedTracks from '../grouped-tracks/GroupedTracks';
import { usePlaylists } from './selectors';

export default function Playlists() {
  const playlists = usePlaylists();

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
