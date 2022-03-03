import { firestore } from '_firebase/config';
import {
  addDoc,
  collection,
  Timestamp,
  getDocs,
  query,
  getDoc,
  orderBy,
  where,
  doc,
  updateDoc,
  increment,
  onSnapshot,
  deleteDoc,
  setDoc,
  arrayRemove,
  arrayUnion,
} from 'firebase/firestore';
import { Project } from '_types/Project';
import { Profile } from '_types/Profile';
import { Community } from '_types/Community';

// ============== WALLET ==============

export const getWallet = async (walletAddress: string) => {
  const wallet = await getDoc(doc(firestore, 'wallets', walletAddress));
  if (!wallet.exists()) setDoc(doc(firestore, 'wallets', walletAddress), {});
  return wallet.data();
};

// ============== PROFILE ==============

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

export const updateProfile = async (
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

// TODO:
// Existing Profile requires a main profile to be made outside a community.
export const checkForExistingProfile = async (
  walletAddress: string,
  setExistingProfile: any
) => {
  // const userProfiles = await getDocs(
  //   query(
  //     collection(firestore, 'communities', communityId, 'profiles')
  //     where('walletAddress', '==', walletAddress),
  //     orderBy('dateLastUpdated', 'desc')
  //   )
  // );
  // const profile = userProfiles.docs.length
  //   ? { ...userProfiles.docs[0].data() }
  //   : undefined;
  // setExistingProfile(profile);
  setExistingProfile(undefined);
};

export const importProfile = async (
  communityId: string,
  existingProfile: Profile
) => {
  return addDoc(collection(firestore, 'communities', communityId, 'profiles'), {
    ...existingProfile,
    dateCreated: Timestamp.now(),
    dateLastUpdated: Timestamp.now(),
  });
};

// ============== PROJECTS ==============

export const createProject = async (communityId: string, project: Project) => {
  return addDoc(collection(firestore, 'communities', communityId, 'projects'), {
    ...project,
    dateCreated: Timestamp.now(),
    dateLastUpdated: Timestamp.now(),
  });
};

export const updateProject = async (
  communityId: string,
  projectId: string,
  data: Partial<Project>
) => {
  return updateDoc(
    doc(
      collection(firestore, 'communities', communityId, 'projects'),
      projectId
    ),
    { ...data, dateLastUpdated: Timestamp.now() }
  );
};

export const getProjects = async (communityId: string, setProjects: any) => {
  const data = await getDocs(
    query(
      collection(firestore, 'communities', communityId, 'projects'),
      orderBy('dateCreated', 'desc')
    )
  );
  setProjects(
    data.docs.map((doc) => ({ ...doc.data(), id: doc.id } as Project))
  );
};

// ==================== SOLANA NFTS ====================

export const getSolNftCommunity = async (tokenAddress: string) => {
  const document = await getDoc(doc(firestore, 'tokenAddresses', tokenAddress));
  return document.exists()
    ? {
        id: document.data().communityId,
        name: document.data().communityName,
      }
    : undefined;
};

// ==================== COMMUNITY PINS ====================

export const unpinCommunity = async (
  walletAddress: string,
  communityId: string,
  getCommunities: any
) => {
  await updateDoc(doc(firestore, 'wallets', walletAddress), {
    pinnedCommunities: arrayRemove(communityId),
  });
  getCommunities();
};

export const pinCommunity = async (
  walletAddress: string,
  communityId: string,
  getCommunities: any
) => {
  await updateDoc(doc(firestore, 'wallets', walletAddress), {
    pinnedCommunities: arrayUnion(communityId),
  });
  getCommunities();
};

// TODO:
// Figure out Pinned Communities system
// When you first connect, if no wallet doc exists create it
// when you pin a community, if no pinnedCommunities array create it
export const getPinnedCommunities = async (walletAddress: string) => {
  let pinnedCommunities: Community[] = [];

  return pinnedCommunities;
};
