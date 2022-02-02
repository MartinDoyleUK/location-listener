/**
 * This arbitrarily generated GUID should ensure only a single listener instance
 * will ever be created.
 *
 * NOTE: This GUID is also to be found in the global.d.ts file
 */
export const LOCATION_LISTENER_GUID = 'c200be36-ba69-4d33-8448-8971535ce107';

/**
 * The interval between each check of the location value. This should be fast
 * enough to be responsive to a user, without being a noticeable drain on the
 * browser.
 */
export const LISTEN_INTERVAL_MS = 50;
