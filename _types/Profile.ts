import { Timestamp } from 'firebase/firestore';

export type Profile = {
  id: string;
  dateCreated: Timestamp;
  dateLastUpdated: Timestamp;
  displayName: string;
  bio: string;
  lookingForProject: boolean;
  profilePicture?: string;
  twitterHandle?: string;
  discordUsername?: string;
  tags?: string[];
  skills?: string[];
  experience?: string;
  languages?: string[];
  timezone?: string;
  contacts?: string;
  relevantLinks?: string[];
  votes?: [{ walletGroupID: string; type: 'up' | 'down' }];
};
