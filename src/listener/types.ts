export interface LocationValues {
  hash: string;
  href: string;
  pathname: string;
  search: string;
}

export type CallbackFn = (values: {
  newValue: LocationValues;
  oldValue?: LocationValues;
}) => void;

export type UnsubscribeFn = () => void;

export interface ListenOptions {
  ignoreHashChange?: boolean;
  ignorePathChange?: boolean;
  ignoreSearchChange?: boolean;
  immediatelySendValues?: boolean;
}

export type ListenFn = (
  callback: CallbackFn,
  options?: ListenOptions,
) => UnsubscribeFn;
