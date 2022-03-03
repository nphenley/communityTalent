import { Timestamp } from 'firebase/firestore';
import { Profile } from '_types/Profile';

export const somProfile: Profile = {
  displayName: 'soM',
  bio: 'test',
  dateCreated: Timestamp.now(),
  dateLastUpdated: Timestamp.now(),
  discordUsername: 'soM#3041',
  twitterHandle: 'somkoda',
  id: '0',
  walletAddress: 'somkoda.eth',
  lookingForProject: false,
};
export const richProfile: Profile = {
  displayName: 'richpepsi',
  bio: 'test',
  dateCreated: Timestamp.now(),
  dateLastUpdated: Timestamp.now(),
  discordUsername: 'richpepsi#0335',
  twitterHandle: 'richpepsi_',
  id: '0',
  walletAddress: 'richpepsi.eth',
  lookingForProject: false,
};
