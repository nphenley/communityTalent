import { createContext } from 'react';
import { ConnectionData } from '_types/ConnectionData';

export const ConnectionContext = createContext<ConnectionData | undefined>(
  undefined
);
