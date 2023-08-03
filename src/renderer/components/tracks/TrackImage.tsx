import { getTrackImagePath } from 'consts';
import { ComponentProps } from 'react';
import { useConfig } from 'renderer/app/queries';
import { Track } from 'renderer/types';

type Props = ComponentProps<'img'> & {
  track: Track;
  size: number;
  forceSize?: boolean;
};

export default function TrackImage({
  track,
  size,
  style,
  forceSize,
  ...imgProps
}: Props) {
  const { data: config } = useConfig();
  if (!config) return null;

  if (!track.hasImage) {
    if (!forceSize) return null;
    return <div style={{ width: size, height: size }} />;
  }

  return (
    <img
      src={`file://${getTrackImagePath(config.trackDirectory, track.id)}`}
      style={{
        width: size,
        height: size,
        objectFit: 'cover',
        borderRadius: 4,
        ...style,
      }}
      alt=""
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...imgProps}
    />
  );
}
