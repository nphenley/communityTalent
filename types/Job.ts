import { Timestamp } from 'firebase/firestore';

export type Job = {
  id: string;
  description: string;
  tags: string[];
  title: string;
  authors: string[];
  dateCreated: Timestamp;
  numberOfPins: number;
};
