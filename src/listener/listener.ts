import type {
  LocationValues,
  CallbackFunction,
  UnsubscribeFunction,
  ListenOptions,
  ChangedProperties,
} from '../types';

import { LISTEN_TIMEOUT_MS } from '../constants';
import { getLocationValues } from '../utils';

interface Subscription {
  callback: CallbackFunction;
  options: ListenOptions;
}

export class Listener {
  private readonly subscribers = new Map<number, Subscription>();

  private isListening = false;

  private timeout = 0;

  private lastLocValues: LocationValues;

  public constructor() {
    this.lastLocValues = getLocationValues();
  }

  private checkForChanges() {
    const newLocValues = getLocationValues();
    if (newLocValues.href !== this.lastLocValues.href) {
      this.notifySubscribers(this.lastLocValues, newLocValues);
      // Avoiding mutation bugs
      this.lastLocValues = { ...newLocValues };
    }

    // Setup the next check
    this.timeout = window.setTimeout(() => {
      this.checkForChanges();
    }, LISTEN_TIMEOUT_MS);
  }

  private notifySubscribers(
    oldValues: LocationValues,
    newValues: LocationValues,
  ) {
    const isHashChanged = oldValues.hash !== newValues.hash;
    const isSearchChanged = oldValues.search !== newValues.search;
    const isPathChanged = oldValues.pathname !== newValues.pathname;

    const changedProperties: ChangedProperties = ['href'];
    if (isHashChanged) {
      changedProperties.push('hash');
    }

    if (isSearchChanged) {
      changedProperties.push('search');
    }

    if (isPathChanged) {
      changedProperties.push('pathname');
    }

    for (const subscription of this.subscribers.values()) {
      const { callback, options } = subscription;

      const shouldNotify =
        (isHashChanged && !options.ignoreHashChange) ||
        (isSearchChanged && !options.ignoreSearchChange) ||
        (isPathChanged && !options.ignorePathnameChange);

      if (shouldNotify) {
        // Fire-and-forget the callbacks, to avoid them blocking the loop
        window.setTimeout(() => {
          try {
            // eslint-disable-next-line node/callback-return, node/no-callback-literal
            callback({ changedProperties, newValues, oldValues });
          } catch (error) {
            // We want to display a console error here
            // eslint-disable-next-line no-console
            console.error(
              'Error occurred while running callback on location change',
              {
                newValues,
                oldValues,
              },
              error,
            );
          }
        }, 0);
      }
    }
  }

  private startListening() {
    if (!this.isListening) {
      this.isListening = true;
      this.timeout = window.setTimeout(() => {
        this.checkForChanges();
      }, LISTEN_TIMEOUT_MS);
    }
  }

  private stopListening() {
    window.clearTimeout(this.timeout);
    this.isListening = false;
  }

  private unsubscribe(subscriberKey: number) {
    this.subscribers.delete(subscriberKey);
    if (this.subscribers.size === 0) {
      this.stopListening();
    }
  }

  public subscribe(
    callback: CallbackFunction,
    options: ListenOptions,
  ): UnsubscribeFunction {
    let subscriberKey = Date.now();
    while (this.subscribers.has(subscriberKey)) {
      subscriberKey = Date.now();
    }

    this.subscribers.set(subscriberKey, {
      callback,
      options,
    });

    if (options.immediatelySendValues) {
      // eslint-disable-next-line node/callback-return, node/no-callback-literal
      callback({
        changedProperties: ['hash', 'href', 'pathname', 'search'],
        newValues: this.lastLocValues,
        oldValues: this.lastLocValues,
      });
    }

    this.startListening();

    return () => {
      this.unsubscribe(subscriberKey);
    };
  }
}
