import { Timestamp } from 'firebase/firestore';
import { Profile } from '_types/Profile';

export const somProfile: Profile = {
  displayName: 'soM',
  bio: 'Young guy trying to make a name for himself in web3',
  dateCreated: Timestamp.now(),
  dateLastUpdated: Timestamp.now(),
  discordUsername: 'soM#3041',
  twitterHandle: '@somkoda',
  id: 'soM',
  lookingForProject: false,
  profilePicture: 'assets/somkoda.png',
  tags: ['Full-Stack Dev', 'Blockchain Dev', 'Collab Management'],
};

export const richProfile: Profile = {
  displayName: 'richpepsi',
  bio: 'Software Engineer, Web 3 Enthusiast',
  dateCreated: Timestamp.now(),
  dateLastUpdated: Timestamp.now(),
  discordUsername: 'richpepsi#0335',
  twitterHandle: '@richpepsi_',
  skills: ['Full-Stack Web Dev'],
  id: 'richpepsi',
  lookingForProject: false,
  profilePicture: 'fd',
};
