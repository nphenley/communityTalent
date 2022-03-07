import { createContext } from 'react';
import { Wallet } from '_types/Wallet';

export const WalletContext = createContext<Wallet | undefined>(undefined);
