import { Timestamp } from 'firebase/firestore';
import { Tags } from '_enums/Tags';

export type Project = {
  id: string;
  dateCreated: Timestamp;
  title: string;
  description: string;
  tags: Tags[];
  walletAddress: string;
  votes?: [{ walletAddress: string; type: 'up' | 'down' }];
};
