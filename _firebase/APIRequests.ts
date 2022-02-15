import 'firebase/firestore';
import { Profile } from 'types/Profile';
import { addDoc, collection, Timestamp } from 'firebase/firestore';
import { db } from '_firebase/config';

export const createProfile = (profile: Profile) => {
  addDoc(collection(db, 'profiles'), {
    ...profile,
    dateCreated: Timestamp.now(),
    dateLastUpdated: Timestamp.now(),
  });
};
