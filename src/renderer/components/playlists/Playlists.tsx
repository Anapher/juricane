/* eslint-disable react/no-unstable-nested-components */
import AddIcon from '@mui/icons-material/Add';
import {
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
} from '@mui/material';
import { format } from 'date-fns';
import _ from 'lodash';
import { useNavigate } from 'react-router-dom';
import {
  useMusicLibrary,
  useOwnPlaylists,
  useUpdateOwnPlaylist,
} from 'renderer/app/queries';
import { CategoryInfo } from 'renderer/types';
import { setCurrentPlaylist } from 'renderer/slices/music-player-slice';
import { useDispatch } from 'react-redux';
import GroupedTracks from '../grouped-tracks/GroupedTracks';
import TrackGroupCard from '../grouped-tracks/TrackGroupCard';

const playlistGroupSelector: _.ValueIteratee<CategoryInfo> = (x) => x.group;

const CREATE_OWN_PLAYLIST_BUTTON_ID = 'CREATE_OWN_PLAYLIST_BUTTON';
const OWN_PLAYLIST_GROUP = 'Eigene Playlists';

export default function Playlists() {
  const navigate = useNavigate();
  const { data: library } = useMusicLibrary();
  const { data: ownPlaylists } = useOwnPlaylists();
  const createPlaylist = useUpdateOwnPlaylist();
  const dispatch = useDispatch();

  const playPlaylist = (group: CategoryInfo) => {
    if (!library) return;

    const tracks = group.trackIds
      .map((x) => library.tracks[x])
      .filter((x) => !!x);

    dispatch(
      setCurrentPlaylist({
        url: `/playlists/${group.id}`,
        name: group.name,
        tracks,
      })
    );
  };

  if (!library) return [];

  const { playlists } = library;

  const handleCreateOwnPlaylist = async () => {
    const name = format(new Date(), 'yyyyMMdd_HHmm');
    await createPlaylist.mutateAsync({
      name,
      trackIds: [],
    });

    navigate(`own/${name}`);
  };

  return (
    <GroupedTracks
      sortGroupsBy={[(x) => x[0] !== OWN_PLAYLIST_GROUP, (x) => x]}
      items={[
        ...playlists,
        ...(ownPlaylists || []).map<CategoryInfo>((x) => ({
          id: `own/${x.name}`,
          name: x.name,
          trackIds: x.trackIds,
          previewImageTrackIds: x.trackIds.slice(0, 4),
          group: OWN_PLAYLIST_GROUP,
        })),
        {
          name: 'Eigene Playlists',
          id: CREATE_OWN_PLAYLIST_BUTTON_ID,
          trackIds: [],
          previewImageTrackIds: [],
          group: OWN_PLAYLIST_GROUP,
        },
      ]}
      onNavigateToGroup={(group) => navigate(group.id)}
      groupSelector={playlistGroupSelector}
      mapCustomCardContent={(group) =>
        group.id === CREATE_OWN_PLAYLIST_BUTTON_ID ? (
          <CardActionArea sx={{ flex: 1 }} onClick={handleCreateOwnPlaylist}>
            <CardMedia
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <AddIcon sx={{ m: 3 }} fontSize="large" />
            </CardMedia>
            <CardContent>
              <Typography
                gutterBottom
                sx={{ fontSize: { xs: 14, xl: 18 } }}
                component="div"
                align="center"
              >
                Erstellen
              </Typography>
            </CardContent>
          </CardActionArea>
        ) : (
          <TrackGroupCard
            group={group}
            onClick={() => navigate(group.id)}
            onPlayButton={() => playPlaylist(group)}
          />
        )
      }
    />
  );
}
