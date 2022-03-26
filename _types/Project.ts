import { Timestamp } from 'firebase/firestore';

export type Project = {
  id: string;
  dateCreated: Timestamp;
  title: string;
  description: string;
  tags: string[];
  walletGroupID: string;
  votes?: [{ walletGroupID: string; type: 'up' | 'down' }];
};
