import { Tags } from 'types/Tags';
import { Timestamp } from 'firebase/firestore';
import { Languages } from 'types/Languages';

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
  lookingForWork: boolean;
  tags: Tags[];
  skills: string[];
  experience?: {
    startDate: string;
    endDate: string;
    title: string;
    description: string;
  }[];
  languages?: Languages[];
  connections?: string;
  relevantLinks?: { title: string; link: string }[];
};
