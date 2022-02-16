import { createContext } from 'react';
import { ConnectionData } from 'types/ConnectionData';

export const ConnectionContext = createContext<ConnectionData | undefined>(
  undefined
);
