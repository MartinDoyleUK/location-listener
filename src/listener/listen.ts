import type { ListenFn } from './types';

import { LOCATION_LISTENER_GUID } from './constants';
import { Listener } from './listener';

/**
 * This function takes a callback function which will be run whenever the
 * location next changes. An options object can be supplied to refine when that
 * occurs.
 *
 * Each time this function is called, a new listener will be added, even
 * if the callback function is the same.
 *
 * @param callback The callback to run when the location changes
 * @param options Options defining when the listener function should be called
 * @returns An unsubscribe function
 */
export const listen: ListenFn = (callback, options = {}) => {
  // Ensure an instance exists
  if (window[LOCATION_LISTENER_GUID] === undefined) {
    window[LOCATION_LISTENER_GUID] = new Listener();
  }

  // Grab the listener
  const listener = window[LOCATION_LISTENER_GUID];
  const unsubscribe = listener.subscribe(callback, options);

  // Pass back the unsubscribe function
  return unsubscribe;
};
