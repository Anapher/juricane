import { Box } from '@mui/material';
import { Track } from 'renderer/types';

type Props = {
  tracks: Track[];
};

function Base64Image({ base64Image }: { base64Image?: string | boolean }) {
  if (!base64Image) {
    return <div style={{ flex: 1, minWidth: 0 }} />;
  }

  return (
    <img
      src={`data:image/jpeg;base64,${base64Image}`}
      style={{ flex: 1, minWidth: 0 }}
      alt=""
    />
  );
}

export default function TracksPreview({ tracks }: Props) {
  const images = tracks
    .map((x) => x.imageBase64)
    .filter((x): x is string => !!x);

  return (
    <Box display="flex" flexDirection="column">
      <Box display="flex" minHeight={0}>
        <Base64Image base64Image={images.length > 0 && images[0]} />
        <Base64Image base64Image={images.length > 1 && images[1]} />
      </Box>
      <Box display="flex" minHeight={0}>
        <Base64Image base64Image={images.length > 2 && images[2]} />
        <Base64Image base64Image={images.length > 3 && images[3]} />
      </Box>
    </Box>
  );
}
