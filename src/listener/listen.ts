import type {
  CallbackFunction,
  ListenOptions,
  UnsubscribeFunction,
} from '../types';

import { LOCATION_LISTENER_SCOPE } from '../constants';

import { Listener } from './listener';

export type ListenFunction = (
  callback: CallbackFunction,
  options?: ListenOptions,
) => UnsubscribeFunction;

/**
 * This callback function is used to notify listeners when the location changes.
 *
 * NOTE: If "immediatelySendValues" was specified in the options, then the
 * "oldValues" and "newValues" objects will be identical on the first invocation
 * of the callback, and all properties will be marked as changed.
 *
 * @callback listenCallback
 * @param {Object} oldValues The old location value
 * @param {string} oldValues.hash The old hash value
 * @param {string} oldValues.href The full href of the old location
 * @param {string} oldValues.pathname The old pathname
 * @param {string} oldValues.search The old location's search value
 * @param {Object} newValues The new location value
 * @param {string} newValues.hash The new hash value
 * @param {string} newValues.href The full href of the new location
 * @param {string} newValues.pathname The new pathname
 * @param {string} newValues.search The new location's search value
 * @param {string[]} changedProperties The names of the properties which have changed
 * @returns {undefined}
 */

/**
 * This function takes a callback function which will be run whenever the
 * location next changes. An options object can be supplied to refine when that
 * occurs.
 *
 * Each time this function is called, a new listener will be added, even
 * if the callback function is the same.
 *
 * @param {listenCallback} callback The callback to run when the location changes
 * @param {Object} [options] Optional object defining when the listener function should be called
 * @param {boolean} [options.ignoreHashChange] Do not fire on hash changes
 * @param {boolean} [options.ignorePathChang] Do not fire on path changes
 * @param {boolean} [options.ignoreSearchChange] Do not fire on search changes
 * @param {boolean} [options.immediatelySendValues] Immediately send current values to callback
 * @returns {function(): void} An unsubscribe function
 */
export const listenToLocation: ListenFunction = (callback, options = {}) => {
  if (window[LOCATION_LISTENER_SCOPE] === undefined) {
    window[LOCATION_LISTENER_SCOPE] = new Listener();
  }

  const listener = window[LOCATION_LISTENER_SCOPE];
  if (!listener) {
    // This should not happen, given we've just set it above
    throw new Error('Unable to find listener instance!');
  }

  return listener.subscribe(callback, options);
};
