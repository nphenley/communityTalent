import { Timestamp } from 'firebase/firestore';

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
  profilePic?: string;
  tags?: string[];
  skills?: string[];
  experience?: string;
  languages?: string[];
  timezone?: string;
  contacts?: string;
  relevantLinks?: string[];
  votes?: [{ walletAddress: string; type: 'up' | 'down' }];
};
