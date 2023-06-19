export function secondsToMs(seconds: number): [number, number] {
  return [Math.floor(seconds / 60), seconds % 60];
}

export function formatSeconds(seconds: number) {
  const [m, s] = secondsToMs(seconds);
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}
