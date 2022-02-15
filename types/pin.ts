import { Timestamp } from 'firebase/firestore';

export type Job = {
  id: string;
  job: string;
  user: string;
};
