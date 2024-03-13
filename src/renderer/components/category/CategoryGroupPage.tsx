import { useNavigate } from 'react-router-dom';
import { useMusicLibrary } from 'renderer/app/queries';
import { CategoryInfo, MusicLibrary } from 'renderer/types';
import GroupedTracks from '../grouped-tracks/GroupedTracks';

type Props = {
  categorySelector: (
    lib: MusicLibrary
  ) => Record<string, CategoryInfo> | CategoryInfo[];
};

export default function CategoryGroupPage({ categorySelector }: Props) {
  const navigate = useNavigate();
  const { data: library } = useMusicLibrary();
  if (!library) return [];

  const categories = categorySelector(library);

  return (
    <GroupedTracks
      items={Array.isArray(categories) ? categories : Object.values(categories)}
      onNavigateToGroup={(group) => navigate(group.id)}
    />
  );
}
