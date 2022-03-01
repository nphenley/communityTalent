import { Tags } from '_enums/Tags';
import { Timestamp } from 'firebase/firestore';
import { Languages } from '_enums/Languages';

export type Profile = {
  id: string;
  dateCreated: Timestamp;
  dateLastUpdated: Timestamp;
  walletAddress: string;
  displayName: string;
  twitterHandle?: string;
  discordUsername?: string;
  bio: string;
  lookingForProject: boolean;
  tags: Tags[];
  skills?: [];
  experience?: string;
  languages?: Languages[];
  contacts?: string;
  relevantLinks?: string[];
  votes?: [{ walletAddress: string; type: 'up' | 'down' }];
};
