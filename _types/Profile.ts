import { Tags } from '_enums/Tags';
import { Timestamp } from 'firebase/firestore';
import { Languages } from '_enums/Languages';

export type Profile = {
  id: string;
  dateCreated?: Timestamp;
  dateLastUpdated?: Timestamp;
  communityId: string;
  walletAddresses: string[];
  displayName: string;
  twitterName?: string;
  discordName?: string;
  bio: string;
  lookingForWork: boolean;
  tags: Tags[];
  skills?: [];
  experience?: string;
  languages?: Languages[];
  connections?: string;
  relevantLinks?: string[];
};
