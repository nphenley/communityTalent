import { Timestamp } from 'firebase/firestore';

export type Job = {
  id: string;
  description: string;
  tags: boolean[];
  title: string;
  user: string;
  dateCreated: Timestamp;
  numberOfPins: number;
};
