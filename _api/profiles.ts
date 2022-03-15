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
  arrayUnion,
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
  return setDoc(
    doc(
      firestore,
      'communities',
      communityId,
      'profiles',
      defaultProfile.walletAddress
    ),
    {
      ...defaultProfile,
      dateCreated: Timestamp.now(),
      dateLastUpdated: Timestamp.now(),
    }
  );
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

export const sendLinkRequest = async (
  walletAddress: string,
  requestedWalletAddresses: string[]
) => {
  requestedWalletAddresses.forEach(async (requestedWalletAddress) => {
    if (requestedWalletAddress.startsWith('0x'))
      requestedWalletAddress = requestedWalletAddress.toLowerCase();
    const checkIfRequestAlreadyExists = await getDocs(
      query(
        collection(firestore, 'linkWalletRequests'),
        where('sender', '==', walletAddress),
        where('receiver', '==', requestedWalletAddress)
      )
    );
    if (checkIfRequestAlreadyExists.empty) {
      addDoc(collection(firestore, 'linkWalletRequests'), {
        sender: walletAddress,
        receiver: requestedWalletAddress,
      });
    }
  });
};

export const getLinkRequestsForWallet = async (
  walletAddress: string,
  setReceivedRequests: any
) => {
  const requests = await getDocs(
    query(
      collection(firestore, 'linkWalletRequests'),
      where('receiver', '==', walletAddress)
    )
  );
  let received: string[] = [];
  requests.forEach((request) => {
    received.push(request.data().sender);
  });
  setReceivedRequests(received);
};

export const linkWallets = async (
  userAddress: string,
  walletUserIsLinkingTo: string,
  setReceivedRequests: any
) => {
  const userLinkedWalletsDoc = await getDocs(
    query(
      collection(firestore, 'linkedWallets'),
      where('wallets', 'array-contains-any', [
        userAddress,
        walletUserIsLinkingTo,
      ])
    )
  );
  if (userLinkedWalletsDoc.empty) {
    addDoc(collection(firestore, 'linkedWallets'), {
      wallets: [userAddress, walletUserIsLinkingTo],
    });
  } else {
    const userLinkedWalletsArray = userLinkedWalletsDoc.docs[0].data().wallets;
    if (!userLinkedWalletsArray.includes(userAddress))
      userLinkedWalletsArray.push(userAddress);
    else if (!userLinkedWalletsArray.includes(walletUserIsLinkingTo))
      userLinkedWalletsArray.push(walletUserIsLinkingTo);
    updateDoc(userLinkedWalletsDoc.docs[0].ref, {
      wallets: userLinkedWalletsArray,
    });
  }
  await removeLinkRequests(
    userAddress,
    walletUserIsLinkingTo,
    setReceivedRequests
  );
};

export const removeLinkRequests = async (
  userAddress: string,
  walletUserIsLinkingTo: string,
  setReceivedRequests: any
) => {
  const requests = await getDocs(
    query(
      collection(firestore, 'linkWalletRequests'),
      where('receiver', '==', userAddress),
      where('sender', '==', walletUserIsLinkingTo)
    )
  );
  await deleteDoc(requests.docs[0].ref);
  getLinkRequestsForWallet(userAddress, setReceivedRequests);
};
