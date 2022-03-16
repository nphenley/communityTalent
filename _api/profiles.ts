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
  addDoc,
  deleteDoc,
} from 'firebase/firestore';
import { Profile } from '_types/Profile';

export const createProfile = async (
  communityId: string,
  profileData: Profile
) => {
  setDoc(
    doc(
      firestore,
      'communities',
      communityId,
      'profiles',
      profileData.walletAddress
    ),
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

export const subscribeToProfile = (
  communityId: string,
  walletAddress: string,
  updateProfile: any
) => {
  return onSnapshot(
    doc(firestore, 'communities', communityId, 'profiles', walletAddress),

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

export const updateDefaultProfile = async (
  walletAddress: string,
  defaultProfile: Partial<Profile>
) => {
  const updated = await updateDoc(
    doc(firestore, 'defaultProfiles', walletAddress),
    {
      ...defaultProfile,
      dateLastUpdated: Timestamp.now(),
      walletAddress: walletAddress,
    }
  );
  return updated;
};

export const importDefaultProfileToCommunity = async (
  walletAddress: string,
  communityId: string,
  defaultProfile: Profile
) => {
  return setDoc(
    doc(firestore, 'communities', communityId, 'profiles', walletAddress),
    {
      ...defaultProfile,
      dateCreated: Timestamp.now(),
      dateLastUpdated: Timestamp.now(),
      walletAddress: walletAddress,
    }
  );
};

export const checkForExistingDefaultProfile = async (
  walletAddress: string,
  linkedWallets: string[]
) => {
  const defaultProfile = await getDoc(
    doc(firestore, 'defaultProfiles', walletAddress)
  );
  let isExistingLinkedDefaultProfile = false;
  if (!defaultProfile.exists()) {
    await Promise.all(
      linkedWallets.map(async (wallet) => {
        if (wallet !== walletAddress) {
          const linkedDefaultProfile = await getDoc(
            doc(firestore, 'defaultProfiles', wallet)
          );
          if (linkedDefaultProfile.exists() && linkedDefaultProfile.data()) {
            isExistingLinkedDefaultProfile = true;
            await setDoc(defaultProfile.ref, linkedDefaultProfile.data());
            //if there are several existing ones they get overwritten.
            //guess we could decide which ones has priority based on Timestamp
          }
        }
      })
    );
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
        setExistingDefaultProfile(snapshot.data());
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

export const checkForCommunityProfileInLinkedWallets = async (
  walletAddress: string,
  linkedWallets: string[],
  communityId: string
) => {
  const walletProfileInCommunity = await getDoc(
    doc(firestore, 'communities', communityId, 'profiles', walletAddress)
  );
  if (!walletProfileInCommunity.exists()) {
    linkedWallets.forEach(async (wallet) => {
      if (wallet !== walletAddress) {
        // prob worth removing from array before
        const linkedWalletProfileInCommunity = await getDoc(
          doc(firestore, 'communities', communityId, 'profiles', wallet)
        );
        if (linkedWalletProfileInCommunity.exists()) {
          await setDoc(walletProfileInCommunity.ref, {
            id: walletAddress,
            ...linkedWalletProfileInCommunity.data(),
            walletAddress: walletAddress,
          });
        }
        await deleteDoc(linkedWalletProfileInCommunity.ref);
      }
    });
  }
};
