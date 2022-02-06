import type { CallbackFunction } from '../types';

import { useCallback, useEffect, useMemo, useState } from 'react';

import { listenToLocation } from '../listener';
import { getLocationValues } from '../utils';

interface UseLocationListenerOptions {
  maxChanges?: number;
  shouldLogChanges?: boolean;
}

interface ChangeEntry {
  datetime: string;
  href: string;
}

interface LocationData {
  changes: ChangeEntry[];
  hash: string;
  href: string;
  pathname: string;
  search: string;
}

type UseLocationListener = (
  options: UseLocationListenerOptions,
) => LocationData;

export const useLocationListener: UseLocationListener = ({
  shouldLogChanges = false,
  maxChanges = 100,
}) => {
  const [currentLocationValues, setCurrentLocationValues] = useState(
    getLocationValues(),
  );
  const [changes, setChanges] = useState<ChangeEntry[]>([]);
  const { hash, href, pathname, search } = useMemo(() => {
    return currentLocationValues;
  }, [currentLocationValues]);

  const logChange = useCallback(
    (latestHref: string) => {
      if (shouldLogChanges) {
        setChanges((currentChanges) => {
          const thisChange: ChangeEntry = {
            datetime: new Date().toISOString(),
            href: latestHref,
          };
          const newChanges = currentChanges.slice(0, maxChanges);
          newChanges.unshift(thisChange);
          return newChanges;
        });
      }
    },
    [shouldLogChanges, maxChanges],
  );

  const locationChangeHandler = useCallback<CallbackFunction>(
    ({ newValues }) => {
      logChange(newValues.href);
      setCurrentLocationValues(newValues);
    },
    [logChange],
  );

  useEffect(() => {
    const unsubscribe = listenToLocation(locationChangeHandler);

    return () => {
      unsubscribe();
    };
  }, [locationChangeHandler]);

  return { changes, hash, href, pathname, search };
};
