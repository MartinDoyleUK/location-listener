import type { LocationValues } from '../types';

type GetLocationValues = (location?: Location) => LocationValues;

export const getLocationValues: GetLocationValues = (
  location = window.location,
) => {
  const { hash, href, pathname, search } = location;
  return { hash, href, pathname, search };
};
