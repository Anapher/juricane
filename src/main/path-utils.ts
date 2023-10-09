import path from 'node:path';

export function normalizePath(p: string, baseDir: string) {
  return path.isAbsolute(p)
    ? path.normalize(p.replaceAll('\\', '/'))
    : path.normalize(`${baseDir}/${p}`.replaceAll('\\', '/'));
}

export default null;
