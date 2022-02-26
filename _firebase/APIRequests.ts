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
} from 'firebase/firestore';
import { Project } from '_types/Project';
import { Profile } from '_types/Profile';
import { Community } from '_types/Community';

const projectsCollectionRef = collection(firestore, 'projects');
const pinsCollectionRef = collection(firestore, 'pins');
const profileCollectionRef = collection(firestore, 'profiles');
const solNftTokenAddressesCollectionRef = collection(
  firestore,
  'solNftTokenAddresses'
);
const solNftCommunitiesCollectionRef = collection(
  firestore,
  'solNftCommunities'
);

// ============== PROFILE ==============

export const createProfile = async (profileData: Partial<Profile>) => {
  addDoc(collection(firestore, 'profiles'), {
    ...profileData,
    dateCreated: Timestamp.now(),
    dateLastUpdated: Timestamp.now(),
  });
};

export const updateProfile = async (
  profileId: string,
  data: Partial<Profile>
) => {
  const docRef = await updateDoc(doc(firestore, 'profiles', profileId), {
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

export const checkForProfile = async (
  walletAddress: string,
  setOldProfile: any
) => {
  const userProfiles = await getDocs(
    query(profileCollectionRef, where('walletAddress', '==', walletAddress))
  );
  const profile = userProfiles.docs.length
    ? { ...userProfiles.docs[0].data() }
    : undefined;
  console.log(profile);
  setOldProfile(profile);
};

// ============== PROJECTS ==============

export const createProject = (project: Project) => {
  addDoc(collection(firestore, 'projects'), {
    ...project,
    dateCreated: Timestamp.now(),
    dateLastUpdated: Timestamp.now(),
  });
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

export const checkMatches = async (
  userNfts: { tokenAddress: string; image: string }[],
  updateData: any
) => {
  let list: Community[] = [];

  await Promise.all(
    userNfts.map(async (nft) => {
      const match = await getDoc(
        doc(solNftTokenAddressesCollectionRef, nft.tokenAddress)
      );
      if (!match.exists()) return;
      const communityId = match.data()!.communityId;
      const community = await getDoc(
        doc(solNftCommunitiesCollectionRef, communityId)
      );
      list.push({
        id: communityId,
        name: community.data()!.name,
        image: nft.image,
      });
    })
  );
  updateData(list);
};

export const checkMatchForCommunity = async (
  userNfts: { tokenAddress: string; image: string }[],
  communityId: string,
  updateHasRequiredNft: any
) => {
  let hasRequiredNft = false;
  await Promise.all(
    userNfts.map(async (nft) => {
      const match = await getDoc(
        doc(solNftTokenAddressesCollectionRef, nft.tokenAddress)
      );
      if (match.exists() && match.data().communityId === communityId) {
        hasRequiredNft = true;
      }
    })
  );
  updateHasRequiredNft(hasRequiredNft);
};
