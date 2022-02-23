import { Timestamp } from 'firebase/firestore';

export type Project = {
  id: string;
  description: string;
  tags: string[];
  title: string;
  authors: string[];
  dateCreated: Timestamp;
  numberOfPins: number;
};
