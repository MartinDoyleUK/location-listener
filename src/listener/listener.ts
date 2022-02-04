import type {
  LocationValues,
  CallbackFn,
  UnsubscribeFn,
  ListenOptions,
} from './types';

import { LISTEN_INTERVAL_MS } from './constants';

interface Subscription {
  callback: CallbackFn;
  options: ListenOptions;
}

const getLocValues = (loc: Location): LocationValues => {
  const { hash, href, pathname, search } = loc;
  return { hash, href, pathname, search };
};

export class Listener {
  private readonly subscribers = new Map<number, Subscription>();

  private isListening = false;

  private interval = 0;

  private lastLocValues: LocationValues;

  public constructor() {
    this.lastLocValues = getLocValues(window.location);
  }

  private checkForChanges() {
    const newLocValues = getLocValues(window.location);
    if (newLocValues.href !== this.lastLocValues.href) {
      this.notifySubscribers(this.lastLocValues, newLocValues);
      // Avoiding mutation bugs
      this.lastLocValues = { ...newLocValues };
    }
  }

  private notifySubscribers(
    oldValue: LocationValues,
    newValue: LocationValues,
  ) {
    const isHashChanged = oldValue.hash !== newValue.hash;
    const isSearchChanged = oldValue.search !== newValue.search;
    const isPathChanged = oldValue.pathname !== newValue.pathname;

    for (const subscription of this.subscribers.values()) {
      const { callback, options } = subscription;

      const shouldNotify =
        (isHashChanged && !options.ignoreHashChange) ||
        (isSearchChanged && !options.ignoreSearchChange) ||
        (isPathChanged && !options.ignorePathChange);

      if (shouldNotify) {
        // Fire-and-forget the callbacks, to avoid them blocking the loop
        window.setTimeout(() => {
          try {
            // eslint-disable-next-line node/callback-return, node/no-callback-literal
            callback({ newValue, oldValue });
          } catch (error) {
            console.error(
              'Error occurred while running callback on location change',
              {
                newValue,
                oldValue,
              },
              error,
            );
          }
        });
      }
    }
  }

  private startListening() {
    if (!this.isListening) {
      this.interval = window.setInterval(() => {
        this.checkForChanges();
      }, LISTEN_INTERVAL_MS);
    }
  }

  private stopListening() {
    window.clearInterval(this.interval);
    this.isListening = false;
  }

  private unsubscribe(subscriberKey: number) {
    this.subscribers.delete(subscriberKey);
    if (this.subscribers.size === 0) {
      this.stopListening();
    }
  }

  public subscribe(
    callback: CallbackFn,
    options: ListenOptions,
  ): UnsubscribeFn {
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
      callback({ newValue: this.lastLocValues });
    }

    this.startListening();

    return () => {
      this.unsubscribe(subscriberKey);
    };
  }
}
