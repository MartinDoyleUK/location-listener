export interface LocationValues {
  hash: string;
  href: string;
  pathname: string;
  search: string;
}

export type ChangedProperties = (keyof LocationValues)[];

export type CallbackFunction = (values: {
  changedProperties: ChangedProperties;
  newValues: LocationValues;
  oldValues: LocationValues;
}) => void;

export type UnsubscribeFunction = () => void;

export interface ListenOptions {
  ignoreHashChange?: boolean;
  ignorePathnameChange?: boolean;
  ignoreSearchChange?: boolean;
  immediatelySendValues?: boolean;
}
