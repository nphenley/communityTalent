import { firestore } from '_firebase/config';
import { collection, Timestamp, getDocs, getDoc, doc, updateDoc, onSnapshot, setDoc, deleteDoc } from 'firebase/firestore';
import { Profile } from '_types/Profile';

export const createProfile = async (walletGroupID: string, communityId: string, profileData: Profile) => {
  setDoc(doc(firestore, 'communities', communityId, 'profiles', walletGroupID), {
    ...profileData,
    dateCreated: Timestamp.now(),
    dateLastUpdated: Timestamp.now(),
  });
};

export const updateCommunityProfile = async (communityId: string, profileId: string, data: Partial<Profile>) => {
  const docRef = await updateDoc(doc(firestore, 'communities', communityId, 'profiles', profileId), {
    ...data,
    dateLastUpdated: Timestamp.now(),
  });
  return docRef;
};

export const subscribeToCommunityProfile = (communityId: string, walletGroupID: string, updateProfile: any) => {
  return onSnapshot(
    doc(firestore, 'communities', communityId, 'profiles', walletGroupID),

    (snapshot: any) => updateProfile(snapshot.data() ? { ...snapshot.data(), id: snapshot.id } : undefined)
  );
};

export const getProfiles = async (communityId: string, updateProfiles: any) => {
  const data = await getDocs(collection(firestore, 'communities', communityId, 'profiles'));
  updateProfiles(
    data.docs.map(
      (doc) =>
        ({
          ...doc.data(),
          id: doc.id,
        } as Profile)
    )
  );
};

export const createOrUpdateDefaultProfile = async (walletGroupID: string, defaultProfile: Partial<Profile>) => {
  return setDoc(doc(firestore, 'defaultProfiles', walletGroupID), { ...defaultProfile, dateLastUpdated: Timestamp.now() }, { merge: true });
};

export const importDefaultProfileToCommunity = async (walletGroupID: string, communityId: string, defaultProfile: Profile) => {
  return setDoc(doc(firestore, 'communities', communityId, 'profiles', walletGroupID), {
    ...defaultProfile,
    dateCreated: Timestamp.now(),
    dateLastUpdated: Timestamp.now(),
    walletGroupID: walletGroupID,
  });
};

export const subscribeToDefaultProfile = (walletGroupID: string, setDefaultProfile: any) => {
  return onSnapshot(doc(firestore, 'defaultProfiles', walletGroupID), (docSnap) => setDefaultProfile(docSnap.data()));
};
