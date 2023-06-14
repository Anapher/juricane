import { createGroupOfTracksByProp } from '../grouped-tracks/selectors';

export const selectArtistGroups = createGroupOfTracksByProp((x) => x.artist);

export default null;
