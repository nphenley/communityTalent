import { Timestamp } from 'firebase/firestore';
import { Wallet } from 'types/ConnectionData';

export type Profile = {
  dateCreated?: Timestamp;
  experience: string;
  languages: string;
  walletAddresses: Wallet[];
  connections: string;
  lookingForWork: boolean;
};
