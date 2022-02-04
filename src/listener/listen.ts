import type { ListenFn } from './types';

import { version as packageVersion } from '../../package.json';

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
 * @param [options] Optional object defining when the listener function should be called
 * @param [options.ignoreHashChange] Do not fire on hash changes
 * @param [options.ignorePathChange] Do not fire on path changes
 * @param [options.ignoreSearchChange] Do not fire on search changes
 * @param [options.immediatelySendValues] Immediately send current values to callback
 * @returns An unsubscribe function
 */
export const listen: ListenFn = (callback, options = {}) => {
  if (window['@martindoyleuk/location-listener'] === undefined) {
    window['@martindoyleuk/location-listener'] = {};
  }

  const namespace = window['@martindoyleuk/location-listener'];

  if (namespace[packageVersion] === undefined) {
    namespace[packageVersion] = new Listener();
  }

  const listener = namespace[packageVersion]!;

  return listener.subscribe(callback, options);
};
