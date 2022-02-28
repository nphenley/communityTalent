import { Timestamp } from 'firebase/firestore';

export type Project = {
  id: string;
  description: string;
  tags: string[];
  title: string;
  authorAddresses: string[];
  authorDisplayNames: string[];
  dateCreated: Timestamp;
  numberOfPins: number;
  numberOfSkulls: number;
};
