import { Box } from '@mui/material';

type Props = {
  images: string[];
};

function Base64Image({ base64Image }: { base64Image?: string | boolean }) {
  if (!base64Image) {
    return null;
  }

  return (
    <img
      src={`data:image/jpeg;base64,${base64Image}`}
      style={{ flex: 1, minWidth: 0, objectFit: 'cover' }}
      alt=""
    />
  );
}

export default function TracksPreview({ images }: Props) {
  return (
    <Box display="flex" flexDirection="column" sx={{ aspectRatio: 1 }}>
      <Box display="flex" minHeight={0} flex={1}>
        <Base64Image base64Image={images.length > 0 && images[0]} />
        <Base64Image base64Image={images.length > 1 && images[1]} />
      </Box>
      {images.length > 2 && (
        <Box display="flex" minHeight={0} flex={1}>
          <Base64Image base64Image={images.length > 2 && images[2]} />
          <Base64Image base64Image={images.length > 3 && images[3]} />
        </Box>
      )}
    </Box>
  );
}
