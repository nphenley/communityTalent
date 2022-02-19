import { Tags } from 'types/Tags';
import { Timestamp } from 'firebase/firestore';

export type Profile = {
  id?: string;
  dateCreated?: Timestamp;
  dateLastUpdated?: Timestamp;
  communityId: string;
  walletAddresses: string[];
  displayName: string;
  twitterName?: string;
  discordName?: string;
  displayWallet?: string;
  bio: string;
  experience?: {
    startDate: string;
    endDate: string;
    title: string;
    description: string;
  }[];
  languages?: string;
  connections?: string;
  lookingForWork: boolean;
  relevantLinks?: string[];
  tags?: Tags[];
};
