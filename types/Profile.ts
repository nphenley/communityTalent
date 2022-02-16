import { Timestamp } from 'firebase/firestore';
import { Wallet } from 'types/ConnectionData';

export type Profile = {
  communityId: string;
  dateCreated?: Timestamp;
  experience: string;
  languages: string;
  walletAddresses: Wallet[];
  connections: string;
  lookingForWork: boolean;
};
