import { createGroupOfTracksByProp } from '../grouped-tracks/selectors';

export const selectGenreGroups = createGroupOfTracksByProp((x) => x.genre);

export default null;
