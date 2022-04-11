import { Timestamp } from 'firebase/firestore';

export type Project = {
  id: string;
  dateCreated: Timestamp;
  title: string;
  displayName: string;
  description: string;
  tags: string[];
  walletGroupID: string;
  hiring: boolean;
  votes?: number;
  admin?: boolean;
};
