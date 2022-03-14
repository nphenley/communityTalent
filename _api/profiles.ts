import { firestore } from '_firebase/config';
import {
  addDoc,
  collection,
  Timestamp,
  getDocs,
  query,
  getDoc,
  where,
  doc,
  updateDoc,
  onSnapshot,
  setDoc,
} from 'firebase/firestore';
import { Profile } from '_types/Profile';

export const createProfile = async (
  communityId: string,
  profileData: Profile
) => {
  addDoc(collection(firestore, 'communities', communityId, 'profiles'), {
    ...profileData,
    dateCreated: Timestamp.now(),
    dateLastUpdated: Timestamp.now(),
  });
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

export const subscribeToProfile = (
  communityId: string,
  walletAddress: string,
  updateProfile: any
) => {
  return onSnapshot(
    query(
      collection(firestore, 'communities', communityId, 'profiles'),
      where('walletAddress', '==', walletAddress)
    ),
    (snapshot) =>
      updateProfile(
        snapshot.docs.length
          ? { ...snapshot.docs[0].data(), id: snapshot.docs[0].id }
          : undefined
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

export const updateDefaultProfile = async (
  walletAddress: string,
  defaultProfile: Partial<Profile>
) => {
  const docRef = await updateDoc(
    doc(firestore, 'defaultProfiles', walletAddress),
    {
      defaultProfile: {
        ...defaultProfile,
        dateLastUpdated: Timestamp.now(),
        walletAddress: walletAddress,
      },
    }
  );
  return docRef;
};

export const importDefaultProfileToCommunity = async (
  communityId: string,
  defaultProfile: Profile
) => {
  return addDoc(collection(firestore, 'communities', communityId, 'profiles'), {
    ...defaultProfile,
    dateCreated: Timestamp.now(),
    dateLastUpdated: Timestamp.now(),
  });
};

export const checkForExistingDefaultProfile = async (
  walletAddress: string,
  setExistingDefaultProfile: any
) => {
  const defaultProfile = await getDoc(
    doc(firestore, 'defaultProfiles', walletAddress)
  );
  if (!defaultProfile.exists()) {
    setDoc(defaultProfile.ref, {});
  } else {
    setExistingDefaultProfile(defaultProfile.data().defaultProfile);
  }
};

export const subscribeToDefaultProfile = (
  walletAddress: string,
  setExistingDefaultProfile: any
) => {
  return onSnapshot(
    doc(firestore, 'defaultProfiles', walletAddress),
    (snapshot) => {
      if (!snapshot.exists()) {
        setDoc(snapshot.ref, {});
      } else {
        setExistingDefaultProfile(snapshot.data().defaultProfile);
      }
    }
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
