import { Timestamp } from 'firebase/firestore';
import { Wallet } from 'types/ConnectionData';

export type Job = {
  id: string;
  description: string;
  tags: string[];
  title: string;
  authors: string[];
  dateCreated: Timestamp;
  numberOfPins: number;
};
