/* eslint-disable react/no-unstable-nested-components */
import _ from 'lodash';
import { useNavigate } from 'react-router-dom';
import { useMusicLibrary } from 'renderer/app/queries';
import { CategoryInfo } from 'renderer/types';
import GroupedTracks from '../grouped-tracks/GroupedTracks';

const playlistGroupSelector: _.ValueIteratee<CategoryInfo> = (x) => x.group;

export default function Playlists() {
  const navigate = useNavigate();
  const { data: library } = useMusicLibrary();
  if (!library) return [];

  const { playlists } = library;

  return (
    <GroupedTracks
      items={Array.isArray(playlists) ? playlists : Object.values(playlists)}
      onNavigateToGroup={(group) => navigate(group.id)}
      groupSelector={playlistGroupSelector}
    />
  );
}
