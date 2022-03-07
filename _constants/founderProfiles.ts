import { Timestamp } from 'firebase/firestore';
import { Tags } from '_enums/Tags';
import { Profile } from '_types/Profile';

export const somProfile: Profile = {
  displayName: 'soM',
  bio: 'test',
  dateCreated: Timestamp.now(),
  dateLastUpdated: Timestamp.now(),
  discordUsername: 'soM#3041',
  twitterHandle: 'somkoda',
  id: 'soM',
  walletAddress: 'somkoda.eth',
  lookingForProject: false,
};

export const richProfile: Profile = {
  displayName: 'richpepsi',
  bio: 'Software Engineer, Web 3 Enthusiast',
  dateCreated: Timestamp.now(),
  dateLastUpdated: Timestamp.now(),
  discordUsername: 'richpepsi#0335',
  twitterHandle: 'richpepsi_',
  skills: ['Full-Stack Web Dev'],
  tags: [Tags.DEV, Tags.BACKEND_DEV, Tags.FRONTEND_DEV],
  id: 'richpepsi',
  walletAddress: 'richpepsi.eth',
  lookingForProject: false,
};
