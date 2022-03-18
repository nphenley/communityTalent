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

export const subscribeToCommunityProfile = (
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

export const subscribeToDefaultProfile = (
  walletAddress: string,
  setExistingDefaultProfile: any
) => {
  return onSnapshot(
    doc(firestore, 'defaultProfiles', walletAddress),
    (snapshot) => {
      if (!snapshot.exists()) {
        setDoc(snapshot.ref, { dateCreated: Timestamp.now() });
      } else {
        setExistingDefaultProfile(snapshot.data());
      }
    }
  );
};

export const checkForDefaultProfileInLinkedWallets = async (
  walletAddress: string,
  linkedWallets: string[]
) => {
  const defaultProfile = await getDoc(
    doc(firestore, 'defaultProfiles', walletAddress)
  );
  const linkedWalletsCopy = [...linkedWallets];
  const index = linkedWalletsCopy.indexOf(walletAddress);
  linkedWalletsCopy.splice(index, 1);
  if (
    !defaultProfile.exists() ||
    !defaultProfile.data() ||
    !defaultProfile.data().displayName
  ) {
    await Promise.all(
      linkedWalletsCopy.map(async (wallet) => {
        const linkedDefaultProfile = await getDoc(
          doc(firestore, 'defaultProfiles', wallet)
        );
        if (linkedDefaultProfile.exists() && linkedDefaultProfile.data()) {
          await setDoc(defaultProfile.ref, {
            ...linkedDefaultProfile.data(),
            dateCreated: Timestamp.now(),
            dateLastUpdated: Timestamp.now(),
            walletAddress: walletAddress,
          });
          //if there are several existing ones they get overwritten.
          //guess we could decide which ones has priority based on Timestamp
        } //We could set a bool that turns true if a linkedDefaultProfile is
        //found and push the refs to an array if we that's desirable.
      })
    );
  }
};

export const checkForCommunityProfileInLinkedWallets = async (
  walletAddress: string,
  linkedWallets: string[],
  communityId: string
) => {
  const walletProfileInCommunity = await getDoc(
    doc(firestore, 'communities', communityId, 'profiles', walletAddress)
  );
  const linkedWalletsCopy = [...linkedWallets];
  const index = linkedWalletsCopy.indexOf(walletAddress);

  linkedWalletsCopy.splice(index, 1);
  if (!walletProfileInCommunity.exists()) {
    linkedWalletsCopy.forEach(async (wallet) => {
      const linkedWalletProfileInCommunity = await getDoc(
        doc(firestore, 'communities', communityId, 'profiles', wallet)
      );
      if (linkedWalletProfileInCommunity.exists()) {
        await setDoc(walletProfileInCommunity.ref, {
          ...linkedWalletProfileInCommunity.data(),
          walletAddress: walletAddress, //could make this linkedWallets?
        });
      }
      await deleteDoc(linkedWalletProfileInCommunity.ref);
    });
  }
};
