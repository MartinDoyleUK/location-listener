# Location Listener

## Table of contents

- [Purpose](#purpose)
- [Installation](#installation)
- [Typescript support](#typescript-support)
- [Basic usage](#basic-usage)
  - [Vanilla `listenToLocation` function](#listen-to-location-function)
  - [`useLocationListener` React hook](#use-location-listener-hook)
- [API](#api)
  - [`listenToLocation(callback, [options]) => unsubscribe`](#api-listen-to-location)
  - [`useLocationListener([options]) => locationData`](#api-use-location-listener)
- [FAQs](#faqs)

## Purpose <a name="purpose"></a>

This package has been created to cope with the fact that there's no native way in JavaScript of listening to [window.location](https://developer.mozilla.org/en-US/docs/Web/API/Window/location) changes. There is the [hashchange event](https://developer.mozilla.org/en-US/docs/Web/API/Window/hashchange_event) and even the [popstate event](https://developer.mozilla.org/en-US/docs/Web/API/Window/popstate_event), but the former listens only to the hash and the latter only works when using the history (i.e. going backwards or forwards). There are alternatives available in most routing packages (e.g. [React Router](https://reactrouter.com/)), however this may often be too heavyweight, and/or the functionality may be required in a place that makes calling these packages impractical.

The intention with this particular library is to give a simple, fast way of listening to location changes with as few dependencies as possible (hopefully none).

## Installation <a name="installation"></a>

Install the dependency with one of the following commands:

```sh
yarn add @martindoyleuk/location-listener
```

```sh
npm install @martindoyleuk/location-listener
```

## Typescript support <a name="typescript-support"></a>

All code is written in Typescript and all types are exposed in the main library.

## Basic usage <a name="basic-usage"></a>

### Using the vanilla `listenToLocation` function <a name="listen-to-location-function"></a>

```ts
import { listenToLocation } from '@martindoyleuk/location-listener';

const unsubscribe = listenToLocation(
  ({ oldValues, newValues, changedProperties }) => {
    console.log(`Changed properties were "${changedProperties.join('", "')}"`);
    console.log('Old location values:', oldValues);
    console.log('New location values:', newValues);
  },
);

unsubscribe();
```

### Using the `useLocationListener` React hook <a name="use-location-listener-hook"></a>

```tsx
import { useLocationListener } from '@martindoyleuk/location-listener';
import React, { useEffect } from 'react';

export const MyComponent = () => {
  const { hash, search, pathname } = useLocationListener();

  useEffect(() => {
    console.log(`Current location hash value is ${hash}`);
    console.log(`Current location search value is ${search}`);
    console.log(`Current location pathname value is ${pathname}`);
  }, [hash, search, pathname]);
};
```

## API <a name="api"></a>

### `listenToLocation(callback, [options]) => unsubscribe` <a name="api-listen-to-location"></a>

- **`callback ({ oldValues, newValues, changedProperties }) => void`** The listener callback function
  - **`"oldValues" { href, search, hash, pathname }`** The previous location values
    - **`"href" string`** The `location.href` value from the previous location
    - **`"search" string`** The `location.search` value from the previous location
    - **`"hash" string`** The `location.hash` value from the previous location
    - **`"pathname" string`** The `location.pathname` value from the previous location
  - **`"newValues" { href, search, hash, pathname }`** The new/current location values
    - **`"href" string`** The `location.href` value from the updated location
    - **`"search" string`** The `location.search` value from the updated location
    - **`"hash" string`** The `location.hash` value from the updated location
    - **`"pathname" string`** The `location.pathname` value from the updated location
  - **`"changedProperties" string[]`** The names of the properties that changed
- **`"options" { ignoreHashChange, ignorePathnameChange, ignoreSearchChange, immediatelySendValues }`** Optional options object
  - **`"ignoreHashChange" [boolean]`** Do not fire when only the `hash` property changed
  - **`"ignorePathnameChange" [boolean]`** Do not fire when only the `pathname` property changed
  - **`"ignoreSearchChange" [boolean]`** Do not fire when only the `search` property changed
  - **`"immediatelySendValues" [boolean]`** Immediately invoke the callback as soon as the listener is registered
- **`"unsubscribe" () => void`** Can be invoked to remove the listener and stop it being called when the location changes

### `useLocationListener([options]) => locationData` <a name="api-use-location-listener"></a>

- **`"options" { shouldLogChanges }`** Optional options object
  - **`"shouldLogChanges" [boolean]`** Whether to store location changes
  - **`"maxChanges" [number]`** Maximum number of changes to store (default `100`)
- **`"locationData" { hash, href, pathname, search, changes }`** The current location data, updated automatically
  - **`"hash" string`** The current value of the `location.hash` parameter
  - **`"href" string`** The current value of the `location.href` parameter
  - **`"pathname" string`** The current value of the `location.pathname` parameter
  - **`"search" string`** The current value of the `location.search` parameter
  - **`"changes" { datetime, href }[]`** Potentially useful for debugging purposes (only populated if `shouldLogChanges` option is specified, for performance reasons)
    - **`"datetime" string`** When this value was observed (ISO datetime format)
    - **`"href" string`** The `location.href` value at the time of the observation

## FAQs <a name="faqs"></a>

- **How does it work?**
  - Under the hood, there is a simple `window.setTimeout` call that (after `50ms`) checks the location object and then notifies all listeners if it changes. It then re-sets up the timeout again. Each callback is fired in the order it was added, and asynchronously via a call to `setTimeout` with a `0ms` delay.
- **Why `setTimeout` over `setInterval`?**
  - The initial concept was based on using `setInterval`, however there is a negligible risk with many listeners that they could overrun the specified interval. For this reason, it was decided to retrigger with another `50ms` delay after the previous batch of listeners' callbacks were fired. As an added bonus, if, for some reason, something were to fatally error inside the main thread, the `setTimeout` would never be called, protecting the browser from infinite calling of bad code.
- **What are the performance costs?**
  - Detailed performance analysis has not been run, however the code has been set up to ensure singleton usage of the package, meaning there will only ever be one listener on the page at once. The expected impact of a single `setTimeout` is expected to be negligible due to the way the event loop works, specifically that the interval function will not trigger while other work is ongoing.
- **Are there any further improvements planned?**
  - No. Issues and feature requests will always be considered, but at the moment this is considered feature-complete.
