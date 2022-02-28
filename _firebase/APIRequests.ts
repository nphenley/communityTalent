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
} from 'firebase/firestore';
import { Project } from '_types/Project';
import { Profile } from '_types/Profile';

const projectsCollectionRef = collection(firestore, 'projects');
const pinsCollectionRef = collection(firestore, 'pins');
const profileCollectionRef = collection(firestore, 'profiles');
const solNftTokenAddressesCollectionRef = collection(
  firestore,
  'solNftTokenAddresses'
);
const pinnedCommunitiesCollectionRef = collection(
  firestore,
  'pinnedCommunities'
);
const projectCollectionRef = collection(firestore, 'projects');

// ============== PROFILE ==============

export const createProfile = async (profileData: Partial<Profile>) => {
  addDoc(profileCollectionRef, {
    ...profileData,
    dateCreated: Timestamp.now(),
    dateLastUpdated: Timestamp.now(),
  });
};

export const updateProfile = async (
  profileId: string,
  data: Partial<Profile>
) => {
  const docRef = await updateDoc(doc(profileCollectionRef, profileId), {
    ...data,
    dateLastUpdated: Timestamp.now(),
  });
  return docRef;
};

export const subscribeToProfile = (
  communityId: string,
  walletAddress: string,
  updateProfile: any
) => {
  return onSnapshot(
    query(
      profileCollectionRef,
      where('walletAddress', '==', walletAddress),
      where('communityId', '==', communityId)
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
    query(profileCollectionRef, where('communityId', '==', communityId))
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

export const checkForExistingProfile = async (
  walletAddress: string,
  setExistingProfile: any
) => {
  const userProfiles = await getDocs(
    query(
      profileCollectionRef,
      where('walletAddress', '==', walletAddress),
      orderBy('dateLastUpdated', 'desc')
    )
  );
  const profile = userProfiles.docs.length
    ? { ...userProfiles.docs[0].data() }
    : undefined;
  setExistingProfile(profile);
};

export const importProfile = (
  communityId: string,
  existingProfile: Profile
) => {
  addDoc(profileCollectionRef, {
    ...existingProfile,
    communityId: communityId,
    dateCreated: Timestamp.now(),
    dateLastUpdated: Timestamp.now(),
  });
};

// ============== PROJECTS ==============

export const createProject = (project: Project) => {
  addDoc(projectCollectionRef, {
    ...project,
    dateCreated: Timestamp.now(),
    dateLastUpdated: Timestamp.now(),
  });
};

export const updateProject = async (
  projectId: string,
  data: Partial<Project>
) => {
  const docRef = await updateDoc(doc(projectCollectionRef, projectId), {
    ...data,
    dateLastUpdated: Timestamp.now(),
  });
  return docRef;
};

export const getProjects = async (setProjects: any) => {
  const data = await getDocs(
    query(projectsCollectionRef, orderBy('dateCreated', 'desc'))
  );
  setProjects(
    data.docs.map(
      (doc) =>
        ({
          ...doc.data(),
          id: doc.id,
        } as Project)
    )
  );
};

export const getPins = async (walletAddress: string, setPins: any) => {
  const userPins = await getDocs(
    query(pinsCollectionRef, where('user', '==', walletAddress))
  );
  let pins: string[] = [];
  userPins.docs.map((doc) => pins.push(doc.data().project));
  setPins(pins);
};

// TODO:
// Atm only increments, otherwise toggle pinned
export const togglePinned = async (projectId: string) => {
  updateDoc(doc(projectsCollectionRef, projectId), {
    numberOfPins: increment(1),
  });
};

// ==================== SOLANA NFTS ====================

export const getSolNftCommunity = async (tokenAddress: string) => {
  const document = await getDoc(
    doc(solNftTokenAddressesCollectionRef, tokenAddress)
  );
  return document.exists()
    ? {
        id: document.data().communityId,
        name: document.data().communityName,
      }
    : undefined;
};

// ==================== COMMUNITY PINS ====================

export const isCommunityPinned = async (
  walletAddress: string,
  communityId: string
) => {
  const concatString = walletAddress + '_' + communityId;
  const community = await getDoc(
    doc(pinnedCommunitiesCollectionRef, concatString)
  );
  return community.exists();
};

export const unpinCommunity = async (
  walletAddress: string,
  communityId: string,
  findUserCommunities: any
) => {
  const concatString = walletAddress + '_' + communityId;
  await deleteDoc(doc(pinnedCommunitiesCollectionRef, concatString));
  findUserCommunities();
};

export const pinCommunity = async (
  walletAddress: string,
  communityId: string,
  findUserCommunities: any
) => {
  const concatString = walletAddress + '_' + communityId;
  await setDoc(doc(pinnedCommunitiesCollectionRef, concatString), {});
  findUserCommunities();
};
