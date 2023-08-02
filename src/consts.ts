export const TRACK_IMAGES_DIR = '.trackimages';

export function getTrackImagePath(tracksDir: string, trackId: number) {
  return `${tracksDir.replace('\\', '/')}/${TRACK_IMAGES_DIR}/${trackId}.png`;
}
