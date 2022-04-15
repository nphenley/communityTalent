import { Timestamp } from 'firebase/firestore';

export type Project = {
  id: string;
  walletGroupID: string;
  dateCreated: Timestamp;
  dateLastUpdated: Timestamp;
  creatorDisplayName: string;
  role: string;
  description: string;
  skills: string[];
  languages: string[];
  discordContact: string;
  twitterContact: string;
  isAdminProject: boolean;
};
