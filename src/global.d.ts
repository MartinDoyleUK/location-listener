/* eslint-disable canonical/filename-match-regex */
import type { Listener } from './listener/listener';

declare global {
  interface Window {
    'c200be36-ba69-4d33-8448-8971535ce107': Listener;
  }
}
