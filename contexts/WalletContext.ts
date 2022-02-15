import { createContext } from 'react';
import { WalletData } from 'types/WalletData';

export const WalletContext = createContext<WalletData | undefined>(undefined);
