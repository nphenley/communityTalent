import { firestore } from '_firebase/config';
import {
  collection,
  Timestamp,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  onSnapshot,
  setDoc,
  deleteDoc,
} from 'firebase/firestore';
import { Profile } from '_types/Profile';

export const createProfile = async (
  walletGroupID: string,
  communityId: string,
  profileData: Profile
) => {
  setDoc(
    doc(firestore, 'communities', communityId, 'profiles', walletGroupID),
    {
      ...profileData,
      dateCreated: Timestamp.now(),
      dateLastUpdated: Timestamp.now(),
    }
  );
};

export const updateCommunityProfile = async (
  communityId: string,
  profileId: string,
  data: Partial<Profile>
) => {
  const docRef = await updateDoc(
    doc(firestore, 'communities', communityId, 'profiles', profileId),
    { ...data, dateLastUpdated: Timestamp.now() }
  );
  return docRef;
};

export const subscribeToCommunityProfile = (
  communityId: string,
  walletGroupID: string,
  updateProfile: any
) => {
  return onSnapshot(
    doc(firestore, 'communities', communityId, 'profiles', walletGroupID),

    (snapshot: any) =>
      updateProfile(
        snapshot.data() ? { ...snapshot.data(), id: snapshot.id } : undefined
      )
  );
};

export const getProfiles = async (communityId: string, updateProfiles: any) => {
  const data = await getDocs(
    collection(firestore, 'communities', communityId, 'profiles')
  );
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

export const getFormOptions = async (setSelectOptions: any) => {
  const languages = await getDoc(doc(firestore, 'selectOptions', 'languages'));
  const tags = await getDoc(doc(firestore, 'selectOptions', 'tags'));
  const timezones = await getDoc(doc(firestore, 'selectOptions', 'timezones'));

  const languageOptions = languages.data()!.array.map((key: string) => {
    return {
      label: key,
      value: key,
    };
  });
  const tagOptions = tags.data()!.array.map((key: string) => {
    return {
      label: key,
      value: key,
    };
  });
  const timezoneOptions = timezones.data()!.array.map((key: string) => {
    return {
      label: key,
      value: key,
    };
  });
  setSelectOptions({
    languages: languageOptions,
    tags: tagOptions,
    timezones: timezoneOptions,
  });
};

export const updateDefaultProfile = async (
  walletGroupID: string,
  defaultProfile: Partial<Profile>
) => {
  const updated = await updateDoc(
    doc(firestore, 'defaultProfiles', walletGroupID),
    {
      ...defaultProfile,
      dateLastUpdated: Timestamp.now(),
      walletGroupID: walletGroupID,
    }
  );
  return updated;
};

export const importDefaultProfileToCommunity = async (
  walletGroupID: string,
  communityId: string,
  defaultProfile: Profile
) => {
  return setDoc(
    doc(firestore, 'communities', communityId, 'profiles', walletGroupID),
    {
      ...defaultProfile,
      dateCreated: Timestamp.now(),
      dateLastUpdated: Timestamp.now(),
      walletGroupID: walletGroupID,
    }
  );
};

export const subscribeToDefaultProfile = (
  walletGroupID: string,
  setDefaultProfile: any
) => {
  return onSnapshot(
    doc(firestore, 'defaultProfiles', walletGroupID),
    (docSnap) => setDefaultProfile(docSnap.data())
  );
};
