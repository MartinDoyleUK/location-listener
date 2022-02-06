/**
 * This scope, derived from the library name, should ensure only a single
 * listener instance will ever be created.
 *
 * NOTE: This scope string is also to be found in the global.d.ts file
 */
export const LOCATION_LISTENER_SCOPE = 'martindoyleuk-location-listener';

/**
 * The timeout between each check of the location value. This should be fast
 * enough to be responsive to a user, without being a noticeable drain on the
 * browser.
 */
export const LISTEN_TIMEOUT_MS = 50;
