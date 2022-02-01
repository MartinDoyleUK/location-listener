export type ListenCallbackFn = (
  oldLocation: Location,
  newLocation: Location,
) => void;

export type UnsubscribeFn = () => void;

export type ListenFn = (cb: ListenCallbackFn) => UnsubscribeFn;
