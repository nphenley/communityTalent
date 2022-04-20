import { Timestamp } from 'firebase/firestore';
import { Profile } from '_types/Profile';

export const somProfile: Profile = {
  displayName: 'soM',
  bio: 'test',
  dateCreated: Timestamp.now(),
  dateLastUpdated: Timestamp.now(),
  discordUsername: 'soM#3041',
  twitterHandle: '@somkoda',
  id: 'soM',
  lookingForProject: false,
  profilePicture: 'https://neotokyo.sfo3.cdn.digitaloceanspaces.com/citizen_images_png/77.png',
};

export const richProfile: Profile = {
  displayName: 'richpepsi',
  bio: 'Software Engineer - Web Dev Warlord\nTechnology Lead for The Chimpions on Solana',
  dateCreated: Timestamp.now(),
  dateLastUpdated: Timestamp.now(),
  discordUsername: 'richpepsi#0335',
  twitterHandle: '@richpepsi_',
  id: 'richpepsi',
  lookingForProject: false,
  tags: ['Full-Stack Dev', 'Blockchain Dev', 'UI/UX Design'],
  profilePicture: 'assets/richpepsi.gif',
};
