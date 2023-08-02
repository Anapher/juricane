import { Box } from '@mui/material';
import { getTrackImagePath } from 'consts';
import { useConfig } from 'renderer/app/queries';

type Props = {
  images: number[];
};

function Image({ path }: { path?: string | false }) {
  if (!path) {
    return null;
  }

  return (
    <img
      src={`file://${path}`}
      style={{ flex: 1, minWidth: 0, objectFit: 'cover' }}
      alt=""
    />
  );
}

export default function TracksPreview({ images }: Props) {
  const { data: config } = useConfig();
  if (!config) return null;

  return (
    <Box display="flex" flexDirection="column" sx={{ aspectRatio: 1 }}>
      <Box display="flex" minHeight={0} flex={1}>
        <Image
          path={
            images.length > 0 &&
            getTrackImagePath(config.trackDirectory, images[0])
          }
        />
        <Image
          path={
            images.length > 1 &&
            getTrackImagePath(config.trackDirectory, images[1])
          }
        />
      </Box>
      {images.length > 2 && (
        <Box display="flex" minHeight={0} flex={1}>
          <Image
            path={
              images.length > 2 &&
              getTrackImagePath(config.trackDirectory, images[2])
            }
          />
          <Image
            path={
              images.length > 3 &&
              getTrackImagePath(config.trackDirectory, images[3])
            }
          />
        </Box>
      )}
    </Box>
  );
}
