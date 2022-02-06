/* eslint-disable canonical/filename-match-regex */
import type { Listener } from './listener/listener';

declare global {
  interface Window {
    'martindoyleuk-location-listener'?: Listener;
  }
}
