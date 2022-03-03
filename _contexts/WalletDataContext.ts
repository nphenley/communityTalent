import { createContext } from 'react';
import { WalletData } from '_types/WalletData';

export const WalletDataContext = createContext<WalletData | undefined>(
  undefined
);
