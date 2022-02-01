import type { ListenFn } from './types';

export const listen: ListenFn = (cb) => {
  // Temporary implementation
  cb(window.location, window.location);
  return () => {};
};
